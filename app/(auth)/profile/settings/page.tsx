import { getProfileSetting } from "@/app/actions/action";
import { auth } from "@/app/lib/auth";
import ProfileSettingsClient from "@/components/ProfileSettingClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProfileSettings() {

    const data = await auth.api.getSession({
        headers: await headers(),
    });

    if (!data?.session) {
        redirect("/signin");
    }

    const session = data.session;


    if (!session.userId) {
        return <div className="text-center mt-20 text-gray-500 h-screen">User not found.</div>;
    }

    const userSettings = await getProfileSetting(session.userId);

    if (userSettings == null) {
        return <div className="text-center mt-20 text-gray-500 h-screen">User not found.</div>;
    }

    return (
        <ProfileSettingsClient userSettings={userSettings} userId={session.userId} />
    );

}