import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewCourseForm } from "./new-course-form";

export default function NewCoursePage() {
  return (
    <div>
      <Link
        href="/admin/courses"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All Courses
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">New Course</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a new course. It will be saved as a draft.
        </p>
      </div>

      <div className="max-w-xl">
        <div className="rounded-lg border border-border bg-card p-5">
          <NewCourseForm />
        </div>
      </div>
    </div>
  );
}
