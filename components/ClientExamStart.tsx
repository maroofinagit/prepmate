'use client';

import { useState } from 'react';
import { addYears, format, addMonths, subYears } from 'date-fns';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { createUserExam } from '@/app/actions/action';
import { generateRoadmap } from '@/app/actions/roadmap';
import { playError, playNotification} from '@/app/lib/sound';
import { useUser } from '@/app/context/userContext';

export default function ClientExamStart({ exam }: { exam: any }) {

    const {soundEnabled} = useUser();
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

            // Step 1: Create User Exam
            setLoadingMessage('Creating your user exam...');
            const userExamRes = await createUserExam({
                examId: exam.id,
                start_date: startDate,
                end_date: endDate,
            })

            if (!userExamRes.success) {
                throw new Error('Failed to create user exam');
            }

            const { user_exam_id } = userExamRes;

            if (user_exam_id === undefined) {
                throw new Error('User exam ID is undefined');
            }


            setLoadingMessage('✅ User exam created successfully!');
            await new Promise((r) => setTimeout(r, 1000));

            // Step 2: Generate Roadmap
            const loadingMessages = [
                "Generating your roadmap... please wait ⏳",
                "Aligning tasks with your strategy…",
                "Calculating your weekly milestones…",
                "Creating Tests and Resources…",
                "Almost there… sprinkling the final touches ✨"
            ];

            const loopId = startMessageLoop(loadingMessages, 5000);

            // Step 2: Generate Roadmap
            const roadmapRes = await generateRoadmap(user_exam_id);

            clearInterval(loopId);

            if (!roadmapRes.success) {
                if(soundEnabled) {
                    playError();
                }
                toast.error('Failed to generate roadmap. You can create one later from your dashboard.', {
                    duration: 2000,
                });
                setLoadingMessage('Failed to generate roadmap. Redirecting to dashboard...');
                await new Promise((r) => setTimeout(r, 2000));
                router.replace('/dashboard');
                return;
            }

            if (soundEnabled) {
                playNotification();
            }
            toast.success('🎉 Roadmap generated successfully! Redirecting to your dashboard...');
            setLoadingMessage('🎯 Roadmap ready! Redirecting to your dashboard...');
            await new Promise((r) => setTimeout(r, 1000));

            // Redirect to roadmap page
            router.replace(`/dashboard/roadmap/${user_exam_id}`);
            setLoading(false);

        } catch (err: any) {
            console.error(err);
            if (soundEnabled) {
                playError();
            }
            toast.error('Sorry, something went wrong. Please try again later.', {
                duration: 2000,
            });
            setLoading(false);
        }
    }

    const { name } = useUser();

    return (
        <>
            {
                loading && (
                    <div className="fixed h-screen inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-6 cursor-not-allowed">
                        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border text-center space-y-5">

                            <div className="text-sm text-justify tracking-tight text-gray-500 flex flex-col gap-y-2">
                            <span>
                                Hey {name?.split(" ")[0] || "there"} ! Your roadmap is being carefully built and may take around <span className="font-bold whitespace-nowrap">5-7</span> minutes as its a big responsible task. The app may seem hanged but it's not, don’t worry it’s still working in the background.
                            </span>
                            <span>
                                ☕️ Brew yourself a coffee, scroll for a while and let us handle the planning. We’ll let you know with a notification sound as soon as your roadmap is ready.
                            </span>
                        </div>

                            <div className="flex justify-center">
                                <div className="h-14 w-14 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-2xl font-semibold text-gray-800">
                                    Generating Your Roadmap for {exam.name}
                                </h2>

                                <p className="text-sm leading-relaxed text-gray-500">
                                    {loadingMessage}
                                </p>
                            </div>

                            <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-3">
                                <p className="text-sm text-blue-700 font-medium">
                                    Please do not refresh or close this page.
                                </p>
                            </div>
                        </div>
                    </div>
                )
            }

            <div className="md:hidden relative min-h-screen pt-16 px-6 flex-col flex items-center justify-center overflow-hidden bg-[#ffffff]">
                <p className="text-gray-700 text-sm md:text-base text-center px-4">
                    ⚠️ This feature is only available on desktop. Please switch to a desktop device to start preparing for your exam.
                </p>
            </div>

            <div className="hidden relative min-h-screen pt-16 flex-col md:flex items-center justify-center overflow-hidden bg-[#ffffff]">

                {/* 🌤️ Soft Glow Background */}
                <div className="absolute inset-0">
                    <div className="absolute w-150 h-150 bg-emerald-200/50 rounded-full blur-3xl -top-37.5 -left-37.5" />
                    <div className="absolute w-125 h-125 bg-blue-200/50 rounded-full blur-3xl -bottom-37.5 -right-37.5" />
                    <div className="absolute w-100 h-100 bg-purple-200/50 rounded-full blur-3xl top-[40%] left-[35%]" />
                </div>

                <div className="relative z-10 max-w-2xl text-center px-4 mb-12">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Start Preparing for Your Exam</h1>
                    {error ? (
                        <p className="text-gray-700 text-sm md:text-base">
                            ⚠️ {error}
                        </p>
                    ) : (
                        <p className="text-gray-700 text-sm md:text-base">
                            Choose a start date from which you want to begin your preparation and end date till which you want to complete it. We will create a personalized roadmap for you based on this timeline. Don’t worry, you can adjust your timeline later if needed!
                        </p>
                    )}

                </div>

                {/* 🌿 Center Card */}
                <div className="relative z-10 w-full max-w-md md:max-w-2xl mx-4">

                    <div className="bg-white rounded-2xl shadow-xl border border-gray-300 p-8">


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
                               hover:bg-emerald-500 hover:text-black 
                               hover:shadow-lg hover:shadow-emerald-200
                               active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-4 text-sm md:text-base"
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
        </>
    );
}
