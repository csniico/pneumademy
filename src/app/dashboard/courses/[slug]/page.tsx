import { redirect, notFound } from "next/navigation";
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
import { eq, and, asc, isNotNull, inArray } from "drizzle-orm";
import { ArrowLeft, CheckCircle2, Circle, Lock, BookOpen } from "lucide-react";
import { EnrollButton } from "@/components/dashboard/enroll-button";

export default async function CourseDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/login");

    const userId = session.user.id;
    const userRole = session.user.role ?? "learner";

    const [courseData] = await db
        .select()
        .from(course)
        .where(and(eq(course.slug, slug), eq(course.status, "published")))
        .limit(1);

    if (!courseData) notFound();

    // Role access check
    const roleBlocked =
        courseData.accessLevel === "disciple" &&
        userRole !== "disciple" &&
        userRole !== "admin";

    if (roleBlocked) {
        return (
            <div className="p-8">
                <Link
                    href="/dashboard/courses"
                    className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    All Courses
                </Link>
                <div className="mt-8 rounded-lg border border-dashed bg-muted/10 p-16 text-center">
                    <Lock className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                    <p className="font-medium text-foreground">Disciple access required</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        This course becomes available when you advance to Phase 2.
                    </p>
                </div>
            </div>
        );
    }

    // Parallel fetch: prereqs + enrollment + lessons
    const [prereqs, enrollmentResults, lessons] = await Promise.all([
        db
            .select({ prerequisiteId: coursePrerequisite.prerequisiteId })
            .from(coursePrerequisite)
            .where(eq(coursePrerequisite.courseId, courseData.id)),
        db
            .select()
            .from(enrollment)
            .where(and(eq(enrollment.userId, userId), eq(enrollment.courseId, courseData.id)))
            .limit(1),
        db
            .select()
            .from(lesson)
            .where(and(eq(lesson.courseId, courseData.id), eq(lesson.status, "published")))
            .orderBy(asc(lesson.position)),
    ]);

    const prereqIds = prereqs.map((p) => p.prerequisiteId);
    const [enrollmentData] = enrollmentResults;
    const isEnrolled = !!enrollmentData;

    let prereqsMet = true;
    let unmetPrereqTitles: string[] = [];

    // Parallel fetch: completed prereqs + completed lessons
    const [completedPrereqs, completedLessons] = await Promise.all([
        prereqIds.length > 0
            ? db
                  .select({ courseId: enrollment.courseId })
                  .from(enrollment)
                  .where(
                      and(
                          eq(enrollment.userId, userId),
                          isNotNull(enrollment.completedAt),
                          inArray(enrollment.courseId, prereqIds),
                      ),
                  )
            : Promise.resolve([]),
        lessons.length > 0
            ? db
                  .select({ lessonId: lessonProgress.lessonId })
                  .from(lessonProgress)
                  .where(
                      and(
                          eq(lessonProgress.userId, userId),
                          inArray(
                              lessonProgress.lessonId,
                              lessons.map((l) => l.id),
                          ),
                      ),
                  )
            : Promise.resolve([]),
    ]);

    if (prereqIds.length > 0) {
        const completedIds = new Set(completedPrereqs.map((e) => e.courseId));
        const unmetIds = prereqIds.filter((id) => !completedIds.has(id));

        if (unmetIds.length > 0) {
            prereqsMet = false;
            const unmetCourses = await db
                .select({ title: course.title })
                .from(course)
                .where(inArray(course.id, unmetIds));
            unmetPrereqTitles = unmetCourses.map((c) => c.title);
        }
    }

    const completedLessonIds = new Set(completedLessons.map((p) => p.lessonId));
    const completedCount = completedLessonIds.size;
    const totalCount = lessons.length;
    const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <div className="p-8">
            {/* Back */}
            <Link
                href="/dashboard/courses"
                className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="h-4 w-4" />
                All Courses
            </Link>

            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            {courseData.title}
                        </h1>
                        {courseData.description && (
                            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                                {courseData.description}
                            </p>
                        )}
                    </div>
                    {courseData.accessLevel === "disciple" && (
                        <span className="rounded border px-2 py-0.5 text-xs text-muted-foreground">
                            Disciple
                        </span>
                    )}
                </div>

                {/* Progress bar (if enrolled) */}
                {isEnrolled && totalCount > 0 && (
                    <div className="mt-4">
                        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                                {completedCount} of {totalCount} lessons completed
                            </span>
                            <span>{pct}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Not enrolled — show enroll CTA or prereq block */}
            {!isEnrolled && (
                <div className="mb-8 rounded-lg border bg-muted/20 p-6">
                    {!prereqsMet ? (
                        <div className="flex items-start gap-3">
                            <Lock className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                            <div>
                                <p className="font-medium text-foreground">
                                    Prerequisites required
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Complete the following courses first:
                                </p>
                                <ul className="mt-2 space-y-1">
                                    {unmetPrereqTitles.map((title) => (
                                        <li
                                            key={title}
                                            className="text-sm text-muted-foreground"
                                        >
                                            — {title}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="font-medium text-foreground">
                                    Ready to begin?
                                </p>
                                <p className="mt-0.5 text-sm text-muted-foreground">
                                    {totalCount} lesson{totalCount !== 1 ? "s" : ""} in this
                                    course.
                                </p>
                            </div>
                            <EnrollButton
                                courseId={courseData.id}
                                courseSlug={courseData.slug}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Lesson list */}
            {totalCount === 0 ? (
                <div className="rounded-lg border border-dashed bg-muted/10 p-10 text-center">
                    <BookOpen className="mx-auto mb-3 h-7 w-7 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                        No lessons published yet.
                    </p>
                </div>
            ) : (
                <div>
                    <h2 className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                        Lessons
                    </h2>
                    <ol className="space-y-2">
                        {lessons.map((l, i) => {
                            const isDone = completedLessonIds.has(l.id);
                            const content = (
                                <div className="flex items-center gap-4">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center">
                                        {isDone ? (
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                        ) : (
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full border text-xs font-medium text-muted-foreground">
                                                {i + 1}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p
                                            className={`text-sm font-medium ${isDone ? "text-muted-foreground" : "text-foreground"}`}
                                        >
                                            {l.title}
                                        </p>
                                        {l.description && (
                                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                                {l.description}
                                            </p>
                                        )}
                                    </div>
                                    {isDone && (
                                        <span className="shrink-0 text-xs text-muted-foreground">
                                            Done
                                        </span>
                                    )}
                                </div>
                            );

                            return (
                                <li key={l.id}>
                                    {isEnrolled ? (
                                        <Link
                                            href={`/dashboard/courses/${slug}/lessons/${l.id}`}
                                            className="block rounded-lg border bg-background px-4 py-3 transition-colors hover:bg-muted/30"
                                        >
                                            {content}
                                        </Link>
                                    ) : (
                                        <div className="block rounded-lg border bg-background px-4 py-3 opacity-60">
                                            {content}
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                </div>
            )}
        </div>
    );
}
