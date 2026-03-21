import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import {
    course,
    enrollment,
    lesson,
    lessonAsset,
    lessonProgress,
} from "@/db/schema/courses/schema";
import { eq, and, asc } from "drizzle-orm";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { getPresignedReadUrl } from "@/lib/s3";
import { CompleteLessonButton } from "@/components/dashboard/complete-lesson-button";

function formatDuration(seconds: number | null) {
    if (!seconds) return null;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
}

export default async function LessonViewerPage({
    params,
}: {
    params: Promise<{ slug: string; lessonId: string }>;
}) {
    const { slug, lessonId } = await params;

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/login");

    const userId = session.user.id;

    // Parallel fetch: course (by slug) + assets + progress — assets/progress only need lessonId/userId
    const [courseResults, assetResults, progressResults] = await Promise.all([
        db
            .select()
            .from(course)
            .where(and(eq(course.slug, slug), eq(course.status, "published")))
            .limit(1),
        db
            .select()
            .from(lessonAsset)
            .where(eq(lessonAsset.lessonId, lessonId))
            .orderBy(asc(lessonAsset.createdAt)),
        db
            .select()
            .from(lessonProgress)
            .where(
                and(
                    eq(lessonProgress.userId, userId),
                    eq(lessonProgress.lessonId, lessonId),
                ),
            )
            .limit(1),
    ]);

    const [courseData] = courseResults;
    if (!courseData) notFound();

    // Parallel fetch: lesson verification + enrollment check + all lessons for nav
    const [lessonResults, enrollmentResults, allLessons] = await Promise.all([
        db
            .select()
            .from(lesson)
            .where(
                and(
                    eq(lesson.id, lessonId),
                    eq(lesson.courseId, courseData.id),
                    eq(lesson.status, "published"),
                ),
            )
            .limit(1),
        db
            .select()
            .from(enrollment)
            .where(
                and(eq(enrollment.userId, userId), eq(enrollment.courseId, courseData.id)),
            )
            .limit(1),
        db
            .select({ id: lesson.id, title: lesson.title, position: lesson.position })
            .from(lesson)
            .where(and(eq(lesson.courseId, courseData.id), eq(lesson.status, "published")))
            .orderBy(asc(lesson.position)),
    ]);

    const [lessonData] = lessonResults;
    if (!lessonData) notFound();

    const [enrollmentData] = enrollmentResults;
    if (!enrollmentData) redirect(`/dashboard/courses/${slug}`);

    // Generate presigned URLs — wrapped per-asset so one failure doesn't crash the page
    const assetsWithUrls = await Promise.all(
        assetResults.map(async (asset) => {
            try {
                const url = await getPresignedReadUrl(asset.s3Key, 3600);
                return { ...asset, url };
            } catch {
                return { ...asset, url: null };
            }
        }),
    );

    // Fetch HTML content server-side with a 10-second timeout
    const assetsWithContent = await Promise.all(
        assetsWithUrls.map(async (asset) => {
            if (asset.type !== "html" || !asset.url) return { ...asset, htmlContent: null };
            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 10_000);
                const res = await fetch(asset.url, { signal: controller.signal });
                clearTimeout(timeout);
                const htmlContent = await res.text();
                return { ...asset, htmlContent };
            } catch {
                return { ...asset, htmlContent: null };
            }
        }),
    );

    const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson =
        currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

    const isCompleted = progressResults.length > 0;

    return (
        <div className="p-8">
            {/* Breadcrumb / back */}
            <Link
                href={`/dashboard/courses/${slug}`}
                className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="h-4 w-4" />
                {courseData.title}
            </Link>

            {/* Lesson header */}
            <div className="mb-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                            Lesson {currentIndex + 1} of {allLessons.length}
                        </p>
                        <h1 className="mt-1 text-2xl font-bold text-foreground">
                            {lessonData.title}
                        </h1>
                        {lessonData.description && (
                            <p className="mt-1 text-sm text-muted-foreground">
                                {lessonData.description}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Assets */}
            {assetsWithContent.length === 0 ? (
                <div className="mb-8 rounded-lg border border-dashed bg-muted/10 p-10 text-center">
                    <p className="text-sm text-muted-foreground">
                        No content available for this lesson yet.
                    </p>
                </div>
            ) : (
                <div className="mb-8 space-y-6">
                    {assetsWithContent.map((asset) => (
                        <div key={asset.id}>
                            {asset.type === "video" && asset.url && (
                                <div className="overflow-hidden rounded-lg border bg-black">
                                    <video
                                        controls
                                        className="w-full"
                                        src={asset.url}
                                        playsInline
                                    >
                                        Your browser does not support video playback.
                                    </video>
                                    <div className="flex items-center justify-between px-4 py-2">
                                        <p className="text-xs text-muted-foreground">
                                            {asset.filename}
                                        </p>
                                        {asset.durationSeconds && (
                                            <p className="text-xs text-muted-foreground">
                                                {formatDuration(asset.durationSeconds)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {asset.type === "audio" && asset.url && (
                                <div className="rounded-lg border bg-background p-4">
                                    <p className="mb-2 text-xs text-muted-foreground">
                                        {asset.filename}
                                        {asset.durationSeconds &&
                                            ` — ${formatDuration(asset.durationSeconds)}`}
                                    </p>
                                    <audio controls className="w-full" src={asset.url}>
                                        Your browser does not support audio playback.
                                    </audio>
                                </div>
                            )}

                            {asset.type === "html" && asset.htmlContent && (
                                <div className="rounded-lg border bg-background p-6 sm:p-8">
                                    <div
                                        className="lesson-content text-sm leading-relaxed text-foreground"
                                        dangerouslySetInnerHTML={{ __html: asset.htmlContent }}
                                    />
                                </div>
                            )}

                            {(asset.url === null) && (
                                <div className="rounded-lg border border-dashed bg-muted/10 p-6 text-center">
                                    <p className="text-sm text-muted-foreground">
                                        This asset could not be loaded.
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Bottom bar: prev/next + complete button */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-6">
                {/* Prev */}
                <div>
                    {prevLesson ? (
                        <Link
                            href={`/dashboard/courses/${slug}/lessons/${prevLesson.id}`}
                            className="inline-flex h-9 items-center gap-2 rounded-md border px-4 text-sm text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Link>
                    ) : (
                        <div />
                    )}
                </div>

                {/* Complete + next */}
                <div className="flex items-center gap-3">
                    <CompleteLessonButton
                        lessonId={lessonId}
                        courseId={courseData.id}
                        courseSlug={slug}
                        nextLessonId={nextLesson?.id ?? null}
                        isCompleted={isCompleted}
                    />
                    {nextLesson && !isCompleted && (
                        <Link
                            href={`/dashboard/courses/${slug}/lessons/${nextLesson.id}`}
                            className="inline-flex h-9 items-center gap-2 rounded-md border px-4 text-sm text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground"
                        >
                            Skip
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
