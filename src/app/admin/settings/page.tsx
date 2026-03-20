import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AdminSettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const { user } = session;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Admin account and platform configuration.
        </p>
      </div>

      <div className="max-w-lg space-y-6">
        <div className="rounded-lg border bg-background p-6">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Your Profile
          </h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-xs text-muted-foreground">Name</dt>
              <dd className="mt-0.5 text-sm font-medium text-foreground">{user.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Email</dt>
              <dd className="mt-0.5 text-sm font-medium text-foreground">{user.email}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Role</dt>
              <dd className="mt-0.5 text-sm font-medium text-foreground">Administrator</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border bg-background p-6">
          <h2 className="mb-1 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Platform
          </h2>
          <p className="text-xs text-muted-foreground">
            Platform-wide configuration options coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
