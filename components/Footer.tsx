import Image from "next/image";
import Link from "next/link";
import { FaXTwitter, FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa6";


export default function Footer() {
    return (
        <footer className="bg-[#00203d] px-10 text-gray-300 mt-16 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-center">

                    {/* Logo + Tagline */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Image
                                src="/logo.jpg"
                                alt="PrepMate"
                                width={36}
                                height={36}
                                className="opacity-90 rounded-full"
                            />
                            <span className="text-xl font-semibold text-white">
                                PrepMate
                            </span>
                        </div>

                        <p className="text-gray-400 text-sm text-left leading-relaxed max-w-xs">
                            Smart roadmaps, structured learning, and intelligent tools your companion for every exam journey.
                        </p>

                        {/* Social Icons */}
                        <div className="flex gap-4 mt-5">
                            <Link href="#" className="hover:text-white transition">
                                <FaXTwitter size={20} />

                            </Link>
                            <Link href="#" className="hover:text-white transition">
                                <FaInstagram size={20} />
                            </Link>
                            <Link href="#" className="hover:text-white transition">
                                <FaLinkedin size={20} />
                            </Link>
                            <Link href="#" className="hover:text-white transition">
                                <FaFacebook size={20} />
                            </Link>
                        </div>
                    </div>

                    {/* Product Column */}
                    <div>
                        <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">
                            Product
                        </h4>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li className="hover:text-white transition cursor-pointer">Roadmaps</li>
                            <li className="hover:text-white transition cursor-pointer">Weekly Tests</li>
                            <li className="hover:text-white transition cursor-pointer">Smart Analytics</li>
                            <li className="hover:text-white transition cursor-pointer">Syllabus Tracker</li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">
                            Company
                        </h4>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li className="hover:text-white transition cursor-pointer">About</li>
                            <li className="hover:text-white transition cursor-pointer">Contact</li>
                            <li className="hover:text-white transition cursor-pointer">Careers</li>
                            <li className="hover:text-white transition cursor-pointer">Blog</li>
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div>
                        <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">
                            Legal
                        </h4>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li className="hover:text-white transition cursor-pointer">Privacy Policy</li>
                            <li className="hover:text-white transition cursor-pointer">Terms of Service</li>
                            <li className="hover:text-white transition cursor-pointer">Cookie Policy</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom line */}
                <div className="border-t border-gray-600 mt-10 pt-6 text-center text-gray-300 text-sm">
                    © {new Date().getFullYear()} PrepMate — All rights reserved.
                </div>
            </div>
        </footer>
    );
}
