"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { updateLesson } from "@/actions/courses";

interface EditLessonFormProps {
  id: string;
  courseId: string;
  defaultValues: {
    title: string;
    description: string;
    position: number;
    status: string;
  };
}

export function EditLessonForm({
  id,
  courseId,
  defaultValues,
}: EditLessonFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [title, setTitle] = useState(defaultValues.title);
  const [description, setDescription] = useState(defaultValues.description);
  const [position, setPosition] = useState(defaultValues.position);
  const [status, setStatus] = useState(defaultValues.status);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);
    startTransition(async () => {
      try {
        await updateLesson(id, courseId, {
          title,
          description: description || undefined,
          position,
          status,
        });
        setSaved(true);
        router.refresh();
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      }
    });
  };

  const inputClass =
    "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary";
  const labelClass = "block text-sm font-medium text-foreground mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      {saved && (
        <p className="rounded-md bg-green-500/10 px-3 py-2 text-sm text-green-600 dark:text-green-400">
          Changes saved.
        </p>
      )}

      <div>
        <label htmlFor="lesson-edit-title" className={labelClass}>
          Title <span className="text-destructive">*</span>
        </label>
        <input
          id="lesson-edit-title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="lesson-edit-description" className={labelClass}>
          Description
        </label>
        <textarea
          id="lesson-edit-description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A brief description of this lesson…"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="lesson-edit-position" className={labelClass}>
          Position
        </label>
        <input
          id="lesson-edit-position"
          type="number"
          min={0}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="lesson-edit-status" className={labelClass}>
          Status
        </label>
        <select
          id="lesson-edit-status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={inputClass}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
