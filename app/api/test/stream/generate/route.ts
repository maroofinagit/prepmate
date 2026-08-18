import { generateTestAttempt } from "@/app/actions/test";
import { success } from "better-auth";
import { s } from "framer-motion/client";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const testIdParam = searchParams.get("testId");

    if (!testIdParam) {
        return new Response("Missing testId", {
            status: 400,
        });
    }

    const testId = Number(testIdParam);

    if (Number.isNaN(testId)) {
        return new Response("Invalid testId", {
            status: 400,
        });
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {

            const send = (data: unknown) => {
                controller.enqueue(
                    encoder.encode(
                        `data: ${JSON.stringify(data)}\n\n`
                    )
                );
            };

            try {
                // SSE connection established
                send({
                    type: "connected",
                    message: "Connected to test generator.",
                });

                // Start test generation
                const result = await generateTestAttempt(
                    testId,
                    (event) => {
                        console.log("📡 SSE sending:", event);

                        send({
                            type: "progress",
                            ...event,
                        });
                    }
                );

                // Generation successful
                if (result.success) {
                    send({
                        type: "completed",
                        message: "Test generated successfully!",
                        success: true,
                    });
                } else {
                    send({
                        type: "error",
                        message:
                            result.error ??
                            "Test generation failed.",
                        success: false,
                    });
                }

            } catch (error) {
                console.error(
                    "SSE test generation error:",
                    error
                );

                send({
                    type: "error",
                    message: "Test generation failed.",
                    success: false,
                });

            } finally {
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
            "X-Accel-Buffering": "no",
        },
    });
}