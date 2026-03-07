"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Sign up a new user with email and password
 */
export async function signUp(email: string, password: string, name: string) {
    try {
        const response = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name,
            },
            headers: await headers(),
        });

        return { success: true, data: response };
    } catch (error) {
        console.error("Sign up error:", error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : "Failed to sign up" 
        };
    }
}

/**
 * Sign in an existing user with email and password
 */
export async function signIn(email: string, password: string) {
    try {
        const response = await auth.api.signInEmail({
            body: {
                email,
                password,
            },
            headers: await headers(),
        });

        return { success: true, data: response };
    } catch (error) {
        console.error("Sign in error:", error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : "Failed to sign in" 
        };
    }
}

/**
 * Sign out the current user
 */
export async function signOut() {
    try {
        await auth.api.signOut({
            headers: await headers(),
        });

        return { success: true };
    } catch (error) {
        console.error("Sign out error:", error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : "Failed to sign out" 
        };
    }
}

/**
 * Get the current session
 */
export async function getSession() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        return { success: true, data: session };
    } catch (error) {
        console.error("Get session error:", error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : "Failed to get session" 
        };
    }
}