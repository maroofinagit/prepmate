"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, ChevronDown, ChevronUp, CheckCircle2, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";
import { Roadmap } from "@/app/types/roadmap";

export default function RoadmapClient({ roadmap }: { roadmap: Roadmap }) {
    const [localRoadmap, setLocalRoadmap] = useState(roadmap);

    const [expandedPhases, setExpandedPhases] = useState<number[]>([]);
    const [expandedWeeks, setExpandedWeeks] = useState<Record<number, number[]>>({});
    const [isExpandedAll, setIsExpandedAll] = useState(false);

    // task -> checked
    const [checkedTasks, setCheckedTasks] = useState<Record<number, boolean>>({});

    // milestone related states (kept as-is)
    const [checkedMilestones, setCheckedMilestones] = useState<Record<number, boolean>>({});
    const [loadingMilestone, setLoadingMilestone] = useState<Record<number, boolean>>({});

    // per-task updating state (so multiple can update independently)
    const [updatingTasks, setUpdatingTasks] = useState<Record<number, boolean>>({});

    // Toggle Phase
    const togglePhase = (phaseId: number) => {
        setExpandedPhases((prev) =>
            prev.includes(phaseId) ? prev.filter((id) => id !== phaseId) : [...prev, phaseId]
        );
    };

    // Toggle Week
    const toggleWeek = (phaseId: number, weekId: number) => {
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

            const res = await fetch("/api/updateTask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ taskId }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update task");

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
            }));

            setCheckedTasks((prev) => ({ ...prev, [taskId]: false }));
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong.");
        } finally {
            setUpdatingTasks((prev) => ({ ...prev, [taskId]: false }));
        }
    };

    // Update Milestone (kept same as before)
    const updateMilestone = async (milestoneId: number) => {
        try {
            setLoadingMilestone((prev) => ({ ...prev, [milestoneId]: true }));
            
            const res = await fetch("/api/updateMilestone", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ milestoneId }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed updating milestone");

            toast.success(data.message || "Milestone updated!", { autoClose: 1500 });

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
            toast.error("Something went wrong.");
        } finally {
            setLoadingMilestone((prev) => ({ ...prev, [milestoneId]: false }));
        }
    };

    // Helper: format optional snake_case date fields safely
    const formatDate = (d?: string | null) => {
        if (!d) return null;
        try {
            return new Date(d).toLocaleDateString();
        } catch {
            return null;
        }
    };

    return (
        <div className="p-6 mt-16 md:mt-20 space-y-10">
            {/* Header */}
            <div className="space-y-3">
                <h1 className="text-xl md:text-3xl font-bold mb-8">{localRoadmap.title}</h1>
                <p className="text-gray-600 text-sm md:text-base max-w-3xl">{localRoadmap.description}</p>
                <p className="font-medium text-sm md:text-base">{localRoadmap.summary} It comprises {localRoadmap.phases.length} phases, {localRoadmap.phases.reduce((acc, phase) => acc + phase.weeks.length, 0)} weeks, and {localRoadmap.milestones.length} milestones.</p>

                <p className="text-sm text-gray-500 mt-1">
                    Duration:{" "}
                    <span className="font-medium">
                        {localRoadmap.start_date && formatDate(localRoadmap.start_date.toDateString())}{" "}
                        {localRoadmap.start_date || localRoadmap.end_date ? "→" : ""}{" "}
                        {localRoadmap.end_date && formatDate(localRoadmap.end_date.toDateString())}
                    </span>
                </p>

                <div className="md:flex gap-3 pt-3 hidden">
                    <Button variant={isExpandedAll ? "default" : "outline"} onClick={expandAll}>
                        Expand All
                    </Button>
                    <Button variant={isExpandedAll ? "outline" : "default"} onClick={collapseAll}>
                        Collapse All
                    </Button>
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
                    {localRoadmap.phases.map((phase, i) => {
                        const isPhaseOpen = expandedPhases.includes(phase.id);

                        return (
                            <Card key={phase.id} className={`border border-gray-300 shadow-sm ${isPhaseOpen ? "bg-white shadow-xl" : "bg-linear-to-r from-indigo-100 to-white"}`}>
                                <CardHeader
                                    onClick={() => togglePhase(phase.id)}
                                    className="cursor-pointer"
                                >
                                    <CardTitle className="flex justify-between">
                                        <div>
                                            <div className="flex flex-col items-center gap-3">
                                                <span className="text-lg font-semibold">{phase.phase_name}</span>
                                                {/* optional calendar icon with dates */}
                                                {(phase.start_date || phase.end_date) && (
                                                    <span className=" text-gray-500 flex items-center gap-2">
                                                        <CalendarDays size={14} />
                                                        {phase.start_date && formatDate(phase.start_date.toDateString())}{" "}
                                                        {phase.start_date || phase.end_date ? "→" : ""}{" "}
                                                        {phase.end_date && formatDate(phase.end_date.toDateString())}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {isPhaseOpen ? <ChevronUp /> : <ChevronDown />}
                                    </CardTitle>
                                </CardHeader>

                                {isPhaseOpen && (
                                    <CardContent className="space-y-6">
                                        {phase.description && (
                                            <p className="text-sm text-gray-600">{phase.description}</p>
                                        )}

                                        {phase.weeks.map((week) => {
                                            const isWeekOpen =
                                                expandedWeeks[phase.id]?.includes(week.id) || false;

                                            const completedTasks = week.tasks.filter((t) => t.is_completed).length;
                                            const totalTasks = week.tasks.length;

                                            return (
                                                <div
                                                    key={week.id}
                                                    className={`border rounded-lg space-y-4 p-5 ${isWeekOpen ? "shadow-xl " : "shadow-sm bg-linear-to-r from-indigo-100 to-white"
                                                        }`}
                                                >
                                                    <div
                                                        className="flex justify-between cursor-pointer"
                                                        onClick={() => toggleWeek(phase.id, week.id)}
                                                    >
                                                        <div className=" flex flex-col justify-center gap-2">
                                                            <h3 className="md:text-lg font-semibold">
                                                                Week {week.week_number}: {week.focus}
                                                            </h3>

                                                            {/* week dates */}
                                                            {(week.start_date || week.end_date) && (
                                                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                                                    <CalendarDays size={14} />
                                                                    {week.start_date && formatDate(week.start_date.toDateString())}{" "}
                                                                    {week.start_date || week.end_date ? "→" : ""}{" "}
                                                                    {week.end_date && formatDate(week.end_date.toDateString())}
                                                                </p>
                                                            )}
                                                        </div>

                                                        {isWeekOpen ? <ChevronUp /> : <ChevronDown />}
                                                    </div>

                                                    {isWeekOpen && (
                                                        <>
                                                            <ul className="space-y-4 mt-4">
                                                                {week.tasks.map((task) => (
                                                                    <li
                                                                        key={task.id}
                                                                        className="border-l-4 border-blue-500 shadow-md px-6 py-4 bg-linear-to-r from-indigo-100 to-white rounded-md flex justify-between items-center"
                                                                    >
                                                                        <div className="flex-1 gap-2 flex flex-col">
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
                                                                                    <CheckCircle2 className="mr-1" size={18} />
                                                                                    Completed
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
                                                                    Progress: {week.progress}% ({completedTasks}/{totalTasks})
                                                                </p>
                                                                <Progress value={week.progress} />
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
                    })}
                </div>

                <Separator />

                {/* Milestones */}
                {localRoadmap.milestones?.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold">Milestones</h2>
                        <p className="text-sm text-gray-600">
                            Track your key milestones here. Check the box when you achieve them and click "Update Milestone" to see your progress reflected in the roadmap!
                        </p>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {localRoadmap.milestones.map((m) => (
                                <Card key={m.id} className="border shadow-sm">
                                    <CardHeader className="flex flex-row justify-between items-center">
                                        <CardTitle className="text-base font-semibold">
                                            {m.name}
                                        </CardTitle>

                                        {m.achieved ? (
                                            <CheckCircle2 className="text-green-700" size={20} />
                                        ) : (
                                            <Checkbox
                                                className="border-2 border-green-700 hover:ring-2 hover:ring-offset-2 hover:ring-green-500"
                                                checked={!!checkedMilestones[m.id]}
                                                onCheckedChange={() => handleMilestoneChange(m.id)}
                                            />
                                        )}
                                    </CardHeader>

                                    <CardContent>
                                        <p className=" text-gray-600">{m.goal}</p>
                                        <p className="text-sm mt-4 text-black">
                                            🎯 Target: {m.target_date
                                                ? formatDate(m.target_date.toDateString())
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
            </div>
        </div>
    );
}
