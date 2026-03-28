import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { to, name } = body;

        // 🔐 transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        // 📩 send mail
        const info = await transporter.sendMail({
            from: `"PrepMate" <${process.env.GMAIL_USER}>`,
            to,
            subject: "You’re one step away from unlocking PrepMate 🚀",
            //         html: `
            //   <div style="font-family:Arial,sans-serif;padding:20px;background:#f0f0f0;border-radius:10px;">
            //     <h2>Hey ${name || 'there'} 👋</h2>

            //     <p>
            //       You’ve signed up for <b>PrepMate</b> <i>great first step</i> 🙌  
            //       But you haven’t enrolled in any exam yet.
            //     </p>

            //     <p>And that’s where everything begins.</p>

            //     <p><b>Once you choose an exam, here’s what happens:</b></p>

            //     <ul>
            //       <li>✨ <b><i>Personalized roadmap</i></b></li>
            //       <li>📅 <b><i>Structured study plan</i></b></li>
            //       <li>📊 <b><i>Progress tracking</i></b></li>
            //       <li>🤖 <b><i>Smart AI guidance</i></b></li>
            //     </ul>

            //     <div style="text-align:center;margin:20px 0;">
            //       <a href="https://prepmatex.vercel.app/onboarding" target="_blank"
            //          style="background:#111;color:#fff;padding:12px 20px;text-decoration:none;border-radius:8px;">
            //          🚀 Choose Your Exam
            //       </a>
            //     </div>

            //     <p style="text-align:center;">Here’s a glimpse of your PrepMate experience:</p>

            //     <div style="text-align:center;">
            //       <img 
            //         src="https://prepmatex.vercel.app/dashboard.png"
            //         style="max-width:500px;width:100%;border-radius:10px;"
            //       />
            //     </div>

            //     <p style="margin-top:20px;">
            //       It takes less than a minute to start, but it can shape your entire preparation.
            //     </p>

            //     <p>— Team PrepMate</p>
            //   </div>
            //   `,
            html: `
<div style="font-family:Arial,sans-serif;padding:20px;line-height:1.6;color:#333;">

  <h2>Hey ${name || "there"} 👋</h2>

  <p>
    You’ve successfully created your <b>PrepMate roadmap</b> - that’s a strong start 🙌
  </p>

  <p>
    Now let’s make sure you know <b>exactly how to use it</b>.
  </p>

  <p>
    Think of PrepMate as your guide you don’t have to figure things out on your own.
    Just follow these simple steps:
  </p>

  <ol style="padding-left:18px;">
    <li>
      🔑 <b>Log in to your account</b>
    </li>

    <li>
      📊 <b>Go to your Dashboard</b><br/>
      This is your main control center where everything is organized.
    </li>

    <li>
      🗺 <b>Open your Roadmap</b><br/>
      You’ll see your full plan divided into clear phases.
    </li>

    <li>
      📌 <b>Explore phases & tasks</b><br/>
      Each phase contains tasks you need to complete step by step.
    </li>

    <li>
      ✅ <b>Mark tasks as completed</b><br/>
      As you finish tasks, mark them done to track your consistency.
    </li>

    <li>
      📈 <b>Track your progress</b><br/>
      Your progress will automatically reflect on your dashboard — keeping you motivated.
    </li>
  </ol>

  <div style="text-align:center;margin:25px 0;">
    <a href="https://prepmatex.vercel.app/dashboard"
       style="background:#111;color:#fff;padding:12px 22px;text-decoration:none;border-radius:8px;font-size:14px;">
       🚀 Go to Your Dashboard
    </a>
  </div>

  <p style="text-align:center;color:#555;">
    Here’s a quick look at your roadmap inside PrepMate:
  </p>

  <div style="text-align:center;margin:15px 0;">
    <img 
      src="https://prepmatex.vercel.app/roadmap.png"
      alt="PrepMate Roadmap Preview"
      style="width:100%;max-width:520px;border-radius:12px;"
    />
  </div>

  <p>
    You don’t need to do everything at once.  
    Just start with today’s tasks and keep moving forward.
  </p>

  <p>
    Stay consistent we’ll take care of the structure.
  </p>

  <p style="margin-top:20px;">
    - Maroof,<br/>
    Founder, PrepMate
  </p>

</div>
`
        });

        return NextResponse.json({
            success: true,
            messageId: info.messageId,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, error: "Failed to send email" },
            { status: 500 }
        );
    }
}