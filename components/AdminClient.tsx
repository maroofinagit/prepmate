"use client";

import Link from "next/link";

export default function AdminClient({ data }: any) {
    return (
        <div className="p-6 bg-gray-50 min-h-screen pt-32 md:px-12 px-6">

            {/* 🔥 HEADER */}
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            {/* 📊 STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                <div className="bg-white shadow-sm rounded-xl p-5 border">
                    <p className="text-gray-500 text-sm">Total Users</p>
                    <h2 className="text-2xl font-bold mt-2">
                        {data.totalUsers}
                    </h2>
                </div>

                <div className="bg-white shadow-sm rounded-xl p-5 border">
                    <p className="text-gray-500 text-sm">Total Exams</p>
                    <h2 className="text-2xl font-bold mt-2">
                        {data.users.reduce((acc: number, u: any) => acc + u.exams.length, 0)}
                    </h2>
                </div>

                <div className="bg-white shadow-sm rounded-xl p-5 border">
                    <p className="text-gray-500 text-sm">Completed Roadmaps</p>
                    <h2 className="text-2xl font-bold mt-2">
                        {
                            data.users.flatMap((u: any) => u.exams)
                                .filter((e: any) => e.roadmap_status === "completed").length
                        }
                    </h2>
                </div>
            </div>

            {/* 📋 USERS TABLE */}
            <div className="bg-white shadow-sm rounded-xl border overflow-hidden">

                <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Users & Exams</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">

                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="p-3">User</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Exam</th>
                                <th className="p-3">Progress</th>
                                <th className="p-3">Roadmap</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.users.map((user: any) =>
                                user.exams.length > 0 ? (
                                    user.exams.map((exam: any, idx: number) => (
                                        <tr
                                            key={exam.id}
                                            className="border-t hover:bg-gray-50 transition"
                                        >
                                            {idx === 0 && (
                                                <>
                                                    <td
                                                        rowSpan={user.exams.length}
                                                        className="p-3 font-medium align-top"
                                                    >
                                                        {user.name || "No Name"}
                                                    </td>
                                                    <td
                                                        rowSpan={user.exams.length}
                                                        className="p-3 underline text-gray-600 align-top"
                                                    >
                                                        <Link href={`/admin/users/${user.id}`}>
                                                            {user.email}
                                                        </Link>
                                                    </td>
                                                </>
                                            )}

                                            <td className="p-3">{exam.exam.name}</td>

                                            {/* 🎯 PROGRESS */}
                                            <td className="p-3 w-40">
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-black h-2 rounded-full"
                                                        style={{
                                                            width: `${exam.progress_percent || 0}%`,
                                                        }}
                                                    />
                                                </div>
                                                <p className="text-xs mt-1 text-gray-500">
                                                    {exam.progress_percent || 0}%
                                                </p>
                                            </td>

                                            {/* 🟢 STATUS */}
                                            <td className="p-3">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${exam.roadmap_status === "completed"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                        }`}
                                                >
                                                    {exam.roadmap_status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr key={user.id} className="border-t">
                                        <td className="p-3 font-medium">
                                            {user.name || "No Name"}
                                        </td>
                                        <td className="p-3 text-gray-600">
                                            {user.email}
                                        </td>
                                        <td colSpan={3} className="p-3 text-gray-400">
                                            No exams enrolled
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    );
}