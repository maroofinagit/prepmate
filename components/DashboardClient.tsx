"use client";

import { useState, useMemo, useEffect } from "react";
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
import { RoadmapStatus } from "@/generated/prisma/enums";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
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
    const [regenerating, setRegenerating] = useState(false);

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
    const roadmapStatus = exam?.roadmap_status;
    console.log("Selected Exam:", exam);

    useEffect(() => {
        // check if roadmap is not generated if not show a toast to inform user to generate roadmap
        if (selectedExam && selectedExam.roadmap_status === RoadmapStatus.failed) {
            toast.error(
                `Your roadmap for ${selectedExam.exam?.name ?? "the selected exam"} is not generated yet. Please click "Regenerate Roadmap" to create your personalized study plan.`,
                {
                    duration: 1500, // show for 1.5 seconds
                }
            );
        }
    }, [exams, selectedExam]);

    const router = useRouter();

    const handleRegenerate = async () => {
        if (!selectedId) return;
        setRegenerating(true);
        const roadmapRes = await fetch(`/api/roadmap`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_exam_id: selectedId }),
        });
        if (!roadmapRes.ok) {
            toast.error('Failed to regenerate roadmap. Please try again later.');
            setRegenerating(false);
            return;
        }
        toast.success('Roadmap regeneration started. It may take a few moments to complete.');
        setRegenerating(false);
        router.refresh(); // refresh to update roadmap status and charts
    }

    const handleDelete = async () => {
        if (!selectedId) return;

        try {
            await fetch(`/api/deleteUserExam`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_exam_id: selectedId }),
            });
            toast.success("Exam deleted successfully.");
            setSelectedExam(null);
            router.refresh();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete exam. Please try again later.");
        }
    };

    return (
        <div className="space-y-8 md:pt-36 py-12 pt-30 px-12 md:max-w-7xl mx-auto">
            {
                regenerating && (
                    <div className="p-4 mb-4 text-sm text-blue-700 bg-blue-100 rounded-lg" role="alert">
                        <span className="font-medium">Regenerating roadmap...</span> This may take a moment. Please wait.
                    </div>
                )
            }
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
                        {!exam ? (
                            <Link href="/onboarding">
                                <Button className="w-full cursor-pointer">Create Roadmap</Button>
                            </Link>
                        ) : roadmapStatus === RoadmapStatus.completed ? (
                            <Link href={`/dashboard/roadmap/${selectedId}`}>
                                <Button className="w-full cursor-pointer">Open Roadmap</Button>
                            </Link>
                        ) : roadmapStatus === RoadmapStatus.in_progress ? (
                            <Button className="w-full" disabled>
                                ⏳ Generating Roadmap...
                            </Button>
                        ) : regenerating ? (
                            <Button className="w-full" disabled>
                                🔁 Regenerating...
                            </Button>
                        ) :

                            (
                                <Button className="w-full cursor-pointer" onClick={handleRegenerate}>
                                    🔁 Regenerate Roadmap
                                </Button>
                            )
                        }
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            {/* Tabs */}
            <Tabs
                defaultValue={exams[0] ? String(exams[0].id) : "none"}
                onValueChange={(v) => {
                    if (v === "none") {
                        setSelectedExam(null);
                        return;
                    }
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

                {/* NO EXAMS */}
                {exams.length === 0 ? (
                    <TabsContent value="none">

                        {/* 📱 MOBILE (ONLY PIE) */}
                        <div className="block md:hidden mt-6">
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
                                                    { name: "Completed", value: 0 },
                                                    { name: "Remaining", value: 100 },
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
                                    <p className="text-center font-semibold text-lg">0% Completed</p>

                                </CardContent>
                            </Card>
                        </div>

                        {/* 🖥 DESKTOP (ALL EMPTY STATES) */}
                        <div className="hidden md:block">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

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
                        </div>

                    </TabsContent>
                ) : (
                    exams.map((ex) => (
                        <TabsContent key={ex.id} value={String(ex.id)}>

                            {/* 📱 MOBILE */}
                            <div className="block md:hidden mt-6">
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

                                        <p className="text-center font-semibold text-lg">
                                            {ex.progress_percent ?? 0}% Completed
                                        </p>

                                    </CardContent>
                                </Card>
                            </div>

                            {/* 🖥 DESKTOP */}
                            <div className="hidden md:block">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                                    {/* Pie */}
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
                                            <p className="text-center font-semibold text-lg">
                                                {ex.progress_percent ?? 0}% Completed
                                            </p>
                                        </CardContent>
                                    </Card>

                                    {/* Phase */}
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
                                    <Card className="col-span-2">
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

                                {/* ✅ MILESTONES (DESKTOP ONLY) */}
                                <h2 className="text-xl font-bold mt-10 mb-4">Milestones</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                    {(milestones.length ? milestones : []).map((m) => (
                                        <Card key={m.id}>
                                            <CardHeader>
                                                <CardTitle>{m.name}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-2">
                                                <p><span className="font-semibold">Goal:</span> {m.goal ?? "—"}</p>
                                                <p>
                                                    <span className="font-semibold">Target:</span>{" "}
                                                    {m.target_date ? new Date(m.target_date).toLocaleDateString() : "N/A"}
                                                </p>
                                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                    {m.achieved ? "✅ Achieved" : "⏳ Pending"}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ))}

                                    {milestones.length === 0 && (
                                        <div className="text-sm text-muted-foreground">No milestones yet.</div>
                                    )}
                                </div>
                                {/* DELETE EXAM */}
                                <div className=" border-t pt-8">
                                    <h2 className="text-lg font-semibold text-red-600 mb-3">Danger Zone</h2>

                                    <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                                        <div>
                                            <p className="font-medium text-red-700">Delete your account</p>
                                            <p className="text-sm text-red-500">
                                                This action is permanent and cannot be undone.
                                            </p>
                                        </div>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <button className="bg-red-600 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-red-700">
                                                    Delete Exam
                                                </button>
                                            </DialogTrigger>

                                            <DialogContent className="sm:max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle className="text-red-600">
                                                        Delete Exam?
                                                    </DialogTitle>

                                                    <DialogDescription>
                                                        Are you sure you want to delete{" "}
                                                        <span className="font-semibold text-black">
                                                            {exam?.exam?.name ?? "this exam"}
                                                        </span>
                                                        ? This action cannot be undone.
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <DialogFooter className="mt-4">
                                                    <DialogClose asChild>
                                                        <button className="px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50" disabled={false}>
                                                            Cancel
                                                        </button>
                                                    </DialogClose>

                                                    <button
                                                        onClick={handleDelete}
                                                        className="bg-red-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-red-700"
                                                    >
                                                        Delete
                                                    </button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>

                                    </div>
                                </div>

                            </div>

                        </TabsContent>
                    ))
                )}
            </Tabs>

            <p className=" block md:hidden text-sm mt-4 bg-yellow-300 p-3 rounded-lg">
                ❗️ For full analytics, please access the dashboard on a desktop device. 📊
            </p>

        </div>
    );
}
