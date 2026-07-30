import { z } from "zod";

const dateSchema = z.string().regex(
    /^\d{4}-\d{2}-\d{2}$/,
    "Date must be in YYYY-MM-DD format"
);

const TaskSchema = z.object({
    title: z.string(),
    description: z.string(),
    start_date: dateSchema,
    end_date: dateSchema,
});

const WeekSchema = z.object({
    week_number: z.number().int().positive(),
    focus: z.string(),
    start_date: dateSchema,
    end_date: dateSchema,
    tasks: z.array(TaskSchema),
});

const PhaseSchema = z.object({
    phase_name: z.string(),
    description: z.string(),
    duration: z.string(),
    start_date: dateSchema,
    end_date: dateSchema,
    weeks: z.array(WeekSchema),
});

const MilestoneSchema = z.object({
    name: z.string(),
    goal: z.string(),
    target_date: dateSchema,
});

export const RoadmapSchema = z.object({
    title: z.string(),
    description: z.string(),
    start_date: dateSchema,
    end_date: dateSchema,

    phases: z.array(PhaseSchema),

    milestones: z.array(MilestoneSchema),
});