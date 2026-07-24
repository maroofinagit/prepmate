"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { authClient } from "@/app/lib/auth-client";

export default function ToastLogin() {
    const { data: session } = authClient.useSession();

    useEffect(() => {
        if (
            session &&
            sessionStorage.getItem("show-login-toast") === "true"
        ) {
            toast.success("Signed in successfully!" ,{
                duration: 1500
            });
            sessionStorage.removeItem("show-login-toast");
        }
    }, [session]);

    return null;
}