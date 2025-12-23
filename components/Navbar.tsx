"use client";

import { authClient } from "@/app/lib/auth-client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";

export default function Navbar() {
    const navLinksLP = [
        { name: "About", href: "#about" },
        { name: "Features", href: "#features" },
        { name: "Courses", href: "#courses" },
        {name :"Onboarding", href:"/onboarding" }
    ];

    const navLinksAuth = [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Onboarding", href: "/onboarding" },
    ];

    const router = useRouter();
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<{ name?: string; email?: string; image?: string } | null>(null);

    // Fetch session using Better Auth
    useEffect(() => {
        const fetchSession = async () => {
            try {
                const { data, error } = await authClient.getSession();
                if (error) console.error("Session fetch error:", error);
                else if (data?.session) {
                    setIsLoggedIn(true);
                    setUser({ name: data.user.name, email: data.user.email, image: data.user.image?.toString() });
                } else setIsLoggedIn(false);
            } catch (err) {
                console.error("Session error:", err);
            }
        };

        fetchSession();
    }, [pathname]);

    const handleLogout = async () => {
        await authClient.signOut();
        router.push("/");
        setIsLoggedIn(false);
        toast.success("Logged out successfully.", { autoClose: 1500, });

    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white backdrop-blur-md shadow-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-4 text-2xl font-bold text-[#004ba0]">
                    <Image
                        src="/logo.jpg"
                        alt="PrepMate Logo"
                        width={32}
                        height={32}
                        className=" object-cover rounded-full"
                    />
                    PrepMate
                </Link>


                {/* Nav Links */}
                {pathname === "/" ? (
                    <div className="hidden md:flex space-x-8 font-medium">
                        {navLinksLP.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`hover:text-blue-600 transition ${pathname === link.href ? "text-blue-600" : "text-gray-700"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="hidden md:flex space-x-8 font-medium">
                        {navLinksAuth.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`hover:text-blue-600 transition ${pathname === link.href ? "text-blue-600" : "text-gray-700"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Auth Buttons / User Menu */}
                <div className="flex items-center space-x-4">
                    {isLoggedIn ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center gap-3 cursor-pointer">
                                    <div className=" flex flex-col justify-between">
                                        <span className="hidden sm:block text-sm font-medium text-gray-700">
                                            Welcome
                                        </span>
                                        <span className="hidden sm:block text-sm font-semibold text-gray-700">
                                            {user?.name || "User"}
                                        </span>
                                    </div>
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage className="object-cover object-center" src={user?.image || "/avatar.png"} alt="@user" />
                                        <AvatarFallback>
                                            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-48" align="end">
                                <DropdownMenuLabel className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={user?.image || "/avatars/user.png"} className= " object-cover object-center " alt="@user" />
                                        <AvatarFallback>
                                            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{user?.name || "My Account"}</span>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        Dashboard
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push("/profile")}>
                                        <User className="mr-2 h-4 w-4" />
                                        Profile
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="text-red-600 focus:text-red-600"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Button asChild variant={'outline'}>
                                <Link href="/signin">Sign In</Link>
                            </Button>
                            <Button asChild variant={'default'}>
                                <Link href="/signup">Sign Up</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
