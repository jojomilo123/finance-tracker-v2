import * as React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="p-2.5 rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              {APP_CONFIG.name}
            </span>
          </Link>
          <p className="text-xs text-muted-foreground">
            Platform Manajemen Keuangan SaaS Premium
          </p>
        </div>

        {/* Auth Card Content */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-md sm:p-8 space-y-6">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {APP_CONFIG.name}. All rights reserved.
        </p>
      </div>
    </div>
  );
}
