"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  banned: boolean | null;
  banReason: string | null;
  isActive: boolean;
  createdAt: Date;
};

function RoleBadge({ role }: { role: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        role === "admin" &&
          "bg-accent/20 text-accent-foreground ring-1 ring-accent/40",
        role === "disciple" &&
          "bg-primary/10 text-primary ring-1 ring-primary/30",
        role === "learner" &&
          "bg-muted text-muted-foreground ring-1 ring-border",
      )}
    >
      {role}
    </span>
  );
}

function StatusBadge({ banned }: { banned: boolean | null }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        banned
          ? "bg-destructive/10 text-destructive ring-1 ring-destructive/30"
          : "bg-green-500/10 text-green-600 ring-1 ring-green-500/30 dark:text-green-400",
      )}
    >
      {banned ? "Banned" : "Active"}
    </span>
  );
}


export function UsersTable({ users }: { users: User[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              Name
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              Email
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              Role
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              Status
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              Joined
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => (
            <tr
              key={user.id}
              className={cn(
                "border-b border-border transition-colors last:border-0 hover:bg-muted/30",
                i % 2 === 0 ? "bg-card" : "bg-card/50",
              )}
            >
              <td className="px-4 py-3 font-medium text-foreground">
                <Link
                  href={`/admin/users/${user.id}`}
                  className="hover:text-primary hover:underline"
                >
                  {user.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
              <td className="px-4 py-3">
                <RoleBadge role={user.role} />
              </td>
              <td className="px-4 py-3">
                <StatusBadge banned={user.banned} />
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No users found.
        </div>
      )}
    </div>
  );
}
