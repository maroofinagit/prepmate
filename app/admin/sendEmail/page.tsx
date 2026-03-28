"use client";

import { useState } from "react";
import { toast } from "react-toastify";    

export default function SendEmailPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!email) {
            toast.error("Please enter an email address");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("/api/sendEmail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    to: email,
                    name: name,
                }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Email sent successfully!");
                setName("");
                setEmail("");
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
                    Send PrepMate Email 🚀
                </h1>

                <input
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border p-2 rounded mb-3"
                />

                <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border p-2 rounded mb-4"
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