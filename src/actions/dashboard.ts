"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { course, enrollment, lesson, lessonProgress } from "@/db/schema/courses/schema";
import { eq, and, count, isNotNull } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

async function requireUser() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Unauthorized");
    return session;
}

export async function enrollInCourse(courseId: string, courseSlug: string) {
    const session = await requireUser();
    const userId = session.user.id;

    const [courseData] = await db
        .select({ status: course.status, accessLevel: course.accessLevel })
        .from(course)
        .where(eq(course.id, courseId))
        .limit(1);

    if (!courseData || courseData.status !== "published") {
        throw new Error("Course not available");
    }

    if (
        courseData.accessLevel === "disciple" &&
        session.user.role !== "disciple" &&
        session.user.role !== "admin"
    ) {
        throw new Error("Access denied");
    }

    const [existing] = await db
        .select({ id: enrollment.id })
        .from(enrollment)
        .where(and(eq(enrollment.userId, userId), eq(enrollment.courseId, courseId)))
        .limit(1);

    if (existing) return;

    await db.insert(enrollment).values({
        id: crypto.randomUUID(),
        userId,
        courseId,
    });

    revalidatePath(`/dashboard/courses/${courseSlug}`);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/courses");
}

export async function markLessonComplete(
    lessonId: string,
    courseId: string,
    courseSlug: string,
) {
    const session = await requireUser();
    const userId = session.user.id;

    const [existing] = await db
        .select({ id: lessonProgress.id })
        .from(lessonProgress)
        .where(
            and(
                eq(lessonProgress.userId, userId),
                eq(lessonProgress.lessonId, lessonId),
            ),
        )
        .limit(1);

    if (!existing) {
        await db.insert(lessonProgress).values({
            id: crypto.randomUUID(),
            userId,
            lessonId,
        });
    }

    const [total] = await db
        .select({ count: count() })
        .from(lesson)
        .where(and(eq(lesson.courseId, courseId), eq(lesson.status, "published")));

    const [done] = await db
        .select({ count: count() })
        .from(lessonProgress)
        .innerJoin(lesson, eq(lessonProgress.lessonId, lesson.id))
        .where(and(eq(lessonProgress.userId, userId), eq(lesson.courseId, courseId)));

    if ((total?.count ?? 0) > 0 && (done?.count ?? 0) >= (total?.count ?? 0)) {
        await db
            .update(enrollment)
            .set({ completedAt: new Date() })
            .where(
                and(eq(enrollment.userId, userId), eq(enrollment.courseId, courseId)),
            );
    }

    revalidatePath(`/dashboard/courses/${courseSlug}/lessons/${lessonId}`);
    revalidatePath(`/dashboard/courses/${courseSlug}`);
    revalidatePath("/dashboard");
}
