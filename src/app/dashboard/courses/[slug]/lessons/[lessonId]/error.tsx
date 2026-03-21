"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function LessonError({ reset }: { error: Error; reset: () => void }) {
    const params = useParams<{ slug: string }>();

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
            <p className="text-sm font-medium text-muted-foreground">Something went wrong</p>
            <p className="mt-1 text-xs text-muted-foreground">
                This lesson could not be loaded. Please try again.
            </p>
            <div className="mt-6 flex items-center gap-3">
                <button
                    onClick={reset}
                    className="inline-flex h-9 items-center rounded-md border px-4 text-sm transition-colors hover:bg-muted/30"
                >
                    Try again
                </button>
                <Link
                    href={`/dashboard/courses/${params?.slug ?? ""}`}
                    className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
                >
                    Back to course
                </Link>
            </div>
        </div>
    );
}
