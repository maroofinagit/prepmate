"use server";

import { db } from "@/app/lib/db";
import { GoogleGenAI } from "@google/genai";
import { cacheLife, cacheTag, revalidateTag, updateTag } from "next/cache";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { TestAttemptSchema } from "../lib/zodSchema";

export async function getCachedTests(userExamId: number, userId: string) {
    try {
        if (!userExamId) {
            throw new Error("User Exam ID is required");
        }
        if (!userId) {
            throw new Error("User ID is required");
        }

        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.session) {
            throw new Error("User not authenticated");
        }

        if (session.session.userId !== userId) {
            throw new Error("User ID does not match the authenticated user");
        }

        const { data } = await getTestsForUserExam(userExamId, userId);
        return {
            success: true,
            data: data
        };

    } catch (error) {
        console.error("Error fetching cached tests:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "An unknown error occurred",
        };
    }
}

export async function getTestsForUserExam(userExamId: number, userId: string) {
    'use cache';
    cacheTag(`tests-${userExamId}-user-${userId}`);
    cacheLife('hours'); // Cache for 30 seconds
    try {
        // 🔥 1. Fetch roadmap
        const roadmap = await db.roadmap.findUnique({
            where: {
                user_exam_id: userExamId,
                userExam: {
                    user_id: userId,
                }
            },

            select: {
                phases: {
                    orderBy: {
                        order_index: "asc",
                    },

                    select: {
                        id: true,
                        phase_name: true,
                        order_index: true,

                        weeks: {
                            orderBy: {
                                order_index: "asc",
                            },

                            select: {
                                id: true,
                                week_number: true,
                                focus: true,

                                tasks: {
                                    select: {
                                        is_completed: true,
                                    },
                                },
                            },
                        },
                    },
                },

                userExam: {
                    select: {
                        exam: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        if (!roadmap) throw new Error("Roadmap not found");

        // 🔥 2. Fetch tests
        const tests = await db.test.findMany({
            where: {
                userExamId,
                userExam: {
                    user_id: userId,
                }
            },

            select: {
                id: true,
                title: true,
                description: true,
                weekId: true,
                phaseId: true,
                type: true,
                nOfFinalTests: true,
                isGenerated: true,

                attempt: {
                    select: {
                        id: true,
                    },
                },
            },
        });

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

        // =========================
        // HELPERS
        // =========================

        const isWeekCompleted = (week: {
            tasks: { is_completed: boolean }[];
        }) =>
            week.tasks.length > 0 &&
            week.tasks.every((task) => task.is_completed);


        const getStatus = ({
            isCompleted,
            isGenerated,
            isAttempted,
        }: {
            isCompleted: boolean;
            isGenerated?: boolean;
            isAttempted?: boolean;
        }) => {

            // Highest priority
            if (isAttempted) {
                return "ATTEMPTED";
            }

            // Required roadmap work isn't finished
            if (!isCompleted) {
                return "LOCKED";
            }

            // Roadmap work finished but test hasn't been generated
            if (!isGenerated) {
                return "GENERATE";
            }

            // Roadmap work finished and test generated
            return "GIVE";
        };


        // =========================
        // TEST LOOKUP MAPS
        // =========================

        // Weekly tests → weekId
        const weeklyTests = new Map(
            tests
                .filter((test) => test.weekId !== null)
                .map((test) => [test.weekId, test])
        );

        // Phase tests → phaseId
        const phaseTests = new Map(
            tests
                .filter((test) => test.phaseId !== null)
                .map((test) => [test.phaseId, test])
        );

        // Final tests → final test number
        const finalTests = new Map(
            tests
                .filter(
                    (test) =>
                        test.type === "FINAL" &&
                        test.nOfFinalTests !== null
                )
                .map((test) => [test.nOfFinalTests!, test])
        );


        // =========================
        // RESULT
        // =========================

        const result: {
            weekly: any[];
            phase: any[];
            final: any[];
            examName?: string;
        } = {
            weekly: [],
            phase: [],
            final: [],
        };


        // =========================
        // WEEKLY TESTS
        // =========================

        for (const phase of roadmap.phases) {

            for (const week of phase.weeks) {

                const test = weeklyTests.get(week.id);

                const isCompleted = isWeekCompleted(week);

                const status = getStatus({
                    isCompleted,
                    isGenerated: test?.isGenerated,
                    isAttempted: !!test?.attempt,
                });

                result.weekly.push({
                    weekId: week.id,

                    title:
                        test?.title ??
                        `Week ${week.week_number} Test`,

                    description:
                        test?.description ??
                        week.focus,

                    testId: test?.id,

                    status,
                });
            }
        }


        // =========================
        // PHASE TESTS
        // =========================

        for (const phase of roadmap.phases) {

            const test = phaseTests.get(phase.id);

            const isCompleted =
                phase.weeks.length > 0 &&
                phase.weeks.every((week) =>
                    isWeekCompleted(week)
                );

            const status = getStatus({
                isCompleted,
                isGenerated: test?.isGenerated,
                isAttempted: !!test?.attempt,
            });

            result.phase.push({
                phaseId: phase.id,

                title:
                    test?.title ??
                    `Phase ${phase.order_index + 1} Test`,

                description:
                    test?.description ??
                    phase.phase_name,

                testId: test?.id,

                status,
            });
        }


        // =========================
        // FINAL TESTS
        // =========================

        const allPhasesCompleted =
            roadmap.phases.length > 0 &&
            roadmap.phases.every(
                (phase) =>
                    phase.weeks.length > 0 &&
                    phase.weeks.every((week) =>
                        isWeekCompleted(week)
                    )
            );


        for (let i = 1; i <= 3; i++) {

            const test = finalTests.get(i);

            const status = getStatus({
                isCompleted: allPhasesCompleted,
                isGenerated: test?.isGenerated,
                isAttempted: !!test?.attempt,
            });

            result.final.push({
                finalNumber: i,

                title:
                    test?.title ??
                    `Final Test ${i}`,

                description:
                    test?.description ??
                    `Final test of completing all roadmap content. Attempt ${i}`,

                testId: test?.id,

                status,
            });
        }


        // =========================
        // EXAM NAME
        // =========================

        result.examName = roadmap.userExam.exam.name;


        // =========================
        // RETURN
        // =========================

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
    cacheTag(`test-${testId}`);
    cacheLife('hours'); // Cache for 30 seconds
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
    cacheTag(`test-${testId}`);
    cacheLife('hours'); // Cache for 30 seconds
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

const MODELS = [
    "gemini-3.7-flash",        // Primary
    "gemini-3.6-flash",        // Strong fallback
    "gemini-3.5-flash",        // Fallback
    "gemini-3.5-flash-lite",   // High-quota emergency fallback
    "gemini-2.5-flash",        // Last resort
] as const;

enum RoadmapFailureReason {
    MODEL_UNAVAILABLE = "MODEL_UNAVAILABLE",
    RATE_LIMITED = "RATE_LIMITED",
    INVALID_AI_JSON = "INVALID_AI_JSON",
    INVALID_ROADMAP_SCHEMA = "INVALID_ROADMAP_SCHEMA",
    DATABASE_ERROR = "DATABASE_ERROR",
    UNKNOWN = "UNKNOWN",
}

const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

export async function generateWithFallback(prompt: string, onProgress: (event: any) => void) {

    let lastError: any;

    const aiStartProgress = 20;
    const aiEndProgress = 35;

    const totalAttempts = MODELS.length * 2;

    let attemptNumber = 0;

    for (const model of MODELS) {
        // Try each model twice
        for (let attempt = 1; attempt <= 2; attempt++) {
            try {
                console.log(
                    `🤖 Trying ${model} (Attempt ${attempt}/2)`
                );

                attemptNumber++;

                const attemptProgress =
                    aiStartProgress +
                    Math.round(
                        ((attemptNumber - 1) /
                            totalAttempts) *
                        (aiEndProgress - aiStartProgress - 2)
                    );

                onProgress({
                    step: "ai_generation_started",
                    message: `Generating roadmap (Attempt ${attempt}/2)...`,
                    progress: attemptProgress,
                });

                onProgress({
                    step: "ai_generation",
                    message: `Generating roadmap with ${model} (Attempt ${attempt}/2)...`,
                    progress: attemptProgress,
                });

                const response =
                    await ai.models.generateContent({
                        model,
                        contents: prompt,
                    });

                console.log(
                    `✅ Test Attempt generated with ${model} (Attempt ${attempt})`
                );

                onProgress({
                    step: "ai_generation_success",
                    message: `Roadmap generated successfully with ${model} (Attempt ${attempt}/2)`,
                    progress: 35,
                });

                return response;

            } catch (err: any) {
                // Keep the latest error so we can throw it
                // after all models have been exhausted.
                err.model = model;
                err.attempt = attempt;

                lastError = err;

                const status =
                    err?.status ??
                    err?.error?.code ??
                    err?.code;

                console.error(
                    `Test Attempt Error: ❌ ${model} failed (Attempt ${attempt}/2 for test generation) with status ${status}:`,
                    {
                        status,
                        message: err?.message,
                    }
                );

                // Permanent errors → don't retry
                if ([400, 401, 403].includes(status)) {
                    throw err;
                }

                // Temporary errors → retry once, then move to next model
                if ([429, 500, 503].includes(status)) {
                    if (attempt < 2) {
                        console.log(
                            `⏳ Retrying ${model} in 2 seconds...`
                        );

                        await sleep(2000);
                        continue;
                    }

                    console.log(
                        `Test Attempt Generation Error: ➡️ ${model} exhausted. Trying next model...`
                    );

                    break;
                }

                // Any unexpected error should stop immediately
                console.error(
                    `🚨 Test Attempt Generation Error: Unexpected error from ${model}`,
                    err
                );

                throw err;
            }
        }
    }

    throw lastError;
}

export async function generateTestAttempt(testId: number, onProgress: (event: any) => void) {
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
                        user: {
                            select: {
                                id: true,
                            }
                        }
                    },
                },

                week: {
                    include: {
                        phase: true,
                        tasks: {
                            include: {
                                topics: true
                            },
                        },
                    },
                },

                phase: {
                    include: {
                        weeks: {
                            include: {
                                tasks: {
                                    include: {
                                        topics: true
                                    }
                                }
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

        onProgress({
            step: "extracting_topics",
            message: "Extracting topics from roadmap...",
            progress: 10,
        });

        //extract weak topics

        const TOPIC_ACCURACY_THRESHOLD = 70;

        const getWeakTopics = (ts: any[]) => {
            // Consider ALL attempted tests
            const attemptedTests = (ts ?? []).filter(
                (test) => test.attempt
            );

            const topicStats = new Map<
                number,
                {
                    id: number;
                    name: string;
                    correctCount: number;
                    wrongCount: number;
                }
            >();

            for (const test of attemptedTests) {
                if (!test.attempt) continue;

                const responses =
                    test.attempt.responses as Record<string, string>;

                for (const question of test.questions) {
                    const topic = question.topic;

                    const userAnswer =
                        responses[String(question.id)];

                    let stats = topicStats.get(topic.id);

                    if (!stats) {
                        stats = {
                            id: topic.id,
                            name: topic.name,
                            correctCount: 0,
                            wrongCount: 0,
                        };

                        topicStats.set(topic.id, stats);
                    }

                    if (userAnswer === question.correctAns) {
                        stats.correctCount++;
                    } else {
                        stats.wrongCount++;
                    }
                }
            }

            return [...topicStats.values()]
                .map((topic) => {
                    const totalQuestions =
                        topic.correctCount + topic.wrongCount;

                    const accuracy =
                        totalQuestions > 0
                            ? Math.round(
                                (topic.correctCount /
                                    totalQuestions) *
                                100
                            )
                            : 0;

                    return {
                        ...topic,
                        totalQuestions,
                        accuracy,
                    };
                })
                .filter(
                    (topic) =>
                        topic.accuracy <
                        TOPIC_ACCURACY_THRESHOLD
                )
                .sort(
                    (a, b) =>
                        a.accuracy - b.accuracy ||
                        b.wrongCount - a.wrongCount
                );
        };

        let taskContext: {
            focus: string;
            tasks: {
                name: string;
                description: string | null;
                topics: {
                    id: number;
                    name: string;
                    description: string | null;
                    difficulty: string;
                }[];
            }[];
        }[] = [];

        let relevantWeakTopics: {}[] = [];

        // WEEKLY TEST
        if (test.type === "WEEKLY" && test.week) {

            taskContext = [
                {
                    focus: test.week.focus,
                    tasks: test.week.tasks.map((task) => ({
                        name: task.title,
                        description: task.description,
                        topics: task.topics.map((topic) => ({
                            id: topic.id,
                            name: topic.name,
                            description: topic.description,
                            difficulty: topic.difficulty,
                        })),
                    })),
                },
            ];


            // ============================================
            // 2. GET PREVIOUS WEEKS
            // ============================================

            const previousWeeks = await db.roadmapWeek.findMany({
                where: {
                    phase: {
                        roadmap: {
                            user_exam_id: test.userExamId,
                        },
                    },

                    // Only weeks before the current week
                    start_date: {
                        lt: test.week.start_date!,
                    },
                },

                include: {
                    tests: {
                        where: {
                            // Only attempted tests
                            attempt: {
                                isNot: null,
                            },
                        },

                        include: {
                            attempt: true,

                            questions: {
                                include: {
                                    topic: true,
                                },
                            },
                        },
                    },
                },

                orderBy: {
                    start_date: "asc",
                },
            });


            // ============================================
            // 3. GET ALL ATTEMPTED TESTS FROM PREVIOUS WEEKS
            // ============================================

            const previousWeekTests = previousWeeks.flatMap(
                (week) => week.tests
            );


            // ============================================
            // 4. FIND WEAK TOPICS
            // ============================================

            const previousWeakTopics =
                getWeakTopics(previousWeekTests);


            // ============================================
            // 5. GET CURRENT WEEK TOPIC IDs
            // ============================================

            const currentWeekTopicIds = new Set(
                test.week.tasks.flatMap((task) =>
                    task.topics.map((topic) => topic.id)
                )
            );


            // ============================================
            // 6. ONLY KEEP WEAK TOPICS THAT
            //    APPEAR IN CURRENT WEEK
            // ============================================

            relevantWeakTopics =
                previousWeakTopics.filter((topic) =>
                    currentWeekTopicIds.has(topic.id)
                );


            console.log(
                "Previous weak topics:",
                previousWeakTopics
            );

            console.log(
                "Current week topic IDs:",
                [...currentWeekTopicIds]
            );

            console.log(
                "Relevant weak topics:",
                relevantWeakTopics
            );

        }

        // PHASE TEST
        else if (test.type === "PHASE" && test.phase) {

            taskContext = test.phase.weeks.map((week) => ({
                focus: week.focus,
                tasks: week.tasks.map((task) => ({
                    name: task.title,
                    description: task.description,
                    topics: task.topics.map((topic) => ({
                        id: topic.id,
                        name: topic.name,
                        description: topic.description,
                        difficulty: topic.difficulty,
                    })),
                })),
            }));

            // ============================================
            // 2. GET PREVIOUS PHASES
            // ============================================

            const previousPhases = await db.roadmapPhase.findMany({
                where: {
                    roadmap: {
                        user_exam_id: test.userExamId,
                    },

                    // Only phases before the current phase
                    start_date: {
                        lt: test.phase.start_date!,
                    },
                },

                include: {
                    tests: {
                        where: {
                            // Only attempted tests
                            attempt: {
                                isNot: null,
                            },
                        },

                        include: {
                            attempt: true,

                            questions: {
                                include: {
                                    topic: true,
                                },
                            },
                        },
                    },
                },

                orderBy: {
                    start_date: "asc",
                },
            });


            // ============================================
            // 3. GET ALL ATTEMPTED TESTS
            //    FROM PREVIOUS PHASES
            // ============================================

            const previousPhaseTests = previousPhases.flatMap(
                (phase) => phase.tests
            );


            // ============================================
            // 4. FIND WEAK TOPICS
            // ============================================

            const previousWeakTopics =
                getWeakTopics(previousPhaseTests);


            // ============================================
            // 5. GET ALL TOPIC IDs IN CURRENT PHASE
            // ============================================

            const currentPhaseTopicIds = new Set(
                test.phase.weeks.flatMap((week) =>
                    week.tasks.flatMap((task) =>
                        task.topics.map((topic) => topic.id)
                    )
                )
            );


            // ============================================
            // 6. KEEP ONLY WEAK TOPICS THAT
            //    APPEAR IN CURRENT PHASE
            // ============================================

            relevantWeakTopics =
                previousWeakTopics.filter((topic) =>
                    currentPhaseTopicIds.has(topic.id)
                );


            console.log(
                "Previous phase weak topics:",
                previousWeakTopics
            );

            console.log(
                "Current phase topic IDs:",
                [...currentPhaseTopicIds]
            );

            console.log(
                "Relevant phase weak topics:",
                relevantWeakTopics
            );

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
                                    tasks: {
                                        include: {
                                            topics: true
                                        }
                                    }
                                },
                            },
                        },
                    },
                },
            });

            if (roadmap) {
                taskContext = roadmap.phases.flatMap((phase) =>
                    phase.weeks.map((week) => ({
                        focus: week.focus,
                        tasks: week.tasks.map((task) => ({
                            name: task.title,
                            description: task.description,
                            topics: task.topics.map((topic) => ({
                                id: topic.id,
                                name: topic.name,
                                description: topic.description,
                                difficulty: topic.difficulty,
                            })),
                        })),
                    }))
                );
            }

            // ============================================
            // 2. BUILD FULL STUDY CONTEXT
            // ============================================

            if (roadmap) {
                taskContext = roadmap.phases.flatMap((phase) =>
                    phase.weeks.map((week) => ({
                        focus: week.focus,
                        tasks: week.tasks.map((task) => ({
                            name: task.title,
                            description: task.description,
                            topics: task.topics.map((topic) => ({
                                id: topic.id,
                                name: topic.name,
                                description: topic.description,
                                difficulty: topic.difficulty,
                            })),
                        })),
                    }))
                );
            }


            // ============================================
            // 3. GET ALL PREVIOUS ATTEMPTED TESTS
            // ============================================

            const previousTests = await db.test.findMany({
                where: {
                    userExamId: test.userExamId,

                    // Only tests the student actually attempted
                    attempt: {
                        isNot: null,
                    },
                },

                include: {
                    attempt: true,

                    questions: {
                        include: {
                            topic: true,
                        },
                    },
                },

                orderBy: {
                    createdAt: "asc",
                },
            });


            // ============================================
            // 4. FIND ALL WEAK TOPICS
            // ============================================

            const weakTopics = getWeakTopics(previousTests);


            // ============================================
            // 5. GET TOPICS AVAILABLE IN FINAL
            // ============================================

            const finalTopicIds = new Set(
                taskContext.flatMap((week) =>
                    week.tasks.flatMap((task) =>
                        task.topics.map((topic) => topic.id)
                    )
                )
            );


            // ============================================
            // 6. KEEP ONLY TOPICS THAT ARE ACTUALLY
            //    PART OF THE CURRENT ROADMAP
            // ============================================

            relevantWeakTopics = weakTopics.filter(
                (topic) => finalTopicIds.has(topic.id)
            );


            console.log(
                "All weak topics:",
                weakTopics
            );

            console.log(
                "Relevant final weak topics:",
                relevantWeakTopics
            );
        }


        // =========================
        // GEMINI PROMPT
        // =========================

        const weakTopicContext = relevantWeakTopics.length > 0
            ? `
Weak Topics:

The following topics have been identified as weak based on the student's
performance in previous attempted tests relevant to this test.

A topic is considered weak when its overall accuracy is below 70%.

${relevantWeakTopics
                .map(
                    (topic: any) => `- Topic ID: ${topic.id}
  Name: ${topic.name}
  Accuracy: ${topic.accuracy}%
  Questions Attempted: ${topic.totalQuestions}
  Wrong Answers: ${topic.wrongCount}`
                )
                .join("\n")}

MANDATORY WEAK TOPIC REQUIREMENT:

Every weak topic listed above MUST appear in at least one generated question.

If there are multiple weak topics, ALL of them must be represented.
Do NOT select only some of the weak topics.

Each weak-topic question MUST use the exact topicId provided above.

Weak-topic coverage takes priority over even distribution across topics.

If there are only a few weak topics, additional questions may be generated
from those weak topics when appropriate.

Do not generate questions for weak topics that are not present in the
Study Context.
`
            : `
Weak Topics:

No relevant weak topics were identified for this test.

Generate the test normally using the Study Context and the standard
question distribution.
`;

        const prompt = `
You are an expert exam question setter.

Generate high-quality multiple-choice questions for the following test.

Exam:
${test.userExam.exam.name}

Test:
${test.title}

Test Type:
${test.type}

Study Context:

${taskContext
                .map(
                    (week) => `
Week Focus: ${week.focus}

${week.tasks
                            .map(
                                (task) => `
Task: ${task.name}
Description: ${task.description ?? "N/A"}

Topics:
${task.topics
                                        .map(
                                            (topic) => `- ID: ${topic.id}
  Name: ${topic.name}
  Difficulty: ${topic.difficulty}
  Description: ${topic.description ?? "N/A"}`
                                        )
                                        .join("\n")}
`
                            )
                            .join("\n")}
`
                )
                .join("\n")}

                ${weakTopicContext}

Instructions:

1. Generate ONLY valid JSON.
2. Do NOT wrap the response in markdown.
3. Do NOT include explanations or additional text.
4. Every question must belong to exactly one Topic listed above.
5. Use the corresponding topicId for every question.
6. Never invent new topics.
7. Never use an ID that is not provided.
8. Questions should primarily assess concepts covered by the associated task.
9. Ensure every task contributes at least one question whenever possible.
10. Every question must have exactly 4 unique options.
11. Only one option should be correct.
12. The correct answer must exactly match one option.
13. Distractors should be realistic.
14. Avoid duplicate or very similar questions.
15. Questions should emphasize conceptual understanding, practical reasoning, and problem-solving instead of memorization.
16. Distribute questions evenly across all provided tasks and topics.
17. Difficulty should match the topic difficulty whenever reasonable.
18. Use concise, grammatically correct English suitable for technical interviews and competitive exams.

WEAK TOPIC RULES:

19. If Weak Topics are provided above, EVERY listed weak topic MUST be
    represented by at least one question.

20. Do NOT omit any listed weak topic.

21. Do NOT replace a weak topic with another topic.

22. Every question intended to address a weak topic MUST use the exact
    topicId of that weak topic.

23. If there are multiple weak topics, ensure that each distinct weak topic
    receives at least one question before adding additional questions.

24. Weak-topic coverage takes priority over even distribution across topics.

25. If the number of weak topics is smaller than the total number of
    questions, the remaining questions should cover the rest of the
    Study Context.

26. Additional questions may be generated for weak topics when appropriate,
    especially when there are fewer weak topics than the number of questions
    that can reasonably be dedicated to weakness remediation.

27. Never generate a question for a weak topic unless that topic exists in
    the current Study Context.


GENERAL DISTRIBUTION:

28. After every relevant weak topic has been covered, distribute the
    remaining questions broadly across the provided tasks and topics.

29. Difficulty distribution should be followed as closely as possible.

30. Difficulty should match the topic difficulty whenever reasonable.

31. Use concise, grammatically correct English suitable for technical
    interviews and competitive exams.

Question Count:
- WEEKLY: 10 questions
- PHASE: 20 questions
- FINAL: 50 questions

Difficulty Distribution:
- WEEKLY:
  - 50% Easy
  - 40% Medium
  - 10% Hard

- PHASE:
  - 30% Easy
  - 50% Medium
  - 20% Hard

- FINAL:
  - 20% Easy
  - 50% Medium
  - 30% Hard

Allowed difficulty values:
- easy
- medium
- hard

Return ONLY this JSON array:

[
  {
    "question": "Question text",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correctAns": "Option B",
    "topicId": 3,
    "difficulty": "medium",
    "marks": 1
  }
]
`;

        // =========================
        // CALL GEMINI
        // =========================

        onProgress({
            step: "ai_generation_starts",
            message: "Preparing your exam data for AI roadmap generation...",
            progress: 20,
        });

        const promptStarts = Date.now();

        const result = await generateWithFallback(prompt, onProgress);

        console.log(
            "🟢 AI response received in:",
            ((Date.now() - promptStarts) / 1000).toFixed(2),
            "seconds"
        );

        const responseText = result.text ?? "";

        // CLEAN RESPONSE
        const cleanedText = responseText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const parsed = TestAttemptSchema.safeParse(JSON.parse(cleanedText));

        if (!parsed.success) {
            console.error(parsed.error.message);
            throw new Error("Test Attempt validation failed: " + parsed.error.message);
        }

        let generatedQuestions = parsed.data;

        onProgress({
            step: "generated",
            message: "AI Roadmap Generated now processing it to the database!",
            progress: 50,
        });

        // =========================
        // SAVE QUESTIONS
        // =========================
        await db.question.createMany({
            data: generatedQuestions.map((q: any) => ({
                testId: test.id,
                question: q.question,
                options: q.options,
                correctAns: q.correctAns,
                topicId: q.topicId,
                difficulty: q.difficulty,
                marks: q.marks || 1,
            })),
        });

        onProgress({
            step: "saved",
            message: "Questions saved to the database successfully!",
            progress: 75,
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
                failureReason: null,
            },
        });

        revalidateTag(`test-${testId}`, { expire: 0 });
        revalidateTag(`exam-${test.userExam.exam.id}`, { expire: 0 });
        revalidateTag(`exams`, { expire: 0 });
        revalidateTag(`userDashboard-${test.userExam.user_id}`, { expire: 0 });
        revalidateTag(`userExams-${test.userExam.user_id}`, { expire: 0 });
        revalidateTag(`tests-${test.userExam.id}-user-${test.userExam.user_id}`, { expire: 0 });
        revalidateTag(`todaysTasks-${test.userExam.user_id}`, { expire: 0 });
        revalidateTag(`userExam-${test.userExam.id}`, { expire: 0 });
        revalidateTag(`roadmap-${test.userExam.id}-user-${test.userExam.user_id}`, { expire: 0 });

        onProgress({
            step: "completed",
            message: "Test generation completed successfully!",
            progress: 90,
        });

        // =========================
        // SUCCESS
        // =========================

        return {
            success: true,
            message: "Questions generated successfully",
        };

    } catch (err: any) {
        let failureReason = RoadmapFailureReason.UNKNOWN;

        const status =
            err?.status ??
            err?.error?.code ??
            err?.code;

        if (err.message === "INVALID_AI_JSON") {
            failureReason = RoadmapFailureReason.INVALID_AI_JSON;
        } else if (err.message === "INVALID_ROADMAP_SCHEMA") {
            failureReason = RoadmapFailureReason.INVALID_ROADMAP_SCHEMA;
        } else if (status === 429) {
            failureReason = RoadmapFailureReason.RATE_LIMITED;
        } else if ([500, 503].includes(status)) {
            failureReason = RoadmapFailureReason.MODEL_UNAVAILABLE;
        } else if (
            err.name === "PrismaClientKnownRequestError" ||
            err.name === "PrismaClientUnknownRequestError"
        ) {
            failureReason = RoadmapFailureReason.DATABASE_ERROR;
        }

        await db.test.update({
            where: {
                id: testId,
            },
            data: {
                isGenerated: false,
                failureReason,
            },
        });

        console.error("❌ Test Attempt generation failed", {
            reason: failureReason,
            status,
            message: err?.message,
            model: err?.model,
        });

        return {
            success: false,
            error: err.message,
            failureReason,
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
                userExam: {
                    include: {
                        exam: true,
                        user: {
                            select: {
                                id: true,
                            }
                        }
                    },
                },
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

        updateTag(`test-${testId}`);
        updateTag(`exam-${test.userExam.exam.id}`);
        updateTag(`exams`);
        updateTag(`userDashboard-${test.userExam.user.id}`);
        updateTag(`userExams-${test.userExam.user.id}`);
        updateTag(`tests-${test.userExam.id}-user-${test.userExam.user.id}`);
        updateTag(`todaysTasks-${test.userExam.user.id}`);
        updateTag(`userExam-${test.userExam.id}`);
        updateTag(`roadmap-${test.userExam.id}-user-${test.userExam.user.id}`);

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