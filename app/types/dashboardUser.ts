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
    current_stage: string | null;
    progress_percent: number | null;
    exam: DashboardExam;
    roadmap: DashboardRoadmap | null;
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
