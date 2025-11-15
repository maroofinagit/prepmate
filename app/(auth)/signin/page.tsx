"use client";

import { useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaGithub } from "react-icons/fa";
import { FaChrome } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { FiLoader } from "react-icons/fi";
import { authClient } from "@/app/lib/auth-client";
import { toast } from "react-toastify";

export default function SignInPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(null);
    const [error, setError] = useState("");

    // Redirect if already logged in
    useEffect(() => {
        const fetchSession = async () => {
            const { data } = await authClient.getSession();
            if (data?.session) redirect("/");
        };
        fetchSession();
    }, []);

    // Email Sign-In
    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();

        const { error } = await authClient.signIn.email(
            {
                email,
                password,
                rememberMe: true,
            },
            {
                onRequest: () => {
                    setLoading(true);
                    setError("");
                },
                onSuccess: () => {
                    toast.success("Signed in successfully!", { autoClose: 1500 });
                    redirect("/");
                },
                onError: (ctx) => {
                    setError(ctx.error?.message || "Something went wrong.");
                    setLoading(false);
                },
            }
        );
    };

    // Social Sign-In
    const handleSocialSignIn = async (provider: "google" | "github") => {
        setOauthLoading(provider);

        const res = await authClient.signIn.social(
            {
                provider,
                callbackURL: "/",
                errorCallbackURL: "/signin",
                newUserCallbackURL: "/",
                disableRedirect: false,
            },
            {
                onRequest: () => {
                    setOauthLoading(provider);
                    setError("");
                },
                onSuccess: () => {
                    setOauthLoading(null);
                },
                onError: (ctx) => {
                    setError(ctx.error?.message || "Something went wrong.");
                    setOauthLoading(null);
                },
            }
        );
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 mt-16">
            <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg border border-gray-200">
                <h1 className="text-2xl font-semibold text-center mb-6">
                    Sign in to PrepMate
                </h1>

                {/* Email Sign-In Form */}
                <form onSubmit={handleEmailSignIn} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Email
                        </label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Password
                        </label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 text-center">{error}</p>
                    )}

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? (
                            <FiLoader className="animate-spin h-4 w-4 mr-2" />
                        ) : (
                            <CiMail className="h-4 w-4 mr-2" />
                        )}
                        {loading ? "Signing in..." : "Sign in with Email"}
                    </Button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <div className="grow h-px bg-gray-300" />
                    <span className="px-3 text-sm text-gray-500">or</span>
                    <div className="grow h-px bg-gray-300" />
                </div>

                {/* Social Buttons */}
                <div className="space-y-3">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={oauthLoading === "google"}
                        onClick={() => handleSocialSignIn("google")}
                        className="w-full flex items-center justify-center"
                    >
                        {oauthLoading === "google" ? (
                            <FiLoader className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <FaChrome className="h-4 w-4 mr-2" />
                        )}
                        {oauthLoading === "google" ? "Connecting..." : "Sign in with Google"}
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        disabled={oauthLoading === "github"}
                        onClick={() => handleSocialSignIn("github")}
                        className="w-full flex items-center justify-center"
                    >
                        {oauthLoading === "github" ? (
                            <FiLoader className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <FaGithub className="h-4 w-4 mr-2" />
                        )}
                        {oauthLoading === "github" ? "Connecting..." : "Sign in with GitHub"}
                    </Button>
                </div>

                {/* Link */}
                <p className="text-center text-sm text-gray-500 mt-4">
                    Don’t have an account?{" "}
                    <a href="/signup" className="text-blue-600 hover:underline">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
}
