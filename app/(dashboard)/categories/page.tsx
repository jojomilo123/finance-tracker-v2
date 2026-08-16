"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { CategoryForm, CategoryFormValues } from "@/components/forms/category-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useTransactionStore } from "@/stores/use-transaction-store";
import { ViewerAnalyticsDashboard } from "@/components/analytics/viewer-analytics-dashboard";
import { Plus, Search, TrendingUp, TrendingDown, ArrowLeftRight, Archive } from "lucide-react";
import { CategoryType } from "@prisma/client";

interface DemoCategory {
  id: string;
  name: string;
  type: string; // EXPENSE | INCOME | TRANSFER
  color: string;
  icon: string;
  archived: boolean;
}

const INITIAL_CATEGORIES: DemoCategory[] = [
  // Expense
  { id: "1", name: "Makanan & Minuman", type: "EXPENSE", color: "#ef4444", icon: "Utensils", archived: false },
  { id: "2", name: "Tempat Tinggal & Sewa", type: "EXPENSE", color: "#3b82f6", icon: "Home", archived: false },
  { id: "3", name: "Transportasi & Bensin", type: "EXPENSE", color: "#f59e0b", icon: "Car", archived: false },
  { id: "4", name: "Internet, Listrik & Tagihan", type: "EXPENSE", color: "#8b5cf6", icon: "Wifi", archived: false },
  { id: "5", name: "Hiburan & Rekreasi", type: "EXPENSE", color: "#ec4899", icon: "Film", archived: false },
  { id: "6", name: "Belanja Harian & Groceries", type: "EXPENSE", color: "#dc2626", icon: "ShoppingBag", archived: false },
  { id: "7", name: "Kesehatan & Olahraga", type: "EXPENSE", color: "#14b8a6", icon: "HeartPulse", archived: false },
  { id: "8", name: "Pendidikan & Kursus", type: "EXPENSE", color: "#a855f7", icon: "GraduationCap", archived: false },

  // Income
  { id: "9", name: "Gaji Utama", type: "INCOME", color: "#10b981", icon: "Briefcase", archived: false },
  { id: "10", name: "Freelance & Proyek", type: "INCOME", color: "#8b5cf6", icon: "Laptop", archived: false },
  { id: "11", name: "Hasil Investasi & Dividen", type: "INCOME", color: "#06b6d4", icon: "TrendingUp", archived: false },
  { id: "12", name: "Bonus & THR", type: "INCOME", color: "#f59e0b", icon: "Gift", archived: false },

  // Transfer
  { id: "13", name: "Transfer Antar Rekening", type: "TRANSFER", color: "#3b82f6", icon: "ArrowLeftRight", archived: false },
  { id: "14", name: "Top Up E-Wallet", type: "TRANSFER", color: "#06b6d4", icon: "Smartphone", archived: false },
];

export default function CategoriesPage() {
  const { toast } = useToast();
  const { appMode } = useTransactionStore();
  const [categories, setCategories] = React.useState<DemoCategory[]>(INITIAL_CATEGORIES);
  const [activeTab, setActiveTab] = React.useState<string>("EXPENSE");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  if (appMode === "VIEWER") {
    return (
      <DashboardShell>
        <ViewerAnalyticsDashboard />
      </DashboardShell>
    );
  }

  const handleCreateCategory = (values: CategoryFormValues) => {
    const newCat: DemoCategory = {
      id: Date.now().toString(),
      name: values.name,
      type: values.type,
      color: values.color,
      icon: values.icon,
      archived: false,
    };

    setCategories((prev) => [...prev, newCat]);
    setIsModalOpen(false);
    toast({
      variant: "success",
      title: "Kategori Dibuat",
      description: `Kategori ${values.name} (${values.type}) berhasil ditambahkan.`,
    });
  };

  const handleArchive = (id: string, name: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, archived: true } : c))
    );
    toast({
      title: "Kategori Diarsip",
      description: `Kategori ${name} telah diarsipkan.`,
    });
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.type === activeTab &&
      !c.archived &&
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-card border border-border shadow-sm">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Kategori Transaksi</h1>
            <p className="text-sm text-muted-foreground">
              Atur pos anggaran pengeluaran, sumber pemasukan, dan kategori transfer saldo.
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="rounded-xl gap-2">
            <Plus className="h-4 w-4" /> Kategori Baru
          </Button>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Income vs Expense vs Transfer Tabs */}
          <div className="flex p-1 rounded-xl bg-muted/60 border border-border w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("EXPENSE")}
              className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "EXPENSE"
                  ? "bg-card text-rose-500 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <TrendingDown className="h-3.5 w-3.5" />
              <span>Pengeluaran ({categories.filter((c) => c.type === "EXPENSE" && !c.archived).length})</span>
            </button>
            <button
              onClick={() => setActiveTab("INCOME")}
              className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "INCOME"
                  ? "bg-card text-emerald-500 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Pemasukan ({categories.filter((c) => c.type === "INCOME" && !c.archived).length})</span>
            </button>
            <button
              onClick={() => setActiveTab("TRANSFER")}
              className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "TRANSFER"
                  ? "bg-card text-blue-500 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ArrowLeftRight className="h-3.5 w-3.5" />
              <span>Transfer ({categories.filter((c) => c.type === "TRANSFER" && !c.archived).length})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kategori..."
              className="pl-9 text-xs"
            />
          </div>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="p-4 rounded-xl border border-border bg-card shadow-sm hover:border-primary/40 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-sm font-semibold">{cat.name}</span>
              </div>
              <button
                onClick={() => handleArchive(cat.id, cat.name)}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                title="Arsip Kategori"
              >
                <Archive className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Create Category */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Buat Kategori Baru</DialogTitle>
            <DialogDescription>
              Tambahkan pos kategori pengeluaran, pemasukan, atau transfer baru.
            </DialogDescription>
          </DialogHeader>
          <CategoryForm
            onSubmitSuccess={handleCreateCategory}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
