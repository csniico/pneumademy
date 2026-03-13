"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/schema/auth/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function setUserRole(
  userId: string,
  role: "learner" | "disciple",
) {
  await requireAdmin();
  await db.update(user).set({ role }).where(eq(user.id, userId));
  revalidatePath("/admin/users");
}

export async function banUser(userId: string, reason?: string) {
  await requireAdmin();
  await db
    .update(user)
    .set({ banned: true, banReason: reason ?? null })
    .where(eq(user.id, userId));
  revalidatePath("/admin/users");
}

export async function unbanUser(userId: string) {
  await requireAdmin();
  await db
    .update(user)
    .set({ banned: false, banReason: null })
    .where(eq(user.id, userId));
  revalidatePath("/admin/users");
}

export async function makeAdmin(userId: string) {
  await requireAdmin();
  // isSystemAdmin stays false — this is a promoted admin, not a system admin
  await db.update(user).set({ role: "admin" }).where(eq(user.id, userId));
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId}`);
}

export async function revokeAdmin(userId: string) {
  await requireAdmin();
  const [target] = await db
    .select({ isSystemAdmin: user.isSystemAdmin })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);
  if (!target || target.isSystemAdmin) {
    throw new Error("Cannot revoke a system admin.");
  }
  await db.update(user).set({ role: "learner" }).where(eq(user.id, userId));
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId}`);
}

export async function setActiveStatus(userId: string, isActive: boolean) {
  await requireAdmin();
  await db.update(user).set({ isActive }).where(eq(user.id, userId));
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId}`);
}
