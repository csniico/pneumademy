"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { markLessonComplete } from "@/actions/dashboard";
import { CheckCircle2 } from "lucide-react";

interface CompleteLessonButtonProps {
    lessonId: string;
    courseId: string;
    courseSlug: string;
    nextLessonId: string | null;
    isCompleted: boolean;
}

export function CompleteLessonButton({
    lessonId,
    courseId,
    courseSlug,
    nextLessonId,
    isCompleted,
}: CompleteLessonButtonProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleComplete = () => {
        startTransition(async () => {
            await markLessonComplete(lessonId, courseId, courseSlug);
            if (nextLessonId) {
                router.push(
                    `/dashboard/courses/${courseSlug}/lessons/${nextLessonId}`,
                );
            } else {
                router.refresh();
            }
        });
    };

    if (isCompleted) {
        return (
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Completed
                </div>
                {nextLessonId && (
                    <button
                        onClick={() =>
                            router.push(
                                `/dashboard/courses/${courseSlug}/lessons/${nextLessonId}`,
                            )
                        }
                        className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Next Lesson
                    </button>
                )}
            </div>
        );
    }

    return (
        <button
            onClick={handleComplete}
            disabled={isPending}
            className="inline-flex h-[45px] items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
            {isPending
                ? "Saving..."
                : nextLessonId
                  ? "Mark Complete & Continue"
                  : "Complete Course"}
        </button>
    );
}
