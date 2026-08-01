"use client";

import { useMemo } from "react";
import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    Flame,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";


export default function TodaysClient({ todaysTasks }: { todaysTasks: any[] }) {

    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const tomorrow = useMemo(() => {
        const d = new Date(today);
        d.setDate(d.getDate() + 1);
        return d;
    }, [today]);

    const stats = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingEnd = new Date(today);
        upcomingEnd.setDate(upcomingEnd.getDate() + 3);
        upcomingEnd.setHours(23, 59, 59, 999);

        let todayTasks = 0;
        let completedToday = 0;
        let overdue = 0;
        let upcoming = 0;

        todaysTasks.forEach((task) => {
            const start = new Date(task.start_date);
            start.setHours(0, 0, 0, 0);

            const end = new Date(task.end_date);
            end.setHours(23, 59, 59, 999);

            // Today's task
            const isToday = start <= today && end >= today;

            if (isToday) {
                todayTasks++;

                if (task.is_completed) {
                    completedToday++;
                }
            }

            // Overdue
            if (!task.is_completed && end < today) {
                overdue++;
            }

            // Upcoming (next 3 days, excluding today)
            if (start > today && start <= upcomingEnd) {
                upcoming++;
            }
        });

        return {
            todayTasks,
            completed: completedToday,
            overdue,
            upcoming,
        };
    }, [todaysTasks]);

    const greeting = useMemo(() => {
        const hour = new Date().getHours();

        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    }, []);

    const formattedDate = useMemo(() => {
        return new Intl.DateTimeFormat("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(new Date());
    }, []);

    const groupedTasks = useMemo(() => {
        const groups = new Map<
            number,
            {
                examId: number;
                examName: string;
                tasks: typeof todaysTasks;
            }
        >();

        todaysTasks.forEach((task) => {
            const start = new Date(task.start_date);
            start.setHours(0, 0, 0, 0);

            const end = new Date(task.end_date);
            end.setHours(23, 59, 59, 999);

            if (!(start <= today && end >= today)) return;

            const exam = task.week.phase.roadmap.userExam.exam;

            if (!groups.has(exam.id)) {
                groups.set(exam.id, {
                    examId: exam.id,
                    examName: exam.name,
                    tasks: [],
                });
            }

            groups.get(exam.id)!.tasks.push(task);
        });

        return Array.from(groups.values());
    }, [todaysTasks]);

    const overdueTasks = useMemo(() => {

        const groups = new Map<
            number,
            {
                examId: number;
                examName: string;
                tasks: typeof todaysTasks;
            }
        >();

        todaysTasks.forEach((task) => {
            if (task.is_completed) return;

            const end = new Date(task.end_date);
            end.setHours(23, 59, 59, 999);

            if (end >= today) return;

            const exam = task.week.phase.roadmap.userExam.exam;

            if (!groups.has(exam.id)) {
                groups.set(exam.id, {
                    examId: exam.id,
                    examName: exam.name,
                    tasks: [],
                });
            }

            groups.get(exam.id)!.tasks.push(task);
        });

        return Array.from(groups.values());
    }, [todaysTasks]);

    const upcomingTasks = useMemo(() => {

        const upcomingEnd = new Date(today);
        upcomingEnd.setDate(upcomingEnd.getDate() + 3);
        upcomingEnd.setHours(23, 59, 59, 999);

        const groups = new Map<
            number,
            {
                examId: number;
                examName: string;
                tasks: typeof todaysTasks;
            }
        >();

        todaysTasks.forEach((task) => {
            if (task.is_completed) return;

            const start = new Date(task.start_date);
            start.setHours(0, 0, 0, 0);

            // Starts after today and within next 3 days
            if (!(start > today && start <= upcomingEnd)) return;

            const exam = task.week.phase.roadmap.userExam.exam;

            if (!groups.has(exam.id)) {
                groups.set(exam.id, {
                    examId: exam.id,
                    examName: exam.name,
                    tasks: [],
                });
            }

            groups.get(exam.id)!.tasks.push(task);
        });

        return Array.from(groups.values());
    }, [todaysTasks]);

    return (
        <section className="min-h-screen overflow-y-auto space-y-6 p-6 max-w-7xl mx-auto md:pt-36 pt-20">
            {/* Hero */}
            <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">
                    {greeting} 👋 <br />
                    {todaysTasks[0]?.week.phase.roadmap.userExam.user.name || "there"}
                </h1>

                <p className="text-lg text-muted-foreground">
                    Here's your study plan for today.
                </p>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    {formattedDate}
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <OverviewCard
                    title="Today's Tasks"
                    value={stats.todayTasks}
                    icon={<Clock3 className="h-5 w-5" />}
                />

                <OverviewCard
                    title="Completed"
                    value={stats.completed}
                    total={stats.todayTasks}
                    icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
                />

                <OverviewCard
                    title="Overdue"
                    value={stats.overdue}
                    icon={<Flame className="h-5 w-5 text-red-500" />}
                />

                <OverviewCard
                    title="Upcoming"
                    value={stats.upcoming}
                    icon={<CalendarDays className="h-5 w-5 text-blue-500" />}
                />
            </div>

            {/* Today's Tasks */}
            <div className="mt-10 space-y-6">
                <div>
                    <h2 className="text-2xl font-bold">Today's Focus</h2>

                    <p className="text-muted-foreground">
                        Complete today's planned tasks across all your active exams.
                    </p>
                </div>

                {groupedTasks.length === 0 && (
                    <Card>
                        <CardContent className="flex h-40 items-center justify-center">
                            <div className="text-center">
                                <h3 className="text-lg font-semibold">
                                    🎉 Nothing planned today
                                </h3>

                                <p className="mt-2 text-sm text-muted-foreground">
                                    Enjoy your day or get ahead by starting upcoming tasks.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {groupedTasks.map((group) => (
                    <Card key={group.examId}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <div>
                                <CardTitle>{group.examName}</CardTitle>

                                <CardDescription>
                                    {group.tasks.length}{" "}
                                    {group.tasks.length === 1 ? "Task" : "Tasks"} Today
                                </CardDescription>
                            </div>

                            <Badge variant="secondary">
                                {group.tasks.length}
                            </Badge>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            {group.tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="flex items-start justify-between rounded-xl border p-4 transition-colors hover:bg-muted/40"
                                >
                                    <div className="flex items-start gap-3">
                                        <Checkbox
                                            checked={task.is_completed}
                                        />

                                        <div>
                                            <p
                                                className={`font-medium ${task.is_completed
                                                    ? "line-through text-muted-foreground"
                                                    : ""
                                                    }`}
                                            >
                                                {task.title}
                                            </p>

                                            {task.description && (
                                                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                                    {task.description}
                                                </p>
                                            )}

                                            <p className="mt-2 text-xs text-muted-foreground">
                                                {task.week.focus}
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                    >
                                        Open
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div>
                <h2 className="text-2xl font-bold text-red-600">
                    🔥 Due Tasks
                </h2>

                <p className="text-muted-foreground">
                    These tasks are overdue and should be completed first.
                </p>
            </div>

            {overdueTasks.length > 0 ? (
                <div className="mt-10 space-y-6">

                    {overdueTasks.map((group) => (
                        <Card
                            key={group.examId}
                            className="border-red-200 bg-red-50/40 dark:border-red-900 dark:bg-red-950/20"
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <div>
                                    <CardTitle>{group.examName}</CardTitle>

                                    <CardDescription>
                                        {group.tasks.length} overdue{" "}
                                        {group.tasks.length === 1 ? "task" : "tasks"}
                                    </CardDescription>
                                </div>

                                <Badge variant="destructive">
                                    {group.tasks.length}
                                </Badge>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                {group.tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex items-start justify-between rounded-lg border border-red-200 bg-background p-4"
                                    >
                                        <div className="flex gap-3">
                                            <Checkbox checked={false} />

                                            <div>
                                                <h4 className="font-medium">
                                                    {task.title}
                                                </h4>

                                                {task.description && (
                                                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                                        {task.description}
                                                    </p>
                                                )}

                                                <div className="mt-2 flex items-center gap-2 text-xs text-red-600">
                                                    <span>
                                                        Due{" "}
                                                        {new Date(
                                                            task.end_date
                                                        ).toLocaleDateString()}
                                                    </span>

                                                    <span>•</span>

                                                    <span>{task.week.focus}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                        >
                                            Open
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="border-green-200 bg-green-50/40 dark:border-green-900 dark:bg-green-950/20">
                    <CardContent className="flex h-40 items-center justify-center">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-green-600">
                                🎉 No overdue tasks
                            </h3>

                            <p className="mt-2 text-sm text-muted-foreground">
                                Great job! You're on track with your study plan.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div>
                <h2 className="text-2xl font-bold text-blue-600">
                    ⏳ Upcoming Tasks
                </h2>

                <p className="text-muted-foreground">
                    These tasks are scheduled for the next 3 days.
                </p>
            </div>

            {upcomingTasks.length > 0 ? (
                <div className="mt-10 space-y-6">

                    {upcomingTasks.map((group) => (
                        <Card key={group.examId}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <div>
                                    <CardTitle>{group.examName}</CardTitle>

                                    <CardDescription>
                                        {group.tasks.length}{" "}
                                        {group.tasks.length === 1 ? "Task" : "Tasks"}
                                    </CardDescription>
                                </div>

                                <Badge variant="outline">
                                    {group.tasks.length}
                                </Badge>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                {group.tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex items-start justify-between rounded-xl border p-4 transition-colors hover:bg-muted/40"
                                    >
                                        <div className="flex items-start gap-3">
                                            <Checkbox
                                                checked={task.is_completed}
                                                disabled
                                            />

                                            <div>
                                                <h4 className="font-medium">
                                                    {task.title}
                                                </h4>

                                                {task.description && (
                                                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                                        {task.description}
                                                    </p>
                                                )}

                                                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                    <Badge variant="secondary">
                                                        {task.week.focus}
                                                    </Badge>

                                                    <span>•</span>

                                                    <span>
                                                        {new Date(
                                                            task.start_date
                                                        ).toLocaleDateString("en-US", {
                                                            day: "numeric",
                                                            month: "short",
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                        >
                                            Preview
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="border-blue-200 bg-blue-50/40 dark:border-blue-900 dark:bg-blue-950/20">
                    <CardContent className="flex h-40 items-center justify-center">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-blue-600">
                                🕒 No upcoming tasks
                            </h3>

                            <p className="mt-2 text-sm text-muted-foreground">
                                You don't have any tasks scheduled for the next 3 days.
                            </p>
                        </div>
                    </CardContent>

                </Card>
            )}

        </section>
    );
}

function OverviewCard({
    title,
    value,
    total,
    icon,
}: {
    title: string;
    value: number;
    total?: number;
    icon: React.ReactNode;
}) {
    return (
        <Card className="border-border/60 shadow-none">
            <CardContent className="flex items-center justify-between p-6">
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>

                    <h2 className="mt-2 text-3xl font-bold">{value}</h2>
                    {total !== undefined && (
                        <p className="text-sm text-muted-foreground">
                            of {total} tasks
                        </p>
                    )}
                </div>

                <div className="rounded-xl bg-muted p-3">{icon}</div>
            </CardContent>
        </Card>
    );
}