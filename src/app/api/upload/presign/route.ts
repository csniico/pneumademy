import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPresignedUploadUrl, s3Keys } from "@/lib/s3";

const MAX_MEDIA_BYTES = 100 * 1024 * 1024; // 100 MB

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type, courseId, lessonId, filename, contentType, fileSize } =
    (await req.json()) as {
      type: "video" | "audio" | "html";
      courseId: string;
      lessonId: string;
      filename: string;
      contentType: string;
      fileSize: number;
    };

  if ((type === "video" || type === "audio") && fileSize > MAX_MEDIA_BYTES) {
    return NextResponse.json(
      { error: "File exceeds the 100 MB size limit." },
      { status: 400 },
    );
  }

  let key: string;
  if (type === "video") {
    key = s3Keys.video(courseId, `${lessonId}-${filename}`);
  } else if (type === "audio") {
    key = s3Keys.audio(courseId, `${lessonId}-${filename}`);
  } else {
    // html — one canonical file per lesson
    key = s3Keys.html(courseId, `${lessonId}.html`);
  }

  try {
    const url = await getPresignedUploadUrl({ key, contentType });
    return NextResponse.json({ url, key });
  } catch (err) {
    console.error("[presign] S3 error:", err);
    return NextResponse.json(
      { error: "Failed to generate upload URL. Check S3 configuration." },
      { status: 500 },
    );
  }
}
