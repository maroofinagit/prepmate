"use server";

import { db } from "@/app/lib/db";
import { GoogleGenAI } from "@google/genai";
import { cacheLife } from "next/cache";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export async function getTestsForUserExam(userExamId: number) {
    'use cache';
    cacheLife('minutes'); // Cache for 5 minutes
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
};

export async function getTestById(testId: number) {
    'use cache';
    cacheLife('minutes'); // Cache for 5 minutes
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
};


export async function getTestResult(testId: number) {
    'use cache';
    cacheLife('minutes'); // Cache for 5 minutes
    try {

        const test = await db.test.findUnique({

            where: {
                id: testId,
            },

            include: {

                questions: true,

                attempt: true,

                userExam: {
                    select: {
                        id: true,
                        exam: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
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

                examName: test.userExam.exam.name,
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
};

const ai = new GoogleGenAI({});

export async function generateTestAttempt(testId: number) {
    try {

        // =========================
        // GET TEST ID
        // =========================

        if (!testId) {
            return {
                success: false,
                message: "Test ID required",
            };
        }


        // =========================
        // FETCH TEST
        // =========================

        const test = await db.test.findUnique({
            where: {
                id: testId,
            },
            include: {
                userExam: {
                    include: {
                        exam: true,
                    },
                },

                week: {
                    include: {
                        tasks: true,
                        phase: true,
                    },
                },

                phase: {
                    include: {
                        weeks: {
                            include: {
                                tasks: true,
                            },
                        },
                    },
                },

                questions: true,
            },
        });

        if (!test) {
            return {
                success: false,
                message: "Test not found",
            };
        }

        // =========================
        // ALREADY GENERATED CHECK
        // =========================

        if (test.isGenerated || test.questions.length > 0) {
            return {
                success: false,
                message: "Test already generated",
            };

        }

        // =========================
        // EXTRACT TOPICS
        // =========================

        let topics: string[] = [];

        // WEEKLY TEST
        if (test.type === "WEEKLY" && test.week) {

            topics = [
                test.week.focus,

                ...test.week.tasks.map((task) => task.title),

                ...test.week.tasks
                    .map((task) => task.description || "")
                    .filter(Boolean),
            ];
        }

        // PHASE TEST
        else if (test.type === "PHASE" && test.phase) {

            topics = test.phase.weeks.flatMap((week) => [
                week.focus,

                ...week.tasks.map((task) => task.title),

                ...week.tasks
                    .map((task) => task.description || "")
                    .filter(Boolean),
            ]);
        }

        // FINAL TEST
        else if (test.type === "FINAL") {

            const roadmap = await db.roadmap.findUnique({
                where: {
                    user_exam_id: test.userExamId,
                },

                include: {
                    phases: {
                        include: {
                            weeks: {
                                include: {
                                    tasks: true,
                                },
                            },
                        },
                    },
                },
            });

            if (roadmap) {
                topics = roadmap.phases.flatMap((phase) =>
                    phase.weeks.flatMap((week) => [
                        week.focus,

                        ...week.tasks.map((task) => task.title),

                        ...week.tasks
                            .map((task) => task.description || "")
                            .filter(Boolean),
                    ])
                );
            }
        }

        // REMOVE DUPLICATES
        topics = [...new Set(topics)];

        console.log("Extracted Topics:", topics);

        // =========================
        // GEMINI PROMPT
        // =========================

        const prompt = `
Generate test questions for the following exam and test:

Exam Name:
${test.userExam.exam.name}

Test Title:
${test.title}

Type of Test:
${test.type}

Topics:
${topics.join(", ")}

Rules:
- Generate ONLY valid JSON
- No markdown
- No explanation outside JSON
- Each question must have:
  - question
  - options (array of 4 options)
  - correctAns
  - topic
  - difficulty
  - marks

Question Count:
- If the test type is "WEEKLY", generate exactly 10 MCQ questions.
- If the test type is "PHASE", generate exactly 20 MCQ questions.
- If the test type is "FINAL", generate exactly 50 MCQ questions.

Difficulty values allowed:
easy, medium, hard

Return format:

[
  {
    "question": "Question here",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correctAns": "Option A",
    "topic": "Topic Name",
    "difficulty": "medium",
    "marks": 1
  }
]
`;

        // =========================
        // CALL GEMINI
        // =========================

        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const responseText = result.text ?? "";

        // CLEAN RESPONSE
        const cleanedText = responseText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        let generatedQuestions;

        try {
            generatedQuestions = JSON.parse(cleanedText);
        } catch (err) {
            console.error("JSON Parse Error:", err);

            return {
                success: false,
                message: "Invalid AI response format",
            };
        }

        // =========================
        // SAVE QUESTIONS
        // =========================

        await db.question.createMany({
            data: generatedQuestions.map((q: any) => ({
                testId: test.id,
                question: q.question,
                options: q.options,
                correctAns: q.correctAns,
                topic: q.topic,
                difficulty: q.difficulty,
                marks: q.marks || 1,
            })),
        });

        // =========================
        // UPDATE TEST
        // =========================

        await db.test.update({
            where: {
                id: test.id,
            },
            data: {
                isGenerated: true,
            },
        });

        // =========================
        // SUCCESS
        // =========================

        return {
            success: true,
            message: "Questions generated successfully",
        };

    } catch (error) {

        console.error("TEST GENERATION ERROR:", error);

        return {
            success: false,
            message: "Internal Server Error",
        };
    }
}

export async function submitTest(
    testId: number,
    responses: Record<string, string>,
    timeTaken: number
) {
    try {
        // =========================
        // AUTH CHECK
        // =========================
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return {
                success: false,
                error: "Unauthorized",
                status: 401,
            };
        }

        // =========================
        // VALIDATION
        // =========================
        if (!testId || !responses) {
            return {
                success: false,
                error: "Missing fields",
                status: 400,
            };
        }

        // =========================
        // FIND TEST
        // =========================
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
                error: "Test not found",
                status: 404,
            };
        }

        // =========================
        // CHECK IF ALREADY SUBMITTED
        // =========================
        if (test.attempt) {
            return {
                success: false,
                error: "Test already submitted",
                status: 400,
            };
        }

        // =========================
        // CALCULATE SCORE
        // =========================
        let score = 0;

        for (const question of test.questions) {
            const userAnswer = responses[question.id];

            if (userAnswer === question.correctAns) {
                score += question.marks;
            }
        }

        const percentage = (score / test.totalMarks) * 100;

        const isPassed = percentage >= 30;

        // =========================
        // CREATE ATTEMPT
        // =========================
        await db.testAttempt.create({
            data: {
                userId: session.user.id,
                testId: test.id,
                score,
                totalMarks: test.totalMarks,
                percentage,
                isPassed,
                responses,
                timeTaken,
            },
        });

        // =========================
        // UPDATE PERFORMANCE
        // =========================

        const tests = await db.test.findMany({
            where: {
                userExamId: test.userExamId,
                attempt: {
                    isNot: null,
                },
            },
            include: {
                attempt: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        const percentages = tests.map(
            (t) => t.attempt!.percentage
        );

        const performanceScore =
            percentages.reduce((sum, p) => sum + p, 0) /
            percentages.length;

        const highestScore = Math.max(...percentages);

        const lowestScore = Math.min(...percentages);

        const lastTestScore =
            tests[tests.length - 1]?.attempt?.percentage ?? 0;

        await db.userExam.update({
            where: {
                id: test.userExamId,
            },
            data: {
                performanceScore: Number(
                    performanceScore.toFixed(2)
                ),
                highestScore,
                lowestScore,
                lastTestScore,
            },
        });

        return {
            success: true,
            message: "Test submitted successfully",
        };
    } catch (error) {
        console.error(error);

        return {
            success: false,
            error: "Internal Server Error",
            status: 500,
        };
    }
}