"use client";

import { useRef, useState } from "react";
import { addLessonAsset } from "@/actions/courses";
import { useRouter } from "next/navigation";

const MAX_BYTES = 100 * 1024 * 1024; // 100 MB

type MediaType = "video" | "audio";

const ACCEPTED: Record<MediaType, string> = {
  video: "video/mp4,video/webm,video/quicktime",
  audio: "audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/m4a,audio/aac",
};

interface MediaUploaderProps {
  type: MediaType;
  courseId: string;
  lessonId: string;
  onDone: () => void;
}

export function MediaUploader({
  type,
  courseId,
  lessonId,
  onDone,
}: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFile = async (file: File) => {
    setError(null);

    if (file.size > MAX_BYTES) {
      setError("File exceeds the 100 MB size limit.");
      return;
    }

    // 1. Get presigned URL
    setProgress(0);
    const presignRes = await fetch("/api/upload/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        courseId,
        lessonId,
        filename: file.name,
        contentType: file.type,
        fileSize: file.size,
      }),
    });

    if (!presignRes.ok) {
      const body = await presignRes.json().catch(() => ({}));
      setError((body as { error?: string }).error ?? "Failed to get upload URL.");
      setProgress(null);
      return;
    }

    const { url, key } = await presignRes.json();

    // 2. Upload via XHR for progress tracking
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      });
      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else reject(new Error(`Upload failed: ${xhr.status}`));
      });
      xhr.addEventListener("error", () => reject(new Error("Upload failed.")));
      xhr.open("PUT", url);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    }).catch((err: Error) => {
      setError(err.message);
      setProgress(null);
      throw err;
    });

    // 3. Save asset record
    await addLessonAsset({
      lessonId,
      courseId,
      type,
      s3Key: key,
      filename: file.name,
    });

    setProgress(null);
    router.refresh();
    onDone();
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED[type]}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {progress === null ? (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={`rounded-md px-4 py-2 text-sm font-semibold text-white ${
              type === "video"
                ? "bg-blue-600 hover:bg-blue-500"
                : "bg-purple-700 hover:bg-purple-600"
            }`}
          >
            Choose {type === "video" ? "Video" : "Audio"} file
          </button>
          <span className="text-xs text-muted-foreground">Max 100 MB</span>
          <button
            type="button"
            onClick={onDone}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Uploading…</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all ${
                type === "video" ? "bg-blue-500" : "bg-purple-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
