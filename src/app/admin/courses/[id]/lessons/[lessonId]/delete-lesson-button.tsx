"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteLesson } from "@/actions/courses";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface DeleteLessonButtonProps {
  lessonId: string;
  courseId: string;
  title: string;
}

export function DeleteLessonButton({
  lessonId,
  courseId,
  title,
}: DeleteLessonButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleConfirm = () => {
    setOpen(false);
    startTransition(async () => {
      await deleteLesson(lessonId, courseId);
      router.push(`/admin/courses/${courseId}`);
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={isPending}
        className="rounded-md bg-destructive px-4 py-2 text-sm font-semibold text-white hover:bg-destructive/90 disabled:opacity-50"
      >
        {isPending ? "Deleting…" : "Delete Lesson"}
      </button>
      <ConfirmDialog
        open={open}
        title="Delete lesson"
        description={`Are you sure you want to delete "${title}"? This cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
