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
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import { Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export default function NavbarClient({ isAdmin }: { isAdmin: boolean }) {
    const navLinksLP = [
        { name: "Home", href: "/" },
        { name: "Onboarding", href: "/onboarding" },
        { name: "Contact", href: "/contact" },
    ];

    const navLinksAuth = [
        { name: "Home", href: "/" },
        { name: "Dashboard", href: "/dashboard" },
        { name: "Onboarding", href: "/onboarding" },
        { name: "Contact", href: "/contact" },
    ];

    const router = useRouter();
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<{ name?: string; email?: string; image?: string } | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

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
        sessionStorage.removeItem("show-login-toast");
        setSheetOpen(false);
        toast.success("Logged out successfully.", { duration: 1500 });
    };

    return (
        <nav className="fixed top-4 left-1/2 z-50 w-[calc(100%-24px)] max-w-7xl -translate-x-1/2"
            style={montserrat.style}
        >
            <div className="rounded-3xl shadow-lg shadow-black/50 bg-linear-to-r from-[#0a5e6b]/70 backdrop-blur-sm via-[#073338]/90 to-[#000000]/90">

                <div className="mx-auto flex items-center justify-between gap-3 px-3 py-2.5 md:px-4">

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="
                                h-10 w-10
                                rounded-full
                                text-white/80
                                hover:bg-white/10
                                hover:text-white
                            "
                                >
                                    <Menu className="size-5" />
                                </Button>
                            </SheetTrigger>

                            <SheetContent
                                side="left"
                                className="
                            w-75
                            border-white/10
                            bg-[#06101d]
                            p-0
                            text-white
                        "
                            >
                                <SheetHeader className="border-b border-white/10 p-6">
                                    <SheetTitle className="flex items-center gap-3 text-white">
                                        <Image
                                            src="/logo.png"
                                            alt="Schemae Logo"
                                            width={40}
                                            height={40}
                                            className="rounded-full"
                                        />
                                        Schemae
                                    </SheetTitle>
                                </SheetHeader>

                                {/* User */}
                                {isLoggedIn && (
                                    <div className="flex items-center gap-4 border-b border-white/10 px-6 py-5">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage
                                                src={user?.image || "/avatar.png"}
                                            />
                                            <AvatarFallback className="bg-white/10 text-white">
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div>
                                            <p className="font-semibold text-white">
                                                {user?.name}
                                            </p>

                                            <p className="text-sm text-white/50">
                                                Welcome back
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Mobile Links */}
                                <div className="flex flex-col py-4">

                                    {isLoggedIn ? (
                                        <>
                                            {isAdmin && (
                                                <Link
                                                    href="/admin"
                                                    onClick={() => setSheetOpen(false)}
                                                    className={`
                                                mx-3 rounded-xl px-4 py-3
                                                transition
                                                ${pathname === "/admin"
                                                            ? "bg-yellow-400 text-slate-950 font-semibold"
                                                            : "text-white/75 hover:bg-white/6 hover:text-white"
                                                        }
                                            `}
                                                >
                                                    Admin
                                                </Link>
                                            )}

                                            {navLinksAuth.map((link) => (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    onClick={() => setSheetOpen(false)}
                                                    className={`
                                                mx-3 rounded-xl px-4 py-3
                                                transition
                                                ${pathname === link.href
                                                            ? "bg-white/30 text-white font-semibold"
                                                            : "text-white/75 hover:bg-white/6 hover:text-white"
                                                        }
                                            `}
                                                >
                                                    {link.name}
                                                </Link>
                                            ))}

                                            <Link
                                                href="/profile"
                                                onClick={() => setSheetOpen(false)}
                                                className="
                                            mx-3 rounded-xl px-4 py-3
                                            text-white/75
                                            transition
                                            hover:bg-white/6
                                            hover:text-white
                                        "
                                            >
                                                Profile
                                            </Link>

                                            <button
                                                onClick={handleLogout}
                                                className="
                                            mx-3 rounded-xl px-4 py-3
                                            text-left text-red-400
                                            transition
                                            hover:bg-red-500/10
                                        "
                                            >
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {navLinksLP.map((link) => (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    onClick={() => setSheetOpen(false)}
                                                    className={`
                                                mx-3 rounded-xl px-4 py-3
                                                transition
                                                ${pathname === link.href
                                                            ? "bg-white/15 border border-white/30 text-white font-semibold"
                                                            : "text-white/75 hover:bg-white/6 hover:text-white"
                                                        }
                                            `}
                                                >
                                                    {link.name}
                                                </Link>
                                            ))}

                                            <div className="mt-6 flex flex-col gap-3 px-6">
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    onClick={() => setSheetOpen(false)}
                                                    className="
                                                bg-white/15
                                                text-white
                                                border border-white/30
                                                hover:bg-white/20
                                                hover:text-white
                                            "
                                                >
                                                    <Link href="/signin">
                                                        Sign In
                                                    </Link>
                                                </Button>

                                                <Button
                                                    asChild
                                                    onClick={() => setSheetOpen(false)}
                                                    className="
                                                bg-white/20
                                                text-white
                                                border border-white/30
                                                hover:bg-white/30
                                                hover:text-white
                                            "
                                                >
                                                    <Link href="/signup">
                                                        Sign Up
                                                    </Link>
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Logo */}
                    <Link
                        href="/"
                        className="
                    flex shrink-0 items-center
                    text-lg
                    font-semibold
                    tracking-widest
                    text-white
                "
                    >
                        <Image
                            src="/logo.png"
                            alt="schemae Logo"
                            width={36}
                            height={36}
                            loading="eager"
                            fill={false}
                            className="rounded-full bg-red-100 object-contain object-center mr-6"
                        />

                        <span className="hidden sm:block">
                            Schemae
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    {isLoggedIn ? (
                        <div className="hidden md:flex items-center gap-3 tracking-wide">

                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className={`
                                rounded-full px-4 py-2
                                text-sm font-medium
                                transition-all duration-200
                                ${pathname === "/admin"
                                            ? "bg-white/60 text-white font-semibold"
                                            : "text-white/70 hover:bg-white/6 hover:text-white"
                                        }
                            `}
                                >
                                    Admin
                                </Link>
                            )}

                            {navLinksAuth.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`
                                rounded-full px-4 py-2
                                text-sm font-medium
                                transition-all duration-200
                                ${pathname === link.href
                                            ? "border border-white/30 bg-white/20 text-white"
                                            : "text-white/70 hover:bg-white/6 hover:text-white"
                                        }
                            `}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-3">

                            {navLinksLP.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`
                                rounded-full px-4 py-2
                                text-sm font-medium
                                transition-all duration-200 text-white
                                ${pathname === link.href
                                            ? "border border-white/30 bg-white/20 text-white"
                                            : "text-white/70 hover:bg-white/6 hover:text-white"
                                        }
                            `}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Right Side */}
                    <div className="hidden md:flex items-center gap-2">

                        {isLoggedIn ? (
                            <DropdownMenu
                                open={menuOpen}
                                onOpenChange={setMenuOpen}
                            >
                                <DropdownMenuTrigger asChild>
                                    <button
                                        className="
                                    flex items-center gap-2.5
                                    rounded-full
                                    px-4
                                    transition
                                    cursor-pointer
                                    outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0
                                "
                                    >
                                        <span className="text-sm font-medium tracking-wide text-white">
                                            {user?.name || "My Account"}
                                        </span>

                                        <Avatar className="h-9 w-9 border border-white/10">
                                            <AvatarImage
                                                className="object-cover object-center"
                                                src={user?.image || "/avatar.png"}
                                                alt="@user"
                                            />

                                            <AvatarFallback className="bg-white/10 text-white">
                                                {user?.name
                                                    ? user.name.charAt(0).toUpperCase()
                                                    : "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent
                                    className="
                                w-52
                                border-white/10
                                bg-[#071525]
                                text-white
                                shadow-xl
                                tracking-wide
                            "
                                    align="end"
                                >
                                    <DropdownMenuLabel className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage
                                                src={user?.image || "/avatars/user.png"}
                                                className="object-cover object-center"
                                                alt="@user"
                                            />

                                            <AvatarFallback className="bg-white/10 text-white">
                                                {user?.name
                                                    ? user.name.charAt(0).toUpperCase()
                                                    : "U"}
                                            </AvatarFallback>
                                        </Avatar>

                                        <span className="font-medium">
                                            {user?.name || "My Account"}
                                        </span>
                                    </DropdownMenuLabel>

                                    <DropdownMenuSeparator className="bg-white/10" />

                                    <DropdownMenuGroup>
                                        <DropdownMenuItem
                                            onClick={() => setMenuOpen(false)}
                                            className="cursor-pointer focus:bg-white/10 focus:text-white"
                                        >
                                            <Link
                                                href="/dashboard"
                                                className="flex w-full items-center gap-4"
                                            >
                                                <LayoutDashboard className="h-4 w-4" />
                                                Dashboard
                                            </Link>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            onClick={() => setMenuOpen(false)}
                                            className="cursor-pointer focus:bg-white/10 focus:text-white"
                                        >
                                            <Link
                                                href="/profile"
                                                className="flex w-full items-center gap-4"
                                            >
                                                <User className="h-4 w-4" />
                                                Profile
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>

                                    <DropdownMenuSeparator className="bg-white/10" />

                                    <DropdownMenuItem
                                        onClick={() => {
                                            handleLogout();
                                            setMenuOpen(false);
                                        }}
                                        className="
                                    cursor-pointer
                                    text-red-400
                                    focus:bg-red-500/10
                                    focus:text-red-400
                                "
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Button
                                    asChild
                                    variant="ghost"
                                    className={`
                                rounded-full
                                text-white
                                hover:bg-white/[0.07]
                                hover:text-white
                                bg-white/20
                                border border-white/30
                            ${pathname === "/signup"
                                            ? "bg-transparent text-white/70 border-0 font-semibold"
                                            : ""
                                        }
                                `
                                    }
                                >
                                    <Link href="/signin">
                                        Sign In
                                    </Link>
                                </Button>

                                <Button
                                    asChild
                                    className={`${pathname === "/signup"
                                        ? "border border-white/30 bg-white/20 text-white font-semibold"
                                        : ""
                                        }
                                rounded-full
                                px-5
                                font-semibold
                                bg-transparent
                                text-white/80
                                hover:bg-white/10
                                hover:text-white
                            `}
                                >
                                    <Link href="/signup">
                                        Sign Up
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
