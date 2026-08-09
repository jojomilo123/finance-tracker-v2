import * as React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  badge?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function KPICard({
  title,
  value,
  description,
  icon: Icon,
  badge,
  footer,
  className,
}: KPICardProps) {
  return (
    <Card className={cn("hover:border-border/80 transition-all", className)}>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-muted/60 text-primary">
              <Icon className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
          </div>
          {badge}
        </div>

        <div>
          <div className="text-2xl font-bold">{value}</div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>

        {footer && <div className="pt-2 border-t border-border">{footer}</div>}
      </CardContent>
    </Card>
  );
}
