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
} from "@/db/schema/courses/schema";
import { eq, and, inArray, count } from "drizzle-orm";
import { BookOpen, CheckCircle2, Circle } from "lucide-react";

export default async function DashboardPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/login");

    const userId = session.user.id;
    const userRole = session.user.role ?? "learner";

    const userEnrollments = await db
        .select({
            enrollmentId: enrollment.id,
            enrolledAt: enrollment.enrolledAt,
            completedAt: enrollment.completedAt,
            courseId: course.id,
            courseTitle: course.title,
            courseSlug: course.slug,
            courseDescription: course.description,
            courseAccessLevel: course.accessLevel,
            coursePosition: course.position,
        })
        .from(enrollment)
        .innerJoin(course, eq(enrollment.courseId, course.id))
        .where(and(eq(enrollment.userId, userId), eq(course.status, "published")))
        .orderBy(course.position);

    const courseIds = userEnrollments.map((e) => e.courseId);

    const lessonCounts =
        courseIds.length > 0
            ? await db
                  .select({ courseId: lesson.courseId, total: count() })
                  .from(lesson)
                  .where(
                      and(
                          inArray(lesson.courseId, courseIds),
                          eq(lesson.status, "published"),
                      ),
                  )
                  .groupBy(lesson.courseId)
            : [];

    const completedCounts =
        courseIds.length > 0
            ? await db
                  .select({ courseId: lesson.courseId, done: count() })
                  .from(lessonProgress)
                  .innerJoin(lesson, eq(lessonProgress.lessonId, lesson.id))
                  .where(
                      and(
                          eq(lessonProgress.userId, userId),
                          inArray(lesson.courseId, courseIds),
                      ),
                  )
                  .groupBy(lesson.courseId)
            : [];

    const totalMap = Object.fromEntries(
        lessonCounts.map((r) => [r.courseId, r.total]),
    );
    const doneMap = Object.fromEntries(
        completedCounts.map((r) => [r.courseId, r.done]),
    );

    const coursesWithProgress = userEnrollments.map((e) => ({
        ...e,
        totalLessons: totalMap[e.courseId] ?? 0,
        completedLessons: doneMap[e.courseId] ?? 0,
    }));

    const inProgress = coursesWithProgress.filter(
        (c) => !c.completedAt && c.totalLessons > 0,
    );
    const completed = coursesWithProgress.filter((c) => !!c.completedAt);
    const continueWith = inProgress[0] ?? null;

    const isLearner = userRole === "learner";
    const totalOpenCourses = coursesWithProgress.filter(
        (c) => c.courseAccessLevel === "open",
    ).length;
    const completedOpenCourses = coursesWithProgress.filter(
        (c) => c.courseAccessLevel === "open" && !!c.completedAt,
    ).length;

    return (
        <div className="p-8">
            <div
                className={`mb-8 rounded-lg border p-5 ${
                    isLearner
                        ? "border bg-muted/30"
                        : "border-primary/50 bg-primary/5"
                }`}
            >
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    {isLearner ? "Phase 1" : "Phase 2"}
                </p>
                <h1 className="mt-1 text-2xl font-bold text-foreground">
                    {isLearner ? "Learner" : "Disciple"}
                </h1>
                {isLearner ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                        {completedOpenCourses} of {totalOpenCourses} foundation courses completed.{" "}
                        {totalOpenCourses > 0 && completedOpenCourses < totalOpenCourses
                            ? "Keep going to advance to Phase 2."
                            : completedOpenCourses === totalOpenCourses && totalOpenCourses > 0
                              ? "You have completed all foundation courses."
                              : "Begin your discipleship journey below."}
                    </p>
                ) : (
                    <p className="mt-1 text-sm text-muted-foreground">
                        You have full access to all discipleship content.
                    </p>
                )}
            </div>

            {continueWith && (
                <section className="mb-8">
                    <h2 className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                        Continue Learning
                    </h2>
                    <Link
                        href={`/dashboard/courses/${continueWith.courseSlug}`}
                        className="block rounded-lg border bg-background p-5 transition-colors hover:bg-muted/30"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <h3 className="font-semibold text-foreground">
                                    {continueWith.courseTitle}
                                </h3>
                                {continueWith.courseDescription && (
                                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                        {continueWith.courseDescription}
                                    </p>
                                )}
                            </div>
                            <div className="shrink-0 text-right">
                                <p className="text-sm font-medium text-foreground">
                                    {continueWith.completedLessons}/{continueWith.totalLessons}
                                </p>
                                <p className="text-xs text-muted-foreground">lessons</p>
                            </div>
                        </div>
                        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{
                                    width:
                                        continueWith.totalLessons > 0
                                            ? `${Math.round((continueWith.completedLessons / continueWith.totalLessons) * 100)}%`
                                            : "0%",
                                }}
                            />
                        </div>
                    </Link>
                </section>
            )}

            {coursesWithProgress.length > 0 ? (
                <section>
                    <h2 className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                        My Courses
                    </h2>
                    <div className="space-y-3">
                        {coursesWithProgress.map((c) => {
                            const pct =
                                c.totalLessons > 0
                                    ? Math.round((c.completedLessons / c.totalLessons) * 100)
                                    : 0;
                            const isDone = !!c.completedAt;
                            return (
                                <Link
                                    key={c.enrollmentId}
                                    href={`/dashboard/courses/${c.courseSlug}`}
                                    className="flex items-center gap-4 rounded-lg border bg-background p-4 transition-colors hover:bg-muted/30"
                                >
                                    <div className="shrink-0 text-muted-foreground">
                                        {isDone ? (
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                        ) : (
                                            <Circle className="h-5 w-5" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="truncate text-sm font-medium text-foreground">
                                            {c.courseTitle}
                                        </p>
                                        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted">
                                            <div
                                                className="h-full rounded-full bg-primary"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="shrink-0 text-xs text-muted-foreground">
                                        {pct}%
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            ) : (
                <div className="rounded-lg border border-dashed bg-muted/10 p-10 text-center">
                    <BookOpen className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                    <p className="font-medium text-foreground">No courses yet</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Head to{" "}
                        <Link
                            href="/dashboard/courses"
                            className="underline underline-offset-2"
                        >
                            Courses
                        </Link>{" "}
                        to get started.
                    </p>
                </div>
            )}

            {completed.length > 0 && (
                <section className="mt-8">
                    <h2 className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                        Completed
                    </h2>
                    <div className="space-y-2">
                        {completed.map((c) => (
                            <Link
                                key={c.enrollmentId}
                                href={`/dashboard/courses/${c.courseSlug}`}
                                className="flex items-center gap-3 rounded-lg border bg-background px-4 py-3 text-sm transition-colors hover:bg-muted/30"
                            >
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                                <span className="truncate font-medium text-foreground">
                                    {c.courseTitle}
                                </span>
                                <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                                    All lessons done
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
