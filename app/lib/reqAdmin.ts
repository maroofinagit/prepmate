import { redirect } from "next/navigation";
import { auth } from "./auth";
import { headers } from "next/headers";
import { db } from "./db";

export async function reqAdmin() {
    const session = await auth.api.getSession({
        headers: await headers() // you need to pass the headers object.
    })


    if (!session?.user?.id) {
        redirect("/signin");
    }

    const user = await db.user.findUnique({
        where: {
            email: session.user.email,
        },
        select: {
            role: true,
        },
    });

    if (user?.role !== "admin") {
        redirect("/signin");
    }


    return session;
}
