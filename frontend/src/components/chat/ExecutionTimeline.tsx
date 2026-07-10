import { Check, Loader2, X, Circle, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { ExecutionStep } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export function ExecutionTimeline({ steps }: { steps: ExecutionStep[] }) {
  const [open, setOpen] = useState(false);
  const done = steps.filter((s) => s.status === "completed").length;
  return (
    <div className="rounded-lg border bg-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-2 text-left text-xs font-medium"
      >
        <span className="flex items-center gap-2">
          <Loader2
            className={cn(
              "h-3.5 w-3.5",
              steps.some((s) => s.status === "running") && "animate-spin",
            )}
          />
          Agent execution · {done}/{steps.length}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <ol className="space-y-2 border-t px-3 py-3">
          {steps.map((s) => (
            <li key={s.id} className="flex items-start gap-2 text-xs">
              <StepIcon status={s.status} />
              <div className="min-w-0 flex-1">
                <div className="font-medium">{s.label}</div>
                {s.detail && (
                  <div className="mt-0.5 text-muted-foreground">{s.detail}</div>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function StepIcon({ status }: { status: ExecutionStep["status"] }) {
  const base = "mt-0.5 h-3.5 w-3.5 shrink-0";
  if (status === "completed")
    return <Check className={cn(base, "text-success")} />;
  if (status === "running")
    return <Loader2 className={cn(base, "animate-spin text-primary")} />;
  if (status === "failed")
    return <X className={cn(base, "text-destructive")} />;
  return <Circle className={cn(base, "text-muted-foreground")} />;
}
