"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { TransactionType } from "@prisma/client";
import { TrendingDown, TrendingUp, ArrowLeftRight, Store, FileText } from "lucide-react";

const transactionSchema = z.object({
  transactionType: z.nativeEnum(TransactionType),
  title: z.string().min(2, "Judul transaksi minimal 2 karakter"),
  amount: z.number().positive("Jumlah harus lebih besar dari 0"),
  date: z.string(),
  accountId: z.string().min(1, "Pilih akun asal"),
  toAccountId: z.string().optional(),
  categoryId: z.string().min(1, "Pilih kategori"),
  merchant: z.string().optional(),
  note: z.string().optional(),
}).refine((data) => {
  if (data.transactionType === "TRANSFER") {
    return !!data.toAccountId && data.accountId !== data.toAccountId;
  }
  return true;
}, {
  message: "Akun tujuan harus dipilih dan berbeda dari akun asal",
  path: ["toAccountId"],
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;

export interface AccountOption {
  id: string;
  name: string;
}

export interface CategoryOption {
  id: string;
  name: string;
  type: string; // EXPENSE | INCOME | TRANSFER
}

export const COMPREHENSIVE_CATEGORIES: CategoryOption[] = [
  // Expense Categories
  { id: "cat-exp-1", name: "Makanan & Minuman", type: "EXPENSE" },
  { id: "cat-exp-2", name: "Tempat Tinggal & Sewa", type: "EXPENSE" },
  { id: "cat-exp-3", name: "Transportasi & Bensin", type: "EXPENSE" },
  { id: "cat-exp-4", name: "Internet, Listrik & Tagihan", type: "EXPENSE" },
  { id: "cat-exp-5", name: "Hiburan & Rekreasi", type: "EXPENSE" },
  { id: "cat-exp-6", name: "Belanja Harian & Groceries", type: "EXPENSE" },
  { id: "cat-exp-7", name: "Kesehatan & Olahraga", type: "EXPENSE" },
  { id: "cat-exp-8", name: "Pendidikan & Kursus", type: "EXPENSE" },
  { id: "cat-exp-9", name: "Pemberian & Perawatan Diri", type: "EXPENSE" },
  { id: "cat-exp-10", name: "Pengeluaran Lainnya", type: "EXPENSE" },

  // Income Categories
  { id: "cat-inc-1", name: "Gaji Utama", type: "INCOME" },
  { id: "cat-inc-2", name: "Freelance & Proyek", type: "INCOME" },
  { id: "cat-inc-3", name: "Hasil Investasi & Dividen", type: "INCOME" },
  { id: "cat-inc-4", name: "Penjualan Barang", type: "INCOME" },
  { id: "cat-inc-5", name: "Bonus & THR", type: "INCOME" },
  { id: "cat-inc-6", name: "Pemasukan Lainnya", type: "INCOME" },

  // Transfer Category
  { id: "cat-trf-1", name: "Transfer Antar Rekening", type: "TRANSFER" },
];

interface TransactionFormProps {
  accounts: AccountOption[];
  categories?: CategoryOption[];
  defaultValues?: Partial<TransactionFormValues>;
  lockType?: "EXPENSE" | "INCOME" | "TRANSFER";
  onSubmitSuccess: (values: TransactionFormValues) => void;
  onCancel: () => void;
}

export function TransactionForm({
  accounts,
  categories = COMPREHENSIVE_CATEGORIES,
  defaultValues,
  lockType,
  onSubmitSuccess,
  onCancel,
}: TransactionFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const initialType = lockType || defaultValues?.transactionType || TransactionType.EXPENSE;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      transactionType: initialType,
      title: defaultValues?.title || "",
      amount: defaultValues?.amount || 0,
      date: defaultValues?.date || new Date().toISOString().split("T")[0],
      accountId: defaultValues?.accountId || accounts[0]?.id || "",
      toAccountId: defaultValues?.toAccountId || "",
      categoryId: defaultValues?.categoryId || categories[0]?.id || "",
      merchant: defaultValues?.merchant || "",
      note: defaultValues?.note || "",
    },
  });

  const selectedType = watch("transactionType");
  const amountVal = watch("amount");

  const filteredCategories = categories.filter((c) =>
    selectedType === "TRANSFER" ? c.type === "TRANSFER" || c.type === "EXPENSE" : c.type === selectedType
  );

  React.useEffect(() => {
    if (filteredCategories.length > 0 && !watch("categoryId")) {
      setValue("categoryId", filteredCategories[0].id);
    }
  }, [selectedType]);

  const onSubmit = async (values: TransactionFormValues) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setIsLoading(false);
    onSubmitSuccess(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4 text-left">
      {/* Type Switcher Tabs (Hidden if locked) */}
      {!lockType && (
        <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-muted/60">
          <button
            type="button"
            onClick={() => {
              setValue("transactionType", TransactionType.EXPENSE);
              const firstExp = categories.find((c) => c.type === "EXPENSE");
              if (firstExp) setValue("categoryId", firstExp.id);
            }}
            className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              selectedType === TransactionType.EXPENSE
                ? "bg-card text-rose-500 shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <TrendingDown className="h-3.5 w-3.5" />
            <span>Pengeluaran</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setValue("transactionType", TransactionType.INCOME);
              const firstInc = categories.find((c) => c.type === "INCOME");
              if (firstInc) setValue("categoryId", firstInc.id);
            }}
            className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              selectedType === TransactionType.INCOME
                ? "bg-card text-emerald-500 shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Pemasukan</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setValue("transactionType", TransactionType.TRANSFER);
              const firstTrf = categories.find((c) => c.type === "TRANSFER");
              if (firstTrf) setValue("categoryId", firstTrf.id);
            }}
            className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              selectedType === TransactionType.TRANSFER
                ? "bg-card text-blue-500 shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ArrowLeftRight className="h-3.5 w-3.5" />
            <span>Transfer</span>
          </button>
        </div>
      )}

      {/* Amount Input */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-foreground">Jumlah Transaksi</label>
        <CurrencyInput
          value={amountVal}
          onChange={(val) => setValue("amount", val)}
        />
        {errors.amount && (
          <p className="text-[11px] text-destructive">{errors.amount.message}</p>
        )}
      </div>

      {/* Title Input */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-foreground">Judul / Deskripsi Ringkas</label>
        <Input
          {...register("title")}
          placeholder={
            selectedType === "TRANSFER"
              ? "Contoh: Transfer Saldo BCA ke GoPay"
              : selectedType === "INCOME"
              ? "Contoh: Gaji Bulanan, Bonus Proyek"
              : "Contoh: Makan Siang Restoran, Belanja Groceries"
          }
        />
        {errors.title && (
          <p className="text-[11px] text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Account & Target Account Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground">
            {selectedType === "TRANSFER" ? "Dari Akun (Asal)" : "Akun Keuangan"}
          </label>
          <select
            {...register("accountId")}
            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name}
              </option>
            ))}
          </select>
        </div>

        {selectedType === "TRANSFER" ? (
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Ke Akun Tujuan</label>
            <select
              {...register("toAccountId")}
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Pilih Akun Tujuan</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
            {errors.toAccountId && (
              <p className="text-[11px] text-destructive">{errors.toAccountId.message}</p>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Kategori</label>
            <select
              {...register("categoryId")}
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Date & Merchant Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground">Tanggal</label>
          <Input {...register("date")} type="date" className="h-10 py-1.5 px-3 text-sm" style={{ height: "40px", minHeight: "40px", maxHeight: "40px", paddingTop: "6px", paddingBottom: "6px", boxSizing: "border-box" }} />
        </div>

        {selectedType === "EXPENSE" && (
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Merchant / Toko (Opsional)</label>
            <div className="relative">
              <Store className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                {...register("merchant")}
                placeholder="Contoh: Tokopedia, McDonald's"
                className="pl-9"
              />
            </div>
          </div>
        )}
      </div>

      {/* Note Input */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-foreground">Catatan Tambahan (Opsional)</label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            {...register("note")}
            placeholder="Catatan kecil mengenai transaksi ini..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="sticky -bottom-4 sm:-bottom-6 bg-background/95 backdrop-blur-sm pt-3 sm:pt-4 pb-2 border-t border-border flex items-center justify-end space-x-2 z-10">
        <Button type="button" variant="outline" onClick={onCancel} className="rounded-xl h-9 sm:h-10 text-xs sm:text-sm">
          Batal
        </Button>
        <Button type="submit" isLoading={isLoading} className="rounded-xl h-9 sm:h-10 text-xs sm:text-sm bg-[#10b981] hover:bg-[#10b981]/90 text-white font-medium">
          Simpan Transaksi
        </Button>
      </div>
    </form>
  );
}
