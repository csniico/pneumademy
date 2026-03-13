import Link from "next/link";
import { db } from "@/db";
import { course, lesson } from "@/db/schema/courses/schema";
import { count, asc, eq } from "drizzle-orm";
import { cn } from "@/lib/utils";
import { CourseRowActions } from "./course-row-actions";
import { PlusIcon } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        status === "published"
          ? "bg-green-500/10 text-green-600 ring-1 ring-green-500/30 dark:text-green-400"
          : "bg-muted text-muted-foreground ring-1 ring-border",
      )}
    >
      {status}
    </span>
  );
}

function AccessBadge({ level }: { level: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        level === "open"
          ? "bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/30 dark:text-blue-400"
          : "bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/30 dark:text-amber-400",
      )}
    >
      {level}
    </span>
  );
}

export default async function AdminCoursesPage() {
  const courses = await db
    .select({
      id: course.id,
      title: course.title,
      slug: course.slug,
      status: course.status,
      accessLevel: course.accessLevel,
      position: course.position,
      createdAt: course.createdAt,
      lessonCount: count(lesson.id),
    })
    .from(course)
    .leftJoin(lesson, eq(lesson.courseId, course.id))
    .groupBy(
      course.id,
      course.title,
      course.slug,
      course.status,
      course.accessLevel,
      course.position,
      course.createdAt,
    )
    .orderBy(asc(course.position));

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Courses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {courses.length} {courses.length === 1 ? "course" : "courses"} total
          </p>
        </div>
        <Link
          href="/admin/courses/new"
          className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
        >
          <PlusIcon className="h-4 w-4" />
          New Course
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                #
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Title
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Access
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Lessons
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Created
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c, i) => (
              <tr
                key={c.id}
                className={cn(
                  "border-b border-border transition-colors last:border-0 hover:bg-muted/30",
                  i % 2 === 0 ? "bg-card" : "bg-card/50",
                )}
              >
                <td className="px-4 py-3 text-muted-foreground">
                  {c.position}
                </td>
                <td className="px-4 py-3 font-medium text-foreground">
                  <Link
                    href={`/admin/courses/${c.id}`}
                    className="hover:text-primary hover:underline"
                  >
                    {c.title}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <AccessBadge level={c.accessLevel} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {c.lessonCount}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(c.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3">
                  <CourseRowActions id={c.id} title={c.title} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {courses.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No courses yet.{" "}
            <Link href="/admin/courses/new" className="text-primary hover:underline">
              Create your first course
            </Link>
            .
          </div>
        )}
      </div>
    </div>
  );
}
