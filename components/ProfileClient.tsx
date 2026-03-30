"use client";

import { format } from "date-fns";
import { useRouter } from "next/navigation";
import ProfileImageUploader from "@/components/ProfilePicUpdater";
import { IoIosNotifications } from "react-icons/io";
import { useState } from "react";
import { toast } from "react-toastify";
import { Delete } from "lucide-react";
import { DeleteAccountDialog } from "./DeleteAccountDialoge";

export default function ProfilePage({ user }: { user: any }) {

    const router = useRouter();

    if (!user) {
        return <div className="text-center mt-20 text-gray-500">User not found.</div>;
    }

    const [loading, setLoading] = useState(false);

    const handleDeleteAccount = async () => {
        
        toast.warning("Deleting your account is irreversible. Please confirm to proceed.",{
            
        });


        setLoading(true);
        try {
            await fetch("/api/delete-account" , {
                method: "DELETE",
            });
            toast.success("Account deleted successfully.");
            router.push("/");
        } catch (error) {
            console.error("Error deleting account:", error);
            toast.error("Failed to delete account. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-12 px-6 mt-16">
            {/* Profile Card */}
            <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 border">
                <ProfileImageUploader initialImage={user.image ?? ""} />

                <div className="text-center md:text-left">
                    <h1 className="text-2xl font-semibold">{user.name || "Unnamed User"}</h1>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500 mt-1">
                        Joined {format(new Date(user.createdAt), "dd MMM yyyy")}
                    </p>

                    {user.role?.toLowerCase() === "admin" && (
                        <span className="inline-block mt-2 bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
                            ADMIN
                        </span>
                    )}
                </div>
            </div>

            {/* Exams Section */}
            <section className="mt-10">
                <h2 className="text-xl font-semibold mb-4">Your Exams</h2>

                {user.exams.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                        {user.exams.map((ue: any) => (
                            <div
                                key={ue.id}
                                className="bg-white border rounded-xl p-5 hover:shadow-md transition"
                            >
                                <h3 className="font-semibold text-lg">{ue.exam.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {ue.exam.description}
                                </p>

                                {/* Progress Bar */}
                                <div className="mt-3">
                                    <div className="w-full bg-gray-200 h-2 rounded-full">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: `${ue.progress_percent || 0}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {ue.progress_percent?.toFixed(1) || 0}% completed
                                    </p>
                                </div>

                                <p className="text-xs text-gray-400 mt-3">
                                    {format(new Date(ue.start_date), "dd MMM yyyy")} →{" "}
                                    {format(new Date(ue.end_date), "dd MMM yyyy")}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No exams enrolled yet.</p>
                )}
            </section>

            {/* Notifications */}
            <section className="mt-10">
                <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>

                {user.notifications.length > 0 ? (
                    <div className="space-y-3">
                        {user.notifications.map((n: any) => (
                            <div
                                key={n.id}
                                className="flex items-center gap-3 bg-white border p-4 rounded-xl hover:shadow-sm"
                            >
                                <IoIosNotifications size={24} className="text-blue-600" />
                                <div>
                                    <p className="text-sm">{n.message}</p>
                                    <span className="text-xs text-gray-500">
                                        {format(new Date(n.created_at), "dd MMM yyyy")}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No recent notifications.</p>
                )}
            </section>

            {/* Danger Zone */}
            <section className="mt-16 border-t pt-8">
                <h2 className="text-lg font-semibold text-red-600 mb-3">Danger Zone</h2>

                <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <p className="font-medium text-red-700">Delete your account</p>
                        <p className="text-sm text-red-500">
                            This action is permanent and cannot be undone.
                        </p>
                    </div>

                    <DeleteAccountDialog />
                </div>
            </section >
        </div >
    );
}