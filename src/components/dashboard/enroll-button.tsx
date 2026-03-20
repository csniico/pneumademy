"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { enrollInCourse } from "@/actions/dashboard";

interface EnrollButtonProps {
    courseId: string;
    courseSlug: string;
}

export function EnrollButton({ courseId, courseSlug }: EnrollButtonProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleEnroll = () => {
        startTransition(async () => {
            await enrollInCourse(courseId, courseSlug);
            router.refresh();
        });
    };

    return (
        <button
            onClick={handleEnroll}
            disabled={isPending}
            className="inline-flex h-[45px] items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
            {isPending ? "Enrolling..." : "Enroll in Course"}
        </button>
    );
}
