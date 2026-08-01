import DashboardClient from "@/components/DashboardClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";
import { getTodaysTasks } from "@/app/actions/action";
import TodaysClient from "@/components/TodaysClient";

export default async function DashboardPage() {
    const data = await auth.api.getSession({
        headers: await headers(),
    });


    if (!data?.session) redirect("/signin");

    const todaysTasks = await getTodaysTasks(data.session.userId);

    if (!todaysTasks) {
        return <div className="text-center text-gray-500 mt-20">User not found.</div>;
    }

    return <TodaysClient todaysTasks={todaysTasks.tasks ?? []} />;
}
