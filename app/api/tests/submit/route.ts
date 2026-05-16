import { NextResponse } from "next/server";

import { db } from "@/app/lib/db";

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {

    try {

        // =========================
        // AUTH CHECK
        // =========================
        const session = await auth.api.getSession({
                headers: await headers(),
        });

        if (!session?.user?.id) {
            return NextResponse.json(
                {
                    error: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        // =========================
        // GET BODY
        // =========================
        const body = await req.json();

        const { testId, responses } = body;

        if (!testId || !responses) {
            return NextResponse.json(
                {
                    error: "Missing fields",
                },
                {
                    status: 400,
                }
            );
        }

        // =========================
        // FIND TEST
        // =========================
        const test = await db.test.findUnique({
            where: {
                id: testId,
            },

            include: {
                questions: true,
                attempt: true,
            },
        });

        if (!test) {
            return NextResponse.json(
                {
                    error: "Test not found",
                },
                {
                    status: 404,
                }
            );
        }

        // =========================
        // CHECK IF ALREADY ATTEMPTED
        // =========================
        if (test.attempt) {
            return NextResponse.json(
                {
                    error: "Test already submitted",
                },
                {
                    status: 400,
                }
            );
        }

        // =========================
        // CALCULATE SCORE
        // =========================
        let score = 0;

        for (const question of test.questions) {

            const userAnswer = responses[question.id];

            if (userAnswer === question.correctAns) {
                score += question.marks;
            }
        }

        // =========================
        // PERCENTAGE
        // =========================
        const percentage =
            (score / test.totalMarks) * 100;

        // =========================
        // CREATE TEST ATTEMPT
        // =========================
        await db.testAttempt.create({
            data: {
                userId: session.user.id,

                testId: test.id,

                score,

                totalMarks: test.totalMarks,

                percentage,

                responses,
            },
        });

        // =========================
        // UPDATE USER EXAM STATS
        // =========================
        const userExam = await db.userExam.findUnique({
            where: {
                id: test.userExamId,
            },
        });

        if (userExam) {

            const previousTests =
                userExam.testsGiven || 0;

            const previousPerformance =
                userExam.performanceScore || 0;

            const newTestsCount =
                previousTests + 1;

            // running average
            const newPerformance =
                (
                    (
                        previousPerformance *
                        previousTests
                    ) +
                    percentage
                ) / newTestsCount;

            await db.userExam.update({
                where: {
                    id: userExam.id,
                },

                data: {
                    testsGiven: {
                        increment: 1,
                    },

                    performanceScore:
                        Number(newPerformance.toFixed(2)),
                },
            });
        }

        // =========================
        // RESPONSE
        // =========================
        return NextResponse.json({
            success: true,

            score,

            totalMarks: test.totalMarks,

            percentage:
                Number(percentage.toFixed(2)),
        });

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            {
                error: "Internal Server Error",
            },
            {
                status: 500,
            }
        );
    }
}