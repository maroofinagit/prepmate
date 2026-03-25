
import { Montserrat } from "next/font/google";
import { reqAdmin } from "../lib/reqAdmin";


const montserrat = Montserrat({
    subsets: ["latin"],
});

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await reqAdmin(); // This will redirect if the user is not an admin  

    return (
        <div className={`${montserrat.className}`}>
            {/* MAIN */}
            <main>{children}</main>
        </div>
    );
}
