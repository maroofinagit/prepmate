
import { redirect } from "next/navigation";
import { db } from "../lib/db";
import Image from "next/image";
import { format } from "date-fns";
import { auth } from "../lib/auth";
import { headers } from "next/headers";
import ProfileImageUploader from "@/components/ProfilePicUpdater";
import { IoIosNotifications } from "react-icons/io";

export default async function ProfilePage() {

    const data = await auth.api.getSession({
        headers: await headers(),
    });

    if (!data?.session) {
        redirect("/signin");
    }

    const session = data.session;

    const user = await db.user.findUnique({
        where: { id: session.userId },
        include: {
            exams: {
                include: {
                    exam: true,
                },
            },
            notifications: {
                orderBy: { created_at: "desc" },
                take: 5,
            },
        },
    });

    if (!user) {
        return <div className="text-center mt-20 text-gray-500">User not found.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-6 mt-20">
            {/* Header */}
            <div className="flex items-center gap-6">
                <ProfileImageUploader initialImage={user.image ?? ""} />
                <div>
                    <h1 className="text-2xl font-semibold">{user.name || "Unnamed User"}</h1>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500">
                        Joined on {format(new Date(user.createdAt), "dd MMM yyyy")}
                    </p>
                </div>
            </div>

            {user.role?.toLowerCase() === "admin" && (
                <div className="mt-6">
                    <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-medium">
                        {user.role.toUpperCase()}
                    </span>
                </div>
            )}

            {/* Exams */}
            <section className="mt-10">
                <h2 className="text-xl font-semibold mb-3">Your Exams</h2>
                {user.exams.length > 0 ? (
                    <div className="space-y-3">
                        {user.exams.map((ue: any) => (
                            <div
                                key={ue.id}
                                className="border rounded-lg p-4 hover:shadow-sm transition"
                            >
                                <h3 className="font-medium text-lg">{ue.exam.name}</h3>
                                <p className="text-sm text-gray-600">{ue.exam.description}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Progress: {ue.progress_percent?.toFixed(1) || 0}%
                                </p>
                                <p className="text-sm text-gray-400">
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
                <h2 className="text-xl font-semibold mb-3">Recent Notifications</h2>
                {user.notifications.length > 0 ? (
                    <ul className="space-y-2">
                        {user.notifications.map((n: any) => (
                            <li key={n.id} className="border p-3 flex gap-2 rounded-lg text-sm md:text-base items-center">
                                <IoIosNotifications color="#0039b7" size={32} />
                                <div>
                                    <p>{n.message}</p>
                                    <span className="text-xs text-gray-500">
                                        {format(new Date(n.created_at), "dd MMM yyyy")}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No recent notifications.</p>
                )}
            </section>
        </div>
    );
}
