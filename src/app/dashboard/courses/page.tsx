import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import {
    course,
    enrollment,
    lesson,
    lessonProgress,
    coursePrerequisite,
} from "@/db/schema/courses/schema";
import { eq, and, count, inArray } from "drizzle-orm";
import { Lock, BookOpen, CheckCircle2 } from "lucide-react";

export default async function CoursesPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/login");

    const userId = session.user.id;
    const userRole = session.user.role ?? "learner";

    const allCourses = await db
        .select()
        .from(course)
        .where(eq(course.status, "published"))
        .orderBy(course.position);

    const courseIds = allCourses.map((c) => c.id);

    const userEnrollments =
        courseIds.length > 0
            ? await db
                  .select({ courseId: enrollment.courseId, completedAt: enrollment.completedAt })
                  .from(enrollment)
                  .where(and(eq(enrollment.userId, userId), inArray(enrollment.courseId, courseIds)))
            : [];

    const lessonCounts =
        courseIds.length > 0
            ? await db
                  .select({ courseId: lesson.courseId, total: count() })
                  .from(lesson)
                  .where(and(inArray(lesson.courseId, courseIds), eq(lesson.status, "published")))
                  .groupBy(lesson.courseId)
            : [];

    const completedCounts =
        courseIds.length > 0
            ? await db
                  .select({ courseId: lesson.courseId, done: count() })
                  .from(lessonProgress)
                  .innerJoin(lesson, eq(lessonProgress.lessonId, lesson.id))
                  .where(and(eq(lessonProgress.userId, userId), inArray(lesson.courseId, courseIds)))
                  .groupBy(lesson.courseId)
            : [];

    const prerequisites =
        courseIds.length > 0
            ? await db
                  .select({ courseId: coursePrerequisite.courseId, prerequisiteId: coursePrerequisite.prerequisiteId })
                  .from(coursePrerequisite)
                  .where(inArray(coursePrerequisite.courseId, courseIds))
            : [];

    const enrolledSet = new Set(userEnrollments.map((e) => e.courseId));
    const completedSet = new Set(
        userEnrollments.filter((e) => !!e.completedAt).map((e) => e.courseId),
    );
    const totalMap = Object.fromEntries(lessonCounts.map((r) => [r.courseId, r.total]));
    const doneMap = Object.fromEntries(completedCounts.map((r) => [r.courseId, r.done]));

    const prereqsByCourse: Record<string, string[]> = {};
    for (const p of prerequisites) {
        if (!prereqsByCourse[p.courseId]) prereqsByCourse[p.courseId] = [];
        prereqsByCourse[p.courseId].push(p.prerequisiteId);
    }

    const coursesWithMeta = allCourses.map((c) => {
        const prereqs = prereqsByCourse[c.id] ?? [];
        const prereqsMet = prereqs.every((pId) => completedSet.has(pId));
        const roleBlocked = c.accessLevel === "disciple" && userRole === "learner";
        const locked = roleBlocked || !prereqsMet;
        const enrolled = enrolledSet.has(c.id);
        const isDone = completedSet.has(c.id);
        const totalLessons = totalMap[c.id] ?? 0;
        const completedLessons = doneMap[c.id] ?? 0;
        const pct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        return { ...c, locked, roleBlocked, prereqsMet, enrolled, isDone, totalLessons, completedLessons, pct };
    });

    const available = coursesWithMeta.filter((c) => !c.locked);
    const locked = coursesWithMeta.filter((c) => c.locked);

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">Courses</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Browse your available discipleship content.
                </p>
            </div>

            {available.length > 0 && (
                <section className="mb-10">
                    <h2 className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                        Available
                    </h2>
                    <div className="space-y-3">
                        {available.map((c) => (
                            <Link
                                key={c.id}
                                href={`/dashboard/courses/${c.slug}`}
                                className="flex items-center gap-4 rounded-lg border bg-background p-4 transition-colors hover:bg-muted/30"
                            >
                                <div className="shrink-0">
                                    {c.isDone ? (
                                        <CheckCircle2 className="h-5 w-5 text-primary" />
                                    ) : (
                                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="truncate text-sm font-medium text-foreground">
                                            {c.title}
                                        </p>
                                        {c.accessLevel === "disciple" && (
                                            <span className="shrink-0 rounded border px-1.5 py-0.5 text-xs text-muted-foreground">
                                                Disciple
                                            </span>
                                        )}
                                    </div>
                                    {c.description && (
                                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                            {c.description}
                                        </p>
                                    )}
                                    {c.enrolled && c.totalLessons > 0 && (
                                        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
                                            <div
                                                className="h-full rounded-full bg-primary"
                                                style={{ width: `${c.pct}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="shrink-0 text-right">
                                    {c.enrolled ? (
                                        <>
                                            <p className="text-sm font-medium text-foreground">
                                                {c.pct}%
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {c.completedLessons}/{c.totalLessons} lessons
                                            </p>
                                        </>
                                    ) : (
                                        <span className="text-xs text-muted-foreground">
                                            {c.totalLessons} lessons
                                        </span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {locked.length > 0 && (
                <section>
                    <h2 className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                        Locked
                    </h2>
                    <div className="space-y-3">
                        {locked.map((c) => (
                            <div
                                key={c.id}
                                className="flex items-center gap-4 rounded-lg border bg-muted/10 p-4 opacity-60"
                            >
                                <div className="shrink-0">
                                    <Lock className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="truncate text-sm font-medium text-foreground">
                                            {c.title}
                                        </p>
                                        {c.accessLevel === "disciple" && (
                                            <span className="shrink-0 rounded border px-1.5 py-0.5 text-xs text-muted-foreground">
                                                Disciple only
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        {c.roleBlocked
                                            ? "Available when you advance to Phase 2."
                                            : "Complete prerequisite courses to unlock."}
                                    </p>
                                </div>
                                <div className="shrink-0 text-xs text-muted-foreground">
                                    {c.totalLessons} lessons
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {allCourses.length === 0 && (
                <div className="rounded-lg border border-dashed bg-muted/10 p-10 text-center">
                    <BookOpen className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                    <p className="font-medium text-foreground">No courses published yet</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Check back soon.
                    </p>
                </div>
            )}
        </div>
    );
}
