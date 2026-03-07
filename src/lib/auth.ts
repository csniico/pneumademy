import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
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