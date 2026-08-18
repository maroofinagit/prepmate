
import { generateRoadmap } from "@/app/actions/roadmap";
// Adjust this import to wherever your function actually lives.


export async function GET(request: Request) {
    const { searchParams } = new URL(
        request.url
    );

    const userExamIdParam =
        searchParams.get("userExamId");

    if (!userExamIdParam) {
        return new Response(
            "Missing userExamId",
            {
                status: 400,
            }
        );
    }

    const userExamId =
        Number(userExamIdParam);

    if (Number.isNaN(userExamId)) {
        return new Response(
            "Invalid userExamId",
            {
                status: 400,
            }
        );
    }

    const encoder =
        new TextEncoder();

    const stream =
        new ReadableStream({
            async start(controller) {

                // Helper to send an SSE event
                const send = (
                    data: unknown
                ) => {
                    controller.enqueue(
                        encoder.encode(
                            `data: ${JSON.stringify(
                                data
                            )}\n\n`
                        )
                    );
                };

                try {

                    // Tell client that SSE connection
                    // has been established
                    send({
                        type: "connected",
                        message:
                            "Connected to roadmap generator.",
                    });

                    // Start roadmap generation
                    const result = await generateRoadmap(
                        userExamId,
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
                            message:
                                "Roadmap generated successfully!",
                            roadmapId:
                                result.roadmap_id,
                        });

                    } else {

                        // Generation failed
                        send({
                            type: "error",
                            message:
                                result.error ??
                                "Roadmap generation failed.",
                        });
                    }

                } catch (error) {

                    console.error(
                        "SSE roadmap error:",
                        error
                    );

                    send({
                        type: "error",
                        message:
                            "Roadmap generation failed.",
                    });

                } finally {

                    // Close SSE connection
                    controller.close();
                }
            },
        });

    return new Response(
        stream,
        {
            headers: {
                "Content-Type":
                    "text/event-stream",

                "Cache-Control":
                    "no-cache, no-transform",

                Connection:
                    "keep-alive",

                "X-Accel-Buffering":
                    "no",
            },
        }
    );
}