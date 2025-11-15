import { getShortExams, getUserExams } from "@/app/actions/action";
import Link from "next/link";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import { Button } from "./ui/button";

export default async function LandingPage() {
    const headersData = await headers();
    const data = await auth.api.getSession({ headers: headersData });
    const user = data?.session?.userId ? data.user : null;

    const exams = await getShortExams();
    let userExams: any[] = user ? await getUserExams(user.id) : [];

    const isGuest = !user;
    const isLoggedNoExam = user && userExams.length === 0;
    const isLoggedWithExam = user && userExams.length > 0;

    return (
        <>
            {/* HERO */}
            <section className="pt-32 pb-15 px-10 bg-[#0d2f55]">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 grid-cols-1 gap-10 md:gap-20 justify-center items-center">

                    {/* LEFT: LOGO IMAGE */}
                    <div className="relative w-full h-64 md:h-full flex justify-center md:justify-start">
                        <Image
                            src="/logo.jpg"
                            alt="PrepMate Logo"
                            fill
                            className="object-contain object-center"
                        />
                    </div>

                    {/* RIGHT: HEADING + PARA + BUTTON */}
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            Your Smart <span className="text-blue-400">Prep Companion</span>
                        </h1>

                        <p className="text-blue-100 text-lg md:text-xl max-w-xl md:max-w-2xl mb-10">
                            Plan, track, and master your exam journey with intelligent tools and personalized learning paths.
                        </p>

                        {(isGuest || isLoggedNoExam) && (
                            <Button
                                asChild
                                className=" py-5 border bg-transparent border-white text-white hover:bg-blue-400 hover:text-[#0d2f55] hover:border-blue-400 text-base md:text-lg transition"
                            >

                                <Link
                                    href="/onboarding"
                                >
                                    {isGuest ? "Start Learning" : "Continue Setup"}
                                </Link>
                            </Button>
                        )}
                    </div>

                </div>

            </section>


            {/* USER EXAMS */}
            {isLoggedWithExam && (
                <section className="py-14 px-6 bg-blue-50/60 text-center">
                    <h2 className="text-3xl font-semibold text-gray-900 mb-2">
                        Welcome back, <span className="text-blue-700">{user.name}</span>
                    </h2>

                    <p className="text-gray-600 mb-10">
                        Your ongoing preparation — pick up where you left off.
                    </p>

                    <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
                        {userExams.map((ue) => (
                            <div
                                key={ue.id}
                                className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 text-center"
                            >
                                <h3 className="text-lg font-semibold mb-2 text-blue-700">{ue.exam.name}</h3>
                                <p className="text-gray-600 mb-4 md:text-base text-sm">
                                    Progress: {ue.progress_percent || 0}%
                                </p>

                                <Link
                                    href="/dashboard"
                                    className="inline-block px-5 py-2 rounded-lg border text-blue-700 border-blue-700 hover:text-white hover:bg-blue-700 transition text-sm font-medium"
                                >
                                    Continue →
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ABOUT (Smoother, tighter) */}
            <section id="about" className="py-20 px-6 text-center bg-white">
                <h2 className="text-3xl font-bold mb-6 text-gray-900">About PrepMate</h2>

                <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                    PrepMate helps you stay disciplined and consistent by combining structured roadmaps,
                    meaningful analytics, and AI-powered insights that guide your preparation from start to finish ensuring every study session counts.
                </p>
            </section>

            {/* FEATURES (Unified card style) */}
            <section id="features" className="py-20 px-6 bg-blue-50 text-center">
                <h2 className="text-3xl font-bold mb-12 text-gray-900">Features</h2>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {[
                        {
                            title: "Personalized Roadmaps",
                            desc: "Tailored study paths crafted to match your exam's demands.",
                        },
                        {
                            title: "Progress Tracking",
                            desc: "Clear analytics help you measure, adjust, and improve.",
                        },
                        {
                            title: "AI Insights",
                            desc: "Smart suggestions elevate your study efficiency instantly.",
                        },
                    ].map((f) => (
                        <div
                            key={f.title}
                            className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
                        >
                            <h3 className="text-xl font-semibold mb-3 text-blue-600">{f.title}</h3>
                            <p className="text-gray-600 text-sm">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* COURSES (Beautiful & consistent) */}
                <section id="courses" className="py-20 px-6 text-center bg-white">
                    <h2 className="text-3xl font-bold mb-12 text-gray-900">Explore Courses</h2>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {exams.map((exam) => (
                            <div
                                key={exam.id}
                                className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
                            >
                                <h3 className="text-xl font-semibold mb-2 text-blue-600">{exam.name}</h3>
                                <p className="text-gray-600 text-sm mb-5">{exam.description}</p>

                                <Link
                                    href="/onboarding"
                                    className="text-blue-600 font-medium hover:underline text-sm"
                                >
                                    Enroll Now →
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>
            
        </>
    );
}
