import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { db } from "@/app/lib/db";

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { image } = await req.json();

        await db.user.update({
            where: { id: session.user.id },
            data: { image },
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
