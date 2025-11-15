import { db } from "@/app/lib/db";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const milestoneId = Number(body?.milestoneId);

        if (!milestoneId || Number.isNaN(milestoneId)) {
            return NextResponse.json({ error: "Invalid milestoneId" }, { status: 400 });
        }

        // Check if milestone exists
        const milestone = await db.milestone.findUnique({
            where: { id: milestoneId },
            select: { id: true, achieved: true },
        });

        if (!milestone) {
            return NextResponse.json({ error: "Milestone not found" }, { status: 404 });
        }

        if (milestone.achieved) {
            return NextResponse.json({
                message: "Milestone already completed",
                milestone,
            }, { status: 200 });
        }

        // Mark as completed
        const updated = await db.milestone.update({
            where: { id: milestoneId },
            data: {
                achieved: true
            },
        });

        return NextResponse.json({
            message: "Milestone updated successfully"
        }, { status: 200 });
    } catch (err) {
        console.error("Error updating milestone:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
