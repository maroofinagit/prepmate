import { db } from "@/app/lib/db";
import DashboardClient from "@/components/DashboardClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../lib/auth";
import { getDashboardUser } from "../actions/action";

export default async function DashboardPage() {
    const data = await auth.api.getSession({
        headers: await headers(),
    });
    

    if (!data?.session) redirect("/signin");

    const dashboardUser = await getDashboardUser(data.session.userId);

    if (!dashboardUser) {
        return <div className="text-center text-gray-500 mt-20">User not found.</div>;
    }


    return <DashboardClient dashboardUser={dashboardUser} />;
}
