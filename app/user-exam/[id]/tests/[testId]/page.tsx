import { getTestById } from "@/app/actions/test";
import TestClient from "@/components/TestClient";



export default async function TestPage({ params }: { params: Promise<{ id: string, testId: string }> }) {
    const {  testId: testIdStr } = await params;

    const testId = parseInt(testIdStr);

    if (isNaN(testId)) {
        return <div className="text-center mt-10 font-semibold text-xl flex items-center justify-center h-screen">Invalid test ID</div>;
    }

    const res = await getTestById(testId);

    if (!res.success || res.data === undefined) {
        console.log("Test not found or failed to load:", res);
        return <div className="text-center mt-10 font-semibold text-xl flex items-center justify-center h-screen">Test not found</div>;
    }


    return (
        <TestClient test={res.data} />
    );
}