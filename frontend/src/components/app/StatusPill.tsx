import { cn } from "@/lib/utils";

export function StatusPill({
  status,
  label,
}: {
  status: "ok" | "warn" | "error" | "info" | "muted";
  label: string;
}) {
  const map: Record<string, string> = {
    ok: "bg-success/15 text-success",
    warn: "bg-warning/15 text-warning",
    error: "bg-destructive/15 text-destructive",
    info: "bg-primary/15 text-primary",
    muted: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
        map[status],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
