"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    BookOpen,
    MessageSquare,
    Mail,
    Settings,
    LogOut,
} from "lucide-react";
import { signOut } from "@/actions/users";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/courses", label: "Courses", icon: BookOpen, exact: false },
    { href: "/dashboard/forums", label: "Forums", icon: MessageSquare, exact: false },
    { href: "/dashboard/messages", label: "Messages", icon: Mail, exact: false },
    { href: "/dashboard/settings", label: "Settings", icon: Settings, exact: false },
];

const roleLabel: Record<string, string> = {
    learner: "Phase 1 — Learner",
    disciple: "Phase 2 — Disciple",
    admin: "Administrator",
};

interface DashboardNavProps {
    userName: string;
    userEmail: string;
    userRole: string;
}

export function DashboardNav({ userName, userEmail, userRole }: DashboardNavProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push("/login");
        router.refresh();
    };

    return (
        <div className="flex h-full flex-col">
            {/* Brand */}
            <div className="border-b border-sidebar-border px-6 py-5">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    {roleLabel[userRole] ?? "Learner"}
                </p>
                <p className="mt-0.5 text-lg font-bold text-sidebar-primary">
                    Pneumademy
                </p>
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navItems.map(({ href, label, icon: Icon, exact }) => {
                    const isActive = exact
                        ? pathname === href
                        : pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                                isActive
                                    ? "bg-sidebar-accent text-sidebar-primary font-medium"
                                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            <span>{label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User + sign out */}
            <div className="border-t border-sidebar-border px-4 py-4">
                <div className="mb-3">
                    <p className="truncate text-sm font-medium text-sidebar-foreground">
                        {userName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
                </div>
                <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                    <LogOut className="h-4 w-4" />
                    Sign out
                </button>
            </div>
        </div>
    );
}
