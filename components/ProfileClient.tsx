"use client";

import { format } from "date-fns";
import { useRouter } from "next/navigation";
import ProfileImageUploader from "@/components/ProfilePicUpdater";
import { IoIosNotifications } from "react-icons/io";
import { useState } from "react";
import { DeleteAccountDialog } from "./DeleteAccountDialoge";
import { BellRing, CheckCircle, CheckCircle2, GraduationCap, ShieldCheck } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { markNotificationAsRead } from "@/app/actions/action";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";
import { PiExam } from "react-icons/pi";

export default function ProfilePage({ user }: { user: any }) {

    const router = useRouter();

    if (!user) {
        return <div className="text-center mt-20 text-gray-500">User not found.</div>;
    }

    const [notifications, setNotifications] = useState(user.notifications);

    const handleNotification = async (id: number) => {
        try {
            await markNotificationAsRead(id);
            setNotifications((prev: any) =>
                prev.map((n: any) => (n.id === id ? { ...n, is_read: true } : n))
            );
            toast.success("Notification marked as read");
        } catch (error) {
            console.error("Error marking notification as read:", error);
            toast.error("Failed to mark notification as read");
        }
    }

    return (
        <div className="max-w-5xl mx-auto py-12 px-8 md:px-0 mt-24">
            {/* Profile Card */}
            <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="relative overflow-hidden rounded-3xl border bg-linear-to-br from-white via-slate-50 to-blue-50 p-8 shadow-lg">

                    {/* Decorative Background */}
                    <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-blue-100/50 blur-3xl" />
                    <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-slate-200/40 blur-3xl" />

                    <div className="relative flex flex-col md:flex-row items-center gap-8">

                        {/* Avatar */}
                        <div className="rounded-full ring-4 ring-white shadow-xl">
                            <ProfileImageUploader initialImage={user.image ?? ""} />
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <h1 className="text-xl md:text-3xl font-bold tracking-tight text-slate-900">
                                    {user.name || "Unnamed User"}
                                </h1>

                                {user.role?.toLowerCase() === "admin" && (
                                    <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                                        Admin
                                    </span>
                                )}
                            </div>

                            <p className="mt-2 text-sm md:text-base text-slate-600">
                                {user.email}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                                Joined {format(new Date(user.createdAt), "dd MMM yyyy")}
                            </p>

                        </div>

                    </div>
                </div>
            </motion.div>

            {/* Exams Section */}
            <motion.section
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5 }}
                className="mt-14"
            >
                <div className="flex flex-col gap-4 mb-6">
                    <h2 className="text-xl md:text-2xl font-bold">Learning Progress</h2>
                    <p className="text-sm text-muted-foreground">
                        Track your enrolled exams and progress.
                    </p>
                </div>

                {user.exams.length > 0 ? (
                    <div className="grid grid-cols-2 gap-6">
                        {user.exams.map((ue: any, index: number) => (
                            <motion.div
                                key={ue.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.08,
                                }}
                            >
                                <div className="rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl">

                                    <div className="flex items-start justify-between">
                                        <h3 className="md:text-xl text-sm font-semibold">
                                            {ue.exam.name}
                                        </h3>


                                        <GraduationCap size={28} className="text-blue-600 hidden md:block" />
                                    </div>

                                    {/* Progress */}
                                    <div className="mt-6">

                                        <div className="mb-2 flex md:flex-row flex-col justify-between text-sm">
                                            <span className="text-slate-500 text-xs md:text-base">
                                                Progress
                                            </span>

                                            <span className="font-medium text-xs md:text-base">
                                                {ue.progress_percent?.toFixed(1) || 0}%
                                            </span>
                                        </div>

                                        <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{
                                                    width: `${ue.progress_percent || 0}%`,
                                                }}
                                                viewport={{ once: true }}
                                                transition={{
                                                    duration: 1,
                                                    ease: "easeOut",
                                                }}
                                                className="h-full rounded-full bg-blue-600"
                                            />
                                        </div>

                                    </div>

                                    <div className="mt-6 gap-y-4 flex md:flex-row flex-col text-xs items-center justify-between md:text-sm text-slate-500">

                                        <div>
                                            <p className="font-medium text-slate-700">
                                                Started
                                            </p>

                                            <p>
                                                {format(new Date(ue.start_date), "dd MMM yyyy")}
                                            </p>
                                        </div>

                                        <div className="md:text-right ">
                                            <p className="font-medium text-slate-700">
                                                Ends
                                            </p>

                                            <p>
                                                {format(new Date(ue.end_date), "dd MMM yyyy")}
                                            </p>
                                        </div>

                                    </div>

                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed bg-slate-50 py-12 text-center">
                        <p className="text-slate-500">
                            No exams enrolled yet.
                        </p>
                    </div>
                )}
            </motion.section>

            {/* Notifications */}
            <motion.section
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5 }}
                className="mt-14"
            >
                <div className="flex flex-col gap-3 mb-6">
                    <h2 className="text-xl md:text-2xl font-bold">Recent Activity</h2>
                    <p className="text-sm text-muted-foreground">
                        Stay updated with your latest account notifications.
                    </p>
                </div>

                {user.notifications.length > 0 ? (
                    <div className="space-y-6">
                        {notifications.map((n: any, index: number) => (
                            <motion.div
                                key={n.id}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.35,
                                    delay: index * 0.06,
                                }}
                            >
                                <div
                                    className={`flex hover:scale-102 items-center gap-5 rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:shadow-lg ${n.is_read
                                        ? "bg-white border-slate-200"
                                        : "bg-blue-50 border-blue-200 border-l-4 border-l-blue-600"
                                        }`}
                                >
                                    <div className="flex md:p-4 p-2 items-center justify-center rounded-md md:rounded-xl bg-blue-100">
                                        <BellRing className="size-4 md:size-6 text-blue-600" />
                                    </div>

                                    <div className="flex-1">
                                        <p className="font-medium text-xs md:text-base text-slate-800">
                                            {n.message}
                                        </p>

                                        <p className="mt-2 text-xs md:text-sm text-slate-500">
                                            {format(new Date(n.created_at), "dd MMM yyyy")}
                                        </p>
                                    </div>

                                    <div className="flex items-center">
                                        {n.is_read ? (
                                            <div className="flex items-center gap-2 text-green-600">
                                                <CheckCircle2 className="size-5 md:size-6" />
                                                <span className="hidden md:block text-sm font-medium">
                                                    Read
                                                </span>
                                            </div>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="cursor-pointer hover:bg-blue-600 hover:text-white"
                                                onClick={() => handleNotification(n.id)}
                                            >
                                                Mark as Read
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed bg-slate-50 py-12 text-center">
                        <BellRing className="mx-auto mb-3 size-10 text-slate-400" />
                        <p className="text-slate-500">
                            No recent notifications.
                        </p>
                    </div>
                )}
            </motion.section>

            {/* Security */}
            <motion.section
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-16"
            >
                <div className="flex flex-col gap-3 mb-6">

                    <h2 className="text-xl md:text-2xl font-bold">Account Security</h2>
                    <p className="text-sm text-muted-foreground">
                        Keep your account protected and manage your security settings.
                    </p>
                </div>
                <div className="rounded-2xl border bg-linear-to-r from-white via-slate-50 to-red-50 p-6 shadow-sm transition-all duration-300 hover:shadow-xl">

                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                        <div className="flex items-start gap-5">

                            <div className="flex md:p-4 p-2 items-center justify-center rounded-md md:rounded-xl bg-red-100">
                                <ShieldCheck className="size-5 md:size-7 text-red-600" />
                            </div>

                            <div>
                                <h3 className="text-base md:text-lg font-semibold">
                                    Manage your account security
                                </h3>

                                <p className="hidden md:block mt-2 max-w-xl text-sm text-slate-600">
                                    Update your password, manage sign-in methods, review
                                    account access, and permanently delete your account
                                    whenever needed.
                                </p>

                                <p className="md:hidden mt-2 max-w-xl text-xs text-slate-600">
                                    Only on desktop version you can manage your account security settings. Please visit the website on a desktop device to access these features.
                                </p>
                            </div>

                        </div>

                        <Button
                            asChild
                            className="cursor-pointer text-base rounded-lg font-semibold border bg-transparent border-red-600 hover:bg-red-700 px-6 py-2 text-red-600 hover:text-white transition-all duration-300 hidden md:flex"
                        >
                            <Link href="/profile/security">
                                Open Security
                            </Link>
                        </Button>

                    </div>

                </div>
            </motion.section>
        </div >
    )
};