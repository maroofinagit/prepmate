import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
    console.log('🌱 Seeding JEE exam roadmap...');

    // CONFIG
    const userId = 'cl61cLweRaEywTtAvJxpRcSvlgsFUl3g';
    const examId = 1;

    // 1️⃣ Create UserExam
    const userExam = await db.userExam.create({
        data: {
            user_id: userId,
            exam_id: examId,
            start_date: new Date('2025-11-12'),
            end_date: new Date('2026-03-12'),
            current_stage: 'Not Started',
            progress_percent: 0,
        },
    });

    console.log(`✅ UserExam created (id: ${userExam.id})`);

    // 2️⃣ Create Roadmap
    const roadmap = await db.roadmap.create({
        data: {
            user_exam_id: userExam.id,
            title: 'JEE 1-Year Complete Preparation Roadmap',
            description:
                'A structured 12-month roadmap covering Physics, Chemistry, and Mathematics for JEE.',
            start_date: userExam.start_date,
            end_date: userExam.end_date,
            progress: 0,
            summary:
                'Concept Building → Problem Solving → Revision → Full-Length Mocks',

            phases: {
                create: [
                    // =========================
                    // PHASE 1: CONCEPT BUILDING
                    // =========================
                    {
                        phase_name: 'Phase 1: Concept Building',
                        description:
                            'Strong foundation of Physics, Chemistry, and Maths fundamentals.',
                        duration: '5 months',
                        order_index: 1,
                        progress: 0,

                        weeks: {
                            create: [
                                {
                                    week_number: 1,
                                    focus: 'Physics: Kinematics',
                                    order_index: 1,
                                    tasks: {
                                        create: [
                                            {
                                                title: 'Theory – Kinematics',
                                                description:
                                                    'Motion in 1D & 2D, graphs, equations of motion.',
                                            },
                                            {
                                                title: 'Numericals Practice',
                                                description:
                                                    'Solve basic to medium level JEE problems.',
                                            },
                                        ],
                                    },
                                },
                                {
                                    week_number: 2,
                                    focus: 'Maths: Quadratic Equations',
                                    order_index: 2,
                                    tasks: {
                                        create: [
                                            {
                                                title: 'Quadratic Theory',
                                                description:
                                                    'Roots, nature of roots, graphical interpretation.',
                                            },
                                            {
                                                title: 'Problem Solving',
                                                description:
                                                    'JEE Main & Advanced level questions.',
                                            },
                                        ],
                                    },
                                },
                                {
                                    week_number: 3,
                                    focus: 'Chemistry: Mole Concept',
                                    order_index: 3,
                                    tasks: {
                                        create: [
                                            {
                                                title: 'Mole Concept Basics',
                                                description:
                                                    'Stoichiometry, limiting reagent.',
                                            },
                                            {
                                                title: 'Numerical Practice',
                                                description:
                                                    'High-weightage numerical problems.',
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },

                    // =========================
                    // PHASE 2: PROBLEM SOLVING
                    // =========================
                    {
                        phase_name: 'Phase 2: Problem Solving',
                        description:
                            'Strengthen accuracy and speed with mixed problem sets.',
                        duration: '4 months',
                        order_index: 2,
                        progress: 0,

                        weeks: {
                            create: [
                                {
                                    week_number: 20,
                                    focus: 'Physics: Laws of Motion',
                                    order_index: 1,
                                    tasks: {
                                        create: [
                                            {
                                                title: 'Advanced Problems',
                                                description:
                                                    'Free body diagrams, friction, constraints.',
                                            },
                                            {
                                                title: 'Timed Practice',
                                                description:
                                                    'Solve under exam-like conditions.',
                                            },
                                        ],
                                    },
                                },
                                {
                                    week_number: 21,
                                    focus: 'Maths: Calculus',
                                    order_index: 2,
                                    tasks: {
                                        create: [
                                            {
                                                title: 'Limits & Continuity',
                                                description:
                                                    'Conceptual clarity + practice.',
                                            },
                                            {
                                                title: 'Differentiation',
                                                description:
                                                    'Application-based problems.',
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },

                    // =========================
                    // PHASE 3: REVISION & MOCKS
                    // =========================
                    {
                        phase_name: 'Phase 3: Revision & Mocks',
                        description:
                            'Full syllabus revision with mock tests and analysis.',
                        duration: '3 months',
                        order_index: 3,
                        progress: 0,

                        weeks: {
                            create: [
                                {
                                    week_number: 45,
                                    focus: 'Full Syllabus Revision',
                                    order_index: 1,
                                    tasks: {
                                        create: [
                                            {
                                                title: 'Quick Notes Revision',
                                                description:
                                                    'Revise formulas and key concepts.',
                                            },
                                            {
                                                title: 'Mixed Question Sets',
                                                description:
                                                    'All subjects combined practice.',
                                            },
                                        ],
                                    },
                                },
                                {
                                    week_number: 48,
                                    focus: 'Full-Length Mock Tests',
                                    order_index: 2,
                                    tasks: {
                                        create: [
                                            {
                                                title: 'Mock Test',
                                                description:
                                                    'Attempt full JEE mock paper.',
                                            },
                                            {
                                                title: 'Analysis',
                                                description:
                                                    'Identify weak areas and revise.',
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    });

    console.log(`✅ JEE Roadmap created (id: ${roadmap.id})`);
    console.log('🌱 Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
