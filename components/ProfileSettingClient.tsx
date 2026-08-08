"use client";

import { useState } from "react";
import { Volume2 } from "lucide-react";

import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { updateSoundPreference } from "@/app/actions/action";
import { toast } from "sonner";
import { useUser } from "@/app/context/userContext";
import { playNotification, playError } from "@/app/lib/sound";


type ProfileSettingsProps = {
    userSettings: {
        name: string | null;
        soundEnabled: boolean | null;
    };
    userId: string;
};

export default function ProfileSettingsClient({
    userSettings,
    userId,
}: ProfileSettingsProps) {

    const { soundEnabled, setSoundEnabled } = useUser();
    const [isUpdating, setIsUpdating] = useState(false);

    const handleToggle = async (checked: boolean) => {

        try {
            toast("Want to change sound preference ?", {
                action: {
                    label: "Yes",
                    onClick: async () => {
                        setIsUpdating(true);
                        const result = await updateSoundPreference(userId, checked);
                        if (!result.success) {
                            throw new Error("Failed to update sound preference");
                        }
                        setSoundEnabled(checked);
                        if (!soundEnabled) {
                            playNotification();
                        }
                        toast.success("Sound preference updated successfully");
                        setIsUpdating(false);
                    }
                },
                cancel: {
                    label: "Cancel",
                    onClick: async () => {
                        setIsUpdating(false);
                        if (soundEnabled) {
                            playError();
                        }
                        toast.error("Sound preference update canceled")
                    },
                },
                duration: Infinity, // Keep the toast open until user interacts
            });
        } catch (error) {
            setIsUpdating(false);
            console.log(error);
            if (soundEnabled) {
                playError();
            }
            toast.error("Failed to update sound preference");
        }
    };

    return (
        <div className="mx-auto h-screen max-w-4xl pt-32 space-y-8">
            <div>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                    {userSettings.name ?? "User"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Manage your personal preferences.
                </p>
            </div>

            <Card className="overflow-hidden border-border/60 shadow-sm transition-shadow hover:shadow-md">
                <CardContent className="flex items-center justify-between gap-8 p-6">
                    <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Volume2 className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                            <h3 className="text-base font-semibold tracking-tight">
                                Sound Effects
                            </h3>

                            <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted-foreground">
                                Play sounds for completed tasks, roadmap generation,
                                achievements, and notifications.
                            </p>
                        </div>
                    </div>

                    <Switch
                        className="cursor-pointer"
                        disabled={isUpdating}
                        checked={soundEnabled}
                        onCheckedChange={handleToggle}
                    />
                </CardContent>
            </Card>
        </div>
    );
}