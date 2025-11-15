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
        <div className="min-h-screen bg-gray-100 mt-12 px-6 py-10">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-4 mt-10 text-gray-900">
                    Choose Your Exam to Begin 🚀
                </h1>

                <p className="text-gray-600 text-lg md:text-xl max-w-2xl text-center mx-auto mb-12">
                    Plan, track, and master your exam journey with intelligent tools and personalized learning paths.
                </p>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 items-start">
                    {exams.map((exam) => {
                        const isExpanded = expandedExam === exam.id;

                        return (
                            <Card
                                key={exam.id}
                                className={`bg-white border p-0 border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden ${isExpanded ? "ring-2 ring-blue-200" : ""
                                    }`}
                            >
                                {/* Image Section */}
                                <div className="relative h-52 aspect-auto">
                                    <Image
                                        src={exam.imageUrl || "/placeholder.png"}
                                        alt={exam.name}
                                        fill
                                        className="object-cover object-center"
                                        priority={false}
                                    />
                                </div>

                                {/* Header: use a real button to ensure clicks are handled reliably */}
                                <CardHeader className="border-b p-0 border-gray-100">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        aria-expanded={isExpanded}
                                        onClick={() => toggleExam(exam.id)}
                                        className="w-full p-0 flex items-center justify-between text-left hover:bg-gray-100"
                                    >
                                        <span className="text-xl font-semibold text-gray-800">
                                            {exam.name}
                                        </span>

                                        {isExpanded ? (
                                            <ChevronUp className="text-blue-600" />
                                        ) : (
                                            <ChevronDown className="text-blue-600" />
                                        )}
                                    </Button>

                                </CardHeader>

                                <CardContent className="p-4">
                                    {/* Short Description */}
                                    {exam.description && (
                                        <p className="text-gray-600 mb-3 line-clamp-3">
                                            {exam.description}
                                        </p>
                                    )}

                                    {/* Expanded Syllabus Preview */}
                                    <div
                                        className={`transition-all duration-300 overflow-hidden ${isExpanded ? "max-h-[450px] opacity-100" : "max-h-0 opacity-0"
                                            }`}
                                    >
                                        <div className="mt-2">
                                            {exam.subjects.map((subject) => {
                                                const isSubExpanded =
                                                    expandedSubject?.examId === exam.id &&
                                                    expandedSubject?.subjectId === subject.id;

                                                return (
                                                    <div
                                                        key={subject.id}
                                                        className="bg-gray-100 rounded-lg border border-gray-200 p-2 mb-2"
                                                    >
                                                        <div
                                                            className="flex justify-between items-center cursor-pointer"
                                                            onClick={() => toggleSubject(exam.id, subject.id)}
                                                            role="button"
                                                            tabIndex={0}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter" || e.key === " ") {
                                                                    e.preventDefault();
                                                                    toggleSubject(exam.id, subject.id);
                                                                }
                                                            }}
                                                        >
                                                            <h3 className="text-sm font-medium text-gray-800">
                                                                {subject.name}
                                                            </h3>
                                                            {isSubExpanded ? (
                                                                <ChevronUp className="text-blue-500 h-4 w-4" />
                                                            ) : (
                                                                <ChevronDown className="text-blue-500 h-4 w-4" />
                                                            )}
                                                        </div>

                                                        <div
                                                            className={`transition-all duration-300 overflow-hidden ${isSubExpanded
                                                                ? "max-h-28 opacity-100 mt-1"
                                                                : "max-h-0 opacity-0"
                                                                }`}
                                                        >
                                                            <p className="text-gray-500 text-xs">
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

                                    {/* Buttons */}
                                    <div className="mt-4 flex gap-2 pt-3 border-t border-gray-200">
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="border border-gray-500 hover:bg-gray-500 hover:text-white flex-1"
                                        >
                                            <Link href={`/syllabus/exam/${exam.id}`}>Syllabus</Link>
                                        </Button>

                                        {userExams.some((ue) => ue.exam_id === exam.id) ? (
                                            <Button
                                                asChild
                                                className=" hover:bg-blue-800 flex-1"
                                            >
                                                <Link href={`/dashboard`}>Continue progress</Link>
                                            </Button>
                                        ) : (
                                            <Button
                                                asChild
                                                className=" hover:bg-blue-800 flex-1"
                                            >
                                                <Link href={`/onboarding/${exam.id}`}>Start Preparation</Link>
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
