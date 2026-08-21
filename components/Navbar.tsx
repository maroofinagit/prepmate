// Navbar.tsx (Server Component)
import { isAdmin } from "@/app/lib/isAdmin";
import NavbarClient from "./NavbarClient";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { countUnreadNotifications } from "@/app/actions/action";

export default async function Navbar() {
    const admin = await isAdmin(); // uses headers()
    const data = await auth.api.getSession({ headers: await headers() });

    if (!data?.session) {
        return <NavbarClient isAdmin={false} notifications={0} />;
    }
    

    const notfications = await countUnreadNotifications(data.user.id);


    return <NavbarClient isAdmin={admin} notifications={notfications} />;
}