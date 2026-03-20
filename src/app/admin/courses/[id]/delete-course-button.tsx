"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteCourse } from "@/actions/courses";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface DeleteCourseButtonProps {
  id: string;
  title: string;
}

export function DeleteCourseButton({ id, title }: DeleteCourseButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleConfirm = () => {
    setOpen(false);
    startTransition(async () => {
      await deleteCourse(id);
      router.push("/admin/courses");
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={isPending}
        className="rounded-md bg-destructive px-4 py-2 text-sm font-semibold text-white hover:bg-destructive/90 disabled:opacity-50"
      >
        {isPending ? "Deleting…" : "Delete Course"}
      </button>
      <ConfirmDialog
        open={open}
        title="Delete course"
        description={`Are you sure you want to delete "${title}"? This will also delete all its lessons and cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
