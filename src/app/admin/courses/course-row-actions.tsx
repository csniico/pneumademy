"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteCourse } from "@/actions/courses";

interface CourseRowActionsProps {
  id: string;
  title: string;
}

export function CourseRowActions({ id, title }: CourseRowActionsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteCourse(id);
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/admin/courses/${id}`}
        className="rounded-md bg-zinc-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-600"
      >
        Edit
      </Link>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="rounded-md bg-red-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-50"
      >
        {isPending ? "Deleting…" : "Delete"}
      </button>
    </div>
  );
}
