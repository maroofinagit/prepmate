"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { cn } from "@/app/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { is } from "date-fns/locale";

type Test = {
    testId: number;
    title: string | null;
    description: string | null;
    type: "WEEKLY" | "PHASE" | "FINAL";
    status: 'LOCKED' | 'GENERATE' | 'GIVE' | 'ATTEMPTED';
    createdAt: Date;
};

interface TestsClientProps {
    data: {
        weekly: Test[];
        phase: Test[];
        final: Test[];
        examName?: string;
    };
    baseId: string;
}

export default function TestsClient({ data, baseId }: TestsClientProps) {

    const [generatingTestId, setGeneratingTestId] = useState<number | null>(null);

    if (data.weekly.length === 0 && data.phase.length === 0 && data.final.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center p-10 mt-20">
                <h2 className="text-xl font-medium text-gray-500">
                    No tests available. Regenerate your roadmap to create tests!
                </h2>
            </div>
        );
    }

    return (
        <>
            {generatingTestId !== null && (
                <div className="fixed h-screen inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-6">
                    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border text-center space-y-5">

                        <div className="flex justify-center">
                            <div className="h-14 w-14 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold text-gray-800">
                                Generating Your Test
                            </h2>

                            <p className="text-sm leading-relaxed text-gray-500">
                                Our AI is preparing personalized questions based on your roadmap topics and progress.
                            </p>
                        </div>

                        <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-3">
                            <p className="text-sm text-blue-700 font-medium">
                                Please do not refresh or close this page.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-10 min-h-screen mt-20 p-10">
                <h1 className="text-3xl font-bold">Tests of {data.examName}</h1>

                <p className="text-gray-600 tracking-wider leading-relaxed">
                    Here are the tests generated based on your roadmap.<br />
                    Click on <span className="font-bold text-blue-600">"GIVE"</span> to attempt a test or <span className="font-bold text-green-600">"GENERATE"</span> to create a new one.<br />
                    Test which are locked will require you to complete certain tasks or previous tests first.
                </p>
                <TestSection title="Weekly Tests" tests={data.weekly} baseId={baseId} generatingTestId={generatingTestId} setGeneratingTestId={setGeneratingTestId} />
                <TestSection title="Phase Tests" tests={data.phase} baseId={baseId} generatingTestId={generatingTestId} setGeneratingTestId={setGeneratingTestId} />
                <TestSection title="Final Tests" tests={data.final} baseId={baseId} generatingTestId={generatingTestId} setGeneratingTestId={setGeneratingTestId} />
            </div>
        </>
    );
}

function TestSection({
    title,
    tests,
    baseId,
    generatingTestId,
    setGeneratingTestId,
}: {
    title: string;
    tests: Test[];
    baseId: string;
    generatingTestId: number | null;
    setGeneratingTestId: (id: number | null) => void;
}) {


    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">{title}</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">

                {tests.length > 0 ? (
                    tests.map((test) => (
                        <TestCard
                            key={test.testId}
                            test={test}
                            baseId={baseId}
                            generatingTestId={generatingTestId}
                            setGeneratingTestId={setGeneratingTestId}
                        />

                    ))
                ) : (
                    <p className="text-gray-500">No tests available.</p>
                )}
            </div>
        </div>
    );
}



function TestCard({
    test,
    baseId,
    generatingTestId,
    setGeneratingTestId,
}: {
    test: any;
    baseId: string;
    generatingTestId: number | null;
    setGeneratingTestId: (id: number | null) => void;
}) {

    const router = useRouter();

    const handleGenerate = async (testId: string) => {
        setGeneratingTestId(test.testId);
        toast.info("Starting test generation. This may take a few moments... Dont refresh the page !");
        try {
            const response = await fetch(`/api/tests/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ testId }),
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Test generation started successfully! Click on GIVE once the test is ready.");
                router.refresh();
            } else {
                toast.error(data.message || "Failed to start test generation.");
            }
        } catch (error) {
            toast.error("An unexpected error occurred.");
        } finally {
            setGeneratingTestId(null);
        }
    }

    return (
        <Card className="p-4 border shadow-sm hover:shadow-md transition-shadow ">
            <CardHeader>
                <h3 className="text-lg font-medium">{test.title}</h3>
            </CardHeader>

            <CardContent>
                <p className="text-sm text-gray-600">
                    {test.description || "No description available."}
                </p>
            </CardContent>

            <CardFooter>
                {test.status === 'GIVE' ? (
                    <Button
                        asChild
                        className="bg-blue-700 hover:bg-black text-white cursor-pointer"
                    >
                        <Link href={`/user-exam/${baseId}/tests/${test.testId}`}>
                            GIVE 🚀
                        </Link>
                    </Button>
                ) : test.status === 'GENERATE' ? (
                    <Button
                        onClick={() => handleGenerate(test.testId)}
                        disabled={generatingTestId !== null}
                        className="bg-green-700 hover:bg-blue-700 text-white cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        GENERATE 🎯
                    </Button>
                ) : test.status === 'ATTEMPTED' ? (
                    <Button
                        asChild
                        className="bg-gray-700 hover:bg-black text-white cursor-pointer"
                    >
                        <Link href={`/user-exam/${baseId}/tests/${test.testId}/result`}>
                            VIEW RESULT 📊
                        </Link>
                    </Button>
                ) : (
                    <Button
                        className={cn("cursor-not-allowed", test.status === 'GENERATING' ? "bg-yellow-500 text-white" : "bg-red-700 text-white")}
                    >
                        {test.status === 'GENERATING'
                            ? 'GENERATING...'
                            : 'LOCKED 🔒'}
                    </Button>
                )}
            </CardFooter>

        </Card>
    );
}