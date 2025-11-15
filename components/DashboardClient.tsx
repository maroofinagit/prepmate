"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import Image from "next/image";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { DashboardUser } from "@/app/types/dashboardUser";
import { CheckCircle2, Clock } from "lucide-react";

/**
 * Safe DashboardAnalytics component
 * - exams can be []
 * - selectedExam can be null
 * - charts render empty arrays (no crashes)
 */
export default function DashboardAnalytics({ dashboardUser }: { dashboardUser: DashboardUser }) {
    const exams = dashboardUser?.exams || [];

    // store selectedExam as the full exam object or null
    const [selectedExam, setSelectedExam] = useState(exams.length ? exams[0] : null);

    // update selectedExam if exams change and selectedExam becomes stale
    // (keeps UI consistent if props update)
    const currentSelectedExam = useMemo(() => {
        if (!selectedExam) return null;
        // try to find the same id in latest exams array
        return exams.find((e) => e.id === selectedExam.id) || null;
    }, [exams, selectedExam]);

    const exam = currentSelectedExam; // alias
    const roadmap = exam?.roadmap || null;
    const phases = roadmap?.phases || [];
    const milestones = roadmap?.milestones || [];

    // Chart data (always arrays)
    const phaseProgressData = phases.map((p) => ({
        name: p.phase_name ?? "Phase",
        progress: Math.round(p.progress ?? 0),
    }));

    const weekProgressData = phases
        .flatMap((p) =>
            (p.weeks || []).map((w) => ({
                name: `W${w.week_number ?? "?"}`,
                progress: Math.round(w.progress ?? 0),
                order: typeof w.week_number === "number" ? w.week_number : Infinity,
            }))
        )
        .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));

        console.log("week progress data:", weekProgressData);

    const totalUserExams = exams.length;
    const overallProgress = Math.round(
        exams.reduce((acc, e) => acc + (e.progress_percent ?? 0), 0) / (exams.length || 1)
    );

    // safe values for top cards
    const selectedProgress = exam?.progress_percent ?? 0;
    const selectedId = exam?.id ?? null;

    return (
        <div className=" space-y-8 mt-20 p-10 ">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Image
                    src={dashboardUser?.image || "/avatar.png"}
                    width={60}
                    height={60}
                    alt="User"
                    className="rounded-full object-cover object-center"
                />
                <div>
                    <h1 className="text-2xl font-bold">Welcome, {dashboardUser?.name ?? "Student"}</h1>
                    <p className="text-muted-foreground">Your Exam Analytics Dashboard</p>
                </div>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>User Exams Enrolled</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{totalUserExams}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Overall Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Progress value={overallProgress} className="h-3" />
                        <p className="text-center mt-2 font-semibold">{overallProgress}%</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Go to Roadmap</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {selectedId ? (
                            <Link href={`/dashboard/roadmap/${selectedId}`}>
                                <Button className="w-full">Open Roadmap</Button>
                            </Link>
                        ) : (
                            <Link href={`/onboarding`}>
                                <Button className="w-full">Create Roadmap</Button>
                            </Link>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs
                defaultValue={exams[0] ? String(exams[0].id) : "none"}
                onValueChange={(v) => {
                    const id = Number(v);
                    const found = exams.find((ex) => ex.id === id);
                    setSelectedExam(found || null);
                }}
                className="mt-6"
            >
                <TabsList className="flex flex-wrap gap-3 mb-4">
                    {exams.length > 0 ? (
                        exams.map((ex) => (
                            <TabsTrigger key={ex.id} value={String(ex.id)}>
                                {ex.exam?.name ?? `Exam ${ex.id}`}
                            </TabsTrigger>
                        ))
                    ) : (
                        <div className="text-sm text-muted-foreground p-2">No exams added</div>
                    )}
                </TabsList>

                {/* if no exams, show a single placeholder tab content */}
                {exams.length === 0 ? (
                    <TabsContent value="none">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                            {/* Empty charts render with empty arrays */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Exam Progress</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <PieChart>
                                            <Pie dataKey="value" data={[{ name: "Completed", value: 0 }, { name: "Remaining", value: 100 }]} cx="50%" cy="50%" outerRadius={80} label>
                                                <Cell fill="#82ca9d" />
                                                <Cell fill="#e5e7eb" />
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <p className="text-center font-semibold text-lg">0% Completed</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Phase Progress</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={[]}>
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/*  Weekly Progress  */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Weekly Progress</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={[]}>
                                            <XAxis dataKey="" />
                                            <YAxis />
                                            <Tooltip />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/*  Milestone Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Milestone Chart</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={[]}>
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        <h2 className="text-xl font-bold mt-10 mb-4">Milestones</h2>
                        <div className="text-sm text-muted-foreground">No milestones yet.</div>
                    </TabsContent>
                ) : (
                    // render each exam's content normally (but still safe)
                    exams.map((ex) => (
                        <TabsContent key={ex.id} value={String(ex.id)}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                {/* Pie - overall */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Exam Progress</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <PieChart>
                                                <Pie
                                                    dataKey="value"
                                                    data={[
                                                        { name: "Completed", value: ex.progress_percent ?? 0 },
                                                        { name: "Remaining", value: Math.max(0, 100 - (ex.progress_percent ?? 0)) },
                                                    ]}
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={80}
                                                    label
                                                >
                                                    <Cell fill="#82ca9d" />
                                                    <Cell fill="#e5e7eb" />
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <p className="text-center font-semibold text-lg">{ex.progress_percent ?? 0}% Completed</p>
                                    </CardContent>
                                </Card>

                                {/* Phase Progress */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Phase Progress</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <BarChart data={phaseProgressData}>
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="progress" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                                {/* Weekly */}
                                <Card className=" col-span-2">
                                    <CardHeader>
                                        <CardTitle>Weekly Progress</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <LineChart data={weekProgressData}>
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Line type="basis" dataKey="progress" strokeWidth={2} stroke="#8884d8" />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                            </div>

                            {/* Milestone Cards */}
                            <h2 className="text-xl font-bold mt-10 mb-4">Milestones</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(milestones.length ? milestones : []).map((m) => (
                                    <Card key={m.id}>
                                        <CardHeader>
                                            <CardTitle>{m.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <p>
                                                <span className="font-semibold">Goal:</span> {m.goal ?? "—"}
                                            </p>

                                            <p>
                                                <span className="font-semibold">Target:</span>{" "}
                                                {m.target_date ? new Date(m.target_date).toLocaleDateString() : "N/A"}
                                            </p>
                                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                {m.achieved ? (
                                                    <>
                                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                        Achieved
                                                    </>
                                                ) : (
                                                    <>
                                                        <Clock className="h-4 w-4 text-orange-500" />
                                                        Pending
                                                    </>
                                                )}
                                            </p>

                                        </CardContent>
                                    </Card>
                                ))}
                                {/* fallback when no milestones */}
                                {milestones.length === 0 && <div className="text-sm text-muted-foreground">No milestones yet.</div>}
                            </div>
                        </TabsContent>
                    ))
                )}
            </Tabs>
        </div>
    );
}
