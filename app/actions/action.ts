"use server";
import { db } from "@/app/lib/db";
import { auth } from "../lib/auth";
import { headers } from "next/headers";
import { unstable_cache } from "next/cache";



export const getFullExams = unstable_cache(
    async () => {
        try {
            const exams = await db.exam.findMany({
                select: {
                    id: true,
                    name: true,
                    description: true,
                    imageUrl: true,
                    aiContext: true,
                    subjects: {
                        select: {
                            id: true,
                            name: true,
                            topics: {
                                select: {
                                    id: true,
                                    name: true,
                                    description: true,
                                    difficulty: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    userExams: { _count: "asc" }
                }
            });

            return exams;
        } catch (error) {
            console.error("Error fetching exams:", error);
            return [];
        }
    },
    ["getFullExams"], // Cache key
    {
        tags: ["exams"], // Tag for cache invalidation
        revalidate: 60, // Revalidate every 60 seconds
    }
);

export const getExamById = unstable_cache(
    async (id: number) => {
        try {
            const exam = await db.exam.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    aiContext: true,
                    subjects: {
                        select: {
                            id: true,
                            name: true,
                            topics: {
                                select: {
                                    id: true,
                                    name: true,
                                    description: true,
                                    difficulty: true,
                                },
                            },
                        },
                    },
                },
            });

            return exam;
        } catch (err) {
            console.error("❌ Error fetching exam:", err);
            return null;
        }
    },
    ["getExamById"], // Cache key
    {
        tags: ["exams"], // Tag for cache invalidation
        revalidate: 60, // Revalidate every 60 seconds
    }
);

export const getShortExams = unstable_cache(
    async () => {
        try {
            const exams = await db.exam.findMany({
                select: {
                    id: true,
                    name: true,
                    description: true,
                    imageUrl: true,
                    aiContext: true,
                },
            });

            return exams;
        } catch (error) {
            console.error("Error fetching exams:", error);
            return [];
        }
    },
    ["getShortExams"], // Cache key
    {
        tags: ["exams"], // Tag for cache invalidation
        revalidate: 60, // Revalidate every 60 seconds
    }
);
export const getUserExams = unstable_cache(
    async (userId: string) => {
        try {
            const userExams = await db.userExam.findMany({
                where: { user_id: userId },
                include: {
                    exam: true
                },
            });

            return userExams;
        } catch (err) {
            console.error("❌ Error fetching UserExams:", err);
            return [];
        }
    },
    ["getUserExams"], // Cache key
    {
        tags: ["userExams"], // Tag for cache invalidation
        revalidate: 60, // Revalidate every 60 seconds
    }
)

interface CreateUserExamProps {
    examId: number;
    start_date: string;
    end_date: string;
}

export async function createUserExam({
    examId,
    start_date,
    end_date,
}: CreateUserExamProps) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return {
                success: false,
                message: "Not authenticated",
            };
        }

        if (!examId || !start_date || !end_date) {
            return {
                success: false,
                message: "Missing required fields",
            };
        }

        const userId = session.user.id;

        const existingUserExam = await db.userExam.findFirst({
            where: {
                user_id: userId,
                exam_id: Number(examId),
            },
        });

        if (existingUserExam) {
            return {
                success: true,
                message: "UserExam already exists",
                user_exam_id: existingUserExam.id,
            };
        }

        const userExam = await db.userExam.create({
            data: {
                user_id: userId,
                exam_id: Number(examId),
                start_date: new Date(start_date),
                end_date: new Date(end_date),
                current_stage: "Not Started",
                progress_percent: 0,
            },
        });

        return {
            success: true,
            user_exam_id: userExam.id,
        };
    } catch (error) {
        console.error("❌ Error creating UserExam:", error);

        return {
            success: false,
            message: "Internal server error",
        };
    }
}

export const getRoadmapByUserExamId = unstable_cache(
    async (user_exam_id: number) => {
        try {
            const roadmap = await db.roadmap.findUnique({
                where: { user_exam_id },
                include: {
                    phases: {
                        orderBy: { order_index: "asc" },
                        include: {
                            weeks: {
                                orderBy: { order_index: "asc" },
                                include: {
                                    tasks: {
                                        orderBy: { order_index: "asc" },
                                    },
                                },
                            },
                        },
                    },
                    milestones: {
                        orderBy: { target_date: "asc" },
                    },
                    userExam: {
                        include: {
                            exam: {
                                include: {
                                    resources: true,
                                }
                            }
                        }
                    }
                },
            });

            return roadmap;
        } catch (err) {
            console.error("❌ Error fetching Roadmap:", err);
            return null;
        }
    },
    ["getRoadmapByUserExamId"], // Cache key
    {
        tags: ["roadmaps"], // Tag for cache invalidation
        revalidate: 60, // Revalidate every 60 seconds
    }
);


export const getDashboardUser = unstable_cache(
    async (userId: string) => {
        try {
            const dashboardUser = await db.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    createdAt: true,

                    exams: {
                        select: {
                            id: true,
                            exam_id: true,
                            start_date: true,
                            end_date: true,
                            current_stage: true,
                            progress_percent: true,
                            performanceScore: true,
                            roadmap_status: true,

                            // UserExam → Exam Details
                            exam: {
                                select: {
                                    id: true,
                                    name: true,
                                    description: true,
                                },

                            },

                            roadmap: {
                                select: {
                                    id: true,
                                    title: true,
                                    progress: true,

                                    // ⭐ Milestones added
                                    milestones: {
                                        select: {
                                            id: true,
                                            name: true,
                                            goal: true,
                                            achieved: true,
                                            target_date: true,
                                            created_at: true,
                                        },
                                        orderBy: { target_date: "asc" }
                                    },

                                    // Phases, Weeks, Tasks
                                    phases: {
                                        orderBy: { order_index: "asc" },
                                        select: {
                                            id: true,
                                            phase_name: true,
                                            duration: true,
                                            order_index: true,
                                            progress: true,

                                            weeks: {
                                                orderBy: { order_index: "asc" },
                                                select: {
                                                    id: true,
                                                    week_number: true,
                                                    order_index: true,
                                                    progress: true,

                                                    tasks: {
                                                        orderBy: { order_index: "asc" },
                                                        select: {
                                                            id: true,
                                                            title: true,
                                                            is_completed: true,
                                                            start_date: true,
                                                            end_date: true,
                                                            order_index: true,
                                                            created_at: true,
                                                            updated_at: true,
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            return dashboardUser;
        }
        catch (err) {
            console.error("❌ Error fetching DashboardUser:", err);
            return null;
        }
    },
    ["getDashboardUser"], // Cache key
    {
        tags: ["dashboardUsers"], // Tag for cache invalidation
        revalidate: 60, // Revalidate every 60 seconds
    }
);


export async function deleteUserExam(user_exam_id: number) {
    try {

        await db.userExam.delete({
            where: {
                id: user_exam_id,
            },
        });

        return {
            success: true,
            message: "User exam deleted successfully",
        };

    } catch (error) {

        console.error(
            "Error deleting user exam:",
            error
        );

        return {
            success: false,
            message: "Failed to delete user exam",
        };
    }
}

export async function markNotificationAsRead(notificationId: number) {
    try {
        const updatedNotification = await db.notification.update({
            where: { id: notificationId },
            data: { is_read: true },
        });

        return {
            success: true,
            notification: updatedNotification,
        };
    } catch (error) {
        console.error("❌ Error marking notification as read:", error);
        return {
            success: false,
            message: "Failed to mark notification as read",
        };
    }
}


export async function completeRoadmapTask(taskId: number): Promise<{ success: boolean }> {
    if (!taskId) {
        throw new Error("Task ID is required.");
    }

    try {
        await db.$transaction(async (tx) => {
            // 1️⃣ Mark task as completed and fetch hierarchy
            const task = await tx.roadmapTask.update({
                where: { id: taskId },
                data: { is_completed: true },
                include: {
                    week: {
                        include: {
                            phase: {
                                include: {
                                    roadmap: true,
                                },
                            },
                        },
                    },
                },
            });

            const weekId = task.week_id;
            const phaseId = task.week.phase_id;
            const roadmapId = task.week.phase.roadmap_id;
            const userExamId = task.week.phase.roadmap.user_exam_id;

            // 2️⃣ Week Progress
            const weekTasks = await tx.roadmapTask.findMany({
                where: { week_id: weekId },
                select: {
                    is_completed: true,
                },
            });

            const weekProgress = weekTasks.length
                ? Math.round(
                    (weekTasks.filter((t) => t.is_completed).length /
                        weekTasks.length) *
                    100
                )
                : 0;

            await tx.roadmapWeek.update({
                where: { id: weekId },
                data: {
                    progress: weekProgress,
                },
            });

            // 3️⃣ Phase Progress
            const phaseWeeks = await tx.roadmapWeek.findMany({
                where: { phase_id: phaseId },
                select: {
                    progress: true,
                },
            });

            const phaseProgress = phaseWeeks.length
                ? Math.round(
                    phaseWeeks.reduce((sum, week) => sum + week.progress, 0) /
                    phaseWeeks.length
                )
                : 0;

            await tx.roadmapPhase.update({
                where: { id: phaseId },
                data: {
                    progress: phaseProgress,
                },
            });

            // 4️⃣ Roadmap Progress
            const roadmapPhases = await tx.roadmapPhase.findMany({
                where: { roadmap_id: roadmapId },
                select: {
                    progress: true,
                },
            });

            const roadmapProgress = roadmapPhases.length
                ? Math.round(
                    roadmapPhases.reduce((sum, phase) => sum + phase.progress, 0) /
                    roadmapPhases.length
                )
                : 0;

            await tx.roadmap.update({
                where: { id: roadmapId },
                data: {
                    progress: roadmapProgress,
                },
            });

            // 5️⃣ User Exam Progress
            await tx.userExam.update({
                where: { id: userExamId },
                data: {
                    progress_percent: roadmapProgress,
                },
            });
        });
        return {
            success: true,
        };
    } catch (error) {
        console.error("❌ Error completing roadmap task:", error);
        return {
            success: false,
        };
    }
}

export async function completeMilestone(
    milestoneId: number
): Promise<{ success: boolean }> {
    try {
        if (!milestoneId || Number.isNaN(milestoneId)) {
            return { success: false };
        }

        const milestone = await db.milestone.findUnique({
            where: { id: milestoneId },
            select: {
                achieved: true,
            },
        });

        if (!milestone) {
            return { success: false };
        }

        // Already completed
        if (milestone.achieved) {
            return { success: true };
        }

        await db.milestone.update({
            where: { id: milestoneId },
            data: {
                achieved: true,
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Error completing milestone:", error);
        return { success: false };
    }
}

export async function checkEmailExistsLogin(email: string) {
    const user = await db.user.findUnique({
        where: { email },
        include: {
            accounts: true,
        },
    });

    if (!user) {
        return {
            exists: false,
            provider: null,
        };
    }

    console.log("User accounts:", user.accounts);

    const hasGoogle = user.accounts.some(
        (account) => account.providerId === "google"
    );

    const hasGithub = user.accounts.some(
        (account) => account.providerId === "github"
    );

    const hasCredentials = user.accounts.some(
        (account) => account.providerId === "credential"
    );

    return {
        exists: true,
        provider: hasCredentials
            ? "credentials"
            : hasGoogle
                ? "google"
                : hasGithub
                    ? "github"
                    : null,
    };
}

export async function profileSecurityCheck(userId: string) {
    const user = await db.user.findUnique({
        where: { id: userId },
        include: {
            accounts: true,
        },
    });

    if (!user) {
        return null;
    }

    const hasGoogle = user.accounts.some(
        (account) => account.providerId === "google"
    );

    const hasGithub = user.accounts.some(
        (account) => account.providerId === "github"
    );

    const hasCredentials = user.accounts.some(
        (account) => account.providerId === "credential"
    );

    return {
        hasGoogle,
        hasGithub,
        hasCredentials,
    };
}

export async function setPassword(newPassword: string) {
    try {

        const hasCredentialAccount = await auth.api.listUserAccounts({
            headers: await headers(),
        }).then((accounts) => {
            return accounts.some(
                (account) => account.providerId === "credential"
            );
        });

        if (hasCredentialAccount) {
            return {
                success: false,
                message: "Password already set.",
            };
        }

        await auth.api.setPassword({
            headers: await headers(),
            body: {
                newPassword,
            },
        });

        return {
            success: true,
            message: "Password set successfully.",
        };
    } catch (error: any) {
        console.error(error);

        return {
            success: false,
            message:
                error?.body?.message ||
                error?.message ||
                "Failed to set password.",
        };
    }
}

export async function changePassword(
    currentPassword: string,
    newPassword: string
) {
    try {

        await auth.api.listUserAccounts({
            headers: await headers(),
        }).then((accounts) => {
            const hasCredentialAccount = accounts.some(
                (account) => account.providerId === "credential"
            );

            if (!hasCredentialAccount) {
                return {
                    success: false,
                    message: "No credential account found.",
                };
            }
        });

        await auth.api.changePassword({
            headers: await headers(),
            body: {
                currentPassword,
                newPassword,
                revokeOtherSessions: true,
            },
        });

        return {
            success: true,
            message: "Password changed successfully.",
        };
    } catch (error: any) {
        console.error(error);

        return {
            success: false,
            message:
                error?.body?.message ||
                error?.message ||
                "Failed to change password.",
        };
    }
}




