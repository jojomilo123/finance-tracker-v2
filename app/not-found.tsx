import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="p-4 rounded-full bg-muted text-muted-foreground">
        <FileQuestion className="h-8 w-8" />
      </div>
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">Halaman Tidak Ditemukan</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
      </div>
      <Link
        href="/"
        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
      >
        <Home className="h-4 w-4" /> Kembali ke Beranda
      </Link>
    </div>
  );
}
