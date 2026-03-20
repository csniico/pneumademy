"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  setUserRole,
  banUser,
  unbanUser,
  makeAdmin,
  revokeAdmin,
  setActiveStatus,
} from "@/actions/admin";

type User = {
  id: string;
  role: string;
  banned: boolean | null;
  isActive: boolean;
  isSystemAdmin: boolean;
};

function ActionButton({
  onClick,
  disabled,
  children,
  variant = "secondary",
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "destructive";
}) {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "bg-destructive text-white hover:bg-destructive/90",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-md px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </p>
  );
}

export function UserProfileActions({ user }: { user: User }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const run = (action: () => Promise<void>) => {
    startTransition(async () => {
      await action();
      router.refresh();
    });
  };

  if (user.isSystemAdmin) {
    return (
      <p className="text-sm text-muted-foreground">
        This is a system admin account and cannot be modified.
      </p>
    );
  }

  const isPromotedAdmin = user.role === "admin";

  if (user.banned) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          This user is banned. Unban them to restore access and modify their role.
        </p>
        <ActionButton
          variant="primary"
          disabled={isPending}
          onClick={() => run(() => unbanUser(user.id))}
        >
          Unban User
        </ActionButton>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Role */}
      <div>
        <SectionLabel>Role</SectionLabel>
        <div className="flex flex-col gap-2">
          {isPromotedAdmin ? (
            <ActionButton
              variant="secondary"
              disabled={isPending}
              onClick={() => run(() => revokeAdmin(user.id))}
            >
              Revoke Admin
            </ActionButton>
          ) : (
            <>
              {user.role === "learner" ? (
                <ActionButton
                  variant="primary"
                  disabled={isPending}
                  onClick={() => run(() => setUserRole(user.id, "disciple"))}
                >
                  Promote to Disciple
                </ActionButton>
              ) : (
                <ActionButton
                  variant="secondary"
                  disabled={isPending}
                  onClick={() => run(() => setUserRole(user.id, "learner"))}
                >
                  Demote to Learner
                </ActionButton>
              )}
              <ActionButton
                variant="secondary"
                disabled={isPending}
                onClick={() => run(() => makeAdmin(user.id))}
              >
                Make Admin
              </ActionButton>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Access */}
      <div>
        <SectionLabel>Access</SectionLabel>
        <div className="flex flex-col gap-2">
          <ActionButton
            variant={user.isActive ? "secondary" : "primary"}
            disabled={isPending}
            onClick={() => run(() => setActiveStatus(user.id, !user.isActive))}
          >
            {user.isActive ? "Disable Access" : "Enable Access"}
          </ActionButton>
          <ActionButton
            variant="destructive"
            disabled={isPending}
            onClick={() => run(() => banUser(user.id))}
          >
            Ban User
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
