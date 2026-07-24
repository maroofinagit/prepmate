import { getTestsForUserExam } from "@/app/actions/test";
import TestsClient from "@/components/TestsClient";

// export const revalidate = 0; // Disable caching for this page

export default async function TestPage({ params }: { params: Promise<{ id: string }> }) {
    
    const { id } = await params;

    const { data } = await getTestsForUserExam(parseInt(id));    

    return (
        <TestsClient
            data={data ?? { weekly: [], phase: [], final: [] }}
            baseId={id}
        />
    );
}