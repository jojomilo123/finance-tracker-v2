export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded-xl" />
        <div className="h-32 w-full bg-muted animate-pulse rounded-xl" />
        <div className="h-24 w-full bg-muted animate-pulse rounded-xl" />
      </div>
    </div>
  );
}
