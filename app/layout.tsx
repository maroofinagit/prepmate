import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
// @ts-ignore: Allow importing CSS globals without type declarations
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  metadataBase: new URL("https://schemae.vercel.app"),

  title: {
    default: "Schemae : AI-Powered Exam Preparation & Study Roadmaps",
    template: "%s | Schemae",
  },

  description:
    "Schemae is an AI-powered exam preparation platform that creates personalized study roadmaps, helps you track your progress, and keeps your preparation focused and organized.",

  keywords: [
    "schemae",
    "AI exam preparation",
    "exam preparation platform",
    "personalized study roadmap",
    "AI study planner",
    "exam study planner",
    "study roadmap",
    "exam preparation",
    "study planner",
    "progress tracking",
    "personalized learning",
    "student productivity",
    "competitive exam preparation",
  ],

  applicationName: "Schemae",

  authors: [
    {
      name: "Maroof Ali Syed",
      url: "https://schemae.vercel.app",
    },
  ],

  creator: "Maroof Ali Syed",
  publisher: "Schemae",

  category: "Education",

  alternates: {
    canonical: "https://schemae.vercel.app",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://schemae.vercel.app",
    siteName: "Schemae : AI-Powered Exam Preparation",

    title: "Schemae : AI-Powered Exam Preparation & Study Roadmaps",

    description:
      "Build a smarter study plan with Schemae. Get personalized exam roadmaps, track your preparation, and stay focused from day one to exam day.",

    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Schemae : AI-Powered Exam Preparation",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Schemae : AI-Powered Exam Preparation",

    description:
      "Personalized exam roadmaps, progress tracking, and smarter study planning — all in one place with Schemae.",

    creator: "@schemae",

    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Schemae : AI-Powered Exam Preparation",
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

const BASE_URL = "https://schemae.vercel.app";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${BASE_URL}`,
      name: "Schemae",
      url: BASE_URL,
      description:
        "Schemae helps students prepare for competitive exams with structured study plans, personalized roadmaps, and curated learning resources.",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      publisher: {
        "@id": `${BASE_URL}`,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}`,
      name: "Schemae",
      url: BASE_URL,
      publisher: {
        "@id": `${BASE_URL}`,
      },
    },
  ],
};



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={` ${montserrat.variable} antialiased`}
      >
        <Toaster position="top-right" richColors />
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>        {children}
        <Footer />
      </body>
    </html>
  );
}
