import { getRoadmapByUserExamId } from "@/app/actions/action";
import RoadmapClient from "@/components/RoadmapClient";

interface RoadmapPageProps {
    params: Promise<{ userExamId: string | undefined }>;
}

export default async function RoadmapPage({ params }: RoadmapPageProps) {
    const { userExamId } = await params;

    if (!userExamId) {
        return (
            <div className="text-center text-gray-600 flex justify-center items-center h-screen">
                Invalid User Exam ID.
            </div>
        );
    }

    // Convert param to number safely
    const roadmap = await getRoadmapByUserExamId(Number(userExamId));

    if (!roadmap ) {
        return (
            <div className="text-center h-screen flex justify-center items-center text-gray-600">
                No roadmap generated for this user exam.
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <RoadmapClient roadmap={roadmap} />
        </div>
    );
}
