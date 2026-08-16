"use client";

import * as React from "react";
import { Edit3, Eye, ShieldCheck, AlertCircle, RefreshCw, Smartphone, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useTransactionStore } from "@/stores/use-transaction-store";
import {
  fetchActiveEditorLock,
  acquireEditorLock,
  forceHandoverEditor,
  isLockActive,
  getDeviceId,
  getDeviceName,
  EditorLockRecord,
} from "@/lib/editor-lock";

interface ModeSelectorProps {
  userId: string;
  onModeSelected: (mode: "EDITOR" | "VIEWER") => void;
}

export function ModeSelector({ userId, onModeSelected }: ModeSelectorProps) {
  const { toast } = useToast();
  const { setAppMode, setActiveEditorLock } = useTransactionStore();

  const [isLoading, setIsLoading] = React.useState(true);
  const [activeLock, setActiveLock] = React.useState<EditorLockRecord | null>(null);
  const [isHandoverConfirmOpen, setIsHandoverConfirmOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const currentDeviceId = getDeviceId();
  const currentDeviceName = getDeviceName();

  const loadEditorLockStatus = React.useCallback(async () => {
    setIsLoading(true);
    const lock = await fetchActiveEditorLock(userId);
    setActiveLock(lock);
    setActiveEditorLock(lock);
    setIsLoading(false);
  }, [userId, setActiveEditorLock]);

  React.useEffect(() => {
    loadEditorLockStatus();
  }, [loadEditorLockStatus]);

  const lockIsActive = isLockActive(activeLock);
  const isCurrentDeviceOwner = activeLock?.deviceId === currentDeviceId;
  const isAnotherEditorActive = lockIsActive && !isCurrentDeviceOwner;

  const handleSelectEditor = async () => {
    setIsSubmitting(true);
    const res = await acquireEditorLock(userId);
    setIsSubmitting(false);

    if (res.success) {
      setAppMode("EDITOR");
      setActiveEditorLock(res.activeLock);
      toast({
        variant: "success",
        title: "Mode Editor Aktif",
        description: `Perangkat ${currentDeviceName} berhasil menjadi Editor aktif.`,
      });
      onModeSelected("EDITOR");
    } else {
      setActiveLock(res.activeLock);
      setActiveEditorLock(res.activeLock);
      toast({
        variant: "destructive",
        title: "Editor Aktif Ditemukan",
        description: `Perangkat ${res.activeLock?.deviceName || "Lain"} sedang menjadi Editor. Masuk sebagai Viewer atau minta Handover.`,
      });
    }
  };

  const handleSelectViewer = () => {
    setAppMode("VIEWER");
    toast({
      title: "Mode Viewer (Read-Only)",
      description: "Anda masuk sebagai Viewer. Dashboard analitik & data dapat dipantau secara real-time.",
    });
    onModeSelected("VIEWER");
  };

  const handleHandoverEditor = async () => {
    setIsSubmitting(true);
    const newLock = await forceHandoverEditor(userId);
    setIsSubmitting(false);
    setIsHandoverConfirmOpen(false);

    if (newLock) {
      setAppMode("EDITOR");
      setActiveEditorLock(newLock);
      setActiveLock(newLock);
      toast({
        variant: "success",
        title: "Handover Berhasil",
        description: `Status Editor kini dialihkan ke perangkat ${currentDeviceName}.`,
      });
      onModeSelected("EDITOR");
    } else {
      toast({
        variant: "destructive",
        title: "Handover Gagal",
        description: "Gagal mengambil alih Editor. Silakan coba lagi.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080D16]/95 backdrop-blur-md px-4 py-8 overflow-y-auto">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Badge variant="outline" className="px-3 py-1 text-xs border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
            <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Multi-Device Security Engine
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Pilih Mode Akses Perangkat
          </h2>
          <p className="text-sm text-[#AAB5C5] max-w-md mx-auto">
            Tentukan peran perangkat ini. Sistem menjaga 1 Editor aktif dengan sinkronisasi real-time ke seluruh Viewer.
          </p>
        </div>

        {/* Current Device Card */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0D1420] border border-white/10 text-xs text-[#AAB5C5]">
          <div className="flex items-center space-x-2.5">
            <Laptop className="h-4 w-4 text-emerald-400" />
            <span>Perangkat Ini: <strong className="text-white">{currentDeviceName}</strong></span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadEditorLockStatus}
            disabled={isLoading}
            className="h-7 text-[11px] text-muted-foreground hover:text-white"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? "animate-spin" : ""}`} /> Refresh Lock
          </Button>
        </div>

        {/* Active Editor Info Banner if another device is active */}
        {isAnotherEditorActive && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-2">
            <div className="flex items-center space-x-2 font-semibold text-xs sm:text-sm">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
              <span>Editor Aktif Terdeteksi di Perangkat Lain</span>
            </div>
            <p className="text-xs text-amber-200/80">
              Perangkat <strong className="text-white underline">{activeLock?.deviceName}</strong> sedang memegang hak Editor saat ini. Perangkat ini dapat masuk sebagai Viewer atau meminta Handover Editor secara sengaja.
            </p>
          </div>
        )}

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Editor Mode Card */}
          <Card className={`relative overflow-hidden border transition-all duration-200 ${
            isAnotherEditorActive
              ? "bg-[#0D1420]/60 border-white/5 opacity-90"
              : "bg-[#0D1420] border-emerald-500/30 hover:border-emerald-500/60"
          }`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  <Edit3 className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">
                  1 Device Only
                </Badge>
              </div>
              <CardTitle className="text-lg font-bold text-white mt-3">Editor Mode</CardTitle>
              <CardDescription className="text-xs text-[#AAB5C5]">
                Hak penuh untuk menambah, mengedit, dan menghapus transaksi, akun, anggaran, &amp; target.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              <ul className="text-xs text-[#AAB5C5] space-y-1.5 list-disc list-inside">
                <li>Input &amp; ubah seluruh data keuangan</li>
                <li>Sinkronisasi instant ke seluruh Viewer</li>
                <li>Hanya 1 Editor aktif dalam satu waktu</li>
              </ul>

              {isAnotherEditorActive ? (
                <div className="space-y-2 pt-2">
                  <Button
                    onClick={() => setIsHandoverConfirmOpen(true)}
                    variant="outline"
                    className="w-full rounded-xl border-amber-500/40 text-amber-300 hover:bg-amber-500/10 text-xs font-semibold"
                    disabled={isSubmitting}
                  >
                    Minta Handover Editor (Ambil Alih)
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleSelectEditor}
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm"
                >
                  Pilih Editor Mode
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Viewer Mode Card */}
          <Card className="relative overflow-hidden border bg-[#0D1420] border-blue-500/30 hover:border-blue-500/60 transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/20">
                  <Eye className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-400">
                  Multi-Device (Unlimited)
                </Badge>
              </div>
              <CardTitle className="text-lg font-bold text-white mt-3">Viewer Mode</CardTitle>
              <CardDescription className="text-xs text-[#AAB5C5]">
                Mode pemantau Read-Only dengan Analytical Insights mendalam &amp; update real-time.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              <ul className="text-xs text-[#AAB5C5] space-y-1.5 list-disc list-inside">
                <li>Full Dashboard Analytical Insights</li>
                <li>Terima update real-time dari Editor</li>
                <li>Bebas digunakan di banyak perangkat</li>
              </ul>

              <Button
                onClick={handleSelectViewer}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm mt-2"
              >
                Masuk Sebagai Viewer
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Handover Dialog Confirmation */}
        {isHandoverConfirmOpen && (
          <div className="p-4 rounded-2xl bg-[#0D1420] border border-amber-500/40 text-white space-y-3 shadow-2xl">
            <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> Konfirmasi Handover Status Editor
            </h4>
            <p className="text-xs text-[#AAB5C5]">
              Apakah Anda yakin ingin mengambil alih status Editor dari perangkat <strong className="text-white">{activeLock?.deviceName}</strong>? Perangkat tersebut akan secara otomatis beralih menjadi Viewer.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsHandoverConfirmOpen(false)}
                className="rounded-xl text-xs border-white/10 text-white hover:bg-white/5"
              >
                Batal
              </Button>
              <Button
                size="sm"
                onClick={handleHandoverEditor}
                disabled={isSubmitting}
                className="rounded-xl text-xs bg-amber-600 hover:bg-amber-500 text-white font-semibold"
              >
                Ya, Ambil Alih Editor
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
