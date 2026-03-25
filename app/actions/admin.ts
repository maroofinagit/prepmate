"use server";
import { db } from "../lib/db";

export async function getAdminDashboardData() {
    const totalUsers = await db.user.count();

    const users = await db.user.findMany({
        include: {
            exams: {
                include: {
                    exam: true,
                },
            },
        },
    });

    return {
        totalUsers,
        users,
    };
}

export async function getUserDetails(userId: string) {
    const user = await db.user.findUnique({
        where: { id: userId },
        include: {
            exams: {
                include: {
                    exam: true,
                    roadmap: true,
                },
            },
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    return user;
}