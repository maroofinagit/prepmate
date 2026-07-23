"use client";

import { useState } from "react";
import { toast } from "sonner";
import { setPassword } from "@/app/actions/action";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export function SetPasswordDialog() {
    const [loading, setLoading] = useState(false);
    const [password, setPasswordValue] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [open, setOpen] = useState(false);

    const router = useRouter();

    const handleSetPassword = async () => {
        if (!password || !confirmPassword) {
            toast.error("Please fill in all fields.");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const res = await setPassword(password);

            if (!res.success) {
                toast.error(res.message || "Failed to set password.");
                return;
            }

            toast.success(res.message || "Password added successfully.");

            setPasswordValue("");
            setConfirmPassword("");
            setOpen(false);
            router.refresh(); // Refresh the page to reflect the updated state
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
            setPasswordValue("");
            setConfirmPassword("");
            setOpen(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="bg-transparent font-medium text-blue-600 border border-blue-600 px-5 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition cursor-pointer">
                    Set Password
                </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        Set Password
                    </DialogTitle>

                    <DialogDescription>
                        Add a password to your account so you can sign in using your email and password in addition to your existing sign-in methods.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">
                            New Password
                        </Label>

                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPasswordValue(e.target.value)
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                            Confirm Password
                        </Label>

                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                        />
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <DialogClose asChild>
                        <button
                            disabled={loading}
                            className="px-4 py-2 rounded-md border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            Cancel
                        </button>
                    </DialogClose>

                    <button
                        onClick={handleSetPassword}
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {loading ? "Saving..." : "Set Password"}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}