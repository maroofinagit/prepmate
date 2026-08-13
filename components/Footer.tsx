import Image from "next/image";
import Link from "next/link";
import { FaXTwitter, FaInstagram, FaLinkedin, FaFacebook, FaGithub } from "react-icons/fa6";

export default function Footer() {

    const currentYear = 2026; // You can dynamically get the current year if needed

    const socialLinks = [
        { href: "https://x.com/maroofalysyed", icon: FaXTwitter },
        { href: "https://instagram.com/maroofalysyed", icon: FaInstagram },
        { href: "https://linkedin.com/in/maroofalysyed", icon: FaLinkedin },
        { href: "https://facebook.com/maroofalysyed", icon: FaFacebook },
        { href: "https://github.com/maroofalysyed", icon: FaGithub },
    ];

    return (
        <footer className="bg-[#00203d] border-t border-slate-800 text-slate-300">
            <div className="max-w-7xl mx-auto px-8 py-16">

                <div className="grid lg:grid-cols-12 gap-14">

                    {/* ================= Brand ================= */}

                    <div className="lg:col-span-5">

                        <Link
                            href="/"
                            className="inline-flex items-center gap-3"
                        >
                            <Image
                                src="/logo.png"
                                alt="Schemae logo"
                                width={46}
                                height={46}
                                className="rounded-full shadow-md"
                            />

                            <div className="flex flex-col gap-1">

                                <h2 className="text-2xl md:text-3xl font-bold text-white">
                                    Schemae
                                </h2>

                                <p className="md:text-sm text-xs text-slate-400">
                                    Your AI-powered study companion.
                                </p>

                            </div>

                        </Link>

                        <p className="mt-6 max-w-md leading-relaxed md:leading-loose text-sm md:text-base text-slate-100">
                            Schemae helps students prepare smarter with structured
                            roadmaps, AI-generated practice exams, progress tracking,
                            analytics, and everything needed to stay consistent.
                        </p>

                        <div className="h-px bg-slate-500 my-8 w-full max-w-sm" />

                        <div className="flex flex-wrap gap-8 items-center justify-center md:justify-start">

                            {socialLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-11 w-11 rounded-xl bg-slate-600 hover:bg-blue-600 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center"
                                >
                                    <link.icon size={24} />
                                </Link>
                            ))}

                        </div>

                    </div>

                    {/* ================= Links ================= */}

                    <div className="lg:col-span-7">

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-10">

                            {/* Features */}

                            <div>

                                <h3 className="text-white font-semibold uppercase tracking-widest text-sm md:text-base mb-5">
                                    Features
                                </h3>

                                <ul className="space-y-3">

                                    {[
                                        ["Roadmaps", "/dashboard"],
                                        ["Weekly Tests", "/dashboard"],
                                        ["Analytics", "/dashboard"],
                                        ["Tracker", "/dashboard"],
                                    ].map(([title, href]) => (

                                        <li key={title}>

                                            <Link
                                                href={href}
                                                className="text-slate-400 text-xs md:text-base hover:text-white transition hover:translate-x-1 inline-block"
                                            >
                                                {title}
                                            </Link>

                                        </li>

                                    ))}

                                </ul>

                            </div>

                            {/* Company */}

                            <div>

                                <h3 className="text-white font-semibold uppercase tracking-widest text-sm md:text-base mb-5">
                                    Company
                                </h3>

                                <ul className="space-y-3">

                                    {[
                                        ["Home", "/"],
                                        ["Contact", "/contact"],
                                        ["Exams", "/onboarding"],
                                        ["Roadmap", "/dashboard"],
                                    ].map(([title, href]) => (

                                        <li key={title}>

                                            <Link
                                                href={href}
                                                className="text-slate-400 text-xs md:text-base hover:text-white transition hover:translate-x-1 inline-block"
                                            >
                                                {title}
                                            </Link>

                                        </li>

                                    ))}

                                </ul>

                            </div>

                            {/* Legal */}

                            <div className="col-span-2 md:col-span-1">

                                <h3 className="text-white font-semibold uppercase tracking-widest text-sm md:text-base mb-5">
                                    Legal
                                </h3>

                                <ul className="space-y-3">

                                    {[["Legal Docs", "/legal"],
                                    ["Privacy Policy", "/legal#privacy-policy"],
                                    ["Terms of Service", "/legal#terms-of-service"],
                                    ["Cookie Policy", "/legal#cookie-policy"],
                                    ].map(([title, href]) => (

                                        <li key={title}>

                                            <Link
                                                href={href}
                                                className="text-slate-400 text-xs md:text-base hover:text-white transition hover:translate-x-1 inline-block"
                                            >
                                                {title}
                                            </Link>

                                        </li>

                                    ))}

                                </ul>

                            </div>

                        </div>

                    </div>

                </div>

                {/* ================= Bottom ================= */}

                <div className="border-t border-slate-700 mt-12 pt-8">

                    <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-400">

                        <p className="text-center w-full">
                            © {currentYear} Schemae. All rights reserved.
                        </p>

                        <div className="flex items-center gap-2 text-center">
                            <span>Built with ❤️ for students.</span>
                        </div>

                    </div>

                </div>

            </div>
        </footer>
    );
}