
import { db } from "@/app/lib/db";



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
                userExams: { _count: "desc" }
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
                userExam: true, // optional: remove if not needed
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

                exams: {
                    select: {
                        id: true,
                        exam_id: true,
                        start_date: true,
                        end_date: true,
                        current_stage: true,
                        progress_percent: true,

                        // UserExam → Exam Details
                        exam: {
                            select: {
                                id: true,
                                name: true,
                            }
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
                                    }
                                },

                                // Phases, Weeks, Tasks
                                phases: {
                                    select: {
                                        id: true,
                                        phase_name: true,
                                        duration: true,
                                        order_index: true,
                                        progress: true,

                                        weeks: {
                                            select: {
                                                id: true,
                                                week_number: true,
                                                order_index: true,
                                                progress: true,

                                                tasks: {
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




