import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL as string,
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    emailAndPassword: {enabled: true},
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }
    },
    plugins: [
        admin(),
        nextCookies()
    ],
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: "learner",
                input: false,
            },
            bio: {
                type: "string",
                required: false,
            },
            avatarUrl: {
                type: "string",
                required: false,
                fieldName: "avatar_url",
            },
            isActive: {
                type: "boolean",
                required: true,
                defaultValue: true,
                input: false,
            },
        },
    },
});