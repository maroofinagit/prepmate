import { Prisma } from "@/generated/prisma/client";
import { RoadmapStatus, TestType } from "@/generated/prisma/enums";

export interface DashboardUser {
    id: string;
    name: string | null;
    image: string | null;
    exams: DashboardUserExam[] | null;
}

export interface DashboardUserExam {
    id: number;
    exam_id: number;
    start_date: Date;   // Dates come as Date in JSON
    end_date: Date;
    progress_percent: number | null;
    performanceScore: number | null;
    highestScore: number | null;
    lowestScore: number | null;
    lastTestScore: number | null;

    exam: DashboardExam;
    roadmap: DashboardRoadmap | null;
    roadmap_status: RoadmapStatus
    tests: DashboardTest[] | null;
}

export interface DashboardExam {
    id: number;
    name: string;
}

export interface DashboardRoadmap {
    id: number;
    title: string;
    progress: number;
    milestones: DashboardMilestone[];
    phases: DashboardPhase[];
}

export interface DashboardMilestone {
    id: number;
    name: string;
    goal: string;
    achieved: boolean;
    target_date: Date | null;
    created_at: Date;
}

export interface DashboardPhase {
    id: number;
    phase_name: string;
    duration: string | null;
    order_index: number;
    progress: number;
    weeks: DashboardWeek[];
}

export interface DashboardWeek {
    id: number;
    week_number: number;
    order_index: number;
    progress: number;
    tasks: DashboardTask[];
}

export interface DashboardTask {
    id: number;
    title: string;
    is_completed: boolean;
    start_date: Date | null;
    end_date: Date | null;
    order_index: number | null;
    created_at: Date;
    updated_at: Date;
}

export interface DashboardTest {
    id: number;

    title: string;
    type: TestType;

    totalMarks: number;
    duration: number | null;

    createdAt: Date;
    isGenerated: boolean;

    weekId: number | null;
    phaseId: number | null;

    questions: DashboardQuestion[];

    attempt: DashboardTestAttempt | null;
}

export interface DashboardQuestion {
    id: number;
}

export interface DashboardTestAttempt {
    id: number;

    score: number;
    totalMarks: number;
    percentage: number;

    isPassed: boolean;

    timeTaken: number;

    completedAt: Date;

    responses: Prisma.JsonValue;
}

// export enum RoadmapStatus {
//     pending = "pending",
//     in_progress = "in_progress",
//     completed = "completed",
//     failed = "failed"
// }
