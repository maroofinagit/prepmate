
import { redirect } from "next/navigation";
import { db } from "../lib/db";
import { auth } from "../lib/auth";
import { headers } from "next/headers";
import ProfileClient from "@/components/ProfileClient";

export default async function ProfilePage() {

    const data = await auth.api.getSession({
        headers: await headers(),
    });

    if (!data?.session) {
        redirect("/signin");
    }

    const session = data.session;

    const user = await db.user.findUnique({
        where: { id: session.userId },
        include: {
            exams: {
                include: {
                    exam: true,
                },
            },
            notifications: {
                orderBy: { created_at: "desc" },
                take: 5,
            },
        },
    });

    if (!user) {
        return <div className="text-center mt-20 text-gray-500">User not found.</div>;
    }

    return (
        <ProfileClient user={user} />
    );
    
}
