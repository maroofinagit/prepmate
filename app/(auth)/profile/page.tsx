
import { redirect } from "next/navigation";
import { db } from "@/app/lib/db";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import ProfileClient from "@/components/ProfileClient";
import { getProfileData } from "@/app/actions/action";

export default async function ProfilePage() {

    const data = await auth.api.getSession({
        headers: await headers(),
    });

    if (!data?.session) {
        redirect("/signin");
    }

    const userId = data.user.id;

    const user = await getProfileData(userId);

    if (!user) {
        return <div className="text-center mt-20 text-gray-500 h-screen">User not found.</div>;
    }

    return (
        <ProfileClient user={user} />
    );

}
