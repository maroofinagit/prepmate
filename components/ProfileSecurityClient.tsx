"use client";

import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    ShieldCheck,
    LockKeyhole,
    Trash2,
} from "lucide-react";
import { DeleteAccountDialog } from "./DeleteAccountDialoge";
import { FaChrome, FaGithub } from "react-icons/fa";
import { SetPasswordDialog } from "./SetPasswordDialogue";
import { ChangePasswordDialog } from "./ChangePassDialogue";

interface SecurityPageProps {
    security: {
        hasCredentials: boolean;
        hasGoogle: boolean;
        hasGithub: boolean;
    };
}

export default function ProfileSecurityClient({
    security,
}: SecurityPageProps) {
    const router = useRouter();

    return (
        <div className="max-w-4xl mx-auto py-12 px-6 mt-20 space-y-8">
            <div>

                <h1 className="text-3xl font-bold">Security</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your password, connected sign-in methods, and account security.
                </p>
            </div>

            {/* Password */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <LockKeyhole className="h-5 w-5 " />
                        Password
                    </CardTitle>
                    <CardDescription>
                        Manage your account password.
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <p className="font-medium">
                            {security.hasCredentials
                                ? "Password has been set."
                                : "No password has been added yet."}
                        </p>

                        <p className="text-sm text-muted-foreground">
                            {security.hasCredentials
                                ? "You can update your existing password."
                                : "Add a password to sign in with your email."}
                        </p>
                    </div>


                    {security.hasCredentials
                        ? <ChangePasswordDialog />
                        : <SetPasswordDialog />}

                </CardContent>
            </Card>

            {/* Connected Accounts */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5" />
                        Sign-in Methods
                    </CardTitle>

                    <CardDescription>
                        Accounts connected to your profile.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    {security.hasGoogle && (
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <FaChrome className="h-5 w-5" />
                                <span>Google</span>
                            </div>

                            <Badge className="bg-green-100 text-green-800">Connected</Badge>
                        </div>
                    )}

                    {security.hasGithub && (
                        <>
                            <Separator />

                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <FaGithub className="h-5 w-5" />
                                    <span>GitHub</span>
                                </div>

                                <Badge className="bg-green-100 text-green-800">Connected</Badge>
                            </div>
                        </>
                    )}

                    {security.hasCredentials && (
                        <>
                            <Separator />

                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <LockKeyhole className="h-5 w-5" />
                                    <span>Password</span>
                                </div>

                                <Badge className="bg-green-100 text-green-800">Connected</Badge>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trash2 className="h-5 w-5 text-red-500" />
                        Danger Zone
                    </CardTitle>

                    <CardDescription>
                        Irreversible actions for your account. Please proceed carefully.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="rounded-xl border border-red-200 bg-red-50/60 p-5">
                        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                            <div className="space-y-2">
                                <h3 className="text-base font-semibold text-red-700">
                                    Delete Account
                                </h3>

                                <p className="max-w-md text-sm text-muted-foreground">
                                    Permanently delete your PrepMate account, including your
                                    enrolled exams, learning progress, notifications, and
                                    all associated data. This action cannot be undone.
                                </p>
                            </div>

                            <DeleteAccountDialog />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
