"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Question {
    id: number;
    question: string;
    options: string[];
    topic: string;
    difficulty: string;
    marks: number;
}

interface TestProps {
    test: {
        id: number;
        title: string;
        description: string | null;
        totalMarks: number;
        duration: number | null;
        questions: Question[];
        attempt: any;
    };
}

export default function TestClient({ test }: TestProps) {
    const [currentQ, setCurrentQ] = useState(0);

    const [responses, setResponses] = useState<Record<number, string>>({});

    const [timeLeft, setTimeLeft] = useState(test.duration || 15 * 60);

    const [submitting, setSubmitting] = useState(false);

    const [autoSubmitted, setAutoSubmitted] = useState(false);

    const router = useRouter();

    // =========================
    // SAFETY CHECK
    // =========================
    if (!test.questions || test.questions.length === 0) {
        return (
            <div className="h-screen flex items-center justify-center text-xl font-semibold">
                No Questions Available<br />
                Regenerate your test to get questions or contact support if the issue persists.
            </div>
        );
    }

    const question = test.questions[currentQ];

    // =========================
    // TIMER
    // =========================
    useEffect(() => {
        if (autoSubmitted) return;
        if (timeLeft <= 0) {
            setAutoSubmitted(true);
            handleSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // =========================
    // LOAD SAVED DATA
    // =========================
    useEffect(() => {
        const saved = localStorage.getItem(`test-${test.id}`);

        if (saved) {
            const parsed = JSON.parse(saved);

            setResponses(parsed.responses || {});
            setTimeLeft(parsed.timeLeft || 15 * 60);
        }
    }, [test.id]);

    // =========================
    // SAVE DATA
    // =========================
    useEffect(() => {
        localStorage.setItem(
            `test-${test.id}`,
            JSON.stringify({
                responses,
                timeLeft,
            })
        );
    }, [responses, timeLeft, test.id]);

    // =========================
    // PREVENT TAB CLOSE
    // =========================
    useEffect(() => {
        const handler = (e: BeforeUnloadEvent) => {
            e.preventDefault();
        };

        window.addEventListener("beforeunload", handler);

        return () => {
            window.removeEventListener("beforeunload", handler);
        };
    }, []);

    // =========================
    // SELECT ANSWER
    // =========================
    const handleSelect = (option: string) => {
        setResponses((prev) => ({
            ...prev,
            [question.id]: option,
        }));
    };

    // =========================
    // CLEAR ANSWER
    // =========================
    const handleClearAnswer = () => {
        setResponses((prev) => {
            const updated = { ...prev };

            delete updated[question.id];

            return updated;
        });
    };

    // =========================
    // FORMAT TIMER
    // =========================
    const minutes = Math.floor(timeLeft / 60);

    const seconds = timeLeft % 60;

    // =========================
    // SUBMIT TEST
    // =========================
    const handleSubmit = async () => {

        if (submitting) return;

        try {

            setSubmitting(true);

            toast.loading("Submitting your test...");

            const res = await fetch("/api/tests/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    testId: test.id,
                    responses,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Failed to submit test");
                return;
            }

            toast.success("Test submitted successfully!");

            console.log("Submission Result:", data);

            // remove saved localstorage
            localStorage.removeItem(`test-${test.id}`);

            // optional redirect
            router.push(`/user-exam/${test.id}/tests/${test.id}/result`);

        } catch (err: any) {

            console.error(err);

            toast.error(err.message || "Something went wrong");

        } finally {

            setSubmitting(false);

        }

    };

    const answeredCount = Object.keys(responses).length;

    return (
        <div className="min-h-screen bg-zinc-100 lg:px-10 px-6 pt-32 pb-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* ========================= */}
                {/* MAIN PANEL */}
                {/* ========================= */}
                <div className="lg:col-span-3 bg-white rounded-3xl shadow-lg p-8">

                    {/* HEADER */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                        <div>
                            <h1 className="text-3xl font-bold text-zinc-800">
                                {test.title}
                            </h1>

                            <p className="text-zinc-500 mt-2">
                                {test.description}
                            </p>
                        </div>

                        {/* TIMER */}
                        <div className={` text-white px-6 py-4 rounded-2xl shadow-md w-max ${timeLeft <= 60 ? " animate-pulse" : ""} ${timeLeft <= 60 ? "bg-red-600" : "bg-black"} ${autoSubmitted ? "opacity-50 cursor-not-allowed" : ""}`}>
                            <div className="text-sm opacity-70 mb-1">
                                Time Remaining
                            </div>

                            <div className="text-2xl font-bold">
                                {timeLeft <= 60 ? "⚠ " : "⏱ "}
                                {minutes}:{seconds.toString().padStart(2, "0")}
                            </div>
                        </div>
                    </div>

                    {/* PROGRESS */}
                    <div className="mb-10">
                        <div className="flex justify-between text-sm text-zinc-600 mb-2">
                            <span>
                                Progress
                            </span>

                            <span>
                                {answeredCount}/{test.questions.length} Answered
                            </span>
                        </div>

                        <div className="w-full h-3 bg-zinc-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-black transition-all duration-300"
                                style={{
                                    width: `${(answeredCount / test.questions.length) * 100}%`,
                                }}
                            />
                        </div>
                    </div>

                    {/* QUESTION */}
                    <div className="mb-8">

                        <div className="flex items-center justify-between mb-4">

                            <div className="text-sm text-zinc-500">
                                Question {currentQ + 1} of {test.questions.length}
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 rounded-full bg-zinc-100 text-sm">
                                    {question.topic}
                                </span>

                                <span className="px-3 py-1 rounded-full bg-zinc-100 text-sm">
                                    {question.marks} Marks
                                </span>
                            </div>
                        </div>

                        <h2 className="text-2xl font-semibold text-zinc-800 leading-relaxed">
                            {question.question}
                        </h2>
                    </div>

                    {/* OPTIONS */}
                    <div className="space-y-4">

                        {question.options.map((opt, idx) => {

                            const selected =
                                responses[question.id] === opt;

                            return (
                                <button
                                    disabled={submitting}
                                    key={idx}
                                    onClick={() => handleSelect(opt)}
                                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-200

                                    ${selected
                                            ? "bg-black text-white border-black shadow-lg scale-[1.01]"
                                            : "bg-white border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50"
                                        }
                                    
                                    `}
                                >
                                    <div className="flex items-center gap-4">

                                        <div
                                            className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm

                                            ${selected
                                                    ? "bg-white text-black"
                                                    : "bg-zinc-100 text-zinc-700"
                                                }
                                            
                                            `}
                                        >
                                            {String.fromCharCode(65 + idx)}
                                        </div>

                                        <span className="text-base">
                                            {opt}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* NAVIGATION */}
                    <div className="flex items-center justify-between gap-4 mt-10">

                        <Button
                            variant="outline"
                            disabled={currentQ === 0 || submitting}
                            onClick={() =>
                                setCurrentQ((prev) => prev - 1)
                            }
                            className="rounded-xl px-6 py-5 cursor-pointer disabled:cursor-not-allowed hover:bg-blue-700 hover:text-white"
                        >
                            Previous
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleClearAnswer}
                            disabled={!responses[question.id] || submitting}
                            className="rounded-xl px-6 py-5 cursor-pointer"
                        >
                            Clear Answer
                        </Button>

                        <Button
                            disabled={currentQ === test.questions.length - 1 || submitting}
                            onClick={() =>
                                setCurrentQ((prev) => prev + 1)
                            }
                            className="rounded-xl px-6 py-5 bg-black hover:bg-blue-700 hover:text-white cursor-pointer disabled:cursor-not-allowed"
                        >
                            Next
                        </Button>
                    </div>
                </div>

                {/* ========================= */}
                {/* RIGHT PANEL */}
                {/* ========================= */}
                <div className="bg-white rounded-3xl shadow-lg p-6 h-fit sticky top-32 border border-zinc-200 ">

                    <h3 className="text-xl font-bold text-zinc-800 mb-6">
                        Questions
                    </h3>

                    {/* QUESTION PALETTE */}
                    <div className="grid grid-cols-5 gap-3">

                        {test.questions.map((q, idx) => {

                            const answered = responses[q.id];

                            return (
                                <button
                                    key={q.id}
                                    onClick={() => setCurrentQ(idx)}
                                    className={`

                                    h-12 w-12 rounded-xl font-semibold transition-all duration-200

                                    ${currentQ === idx
                                            ? "bg-black text-white"
                                            : answered
                                                ? "bg-green-100 text-green-700 border border-green-300"
                                                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                                        }

                                    `}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>

                    {/* LEGEND */}
                    <div className="mt-8 space-y-3 text-sm">

                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-black rounded" />
                            <span>Current Question</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded" />
                            <span>Answered</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-zinc-100 rounded" />
                            <span>Not Answered</span>
                        </div>
                    </div>

                    {/* SUMMARY */}
                    <div className="mt-8 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">

                        <div className="flex justify-between text-sm mb-2">
                            <span>Total Questions</span>
                            <span>{test.questions.length}</span>
                        </div>

                        <div className="flex justify-between text-sm mb-2">
                            <span>Answered</span>
                            <span>{answeredCount}</span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span>Remaining</span>
                            <span>
                                {test.questions.length - answeredCount}
                            </span>
                        </div>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="mt-8">

                        <Button
                            onClick={() => {
                                toast.custom((t) => (
                                    <div className="bg-white border shadow-xl rounded-2xl p-5 w-87.5">

                                        <h3 className="text-lg font-semibold mb-2">
                                            Submit Test?
                                        </h3>

                                        <p className="text-sm text-zinc-600 mb-5">
                                            Are you sure you want to submit your test?
                                            You won’t be able to change your answers after submission.
                                        </p>

                                        <div className="flex justify-end gap-3">

                                            <Button
                                                variant="outline"
                                                onClick={() => toast.dismiss(t)}
                                            >
                                                Cancel
                                            </Button>

                                            <Button
                                                className="bg-black hover:bg-green-700 hover:text-white cursor-pointer"
                                                onClick={async () => {
                                                    toast.dismiss(t);

                                                    await handleSubmit();
                                                }}
                                            >
                                                Yes, Submit
                                            </Button>
                                        </div>
                                    </div>
                                ));
                            }}
                            disabled={submitting}
                            className="w-full bg-black hover:bg-green-700 hover:text-white rounded-xl py-6 text-base cursor-pointer"
                        >
                            {submitting
                                ? "Submitting..."
                                : "Submit Test"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}