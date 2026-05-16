import { db } from "@/app/lib/db";


async function main() {
    console.log("🌱 Prisma seeding started...");

    // 👉 CHANGE THIS or use env
    const userExamId = Number(15);

    // 🔍 Get roadmap for THIS exam
    const roadmap = await db.roadmap.findUnique({
        where: { user_exam_id: userExamId },
        include: {
            phases: {
                include: {
                    weeks: true,
                },
            },
        },
    });

    if (!roadmap) {
        throw new Error("❌ Roadmap not found for this userExam");
    }

    // ⚠️ Optional: skip if already seeded
    const existing = await db.test.findFirst({
        where: { userExamId },
    });

    if (existing) {
        console.log("⚠️ Tests already exist. Skipping...");
        return;
    }

    const testsToCreate: any[] = [];

    // ✅ Weekly
    for (const phase of roadmap.phases) {
        for (const week of phase.weeks) {
            testsToCreate.push({
                title: `Week ${week.week_number} Test`,
                description: week.focus || `Test for week ${week.week_number} content`,
                type: "WEEKLY",
                userExamId,
                weekId: week.id,
                totalMarks: 10,
                isGenerated: false,
            });
        }
    }

    // ✅ Phase
    for (const phase of roadmap.phases) {
        testsToCreate.push({
            title: `Phase ${phase.order_index + 1} Test`,
            description: phase.phase_name || `Test for phase ${phase.order_index + 1} content`,
            type: "PHASE",
            userExamId,
            phaseId: phase.id,
            totalMarks: 20,
            isGenerated: false,
        });
    }

    // ✅ Finals (3)
    for (let i = 1; i <= 3; i++) {
        testsToCreate.push({
            title: `Final Test ${i}`,
            description: `Final test of completing all roadmap content. Attempt ${ i }`,
            type: "FINAL",
            userExamId,
            nOfFinalTests: i,
            totalMarks: 50,
            isGenerated: false,
        });
    }

    // 🚀 Insert
    await db.test.createMany({
        data: testsToCreate,
        skipDuplicates: true,
    });

    console.log("✅ Tests seeded successfully");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });