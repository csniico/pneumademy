import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const roleLabel: Record<string, string> = {
    learner: "Phase 1 — Learner",
    disciple: "Phase 2 — Disciple",
    admin: "Administrator",
};

export default async function SettingsPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/login");

    const { user } = session;
    const role = user.role ?? "learner";

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">Settings</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Your account information.
                </p>
            </div>

            <div className="max-w-lg space-y-6">
                <div className="rounded-lg border bg-background p-6">
                    <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                        Profile
                    </h2>
                    <dl className="space-y-4">
                        <div>
                            <dt className="text-xs text-muted-foreground">Name</dt>
                            <dd className="mt-0.5 text-sm font-medium text-foreground">
                                {user.name}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-muted-foreground">Email</dt>
                            <dd className="mt-0.5 text-sm font-medium text-foreground">
                                {user.email}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-muted-foreground">Role</dt>
                            <dd className="mt-0.5 text-sm font-medium text-foreground">
                                {roleLabel[role] ?? role}
                            </dd>
                        </div>
                    </dl>
                </div>

                <div className="rounded-lg border bg-background p-6">
                    <h2 className="mb-1 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                        Account
                    </h2>
                    <p className="mb-4 text-xs text-muted-foreground">
                        Contact your church administrator to update your account details.
                    </p>
                    <div className="text-xs text-muted-foreground">
                        Email verified:{" "}
                        <span className="font-medium text-foreground">
                            {user.emailVerified ? "Yes" : "No"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
