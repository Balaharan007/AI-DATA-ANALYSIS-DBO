import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed bg-card/50 px-6 py-16 text-center",
        className,
      )}
    >
      {icon ? (
        <div className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-muted text-muted-foreground">
          {icon}
        </div>
      ) : null}
      <div className="text-sm font-medium">{title}</div>
      {description ? (
        <div className="mt-1 max-w-sm text-sm text-muted-foreground">
          {description}
        </div>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
