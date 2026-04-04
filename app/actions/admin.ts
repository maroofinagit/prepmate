"use server";

import { Resend } from "resend";
import { db } from "../lib/db";

export async function getAdminDashboardData() {
    const totalUsers = await db.user.count();

    const users = await db.user.findMany({
        include: {
            exams: {
                include: {
                    exam: true,
                },
            },
        },
    });

    return {
        totalUsers,
        users,
    };
}

export async function getUserDetails(userId: string) {
    const user = await db.user.findUnique({
        where: { id: userId },
        include: {
            exams: {
                include: {
                    exam: true,
                    roadmap: true,
                },
            },
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    return user;
}

// Admin action to send email to a Admin when a new user signs up without enrolling in any exam
export async function sendAdminNotificationEmail(to: string, name: string) {

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        await resend.emails.send({
            from: "PrepMate <onboarding@resend.dev>",
            to: process.env.NEXT_PUBLIC_GMAIL_USER!, // Admin email address from environment variable
            subject: "New User Signup Notification - PrepMate 🚀",
            html: `
<div style="font-family:Arial,sans-serif;background-color:#f4f6f8;padding:30px;">

  <div style="max-width:600px;margin:0 auto;background:#ffffff;padding:25px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
    
    <h2 style="margin-bottom:10px;color:#111;">
      🚀 New User Signup
    </h2>

    <p style="color:#555;margin-bottom:20px;">
      A new user has just registered on <b>PrepMate</b>.
    </p>

    <div style="background:#f9fafb;padding:15px;border-radius:8px;border:1px solid #eee;">
      
      <p style="margin:8px 0;">
        <strong>Name:</strong> ${name}
      </p>

      <p style="margin:8px 0;">
        <strong>Email:</strong> ${to}
      </p>

    </div>

    <hr style="border:none;border-top:1px solid #eee;margin:25px 0;" />

    <p style="font-size:13px;color:#888;">
      This is an automated notification from PrepMate.
    </p>

  </div>

</div>
`
        });
        return { success: true };
    } catch (error) {
        console.error("Error sending admin notification email:", error);
        return { success: false };

    }
}

