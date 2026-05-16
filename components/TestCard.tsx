"use client";

import { useRouter } from "next/navigation";
// import { canAttemptTestAction } from "../app/actions/test";
import { useState } from "react";

export default function TestCard({ test }: any) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const isCompleted = !!test.attempt;

    const handleClick = async () => {
        if (isCompleted) return;

        setLoading(true);

        // const res = await canAttemptTestAction(test.id);

        setLoading(false);

        // if (!res.allowed) {
        //     alert("Complete required tasks first");
        //     return;
        // }

        router.push(`/tests/${test.id}`);
    };

    return (
        <div className="border rounded-xl p-4 shadow-sm flex flex-col justify-between">

            {/* Title */}
            <div>
                <h3 className="font-semibold text-lg">{test.title}</h3>

                <p className="text-sm text-gray-500 mt-1">
                    {test.type === "WEEKLY" && `Week ${test.weekNumber}`}
                    {test.type === "PHASE" && `Phase ${test.phaseNumber}`}
                    {test.type === "FINAL" && `Final Test`}
                </p>
            </div>

            {/* Status */}
            <div className="mt-4">
                {isCompleted ? (
                    <span className="text-green-600 font-medium">✅ Completed</span>
                ) : (
                    <button
                        onClick={handleClick}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                    >
                        {loading ? "Checking..." : "Attempt Test"}
                    </button>
                )}
            </div>
        </div>
    );
}