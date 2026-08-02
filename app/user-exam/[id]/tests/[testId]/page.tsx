import { getTestById } from "@/app/actions/test";
import TestClient from "@/components/TestClient";
import { Button } from "@/components/ui/button";
import Link from "next/link";



export default async function TestPage({ params }: { params: Promise<{ id: string, testId: string }> }) {
    const { testId: testIdStr, id: id } = await params;

    const testId = parseInt(testIdStr);

    if (isNaN(testId)) {
        return <div className="text-center mt-10 font-semibold text-xl flex items-center justify-center h-screen">Invalid test ID</div>;
    }

    const res = await getTestById(testId);


    if (!res.success || res.data === undefined) {
        console.log("Test not found or failed to load:", res);
        return <div className="text-center mt-10 font-semibold text-xl flex items-center justify-center h-screen">Test not found</div>;
    }

    if (res.data.attempt !== null) {
        return <div className="text-center mt-10 font-semibold text-xl flex flex-col items-center justify-center h-screen">
            You have already attempted this {res.data.title || "test"}. You cannot attempt it again.<br />
            Check your result here:
            <Link href={`/user-exam/${id}/tests/${testId}/result`} className="mt-4">
                <Button className="text-blue-600 text-base border border-blue-600 bg-transparent hover:bg-blue-600 hover:text-white transition-colors duration-300 cursor-pointer ">
                    View Result
                </Button>
            </Link>
        </div>;
    }

    return (
        <TestClient test={res.data} userExamId={id} />
    );
}