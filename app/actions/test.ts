"use server";

import { db } from "@/app/lib/db";


export async function getTestsForUserExam(userExamId: number) {
    try {
        // 🔥 1. Fetch roadmap
        const roadmap = await db.roadmap.findUnique({
            where: { user_exam_id: userExamId },
            include: {
                phases: {
                    orderBy: { order_index: "asc" },
                    include: {
                        weeks: {
                            orderBy: { order_index: "asc" },
                            include: {
                                tasks: true,
                            },
                        },
                    },
                },
                userExam: {
                    select: {
                        id: true,
                        exam: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    }
                }
            },
        });

        if (!roadmap) throw new Error("Roadmap not found");

        // 🔥 2. Fetch tests
        const tests = await db.test.findMany({
            where: { userExamId },
            include: {
                attempt: true,
            },
        });

        // console.log("Fetched tests:", { tests });

        if (tests.length === 0) {
            return {
                success: true,
                data: {
                    weekly: [],
                    phase: [],
                    final: [],
                    examName: roadmap.userExam.exam.name,
                },
            };
        }

        // helper
        // helper
        const isWeekCompleted = (week: any) =>
            week.tasks.length > 0 &&
            week.tasks.every((t: any) => t.is_completed);

        // helper
        const getStatus = ({
            isCompleted,
            isGenerated,
            isAttempted,
        }: {
            isCompleted: boolean;
            isGenerated?: boolean;
            isAttempted?: boolean;
        }) => {
            // highest priority
            if (isAttempted) {
                return "ATTEMPTED";
            }

            // tasks not completed yet
            if (!isCompleted) {
                return "LOCKED";
            }

            // completed but test not generated
            if (!isGenerated) {
                return "GENERATE";
            }

            // completed + generated
            return "GIVE";
        };

        const result: any = {
            weekly: [],
            phase: [],
            final: [],
        };

        // =========================
        // ✅ WEEKLY TESTS
        // =========================
        for (const phase of roadmap.phases) {
            for (const week of phase.weeks) {
                const test = tests.find(
                    (t) => t.weekId === week.id
                );

                const isCompleted = isWeekCompleted(week);

                const status = getStatus({
                    isCompleted,
                    isGenerated: test?.isGenerated,
                    isAttempted: !!test?.attempt,
                });

                result.weekly.push({
                    weekId: week.id,
                    title: test?.title || `Week ${week.week_number} Test`,
                    description: test?.description || week.focus,
                    testId: test?.id,
                    status,
                });
            }
        }

        // =========================
        // ✅ PHASE TESTS
        // =========================
        for (const phase of roadmap.phases) {
            const test = tests.find((t) => t.phaseId === phase.id);

            const isCompleted = phase.weeks.every((w) =>
                isWeekCompleted(w)
            );

            const status = getStatus({
                isCompleted,
                isGenerated: test?.isGenerated,
                isAttempted: !!test?.attempt,
            });

            result.phase.push({
                phaseId: phase.id,
                title: test?.title || `Phase ${phase.order_index + 1} Test`,
                description: test?.description || phase.phase_name,
                testId: test?.id,
                status,
            });
        }

        // =========================
        // ✅ FINAL TESTS
        // =========================
        const allPhasesCompleted = roadmap.phases.every((phase) =>
            phase.weeks.every((w) => isWeekCompleted(w))
        );

        for (let i = 1; i <= 3; i++) {
            const test = tests.find(
                (t) => t.type === "FINAL" && t.nOfFinalTests === i
            );

            const status = getStatus({
                isCompleted: allPhasesCompleted,
                isGenerated: test?.isGenerated,
                isAttempted: !!test?.attempt,
            });

            result.final.push({
                finalNumber: i,
                title: test?.title || `Final Test ${i}`,
                description:
                    test?.description ||
                    `Final test of completing all roadmap content. Attempt ${i}`,
                testId: test?.id,
                status,
            });
        }

        result.examName = roadmap.userExam.exam.name;

        return {
            success: true,
            data: result,
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            error: "Failed to load tests",
        };
    }
}

export async function getTestById(testId: number) {
    try {
        const test = await db.test.findUnique({
            where: {
                id: testId,
                isGenerated: true,
            },
            include: {
                questions: {
                    orderBy: {
                        id: "asc",
                    },
                },
                attempt: true,
            },
        });

        if (!test) {
            return {
                success: false,
                message: "Test not found",
            };
        }

        // 🎯 Clean frontend-ready structure
        const formatted = {
            id: test.id,
            title: test.title,
            type: test.type,
            description: test.description,
            totalMarks: test.totalMarks,
            duration: test.duration,

            questions: test.questions.map((q) => ({
                id: q.id,
                question: q.question,
                options: q.options as string[],
                topic: q.topic,
                difficulty: q.difficulty,
                marks: q.marks,
            })),

            attempt: test.attempt
                ? {
                    score: test.attempt.score,
                    percentage: test.attempt.percentage,
                    responses: test.attempt.responses,
                    completedAt: test.attempt.completedAt,
                }
                : null,
        };

        return {
            success: true,
            data: formatted,
        };
    } catch (error) {
        console.error("❌ getTestById error:", error);

        return {
            success: false,
            message: "Something went wrong",
        };
    }
}


export async function getTestResult(testId: number) {

    try {

        const test = await db.test.findUnique({

            where: {
                id: testId,
            },

            include: {

                questions: true,

                attempt: true,
            },
        });

        if (!test) {
            return {
                success: false,

                message: "Test not found",
            };
        }

        if (!test.attempt) {
            return {

                success: false,

                message: "Test not attempted yet",
            };
        }

        const responses =
            test.attempt.responses as Record<number, string>;

        // =========================
        // QUESTION ANALYSIS
        // =========================
        const questionsAnalysis =
            test.questions.map((question) => {

                const selectedAnswer =
                    responses[question.id];

                const isCorrect =
                    selectedAnswer === question.correctAns;

                return {

                    id: question.id,

                    question: question.question,

                    options: question.options as string[],

                    correctAnswer: question.correctAns,

                    selectedAnswer,

                    isCorrect,

                    marks: question.marks,

                    topic: question.topic,

                    difficulty: question.difficulty,
                };
            });

        // =========================
        // STATS
        // =========================
        const correctAnswers =
            questionsAnalysis.filter(
                (q) => q.isCorrect
            ).length;

        const wrongAnswers =
            questionsAnalysis.filter(
                (q) =>
                    q.selectedAnswer &&
                    !q.isCorrect
            ).length;

        const skippedAnswers =
            questionsAnalysis.filter(
                (q) => !q.selectedAnswer
            ).length;

        return {

            test: {

                id: test.id,

                title: test.title,

                description: test.description,

                totalMarks: test.totalMarks,

                duration: test.duration,
            },

            result: {

                score: test.attempt.score,

                totalMarks:
                    test.attempt.totalMarks,

                percentage:
                    test.attempt.percentage,

                completedAt:
                    test.attempt.completedAt,

                correctAnswers,

                wrongAnswers,

                skippedAnswers,
            },

            questions: questionsAnalysis,
        };

    } catch (error) {

        console.error(error);

        return {
            success: false,

            message: "Failed to fetch test result",
        };
    }
}