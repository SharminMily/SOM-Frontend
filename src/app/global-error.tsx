"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="max-w-lg w-full text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-6xl font-bold text-destructive">
                Oops!
              </h1>

              <h2 className="text-2xl font-semibold">
                Something went wrong
              </h2>

              <p className="text-muted-foreground">
                An unexpected error occurred while loading this page.
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <Button
                onClick={() => reset()}
              >
                Try Again
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  window.location.href = "/dashboard";
                }}
              >
                Go Dashboard
              </Button>
            </div>

            <div className="rounded-lg border p-4 bg-muted text-left">
              <p className="text-sm font-medium mb-2">
                Error Details
              </p>

              <code className="text-xs break-all text-red-500">
                {error.message}
              </code>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}