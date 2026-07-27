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
    LineChart,
    Line,
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
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { Award, BadgeCheck, BookOpen, CircleX, ClipboardCheck, Clock3, FileText, Lightbulb, Route, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import { generateRoadmap } from "@/app/actions/roadmap";
import { deleteUserExam } from "@/app/actions/action";
import { tr } from "date-fns/locale";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";


export default function DashboardAnalytics({ dashboardUser }: { dashboardUser: DashboardUser }) {
    const exams = dashboardUser?.exams || [];
    // const exams: any[] = []

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

    // for phase progress bar chart
    const phaseProgressData = phases.map((p: any) => ({
        name: p.phase_name ?? "Phase",
        progress: Math.round(p.progress ?? 0),
    }));

    // for weekly progress area chart - flatten all weeks from all phases into one array
    const weekProgressData = phases
        .flatMap((p: any) =>
            (p.weeks || []).map((w: any) => ({
                week: `W${w.week_number ?? "?"}`, // 👈 display
                progress: Math.round(w.progress ?? 0),
                weekNumber: typeof w.week_number === "number" ? w.week_number : Infinity, // 👈 logic
            }))
        )
        .sort((a, b) => a.weekNumber - b.weekNumber)

    // safe values for top cards
    const totalUserExams = exams.length;

    // safe values for top cards
    const selectedProgress = exam?.progress_percent ?? 0;
    const selectedId = exam?.id ?? null;
    const roadmapStatus = exam?.roadmap_status;
    // const roadmapStatus = RoadmapStatus.failed

    // safe values for top performance cards
    const performanceScore = exam?.performanceScore ?? 0;
    const highestScore = exam?.highestScore ?? 0;
    const lowestScore = exam?.lowestScore ?? 0;
    const lastTestScore = exam?.lastTestScore ?? 0;

    const totalTests = exam?.tests?.length ?? 0;

    const testsGenerated =
        exam?.tests?.filter((t) => t.isGenerated).length ?? 0;

    const testsAttempted =
        exam?.tests?.filter((t) => t.attempt).length ?? 0;

    const testsPassed =
        exam?.tests?.filter((t) => t.attempt?.isPassed).length ?? 0;

    const testsFailed =
        exam?.tests?.filter((t) => t.attempt && !t.attempt.isPassed).length ?? 0;

    //performance trend
    const performanceTrend =
        exam?.tests?.filter((test: (typeof exam.tests)[number]) => test.attempt)
            .sort(
                (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
            )
            .map((test, index) => ({
                test: `Test ${index + 1}`,
                score: test.attempt!.percentage,
                type: test.type,
            })) ?? [];



    const performanceChartConfig = {
        score: {
            label: "Score",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig;

    // performance pie chart data
    const pfPieChartData = [
        {
            status: "Passed",
            value: testsAttempted
                ? Math.round((testsPassed / testsAttempted) * 100)
                : 0,
            fill: "var(--color-passed)",
        },
        {
            status: "Failed",
            value: testsAttempted
                ? Math.round((testsFailed / testsAttempted) * 100)
                : 0,
            fill: "var(--color-failed)",
        },
    ];

    const pfChartConfig = {
        value: {
            label: "Percentage",
        },
        passed: {
            label: "Passed",
            color: "#22c55e", // green
        },
        failed: {
            label: "Failed",
            color: "#ef4444", // red
        },
    } satisfies ChartConfig;

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
    } satisfies ChartConfig;

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

    const passRate =
        testsAttempted > 0
            ? Math.round((testsPassed / testsAttempted) * 100)
            : 0;

    const overallPerformanceSummary =
        performanceScore >= 85
            ? "Excellent performance with consistently strong test results."
            : performanceScore >= 70
                ? "Good overall performance with room for further improvement."
                : performanceScore >= 50
                    ? "Average performance. More practice is needed to strengthen concepts."
                    : "Performance is currently below expectations and requires focused practice.";

    const roadmapSummary =
        selectedProgress >= 90
            ? `Your roadmap is ${selectedProgress}% complete and is almost finished.`
            : selectedProgress >= 70
                ? `Your roadmap is ${selectedProgress}% complete with good overall progress.`
                : selectedProgress >= 40
                    ? `Your roadmap is ${selectedProgress}% complete and progressing steadily.`
                    : `Your roadmap is ${selectedProgress}% complete. Continue completing weekly tasks.`;

    const testsSummary =
        totalTests === 0
            ? "No tests have been generated yet."
            : testsAttempted === totalTests
                ? `All ${totalTests} available tests have been completed.`
                : testsAttempted >= totalTests * 0.75
                    ? `${testsAttempted} of ${totalTests} tests have been completed.`
                    : testsAttempted >= totalTests * 0.4
                        ? `${testsAttempted} of ${totalTests} tests have been attempted so far.`
                        : `Only ${testsAttempted} of ${totalTests} tests have been attempted.`;

    const passRateSummary =
        testsAttempted === 0
            ? "No tests have been attempted yet."
            : passRate >= 85
                ? `Passed ${testsPassed} tests and failed ${testsFailed}, achieving an excellent ${passRate}% pass rate.`
                : passRate >= 70
                    ? `Passed ${testsPassed} tests and failed ${testsFailed}, achieving a healthy ${passRate}% pass rate.`
                    : passRate >= 50
                        ? `Passed ${testsPassed} tests and failed ${testsFailed}, resulting in a ${passRate}% pass rate.`
                        : `Passed ${testsPassed} tests and failed ${testsFailed}. Your current pass rate is ${passRate}%.`;

    const latestPerformanceSummary =
        testsAttempted === 0
            ? "No test attempts are available yet."
            : lastTestScore >= highestScore - 5
                ? `Your latest test score is ${lastTestScore}%, which is close to your personal best of ${highestScore}%.`
                : lastTestScore > performanceScore
                    ? `Your latest test score is ${lastTestScore}%, which is above your average performance.`
                    : lastTestScore < performanceScore
                        ? `Your latest test score is ${lastTestScore}%, which is below your average performance.`
                        : `Your latest test score is ${lastTestScore}%, matching your overall average.`;

    const suggestions: string[] = [];

    if (selectedProgress < 50)
        suggestions.push("Complete more roadmap tasks to build a stronger foundation.");

    if (testsAttempted < totalTests / 2)
        suggestions.push("Attempt more practice tests to improve your preparation.");

    if (passRate < 60 && testsAttempted > 0)
        suggestions.push("Review incorrect answers before taking the next assessment.");

    if (performanceScore >= 85)
        suggestions.push("Maintain your momentum by attempting more advanced tests.");

    if (
        performanceScore >= 70 &&
        passRate >= 70 &&
        selectedProgress >= 70
    ) {
        suggestions.push("You're progressing well. Keep practicing consistently to reach mastery.");
    }

    if (suggestions.length === 0) {
        suggestions.push("Keep following your roadmap and practice regularly.");
    }


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
        const roadmapRes = await generateRoadmap(selectedId);
        if (!roadmapRes.success) {
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
            const res = await deleteUserExam(selectedId);
            if (res.success) {
                toast.success("Exam deleted successfully.");
            } else {
                toast.error("Failed to delete exam.");
            }
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
                    <div className="p-4 mb-8 text-sm font-medium text-center text-blue-700 bg-blue-100 rounded-lg" role="alert">
                        <span className="font-medium">Regenerating roadmap...</span> This may take a moment.<br />
                        Please do not refresh or navigate away from this page.
                    </div>
                )
            }
            {/* Header */}
            <div className="flex items-center gap-x-6">
                <Image
                    src={dashboardUser?.image || "/avatar.png"}
                    width={60}
                    height={60}
                    alt="User"
                    className="rounded-full aspect-square w-15 object-cover object-center"
                />
                <div>
                    <h1 className="md:text-2xl tracking-wide text-xl font-bold">Welcome, <span className="text-emerald-600">{dashboardUser?.name ?? "Student"}</span></h1>
                    <p className="text-muted-foreground md:text-base text-sm">Your Exam Analytics Dashboard</p>
                </div>
            </div>

            {/* Top Cards */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {/* Exams */}
                <Card className="relative">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle className="text-xl font-semibold">
                                Exams Enrolled
                            </CardTitle>
                            <CardDescription className="text-sm text-muted-foreground">
                                Total exams you are enrolled in
                            </CardDescription>
                        </div>

                        <BookOpen className="h-6 absolute top-5 right-5 text-emerald-600" />
                    </CardHeader>

                    <CardContent>
                        <div className="text-5xl font-bold">
                            {totalUserExams}
                        </div>
                    </CardContent>
                </Card>

                {/* Progress */}
                <Card className="relative">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">
                            {currentSelectedExam?.exam.name || "Selected Exam"}
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                            Your progress in this exam
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="mb-3 flex items-center justify-between">
                            <span className="text-3xl font-bold">
                                {selectedProgress || 0}%
                            </span>

                            <span className="text-sm text-muted-foreground">
                                Completed
                            </span>
                        </div>

                        <Progress
                            value={selectedProgress || 0}
                            className="h-3 [&>div]:bg-emerald-600"
                        />
                    </CardContent>
                    <TrendingUp className="h-6 absolute top-5 right-5 text-emerald-600" />
                </Card>

                {/* Roadmap */}
                <Card className="flex flex-col relative">
                    <CardHeader className="flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle className="text-xl font-semibold">
                                Roadmap
                            </CardTitle>

                            <CardDescription className="text-sm text-muted-foreground mt-2">
                                Your learning path
                            </CardDescription>
                        </div>

                        <Route className="h-6 absolute top-5 right-5 text-blue-600" />
                    </CardHeader>

                    <CardContent className="mt-auto">
                        {!exam ? (
                            <Link href="/onboarding">
                                <Button className="w-full cursor-pointer">
                                    Create Roadmap
                                </Button>
                            </Link>
                        ) : roadmapStatus === RoadmapStatus.completed &&
                            !regenerating ? (
                            <Link href={`/dashboard/roadmap/${selectedId}`}>
                                <Button className="w-full cursor-pointer hover:bg-green-700 hover:text-white transition-colors duration-200">
                                    Open Roadmap
                                </Button>
                            </Link>
                        ) : roadmapStatus === RoadmapStatus.in_progress &&
                            !regenerating ? (
                            <Button
                                disabled
                                className="w-full"
                            >
                                ⏳ Generating...
                            </Button>
                        ) : regenerating ? (
                            <Button
                                disabled
                                className="w-full"
                            >
                                🔁 Regenerating...
                            </Button>
                        ) : (
                            <Button
                                className="w-full cursor-pointer bg-red-700 hover:bg-red-600 text-white transition-colors duration-200"
                                onClick={handleRegenerate}
                            >
                                🔁 Regenerate Roadmap
                            </Button>
                        )}
                    </CardContent>
                </Card>

                {/* Tests */}
                <Card className="flex flex-col relative">
                    <CardHeader className="flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle className="text-xl font-semibold">
                                Practice Tests
                            </CardTitle>

                            <CardDescription className="text-sm text-muted-foreground mt-2">
                                Evaluate your progress
                            </CardDescription>
                        </div>

                        <ClipboardCheck className="h-6 absolute top-5 right-5 text-violet-600" />
                    </CardHeader>

                    <CardContent className="mt-auto">
                        <Link href={`/user-exam/${selectedId}/tests`}>
                            <Button className="w-full cursor-pointer hover:bg-green-700 hover:text-white transition-colors duration-200">
                                Give Tests
                            </Button>
                        </Link>
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
                className="mt-6 p-4 "
            >
                <TabsList className="flex flex-wrap gap-2 mb-4 bg-gray-200">
                    {exams.length > 0 ? (
                        exams.map((ex) => (
                            <TabsTrigger key={ex.id} value={String(ex.id)} className="capitalize font-semibold cursor-pointer data-[state=active]:bg-green-700 data-[state=active]:text-white data-[state=active]:cursor-default">
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
                                                        dataKey="week"
                                                        tickLine={false}
                                                        axisLine={false}
                                                        tickMargin={8}
                                                    />

                                                    <YAxis
                                                        domain={[0, 100]}
                                                        tickLine={true}
                                                        axisLine={true}
                                                        tickMargin={8}
                                                    />

                                                    <ChartTooltip
                                                        cursor={true}
                                                        content={<ChartTooltipContent
                                                            indicator="dot"
                                                            labelFormatter={(value) => `Week: ${value.replace("W", "")}`}
                                                        />
                                                        }
                                                    />
                                                    <ChartLegend content={<ChartLegendContent />} />
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

                                    {/* Milestones Cards */}
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
                                                    className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-[1.5px] ${isDone
                                                        ? "border-green-600 bg-green-50"
                                                        : "border-gray-300 bg-white"
                                                        }`}
                                                >
                                                    {/* Top Accent Glow
                                                    <div
                                                        className={`absolute top-0 bg left-0 h-1 w-full ${isDone ? "bg-green-500" : "bg-gray-300"
                                                            }`}
                                                    /> */}

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
                                                                📅 {m.target_date instanceof Date ? m.target_date.toLocaleDateString() : m.target_date}
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

                                {/* Performance Cards */}

                                <h1 className="text-2xl font-bold mt-10 mb-6">Performance Overview</h1>

                                <div className="grid gap-6 md:grid-cols-4">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <div>
                                                <CardTitle className="mb-2 font-semibold">
                                                    Performance Score
                                                </CardTitle>
                                                <CardDescription>
                                                    Overall readiness
                                                </CardDescription>
                                            </div>

                                            <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-950">
                                                <TrendingUp className="h-5 w-5 text-emerald-600" />
                                            </div>
                                        </CardHeader>

                                        <CardContent>
                                            <div className="text-3xl font-bold text-emerald-600">
                                                {performanceScore}%
                                            </div>

                                            <p className="text-xs text-muted-foreground mt-1">
                                                Based on your latest performance
                                            </p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <div>
                                                <CardTitle className="mb-2 font-semibold">
                                                    Highest Score
                                                </CardTitle>
                                                <CardDescription>
                                                    Best test performance
                                                </CardDescription>
                                            </div>

                                            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-950">
                                                <Award className="h-5 w-5 text-blue-600" />
                                            </div>
                                        </CardHeader>

                                        <CardContent>
                                            <div className="text-3xl font-bold text-blue-600">
                                                {highestScore}%
                                            </div>

                                            <p className="text-xs text-muted-foreground mt-1">
                                                Your personal best
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <div>
                                                <CardTitle className="mb-2 font-semibold">
                                                    Lowest Score
                                                </CardTitle>
                                                <CardDescription>
                                                    Room for improvement
                                                </CardDescription>
                                            </div>

                                            <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-950">
                                                <TrendingDown className="h-5 w-5 text-orange-600" />
                                            </div>
                                        </CardHeader>

                                        <CardContent>
                                            <div className="text-3xl font-bold text-orange-600">
                                                {lowestScore}%
                                            </div>

                                            <p className="text-xs text-muted-foreground mt-1">
                                                Lowest recorded score
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <div>
                                                <CardTitle className="mb-2 font-semibold">
                                                    Last Test
                                                </CardTitle>
                                                <CardDescription>
                                                    Most recent attempt
                                                </CardDescription>
                                            </div>

                                            <div className="rounded-lg bg-violet-100 p-2 dark:bg-violet-950">
                                                <Clock3 className="h-5 w-5 text-violet-600" />
                                            </div>
                                        </CardHeader>

                                        <CardContent>
                                            <div className="text-3xl font-bold text-violet-600">
                                                {lastTestScore}%
                                            </div>

                                            <p className="text-xs text-muted-foreground mt-1">
                                                Latest recorded score
                                            </p>
                                        </CardContent>
                                    </Card>

                                </div>


                                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mt-6">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <div>
                                                <CardTitle className="mb-2 font-semibold">
                                                    Generated Tests
                                                </CardTitle>
                                                <CardDescription>
                                                    Total AI generated tests
                                                </CardDescription>
                                            </div>

                                            <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-900">
                                                <FileText className="h-5 w-5 text-slate-600" />
                                            </div>
                                        </CardHeader>

                                        <CardContent>
                                            <div className="text-3xl font-bold">
                                                {testsGenerated}
                                            </div>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {totalTests} total tests available
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <div>
                                                <CardTitle className="mb-2 font-semibold">
                                                    Attempted
                                                </CardTitle>
                                                <CardDescription>
                                                    Tests you've completed
                                                </CardDescription>
                                            </div>

                                            <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-950">
                                                <ClipboardCheck className="h-5 w-5 text-indigo-600" />
                                            </div>
                                        </CardHeader>

                                        <CardContent>
                                            <div className="text-3xl font-bold text-indigo-600">
                                                {testsAttempted}
                                            </div>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {totalTests > 0
                                                    ? `${Math.round((testsAttempted / totalTests) * 100)}% completed`
                                                    : "No tests yet"}
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <div>
                                                <CardTitle className="mb-2 font-semibold">
                                                    Passed
                                                </CardTitle>
                                                <CardDescription>
                                                    Successfully cleared
                                                </CardDescription>
                                            </div>

                                            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-950">
                                                <BadgeCheck className="h-5 w-5 text-green-600" />
                                            </div>
                                        </CardHeader>

                                        <CardContent>
                                            <div className="text-3xl font-bold text-green-600">
                                                {testsPassed}
                                            </div>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {testsAttempted > 0
                                                    ? `${Math.round((testsPassed / testsAttempted) * 100)}% pass rate`
                                                    : "No attempts yet"}
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <div>
                                                <CardTitle className="mb-2 font-semibold">
                                                    Failed
                                                </CardTitle>
                                                <CardDescription>
                                                    Tests to improve
                                                </CardDescription>
                                            </div>

                                            <div className="rounded-lg bg-red-100 p-2 dark:bg-red-950">
                                                <CircleX className="h-5 w-5 text-red-600" />
                                            </div>
                                        </CardHeader>

                                        <CardContent>
                                            <div className="text-3xl font-bold text-red-600">
                                                {testsFailed}
                                            </div>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {testsAttempted > 0
                                                    ? `${Math.round((testsFailed / testsAttempted) * 100)}% failure rate`
                                                    : "No attempts yet"}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2 mt-6">

                                    <Card className="">
                                        <CardHeader>
                                            <CardTitle>Performance Trend</CardTitle>
                                            <CardDescription>
                                                Score progression across all tests
                                            </CardDescription>
                                        </CardHeader>

                                        <CardContent>
                                            <ChartContainer
                                                config={performanceChartConfig}
                                                className="h-75 w-full"
                                            >
                                                <LineChart
                                                    accessibilityLayer
                                                    data={performanceTrend.length > 0 ? performanceTrend : [{ test: "No Data", score: 0, type: "N/A" }]}
                                                >
                                                    <CartesianGrid vertical={true} />

                                                    <XAxis
                                                        dataKey="test"
                                                        tickLine={true}
                                                        axisLine={true}
                                                    />

                                                    <YAxis
                                                        domain={[0, 100]}
                                                        tickLine={true}
                                                        axisLine={true}
                                                    />

                                                    <ChartTooltip
                                                        cursor={true}
                                                        content={<ChartTooltipContent />}
                                                    />

                                                    <Line
                                                        dataKey="score"
                                                        type="monotone"
                                                        stroke="var(--color-score)"
                                                        strokeWidth={3}
                                                        dot={{
                                                            r: 7,
                                                            fill: "var(--color-score)",
                                                            stroke: "var(--color-score)",
                                                        }}
                                                        activeDot={{
                                                            r: 7,
                                                            fill: "#16a34a",
                                                            stroke: "var(--color-score)",
                                                        }}
                                                    />
                                                    <Line
                                                        dataKey="type"
                                                        type="monotone"
                                                        stroke="var(--color-type)"
                                                        strokeWidth={3}
                                                        dot={{
                                                            r: 5,
                                                        }}
                                                        activeDot={{
                                                            r: 7,
                                                        }}
                                                    />
                                                </LineChart>
                                            </ChartContainer>
                                        </CardContent>
                                        <CardFooter className="flex-col items-start gap-2 text-sm">
                                            <div className="flex gap-2 leading-none font-medium">
                                                Your performance trend over time <TrendingUp className="h-4 w-4" />
                                            </div>
                                            <div className="leading-none text-muted-foreground">
                                                Track your score progression across all tests
                                            </div>
                                        </CardFooter>
                                    </Card>

                                    {/* Pass Fail Pie Chart */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Pass Rate</CardTitle>
                                            <CardDescription className="text-sm text-muted-foreground">
                                                Your overall test performance distribution
                                            </CardDescription>
                                        </CardHeader>


                                        <CardContent>
                                            <ChartContainer
                                                config={pfChartConfig}
                                                className="mx-auto aspect-square max-h-62.5 pb-0 [&_.recharts-pie-label-text]:fill-foreground"
                                            >
                                                <PieChart>
                                                    <ChartTooltip
                                                        content={<ChartTooltipContent hideLabel />}
                                                    />

                                                    <Pie
                                                        data={pfPieChartData}
                                                        dataKey="value"
                                                        nameKey="status"
                                                        label={({ percent }) =>
                                                            `${((percent ?? 0) * 100).toFixed(0)}%`
                                                        }
                                                    />
                                                </PieChart>
                                            </ChartContainer>

                                            <p className="text-center text-lg font-semibold">
                                                {testsAttempted > 0
                                                    ? `${Math.round((testsPassed / testsAttempted) * 100)}%`
                                                    : "0%"} Passing Rate
                                            </p>
                                        </CardContent>

                                        <CardFooter className="flex-col items-start gap-2 text-sm">
                                            <div className="flex gap-2 leading-none font-medium">
                                                {(pfPieChartData[0]?.value ?? 0) >= 70
                                                    ? "Strong progress — you're close to the finish line"
                                                    : (pfPieChartData[0]?.value ?? 0) >= 40
                                                        ? "Good pace — stay consistent"
                                                        : "Just getting started — build the habit"}
                                                <TrendingUp className="h-4 w-4" />
                                            </div>
                                            <div className="leading-none text-muted-foreground">
                                                {(pfPieChartData[0]?.value ?? 0)}% of your exam journey is complete
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </div>

                                {/* Performance Summary */}

                                <h1 className="text-2xl font-bold mt-12 mb-6">Your {selectedExam?.exam.name} Summary</h1>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Sparkles className="h-5 w-5 text-emerald-600" />
                                            A quick overview of your current progress and performance.
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent className="space-y-6">
                                        <div className="space-y-4">

                                            <div className="flex items-start gap-3">
                                                <TrendingUp className="mt-1 h-4 w-4 text-emerald-600" />
                                                <div>
                                                    <p className="font-medium">Overall Performance</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {overallPerformanceSummary}
                                                    </p>
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="flex items-start gap-3">
                                                <Route className="mt-1 h-4 w-4 text-blue-600" />
                                                <div>
                                                    <p className="font-medium">Roadmap Progress</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {roadmapSummary}
                                                    </p>
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="flex items-start gap-3">
                                                <ClipboardCheck className="mt-1 h-4 w-4 text-violet-600" />
                                                <div>
                                                    <p className="font-medium">Tests</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {testsSummary}
                                                    </p>
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="flex items-start gap-3">
                                                <BadgeCheck className="mt-1 h-4 w-4 text-green-600" />
                                                <div>
                                                    <p className="font-medium">Pass Rate</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {passRateSummary}
                                                    </p>
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="flex items-start gap-3">
                                                <Clock3 className="mt-1 h-4 w-4 text-orange-600" />
                                                <div>
                                                    <p className="font-medium">Latest Performance</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {latestPerformanceSummary}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-lg border bg-muted/40 p-4">
                                            <div className="mb-3 flex items-center gap-2">
                                                <Lightbulb className="h-4 w-4 text-yellow-500" />
                                                <h4 className="font-semibold">
                                                    Suggestions
                                                </h4>
                                            </div>

                                            <ul className="space-y-2 text-sm text-muted-foreground">
                                                {suggestions.map((suggestion, index) => (
                                                    <li key={index} className="flex items-start gap-2">
                                                        <span className="mt-1 text-yellow-500">💡</span>
                                                        {suggestion}
                                                    </li>
                                                ))}
                                            </ul>

                                        </div>
                                    </CardContent>
                                </Card>


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
                                                <button onClick={() => setDltDialogOpen(true)} className="bg-transparent text-red-600 font-medium cursor-pointer hover:text-white border border-red-600 px-4 py-2 rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed" disabled={deleting}>
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
                                                                <span className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />

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
