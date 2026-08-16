"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number;
  autoColor?: boolean;
  indicatorClassName?: string;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value = 0, autoColor = true, indicatorClassName, ...props }, ref) => {
  const safeValue = typeof value === "number" && !isNaN(value) ? Math.max(0, value) : 0;
  const clampedPercentage = Math.min(safeValue, 100);

  let colorClass = "bg-primary";

  if (autoColor) {
    if (safeValue < 70) {
      colorClass = "bg-emerald-500";
    } else if (safeValue < 85) {
      colorClass = "bg-amber-500";
    } else if (safeValue <= 100) {
      colorClass = "bg-orange-500";
    } else {
      colorClass = "bg-red-500";
    }
  }

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 transition-all duration-300 ease-in-out",
          colorClass,
          indicatorClassName
        )}
        style={{ transform: `translateX(-${100 - clampedPercentage}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
