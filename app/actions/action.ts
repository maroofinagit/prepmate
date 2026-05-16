"use server";
import { db } from "@/app/lib/db";
import { auth } from "../lib/auth";
import { headers } from "next/headers";



export async function getFullExams() {
    try {
        const exams = await db.exam.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                imageUrl: true,
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
}

export async function getExamById(id: number) {
    try {
        const exam = await db.exam.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                description: true,
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
}

export async function getShortExams() {
    try {
        const exams = await db.exam.findMany({
            select: {
                id: true,
                name: true,
                description: true,
            },
        });

        return exams;
    } catch (error) {
        console.error("Error fetching exams:", error);
        return [];
    }
}

export async function getUserExams(userId: string) {
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
}

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

export async function getRoadmapByUserExamId(user_exam_id: number) {
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
}


export async function getDashboardUser(userId: string) {
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
}


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




