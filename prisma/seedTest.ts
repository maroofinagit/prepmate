import { db } from "@/app/lib/db";

async function main() {
    const userExamId = 25;

    // 🔍 Find existing test
    const tests = await db.test.findMany({
        where: {
            userExamId: userExamId,
        },
    });

    if (tests.length === 0) {
        console.log("❌ No tests found for the given userExamId");
        return;
    }

    for (const test of tests) {
        if (test.type === "WEEKLY") {
            await db.test.update({
                where: { id: test.id },
                data: {
                    duration: 15,
                    totalMarks: 10,
                },
            });
        } else if (test.type === "PHASE") {
            await db.test.update({
                where: { id: test.id },
                data: {
                    duration: 30,
                    totalMarks: 20,
                },
            });
        } else if (test.type === "FINAL") {
            await db.test.update({
                where: { id: test.id },
                data: {
                    duration: 70,
                    totalMarks: 50,
                },
            });
        }
    }

    console.log(`✅ Tests of userExamId ${userExamId} updated successfully.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });