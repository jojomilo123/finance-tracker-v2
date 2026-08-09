"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { useToast } from "@/components/ui/use-toast";
import { AccountType } from "@prisma/client";
import { Building2, Wallet, Smartphone, CreditCard, Landmark, Check } from "lucide-react";

const accountSchema = z.object({
  name: z.string().min(2, "Nama akun minimal 2 karakter"),
  accountType: z.nativeEnum(AccountType),
  currentBalance: z.number().min(0, "Saldo tidak boleh negatif"),
  color: z.string(),
  isDefault: z.boolean(),
});

export type AccountFormValues = z.infer<typeof accountSchema>;

interface AccountFormProps {
  defaultValues?: Partial<AccountFormValues>;
  onSubmitSuccess: (values: AccountFormValues) => void;
  onCancel: () => void;
}

const COLOR_OPTIONS = [
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Purple
  "#06b6d4", // Cyan
  "#ec4899", // Pink
  "#0056a4", // BCA Blue
  "#003d79", // Mandiri Blue
];

export function AccountForm({
  defaultValues,
  onSubmitSuccess,
  onCancel,
}: AccountFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      accountType: defaultValues?.accountType || AccountType.BANK,
      currentBalance: defaultValues?.currentBalance || 0,
      color: defaultValues?.color || "#3b82f6",
      isDefault: defaultValues?.isDefault || false,
    },
  });

  const selectedColor = watch("color");
  const selectedType = watch("accountType");
  const balanceVal = watch("currentBalance");

  const onSubmit = async (values: AccountFormValues) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setIsLoading(false);
    onSubmitSuccess(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label className="text-xs font-medium text-foreground">Nama Akun / Bank</label>
        <Input
          {...register("name")}
          placeholder="Contoh: BCA Utama, Mandiri, SeaBank, Cash"
        />
        {errors.name && (
          <p className="text-[11px] text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-foreground">Tipe Akun</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {[
            { type: AccountType.BANK, label: "Bank", icon: Building2 },
            { type: AccountType.E_WALLET, label: "E-Wallet", icon: Smartphone },
            { type: AccountType.CASH, label: "Tunai", icon: Wallet },
            { type: AccountType.CREDIT_CARD, label: "Kartu Kredit", icon: CreditCard },
            { type: AccountType.INVESTMENT, label: "Investasi", icon: Landmark },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = selectedType === item.type;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => setValue("accountType", item.type)}
                className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:bg-accent"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-foreground">Saldo Awal</label>
        <CurrencyInput
          value={balanceVal}
          onChange={(val) => setValue("currentBalance", val)}
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-foreground">Warna Identifikasi</label>
        <div className="flex flex-wrap gap-2 pt-1">
          {COLOR_OPTIONS.map((c) => (
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

      <div className="flex items-center space-x-2 pt-2">
        <input
          type="checkbox"
          id="isDefault"
          {...register("isDefault")}
          className="rounded border-border text-primary focus:ring-primary"
        />
        <label htmlFor="isDefault" className="text-xs font-medium cursor-pointer">
          Jadikan sebagai Akun Utama (Default)
        </label>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Simpan Akun
        </Button>
      </div>
    </form>
  );
}
