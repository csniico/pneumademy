"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { setCoursePrerequisites } from "@/actions/courses";
import { cn } from "@/lib/utils";

type CourseOption = {
  id: string;
  title: string;
  status: string;
};

interface PrerequisitesSelectorProps {
  courseId: string;
  allCourses: CourseOption[];
  currentPrerequisiteIds: string[];
}

export function PrerequisitesSelector({
  courseId,
  allCourses,
  currentPrerequisiteIds,
}: PrerequisitesSelectorProps) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(currentPrerequisiteIds),
  );
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setSaved(false);
  };

  const handleSave = () => {
    startTransition(async () => {
      await setCoursePrerequisites(courseId, Array.from(selected));
      setSaved(true);
      router.refresh();
    });
  };

  if (allCourses.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No other courses available.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {allCourses.map((c) => (
          <label
            key={c.id}
            className="flex cursor-pointer items-center gap-2.5"
          >
            <input
              type="checkbox"
              checked={selected.has(c.id)}
              onChange={() => toggle(c.id)}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            <span className="flex-1 text-sm text-foreground">{c.title}</span>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                c.status === "published"
                  ? "bg-green-500/10 text-green-600 ring-1 ring-green-500/30 dark:text-green-400"
                  : "bg-muted text-muted-foreground ring-1 ring-border",
              )}
            >
              {c.status}
            </span>
          </label>
        ))}
      </div>

      {saved && (
        <p className="text-xs text-green-600 dark:text-green-400">
          Prerequisites saved.
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={isPending}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
      >
        {isPending ? "Saving…" : "Save Prerequisites"}
      </button>
    </div>
  );
}
