import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="flex min-h-screen bg-background">
            <aside className="fixed inset-y-0 left-0 z-10 w-60 bg-sidebar">
                <DashboardNav
                    userName={session.user.name}
                    userEmail={session.user.email}
                    userRole={session.user.role ?? "learner"}
                />
            </aside>
            <main className="ml-60 flex-1">{children}</main>
        </div>
    );
}
