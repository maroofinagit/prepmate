import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import ProfileSecurityClient from "@/components/ProfileSecurityClient";
import { checkEmailExistsLogin, profileSecurityCheck } from "@/app/actions/action";

export default async function ProfileSecurityPage() {

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

    const userSecurity = await profileSecurityCheck(session.userId);

    if (userSecurity == null) {
        return <div className="text-center mt-20 text-gray-500 h-screen">User not found.</div>;
    }

    return (
        <ProfileSecurityClient security={userSecurity} />
    );

}
