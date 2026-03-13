"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut } from "lucide-react";

export function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <Button
      variant="ghost"
      onClick={handleSignOut}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="mr-2 h-4 w-4" />
      )}
      {isLoading ? "Signing out..." : "Sign out"}
    </Button>
  );
}
