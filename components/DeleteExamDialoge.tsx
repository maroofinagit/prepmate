"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export function DeleteExamDialog({
    selectedId,
    exam,
    setSelectedExam,
}: {
    selectedId: number | null;
    exam: any;
    setSelectedExam: (val: any) => void;
}) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!selectedId) return;

        try {
            setLoading(true);

            const res = await fetch(`/api/deleteUserExam`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_exam_id: selectedId }),
            });

            if (!res.ok) {
                toast.error("Failed to delete exam. Please try again later.");
                return;
            }

            toast.success("Exam deleted successfully.");

            setSelectedExam(null); // closes dialog
            router.refresh();
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={!!selectedId} onOpenChange={() => setSelectedExam(null)}>
            <DialogContent
                className="sm:max-w-md"
                onInteractOutside={(e) => {
                    if (loading) e.preventDefault();
                }}
            >
                <DialogHeader>
                    <DialogTitle className="text-red-600">
                        Delete Exam?
                    </DialogTitle>

                    <DialogDescription>
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-black">
                            {exam?.exam?.name ?? "this exam"}
                        </span>
                        ? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-600">
                    ⚠️ Your progress and associated data will be permanently removed.
                </div>

                <DialogFooter className="mt-4">
                    <DialogClose asChild>
                        <button
                            disabled={loading}
                            className="px-4 py-2 rounded-md border cursor-pointer border-gray-300 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </DialogClose>

                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-red-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-red-700 disabled:opacity-50"
                    >
                        {loading ? "Deleting..." : "Delete Exam"}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}