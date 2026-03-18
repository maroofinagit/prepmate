import {db } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { user_exam_id } = await req.json();

    try {
        await db.userExam.delete({
            where: { id: user_exam_id },
        });

        return NextResponse.json({ message: "User exam deleted successfully" });
    } catch (error) {
        console.error("Error deleting user exam:", error);
        return NextResponse.json({ message: "Failed to delete user exam" }, { status: 500 });
    }
}