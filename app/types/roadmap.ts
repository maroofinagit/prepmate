// -------------------------
// 🧭 Main Roadmap Structure
// -------------------------
export interface Roadmap {
    id: number;
    user_exam_id: number;
    title: string;
    description?: string | null;
    generated_by_ai: boolean;
    created_at: Date;
    start_date?: Date | null;
    end_date?: Date | null;
    progress: number;
    summary?: string | null;
    updated_at: Date;
    version: number;

    // Relations
    phases: RoadmapPhase[];
    milestones: Milestone[];
}

export interface RoadmapPhase {
    id: number;
    roadmap_id: number;
    phase_name: string;
    start_date?: Date | null;
    end_date?: Date | null;
    description?: string | null;
    duration?: string | null;
    order_index: number;
    progress: number;
    weeks: RoadmapWeek[];
}

export interface RoadmapWeek {
    id: number;
    phase_id: number;
    week_number: number;
    start_date?: Date | null;
    end_date?: Date | null;
    focus: string;
    order_index: number;
    progress: number;
    tasks: RoadmapTask[];
}

export interface RoadmapTask {
    id: number;
    title: string;
    description?: string | null;
    start_date?: Date | null;
    end_date?: Date | null;
    is_completed: boolean;
    order_index?: number | null;
    created_at: Date;
    updated_at: Date;
    week_id: number;
}

// -------------------------
// 🎯 Milestones
// -------------------------
export interface Milestone {
    id: number;
    roadmap_id: number;
    name: string;
    goal: string;
    achieved: boolean;
    target_date?: Date | null;
    created_at: Date}
