
import { headers } from "next/headers";
import { auth } from "./auth";
import { db } from "./db";

export async function isAdmin() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session?.user?.email) return false;

    const user = await db.user.findUnique({
        where: { email: session.user.email },
        select: { role: true },
    });

    return user?.role === 'admin';
}