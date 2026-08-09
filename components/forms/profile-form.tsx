"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { User, Mail, Globe, Clock, Save, Camera } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email(),
  timezone: z.string(),
  currency: z.string(),
});

type ProfileValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "Demo User",
      email: "demo@financetracker.id",
      timezone: "Asia/Jakarta",
      currency: "IDR",
    },
  });

  const onSubmit = async (values: ProfileValues) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsLoading(false);
    toast({
      variant: "success",
      title: "Profil Diperbarui",
      description: "Informasi profil Anda berhasil disimpan.",
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Avatar Section */}
      <div className="flex items-center space-x-4 pb-4 border-b border-border">
        <div className="relative">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
              DU
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            className="absolute bottom-0 right-0 p-1 rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            title="Ubah Foto Profil"
          >
            <Camera className="h-3.5 w-3.5" />
          </button>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Foto Profil</h3>
          <p className="text-xs text-muted-foreground">
            JPG, PNG atau GIF. Maksimal 2MB.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground">Nama Lengkap</label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input {...register("name")} className="pl-9" />
          </div>
          {errors.name && (
            <p className="text-[11px] text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground">Alamat Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input {...register("email")} className="pl-9" disabled />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground">Zona Waktu</label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input {...register("timezone")} className="pl-9" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground">Mata Uang Utama</label>
          <div className="relative">
            <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input {...register("currency")} className="pl-9" disabled />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          className="rounded-xl"
          isLoading={isLoading}
          disabled={!isDirty && !isLoading}
        >
          <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
        </Button>
      </div>
    </form>
  );
}
