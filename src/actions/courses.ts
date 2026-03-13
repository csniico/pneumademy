"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { course, lesson, coursePrerequisite, lessonAsset } from "@/db/schema/courses/schema";
import { eq } from "drizzle-orm";
import { deleteObject } from "@/lib/s3";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") throw new Error("Unauthorized");
  return session;
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createCourse(data: {
  title: string;
  description?: string;
  accessLevel: string;
  position: number;
}) {
  const session = await requireAdmin();
  const id = crypto.randomUUID();
  await db.insert(course).values({
    id,
    title: data.title,
    slug: slugify(data.title),
    description: data.description ?? null,
    accessLevel: data.accessLevel,
    position: data.position,
    status: "draft",
    createdBy: session.user.id,
  });
  revalidatePath("/admin/courses");
  redirect(`/admin/courses/${id}`);
}

export async function updateCourse(
  id: string,
  data: {
    title: string;
    slug: string;
    description?: string;
    accessLevel: string;
    position: number;
  },
) {
  await requireAdmin();
  await db
    .update(course)
    .set({
      title: data.title,
      slug: data.slug,
      description: data.description ?? null,
      accessLevel: data.accessLevel,
      position: data.position,
    })
    .where(eq(course.id, id));
  revalidatePath("/admin/courses");
  revalidatePath(`/admin/courses/${id}`);
}

export async function setCourseStatus(id: string, status: "draft" | "published") {
  await requireAdmin();
  await db.update(course).set({ status }).where(eq(course.id, id));
  revalidatePath("/admin/courses");
  revalidatePath(`/admin/courses/${id}`);
}

export async function deleteCourse(id: string) {
  await requireAdmin();
  await db.delete(course).where(eq(course.id, id));
  revalidatePath("/admin/courses");
  redirect("/admin/courses");
}

export async function setCoursePrerequisites(
  courseId: string,
  prerequisiteIds: string[],
) {
  await requireAdmin();
  await db
    .delete(coursePrerequisite)
    .where(eq(coursePrerequisite.courseId, courseId));
  if (prerequisiteIds.length > 0) {
    await db.insert(coursePrerequisite).values(
      prerequisiteIds.map((prerequisiteId) => ({ courseId, prerequisiteId })),
    );
  }
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function createLesson(
  courseId: string,
  data: { title: string; description?: string; position: number },
) {
  await requireAdmin();
  const id = crypto.randomUUID();
  await db.insert(lesson).values({
    id,
    courseId,
    title: data.title,
    description: data.description ?? null,
    position: data.position,
    status: "draft",
  });
  revalidatePath(`/admin/courses/${courseId}`);
  redirect(`/admin/courses/${courseId}/lessons/${id}`);
}

export async function updateLesson(
  id: string,
  courseId: string,
  data: {
    title: string;
    description?: string;
    position: number;
    status: string;
  },
) {
  await requireAdmin();
  await db
    .update(lesson)
    .set({
      title: data.title,
      description: data.description ?? null,
      position: data.position,
      status: data.status,
    })
    .where(eq(lesson.id, id));
  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath(`/admin/courses/${courseId}/lessons/${id}`);
}

export async function deleteLesson(id: string, courseId: string) {
  await requireAdmin();
  await db.delete(lesson).where(eq(lesson.id, id));
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function addLessonAsset(data: {
  lessonId: string;
  courseId: string;
  type: string;
  s3Key: string;
  filename: string;
  durationSeconds?: number;
}) {
  await requireAdmin();
  await db.insert(lessonAsset).values({
    id: crypto.randomUUID(),
    lessonId: data.lessonId,
    type: data.type,
    s3Key: data.s3Key,
    filename: data.filename,
    durationSeconds: data.durationSeconds ?? null,
  });
  revalidatePath(`/admin/courses/${data.courseId}/lessons/${data.lessonId}`);
}

export async function deleteLessonAsset(
  assetId: string,
  s3Key: string,
  lessonId: string,
  courseId: string,
) {
  await requireAdmin();
  await db.delete(lessonAsset).where(eq(lessonAsset.id, assetId));
  await deleteObject(s3Key);
  revalidatePath(`/admin/courses/${courseId}/lessons/${lessonId}`);
}
