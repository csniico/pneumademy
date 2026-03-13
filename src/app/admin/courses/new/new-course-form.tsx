"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { createCourse } from "@/actions/courses";

export function NewCourseForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [accessLevel, setAccessLevel] = useState("open");
  const [position, setPosition] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await createCourse({ title, description: description || undefined, accessLevel, position });
        router.refresh();
      } catch (err) {
        if (err instanceof Error && err.message !== "NEXT_REDIRECT") {
          setError(err.message);
        }
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

      <div>
        <label htmlFor="title" className={labelClass}>
          Title <span className="text-destructive">*</span>
        </label>
        <input
          id="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Introduction to Discipleship"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A brief overview of this course…"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="accessLevel" className={labelClass}>
          Access Level
        </label>
        <select
          id="accessLevel"
          value={accessLevel}
          onChange={(e) => setAccessLevel(e.target.value)}
          className={inputClass}
        >
          <option value="open">Open (all authenticated users)</option>
          <option value="disciple">Disciple (disciples only)</option>
        </select>
      </div>

      <div>
        <label htmlFor="position" className={labelClass}>
          Position
        </label>
        <input
          id="position"
          type="number"
          min={0}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          className={inputClass}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Controls sort order in the course list.
        </p>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending || !title.trim()}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
        >
          {isPending ? "Creating…" : "Create Course"}
        </button>
      </div>
    </form>
  );
}
