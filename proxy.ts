import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    const maintenance = process.env.MAINTENANCE_MODE === "true";

    const { pathname } = request.nextUrl;

    // Allow the maintenance page itself
    if (pathname === "/maintenance") {
        return NextResponse.next();
    }

    // Allow Next.js internals and static assets
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname === "/favicon.ico" ||
        pathname.startsWith("/images") ||
        pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|txt|xml)$/)
    ) {
        return NextResponse.next();
    }

    // Redirect everyone to the maintenance page
    if (maintenance) {
        return NextResponse.redirect(new URL("/maintenance", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};