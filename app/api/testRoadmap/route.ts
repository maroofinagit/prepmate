// app/api/test-roadmap/route.ts

import { generateRoadmap } from "@/app/actions/roadmap";

export async function POST() {
    const result = await generateRoadmap(40);
    return Response.json(result);
}