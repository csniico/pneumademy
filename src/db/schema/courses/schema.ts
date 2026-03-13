import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  integer,
  timestamp,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/pg-core";
import { user } from "@/db/schema/auth/schema";

// ─── Course ───────────────────────────────────────────────────────────────────

export const course = pgTable("course", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  thumbnailKey: text("thumbnail_key"), // S3 key: thumbnails/<courseId>/thumbnail.<ext>
  status: text("status").default("draft").notNull(), // draft | published
  // open   → any authenticated user; auto-enrolled on signup
  // disciple → only users with role "disciple"
  accessLevel: text("access_level").default("open").notNull(),
  position: integer("position").default(0).notNull(), // display/sequential order
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// ─── Course prerequisites ─────────────────────────────────────────────────────
// A course can require one or many other courses to be completed first.
// Learners cannot access a course if any of its prerequisites are incomplete.

export const coursePrerequisite = pgTable(
  "course_prerequisite",
  {
    courseId: text("course_id")
      .notNull()
      .references(() => course.id, { onDelete: "cascade" }),
    prerequisiteId: text("prerequisite_id")
      .notNull()
      .references(() => course.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.courseId, table.prerequisiteId] })],
);

// ─── Lesson ───────────────────────────────────────────────────────────────────

export const lesson = pgTable("lesson", {
  id: text("id").primaryKey(),
  courseId: text("course_id")
    .notNull()
    .references(() => course.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  position: integer("position").default(0).notNull(), // order within course
  status: text("status").default("draft").notNull(), // draft | published
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// ─── Lesson asset ─────────────────────────────────────────────────────────────
// A lesson can have multiple assets of different types.
// S3 key patterns:
//   video → videos/<courseId>/<lessonId>-<filename>
//   audio → audios/<courseId>/<lessonId>-<filename>
//   html  → html/<courseId>/<lessonId>.html

export const lessonAsset = pgTable("lesson_asset", {
  id: text("id").primaryKey(),
  lessonId: text("lesson_id")
    .notNull()
    .references(() => lesson.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // video | audio | html
  s3Key: text("s3_key").notNull(),
  filename: text("filename").notNull(), // original filename for display
  durationSeconds: integer("duration_seconds"), // video/audio only
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Enrollment ───────────────────────────────────────────────────────────────
// Tracks which users are enrolled in which courses.
// Open courses are auto-enrolled on signup; disciple courses are gated.

export const enrollment = pgTable(
  "enrollment",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    courseId: text("course_id")
      .notNull()
      .references(() => course.id, { onDelete: "cascade" }),
    enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
    completedAt: timestamp("completed_at"), // set when all lessons are done
  },
  (table) => [
    uniqueIndex("enrollment_user_course_idx").on(table.userId, table.courseId),
  ],
);

// ─── Lesson progress ──────────────────────────────────────────────────────────
// One row per user per completed lesson.
// A course enrollment is "complete" when all published lessons have a row here.

export const lessonProgress = pgTable(
  "lesson_progress",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id")
      .notNull()
      .references(() => lesson.id, { onDelete: "cascade" }),
    completedAt: timestamp("completed_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("lesson_progress_user_lesson_idx").on(
      table.userId,
      table.lessonId,
    ),
  ],
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const courseRelations = relations(course, ({ one, many }) => ({
  createdBy: one(user, { fields: [course.createdBy], references: [user.id] }),
  lessons: many(lesson),
  prerequisites: many(coursePrerequisite, { relationName: "coursePrereqs" }),
  requiredBy: many(coursePrerequisite, { relationName: "prereqOf" }),
  enrollments: many(enrollment),
}));

export const coursePrerequisiteRelations = relations(
  coursePrerequisite,
  ({ one }) => ({
    course: one(course, {
      fields: [coursePrerequisite.courseId],
      references: [course.id],
      relationName: "coursePrereqs",
    }),
    prerequisite: one(course, {
      fields: [coursePrerequisite.prerequisiteId],
      references: [course.id],
      relationName: "prereqOf",
    }),
  }),
);

export const lessonRelations = relations(lesson, ({ one, many }) => ({
  course: one(course, { fields: [lesson.courseId], references: [course.id] }),
  assets: many(lessonAsset),
  progress: many(lessonProgress),
}));

export const lessonAssetRelations = relations(lessonAsset, ({ one }) => ({
  lesson: one(lesson, {
    fields: [lessonAsset.lessonId],
    references: [lesson.id],
  }),
}));

export const enrollmentRelations = relations(enrollment, ({ one }) => ({
  user: one(user, { fields: [enrollment.userId], references: [user.id] }),
  course: one(course, {
    fields: [enrollment.courseId],
    references: [course.id],
  }),
}));

export const lessonProgressRelations = relations(lessonProgress, ({ one }) => ({
  user: one(user, { fields: [lessonProgress.userId], references: [user.id] }),
  lesson: one(lesson, {
    fields: [lessonProgress.lessonId],
    references: [lesson.id],
  }),
}));
