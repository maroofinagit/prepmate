"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function UserDetailClient({ user }: any) {
    const router = useRouter();

    const totalExams = user.exams.length;

    const roadmapGenerated = user.exams.filter(
        (e: any) => e.roadmap !== null
    ).length;

    const roadmapCompleted = user.exams.filter(
        (e: any) => e.roadmap_status === "completed"
    ).length;

    const avgProgress = Math.round(
        user.exams.reduce(
            (acc: number, e: any) => acc + (e.progress_percent || 0),
            0
        ) / (totalExams || 1)
    );


    return (
        <div className="p-6 bg-gray-50 min-h-screen pt-32 md:px-12 px-6">

            {/* 👤 PROFILE HEADER */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6 flex items-center gap-6">

                {/* 🖼️ IMAGE */}
                <img
                    src={user.image || "/avatar.png"}
                    alt="user"
                    className="w-20 h-20 rounded-full object-cover border"
                />

                {/* 🧾 INFO */}
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">
                        {user.name || "No Name"}
                    </h1>

                    <p className="text-gray-500">{user.email}</p>

                    <div className="flex gap-3 mt-3 flex-wrap">

                        {/* ROLE */}
                        <span
                            className={`px-3 py-1 text-xs rounded-full font-medium ${user.role === "admin"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-gray-100 text-gray-700"
                                }`}
                        >
                            {user.role}
                        </span>

                        {/* VERIFIED */}
                        <span
                            className={`px-3 py-1 text-xs rounded-full ${user.emailVerified
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                                }`}
                        >
                            {user.emailVerified ? "Verified" : "Not Verified"}
                        </span>

                        {/* CREATED DATE */}
                        <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                            Joined {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* 📊 STATS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">

                <StatCard title="Total Exams" value={totalExams} />
                <StatCard title="Roadmaps Generated" value={roadmapGenerated} />
                <StatCard title="Roadmaps Completed" value={roadmapCompleted} />
                <StatCard title="Avg Progress" value={`${avgProgress}%`} />

            </div>

            {/* 📘 EXAMS */}
            <div className="bg-white rounded-xl shadow-sm border">

                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="font-semibold text-lg">Exam Journey</h2>
                    <span className="text-sm text-gray-500">
                        {totalExams} enrolled
                    </span>
                </div>

                <div className="divide-y">
                    {user.exams.map((exam: any) => (
                        <div key={exam.id} className="p-5">

                            {/* 🧠 TOP ROW */}
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-base">
                                    {exam.exam.name}
                                </h3>

                                <span
                                    className={`px-2 py-1 text-xs rounded-full ${!exam.roadmap
                                            ? "bg-gray-100 text-gray-600"
                                            : exam.roadmap_status === "completed"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >
                                    {!exam.roadmap
                                        ? "No Roadmap"
                                        : exam.roadmap_status === "completed"
                                            ? "Completed"
                                            : "In Progress"}
                                </span>
                            </div>

                            {/* 📅 DATES */}
                            <p className="text-sm text-gray-500 mt-1">
                                {new Date(exam.start_date).toLocaleDateString()} →{" "}
                                {new Date(exam.end_date).toLocaleDateString()}
                            </p>

                            {/* 🎯 PROGRESS BAR */}
                            <div className="mt-3">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-black h-2 rounded-full"
                                        style={{
                                            width: `${exam.progress_percent || 0}%`,
                                        }}
                                    />
                                </div>

                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>{exam.progress_percent || 0}% completed</span>
                                    <span>
                                        Stage: {exam.current_stage || "N/A"}
                                    </span>
                                </div>
                            </div>

                            {/* 🧩 EXTRA DETAILS */}
                            <div className="mt-3 flex gap-4 flex-wrap text-xs text-gray-600">
                                <span>
                                    📍 Roadmap: {exam.roadmap ? "Generated" : "Not Generated"}
                                </span>

                                <span>
                                    📆 Created:{" "}
                                    {new Date(exam.created_at).toLocaleDateString()}
                                </span>
                            </div>

                        </div>
                    ))}
                </div>
            </div>

            {/* 🔙 BACK BUTTON */}
            <div className="mt-6">
                <Button variant="outline" className="hover:bg-black hover:text-white cursor-pointer" onClick={() => router.push("/admin")}>
                    Back to Dashboard
                </Button>
            </div>

        </div>
    );
}

/* 🧩 REUSABLE STAT CARD */
function StatCard({ title, value }: any) {
    return (
        <div className="bg-white p-5 rounded-xl border shadow-sm">
            <p className="text-gray-500 text-sm">{title}</p>
            <h2 className="text-xl font-bold mt-2">{value}</h2>
        </div>
    );
}