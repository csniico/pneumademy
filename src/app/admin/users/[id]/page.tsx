import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { user, session } from "@/db/schema/auth/schema";
import { eq, desc } from "drizzle-orm";
import { cn } from "@/lib/utils";
import { UserProfileActions } from "@/components/admin/user-profile-actions";
import { ArrowLeft, Monitor, Clock } from "lucide-react";

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

function StatusBadge({
  banned,
  isActive,
}: {
  banned: boolean | null;
  isActive: boolean;
}) {
  if (banned)
    return (
      <span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive ring-1 ring-destructive/30">
        Banned
      </span>
    );
  if (!isActive)
    return (
      <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground ring-1 ring-border">
        Disabled
      </span>
    );
  return (
    <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-600 ring-1 ring-green-500/30 dark:text-green-400">
      Active
    </span>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
      {initials}
    </div>
  );
}

function parseDevice(userAgent: string | null) {
  if (!userAgent) return "Unknown device";
  if (/Mobile|Android|iPhone/i.test(userAgent)) return "Mobile";
  if (/Tablet|iPad/i.test(userAgent)) return "Tablet";
  return "Desktop";
}

function parseBrowser(userAgent: string | null) {
  if (!userAgent) return "";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Edg")) return "Edge";
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Safari")) return "Safari";
  return "Browser";
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [profile] = await db
    .select()
    .from(user)
    .where(eq(user.id, id))
    .limit(1);

  if (!profile) notFound();

  const sessions = await db
    .select()
    .from(session)
    .where(eq(session.userId, id))
    .orderBy(desc(session.createdAt))
    .limit(10);

  const lastLogin = sessions[0]?.createdAt ?? null;

  return (
    <div>
      {/* Back */}
      <Link
        href="/admin/users"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All users
      </Link>

      {/* Header */}
      <div className="mb-6 flex items-start gap-4">
        <Avatar name={profile.name} />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">
              {profile.name}
            </h1>
            <RoleBadge role={profile.role} />
            <StatusBadge banned={profile.banned} isActive={profile.isActive} />
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">{profile.email}</p>
          {lastLogin && (
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Last login{" "}
              {new Date(lastLogin).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: details + sessions */}
        <div className="col-span-2 space-y-6">
          {/* Account details */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Account Details
            </h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Member since</dt>
                <dd className="font-medium text-foreground">
                  {new Date(profile.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Email verified</dt>
                <dd className="font-medium text-foreground">
                  {profile.emailVerified ? "Yes" : "No"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Access</dt>
                <dd className="font-medium text-foreground">
                  {profile.isActive ? "Enabled" : "Disabled"}
                </dd>
              </div>
              {profile.bio && (
                <div className="flex justify-between gap-8">
                  <dt className="text-muted-foreground">Bio</dt>
                  <dd className="text-right font-medium text-foreground">
                    {profile.bio}
                  </dd>
                </div>
              )}
              {profile.banned && profile.banReason && (
                <div className="flex justify-between gap-8">
                  <dt className="text-muted-foreground">Ban reason</dt>
                  <dd className="text-right font-medium text-destructive">
                    {profile.banReason}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Session history */}
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Session History
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Last {sessions.length} session{sessions.length !== 1 ? "s" : ""}
              </p>
            </div>
            {sessions.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No sessions found.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {sessions.map((s) => (
                  <li key={s.id} className="flex items-center gap-3 px-5 py-3">
                    <Monitor className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {parseDevice(s.userAgent)}{" "}
                        <span className="font-normal text-muted-foreground">
                          — {parseBrowser(s.userAgent)}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {s.ipAddress ?? "Unknown IP"}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs text-foreground">
                        {new Date(s.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Expires{" "}
                        {new Date(s.expiresAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right: actions */}
        <div className="col-span-1">
          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Actions
            </h2>
            <UserProfileActions
              user={{
                id: profile.id,
                role: profile.role,
                banned: profile.banned,
                isActive: profile.isActive,
                isSystemAdmin: profile.isSystemAdmin,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
