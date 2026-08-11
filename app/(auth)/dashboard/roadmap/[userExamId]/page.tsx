import { getCachedRoadmap } from "@/app/actions/action";
import { auth } from "@/app/lib/auth";
import RoadmapClient from "@/components/RoadmapClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface RoadmapPageProps {
    params: Promise<{ userExamId: string | undefined }>;
}

export default async function RoadmapPage({ params }: RoadmapPageProps) {
    const { userExamId } = await params;

    const data = await auth.api.getSession({
        headers: await headers(),
    });

    if (!data?.session) {
        redirect("/signin");
    }

    if (!userExamId) {
        return (
            <div className="text-center text-gray-600 flex justify-center items-center h-screen">
                Invalid User Exam ID.
            </div>
        );
    }

    // Convert param to number safely
    const roadmap = await getCachedRoadmap(Number(userExamId), data.session.userId);

    if (roadmap === null || roadmap === undefined) {
        return (
            <div className="text-center h-screen flex justify-center items-center text-gray-600">
                No roadmap generated for this user exam.
            </div>
        );
    }

    return (
        <RoadmapClient roadmap={roadmap} />
    );
}
