'use client'
import { useState } from "react";
import { sendEmail } from "@/app/actions/admin";
import { toast } from "sonner";

export default function SendEmailClient({ email, name }: { email: string; name: string }) {

    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!body) {
            toast.error("Please enter an email body");
            return;
        }

        if (!subject) {
            toast.error("Please enter an email subject");
            return;
        }

        try {
            setLoading(true);

            const res = await sendEmail({
                to: email,
                name: name,
                subject,
                body,
            });

            if (res.success) {
                toast.success("Email sent successfully!");
                setSubject("");
                setBody("");
            } else {
                toast.error("❌ Failed to send email");
            }
        } catch (err) {
            toast.error("❌ Something went wrong");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f6f1eb] px-4">
            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">

                <h1 className="text-xl font-semibold mb-4">
                    Send Email to {name} 🚀
                </h1>

                <input
                    type="text"
                    placeholder="Enter subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full border p-2 rounded mb-3"
                />

                <textarea
                    placeholder="Enter email body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full border p-2 rounded mb-4"
                    rows={5}
                />

                <button
                    onClick={handleSend}
                    disabled={loading}
                    className={`w-full cursor-pointer bg-black text-white py-2 rounded hover:bg-green-700 hover:opacity-90 ${loading ? "cursor-not-allowed opacity-70 hover:opacity-70" : ""}`}
                >
                    {loading ? "Sending..." : "Send Email"}
                </button>

            </div>
        </div>
    );
}