'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { redirect } from 'next/navigation';

export default function ClientExamStart({ exam }: { exam: any }) {
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState('');

    function startMessageLoop(messages: string[], interval = 1500) {
        let index = 0;
        setLoadingMessage(messages[index]);
        const id = setInterval(() => {
            index = (index + 1) % messages.length;
            setLoadingMessage(messages[index]);
        }, interval);
        return id; // you’ll use this to clear the loop
    }


    async function handleStartPreparing(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const formData = new FormData(event.currentTarget);
            const startDate = formData.get('start_date') as string;
            const endDate = formData.get('end_date') as string;

            // Step 1: Create User Exam
            setLoadingMessage('Creating your user exam...');
            const userExamRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/createUserExam`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    examId: exam.id,
                    start_date: startDate,
                    end_date: endDate,
                }),
            })

            const userExamJson = await userExamRes.json();

            if (!userExamJson.success) {
                throw new Error('Failed to create user exam');
            }

            const { user_exam_id } = userExamJson;

            setLoadingMessage('✅ User exam created successfully!');
            await new Promise((r) => setTimeout(r, 1000));

            // Step 2: Generate Roadmap
            const loadingMessages = [
                "Generating your roadmap... please wait ⏳",
                "Aligning tasks with your strategy…",
                "Calculating your weekly milestones…",
                "Almost there… sprinkling the final touches ✨"
            ];

            const loopId = startMessageLoop(loadingMessages, 5000);

            // Step 2: Generate Roadmap
            const roadmapRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/roadmap`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_exam_id }),
            });

            clearInterval(loopId);

            const roadmapJson = await roadmapRes.json();
            if (!roadmapJson.success) {
                throw new Error('Failed to generate roadmap');
            }

            setLoadingMessage('🎯 Roadmap ready! Redirecting to your dashboard...');
            await new Promise((r) => setTimeout(r, 1000));
            // Redirect to dashboard
            redirect(`/dashboard/exam/${user_exam_id}`);

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Something went wrong');
            setLoading(false);
        }
    }

    return (
        <div className="relative">
            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-50 rounded-2xl">
                    <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-600 mb-6"></div>
                    <p className="text-lg font-semibold text-gray-700 text-center px-6">{loadingMessage}</p>
                </div>
            )}

            <h1 className="text-3xl font-bold mb-2">{exam.name}</h1>
            <p className="text-gray-600 mb-6">
                Set your preparation duration and begin your journey toward success.
            </p>

            {error && (
                <div className="mb-4 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                    ⚠️ {error}
                </div>
            )}

            <form onSubmit={handleStartPreparing} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Enter the date you plan to start preparing:
                    </label>
                    <input
                        type="date"
                        name="start_date"
                        required
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                        defaultValue={format(new Date(), 'yyyy-MM-dd')}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Enter the expected completion date:
                    </label>
                    <input
                        type="date"
                        name="end_date"
                        required
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
                >
                    {loading ? 'Please wait...' : 'Start Preparing'}
                </button>
            </form>

            <div className="mt-8 text-center">
                <a
                    href="/onboarding"
                    className="inline-block text-blue-600 hover:underline"
                >
                    ← Back to Exams
                </a>
            </div>
        </div>
    );
}
