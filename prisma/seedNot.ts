// prisma/seed.ts

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    // Example: Fetch one existing user
    const userId = '65jLIS55osEUKOsmoMeWl3ikj78b8NJD'; // replace with a real user id from your auth system

    await prisma.notification.createMany({
        data: [
            {
                user_id: userId,
                message: "Your roadmap version 1 has been generated successfully.",
            },
            {
                user_id: userId,
                message: "You have new tasks awaiting in Week 1.",
            },
            {
                user_id: userId,
                message: "Soon mock exams will be available for your roadmap.",
            }
        ],
    });

    console.log("Notification seeding done!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
