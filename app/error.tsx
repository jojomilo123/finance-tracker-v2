"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="p-4 rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-bold">Terjadi Kesalahan System</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Aplikasi mengalami hambatan yang tidak terduga. Silakan coba memuat ulang komponen.
        </p>
      </div>
      <button
        onClick={() => reset()}
        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" /> Coba Lagi
      </button>
    </div>
  );
}
