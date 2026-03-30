import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { db } from "@/app/lib/db";

export async function DELETE() {
    try {
        const data = await auth.api.getSession({
            headers: await headers(),
        });

        if (!data?.session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = data.session.userId;

        // delete user from database
        await db.user.delete({
            where: { id: userId },
        });

        // sign out the user
        await auth.api.signOut({
            headers: await headers(),
        });

        return NextResponse.json({ message: "Account deleted successfully" });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}