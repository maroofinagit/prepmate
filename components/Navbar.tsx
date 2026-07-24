// Navbar.tsx (Server Component)
import { isAdmin } from "@/app/lib/isAdmin";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
    const admin = await isAdmin(); // uses headers()

    return <NavbarClient isAdmin={admin} />;
}