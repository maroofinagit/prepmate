"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { cn } from "@/app/lib/utils";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { generateTestAttempt } from "@/app/actions/test";
import { motion } from "framer-motion";
import { useUser } from "@/app/context/userContext";
import { playError, playNotification } from "@/app/lib/sound";

type Test = {
    testId: number;
    title: string | null;
    description: string | null;
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
    const [newData, setNewData] = useState(data);


    const markTestAsGive = (testId: number) => {
        setNewData(prev => ({
            ...prev,
            weekly: prev.weekly.map(test =>
                test.testId === testId
                    ? { ...test, status: "GIVE" }
                    : test
            ),
            phase: prev.phase.map(test =>
                test.testId === testId
                    ? { ...test, status: "GIVE" }
                    : test
            ),
            final: prev.final.map(test =>
                test.testId === testId
                    ? { ...test, status: "GIVE" }
                    : test
            ),
        }));
    };

    if (newData.weekly.length === 0 && newData.phase.length === 0 && newData.final.length === 0) {
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

            <div className="md:hidden relative h-screen space-y-6 mt-20 py-12 px-4">
                <h1 className="text-2xl font-bold text-center">Tests of {newData.examName}</h1>
                <p className="text-gray-600 font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    Sorry the mobile view is not supported for this page. Please use a desktop or laptop to access the tests.
                </p>
            </div>

            <div className="hidden md:block space-y-10 min-h-screen mt-20 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold">Tests of {newData.examName}</h1>

                <p className="text-gray-600 tracking-wider leading-relaxed">
                    Here are the tests generated based on your roadmap.<br />
                    Click on <span className="font-bold text-blue-600">"GIVE"</span> to attempt a test or <span className="font-bold text-green-600">"GENERATE"</span> to create a new one.<br />
                    Test which are locked will require you to complete certain tasks or previous tests first.
                </p>
                <TestSection title="Weekly Tests" tests={newData.weekly} baseId={baseId} generatingTestId={generatingTestId} setGeneratingTestId={setGeneratingTestId} markTestAsGive={markTestAsGive} />
                <TestSection title="Phase Tests" tests={newData.phase} baseId={baseId} generatingTestId={generatingTestId} setGeneratingTestId={setGeneratingTestId} markTestAsGive={markTestAsGive} />
                <TestSection title="Final Tests" tests={newData.final} baseId={baseId} generatingTestId={generatingTestId} setGeneratingTestId={setGeneratingTestId} markTestAsGive={markTestAsGive} />
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
    markTestAsGive,
}: {
    title: string;
    tests: Test[];
    baseId: string;
    generatingTestId: number | null;
    setGeneratingTestId: (id: number | null) => void;
    markTestAsGive: (testId: number) => void;
}) {


    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">{title}</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6">

                {tests.length > 0 ? (
                    tests.map((test) => (
                        <motion.div
                            key={test.testId}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: 0.1 * tests.indexOf(test) }}
                        >
                            <TestCard
                                key={test.testId}
                                test={test}
                                baseId={baseId}
                                generatingTestId={generatingTestId}
                                setGeneratingTestId={setGeneratingTestId}
                                markTestAsGive={markTestAsGive}
                            />
                        </motion.div>

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
    markTestAsGive,
}: {
    test: any;
    baseId: string;
    generatingTestId: number | null;
    setGeneratingTestId: (id: number | null) => void;
    markTestAsGive: (testId: number) => void;
}) {

    const { soundEnabled } = useUser();
    const handleGenerate = async (testId: string) => {
        setGeneratingTestId(test.testId);
        toast.info("Starting test generation. This may take a few moments... Dont refresh the page !");
        try {
            const response = await generateTestAttempt(test.testId);
            if (!response.success) {
                throw new Error(response.message || "Failed to generate test");
            }
            if (soundEnabled) {
                playNotification();
            }
            toast.success("Test generation started successfully! Click on GIVE once the test is ready.");
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate a delay of 0.5 seconds
            setGeneratingTestId(null);
            markTestAsGive(test.testId);
            router.refresh();
        } catch (error) {
            if (soundEnabled) {
                playError();
            }
            console.error("Error generating test:", error);
            toast.error("An unexpected error occurred.");
        } finally {
            setGeneratingTestId(null);
        }
    }

    const router = useRouter();

    const handleStartTest = async (testId: number) => {
        try {
            toast("Ready to Start Test ?", {
                description: "Click on Start to begin the test, screen will be switched to fullscreen mode and you will not be able to switch tabs or exit the test until you submit it. Make sure you are ready before starting, the test will immediately begin once you click on Start.",
                action: {
                    label: "Start",
                    onClick: () => {
                        document.documentElement.requestFullscreen().catch((err) => {
                            throw new Error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                        });
                        router.push(`/user-exam/${baseId}/tests/${testId}`);
                    }
                },
                cancel: {
                    label: "Cancel",
                    onClick: () => toast.error("Test start cancelled"),
                },
                duration: Infinity, // Keep the toast open until user interacts
            });
        } catch (err) {
            console.error(err);
            toast.error("An error occurred while trying to start the test.");
        }
    };

    return (
        <Card className="p-4 border shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-between">
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
                        className="bg-blue-700 hover:bg-black text-white cursor-pointer"
                        onClick={() => handleStartTest(test.testId)}
                    >
                        Give Test
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