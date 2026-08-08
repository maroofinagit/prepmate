"use client";

import { use, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, ChevronDown, ChevronUp, CheckCircle2, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Roadmap } from "@/app/types/roadmap";
import { completeMilestone, completeRoadmapTask } from "@/app/actions/action";
import { Search } from "lucide-react";
import { Badge } from "./ui/badge";
import { playNotification, playError } from "@/app/lib/sound";
import { useUser } from "@/app/context/userContext";


export default function RoadmapClient({ roadmap }: { roadmap: Roadmap }) {

    const { soundEnabled } = useUser(); // currently not used, but can be used for soundEnabled if needed
    const [localRoadmap, setLocalRoadmap] = useState(roadmap);
    const [expandedPhases, setExpandedPhases] = useState<(number | undefined)[]>([]);
    const [expandedWeeks, setExpandedWeeks] = useState<Record<number, (number | undefined)[]>>({});
    const [isExpandedAll, setIsExpandedAll] = useState(false);
    const [search, setSearch] = useState("");

    // task -> checked
    const [checkedTasks, setCheckedTasks] = useState<Record<number, boolean>>({});

    // milestone related states (kept as-is)
    const [checkedMilestones, setCheckedMilestones] = useState<Record<number, boolean>>({});
    const [loadingMilestone, setLoadingMilestone] = useState<Record<number, boolean>>({});

    // per-task updating state (so multiple can update independently)
    const [updatingTasks, setUpdatingTasks] = useState<Record<number, boolean>>({});

    // Toggle Phase
    const togglePhase = (phaseId: number | undefined) => {
        if (phaseId === undefined) return;
        setExpandedPhases((prev) =>
            prev.includes(phaseId) ? prev.filter((id) => id !== phaseId) : [...prev, phaseId]
        );
    };

    // Toggle Week
    const toggleWeek = (phaseId: number | undefined, weekId: number | undefined) => {
        if (phaseId === undefined || weekId === undefined) return;
        setExpandedWeeks((prev) => {
            const arr = prev[phaseId] || [];
            return {
                ...prev,
                [phaseId]: arr.includes(weekId)
                    ? arr.filter((id) => id !== weekId)
                    : [...arr, weekId],
            };
        });
    };

    // Expand All
    const expandAll = () => {
        const allPhases = localRoadmap.phases.map((p) => p.id);
        setExpandedPhases(allPhases);

        const allWeeks: Record<number, number[]> = {};
        localRoadmap.phases.forEach((phase) => {
            allWeeks[phase.id] = phase.weeks.map((w) => w.id);
        });

        setExpandedWeeks(allWeeks);
        setIsExpandedAll(true);
    };

    // Collapse All
    const collapseAll = () => {
        setExpandedPhases([]);
        setExpandedWeeks({});
        setIsExpandedAll(false);
    };

    // Task checkbox (toggle only; update happens via per-task button)
    const handleCheckboxChange = (taskId: number) => {
        setCheckedTasks((prev) => {
            const updated = { ...prev, [taskId]: !prev[taskId] };
            return updated;
        });
    };

    // Milestone checkbox
    const handleMilestoneChange = (milestoneId: number) => {
        setCheckedMilestones((prev) => ({
            ...prev,
            [milestoneId]: !prev[milestoneId],
        }));
    };

    // Update a single task (calls single-task API)
    const updateSingleTask = async (taskId: number) => {
        try {
            setUpdatingTasks((prev) => ({ ...prev, [taskId]: true }));

            const res = await completeRoadmapTask(taskId, localRoadmap.userExam.id, localRoadmap.userExam.user_id);

            if (!res.success) throw new Error("Failed to update task");
            if (soundEnabled) {
                playNotification();
            }
            console.log("Sound enabled:", soundEnabled);
            toast.success("Task completed!");

            // instant UI update: mark task completed and clear checkbox for that task
            setLocalRoadmap((prev) => ({
                ...prev,
                phases: prev.phases.map((phase) => ({
                    ...phase,
                    weeks: phase.weeks.map((week) => ({
                        ...week,
                        tasks: week.tasks.map((task) =>
                            task.id === taskId ? { ...task, is_completed: true } : task
                        ),
                    })),
                })),
                userExam: {
                    ...prev.userExam,
                    exam: {
                        ...prev.userExam.exam,
                        resources: prev.userExam.exam.resources, // keep resources unchanged
                    },
                },
            }));

            setCheckedTasks((prev) => ({ ...prev, [taskId]: false }));
        } catch (err) {
            console.error(err);
            if (soundEnabled) {
                playError();
            }
            toast.error("Something went wrong.");
        } finally {
            setUpdatingTasks((prev) => ({ ...prev, [taskId]: false }));
        }
    };

    // Update Milestone (kept same as before)
    const updateMilestone = async (milestoneId: number) => {
        try {
            setLoadingMilestone((prev) => ({ ...prev, [milestoneId]: true }));

            const res = await completeMilestone(milestoneId, localRoadmap.userExam.id, localRoadmap.userExam.user_id);

            if (!res.success) throw new Error("Failed updating milestone");

            if (soundEnabled) {
                playNotification();
            }
            toast.success("Milestone updated!", { duration: 1500 });

            // Instant UI update
            setLocalRoadmap((prev) => ({
                ...prev,
                milestones: prev.milestones.map((m) =>
                    m.id === milestoneId ? { ...m, achieved: true } : m
                ),
            }));

            setCheckedMilestones((prev) => ({ ...prev, [milestoneId]: false }));
        } catch (err) {
            console.error(err);
            if (soundEnabled) {
                playError();
            }
            toast.error("Something went wrong.");
        } finally {
            setLoadingMilestone((prev) => ({ ...prev, [milestoneId]: false }));
        }
    };

    // Helper: format optional snake_case date fields safely
    function formatDate(date: string | Date) {
        const d = new Date(date);

        return d.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            timeZone: "UTC", // or your chosen timezone
        });
    }

    const filteredPhases = localRoadmap.phases
        .map((phase) => {
            const phaseMatch =
                phase.phase_name.toLowerCase().includes(search.toLowerCase()) ||
                (phase.description ?? "")
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const weeks = phase.weeks
                .map((week) => {
                    const weekMatch =
                        week.focus.toLowerCase().includes(search.toLowerCase());

                    const tasks = week.tasks.filter((task) => {
                        return (
                            task.title.toLowerCase().includes(search.toLowerCase()) ||
                            (task.description ?? "")
                                .toLowerCase()
                                .includes(search.toLowerCase())
                        );
                    });

                    if (weekMatch) {
                        return week;
                    }

                    if (tasks.length > 0) {
                        return {
                            ...week,
                            tasks,
                        };
                    }

                    return null;
                })
                .filter(Boolean);

            if (phaseMatch) {
                return phase;
            }

            if (weeks.length > 0) {
                return {
                    ...phase,
                    weeks,
                };
            }

            return null;
        })
        .filter(Boolean);

    useEffect(() => {
        if (!search.trim()) {
            setExpandedPhases([]);
            setExpandedWeeks({});
            return;
        }

        const phaseIds = filteredPhases.map((p) => p?.id);

        const weekIds: Record<number, (number | undefined)[]> = {};

        filteredPhases.forEach((phase) => {
            if (phase?.id) {
                weekIds[phase.id] = phase.weeks.map((w) => w?.id);
            }
        });

        setExpandedPhases(phaseIds);
        setExpandedWeeks(weekIds);
    }, [search]);

    const isPhaseComplete = (
        phase: { weeks: ((typeof localRoadmap.phases)[number]["weeks"][number] | null)[] }
    ) => {
        const weeks = phase.weeks.filter(
            (week): week is NonNullable<typeof week> => week !== null
        );

        const totalTasks = weeks.reduce((acc, week) => acc + week.tasks.length, 0);
        const completedTasks = weeks.reduce(
            (acc, week) => acc + week.tasks.filter((t) => t.is_completed).length,
            0
        );

        return totalTasks > 0 && completedTasks === totalTasks;
    };

    const isPhaseLate = (phase: { end_date?: Date | null | undefined | string }) => {
        if (!phase.end_date) return false;
        const today = new Date();
        const endDate = new Date(phase.end_date);
        return endDate < today;
    };

    const isWeekComplete = (week: { tasks: { is_completed: boolean }[] }) => {
        const totalTasks = week.tasks.length;
        const completedTasks = week.tasks.filter((t) => t.is_completed).length;
        return totalTasks > 0 && completedTasks === totalTasks;
    };

    const isWeekLate = (week: { end_date?: Date | null | undefined | string }) => {
        if (!week.end_date) return false;
        const today = new Date();
        const endDate = new Date(week.end_date);
        return endDate < today;
    };

    const isMilestoneLate = (milestone: { target_date?: Date | null | undefined | string }) => {
        if (!milestone.target_date) return false;
        const today = new Date();
        const targetDate = new Date(milestone.target_date);
        return targetDate < today;
    };

    const displayedPhases = search.trim()
        ? filteredPhases
        : localRoadmap.phases;

    return (
        <div className=" px-6 mt-28 md:mt-36 pb-12 space-y-10 max-w-6xl mx-auto relative">

            <div className="fixed bottom-0 right-6 z-50">
                <a
                    href="#"
                    className="flex items-center gap-2 rounded-full bg-black shadow-gray-400 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:bg-blue-700"
                >
                    <ChevronUp className="h-4 w-4" />
                </a>
            </div>

            <div className="absolute top-0 right-0 w-80 md:block hidden">
                <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search phase, week or task..."
                    className="w-full rounded-md border border-gray-400 focus:border-none pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition"
                />
            </div>

            {/* Header */}
            <div className="space-y-4">

                <h1 className="text-xl md:text-3xl md:w-2/3 font-bold mb-8">
                    {localRoadmap.title}
                </h1>

                <p className="mt-2 text-sm md:text-lg text-muted-foreground">
                    {localRoadmap.description}
                </p>

                <div className="flex flex-wrap gap-3">
                    <Badge className="bg-gray-600 text-white">
                        {localRoadmap.phases.length} Phases
                    </Badge>

                    <Badge className="bg-green-800 text-white">
                        {localRoadmap.phases.reduce((acc, p) => acc + p.weeks.length, 0)} Weeks
                    </Badge>

                    <Badge className="bg-rose-800 text-white">
                        {localRoadmap.phases.reduce((acc, p) => acc + p.weeks.length / 4.345, 0).toFixed(1)} Months
                    </Badge>

                    <Badge className="bg-indigo-800 text-white">
                        {localRoadmap.milestones.length} Milestones
                    </Badge>
                </div>

                <p className="font-semibold text-black text-sm md:text-lg mt-8">
                    Duration : {" "}
                    <span className="font-medium">
                        {localRoadmap.start_date &&
                            formatDate(new Date(localRoadmap.start_date).toDateString())}

                        {localRoadmap.start_date || localRoadmap.end_date ? "   →  " : " "}

                        {localRoadmap.end_date &&
                            formatDate(new Date(localRoadmap.end_date).toDateString())}
                    </span>
                </p>

                <div className="md:flex items-center justify-between hidden">

                    <div className="flex gap-x-4 mt-4">
                        <Button
                            variant={isExpandedAll ? "default" : "outline"}
                            className="cursor-pointer hover:bg-gray-700 hover:border-gray-800 transition-colors hover:text-white"
                            onClick={expandAll}
                        >
                            Expand All
                        </Button>

                        <Button
                            variant={isExpandedAll ? "outline" : "default"}
                            className="cursor-pointer hover:bg-gray-700 hover:border-gray-800 transition-colors hover:text-white"
                            onClick={collapseAll}
                        >
                            Collapse All
                        </Button>
                    </div>

                </div>
            </div>



            <p className="text-sm text-gray-500 md:block hidden">
                Check off tasks as you complete them to track your progress. Click on phases and weeks to see more details, and watch your roadmap evolve as you move forward!
            </p>

            <p className="text-sm bg-yellow-300 p-3 rounded-lg md:hidden block">
                ❗️ Sorry, the mobile view is limited. For the full interactive experience, please access the app on a desktop device where you can also update your progress.
            </p>

            {/* 📱 MOBILE VIEW */}
            <div className="block md:hidden space-y-6">

                {/* 🔹 FIRST PHASE ONLY */}
                {localRoadmap.phases.slice(0, 1).map((phase) => (
                    <Card key={phase.id} className="border shadow-sm bg-linear-to-r from-indigo-100 to-white">
                        <CardHeader>
                            <CardTitle>
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-lg font-semibold">{phase.phase_name}</span>

                                    {(phase.start_date || phase.end_date) && (
                                        <span className="text-gray-500 flex items-center gap-2 text-sm">
                                            <CalendarDays size={14} />
                                            {phase.start_date && formatDate(phase.start_date.toDateString())}
                                            {" → "}
                                            {phase.end_date && formatDate(phase.end_date.toDateString())}
                                        </span>
                                    )}
                                </div>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">

                            {/* 🔹 FIRST WEEK ONLY */}
                            {phase.weeks.slice(0, 2).map((week) => {
                                const completedTasks = week.tasks.filter((t) => t.is_completed).length;
                                const totalTasks = week.tasks.length;

                                return (
                                    <div key={week.id} className="border rounded-lg p-4 bg-white shadow-sm">
                                        <h3 className="font-semibold">
                                            Week {week.week_number}: {week.focus}
                                        </h3>

                                        <p className="text-sm text-gray-500 mt-1">
                                            {week.start_date && formatDate(week.start_date.toDateString())}
                                            {" → "}
                                            {week.end_date && formatDate(week.end_date.toDateString())}
                                        </p>

                                        {/* 🔹 TASK PREVIEW (optional: first 2 tasks) */}
                                        <ul className="mt-3 space-y-2">
                                            {week.tasks.slice(0, 2).map((task) => (
                                                <li key={task.id} className="text-sm text-gray-700">
                                                    • {task.title}
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="mt-3">
                                            <p className="text-sm mb-2">
                                                Progress: {week.progress}% ({completedTasks}/{totalTasks})
                                            </p>
                                            <Progress value={week.progress} />
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                ))}

                {/* 🔹 MILESTONES (ONLY 2) */}
                {localRoadmap.milestones?.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Milestones</h2>

                        <div className="space-y-6">
                            {localRoadmap.milestones.slice(0, 2).map((m) => (
                                <Card key={m.id} className="border shadow-sm p-4">
                                    <CardContent className="gap-y-4 flex flex-col">
                                        <p className="font-medium">{m.name}</p>
                                        <p className="text-sm text-gray-600">{m.goal}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}


            </div>

            {/* Desktop view */}
            <div className="hidden space-y-8 md:block">
                {/* Phases */}
                <div className="space-y-8">
                    {displayedPhases.length === 0 ? (
                        <Card className="border-dashed border-2 py-16">
                            <CardContent className="flex flex-col items-center justify-center text-center space-y-3">
                                <Search className="h-12 w-12 text-gray-400" />

                                <h3 className="text-xl font-semibold">
                                    No results found
                                </h3>

                                <p className="text-gray-500 max-w-md">
                                    We couldn't find any phase, week, or task matching{" "}
                                    <span className="font-medium">"{search}"</span>.
                                </p>

                                <Button
                                    variant="outline"
                                    onClick={() => setSearch("")}
                                >
                                    Clear Search
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (

                        displayedPhases.map((phase, i) => {
                            const isPhaseOpen = expandedPhases.includes(phase?.id ? phase.id : -1);

                            return (
                                <Card key={phase?.id} className={`border border-gray-300 shadow-sm ${isPhaseOpen ? "bg-white shadow-xl" : "bg-linear-to-r from-indigo-100 to-white"}`}>
                                    <CardHeader
                                        onClick={() => togglePhase(phase?.id)}
                                        className="cursor-pointer"
                                    >
                                        <CardTitle className="flex justify-between items-center gap-4">
                                            <div className="flex flex-col gap-3 w-full">
                                                <div className="flex items-center w-full justify-between pr-8 gap-4">
                                                    <span className="text-lg font-semibold">{phase?.phase_name}</span>
                                                </div>
                                                {/* optional calendar icon with dates */}
                                                {(phase?.start_date || phase?.end_date) && (
                                                    <span className=" text-gray-500 text-sm flex items-center gap-2">
                                                        <CalendarDays size={14} />
                                                        {phase.start_date && formatDate(phase.start_date.toDateString())}{" "}
                                                        {phase.start_date || phase.end_date ? "→" : ""}{" "}
                                                        {phase.end_date && formatDate(phase.end_date.toDateString())}
                                                    </span>
                                                )}
                                            </div>

                                            <div className=" w-full text-right text-sm">
                                                {phase?.weeks && isPhaseComplete(phase) ? (
                                                    <Badge className="bg-green-800 text-white w-fit mr-4">Completed</Badge>
                                                ) : phase?.end_date && isPhaseLate(phase) ? (
                                                    <Badge className="bg-red-800 text-white w-fit mr-4">Late</Badge>
                                                ) : null}
                                                <span className="text-gray-700">{phase?.weeks.length ? phase.weeks.length * 7 : 0} Days</span>
                                            </div>
                                            {isPhaseOpen ? <ChevronUp size={40} /> : <ChevronDown size={40} />}
                                        </CardTitle>
                                    </CardHeader>

                                    {isPhaseOpen && (
                                        <CardContent className="space-y-6">
                                            {phase?.description && (
                                                <p className=" text-gray-600">{phase.description}</p>
                                            )}

                                            {phase?.weeks.map((week) => {
                                                const isWeekOpen =
                                                    (week?.id !== undefined && expandedWeeks[phase.id]?.includes(week.id)) || false;

                                                const completedTasks = week?.tasks.filter((t) => t.is_completed).length;
                                                const totalTasks = week?.tasks.length;

                                                return (
                                                    <div
                                                        key={week?.id}
                                                        className={`border rounded-lg space-y-4 p-5 ${isWeekOpen ? "shadow-xl " : "shadow-sm bg-linear-to-r from-indigo-100 to-white"
                                                            }`}
                                                    >
                                                        <div
                                                            className="flex items-center cursor-pointer"
                                                            onClick={() => toggleWeek(phase.id, week?.id)}
                                                        >
                                                            <div className=" flex flex-col justify-center gap-2">
                                                                <h3 className="md:text-lg font-semibold">
                                                                    Week {week?.week_number}: {week?.focus}
                                                                </h3>

                                                                {/* week? dates */}
                                                                {(week?.start_date || week?.end_date) && (
                                                                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                                                        <CalendarDays size={14} />
                                                                        {week?.start_date && formatDate(week?.start_date.toDateString())}{" "}
                                                                        {week?.start_date || week?.end_date ? "→" : ""}{" "}
                                                                        {week?.end_date && formatDate(week?.end_date.toDateString())}
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div className="flex items-center gap-4 ml-auto">
                                                                {week && isWeekComplete(week) ? (
                                                                    <Badge className="bg-green-800 h-fit text-white w-fit">
                                                                        Completed
                                                                    </Badge>
                                                                ) : week?.end_date && isWeekLate(week) ? (
                                                                    <Badge className="bg-red-800 h-fit text-white w-fit">
                                                                        Late
                                                                    </Badge>
                                                                ) : null}

                                                                {isWeekOpen ? <ChevronUp /> : <ChevronDown />}
                                                            </div>
                                                        </div>

                                                        {isWeekOpen && (
                                                            <>
                                                                <ul className="space-y-4 mt-4">
                                                                    {week?.tasks.map((task) => (
                                                                        <li
                                                                            key={task.id}
                                                                            className="border-l-4 border-blue-500 shadow-md px-6 py-4 bg-linear-to-r from-indigo-100 to-white rounded-md flex justify-between items-center"
                                                                        >
                                                                            <div className="flex-1 gap-2 flex flex-col max-w-3xl">
                                                                                <p className="font-medium">{task.title}</p>
                                                                                {task.description && (
                                                                                    <p className="text-sm text-gray-600">
                                                                                        {task.description}
                                                                                    </p>
                                                                                )}

                                                                            </div>

                                                                            <div className="flex items-center gap-3 flex-wrap justify-end">
                                                                                {task.is_completed ? (
                                                                                    <div className="flex items-center text-green-700">
                                                                                        Completed
                                                                                        <CheckCircle2 className="ml-2" size={18} />
                                                                                    </div>
                                                                                ) : (
                                                                                    <>
                                                                                        {/* Mark Done button (left on desktop, below on mobile) */}
                                                                                        {checkedTasks[task.id] && (
                                                                                            <Button
                                                                                                size="sm"
                                                                                                className="order-2 cursor-pointer md:order-1 mt-3 md:mt-0 hover:bg-green-700 hover:border-green-700 hover:text-white transition-colors"
                                                                                                disabled={!!updatingTasks[task.id]}
                                                                                                onClick={() => updateSingleTask(task.id)}
                                                                                            >
                                                                                                {updatingTasks[task.id] ? (
                                                                                                    <Loader2 size={16} className="animate-spin mr-1" />
                                                                                                ) : null}
                                                                                                Mark Done
                                                                                            </Button>
                                                                                        )}

                                                                                        {/* Checkbox always stays in its original place */}
                                                                                        <div className="order-1 md:order-2">
                                                                                            <Checkbox
                                                                                                checked={!!checkedTasks[task.id]}
                                                                                                className="cursor-pointer border-2 border-green-700 rounded-full hover:ring-2 hover:ring-offset-2 hover:ring-green-500 transition-colors"
                                                                                                onCheckedChange={() => handleCheckboxChange(task.id)}
                                                                                            />
                                                                                        </div>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        </li>
                                                                    ))}
                                                                </ul>

                                                                <div className="pt-3">
                                                                    <p className="text-sm text-gray-700">
                                                                        Progress: {week?.progress}% ({completedTasks}/{totalTasks})
                                                                    </p>
                                                                    <Progress value={week?.progress} />
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </CardContent>
                                    )}
                                </Card>
                            );
                        })
                    )}
                </div>

                <Separator />

                {/* Milestones */}
                {localRoadmap.milestones?.length > 0 && (
                    <div className="space-y-4 mb-6">
                        <h2 className="text-2xl font-semibold">Milestones</h2>
                        <p className="text-sm text-gray-600">
                            Track your key milestones here. Check the box when you achieve them and click "Update Milestone" to see your progress reflected in the roadmap!
                        </p>
                        <div className="grid gap-6 md:grid-cols-3">
                            {localRoadmap.milestones.map((m) => (
                                <Card key={m.id} className={`relative border-[1.5px] shadow-sm hover:shadow-md transition hover:border-green-700` + (m.achieved ? " bg-green-50 border-green-600" : " bg-white")}>
                                    <CardHeader className="flex flex-row justify-between items-center">
                                        <CardTitle className="text-base font-semibold">
                                            {m.name}
                                        </CardTitle>

                                        {m.achieved ? (
                                            <CheckCircle2 className="text-green-700" size={24} />
                                        ) : (
                                            <Checkbox
                                                className="border-2 h-5 w-5 border-green-700 hover:ring-2 hover:ring-offset-2 hover:ring-green-500"
                                                checked={!!checkedMilestones[m.id]}
                                                onCheckedChange={() => handleMilestoneChange(m.id)}
                                            />
                                        )}
                                    </CardHeader>

                                    {!m.achieved && isMilestoneLate(m) && (
                                        <div className="absolute bottom-4 right-4">
                                            <Badge className="bg-red-800 text-white w-fit">Late</Badge>
                                        </div>
                                    )}

                                    <CardContent>
                                        <p className=" text-gray-600">{m.goal}</p>
                                        <p className="text-sm mt-4 text-black font-medium">
                                            🎯 Target: {m.target_date
                                                ? formatDate(new Date(m.target_date).toDateString())
                                                : "Not specified"}
                                        </p>

                                        {!m.achieved && checkedMilestones[m.id] && (
                                            <div className="pt-4">
                                                <Button
                                                    className="w-full md:w-auto transition-colors hover:bg-green-700 hover:border-green-700 cursor-pointer hover:text-white"
                                                    onClick={() => updateMilestone(m.id)}
                                                    disabled={loadingMilestone[m.id]}
                                                >
                                                    {loadingMilestone[m.id] ? (
                                                        <Loader2 className="animate-spin mr-2" size={18} />
                                                    ) : null}
                                                    {loadingMilestone[m.id] ? "Updating..." : "Update Milestone"}
                                                </Button>
                                            </div>
                                        )}

                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                <Separator />

                {localRoadmap.userExam.exam.resources.length > 0 && (
                    <div className="space-y-6 mt-8">

                        {/* Header */}
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800">
                                Recommended Resources
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Handpicked materials to sharpen your preparation. Dive in.
                            </p>
                        </div>

                        {/* Cards */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            {localRoadmap.userExam.exam.resources.map((res) => (
                                <a
                                    key={res.id}
                                    href={res.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block p-4 rounded-xl border  border-gray-200 bg-transparent hover:bg-green-100 shadow-sm hover:shadow-md hover:border-green-700  transition-all duration-200"
                                >
                                    <div className="flex items-start justify-between gap-3">

                                        {/* Title */}
                                        <div>
                                            <h3 className="font-medium text-gray-800">
                                                {res.title}
                                            </h3>

                                            {/* Type badge */}
                                            <span className="inline-block group-hover:bg-green-800 group-hover:text-white mt-2 text-xs px-2 py-1 rounded-full bg-green-50 text-green-700">
                                                {res.type}
                                            </span>
                                        </div>

                                        {/* External icon */}
                                        <div className="text-gray-400 group-hover:text-green-700 transition">
                                            ↗
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
