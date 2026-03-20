import { db } from "@/db";
import { user } from "@/db/schema/auth/schema";
import { course, enrollment, lesson } from "@/db/schema/courses/schema";
import { eq, count, and } from "drizzle-orm";
import { Users, BookOpen, GraduationCap, UserCheck } from "lucide-react";

export default async function AdminDashboardPage() {
  const [totalUsers] = await db.select({ count: count() }).from(user);
  const [learners] = await db
    .select({ count: count() })
    .from(user)
    .where(eq(user.role, "learner"));
  const [disciples] = await db
    .select({ count: count() })
    .from(user)
    .where(eq(user.role, "disciple"));
  const [bannedUsers] = await db
    .select({ count: count() })
    .from(user)
    .where(eq(user.banned, true));
  const [publishedCourses] = await db
    .select({ count: count() })
    .from(course)
    .where(eq(course.status, "published"));
  const [draftCourses] = await db
    .select({ count: count() })
    .from(course)
    .where(eq(course.status, "draft"));
  const [totalEnrollments] = await db.select({ count: count() }).from(enrollment);
  const [publishedLessons] = await db
    .select({ count: count() })
    .from(lesson)
    .where(eq(lesson.status, "published"));

  const recentUsers = await db
    .select({ id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt })
    .from(user)
    .orderBy(user.createdAt)
    .limit(5);

  const stats = [
    {
      label: "Total Members",
      value: totalUsers?.count ?? 0,
      sub: `${bannedUsers?.count ?? 0} banned`,
      icon: Users,
    },
    {
      label: "Learners",
      value: learners?.count ?? 0,
      sub: "Phase 1",
      icon: GraduationCap,
    },
    {
      label: "Disciples",
      value: disciples?.count ?? 0,
      sub: "Phase 2",
      icon: UserCheck,
    },
    {
      label: "Published Courses",
      value: publishedCourses?.count ?? 0,
      sub: `${draftCourses?.count ?? 0} drafts`,
      icon: BookOpen,
    },
  ];

  const roleLabel: Record<string, string> = {
    learner: "Learner",
    disciple: "Disciple",
    admin: "Admin",
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform overview.
        </p>
      </div>

      {/* Stats grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map(({ label, value, sub, icon: Icon }) => (
          <div key={label} className="rounded-lg border bg-background p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{label}</p>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
          </div>
        ))}
      </div>

      {/* Secondary stats row */}
      <div className="mb-8 grid grid-cols-2 gap-4">
        <div className="rounded-lg border bg-background p-5">
          <p className="text-sm text-muted-foreground">Total Enrollments</p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {totalEnrollments?.count ?? 0}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            across all courses
          </p>
        </div>
        <div className="rounded-lg border bg-background p-5">
          <p className="text-sm text-muted-foreground">Published Lessons</p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {publishedLessons?.count ?? 0}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            across all courses
          </p>
        </div>
      </div>

      {/* Recent members */}
      <div>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Recent Members
        </h2>
        <div className="rounded-lg border bg-background">
          {recentUsers.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">No members yet.</p>
          ) : (
            <ul className="divide-y">
              {recentUsers.map((u) => (
                <li key={u.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  <span className="rounded border px-2 py-0.5 text-xs text-muted-foreground">
                    {roleLabel[u.role ?? "learner"] ?? u.role}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
