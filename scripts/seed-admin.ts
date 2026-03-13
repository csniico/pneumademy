import "dotenv/config";
import { db } from "@/db";
import { user } from "@/db/schema/auth/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

const ADMIN_EMAIL = "admin@pneumademy.com";
const ADMIN_NAME = "System Admin";
const ADMIN_PASSWORD = "Admin1234!";

async function seedAdmin() {
  // Check if admin already exists
  const existing = await db
    .select()
    .from(user)
    .where(eq(user.email, ADMIN_EMAIL))
    .limit(1);

  if (existing.length > 0) {
    console.log("Admin already exists — ensuring role is set to admin...");
    await db
      .update(user)
      .set({ role: "admin", emailVerified: true, isSystemAdmin: true })
      .where(eq(user.email, ADMIN_EMAIL));
    console.log("Done.");
    return;
  }

  // Create user via Better Auth so the password is properly hashed
  await auth.api.signUpEmail({
    body: {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      name: ADMIN_NAME,
    },
    headers: new Headers(),
  });

  // Promote to admin and mark email as verified
  await db
    .update(user)
    .set({ role: "admin", emailVerified: true, isSystemAdmin: true })
    .where(eq(user.email, ADMIN_EMAIL));

  console.log("Admin user created.");
  console.log(`  Email:    ${ADMIN_EMAIL}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
  console.log("Change this password after your first login!");
}

seedAdmin().catch(console.error).finally(() => process.exit());
