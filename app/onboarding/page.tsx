import OnboardingClient from "@/components/OnboardClient";
import { auth } from "../lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getFullExams, getUserExams } from "../actions/action";

export default async function OnboardingPage() {

    const headersData = await headers();

    const data = await auth.api.getSession({
        headers: headersData,
    })


    if (!data?.session) {
        redirect("/signin");
    }

    const exams = await getFullExams(); // ✅ runs on server, safe with Prisma
    const userExams = await getUserExams(data.session.userId);

    return <OnboardingClient exams={exams} userExams={userExams} />;
}
