"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Sparkles, Check } from "lucide-react";

interface BudgetTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyTemplate: (templateBudgets: Record<string, number>) => void;
}

export const BUDGET_TEMPLATES = [
  {
    id: "minimal",
    name: "Minimal Living (Hemat)",
    description: "Alokasi ketat untuk prioritas kebutuhan dasar dan tabungan maksimal.",
    allocations: {
      "Makanan & Minuman": 1200000,
      "Tempat Tinggal": 800000,
      "Transportasi": 400000,
      "Internet": 200000,
      "Hiburan": 200000,
    },
  },
  {
    id: "balanced",
    name: "Balanced Living (Seimbang)",
    description: "Proporsi seimbang 50/30/20 untuk kebutuhan, keinginan, dan investasi.",
    allocations: {
      "Makanan & Minuman": 1800000,
      "Tempat Tinggal": 1000000,
      "Transportasi": 600000,
      "Internet": 300000,
      "Hiburan": 500000,
    },
  },
  {
    id: "aggressive-saving",
    name: "Aggressive Saving (Tabungan Maksimal)",
    description: "Fokus menekan biaya hidup harian untuk mencapai target finansial/FIRE.",
    allocations: {
      "Makanan & Minuman": 1000000,
      "Tempat Tinggal": 700000,
      "Transportasi": 350000,
      "Internet": 200000,
      "Hiburan": 150000,
    },
  },
  {
    id: "family",
    name: "Family Living (Keluarga)",
    description: "Alokasi anggaran komprehensif untuk kebutuhan rumah tangga dan kesehatan.",
    allocations: {
      "Makanan & Minuman": 3000000,
      "Tempat Tinggal": 1500000,
      "Transportasi": 1000000,
      "Internet": 400000,
      "Hiburan": 800000,
    },
  },
];

export function BudgetTemplateModal({
  open,
  onOpenChange,
  onApplyTemplate,
}: BudgetTemplateModalProps) {
  const [selectedId, setSelectedId] = React.useState<string>("balanced");

  const selectedTemplate = BUDGET_TEMPLATES.find((t) => t.id === selectedId);

  const handleApply = () => {
    if (selectedTemplate) {
      onApplyTemplate(selectedTemplate.allocations);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" /> Template Anggaran Otomatis
          </DialogTitle>
          <DialogDescription>
            Pilih pola alokasi anggaran yang sesuai dengan gaya hidup finansial Anda.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {BUDGET_TEMPLATES.map((tmpl) => {
            const isSelected = tmpl.id === selectedId;
            const total = Object.values(tmpl.allocations).reduce((a, b) => a + b, 0);

            return (
              <div
                key={tmpl.id}
                onClick={() => setSelectedId(tmpl.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border hover:bg-accent"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground">{tmpl.name}</h4>
                  <span className="text-xs font-mono font-bold text-primary">
                    Total {formatCurrency(total)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {tmpl.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleApply}>
            <Check className="mr-1.5 h-4 w-4" /> Terapkan Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
