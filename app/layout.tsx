import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// @ts-ignore: Allow importing CSS globals without type declarations
import "./globals.css";
import { ToastContainer } from "react-toastify";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PrepMate - Your Ultimate Exam Preparation Companion",
  description: "PrepMate helps you plan, track, and ace your exam preparation with personalized roadmaps and progress tracking.",
  keywords: ["prepmate", "prepmatex", "prepmate vercel", "prepmate maroof", "AI", "exam preparation", "study roadmap", "progress tracking", "personalized learning", "academic planner"],
  authors: [{ name: "Maroof Ali Syed", url: "https://prepmatex.vercel.app" }],
  applicationName: "PrepMate",
  openGraph: {
    title: "PrepMate - Your Ultimate Exam Preparation Companion",
    description: "PrepMate helps you plan, track, and ace your exam preparation with personalized roadmaps and progress tracking.",
    url: "https://prepmatex.vercel.app",
    siteName: "PrepMate",
    images: [
      {
        url: "https://prepmatex.vercel.app/logo.jpg",
        width: 1200,
        height: 630,
        alt: "PrepMate Open Graph Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PrepMate - Your Ultimate Exam Preparation Companion",
    description: "PrepMate helps you plan, track, and ace your exam preparation with personalized roadmaps and progress tracking.",
    creator: "@prepmatex",
    images: [
      {
        url: "https://prepmatex.vercel.app/logo.jpg",
        alt: "PrepMate Twitter Card Image",
      },
    ],
  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
     
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastContainer />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
