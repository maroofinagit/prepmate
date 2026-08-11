import { getCachedTests } from "@/app/actions/test";
import { auth } from "@/app/lib/auth";
import TestsClient from "@/components/TestsClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// export const revalidate = 0; // Disable caching for this page

export default async function TestPage({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;
    if (!id) {
        return (
            <div className="text-center text-gray-600 flex justify-center items-center h-screen">
                Invalid User Exam ID.
            </div>
        );
    }

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.session) {
        redirect("/signin");
    }

    const { data } = await getCachedTests(parseInt(id), session.user.id);

    return (
        <TestsClient
            data={data ?? { weekly: [], phase: [], final: [] }}
            baseId={id}
        />
    );
}