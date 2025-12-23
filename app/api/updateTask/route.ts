import { db } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { taskId } = body;

        if (!taskId) {
            return NextResponse.json(
                { error: "Task ID is required." },
                { status: 400 }
            );
        }

        const result = await db.$transaction(async (tx: any) => {

            // 1️⃣ Mark the task completed AND load its hierarchy pointers
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

            // 2️⃣ Recalculate WEEK progress
            const weekTasks = await tx.roadmapTask.findMany({
                where: { week_id: weekId },
                select: { is_completed: true },
            });

            const weekTotal = weekTasks.length;
            const weekCompleted = weekTasks.filter(t => t.is_completed).length;

            const weekProgress = weekTotal
                ? Math.round((weekCompleted / weekTotal) * 100)
                : 0;

            await tx.roadmapWeek.update({
                where: { id: weekId },
                data: { progress: weekProgress },
            });

            // 3️⃣ Recalculate PHASE progress
            const phaseWeeks = await tx.roadmapWeek.findMany({
                where: { phase_id: phaseId },
                select: { progress: true },
            });

            const phaseProgress = phaseWeeks.length
                ? Math.round(
                    phaseWeeks.reduce((sum, w) => sum + w.progress, 0) /
                    phaseWeeks.length
                )
                : 0;

            await tx.roadmapPhase.update({
                where: { id: phaseId },
                data: { progress: phaseProgress },
            });

            // 4️⃣ Recalculate ROADMAP progress
            const roadmapPhases = await tx.roadmapPhase.findMany({
                where: { roadmap_id: roadmapId },
                select: { progress: true },
            });

            const roadmapProgress = roadmapPhases.length
                ? Math.round(
                    roadmapPhases.reduce((sum, p) => sum + p.progress, 0) /
                    roadmapPhases.length
                )
                : 0;

            await tx.roadmap.update({
                where: { id: roadmapId },
                data: { progress: roadmapProgress },
            });

            // 5️⃣ Update USER EXAM progress
            await tx.userExam.update({
                where: { id: userExamId },
                data: { progress_percent: roadmapProgress },
            });

            return {
                roadmapId,
                roadmapProgress,
            };
        });

        return NextResponse.json(
            { success: true, data: result },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("❌ [update-single-task] Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
