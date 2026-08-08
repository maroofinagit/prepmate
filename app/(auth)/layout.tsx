// app/(auth)/layout.tsx

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";
import { UserProvider } from "@/app/context/userContext";
import { getCurrentUser } from "@/app/actions/action";

export default async function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const data = await auth.api.getSession({
        headers: await headers(),
    });

    if (!data?.session) {
        console.log("No session found. Redirecting to /signin");
        redirect("/signin");
    }

    const user = await getCurrentUser(data.session.userId);

    if (!user) {
        redirect("/signin");
    }

    return (
        <UserProvider user={user}>
            {children}
        </UserProvider>
    );
}