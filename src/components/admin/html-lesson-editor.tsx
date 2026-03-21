"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState, useRef } from "react";
import { addLessonAsset } from "@/actions/courses";
import { useRouter } from "next/navigation";

interface HtmlLessonEditorProps {
  courseId: string;
  lessonId: string;
  /** If editing an existing asset, pass its S3 key and id */
  existingKey?: string;
  existingAssetId?: string;
  initialHtml?: string;
  onDone: () => void;
}

type Tab = "write" | "import";

export function HtmlLessonEditor({
  courseId,
  lessonId,
  existingKey,
  initialHtml = "",
  onDone,
}: HtmlLessonEditorProps) {
  const [tab, setTab] = useState<Tab>("write");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [docxFilename, setDocxFilename] = useState<string | null>(null);
  const docxInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: initialHtml,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm prose-invert max-w-none min-h-[240px] px-4 py-3 focus:outline-none",
      },
    },
  });

  // DOCX → HTML via mammoth (client-side, dynamic import)
  const handleDocx = async (file: File) => {
    setError(null);
    setDocxFilename(file.name);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const mammoth = await import("mammoth");
      const result = await mammoth.convertToHtml({ arrayBuffer });
      editor?.commands.setContent(result.value);
      setTab("write");
    } catch {
      setError("Failed to convert document. Make sure it is a valid .docx file.");
    }
  };

  const save = async () => {
    if (!editor) return;
    setSaving(true);
    setError(null);

    const html = editor.getHTML();
    const blob = new Blob([html], { type: "text/html" });

    try {
      // Get presigned PUT URL
      const presignRes = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "html",
          courseId,
          lessonId,
          filename: `${lessonId}.html`,
          contentType: "text/html",
          fileSize: blob.size,
        }),
      });

      if (!presignRes.ok) {
        const body = await presignRes.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? "Failed to get upload URL.");
      }

      const { url, key } = await presignRes.json();

      // Upload HTML to S3
      const uploadRes = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "text/html" },
        body: blob,
      });

      if (!uploadRes.ok) throw new Error("Upload to S3 failed.");

      // If this is a new asset (no existing key), save the record
      if (!existingKey) {
        await addLessonAsset({
          lessonId,
          courseId,
          type: "html",
          s3Key: key,
          filename: docxFilename ?? `${lessonId}.html`,
        });
      }
      // If updating an existing asset, the key stays the same — no new DB record needed

      router.refresh();
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Tabs */}
      <div className="flex gap-1 rounded-md bg-muted p-1 w-fit">
        {(["write", "import"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
              tab === t
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "write" ? "Write" : "Import DOCX"}
          </button>
        ))}
      </div>

      {tab === "write" && (
        <div className="overflow-hidden rounded-md border border-border bg-background">
          {/* Toolbar */}
          <div className="flex flex-wrap gap-1 border-b border-border px-2 py-1.5">
            {[
              { label: "B", action: () => editor?.chain().focus().toggleBold().run(), active: editor?.isActive("bold") },
              { label: "I", action: () => editor?.chain().focus().toggleItalic().run(), active: editor?.isActive("italic") },
              { label: "H2", action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), active: editor?.isActive("heading", { level: 2 }) },
              { label: "H3", action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), active: editor?.isActive("heading", { level: 3 }) },
              { label: "UL", action: () => editor?.chain().focus().toggleBulletList().run(), active: editor?.isActive("bulletList") },
              { label: "OL", action: () => editor?.chain().focus().toggleOrderedList().run(), active: editor?.isActive("orderedList") },
              { label: "—", action: () => editor?.chain().focus().setHorizontalRule().run(), active: false },
            ].map(({ label, action, active }) => (
              <button
                key={label}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); action(); }}
                className={`min-w-7 rounded px-1.5 py-0.5 text-xs font-mono font-semibold transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <EditorContent editor={editor} />
        </div>
      )}

      {tab === "import" && (
        <div className="rounded-md border border-dashed border-border p-6 text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Upload a <strong className="text-foreground">.docx</strong> file — it will be converted to HTML and loaded into the editor.
          </p>
          <input
            ref={docxInputRef}
            type="file"
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleDocx(file);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => docxInputRef.current?.click()}
            className="rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
          >
            Choose .docx file
          </button>
          {docxFilename && (
            <p className="text-xs text-muted-foreground">Loaded: {docxFilename}</p>
          )}
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={onDone}
          disabled={saving}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
