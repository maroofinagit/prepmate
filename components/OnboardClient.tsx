"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface UserExam {
    exam_id: number;
}

export type Difficulty = "easy" | "medium" | "hard";

export type ExamsResult = {
    id: number;
    name: string;
    description: string | null;
    imageUrl: string;
    subjects: {
        id: number;
        name: string;
        topics: {
            id: number;
            name: string;
            description: string | null;
            difficulty: Difficulty;
        }[];
    }[];
}[];

export default function OnboardingClient({
    exams,
    userExams,
}: {
    exams: ExamsResult;
    userExams: UserExam[];
}) {
    const [expandedExam, setExpandedExam] = useState<number | null>(null);

    // Track both exam + subject so expansion is scoped
    const [expandedSubject, setExpandedSubject] = useState<{
        examId: number;
        subjectId: number;
    } | null>(null);

    const toggleExam = (examId: number) => {
        setExpandedExam((prev) => (prev === examId ? null : examId));
        setExpandedSubject(null); // Reset subject when exam changes
    };

    const toggleSubject = (examId: number, subjectId: number) => {
        setExpandedSubject((prev) =>
            prev?.examId === examId && prev?.subjectId === subjectId
                ? null
                : { examId, subjectId }
        );
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 pt-32 pb-20">
            <div className="max-w-6xl mx-auto text-center px-8 lg:px-12">

                <span className="inline-flex text-xs md:text-sm items-center rounded-full border bg-blue-50 px-4 py-2 font-medium text-blue-700">
                    🚀 Smart Exam Preparation
                </span>

                <h1 className="mt-6 text-2xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                    Choose Your Exam
                </h1>

                <p className="mt-5 text-sm md:text-lg max-w-xl text-center mx-auto text-slate-600 leading-relaxed">
                    Start your personalized learning journey with AI-generated roadmaps,
                    structured study plans, quizzes, and progress tracking.
                </p>

                {/* Cards */}
                {/* Exams */}
                <div className="mt-12 space-y-14">

                    {/* Enrolled Exams */}
                    {(() => {
                        const enrolledExams = exams.filter((exam) =>
                            userExams.some((ue) => ue.exam_id === exam.id)
                        );

                        if (enrolledExams.length === 0) return null;

                        return (
                            <section>
                                <div className="mb-6 text-left flex flex-col gap-2">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                                            Your Exams
                                        </h2>

                                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                            {enrolledExams.length} Enrolled
                                        </span>
                                    </div>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Continue preparing for the exams you're already enrolled in.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-10">
                                    {enrolledExams.map((exam) => {
                                        const isExpanded = expandedExam === exam.id;

                                        return (
                                            <ExamCard
                                                key={exam.id}
                                                exam={exam}
                                                isExpanded={isExpanded}
                                                toggleExam={toggleExam}
                                                expandedSubject={expandedSubject}
                                                toggleSubject={toggleSubject}
                                                enrolled
                                            />
                                        );
                                    })}
                                </div>
                            </section>
                        );
                    })()}


                    {/* More Exams */}
                    {(() => {
                        const enrolledIds = new Set(
                            userExams.map((ue) => ue.exam_id)
                        );

                        const availableExams = exams.filter(
                            (exam) => !enrolledIds.has(exam.id)
                        );

                        if (availableExams.length === 0) return null;

                        return (
                            <section>
                                <div className="mb-6 text-left">
                                    <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                                        Explore More Exams
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Discover more exams and start a new preparation journey.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-10">
                                    {availableExams.map((exam) => {
                                        const isExpanded = expandedExam === exam.id;

                                        return (
                                            <ExamCard
                                                key={exam.id}
                                                exam={exam}
                                                isExpanded={isExpanded}
                                                toggleExam={toggleExam}
                                                expandedSubject={expandedSubject}
                                                toggleSubject={toggleSubject}
                                                enrolled={false}
                                            />
                                        );
                                    })}
                                </div>
                            </section>
                        );
                    })()}

                </div>
            </div>
        </div >
    );
}

function ExamCard({
    exam,
    isExpanded,
    toggleExam,
    expandedSubject,
    toggleSubject,
    enrolled,
}: {
    exam: ExamsResult[number];
    isExpanded: boolean;
    toggleExam: (examId: number) => void;
    expandedSubject: {
        examId: number;
        subjectId: number;
    } | null;
    toggleSubject: (examId: number, subjectId: number) => void;
    enrolled: boolean;
}) {
    return (
        <Card
            className={`flex flex-col pt-0 pb-2 h-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 ${isExpanded ? "ring-2 ring-blue-100" : ""
                }`}
        >
            {/* Image */}
            <div className="relative h-48 md:h-56 overflow-hidden">
                <Image
                    src={exam.imageUrl || "/placeholder.png"}
                    alt={exam.name}
                    fill
                    priority={false}
                    className="object-cover object-center transition-transform duration-500 hover:scale-105"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

                {/* Enrolled Badge */}
                {enrolled && (
                    <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm">
                            ✓ Enrolled
                        </span>
                    </div>
                )}
            </div>

            <CardHeader className="px-6 py-4 border-b">
                <Button
                    variant="ghost"
                    onClick={() => toggleExam(exam.id)}
                    className="w-full justify-between rounded-lg px-0 hover:bg-transparent"
                >
                    <span className="text-base md:text-xl font-bold text-slate-800">
                        {exam.name}
                    </span>

                    {isExpanded ? (
                        <ChevronUp className="size-5 md:size-6 text-blue-600" />
                    ) : (
                        <ChevronDown className="size-5 md:size-6 text-blue-600" />
                    )}
                </Button>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col px-6 py-5">

                {exam.description && (
                    <p className="text-sm md:text-base leading-7 text-slate-600 mb-5">
                        {exam.description}
                    </p>
                )}

                {/* Subjects */}
                <div
                    className={`overflow-hidden transition-all duration-300 ${isExpanded
                            ? "max-h-125 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                >
                    <div className="space-y-3">
                        {exam.subjects.map((subject) => {
                            const isSubExpanded =
                                expandedSubject?.examId === exam.id &&
                                expandedSubject?.subjectId === subject.id;

                            return (
                                <div
                                    key={subject.id}
                                    className="rounded-xl border border-slate-200 bg-slate-50 transition-colors hover:bg-blue-50"
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            toggleSubject(
                                                exam.id,
                                                subject.id
                                            )
                                        }
                                        className="flex w-full items-center justify-between px-4 py-3 text-left"
                                    >
                                        <h3 className="font-medium text-xs md:text-sm text-slate-800">
                                            {subject.name}
                                        </h3>

                                        {isSubExpanded ? (
                                            <ChevronUp className="h-4 w-4 text-blue-600" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4 text-slate-500" />
                                        )}
                                    </button>

                                    <div
                                        className={`overflow-hidden transition-all duration-300 ${isSubExpanded
                                                ? "max-h-32 opacity-100 px-4 pb-3"
                                                : "max-h-0 opacity-0"
                                            }`}
                                    >
                                        <p className="text-sm leading-6 text-slate-500">
                                            {subject.topics
                                                .slice(0, 5)
                                                .map((t) => t.name)
                                                .join(", ")}
                                            {subject.topics.length > 5 && " ..."}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 border-t border-slate-200 pt-5 flex flex-col sm:flex-row gap-3">

                    <Button
                        asChild
                        variant="outline"
                        className="h-11 flex-1 rounded-lg border-slate-300 hover:bg-slate-900 hover:text-white"
                    >
                        <Link href={`/syllabus/exam/${exam.id}`}>
                            Syllabus
                        </Link>
                    </Button>

                    {enrolled ? (
                        <Button
                            asChild
                            className="h-11 flex-1 rounded-lg bg-black hover:bg-blue-700"
                        >
                            <Link href="/dashboard">
                                Continue Progress
                            </Link>
                        </Button>
                    ) : (
                        <Button
                            asChild
                            className="h-11 flex-1 rounded-lg bg-black hover:bg-blue-700"
                        >
                            <Link href={`/onboarding/${exam.id}`}>
                                Start Preparation
                            </Link>
                        </Button>
                    )}

                </div>
            </CardContent>
        </Card>
    );
}
