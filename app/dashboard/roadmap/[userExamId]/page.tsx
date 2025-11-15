import { getRoadmapByUserExamId } from "@/app/actions/action";
import RoadmapClient from "@/components/RoadmapClient";

interface RoadmapPageProps {
    params: Promise<{ userExamId: string | undefined }>;
}

export default async function RoadmapPage({ params }: RoadmapPageProps) {
    const { userExamId } = await params;

    if (!userExamId) {
        return (
            <div className="text-center mt-16 text-gray-600">
                Invalid User Exam ID.
            </div>
        );
    }

    // Convert param to number safely
    const roadmap = await getRoadmapByUserExamId(Number(userExamId));

    if (!roadmap ) {
        return (
            <div className="text-center mt-16 text-gray-600">
                No roadmap found for this user exam.
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <RoadmapClient roadmap={roadmap} />
        </div>
    );
}
