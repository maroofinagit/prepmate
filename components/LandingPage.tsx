import { getShortExams, getUserExams } from "@/app/actions/action";
import Link from "next/link";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import { Button } from "./ui/button";
import VisitMobile from "./VisitMobile";

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
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 grid-cols-1 gap-0 md:gap-20 justify-center items-center">

                    {/* LEFT: LOGO IMAGE */}
                    <div className="relative w-full h-56 md:h-full flex justify-center md:justify-start">
                        <Image
                            src="/logo.jpg"
                            alt="PrepMate Logo"
                            fill
                            className="object-contain object-center"
                        />
                    </div>

                    {/* RIGHT: HEADING + PARA + BUTTON */}
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            Your Smart <span className="text-blue-400">Prep Companion</span>
                        </h1>

                        <p className="text-blue-100 md:text-xl max-w-xl md:max-w-2xl mb-10">
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
                <section className="py-14 px-12 bg-blue-50 text-center">
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
                        Welcome back, <span className="text-indigo-700">{user.name}</span>
                    </h2>

                    <p className="text-gray-600 mb-10">
                        Your ongoing preparation — pick up where you left off.
                    </p>

                    <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
                        {userExams.map((ue) => (
                            <div
                                key={ue.id}
                                className="p-6 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200 text-center"
                            >
                                <h3 className="text-xl font-semibold mb-2 text-indigo-800">{ue.exam.name}</h3>
                                <p className="text-gray-600 mb-4 md:text-base text-sm">
                                    Progress: {ue.progress_percent || 0}%
                                </p>

                                <Link
                                    href="/dashboard"
                                    className="inline-block px-5 py-2 cursor-pointer rounded-lg border text-indigo-800 border-indigo-800 hover:text-white hover:bg-indigo-800 transition font-medium"
                                >
                                    Continue →
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <VisitMobile />

            {/* ABOUT */}
            <section
                id="about"
                className="min-h-[80vh] flex items-center justify-center px-10 py-20 bg-linear-to-b from-gray-50 via-white to-gray-100"
            >
                <div className="max-w-4xl text-center">

                    <h2 className="text-2xl md:text-5xl font-bold mb-10 text-gray-900 leading-tight">
                        <span className="text-indigo-700">Preparation </span>with Path
                    </h2>

                    <p className="text-gray-600 text-sm md:text-xl leading-relaxed mb-6">
                        Preparation is not just about effort it is about direction.


                        <span className=" font-bold"> PrepMate</span> changes that by transforming scattered preparation into a structured journey.
                        Instead of guessing what to study next, you follow a clear roadmap tailored to your goals,
                        helping you build consistency and momentum over time. </p>

                    <p className="text-gray-600 text-sm md:text-xl leading-relaxed mb-6">
                        What would normally take hours of planning and still leave room for uncertainty is
                        streamlined through intelligent systems. By combining thoughtful design with AI-driven
                        guidance, PrepMate helps you make better decisions, faster reducing confusion and
                        increasing accuracy in your preparation.
                    </p>

                </div>

            </section>


            {/* FEATURES */}
            <section
                id="features"
                className="py-24 px-10 bg-linear-to-b from-white via-blue-50/40 to-white text-center relative overflow-hidden"
            >
                {/* subtle background glow */}
                <div className="absolute inset-0 -z-10">
                    <div className="w-125 h-125 bg-blue-200/30 blur-3xl rounded-full absolute -top-25 -left-25" />
                    <div className="w-100 h-100 bg-purple-200/20 blur-3xl rounded-full absolute -bottom-25 -right-25" />
                </div>

                <h2 className="text-2xl md:text-5xl font-bold mb-4 text-gray-900">
                    Smart <span className="text-blue-600">Features</span> for Smarter Prep
                </h2>

                <p className="text-gray-600 max-w-2xl mx-auto mb-16 md:text-lg">
                    Everything you need to stay consistent, track progress, and improve with clarity.
                </p>

                <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                    {[
                        {
                            title: "Personalized Roadmaps",
                            desc: "Structured paths aligned with your exam, eliminating confusion and guesswork.",
                            icon: "🧭",
                        },
                        {
                            title: "Progress Tracking",
                            desc: "Visual insights that reveal your strengths, gaps, and growth over time.",
                            icon: "📊",
                        },
                        {
                            title: "AI-Powered Insights",
                            desc: "Smart recommendations that help you study efficiently and stay ahead.",
                            icon: "⚡",
                        },
                    ].map((f) => (
                        <div
                            key={f.title}
                            className="group p-8 rounded-2xl bg-white/70 backdrop-blur-xl border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                        >
                            {/* icon */}
                            <div className="text-4xl mb-5">
                                {f.icon}
                            </div>

                            <h3 className="md:text-xl text-lg font-semibold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                                {f.title}
                            </h3>

                            <p className="text-gray-600 md:text-lg text-sm leading-relaxed">
                                {f.desc}
                            </p>

                            {/* subtle underline animation */}
                            <div className="w-0 h-0.5 bg-blue-600 mt-4 group-hover:w-12 transition-all duration-300 mx-auto" />
                        </div>
                    ))}
                </div>
            </section>

            {/* COURSES */}
            <section
                id="courses"
                className="py-24 px-10 bg-blue-50 text-center relative overflow-hidden"
            >
                {/* soft background glow */}
                <div className="absolute inset-0 -z-10">
                    <div className="w-112.5 h-112.5 bg-blue-100/40 blur-3xl rounded-full absolute -top-30 -right-25" />
                    <div className="w-87.5 h-87.5 bg-indigo-100/30 blur-3xl rounded-full absolute -bottom-30 -left-20" />
                </div>

                <h2 className="text-2xl md:text-5xl font-bold mb-4 text-gray-900">
                    Explore Your <span className="text-blue-600">Path</span>
                </h2>

                <p className="text-gray-600 max-w-2xl mx-auto mb-16 md:text-lg">
                    Choose your goal and begin a structured journey designed to take you from where you are to where you want to be.
                </p>

                <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                    {exams.map((exam) => (
                        <div
                            key={exam.id}
                            className="group gap-y-4 p-8 rounded-2xl bg-white/70 backdrop-blur-xl border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-left"
                        >
                            {/* course title */}
                            <h3 className="md:text-xl text-lg font-semibold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                                {exam.name}
                            </h3>

                            {/* description */}
                            <p className="text-gray-600 md:text-lg text-sm leading-relaxed">
                                {exam.description}
                            </p>

                            {/* CTA */}
                            <Link
                                href="/onboarding"
                                className="inline-flex items-center mt-2 gap-2 text-blue-600 font-medium group-hover:gap-3 transition-all"
                            >
                                Start Journey
                                <span className="transition-transform group-hover:translate-x-1">→</span>
                            </Link>

                            {/* subtle bottom line */}
                            <div className="w-0 h-0.5 bg-blue-600 mt-4 group-hover:w-16 transition-all duration-300" />
                        </div>
                    ))}
                </div>
            </section>

        </>
    );
}
