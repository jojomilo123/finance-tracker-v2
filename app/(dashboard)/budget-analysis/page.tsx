"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ViewerAnalyticsDashboard } from "@/components/analytics/viewer-analytics-dashboard";

export default function BudgetAnalysisPage() {
  return (
    <DashboardShell>
      <ViewerAnalyticsDashboard />
    </DashboardShell>
  );
}
