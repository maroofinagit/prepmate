"use client";

import { authClient } from "@/app/lib/auth-client";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useState(() => {
        // If user is already logged in, redirect to dashboard
        const fetchSession = async () => {
            const { data, error } = await authClient.getSession();
            if (data?.session) {
                redirect("/");
            }
            if (error) {
                console.error("Error fetching session:", error);
            }
        };
        fetchSession();

    },);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { data, error } = await authClient.signUp.email({
            email, // user email address
            password, // user password -> min 8 characters by default
            name, // user display name
        }, {
            onRequest: (ctx) => {
                //show loading
                setLoading(true);
                setErrorMsg("");
            },
            onSuccess: (ctx) => {
                //redirect to the dashboard or sign in page
                toast.success("Account created successfully!");
                redirect("/");

            },
            onError: (ctx) => {
                // display the error message
                setLoading(false);
            },
        });
        if (error) {
            setErrorMsg(error.message || "An unexpected error occurred.");
            setLoading(false);
            return;
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h1>

                {errorMsg && (
                    <div className="mb-4 p-2 text-red-700 bg-red-100 rounded">{errorMsg}</div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your full name"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="At least 8 characters"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-600">
                    Already have an account?{" "}
                    <a href="/signin" className="text-blue-600 font-medium hover:underline">
                        Sign In
                    </a>
                </p>
            </div>
        </div>
    );
}
