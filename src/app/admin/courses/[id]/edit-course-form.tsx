"use client";

import { useTransition, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateCourse } from "@/actions/courses";

interface EditCourseFormProps {
  id: string;
  defaultValues: {
    title: string;
    slug: string;
    description: string;
    accessLevel: string;
    position: number;
  };
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function EditCourseForm({ id, defaultValues }: EditCourseFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [title, setTitle] = useState(defaultValues.title);
  const [slug, setSlug] = useState(defaultValues.slug);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [description, setDescription] = useState(defaultValues.description);
  const [accessLevel, setAccessLevel] = useState(defaultValues.accessLevel);
  const [position, setPosition] = useState(defaultValues.position);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Auto-update slug when title changes (unless user manually edited it)
  useEffect(() => {
    if (!slugManuallyEdited) {
      setSlug(slugify(title));
    }
  }, [title, slugManuallyEdited]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);
    startTransition(async () => {
      try {
        await updateCourse(id, {
          title,
          slug,
          description: description || undefined,
          accessLevel,
          position,
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
        <label htmlFor="edit-title" className={labelClass}>
          Title <span className="text-destructive">*</span>
        </label>
        <input
          id="edit-title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="edit-slug" className={labelClass}>
          Slug
        </label>
        <input
          id="edit-slug"
          type="text"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugManuallyEdited(true);
          }}
          className={inputClass}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Auto-generated from title. Edit to override.
        </p>
      </div>

      <div>
        <label htmlFor="edit-description" className={labelClass}>
          Description
        </label>
        <textarea
          id="edit-description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="edit-access" className={labelClass}>
          Access Level
        </label>
        <select
          id="edit-access"
          value={accessLevel}
          onChange={(e) => setAccessLevel(e.target.value)}
          className={inputClass}
        >
          <option value="open">Open (all authenticated users)</option>
          <option value="disciple">Disciple (disciples only)</option>
        </select>
      </div>

      <div>
        <label htmlFor="edit-position" className={labelClass}>
          Position
        </label>
        <input
          id="edit-position"
          type="number"
          min={0}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          className={inputClass}
        />
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
