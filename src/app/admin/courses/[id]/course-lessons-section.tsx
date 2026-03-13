"use client";

import { useTransition, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createLesson, deleteLesson } from "@/actions/courses";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";

type Lesson = {
  id: string;
  title: string;
  position: number;
  status: string;
  courseId: string;
};

interface CourseLessonsSectionProps {
  courseId: string;
  lessons: Lesson[];
}

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

function LessonDeleteButton({
  lessonId,
  courseId,
}: {
  lessonId: string;
  courseId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (!confirm("Delete this lesson? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteLesson(lessonId, courseId);
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="rounded-md bg-red-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-50"
    >
      {isPending ? "Deleting…" : "Delete"}
    </button>
  );
}

export function CourseLessonsSection({
  courseId,
  lessons,
}: CourseLessonsSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [newTitle, setNewTitle] = useState("");
  const [newPosition, setNewPosition] = useState(lessons.length);
  const [formError, setFormError] = useState<string | null>(null);

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    startTransition(async () => {
      try {
        await createLesson(courseId, {
          title: newTitle,
          position: newPosition,
        });
        router.refresh();
      } catch (err) {
        if (err instanceof Error && err.message !== "NEXT_REDIRECT") {
          setFormError(err.message);
        }
      }
    });
  };

  const inputClass =
    "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary";
  const labelClass = "block text-sm font-medium text-foreground mb-1";

  return (
    <div>
      {/* Lessons table */}
      {lessons.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-border mb-4">
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
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((l, i) => (
                <tr
                  key={l.id}
                  className={cn(
                    "border-b border-border transition-colors last:border-0 hover:bg-muted/30",
                    i % 2 === 0 ? "bg-card" : "bg-card/50",
                  )}
                >
                  <td className="px-4 py-3 text-muted-foreground">
                    {l.position}
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {l.title}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={l.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/courses/${courseId}/lessons/${l.id}`}
                        className="rounded-md bg-zinc-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-600"
                      >
                        Edit
                      </Link>
                      <LessonDeleteButton
                        lessonId={l.id}
                        courseId={courseId}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mb-4 text-sm text-muted-foreground">
          No lessons yet. Add your first lesson below.
        </p>
      )}

      {/* Add lesson toggle */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
        >
          <PlusIcon className="h-4 w-4" />
          Add Lesson
        </button>
      ) : (
        <div className="rounded-lg border border-border bg-muted/20 p-4">
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            New Lesson
          </h3>
          <form onSubmit={handleAddLesson} className="space-y-3">
            {formError && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {formError}
              </p>
            )}
            <div>
              <label htmlFor="lesson-title" className={labelClass}>
                Title <span className="text-destructive">*</span>
              </label>
              <input
                id="lesson-title"
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Lesson title…"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="lesson-position" className={labelClass}>
                Position
              </label>
              <input
                id="lesson-position"
                type="number"
                min={0}
                value={newPosition}
                onChange={(e) => setNewPosition(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={isPending || !newTitle.trim()}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
              >
                {isPending ? "Creating…" : "Create Lesson"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setNewTitle("");
                  setFormError(null);
                }}
                className="rounded-md bg-zinc-700 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
