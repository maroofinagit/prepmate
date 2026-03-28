"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function VisitMobile() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const dismissed = sessionStorage.getItem("mobileNoticeDismissed");
        if (!dismissed) {
            setVisible(true);
        }
    }, []);

    const handleClose = () => {
        sessionStorage.setItem("mobileNoticeDismissed", "true");
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="w-full bg-yellow-400 text-black px-4 py-3 flex items-center justify-between text-sm md:hidden">
            <span>
                For complete experience, please visit the desktop version of PrepMate.
                Some features may not work fully on mobile.
            </span>

            <button
                onClick={handleClose}
                className="ml-4 shrink-0 cursor-pointer p-1 rounded-2xl hover:bg-red-500 hover:text-white transition"
                aria-label="Close"
            >
                <X size={18} />
            </button>
        </div>
    );
}