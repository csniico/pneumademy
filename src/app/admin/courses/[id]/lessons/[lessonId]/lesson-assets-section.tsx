"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { deleteLessonAsset } from "@/actions/courses";
import { MediaUploader } from "@/components/admin/media-uploader";
import { HtmlLessonEditor } from "@/components/admin/html-lesson-editor";

type Asset = {
  id: string;
  type: string;
  filename: string;
  s3Key: string;
  durationSeconds: number | null;
  createdAt: Date;
};

interface LessonAssetsSectionProps {
  assets: Asset[];
  lessonId: string;
  courseId: string;
}

type ActiveUpload = "video" | "audio" | "html" | null;

function TypeBadge({ type }: { type: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        type === "video" &&
          "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/30",
        type === "audio" &&
          "bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/30",
        type === "html" &&
          "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30",
      )}
    >
      {type}
    </span>
  );
}

function formatDuration(seconds: number | null) {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function DeleteAssetButton({
  assetId,
  s3Key,
  lessonId,
  courseId,
}: {
  assetId: string;
  s3Key: string;
  lessonId: string;
  courseId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        if (!confirm("Delete this asset? This cannot be undone.")) return;
        startTransition(async () => {
          await deleteLessonAsset(assetId, s3Key, lessonId, courseId);
          router.refresh();
        });
      }}
      className="rounded-md bg-red-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-50"
    >
      {isPending ? "Deleting…" : "Delete"}
    </button>
  );
}

export function LessonAssetsSection({
  assets,
  lessonId,
  courseId,
}: LessonAssetsSectionProps) {
  const [activeUpload, setActiveUpload] = useState<ActiveUpload>(null);

  return (
    <div className="space-y-5">
      {/* Assets table */}
      {assets.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Filename</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Duration</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Uploaded</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset, i) => (
                <tr
                  key={asset.id}
                  className={cn(
                    "border-b border-border last:border-0 hover:bg-muted/30",
                    i % 2 === 0 ? "bg-card" : "bg-card/50",
                  )}
                >
                  <td className="px-4 py-3"><TypeBadge type={asset.type} /></td>
                  <td className="px-4 py-3 font-medium text-foreground">{asset.filename}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDuration(asset.durationSeconds)}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(asset.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <DeleteAssetButton
                      assetId={asset.id}
                      s3Key={asset.s3Key}
                      lessonId={lessonId}
                      courseId={courseId}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No assets yet.</p>
      )}

      {/* Active uploader */}
      {activeUpload === "video" && (
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Upload Video
          </p>
          <MediaUploader
            type="video"
            courseId={courseId}
            lessonId={lessonId}
            onDone={() => setActiveUpload(null)}
          />
        </div>
      )}

      {activeUpload === "audio" && (
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Upload Audio
          </p>
          <MediaUploader
            type="audio"
            courseId={courseId}
            lessonId={lessonId}
            onDone={() => setActiveUpload(null)}
          />
        </div>
      )}

      {activeUpload === "html" && (
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Reading Content (HTML)
          </p>
          <HtmlLessonEditor
            courseId={courseId}
            lessonId={lessonId}
            onDone={() => setActiveUpload(null)}
          />
        </div>
      )}

      {/* Upload trigger buttons — hide the one that's already active */}
      {activeUpload === null && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Add Asset
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveUpload("video")}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
            >
              Upload Video
            </button>
            <button
              type="button"
              onClick={() => setActiveUpload("audio")}
              className="rounded-md bg-purple-700 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-600"
            >
              Upload Audio
            </button>
            <button
              type="button"
              onClick={() => setActiveUpload("html")}
              className="rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
            >
              Write / Import Reading
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
