import type { MetadataRoute } from "next";

const BASE_URL = 'https://schemae.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: BASE_URL,
            lastModified: new Date(2026, 8, 13),
            changeFrequency: "monthly",
            priority: 1,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: new Date(2026, 8, 13),
            changeFrequency: "yearly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/legal`,
            lastModified: new Date(2026, 8, 13),
            changeFrequency: "yearly",
            priority: 0.3,
        },
    ];
}