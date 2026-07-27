import { db } from "@/app/lib/db";


async function main() {
    const roadmaps = await db.roadmap.findMany({
        include: {
            phases: {
                include: {
                    weeks: {
                        include: {
                            tasks: {
                                orderBy: {
                                    order_index: "asc",
                                },
                            },
                        },
                        orderBy: {
                            week_number: "asc",
                        },
                    },
                },
                orderBy: {
                    order_index: "asc",
                },
            },
        },
    });

    for (const roadmap of roadmaps) {
        console.log(`Updating Roadmap ${roadmap.id}`);

        for (const phase of roadmap.phases) {
            let phaseStart: Date | null = null;
            let phaseEnd: Date | null = null;

            for (const week of phase.weeks) {
                if (week.tasks.length === 0) continue;

                const weekStart = week.tasks[0].start_date!;
                const weekEnd = week.tasks[week.tasks.length - 1].end_date!;

                await db.roadmapWeek.update({
                    where: { id: week.id },
                    data: {
                        start_date: weekStart,
                        end_date: weekEnd,
                    },
                });

                if (!phaseStart) phaseStart = weekStart;
                phaseEnd = weekEnd;
            }

            await db.roadmapPhase.update({
                where: { id: phase.id },
                data: {
                    start_date: phaseStart,
                    end_date: phaseEnd,
                },
            });
        }
    }

    console.log("✅ Roadmap dates updated successfully.");
}

main()
    .catch(console.error)
    .finally(async () => {
        await db.$disconnect();
    });