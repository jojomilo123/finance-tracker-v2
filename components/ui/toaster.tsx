"use client";

import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none px-4">
      {toasts.map((toast) => {
        const isSuccess = toast.variant === "success";
        const isDestructive = toast.variant === "destructive";

        return (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-start space-x-3 p-4 rounded-2xl border border-white/10 bg-[#121C2A] shadow-xl backdrop-blur-md transition-all duration-1000 ease-out animate-in fade-in-0 slide-in-from-bottom-4",
              isSuccess && "border-[#10b981]/30 bg-[#10b981]/15 text-[#F5F7FA]",
              isDestructive && "border-destructive/30 bg-destructive/15 text-[#F5F7FA]"
            )}
            style={{
              animation: "toastFadeOut 3s cubic-bezier(0.4, 0, 0.2, 1) forwards",
            }}
          >
            {isSuccess && <CheckCircle2 className="h-5 w-5 text-[#10b981] shrink-0 mt-0.5" />}
            {isDestructive && <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />}
            {!isSuccess && !isDestructive && <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />}

            <div className="flex-1 space-y-1 min-w-0">
              {toast.title && <h4 className="text-sm font-bold text-[#F5F7FA] leading-none truncate">{toast.title}</h4>}
              {toast.description && <p className="text-xs text-[#AAB5C5] break-words">{toast.description}</p>}
              {toast.action && <div className="pt-1">{toast.action}</div>}
            </div>

            <button
              onClick={() => dismiss(toast.id)}
              className="text-[#AAB5C5] hover:text-white rounded-lg p-1 transition-colors shrink-0"
              aria-label="Tutup"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
