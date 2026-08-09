"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryType } from "@prisma/client";
import { Check } from "lucide-react";

const categorySchema = z.object({
  name: z.string().min(2, "Nama kategori minimal 2 karakter"),
  type: z.nativeEnum(CategoryType),
  color: z.string(),
  icon: z.string(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  defaultValues?: Partial<CategoryFormValues>;
  onSubmitSuccess: (values: CategoryFormValues) => void;
  onCancel: () => void;
}

const CATEGORY_COLORS = [
  "#ef4444", "#3b82f6", "#f59e0b", "#8b5cf6",
  "#ec4899", "#dc2626", "#14b8a6", "#10b981",
  "#a855f7", "#0284c7", "#f97316", "#06b6d4",
];

export function CategoryForm({
  defaultValues,
  onSubmitSuccess,
  onCancel,
}: CategoryFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: defaultValues?.name || "",
      type: defaultValues?.type || CategoryType.EXPENSE,
      color: defaultValues?.color || "#3b82f6",
      icon: defaultValues?.icon || "Folder",
    },
  });

  const selectedColor = watch("color");
  const selectedType = watch("type");

  const onSubmit = async (values: CategoryFormValues) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setIsLoading(false);
    onSubmitSuccess(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label className="text-xs font-medium text-foreground">Nama Kategori</label>
        <Input {...register("name")} placeholder="Contoh: Makanan & Minuman, Transportasi" />
        {errors.name && (
          <p className="text-[11px] text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-foreground">Tipe Kategori</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setValue("type", CategoryType.EXPENSE)}
            className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
              selectedType === CategoryType.EXPENSE
                ? "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                : "border-border hover:bg-accent"
            }`}
          >
            Pengeluaran (Expense)
          </button>
          <button
            type="button"
            onClick={() => setValue("type", CategoryType.INCOME)}
            className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
              selectedType === CategoryType.INCOME
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-border hover:bg-accent"
            }`}
          >
            Pemasukan (Income)
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-foreground">Warna Kategori</label>
        <div className="flex flex-wrap gap-2 pt-1">
          {CATEGORY_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setValue("color", c)}
              className="h-7 w-7 rounded-full flex items-center justify-center transition-transform hover:scale-110"
              style={{ backgroundColor: c }}
            >
              {selectedColor === c && <Check className="h-4 w-4 text-white" />}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Simpan Kategori
        </Button>
      </div>
    </form>
  );
}
