import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { db } from "./db";


export const auth = betterAuth({
    database: prismaAdapter(db, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: { enabled: true},
    socialProviders: {
        github: {
            prompt: "select_account consent",
            clientId: process.env.GITHUB_CLIENT_ID as string || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string || "",
        },
        google: {
            prompt: "select_account consent",
            clientId: process.env.GOOGLE_CLIENT_ID as string || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string || "",
        }
    },
    secret: process.env.BETTER_AUTH_SECRET || "",
});