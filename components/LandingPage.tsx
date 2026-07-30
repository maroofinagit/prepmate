"use client";

import Link from "next/link";
import Image from "next/image";
import VisitMobile from "./VisitMobile";
import ToastLogin from "./ToastLogin";
import {
    CheckCircle2,
    Compass,
    LineChart,
    Sparkles,
    Flag,
    BookOpen,
    ArrowRight,
    Route,
    Brain,
    BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";

interface LandingPageProps {
    user: any | null;
    exams: any[];
    userExams: any[];
}

export default function LandingPage({
    user,
    exams,
    userExams,
}: LandingPageProps) {
    const isGuest = !user;
    const isLoggedNoExam = user && userExams.length === 0;
    const isLoggedWithExam = user && userExams.length > 0;

    const cta = isGuest
        ? {
            badge: "Start Today",
            title: "Start your smarter learning journey today.",
            description:
                "Create your free account, discover structured roadmaps, and prepare with AI-powered practice designed to help you achieve your goals.",
            primaryText: "Get Started",
            primaryHref: "/signup",
            secondaryText: "Explore Roadmaps",
            secondaryHref: "/dashboard",
        }
        : isLoggedNoExam
            ? {
                badge: "Welcome",
                title: "Let's build your first roadmap.",
                description:
                    "Choose an exam, generate a personalized roadmap, and let PrepMate guide you step by step toward exam day.",
                primaryText: "Create Roadmap",
                primaryHref: "/dashboard",
                secondaryText: "Browse Exams",
                secondaryHref: "/exams",
            }
            : {
                badge: "Keep Going",
                title: "Your next milestone is waiting.",
                description:
                    "You're already making progress. Continue your roadmap, practice with AI-generated exams, and stay on track until exam day.",
                primaryText: "Continue Learning",
                primaryHref: "/dashboard",
                secondaryText: "View Roadmaps",
                secondaryHref: "/dashboard",
            };

    return (
        <>
            {/* HERO */}
            <section className="relative overflow-hidden bg-linear-to-br from-[#00353b] via-[#001d3f] to-[#001c32]">

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-yellow-500/40 blur-3xl"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2 }}
                    className="absolute bottom-0 right-0 h-125 w-125 rounded-full bg-[#002021] blur-3xl"
                />

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    viewport={{ once: false, amount: 0.3 }}
                    className="relative max-w-7xl mx-auto px-12 py-32 lg:pt-36  lg:pb-24"
                >

                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* LEFT */}

                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: false, amount: 0.3 }}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                viewport={{ once: false, amount: 0.3 }}
                                className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-2 text-xs md:text-sm text-blue-100 border border-white/10 mb-6">
                                <Sparkles className="h-4 w-4" />
                                Prepmate - Your AI Powered Learning Platform
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.7 }}
                                viewport={{ once: false, amount: 0.3 }}
                                className="text-4xl lg:text-7xl font-black text-white leading-tight">
                                Study
                                <span className="text-yellow-400"> Smarter</span>,
                                <br />
                                Not <span className="text-blue-500">Harder</span>.
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.45, duration: 0.6 }}
                                viewport={{ once: false, amount: 0.3 }}
                                className="mt-8 text-sm lg:text-lg leading-relaxed tracking-wide text-slate-300 max-w-xl">
                                PrepMate transforms overwhelming exam preparation into a
                                structured, intelligent, and personalized journey with AI,
                                adaptive roadmaps, and powerful analytics.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.6 }}
                                viewport={{ once: false, amount: 0.3 }} className="flex flex-wrap gap-4 mt-10"
                            >

                                <Link
                                    href={isGuest ? "/signup" : "/dashboard"}
                                    className="rounded-xl bg-blue-600/50 border border-white/20 hover:bg-blue-700 px-4 py-2 text-white font-semibold transition flex items-center gap-2 text-sm md:text-base"
                                >
                                    Get Started
                                    <ArrowRight size={18} />
                                </Link>

                                <Link
                                    href="/dashboard"
                                    className="rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur  px-4 py-2 text-white font-semibold transition"
                                >
                                    Explore Roadmaps
                                </Link>

                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.6 }}
                                viewport={{ once: false, amount: 0.3 }}
                                className="grid grid-cols-3 gap-8 mt-12">

                                <div>
                                    <h3 className="text-xl md:text-3xl font-bold text-white">10+</h3>
                                    <p className="text-xs md:text-base text-slate-400 mt-2">
                                        Relevant Roadmaps
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl md:text-3xl font-bold text-white">AI</h3>
                                    <p className="text-xs md:text-base text-slate-400 mt-2">
                                        Personalized Exams
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl md:text-3xl font-bold text-white">24/7</h3>
                                    <p className="text-xs md:text-base text-slate-400 mt-2">
                                        Learning Support
                                    </p>
                                </div>

                            </motion.div>

                        </motion.div>

                        {/* RIGHT */}
                        <motion.div
                            className="relative mx-auto w-full max-w-md"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: false, amount: 0.3 }}
                        >
                            <div className="rounded-3xl bg-white/95 h-full aspect-auto w-full md:h-100 backdrop-blur-sm shadow-2xl p-6 md:p-8">
                                <div className="flex items-center gap-2 mb-6">
                                    <Image
                                        src="/logo.jpg"
                                        alt="PrepMate"
                                        width={28}
                                        height={28}
                                        className="rounded-full"
                                    />
                                    <span className="font-semibold text-gray-800">Your path to exam day</span>
                                </div>

                                <ol className="relative pl-2">
                                    {[
                                        { label: "Start today", sub: "Set your exam & dates", icon: Compass, done: true },
                                        { label: "This week", sub: "Small, clear daily tasks", icon: BookOpen, done: true },
                                        { label: "Stay on track", sub: "See your progress grow", icon: LineChart, done: false },
                                        { label: "Exam day", sub: "Walk in fully prepared", icon: Flag, done: false },
                                    ].map((step, i, arr) => (
                                        <motion.li
                                            key={step.label}
                                            className="relative flex gap-4 pb-8 last:pb-0"
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{
                                                duration: 0.4,
                                                delay: i * 0.15,
                                            }}
                                            viewport={{ once: false, amount: 0.3 }}
                                        >
                                            {i !== arr.length - 1 && (
                                                <span
                                                    className={`absolute left-4.75 top-10 h-full w-0.5 ${step.done ? "bg-amber-400" : "bg-gray-200"
                                                        }`}
                                                />
                                            )}
                                            <span
                                                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${step.done
                                                    ? "bg-amber-400 text-[#0d2f55]"
                                                    : "bg-gray-100 text-gray-400"
                                                    }`}
                                            >
                                                <step.icon size={18} />
                                            </span>
                                            <div className="pt-1.5">
                                                <p className="font-semibold text-gray-800 text-sm">{step.label}</p>
                                                <p className="text-gray-500 text-xs">{step.sub}</p>
                                            </div>
                                        </motion.li>
                                    ))}
                                </ol>
                            </div>

                            {/* small floating badge for warmth, not overused */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                viewport={{ once: false, amount: 0.3 }}
                                className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-full bg-yellow-200 backdrop-blur px-4 py-2 shadow-lg border border-black"
                            >
                                <div className="h-2.5 w-2.5 rounded-full bg-green-700" />
                                <span className="text-xs font-medium text-gray-900">Plan updates automatically</span>
                            </motion.div>
                        </motion.div>

                    </div>

                </motion.div>

            </section >
            <VisitMobile />

            {/* USER EXAMS */}
            {
                isLoggedWithExam && (
                    <motion.section
                        className="pt-20 pb-10 px-12 bg-white relative overflow-hidden"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: false, amount: 0.3 }}
                            className="text-center mb-14"
                        >
                            <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
                                Welcome back,<br />
                                <span className="text-indigo-700"> {user.name}</span>
                            </h2>

                            <p className="mt-3 text-gray-600">
                                Continue your preparation where you left off.
                            </p>
                        </motion.div>

                        <div className="grid gap-10 md:grid-cols-3 max-w-6xl mx-auto">
                            {userExams.map((ue, index) => (
                                <motion.div
                                    key={ue.id}
                                    initial={{ opacity: 0, y: 35 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: index * 0.15,
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    className="rounded-3xl bg-linear-to-br from-white to-blue-50 hover:to-blue-100 hover:from-40% border border-blue-200 shadow-md hover:shadow-xl p-7 group transition flex flex-col justify-between"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="h-8 mr-2 aspect-square rounded-md bg-indigo-100 flex items-center justify-center">
                                            <BookOpen className="h-4 text-indigo-700" />
                                        </div>

                                        <h3 className="font-semibold md:text-lg text-gray-900">
                                            {ue.exam.name}
                                        </h3>
                                    </div>

                                    <div className="mb-6">
                                        <div className="h-2 w-full rounded-full bg-gray-200 group-hover:bg-indigo-200 overflow-hidden">
                                            <motion.div
                                                className="h-full rounded-full bg-indigo-600"
                                                initial={{ width: 0 }}
                                                whileInView={{
                                                    width: `${ue.progress_percent || 0}%`,
                                                }}
                                                transition={{
                                                    duration: 1,
                                                    delay: 0.3 + index * 0.15,
                                                }}
                                                viewport={{ once: true }}
                                            />
                                        </div>

                                        <p className="mt-3 text-sm text-gray-700  transition">
                                            {ue.progress_percent || 0}% through your preparation
                                        </p>
                                    </div>

                                    <Link
                                        href="/dashboard"
                                        className="group text-sm w-fit flex items-center justify-center gap-2 rounded-xl border border-indigo-800 py-3 px-4 font-semibold text-indigo-800 hover:bg-indigo-800 hover:text-white transition mx-auto"
                                    >
                                        Continue Learning

                                        <ArrowRight
                                            size={18}
                                            className="transition-transform group-hover:translate-x-1"
                                        />
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )
            }

            <ToastLogin />

            {/* ================= WHY PREPMATE ================= */}

            <section className="relative pt-16 md:py-16 overflow-hidden">

                {/* Background */}

                <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-100 blur-3xl opacity-60" />

                <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-cyan-100 blur-3xl opacity-60" />

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.3 }}
                    className="relative max-w-7xl mx-auto px-12 grid lg:grid-cols-2 gap-24 items-center"
                >

                    {/* LEFT */}

                    <motion.div>

                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                            className="text-blue-600 bg-blue-100 w-fit text-xs md:text-sm font-semibold uppercase tracking-[0.2em] border border-blue-200 py-2 px-4 rounded-xl"
                        >
                            Why PrepMate ?
                        </motion.span>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="mt-5 text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
                        >
                            Studying shouldn't
                            <br />
                            feel confusing.
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            className="mt-6 md:text-lg leading-relaxed md:leading-loose text-sm text-slate-600 max-w-xl"
                        >
                            Most students spend more time figuring out what to study than
                            actually learning. PrepMate removes that uncertainty with
                            intelligent roadmaps, AI-powered practice, and progress
                            tracking designed to keep you moving forward.
                        </motion.p>

                        <div
                            className="mt-12 space-y-6"
                        >

                            {[
                                "Clear learning path from start to finish",
                                "Track every completed topic",
                                "AI adapts your preparation",
                                "Stay consistent with smart reminders",
                            ].map((item) => (

                                <motion.div
                                    key={item}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-4"
                                >

                                    <div className="h-11 w-11 rounded-xl bg-blue-100 flex items-center justify-center">

                                        <CheckCircle2 className="text-blue-600" />

                                    </div>

                                    <span className="text-slate-700 font-medium md:font-semibold text-sm md:text-lg">
                                        {item}
                                    </span>

                                </motion.div>

                            ))}

                        </div>

                    </motion.div>

                    {/* RIGHT */}

                    <motion.div
                        animate={{
                            y: [0, -10, 0],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="relative"
                    >

                        {/* Glow */}

                        <div className="absolute inset-0 rounded-[40px] bg-linear-to-r from-blue-500/20 to-cyan-400/20 blur-3xl" />

                        {/* Screenshot */}

                        <motion.div
                            whileHover={{
                                rotate: 0,
                                scale: 1.03,
                            }}
                            transition={{
                                duration: .35,
                            }}
                            className="relative hidden md:block rounded-4xl overflow-hidden border bg-white p-3 shadow-[0_40px_90px_rgba(0,0,0,.15)] rotate-2"
                        >

                            <Image
                                src="/dashboard.png"
                                alt="PrepMate Dashboard"
                                width={1400}
                                height={900}
                                className="rounded-2xl"
                            />

                        </motion.div>

                        {/* Floating Card */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 40,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                delay: .8,
                            }}
                            className="hidden md:block absolute -bottom-8 -left-6 bg-white rounded-xl shadow-lg shadow-gray-500 px-6 py-5"
                        >

                            <p className="text-xs uppercase tracking-widest text-gray-500">
                                Average Progress
                            </p>

                            <h3 className="mt-2 md:text-xl font-bold text-blue-600">
                                +82%
                            </h3>

                            <div className="mt-4 h-2 w-52 rounded-full bg-gray-200">

                                <motion.div
                                    initial={{
                                        width: 0,
                                    }}
                                    whileInView={{
                                        width: "82%",
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        delay: 1,
                                    }}
                                    className="h-full rounded-full bg-blue-600"
                                />

                            </div>

                        </motion.div>

                    </motion.div>

                </motion.div>

            </section>

            {/* ================= ROADMAPS ================= */}

            <motion.section
                className="relative overflow-hidden bg-linear-to-br from-[#00353b] via-[#001d3f] to-[#001c32] pt-16 md:py-28"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: false, amount: 0.3 }}
                    className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2 }}
                    viewport={{ once: false, amount: 0.3 }}
                    className="absolute -bottom-40 -left-40 h-112 w-md rounded-full bg-cyan-500/10 blur-3xl"
                />

                <div className="relative max-w-7xl mx-auto px-12">

                    <div className="grid lg:grid-cols-2 gap-20 items-center">

                        <motion.div
                            className="order-2 lg:order-1"
                            initial={{ opacity: 0, x: -60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: false, amount: 0.3 }}
                        >
                            <div className=" hidden md:block rounded-xl hover:shadow-2xl hover:scale-105 hover:grayscale-100 hover:shadow-black transition-transform duration-300 overflow-hidden border border-white/10 bg-white/5 backdrop-blur shadow-2xl">
                                <Image
                                    src="/roadmap.png"
                                    alt="roadmap"
                                    width={1400}
                                    height={900}
                                />

                            </div>

                        </motion.div>

                        <motion.div
                            className="order-1 lg:order-2"
                            initial={{ opacity: 0, x: 60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: false, amount: 0.3 }}
                        >
                            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-blue-300 text-xs md:text-sm font-semibold mb-5">
                                <Route size={18} />

                                Smart Roadmaps

                            </div>

                            <h2 className="text-3xl lg:text-5xl font-bold leading-tight text-white">
                                Every milestone planned before you even begin.
                            </h2>

                            <p className="mt-8 text-sm md:text-lg leading-relaxed md:leading-loose text-slate-300">
                                Whether you're preparing for placements, semester exams, or
                                competitive tests, PrepMate creates structured roadmaps that
                                guide you through each topic step-by-step.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-5 mt-10">

                                {[
                                    "Daily Study Goals",
                                    "Progress Tracking",
                                    "Weekly Milestones",
                                    "Topic Completion",
                                    "Difficulty Levels",
                                    "Personalized Flow",
                                ].map((feature, index) => (

                                    <motion.div
                                        key={feature}
                                        initial={{ opacity: 0, y: 25 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.45,
                                            delay: index * 0.08,
                                        }}
                                        viewport={{ once: false, amount: 0.3 }}
                                        whileHover={{
                                            y: -6,
                                            scale: 1.02,
                                        }}
                                        className="rounded-2xl border flex flex-row justify-start items-center border-white/10 bg-white/5 backdrop-blur-sm p-5 hover:shadow-lg hover:shadow-gray-800 transition-shadow duration-100"
                                    >

                                        <CheckCircle2 className="text-blue-400 mr-3" />
                                        <h3 className="font-medium md:font-semibold text-sm md:text-lg text-white">
                                            {feature}
                                        </h3>

                                    </motion.div>

                                ))}

                            </div>

                        </motion.div>

                    </div>

                </div>

            </motion.section>

            {/* ================= AI EXAMS ================= */}

            <motion.section
                className="relative overflow-hidden bg-linear-to-b from-white via-slate-50 to-blue-50 py-16 md:py-28"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: false, amount: 0.3 }}
            >

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: false, amount: 0.3 }}
                    className="absolute -top-40 left-0 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2 }}
                    viewport={{ once: false, amount: 0.3 }}
                    className="absolute bottom-0 right-0 h-120 w-120 rounded-full bg-cyan-200/30 blur-3xl"
                />

                <div className="max-w-7xl relative mx-auto px-12">

                    <div className="grid lg:grid-cols-2 gap-20 items-center">

                        <motion.div
                            initial={{ opacity: 0, x: -60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: false, amount: 0.3 }}
                        >
                            <div className="inline-flex text-xs md:text-sm items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-blue-700 font-semibold">
                                <Brain size={18} />

                                AI Generated Exams

                            </div>

                            <h2 className="mt-5 text-3xl lg:text-5xl font-bold text-slate-900 leading-tight">                                Practice smarter with AI-generated assessments.
                            </h2>

                            <p className="mt-8 text-sm md:text-lg leading-relaxed md:leading-loose text-slate-600">                                Create unlimited exams tailored to your roadmap. Every test is
                                generated based on your syllabus, completed topics, and desired
                                difficulty level, giving you a personalized practice experience
                                every time.
                            </p>

                            <div className="space-y-5 mt-10">

                                {[
                                    "Adaptive Question Difficulty",
                                    "Instant Evaluation",
                                    "Detailed Performance Insights",
                                    "Unlimited Practice Tests",
                                    "Topic-wise Question Generation",
                                ].map((item, index) => (

                                    <motion.div
                                        key={item}
                                        whileHover={{
                                            scale: 1.02,
                                            y: -4,
                                            transition: { duration: 0.2 },
                                        }}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{
                                            duration: 0.45,
                                            delay: index * 0.08,
                                        }}
                                        viewport={{ once: false, amount: 0.3 }}
                                        className="flex hover:shadow-lg items-center gap-4 rounded-xl bg-white border border-slate-200 p-4 shadow-sm"
                                    >

                                        <CheckCircle2 className="text-blue-600" />

                                        <span className="text-slate-700 text-sm md:text-lg font-medium md:font-semibold">
                                            {item}
                                        </span>

                                    </motion.div>
                                ))}

                            </div>

                        </motion.div>



                        <motion.div
                            initial={{ opacity: 0, x: 60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: false, amount: 0.3 }}
                            className="rounded-3xl hover:scale-105 hover:shadow-2xl transition-transform duration-300 overflow-hidden border border-slate-200 bg-white shadow-xl hidden md:block"
                        >
                            <Image
                                src="/tests.png"
                                alt="AI Generated Exams"
                                width={1400}
                                height={900}
                            />

                        </motion.div>


                    </div>

                </div>

            </motion.section >

            {/* ================= ANALYTICS ================= */}

            < motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: false, amount: 0.3 }}
                className="md:py-28 py-16 bg-white relative overflow-hidden" >

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: false, amount: 0.3 }}
                    className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2 }}
                    viewport={{ once: false, amount: 0.3 }}
                    className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-sky-100/40 blur-3xl"
                />

                <div className="max-w-7xl relative mx-auto px-12">

                    <div className="grid lg:grid-cols-2 gap-20 items-center">

                        <motion.div
                            initial={{ opacity: 0, x: -60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: false, amount: 0.3 }}
                            className="rounded-3xl overflow-hidden border hover:scale-105 shadow-xl hover:shadow-2xl transition-transform duration-300 hidden md:block">

                            <Image
                                src="/analytical.png"
                                alt="Analytics"
                                width={1400}
                                height={900}
                            />

                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: false, amount: 0.3 }}
                        >
                            <div className="inline-flex text-xs md:text-sm items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-blue-700 font-semibold">
                                <BarChart3 size={18} />
                                Analytics
                            </div>

                            <h2 className="mt-5 text-3xl lg:text-5xl font-bold leading-tight text-slate-900">                                Understand your progress with meaningful insights.
                            </h2>

                            <p className="mt-8 text-sm md:text-lg leading-relaxed md:leading-loose text-slate-600">
                                Great preparation isn't just about solving questions it's about
                                understanding your strengths, fixing weak areas, and measuring
                                improvement. PrepMate turns your study sessions into actionable
                                insights.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-5 mt-10">

                                {[
                                    "Accuracy Reports",
                                    "Time Analysis",
                                    "Topic Performance",
                                    "Weekly Growth",
                                    "Completion Trends",
                                    "Personal Statistics",
                                ].map((item, index) => (

                                    <motion.div
                                        key={item}
                                        initial={{ opacity: 0, y: 25 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        whileHover={{
                                            scale: 1.02,
                                            y: -4,
                                            transition: { duration: 0.2 },
                                        }}
                                        transition={{
                                            duration: 0.45,
                                            delay: index * 0.08,
                                        }}
                                        viewport={{ once: false, amount: 0.3 }}
                                        
                                        className="flex items-center rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-xl"
                                    >

                                        <CheckCircle2 className="text-blue-600 mr-3" />

                                        <h3 className="font-medium md:font-semibold text-sm md:text-lg text-slate-800">
                                            {item}
                                        </h3>

                                    </motion.div>

                                ))}

                            </div>

                        </motion.div>

                    </div>

                </div>

            </motion.section >

            {/* ================= STATS ================= */}

            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-linear-to-r from-[#001B33] to-[#003A69] py-24 relative overflow-hidden"
            >

                {/* Background Glow */}
                <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
                <div className="absolute -bottom-40 -right-40 h-112 w-md rounded-full bg-cyan-500/10 blur-3xl" />

                <div className="relative max-w-6xl mx-auto px-12">

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: false, amount: 0.3 }}
                        className="text-center"
                    >
                        <h2 className="text-3xl lg:text-5xl font-bold text-white">
                            Built to help students succeed.
                        </h2>

                        <p className="mt-6 text-slate-300 max-w-2xl mx-auto text-sm md:text-lg leading-relaxed md:leading-loose">
                            Every feature in PrepMate is focused on making learning simpler,
                            faster, and more effective.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-12 md:mt-16">

                        {[
                            {
                                number: "10+",
                                label: "Roadmaps",
                            },
                            {
                                number: "1000+",
                                label: "Topics Covered",
                            },
                            {
                                number: "AI",
                                label: "Personalized Exams",
                            },
                            {
                                number: "24/7",
                                label: "Learning Support",
                            },
                        ].map((item, index) => (

                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.12,
                                }}
                                viewport={{ once: false, amount: 0.3 }}
                                whileHover={{
                                    y: -8,
                                    scale: 1.03,
                                    transition: { duration: 0.2 },
                                }}
                                className="rounded-3xl flex flex-col items-center border border-white/10 bg-white/5 backdrop-blur-sm p-6 md:p-8 text-center"
                            >

                                <h3 className="text-2xl lg:text-4xl font-black text-yellow-300">
                                    {item.number}
                                </h3>

                                <p className="mt-4 text-slate-300 text-xs md:text-lg font-medium">
                                    {item.label}
                                </p>

                            </motion.div>

                        ))}

                    </div>

                </div>

            </motion.section >

            {/* ================= CTA ================= */}

            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: false, amount: 0.3 }}
                className="py-20 relative overflow-hidden"
            >
                <div className="max-w-4xl mx-auto px-12 text-center">

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="uppercase mx-auto text-xs md:text-sm bg-blue-100 text-blue-700 border w-fit border-blue-700 py-1 px-4 rounded-full font-semibold"
                    >
                        {cta.badge}
                    </motion.p>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="mt-4 text-3xl md:text-5xl font-bold leading-tight"
                    >
                        {cta.title}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="mt-8 text-sm md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed md:leading-loose"
                    >
                        {cta.description}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="flex md:flex-row flex-col gap-y-8 gap-4 justify-center mt-12"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            viewport={{ once: false, amount: 0.3 }}
                        >
                            <Link
                                href={cta.primaryHref}
                                className="rounded-lg bg-blue-800 hover:bg-blue-700 px-6 py-2 md:py-4 text-white font-medium md:font-semibold transition"
                            >
                                {cta.primaryText}
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            viewport={{ once: false, amount: 0.3 }}
                        >
                            <Link
                                href={cta.secondaryHref}
                                className="rounded-lg border border-slate-300 px-6 py-2 md:py-4 font-medium md:font-semibold hover:bg-slate-100 transition"
                            >
                                {cta.secondaryText}
                            </Link>
                        </motion.div>
                    </motion.div>

                </div>
            </motion.section>

        </>
    );
}