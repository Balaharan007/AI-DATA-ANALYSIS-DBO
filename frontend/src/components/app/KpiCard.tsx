import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { KPI } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export function KpiCard({ kpi }: { kpi: KPI }) {
  const formatted = format(kpi.value, kpi.format);
  const up = (kpi.delta ?? 0) >= 0;
  return (
    <Card>
      <CardContent className="p-5">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          {kpi.label}
        </div>
        <div className="mt-2 text-2xl font-semibold tabular-nums">
          {formatted}
        </div>
        {typeof kpi.delta === "number" && (
          <div
            className={cn(
              "mt-1 inline-flex items-center gap-0.5 text-xs font-medium",
              up ? "text-success" : "text-destructive",
            )}
          >
            {up ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            {Math.abs(kpi.delta).toFixed(1)}%
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function format(v: number | string, f?: KPI["format"]) {
  if (typeof v === "string") return v;
  if (f === "currency")
    return v.toLocaleString(undefined, { style: "currency", currency: "USD" });
  if (f === "percent") return `${v.toFixed(1)}%`;
  return v.toLocaleString();
}
