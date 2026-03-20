import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { course, lesson, coursePrerequisite } from "@/db/schema/courses/schema";
import { eq, asc, ne } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditCourseForm } from "./edit-course-form";
import { CourseLessonsSection } from "./course-lessons-section";
import { PrerequisitesSelector } from "./prerequisites-selector";
import { PublishButton } from "./publish-button";
import { DeleteCourseButton } from "./delete-course-button";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [courseData] = await db
    .select()
    .from(course)
    .where(eq(course.id, id))
    .limit(1);

  if (!courseData) notFound();

  const lessons = await db
    .select()
    .from(lesson)
    .where(eq(lesson.courseId, id))
    .orderBy(asc(lesson.position));

  const prerequisites = await db
    .select({ prerequisiteId: coursePrerequisite.prerequisiteId })
    .from(coursePrerequisite)
    .where(eq(coursePrerequisite.courseId, id));

  const currentPrerequisiteIds = prerequisites.map((p) => p.prerequisiteId);

  const otherCourses = await db
    .select({
      id: course.id,
      title: course.title,
      status: course.status,
    })
    .from(course)
    .where(ne(course.id, id))
    .orderBy(asc(course.position));

  return (
    <div>
      {/* Back link */}
      <Link
        href="/admin/courses"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All Courses
      </Link>

      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-foreground">{courseData.title}</h1>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
            courseData.status === "published"
              ? "bg-green-500/10 text-green-600 ring-1 ring-green-500/30 dark:text-green-400"
              : "bg-muted text-muted-foreground ring-1 ring-border",
          )}
        >
          {courseData.status}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <PublishButton id={courseData.id} status={courseData.status} />
          <DeleteCourseButton id={courseData.id} title={courseData.title} />
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left col-span-2 */}
        <div className="col-span-2 space-y-6">
          {/* Course Details card */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Course Details
            </h2>
            <EditCourseForm
              id={courseData.id}
              defaultValues={{
                title: courseData.title,
                slug: courseData.slug,
                description: courseData.description ?? "",
                accessLevel: courseData.accessLevel,
                position: courseData.position,
              }}
            />
          </div>

          {/* Lessons card */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Lessons
            </h2>
            <CourseLessonsSection courseId={courseData.id} lessons={lessons} />
          </div>
        </div>

        {/* Right col-span-1 */}
        <div className="col-span-1 space-y-6">
          {/* Thumbnail card */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Thumbnail
            </h2>
            <div className="flex h-32 items-center justify-center rounded-md border border-dashed border-border">
              <p className="text-sm text-muted-foreground">Upload coming soon</p>
            </div>
          </div>

          {/* Prerequisites card */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Prerequisites
            </h2>
            <PrerequisitesSelector
              courseId={courseData.id}
              allCourses={otherCourses}
              currentPrerequisiteIds={currentPrerequisiteIds}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
