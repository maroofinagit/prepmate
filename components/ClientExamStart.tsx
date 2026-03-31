'use client';

import { useState } from 'react';
import { addYears, format, addMonths, subYears } from 'date-fns';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export default function ClientExamStart({ exam }: { exam: any }) {
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const today = new Date();
    const [startDate, setStartDate] = useState(format(today, 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(addMonths(today, 6), 'yyyy-MM-dd'));
    const minStartDate = format(subYears(new Date(startDate), 3), 'yyyy-MM-dd');
    const minEndDate = format(addMonths(new Date(startDate), 3), "yyyy-MM-dd");
    const maxEndDate = format(addYears(new Date(startDate), 3), "yyyy-MM-dd");


    function startMessageLoop(messages: string[], interval = 1500) {
        let index = 0;
        setLoadingMessage(messages[index]);
        const id = setInterval(() => {
            index = (index + 1) % messages.length;
            setLoadingMessage(messages[index]);
        }, interval);
        return id; // you’ll use this to clear the loop
    }


    async function handleStartPreparing(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const formData = new FormData(event.currentTarget);
            const startDate = formData.get('start_date') as string;
            const endDate = formData.get('end_date') as string;

            console.log("Form Data:", { startDate, endDate });
            

            // Step 1: Create User Exam
            setLoadingMessage('Creating your user exam...');
            const userExamRes = await fetch(`/api/createUserExam`, {
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
            const roadmapRes = await fetch(`/api/roadmap`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_exam_id }),
            });

            clearInterval(loopId);

            const roadmapJson = await roadmapRes.json();
            if (!roadmapJson.success) {
                toast.error('Failed to generate roadmap. You can create one later from your dashboard.');
                setLoadingMessage('Failed to generate roadmap. Redirecting to dashboard...');
                await new Promise((r) => setTimeout(r, 2000));
                router.push('/dashboard');
                return;
            }

            setLoadingMessage('🎯 Roadmap ready! Redirecting to your dashboard...');
            await new Promise((r) => setTimeout(r, 1000));
            // Redirect to dashboard
            // redirect(`/dashboard/exam/${user_exam_id}`);
            router.push(`/dashboard/roadmap/${user_exam_id}`);

        } catch (err: any) {
            console.error(err);
            setError('Sorry, something went wrong. Please try again later.');
            setLoading(false);
        }
    }

    return (
        <div className="relative min-h-screen flex-col flex items-center justify-center overflow-hidden bg-[#ffffff]">

            {/* 🌤️ Soft Glow Background */}
            <div className="absolute inset-0">
                <div className="absolute w-150 h-150 bg-emerald-200/50 rounded-full blur-3xl -top-37.5 -left-37.5" />
                <div className="absolute w-125 h-125 bg-blue-200/50 rounded-full blur-3xl -bottom-37.5 -right-37.5" />
                <div className="absolute w-100 h-100 bg-purple-200/50 rounded-full blur-3xl top-[40%] left-[35%]" />
            </div>

            <div className="relative z-10 max-w-2xl text-center px-4 mb-12">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Start Preparing for Your Exam</h1>
                {loading ? (
                    <p className="text-gray-700 text-sm md:text-base">
                        We are setting up everything for you. This may take a minute, so grab a coffee ☕ and get ready to crush your preparation!
                    </p>
                ) : error ? (
                    <p className="text-gray-700 text-sm md:text-base">
                        ⚠️ {error}
                    </p>
                ) : (
                    <p className="text-gray-700 text-sm md:text-base">
                        Chose a start date from which you want to begin your preparation and end date till which you want to complete it. We will create a personalized roadmap for you based on this timeline. Don’t worry, you can adjust your timeline later if needed!
                    </p>
                )}

            </div>

            {/* 🌿 Center Card */}
            <div className="relative z-10 w-full max-w-md md:max-w-2xl mx-4">

                <div className="bg-white rounded-2xl shadow-xl border border-gray-300 p-8">

                    {/* Loading */}
                    {loading && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl z-50">
                            <div className="h-12 w-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-700 text-sm">{loadingMessage}</p>
                        </div>
                    )}

                    {/* Header */}
                    <h1 className="md:text-2xl text-lg font-semibold mb-4 text-gray-900 tracking-tight">
                        {exam.name}
                    </h1>
                    <p className="text-gray-700 text-sm md:text-base mt-1 mb-6">
                        Set your timeline and begin your preparation journey.
                    </p>

                    {/* Form */}
                    <form onSubmit={handleStartPreparing} className="space-y-5">

                        {/* Start Date */}
                        <div>
                            <label className="block text-xs text-gray-700 mb-1 uppercase tracking-wide">
                                Start Date
                            </label>
                            <input
                                type="date"
                                name="start_date"
                                min={minStartDate}
                                max={format(addYears(new Date(), 3), 'yyyy-MM-dd')}
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 
                                   focus:ring-2 focus:ring-black focus:bg-white outline-none transition"
                            />
                        </div>

                        {/* End Date */}
                        <div>
                            <label className="block text-xs text-gray-700 mb-1 uppercase tracking-wide">
                                Target Completion
                            </label>
                            <input
                                type="date"
                                name="end_date"
                                min={minEndDate}
                                max={maxEndDate}
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 
                                   focus:ring-2 focus:ring-black focus:bg-white outline-none transition"
                            />
                            <p className="text-xs md:text-sm text-gray-700 mt-1">
                                Min 3 months • Max 3 years
                            </p>
                        </div>

                        {/* CTA */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl font-semibold 
                               bg-black text-white 
                               transition-all duration-300 
                               hover:bg-emerald-400 hover:text-black 
                               hover:shadow-lg hover:shadow-emerald-200
                               active:scale-[0.98] disabled:opacity-60 cursor-pointer mt-4 text-sm md:text-base"
                        >
                            {loading ? "Setting things up..." : "Start Preparing"}
                        </button>

                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <a
                            href="/onboarding"
                        >
                            <Button variant='outline'
                                className=' hover:bg-black hover:text-white transition cursor-pointer'
                            >
                                ← Change exam
                            </Button>
                        </a>
                    </div>

                </div>
            </div>
        </div>
    );
}
