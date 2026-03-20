import { MessageSquare } from "lucide-react";

export default function AdminForumsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Forums</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Moderate community discussions.
        </p>
      </div>
      <div className="rounded-lg border border-dashed bg-muted/10 p-16 text-center">
        <MessageSquare className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
        <p className="font-medium text-foreground">Coming soon</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Forum moderation tools are being prepared.
        </p>
      </div>
    </div>
  );
}
