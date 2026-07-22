import { db } from "@/app/lib/db";

async function main() {
    console.log("🌱 Prisma seeding started...");

    await db.notification.createMany({
        data: [
            {
                user_id: 'chkvrGqoHciMgW5J3oxdzAJ2cpy5naTY',
                user_exam_id: 15,
                roadmap_id: 12,
                message: "Your Placement Prep (CS) roadmap has been generated successfully.",
                is_read: false,
            },
            {
                user_id: 'chkvrGqoHciMgW5J3oxdzAJ2cpy5naTY',
                user_exam_id: 25,
                roadmap_id: 23,
                message: "Your Systems Design roadmap has been generated successfully.",
                is_read: false,
            },
        ],
    });
}

main()
    .then(() => {
        console.log("✅ Notification seeding completed.");
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ Notification seeding failed:", error);
        process.exit(1);
    }); 
