"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface LoadingScreenProps {
    label: string | null;
}

const floatingCards = [
    {
        className: "left-[4%] top-[18%] w-64 rotate-[-4deg]",
        type: "stats",
    },
    {
        className: "right-[5%] top-[16%] w-72 rotate-[4deg]",
        type: "chart",
    },
    {
        className: "left-[8%] bottom-[17%] w-72 rotate-[3deg]",
        type: "roadmap",
    },
    {
        className: "right-[7%] bottom-[15%] w-64 rotate-[-3deg]",
        type: "activity",
    },
];

function GhostCard({
    type,
    className,
}: {
    type: string;
    className: string;
}) {
    return (
        <motion.div
            className={`
                absolute hidden overflow-hidden rounded-2xl
                border border-blue-300/40
                bg-white/75
                shadow-[0_20px_60px_rgba(15,23,42,0.07)]
                backdrop-blur-sm
                md:block
                ${className}
            `}
            animate={{
                y: [0, -8, 0],
            }}
            transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        >
            <div className="p-5 opacity-60">

                {type === "stats" && (
                    <>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="h-2 w-20 rounded bg-slate-400" />
                                <div className="mt-3 h-7 w-28 rounded bg-slate-300" />
                            </div>

                            <div className="h-10 w-10 rounded-xl bg-blue-200" />
                        </div>

                        <div className="mt-6 flex items-end gap-2">
                            <div className="h-12 flex-1 rounded-md bg-blue-200" />
                            <div className="h-20 flex-1 rounded-md bg-blue-200" />
                            <div className="h-16 flex-1 rounded-md bg-slate-300" />
                            <div className="h-24 flex-1 rounded-md bg-blue-200" />
                            <div className="h-14 flex-1 rounded-md bg-slate-300" />
                        </div>
                    </>
                )}

                {type === "chart" && (
                    <>
                        <div className="h-2 w-28 rounded bg-slate-300" />

                        <div className="relative mt-6 h-28">
                            <div className="absolute bottom-0 left-0 h-px w-full bg-slate-300" />

                            <svg
                                viewBox="0 0 300 100"
                                className="h-full w-full"
                                fill="none"
                            >
                                <motion.path
                                    d="M0 78 C30 70, 45 80, 70 58 S110 42, 135 55 S175 28, 200 38 S240 18, 300 8"
                                    stroke="currentColor"
                                    className="text-blue-400"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    animate={{
                                        pathLength: [0.7, 1, 0.7],
                                        opacity: [0.4, 0.8, 0.4],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                />
                            </svg>
                        </div>
                    </>
                )}

                {type === "roadmap" && (
                    <>
                        <div className="h-2 w-24 rounded bg-slate-300" />

                        <div className="mt-5 space-y-5">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-3"
                                >
                                    <div className="h-7 w-7 rounded-full border-2 border-blue-300 bg-blue-100" />

                                    <div className="flex-1">
                                        <div className="h-2.5 w-32 rounded bg-slate-300" />
                                        <div className="mt-2 h-2 w-20 rounded bg-slate-200" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {type === "activity" && (
                    <>
                        <div className="h-2 w-32 rounded bg-slate-300" />

                        <div className="mt-5 space-y-4">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-3"
                                >
                                    <div className="h-9 w-9 rounded-lg bg-slate-300" />

                                    <div className="flex-1">
                                        <div className="h-2.5 w-28 rounded bg-slate-300" />
                                        <div className="mt-2 h-2 w-16 rounded bg-slate-200" />
                                    </div>

                                    <div className="h-2 w-8 rounded bg-slate-300" />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
}

export default function LoadingClient({
    label = "Schema",
}: LoadingScreenProps) {
    
    return (
        <main className="relative min-h-screen overflow-hidden bg-[#f7f9fc]">

            {/* =====================================================
                BACKGROUND
            ====================================================== */}

            <div className="pointer-events-none absolute inset-0">

                {/* Main blue glow */}
                <motion.div
                    className="
                        absolute
                        left-1/2
                        top-[30%]
                        h-125
                        w-125
                        -translate-x-1/2
                        rounded-full
                        bg-blue-500/30
                        blur-[120px]
                    "
                    animate={{
                        scale: [1, 1.12, 1],
                        opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Secondary glow */}
                <motion.div
                    className="
                        absolute
                        left-[10%]
                        top-[50%]
                        h-72
                        w-72
                        rounded-full
                        bg-cyan-400/30
                        blur-[100px]
                    "
                    animate={{
                        x: [0, 40, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Grid */}
                <div
                    className="
                        absolute
                        inset-0
                        opacity-15
                        max-w-6xl
                        mx-auto
                        max-h-3/4
                        my-auto
                        bg-[linear-gradient(#64748b_1px,transparent_1px),linear-gradient(90deg,#64748b_1px,transparent_1px)]
                        bg-size-[60px_60px]
                    "
                />
            </div>

            {/* =====================================================
                BACKGROUND UI FRAGMENTS
            ====================================================== */}

            {floatingCards.map((card, index) => (
                <GhostCard
                    key={index}
                    type={card.type}
                    className={card.className}
                />
            ))}


            {/* =====================================================
                CENTER
            ====================================================== */}

            <div className="
                relative
                z-10
                flex
                min-h-screen
                items-center
                justify-center
                px-6
            ">
                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.92,
                        y: 15,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.7,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="
                        relative
                        w-full
                        max-w-md
                        rounded-[28px]
                        bg-white/85
                        px-8
                        py-10
                        text-center
                        shadow-[0_30px_100px_rgba(15,23,42,0.12)]
                        backdrop-blur-xl
                    "
                >

                    {/* Card glow */}
                    <div
                        className="
                            pointer-events-none
                            absolute
                            left-1/2
                            top-0
                            h-32
                            w-64
                            -translate-x-1/2
                            rounded-full
                            blur-[60px]
                        "
                    />

                    {/* Logo */}
                    <motion.div
                        animate={{
                            y: [0, -5, 0],
                            rotate: [0, 1, 0, -1, 0],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="
                            relative
                            mx-auto
                            mb-6
                            flex
                            h-16
                            w-16
                            items-center
                            justify-center
                            rounded-2xl
                            bg-slate-950
                            shadow-[0_10px_35px_rgba(15,23,42,0.20)]
                        "
                    >
                        <Image
                            src="/logo.png"
                            alt="Schema"
                            width={48}
                            height={48}
                            priority
                            className="rounded-xl object-contain"
                        />

                        {/* logo glow */}
                        <motion.div
                            className="
                                absolute
                                -inset-2
                                -z-10
                                rounded-3xl
                                bg-blue-500/40
                                blur-xl
                            "
                            animate={{
                                opacity: [0.3, 0.7, 0.3],
                                scale: [0.9, 2, 0.9],
                            }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                            }}
                        />
                    </motion.div>

                    {/* Main text */}
                    <h1 className="
                        text-2xl
                        mt-4
                        font-semibold
                        tracking-normal
                        text-slate-900
                    "
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        Schemae is Loading
                    </h1>

                    {/* Animated dots */}
                    <div className="mt-4 flex items-center justify-center gap-1.5">
                        <motion.span
                            className="h-2 aspect-square rounded-full bg-blue-500"
                            animate={{
                                opacity: [0.25, 1, 0.25],
                                scale: [0.8, 1, 0.8],
                            }}
                            transition={{
                                duration: 1.2,
                                repeat: Infinity,
                            }}
                        />

                        <motion.span
                            className="h-2 aspect-square rounded-full bg-blue-500"
                            animate={{
                                opacity: [0.25, 1, 0.25],
                                scale: [0.8, 1, 0.8],
                            }}
                            transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                delay: 0.15,
                            }}
                        />

                        <motion.span
                            className="h-2 aspect-square rounded-full bg-blue-500"
                            animate={{
                                opacity: [0.25, 1, 0.25],
                                scale: [0.8, 1, 0.8],
                            }}
                            transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                delay: 0.3,
                            }}
                        />
                    </div>

                    {/* Current section */}
                    {label && (
                        <motion.div
                            key={label}
                            initial={{
                                opacity: 0,
                                y: 5,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                duration: 0.3,
                            }}
                            className="
                            mx-auto
                            mt-6
                            inline-flex
                            rounded-full
                            border
                            border-slate-200
                            bg-slate-50
                            px-4
                            py-1.5
                            text-xs
                            font-medium
                            tracking-wide
                            text-slate-500
                        "
                        >
                            {label}
                        </motion.div>
                    )}

                    {/* Progress */}
                    <div className="
                        relative
                        mx-auto
                        mt-8
                        h-1
                        w-56
                        overflow-hidden
                        rounded-full
                        bg-slate-100
                    ">
                        <motion.div
                            className="
                                absolute
                                h-full
                                w-20
                                rounded-full
                                bg-linear-to-r
                                from-blue-400
                                via-blue-600
                                to-cyan-400
                            "
                            animate={{
                                x: ["-100%", "400%"],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    </div>

                    <p className="
                        mt-4
                        text-sm
                        font-medium
                        tracking-wide
                        text-slate-400
                    ">
                        Setting things up for you
                    </p>
                </motion.div>
            </div>
        </main>
    );
}