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
  color = "zinc",
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
  color?: "zinc" | "blue" | "amber" | "red" | "green";
}) {
  const colors = {
    zinc: "bg-zinc-700 hover:bg-zinc-600 text-white",
    blue: "bg-blue-600 hover:bg-blue-500 text-white",
    amber: "bg-amber-600 hover:bg-amber-500 text-white",
    red: "bg-red-700 hover:bg-red-600 text-white",
    green: "bg-green-700 hover:bg-green-600 text-white",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-md px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${colors[color]}`}
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

  return (
    <div className="space-y-5">
      {/* Role */}
      <div>
        <SectionLabel>Role</SectionLabel>
        <div className="flex flex-col gap-2">
          {isPromotedAdmin ? (
            <ActionButton
              color="amber"
              disabled={isPending}
              onClick={() => run(() => revokeAdmin(user.id))}
            >
              Revoke Admin
            </ActionButton>
          ) : (
            <>
              {user.role === "learner" ? (
                <ActionButton
                  color="blue"
                  disabled={isPending}
                  onClick={() => run(() => setUserRole(user.id, "disciple"))}
                >
                  Promote to Disciple
                </ActionButton>
              ) : (
                <ActionButton
                  color="zinc"
                  disabled={isPending}
                  onClick={() => run(() => setUserRole(user.id, "learner"))}
                >
                  Demote to Learner
                </ActionButton>
              )}
              <ActionButton
                color="amber"
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
            color={user.isActive ? "zinc" : "green"}
            disabled={isPending}
            onClick={() => run(() => setActiveStatus(user.id, !user.isActive))}
          >
            {user.isActive ? "Disable Access" : "Enable Access"}
          </ActionButton>

          {user.banned ? (
            <ActionButton
              color="green"
              disabled={isPending}
              onClick={() => run(() => unbanUser(user.id))}
            >
              Unban User
            </ActionButton>
          ) : (
            <ActionButton
              color="red"
              disabled={isPending}
              onClick={() => run(() => banUser(user.id))}
            >
              Ban User
            </ActionButton>
          )}
        </div>
      </div>
    </div>
  );
}
