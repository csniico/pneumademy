"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setCourseStatus } from "@/actions/courses";

interface PublishButtonProps {
  id: string;
  status: string;
}

export function PublishButton({ id, status }: PublishButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isPublished = status === "published";

  const handleClick = () => {
    startTransition(async () => {
      await setCourseStatus(id, isPublished ? "draft" : "published");
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={
        isPublished
          ? "rounded-md bg-zinc-700 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-600 disabled:opacity-50"
          : "rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-50"
      }
    >
      {isPending ? "Saving…" : isPublished ? "Unpublish" : "Publish"}
    </button>
  );
}
