import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { db } from "./db";
import { sendEmail } from "../actions/admin";


export const auth = betterAuth({
    database: prismaAdapter(db, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },
    emailVerification: {
        // Send verification email immediately after signup
        sendOnSignUp: true,

        // Send another verification email when
        // an existing unverified user tries to sign in
        sendOnSignIn: true,

        // Automatically sign the user in after
        // successful email verification
        autoSignInAfterVerification: true,

        // Verification link expires after 1 hour
        expiresIn: 60 * 60,

        sendVerificationEmail: async ({ user, url }) => {
            void sendEmail({
                to: user.email,
                name: user.name || "User",
                subject: "Verify your email",
                body: `Please verify your email by clicking the following link: <a href="${url}">Verify Email</a>`,
            });
        },
    },

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
    trustedOrigins: ["http://localhost:3000/", "http://192.168.*.*:*/**",],

});