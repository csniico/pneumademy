import { db } from "@/db";
import { user } from "@/db/schema/auth/schema";
import { desc } from "drizzle-orm";
import { UsersTable } from "@/components/admin/users-table";

export default async function AdminUsersPage() {
  const users = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      banned: user.banned,
      banReason: user.banReason,
      isActive: user.isActive,
      createdAt: user.createdAt,
    })
    .from(user)
    .orderBy(desc(user.createdAt));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {users.length} {users.length === 1 ? "member" : "members"} total
        </p>
      </div>

      <UsersTable users={users} />
    </div>
  );
}
