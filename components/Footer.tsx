import Image from "next/image";
import Link from "next/link";
import { FaXTwitter, FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa6";

export default function Footer() {

    const currentYear = 2026; // You can dynamically get the current year if needed

    const socialLinks = [
        { href: "https://x.com/maroofalysyed", icon: FaXTwitter },
        { href: "https://instagram.com/maroofalysyed", icon: FaInstagram },
        { href: "https://linkedin.com/in/maroofalysyed", icon: FaLinkedin },
        { href: "https://facebook.com/maroofalysyed", icon: FaFacebook },
    ];

    return (
        <footer className="bg-[#00203d] border-t border-slate-800 text-slate-300">
            <div className="max-w-7xl mx-auto px-6 py-12">

                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

                    {/* Brand */}
                    <div className="md:col-span-5 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <Image
                                src="/logo.jpg"
                                alt="PrepMate"
                                width={42}
                                height={42}
                                className="rounded-full"
                            />

                            <h2 className="text-2xl font-bold text-white">
                                PrepMate
                            </h2>
                        </div>

                        <p className="mt-4 text-slate-400 max-w-sm mx-auto md:mx-0 leading-7">
                            Smart roadmaps, structured learning, and AI-powered tools built to
                            make exam preparation simpler and more effective.
                        </p>

                        <div className="flex justify-center md:justify-start gap-3 mt-6">
                            {socialLinks.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-10 w-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition"
                                >
                                    <link.icon size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div className="md:col-span-7">

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-left">

                            <div>
                                <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-xs">
                                    Features
                                </h4>

                                <ul className="space-y-3 text-sm">
                                    <li><Link href="/dashboard">Roadmaps</Link></li>
                                    <li><Link href="/dashboard">Weekly Tests</Link></li>
                                    <li><Link href="/dashboard">Analytics</Link></li>
                                    <li><Link href="/dashboard">Tracker</Link></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-xs">
                                    Company
                                </h4>

                                <ul className="space-y-3 text-sm">
                                    <li><Link href="#">About</Link></li>
                                    <li><Link href="#">Contact</Link></li>
                                    <li><Link href="#">Blog</Link></li>
                                    <li><Link href="#">Careers</Link></li>
                                </ul>
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-xs">
                                    Legal
                                </h4>

                                <ul className="space-y-3 text-sm">
                                    <li><Link href="#">Privacy Policy</Link></li>
                                    <li><Link href="#">Terms</Link></li>
                                    <li><Link href="#">Cookies</Link></li>
                                </ul>
                            </div>

                        </div>

                    </div>

                </div>

                <div className="mt-12 pt-6 border-t border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">

                    <p>
                        © {currentYear} PrepMate. All rights reserved.
                    </p>

                    <p>
                        Built with ❤️ for students.
                    </p>

                </div>

            </div>
        </footer>
    );
}