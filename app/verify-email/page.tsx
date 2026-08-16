
import VerifyEmailClient from "@/components/VerifyEmailClient";
import { db } from "../lib/db";

interface VerifyEmailPageProps {
    searchParams: Promise<{
        email?: string;
    }>;
}

export default async function VerifyEmailPage({
    searchParams,
}: VerifyEmailPageProps) {

    const params = await searchParams;
    const email = params.email || "";

    if (!email) {
        return (
            <div className="flex min-h-screen items-center justify-center px-6">
                <div className="w-full max-w-md text-center">
                    <h1 className="text-2xl font-semibold">
                        Email not provided
                    </h1>
                    <p className="mt-3 text-sm text-muted-foreground">
                        Please provide an email address to verify.
                    </p>
                </div>
            </div>
        );
    }

    const verified = await db.user.findUnique({
        where: {
            email,
        },
        select: {
            emailVerified: true,
        },
    })

    if (verified?.emailVerified) {
        return (
            <div className="flex min-h-screen items-center justify-center px-6">
                <div className="w-full max-w-md text-center">
                    <h1 className="text-2xl font-semibold">
                        Email already verified
                    </h1>
                    <p className="mt-3 text-sm text-muted-foreground">
                        Your email address has already been verified. You can now log in to your account.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <VerifyEmailClient
            email={email}
        />
    );
}