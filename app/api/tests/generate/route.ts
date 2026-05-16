import { db } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export async function POST(req: NextRequest) {
    try {

        // =========================
        // GET TEST ID
        // =========================

        const body = await req.json();
        const { testId } = body;

        if (!testId) {
            return NextResponse.json(
                { success: false, message: "Test ID required" },
                { status: 400 }
            );
        }

        // =========================
        // FETCH TEST
        // =========================

        const test = await db.test.findUnique({
            where: {
                id: testId,
            },
            include: {
                userExam: {
                    include: {
                        exam: true,
                    },
                },

                week: {
                    include: {
                        tasks: true,
                        phase: true,
                    },
                },

                phase: {
                    include: {
                        weeks: {
                            include: {
                                tasks: true,
                            },
                        },
                    },
                },

                questions: true,
            },
        });

        if (!test) {
            return NextResponse.json(
                { success: false, message: "Test not found" },
                { status: 404 }
            );
        }

        console.log("Fetched Test:", JSON.stringify(test, null, 2));

        // =========================
        // ALREADY GENERATED CHECK
        // =========================

        if (test.isGenerated || test.questions.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Test already generated",
                },
                { status: 400 }
            );
        }

        // =========================
        // EXTRACT TOPICS
        // =========================

        let topics: string[] = [];

        // WEEKLY TEST
        if (test.type === "WEEKLY" && test.week) {

            topics = [
                test.week.focus,

                ...test.week.tasks.map((task) => task.title),

                ...test.week.tasks
                    .map((task) => task.description || "")
                    .filter(Boolean),
            ];
        }

        // PHASE TEST
        else if (test.type === "PHASE" && test.phase) {

            topics = test.phase.weeks.flatMap((week) => [
                week.focus,

                ...week.tasks.map((task) => task.title),

                ...week.tasks
                    .map((task) => task.description || "")
                    .filter(Boolean),
            ]);
        }

        // FINAL TEST
        else if (test.type === "FINAL") {

            const roadmap = await db.roadmap.findUnique({
                where: {
                    user_exam_id: test.userExamId,
                },

                include: {
                    phases: {
                        include: {
                            weeks: {
                                include: {
                                    tasks: true,
                                },
                            },
                        },
                    },
                },
            });

            if (roadmap) {
                topics = roadmap.phases.flatMap((phase) =>
                    phase.weeks.flatMap((week) => [
                        week.focus,

                        ...week.tasks.map((task) => task.title),

                        ...week.tasks
                            .map((task) => task.description || "")
                            .filter(Boolean),
                    ])
                );
            }
        }

        // REMOVE DUPLICATES
        topics = [...new Set(topics)];

        console.log("Extracted Topics:", topics);

        // =========================
        // GEMINI PROMPT
        // =========================

        const prompt = `
Generate exactly 10 MCQ questions for a ${test.type} level test.

Exam Name:
${test.userExam.exam.name}

Test Title:
${test.title}

Topics:
${topics.join(", ")}

Rules:
- Generate ONLY valid JSON
- No markdown
- No explanation outside JSON
- Each question must have:
  - question
  - options (array of 4 options)
  - correctAns
  - topic
  - difficulty
  - marks

Difficulty values allowed:
easy, medium, hard

Return format:

[
  {
    "question": "Question here",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correctAns": "Option A",
    "topic": "Topic Name",
    "difficulty": "medium",
    "marks": 1
  }
]
`;

        // =========================
        // CALL GEMINI
        // =========================

        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const responseText = result.text ?? "";

        // CLEAN RESPONSE
        const cleanedText = responseText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        let generatedQuestions;

        try {
            generatedQuestions = JSON.parse(cleanedText);
        } catch (err) {
            console.error("JSON Parse Error:", err);

            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid AI response format",
                },
                { status: 500 }
            );
        }

        // =========================
        // SAVE QUESTIONS
        // =========================

        await db.question.createMany({
            data: generatedQuestions.map((q: any) => ({
                testId: test.id,
                question: q.question,
                options: q.options,
                correctAns: q.correctAns,
                topic: q.topic,
                difficulty: q.difficulty,
                marks: q.marks || 1,
            })),
        });

        // =========================
        // UPDATE TEST
        // =========================

        await db.test.update({
            where: {
                id: test.id,
            },
            data: {
                isGenerated: true,
            },
        });

        // =========================
        // SUCCESS
        // =========================

        return NextResponse.json({
            success: true,
            message: "Questions generated successfully",
        });

    } catch (error) {

        console.error("TEST GENERATION ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong",
            },
            { status: 500 }
        );
    }
}