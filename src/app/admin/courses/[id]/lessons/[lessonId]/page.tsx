import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { lesson, lessonAsset, course } from "@/db/schema/courses/schema";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditLessonForm } from "./edit-lesson-form";
import { LessonAssetsSection } from "./lesson-assets-section";

export default async function LessonDetailPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const { id, lessonId } = await params;

  const [lessonData] = await db
    .select()
    .from(lesson)
    .where(eq(lesson.id, lessonId))
    .limit(1);

  if (!lessonData) notFound();

  const [courseData] = await db
    .select({ id: course.id, title: course.title })
    .from(course)
    .where(eq(course.id, id))
    .limit(1);

  if (!courseData) notFound();

  const assets = await db
    .select()
    .from(lessonAsset)
    .where(eq(lessonAsset.lessonId, lessonId))
    .orderBy(lessonAsset.createdAt);

  return (
    <div>
      {/* Back link */}
      <Link
        href={`/admin/courses/${id}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {courseData.title}
      </Link>

      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-foreground">
          {lessonData.title}
        </h1>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
            lessonData.status === "published"
              ? "bg-green-500/10 text-green-600 ring-1 ring-green-500/30 dark:text-green-400"
              : "bg-muted text-muted-foreground ring-1 ring-border",
          )}
        >
          {lessonData.status}
        </span>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left col-span-2 */}
        <div className="col-span-2 space-y-6">
          {/* Lesson Details card */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Lesson Details
            </h2>
            <EditLessonForm
              id={lessonData.id}
              courseId={id}
              defaultValues={{
                title: lessonData.title,
                description: lessonData.description ?? "",
                position: lessonData.position,
                status: lessonData.status,
              }}
            />
          </div>

          {/* Assets card */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Assets
            </h2>
            <LessonAssetsSection assets={assets} lessonId={lessonId} courseId={id} />
          </div>
        </div>

        {/* Right col-span-1 */}
        <div className="col-span-1">
          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Lesson Info
            </h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Course</dt>
                <dd className="font-medium text-foreground">
                  <Link
                    href={`/admin/courses/${courseData.id}`}
                    className="hover:text-primary hover:underline"
                  >
                    {courseData.title}
                  </Link>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Position</dt>
                <dd className="font-medium text-foreground">
                  {lessonData.position}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Status</dt>
                <dd className="font-medium text-foreground capitalize">
                  {lessonData.status}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Created</dt>
                <dd className="font-medium text-foreground">
                  {new Date(lessonData.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
