"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import Image from "next/image";
import {

    XAxis,
    YAxis,
    BarChart,
    Bar,
    PieChart,
    Pie,
    AreaChart,
    CartesianGrid,
    Area,
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
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { Sparkles, TrendingUp } from "lucide-react";


export default function DashboardAnalytics({ dashboardUser }: { dashboardUser: DashboardUser }) {
    const exams = dashboardUser?.exams || [];
    // const exams: any[] = [];

    const [selectedExam, setSelectedExam] = useState(exams.length ? exams[0] : null);
    const [regenerating, setRegenerating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [dltDialogOpen, setDltDialogOpen] = useState(false);

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

    // for phase progress bar chart
    const phaseProgressData = phases.map((p: any) => ({
        name: p.phase_name ?? "Phase",
        progress: Math.round(p.progress ?? 0),
    }));

    // for weekly progress area chart - flatten all weeks from all phases into one array
    const weekProgressData = phases
        .flatMap((p: any) =>
            (p.weeks || []).map((w: any) => ({
                name: `W${w.week_number ?? "?"}`,
                progress: Math.round(w.progress ?? 0),
                order: typeof w.week_number === "number" ? w.week_number : Infinity,
            }))
        )
        .sort((a: any, b: any) => (a.order ?? Infinity) - (b.order ?? Infinity));

    console.log("week progress data:", weekProgressData);

    // safe values for top cards
    const totalUserExams = exams.length;

    const overallProgress = Math.round(
        exams.reduce((acc, e) => acc + (e.progress_percent ?? 0), 0) / (exams.length || 1)
    );

    // safe values for top cards
    const selectedProgress = exam?.progress_percent ?? 0;
    const selectedId = exam?.id ?? null;
    const roadmapStatus = exam?.roadmap_status;

    // Chart config (labels, colors, etc.)
    const chartConfig = {
        value: {
            label: "Progress",
        },
        completed: {
            label: "Completed",
            color: "#22c55e", // green
        },
        remaining: {
            label: "Remaining",
            color: "#e5e7eb", // gray
        },
    }

    //PieChart Value
    const pieChartData = [
        {
            status: "Completed",
            value: selectedProgress ?? 0,
            fill: "var(--color-completed)",
        },
        {
            status: "Remaining",
            value: Math.max(0, 100 - (selectedProgress ?? 0)),
            fill: "var(--color-remaining)",
        },
    ]

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
            setDeleting(true);
            await fetch(`/api/deleteUserExam`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_exam_id: selectedId }),
            });
            toast.success("Exam deleted successfully.");
            setDltDialogOpen(false);
            setDeleting(false);
            setSelectedExam(null);
            router.refresh();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete exam. Please try again later.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-8 md:pt-36 py-12 pt-30 px-12 md:max-w-8xl mx-auto">
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
                    className="rounded-full aspect-square w-15 object-cover object-center"
                />
                <div>
                    <h1 className="md:text-2xl text-xl font-bold">Welcome, {dashboardUser?.name ?? "Student"}</h1>
                    <p className="text-muted-foreground md:text-base text-sm">Your Exam Analytics Dashboard</p>
                </div>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>User Exams Enrolled</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="md:text-4xl text-xl font-bold">{totalUserExams}</p>
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
                        <CardTitle>{currentSelectedExam?.exam.name || "Selected"} Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Progress value={selectedProgress || 0} className="h-3" />
                        <p className="text-center mt-2 font-semibold">{selectedProgress || 0}%</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Go to Roadmap</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!exam ? (
                            <Link href="/onboarding">
                                <Button className="w-full cursor-pointer hover:bg-emerald-600 hover:text-white md:text-base text-sm">Create Roadmap</Button>
                            </Link>
                        ) : roadmapStatus === RoadmapStatus.completed ? (
                            <Link href={`/dashboard/roadmap/${selectedId}`}>
                                <Button className="w-full cursor-pointer hover:bg-emerald-600 hover:text-white md:text-base text-sm">Open Roadmap</Button>
                            </Link>
                        ) : roadmapStatus === RoadmapStatus.in_progress ? (
                            <Button className="w-full disabled:cursor-not-allowed disabled:opacity-50 md:text-base text-sm" disabled>
                                ⏳ Generating Roadmap...
                            </Button>
                        ) : regenerating ? (
                            <Button className="w-full disabled:cursor-not-allowed disabled:opacity-50 md:text-base text-sm" disabled>
                                🔁 Regenerating...
                            </Button>
                        ) :

                            (
                                <Button className="w-full cursor-pointer hover:bg-emerald-600 hover:text-white md:text-base text-sm" onClick={handleRegenerate}>
                                    🔁 Regenerate Roadmap
                                </Button>
                            )
                        }
                    </CardContent>
                </Card>
            </div>

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
                                    <ChartContainer
                                        config={chartConfig}
                                        className="mx-auto aspect-square max-h-62.5 pb-0 [&_.recharts-pie-label-text]:fill-foreground"
                                    >
                                        <PieChart>
                                            <ChartTooltip content={<ChartTooltipContent hideLabel />} />

                                            <Pie
                                                data={pieChartData}
                                                dataKey="value"
                                                nameKey="status"
                                                label
                                            />
                                        </PieChart>
                                    </ChartContainer>
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
                                        <ChartContainer
                                            config={chartConfig}
                                            className="mx-auto aspect-square max-h-62.5 pb-0 [&_.recharts-pie-label-text]:fill-foreground"
                                        >
                                            <PieChart>
                                                <ChartTooltip content={<ChartTooltipContent hideLabel />} />

                                                <Pie
                                                    data={pieChartData}
                                                    dataKey="value"
                                                    nameKey="status"
                                                    label
                                                />
                                            </PieChart>
                                        </ChartContainer>
                                        <p className="text-center font-semibold text-lg">0% Completed</p>
                                    </CardContent>
                                </Card>

                                {/* Phase Progress Card */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Phase Progress</CardTitle>
                                    </CardHeader>

                                    <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                                        <ChartContainer
                                            config={{
                                                progress: {
                                                    label: "Progress",
                                                    color: "var(--chart-1)",
                                                },
                                            }}
                                            className="aspect-auto h-62.5 w-full"
                                        >
                                            <BarChart
                                                accessibilityLayer
                                                data={phaseProgressData}
                                                margin={{
                                                    left: 12,
                                                    right: 12,
                                                }}
                                            >
                                                <CartesianGrid vertical={false} />

                                                <XAxis
                                                    dataKey="name"
                                                    tickLine={true}
                                                    axisLine={true}
                                                    tickMargin={8}

                                                />

                                                <YAxis
                                                    domain={[0, 100]}
                                                    tickLine={true}
                                                    axisLine={true}
                                                    tickMargin={8}
                                                />

                                                <ChartTooltip
                                                    cursor={{ fill: "rgba(34,197,94,0.1)" }} // soft green glow
                                                    content={
                                                        <ChartTooltipContent
                                                            className="w-37.5"
                                                            nameKey="progress"
                                                            labelFormatter={(value) => `Phase: ${value}`}
                                                            formatter={(value) => `${value}% completed`}
                                                        />
                                                    }
                                                />

                                                <Bar
                                                    dataKey="progress"
                                                    fill="var(--color-progress)"
                                                    radius={8}
                                                    activeBar={{
                                                        fill: "var(--color-progress-hover)",
                                                        opacity: 1,
                                                        stroke: "var(--color-progress-hover)",
                                                        strokeWidth: 2,
                                                    }

                                                    }
                                                />
                                            </BarChart>
                                        </ChartContainer>
                                    </CardContent>

                                    <CardFooter className="flex-col items-start gap-2 text-sm">
                                        <div className="flex gap-2 leading-none font-medium">
                                            Keep pushing — steady progress wins <TrendingUp className="h-4 w-4" />
                                        </div>
                                        <div className="leading-none text-muted-foreground">
                                            Each phase represents your learning milestone
                                        </div>
                                    </CardFooter>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Weekly Progress</CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                                        <ChartContainer
                                            config={{
                                                progress: {
                                                    label: "Weekly Progress",
                                                    color: "var(--chart-1)",
                                                },
                                            }}
                                            className="aspect-auto h-62.5 w-full"
                                        >
                                            <AreaChart data={weekProgressData}>
                                                <defs>
                                                    <linearGradient id="fillProgress" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="var(--color-progress)" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="var(--color-progress)" stopOpacity={0.1} />
                                                    </linearGradient>
                                                </defs>

                                                <CartesianGrid vertical={false} />

                                                <XAxis
                                                    dataKey="name"
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tickMargin={8}
                                                />

                                                <YAxis
                                                    domain={[0, 100]}
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tickMargin={8}
                                                />

                                                <ChartTooltip
                                                    cursor={false}
                                                    content={<ChartTooltipContent indicator="dot" />}
                                                />

                                                <Area
                                                    dataKey="progress"
                                                    type="natural"
                                                    fill="url(#fillProgress)"
                                                    stroke="var(--color-progress)"
                                                    strokeWidth={2}
                                                />
                                            </AreaChart>
                                        </ChartContainer>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Milestone Chart</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ChartContainer
                                            config={{
                                                achieved: {
                                                    label: "Achieved",
                                                    color: "#22c55e",
                                                },
                                                pending: {
                                                    label: "Pending",
                                                    color: "#e5e7eb",
                                                },
                                            }}
                                            className="aspect-auto h-62.5 w-full"
                                        >
                                            <BarChart
                                                data={milestones.map((m: any) => ({
                                                    name: m.name ?? "Milestone",
                                                    achieved: m.achieved ? 100 : 0,
                                                    pending: m.achieved ? 0 : 100,
                                                }))}
                                                margin={{
                                                    left: 12,
                                                    right: 12,
                                                }}
                                            >
                                                <CartesianGrid vertical={false} />

                                                <XAxis
                                                    dataKey="name"
                                                    tickLine={true}
                                                    axisLine={true}
                                                    tickMargin={8}

                                                />

                                                <YAxis
                                                    domain={[0, 100]}
                                                    tickLine={true}
                                                    axisLine={true}
                                                    tickMargin={8}
                                                />

                                                <ChartTooltip
                                                    cursor={{ fill: "rgba(34,197,94,0.1)" }} // soft green glow
                                                    content={
                                                        <ChartTooltipContent
                                                            className="w-37.5"
                                                            nameKey="name"
                                                            formatter={(value) => `${value} milestone`}
                                                        />
                                                    }
                                                />

                                                <Bar
                                                    dataKey="achieved"
                                                    fill="#22c55e"
                                                    radius={8}
                                                />
                                                <Bar
                                                    dataKey="pending"
                                                    fill="#e5e7eb"
                                                    radius={8}
                                                />
                                            </BarChart>
                                        </ChartContainer>
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
                                        <ChartContainer
                                            config={chartConfig}
                                            className="mx-auto aspect-square max-h-62.5 pb-0 [&_.recharts-pie-label-text]:fill-foreground"
                                        >
                                            <PieChart>
                                                <ChartTooltip content={<ChartTooltipContent hideLabel />} />

                                                <Pie
                                                    data={pieChartData}
                                                    dataKey="value"
                                                    nameKey="status"
                                                    label
                                                />
                                            </PieChart>
                                        </ChartContainer>

                                        <p className="text-center font-semibold text-lg">
                                            {ex.progress_percent ?? 0}% Completed
                                        </p>

                                    </CardContent>
                                    <CardFooter className="flex-col items-start gap-2 text-sm">
                                        <div className="flex gap-2 leading-none font-medium">
                                            {(ex.progress_percent ?? 0) >= 70
                                                ? "Strong progress — you're close to the finish line"
                                                : (ex.progress_percent ?? 0) >= 40
                                                    ? "Good pace — stay consistent"
                                                    : "Just getting started — build the habit"}
                                            <TrendingUp className="h-4 w-4" />
                                        </div>
                                        <div className="leading-none text-muted-foreground">
                                            {(ex.progress_percent ?? 0)}% of your exam journey is complete
                                        </div>
                                    </CardFooter>
                                </Card>

                                <Card className="mt-6">
                                    <CardHeader>
                                        <CardTitle>Phase Progress</CardTitle>
                                    </CardHeader>

                                    <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                                        <ChartContainer
                                            config={{
                                                progress: {
                                                    label: "Progress",
                                                    color: "#22c55e",
                                                },
                                            }}
                                            className="aspect-auto h-62.5 w-full"
                                        >
                                            <BarChart
                                                accessibilityLayer
                                                data={phaseProgressData}
                                                margin={{
                                                    left: 12,
                                                    right: 12,
                                                }}
                                            >
                                                <CartesianGrid vertical={false} />

                                                <XAxis
                                                    dataKey="name"
                                                    tickLine={true}
                                                    axisLine={true}
                                                    tickMargin={8}

                                                />

                                                <YAxis
                                                    domain={[0, 100]}
                                                    tickLine={true}
                                                    axisLine={true}
                                                    tickMargin={8}
                                                />

                                                <ChartTooltip
                                                    cursor={{ fill: "rgba(34,197,94,0.1)" }} // soft green glow
                                                    content={
                                                        <ChartTooltipContent
                                                            className="w-37.5"
                                                            nameKey="progress"
                                                            labelFormatter={(value) => `Phase: ${value}`}
                                                            formatter={(value) => `${value}% completed`}
                                                        />
                                                    }
                                                />

                                                <Bar
                                                    dataKey="progress"
                                                    fill="#22c55e"
                                                    radius={8}
                                                    activeBar={{
                                                        fill: "#16a34a",
                                                        opacity: 1,
                                                        stroke: "#16a34a",
                                                        strokeWidth: 2,
                                                    }

                                                    }
                                                />
                                            </BarChart>
                                        </ChartContainer>
                                    </CardContent>
                                    <CardFooter className="flex-col items-start gap-2 text-sm">
                                        <div className="flex gap-2 leading-none font-medium">
                                            Your weekly effort is shaping your progress <TrendingUp className="h-4 w-4" />
                                        </div>
                                        <div className="leading-none text-muted-foreground">
                                            Track how consistently you’re improving week by week
                                        </div>
                                    </CardFooter>
                                </Card>
                            </div>

                            {/* 🖥 DESKTOP */}
                            <div className="hidden md:block">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                                    {/* Pie */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>{currentSelectedExam?.exam.name} Exam Progress</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ChartContainer
                                                config={chartConfig}
                                                className="mx-auto aspect-square max-h-62.5 pb-0 [&_.recharts-pie-label-text]:fill-foreground"
                                            >
                                                <PieChart>
                                                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />

                                                    <Pie
                                                        data={pieChartData}
                                                        dataKey="value"
                                                        nameKey="status"
                                                        label
                                                    />
                                                </PieChart>
                                            </ChartContainer>
                                            <p className="text-center font-semibold text-lg">
                                                {ex.progress_percent ?? 0}% Completed
                                            </p>
                                        </CardContent>
                                        <CardFooter className="flex-col items-start gap-2 text-sm">
                                            <div className="flex gap-2 leading-none font-medium">
                                                {(ex.progress_percent ?? 0) >= 70
                                                    ? "Strong progress — you're close to the finish line"
                                                    : (ex.progress_percent ?? 0) >= 40
                                                        ? "Good pace — stay consistent"
                                                        : "Just getting started — build the habit"}
                                                <TrendingUp className="h-4 w-4" />
                                            </div>
                                            <div className="leading-none text-muted-foreground">
                                                {(ex.progress_percent ?? 0)}% of your exam journey is complete
                                            </div>
                                        </CardFooter>
                                    </Card>

                                    {/* Phase Progress Bar Chart */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Phase Progress</CardTitle>
                                            <CardDescription>Progress across all phases</CardDescription>
                                        </CardHeader>

                                        <CardContent>
                                            <ChartContainer
                                                config={{
                                                    progress: {
                                                        label: "Progress",
                                                        color: "#22c55e",
                                                    },
                                                }}
                                                className="aspect-auto h-62.5 w-full"
                                            >
                                                <BarChart
                                                    accessibilityLayer
                                                    data={phaseProgressData}
                                                    margin={{
                                                        left: 12,
                                                        right: 12,
                                                    }}
                                                >
                                                    <CartesianGrid vertical={false} />

                                                    <XAxis
                                                        dataKey="name"
                                                        tickLine={true}
                                                        axisLine={true}
                                                        tickMargin={8}

                                                    />

                                                    <YAxis
                                                        domain={[0, 100]}
                                                        tickLine={true}
                                                        axisLine={true}
                                                        tickMargin={8}
                                                    />

                                                    <ChartTooltip
                                                        cursor={{ fill: "rgba(34,197,94,0.1)" }} // soft green glow
                                                        content={
                                                            <ChartTooltipContent
                                                                className="w-37.5"
                                                                nameKey="progress"
                                                                labelFormatter={(value) => `Phase: ${value}`}
                                                                formatter={(value) => `${value}% completed`}
                                                            />
                                                        }
                                                    />

                                                    <Bar
                                                        dataKey="progress"
                                                        fill="#22c55e"
                                                        radius={8}
                                                        activeBar={{
                                                            fill: "#16a34a",
                                                            opacity: 1,
                                                            stroke: "#16a34a",
                                                            strokeWidth: 2,
                                                        }

                                                        }
                                                    />
                                                </BarChart>
                                            </ChartContainer>
                                        </CardContent>

                                        <CardFooter className="flex-col items-start gap-2 text-sm">
                                            <div className="flex gap-2 leading-none font-medium">
                                                Keep pushing — steady progress wins <TrendingUp className="h-4 w-4" />
                                            </div>
                                            <div className="leading-none text-muted-foreground">
                                                Each phase represents your learning milestone
                                            </div>
                                        </CardFooter>
                                    </Card>


                                    {/* Weekly area chart */}
                                    <Card className="col-span-2">
                                        <CardHeader>
                                            <CardTitle>Weekly Progress</CardTitle>
                                        </CardHeader>
                                        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                                            <ChartContainer
                                                config={{
                                                    progress: {
                                                        label: "Weekly Progress",
                                                        color: "#22c55e",
                                                    },
                                                }}
                                                className="aspect-auto h-62.5 w-full"
                                            >
                                                <AreaChart data={weekProgressData}>
                                                    <defs>
                                                        <linearGradient id="fillProgress" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="var(--color-progress)" stopOpacity={0.8} />
                                                            <stop offset="95%" stopColor="var(--color-progress)" stopOpacity={0.1} />
                                                        </linearGradient>
                                                    </defs>

                                                    <CartesianGrid vertical={false} />

                                                    <XAxis
                                                        dataKey="name"
                                                        tickLine={false}
                                                        axisLine={false}
                                                        tickMargin={8}
                                                    />

                                                    <YAxis
                                                        domain={[0, 100]}
                                                        tickLine={false}
                                                        axisLine={false}
                                                        tickMargin={8}
                                                    />

                                                    <ChartTooltip
                                                        cursor={false}
                                                        content={<ChartTooltipContent indicator="dot" />}
                                                    />

                                                    <Area
                                                        dataKey="progress"
                                                        type="natural"
                                                        fill="url(#fillProgress)"
                                                        stroke="var(--color-progress)"
                                                        strokeWidth={2}
                                                    />
                                                </AreaChart>
                                            </ChartContainer>
                                        </CardContent>
                                        <CardFooter className="flex-col items-start gap-2 text-sm">
                                            <div className="flex gap-2 leading-none font-medium">
                                                Your weekly effort is shaping your progress <TrendingUp className="h-4 w-4" />
                                            </div>
                                            <div className="leading-none text-muted-foreground">
                                                Track how consistently you’re improving week by week
                                            </div>
                                        </CardFooter>
                                    </Card>

                                    <Card className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-5 p-6">

                                        <CardHeader className="col-span-3">
                                            <CardTitle>Milestones</CardTitle>
                                            <CardDescription>Track your key achievements</CardDescription>
                                        </CardHeader>

                                        {milestones.map((m: any) => {
                                            const isDone = m.achieved;

                                            return (
                                                <Card
                                                    key={m.id}
                                                    className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1
        ${isDone
                                                            ? "border-green-200 bg-green-50/60"
                                                            : "border-gray-200 bg-white"
                                                        }`}
                                                >
                                                    {/* Top Accent Glow */}
                                                    <div
                                                        className={`absolute top-0 left-0 h-1 w-full ${isDone ? "bg-green-500" : "bg-gray-300"
                                                            }`}
                                                    />

                                                    <CardHeader className="pb-2">
                                                        <CardTitle className="text-base flex items-center justify-between">
                                                            <span className="line-clamp-1">{m.name}</span>

                                                            {/* Emoji Badge */}
                                                            <span className="text-lg">
                                                                {isDone ? "🏆" : "🎯"}
                                                            </span>
                                                        </CardTitle>
                                                    </CardHeader>

                                                    <CardContent className="space-y-2">
                                                        {/* Status */}
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <span className="text-lg">
                                                                {isDone ? "✅" : "⏳"}
                                                            </span>

                                                            <span
                                                                className={`font-medium ${isDone ? "text-green-700" : "text-gray-600"
                                                                    }`}
                                                            >
                                                                {isDone ? "Completed" : "In Progress"}
                                                            </span>
                                                        </div>

                                                        {/* Goal */}
                                                        {m.goal && (
                                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                                {m.goal}
                                                            </p>
                                                        )}

                                                        {/* Date */}
                                                        {m.target_date && (
                                                            <p className="text-xs text-muted-foreground">
                                                                📅 {new Date(m.target_date).toLocaleDateString()}
                                                            </p>
                                                        )}
                                                    </CardContent>


                                                </Card>
                                            );

                                        })}
                                        <CardFooter className="col-span-2 flex-col items-start gap-2 mt-4 text-sm">
                                            <div className="flex gap-2 leading-none font-medium">
                                                Milestones are your stepping stones to success <Sparkles className="h-4 w-4" />
                                            </div>
                                            <div className="leading-none text-muted-foreground">
                                                Celebrate each achievement as you progress through your exam journey
                                            </div>
                                        </CardFooter>

                                    </Card>


                                </div>


                                {/* DELETE EXAM */}
                                <div className=" border-t mt-8 pt-8">
                                    <h2 className="text-lg font-semibold text-red-600 mb-3">Danger Zone</h2>

                                    <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                                        <div>
                                            <p className="font-medium text-red-700">Delete your {exam?.exam?.name ?? "exam"} exam.</p>
                                            <p className="text-sm text-red-500">
                                                This action is permanent and cannot be undone.
                                            </p>
                                        </div>
                                        <Dialog open={dltDialogOpen} onOpenChange={setDltDialogOpen}>
                                            <DialogTrigger asChild>
                                                <button onClick={() => setDltDialogOpen(true)} className="bg-red-600 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed" disabled={deleting}>
                                                    {deleting ? "Deleting..." : "Delete Exam"}
                                                </button>
                                            </DialogTrigger>

                                            <DialogContent className="sm:max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle className="text-red-600 mb-2">
                                                        Delete Exam ?
                                                    </DialogTitle>

                                                    <DialogDescription>
                                                        {deleting ? (
                                                            <span className="font-medium text-black flex items-center gap-2">
                                                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />

                                                                Deleting {exam?.exam?.name ?? "this exam"}...
                                                            </span>
                                                        ) : (
                                                            <>
                                                                Are you sure you want to delete{" "}
                                                                <span className="font-semibold text-black">
                                                                    {exam?.exam?.name ?? "this exam"} exam
                                                                </span>
                                                                ? This action cannot be undone.
                                                            </>
                                                        )}
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <DialogFooter className="mt-4">
                                                    <DialogClose asChild>
                                                        <button className="px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50" disabled={deleting}>
                                                            Cancel
                                                        </button>
                                                    </DialogClose>

                                                    <button
                                                        onClick={handleDelete}
                                                        className="bg-red-600 text-white px-4 py-2 rounded-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 hover:bg-red-700"
                                                        disabled={deleting}
                                                    >
                                                        {deleting ? "Deleting..." : "Yes, Delete"}
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
