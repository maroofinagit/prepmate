export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface Exam {
    id: number;
    name: string;
    description?: string | null;
    imageUrl: string;
    default_duration_weeks?: number | null;
    created_at: Date;
    resources: Resource[];
    subjects: Subject[];
    userExams: UserExam[];
}

export interface Subject {
    id: number;
    exam_id: number;
    name: string;
    created_at: Date;
    exam: Exam;
    topics: Topic[];
}

export interface Topic {
    id: number;
    name: string;
    description?: string | null;
    difficulty: Difficulty;
    created_at: Date;

    subject_id: number;
    subject: Subject;
}

export interface Resource {
    id: number;
    exam_id: number;
    title: string;
    url: string;
    created_at: Date;
}

export interface UserExam {
    id: number;
    exam_id: number;
    user_id: string;
    start_date?: Date | null;
    end_date?: Date | null;
    current_stage?: string | null;
    progress_percent?: number | null;
    created_at: Date;
}


