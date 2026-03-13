"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Loader2, Mail } from "lucide-react";

export default function VerifyEmailPage() {
  const { data: session } = authClient.useSession();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    if (!session?.user?.email) return;
    setError("");
    setIsLoading(true);
    setResent(false);

    const { error } = await authClient.sendVerificationEmail({
      email: session.user.email,
      callbackURL: "/dashboard",
    });

    if (error) {
      setError(error.message ?? "Failed to resend verification email");
    } else {
      setResent(true);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
          <CardDescription>
            {session?.user?.email ? (
              <>
                We sent a verification link to{" "}
                <strong>{session.user.email}</strong>. Click the link in the
                email to verify your account.
              </>
            ) : (
              "A verification link has been sent to your email address."
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          {resent && (
            <div className="rounded-md bg-primary/10 p-3 text-sm text-primary">
              Verification email resent. Check your inbox.
            </div>
          )}
          <Button
            variant="outline"
            className="w-full"
            onClick={handleResend}
            disabled={isLoading || !session?.user?.email}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Resend verification email"
            )}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already verified?{" "}
            <Link href="/dashboard" className="text-primary hover:underline">
              Go to dashboard
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
