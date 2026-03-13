# ADR-006: S3 Storage Organisation for Course Assets

## Status

Accepted

## Context

Pneumademy stores four types of course assets — thumbnails, videos, reading
content (HTML), and audio. We need a consistent, predictable key structure in
S3 that:

- Keeps asset types isolated from each other
- Scopes all assets to their owning course
- Makes it easy to list, delete, or migrate all assets for a given course
- Allows different access policies per asset type (e.g. public thumbnails, private lesson content)

A flat or unorganised key space would make IAM policies harder to write and
course-level cleanup (on deletion) error-prone.

## Decision

All assets are stored in a single bucket (`S3_BUCKET_NAME`) using a
**type-prefixed, course-scoped** key structure:

| Asset type | Key pattern | Lesson type |
|---|---|---|
| Thumbnail | `thumbnails/<courseId>/thumbnail.<ext>` | Course cover image |
| Video | `videos/<courseId>/<filename>` | Video-based lessons |
| HTML | `html/<courseId>/<filename>` | Reading-based lessons |
| Audio | `audios/<courseId>/<filename>` | Audio-based lessons |

Key rules:
- The top-level prefix (`thumbnails/`, `videos/`, `html/`, `audios/`) maps directly to an IAM policy resource, enabling per-type access control without separate buckets.
- The `<courseId>` segment ensures all assets for a course live under a predictable prefix — making bulk deletion safe and efficient with `ListObjectsV2` + `DeleteObjects`.
- Filenames within the course prefix are caller-supplied but sanitised before use. For lesson assets, prefixing with the lesson id is recommended to ensure uniqueness (e.g. `<lessonId>-content.html`).
- A single thumbnail per course is enforced by the fixed `thumbnail.<ext>` name — uploading a new thumbnail replaces the old one automatically.

Presigned PUT URLs (5-minute expiry) are used for direct browser → S3 uploads
to avoid routing large files through the Next.js server.

## Consequences

### Positive

- IAM bucket policies can be scoped to `thumbnails/*`, `videos/*`, `html/*`, `audios/*` independently
- Deleting a course means one `ListObjectsV2` per prefix + a single `DeleteObjects` call
- No cross-contamination between asset types
- Predictable URLs make caching and CDN configuration straightforward
- HTML lesson content stored in S3 keeps the DB lean — no large text blobs in Postgres

### Negative

- All asset types in one bucket means a single bucket policy governs all; fine for now but may require splitting if access patterns diverge significantly
- Filename collisions within a course prefix are possible for videos, HTML, and audio — callers must ensure uniqueness (e.g. prefix with a lesson id)

### Neutral

- `getPublicUrl` is appropriate only for thumbnails if the bucket is public-read; videos, HTML, and audio assets should use presigned GET URLs if the bucket is private
- HTML lesson files stored in S3 must be fetched and rendered server-side or via a presigned URL — they are not served as static pages
