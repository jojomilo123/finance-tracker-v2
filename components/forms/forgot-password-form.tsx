"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Mail, ArrowLeft, Send } from "lucide-react";

const forgotSchema = z.object({
  email: z.string().email("Format email tidak valid"),
});

type ForgotValues = z.infer<typeof forgotSchema>;

export function ForgotPasswordForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSent, setIsSent] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotValues) => {
    setIsLoading(true);
    try {
      // Simulate sending token
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSent(true);
      toast({
        variant: "success",
        title: "Tautan Dikirim",
        description: `Tautan atur ulang kata sandi telah dikirim ke ${values.email}`,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Gagal Mengirim",
        description: "Terjadi kesalahan saat mengirim instruksi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold tracking-tight">Lupa Kata Sandi</h1>
        <p className="text-xs text-muted-foreground">
          Masukkan email yang terdaftar untuk menerima petunjuk pemulihan
        </p>
      </div>

      {isSent ? (
        <div className="space-y-4 text-center py-4">
          <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-600 inline-block">
            <Send className="h-6 w-6" />
          </div>
          <p className="text-xs text-muted-foreground">
            Periksa kotak masuk email Anda. Klik tautan dalam email untuk mengatur kata sandi baru.
          </p>
          <Button
            variant="outline"
            className="w-full rounded-xl"
            onClick={() => setIsSent(false)}
          >
            Kirim Ulang Email
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                {...register("email")}
                type="email"
                placeholder="nama@email.com"
                className="pl-9"
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl"
            isLoading={isLoading}
          >
            Kirim Tautan Pemulihan
          </Button>
        </form>
      )}

      <div className="text-center pt-2">
        <Link
          href="/login"
          className="inline-flex items-center text-xs font-medium text-primary hover:underline"
        >
          <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Kembali ke Halaman Masuk
        </Link>
      </div>
    </div>
  );
}
