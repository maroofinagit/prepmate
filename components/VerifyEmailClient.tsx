"use client";

import { useState } from "react";
import { authClient } from "@/app/lib/auth-client";

interface VerifyEmailClientProps {
    email: string;
}

export default function VerifyEmailClient({
    email,
}: VerifyEmailClientProps) {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    async function resendVerificationEmail() {
        setLoading(true);
        setError("");
        setSent(false);

        const { error } = await authClient.sendVerificationEmail({
            email,
            callbackURL: "/dashboard",
        });

        setLoading(false);

        if (error) {
            setError(error.message || "Failed to send verification email.");
            return;
        }

        setSent(true);
    }

    return (
        <main className="flex min-h-screen items-center justify-center px-6">
            <div className="w-full max-w-md text-center">
                <h1 className="text-2xl font-semibold">
                    Verify your email
                </h1>

                <p className="mt-3 text-sm text-muted-foreground">
                    We've sent a verification link to
                </p>

                <p className="mt-1 font-medium">
                    {email}
                </p>

                <p className="mt-4 text-sm text-muted-foreground">
                    Click the link in the email to verify your account
                    and continue using Schemae.
                </p>

                <button
                    type="button"
                    onClick={resendVerificationEmail}
                    disabled={loading}
                    className="mt-6 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                >
                    {loading ? "Sending..." : "Resend verification email"}
                </button>

                {sent && (
                    <p className="mt-4 text-sm text-green-600">
                        Verification email sent. Check your inbox.
                    </p>
                )}

                {error && (
                    <p className="mt-4 text-sm text-destructive">
                        {error}
                    </p>
                )}

                <p className="mt-6 text-xs text-muted-foreground">
                    Didn't receive it? Check your spam or junk folder.
                </p>
            </div>
        </main>
    );
}