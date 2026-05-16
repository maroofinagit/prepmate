import { db } from "@/app/lib/db";
import { Difficulty } from "@/generated/prisma/enums";


async function main() {
    const userExamId = 15;
    const weekId = 384;

    // 🔍 Find existing test
    const test = await db.test.findUnique({
        where: {
            userExamId_weekId: {
                userExamId,
                weekId,
            },
        },
        include: {
            questions: true,
        },
    });

    if (!test) {
        console.log("❌ Test not found");
        return;
    }

    // 🛑 Prevent duplicate seeding
    if (test.questions.length > 0) {
        console.log("⚠️ Questions already exist for this test");
        return;
    }

    // ✍️ Prepare questions
    const questionsData = [
        {
            testId: test.id,
            question: "What is the time complexity of binary search?",
            options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
            correctAns: "O(log n)",
            topic: "Searching",
            difficulty: Difficulty.easy,
            marks: 1,
        },
        {
            testId: test.id,
            question: "Which data structure follows FIFO?",
            options: ["Stack", "Queue", "Tree", "Graph"],
            correctAns: "Queue",
            topic: "Data Structures",
            difficulty: Difficulty.easy,
            marks: 1,
        },
        {
            testId: test.id,
            question: "Max element in array requires?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
            correctAns: "O(n)",
            topic: "Arrays",
            difficulty: Difficulty.easy,
            marks: 1,
        },
        {
            testId: test.id,
            question: "Which sorting is fastest on average?",
            options: ["Bubble", "Selection", "QuickSort", "Insertion"],
            correctAns: "QuickSort",
            topic: "Sorting",
            difficulty: Difficulty.medium,
            marks: 1,
        },
        {
            testId: test.id,
            question: "Space complexity of merge sort?",
            options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
            correctAns: "O(n)",
            topic: "Sorting",
            difficulty: Difficulty.medium,
            marks: 1,
        },
    ];

    // 🚀 Insert all questions
    await db.question.createMany({
        data: questionsData,
    });

    console.log("✅ Questions added to existing test:", test.id);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });