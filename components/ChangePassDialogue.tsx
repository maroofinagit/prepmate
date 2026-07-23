"use client";

import { useState } from "react";
import { toast } from "sonner";
import { changePassword } from "@/app/actions/action";

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

export function ChangePasswordDialog() {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter();

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("Please fill in all fields.");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        if (currentPassword === newPassword) {
            toast.error("New password must be different from your current password.");
            return;
        }

        try {
            setLoading(true);

            const res = await changePassword(
                currentPassword,
                newPassword
            );

            if (!res.success) {
                toast.error(res.message);
                return;
            }

            toast.success(res.message);
            
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setOpen(false);
            router.refresh(); // Refresh the page to reflect the updated state
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setOpen(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="bg-transparent font-medium text-blue-600 border border-blue-600 px-5 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition cursor-pointer">
                    Change Password
                </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        Change Password
                    </DialogTitle>

                    <DialogDescription>
                        Enter your current password and choose a new one.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">
                            Current Password
                        </Label>

                        <Input
                            id="currentPassword"
                            type="password"
                            value={currentPassword}
                            onChange={(e) =>
                                setCurrentPassword(e.target.value)
                            }
                            placeholder="Enter current password"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="newPassword">
                            New Password
                        </Label>

                        <Input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(e.target.value)
                            }
                            placeholder="Enter new password"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                            Confirm Password
                        </Label>

                        <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            placeholder="Confirm new password"
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
                        onClick={handleChangePassword}
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {loading ? "Updating..." : "Change Password"}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}