import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BarChart3, Database, Info, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { KpiCard } from "@/components/app/KpiCard";
import { ChartCard } from "@/components/charts/ChartCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/app/EmptyState";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { endpoints } from "@/lib/api/endpoints";
import type { Dataset } from "@/lib/api/types";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({ meta: [{ title: "Dashboard — AI Data Analyst" }] }),
});

function DashboardPage() {
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>("");

  const { data: datasets = [] } = useQuery<Dataset[]>({
    queryKey: ["datasets"],
    queryFn: () => endpoints.listDatasets(),
    refetchInterval: 10_000,
  });

  // Auto-select first dataset if none selected
  const activeDatasetId = selectedDatasetId || datasets[0]?.id || "";

  const q = useQuery({
    queryKey: ["dashboard", activeDatasetId],
    queryFn: () => endpoints.getDashboard({ dataset_id: activeDatasetId }),
    enabled: !!activeDatasetId,
    retry: false,
  });

  const activeDataset = datasets.find((d) => d.id === activeDatasetId);

  return (
    <div className="mx-auto max-w-7xl p-6">
      <PageHeader
        title="Dashboard"
        description={
          activeDataset
            ? `BI overview for "${activeDataset.name}"`
            : "BI overview generated from your datasets."
        }
        actions={
          <div className="flex items-center gap-2">
            <Select
              value={activeDatasetId}
              onValueChange={setSelectedDatasetId}
            >
              <SelectTrigger className="h-9 w-56">
                <SelectValue placeholder="Select a dataset" />
              </SelectTrigger>
              <SelectContent>
                {datasets.length === 0 && (
                  <SelectItem value="" disabled>
                    No datasets available
                  </SelectItem>
                )}
                {datasets.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    <span className="flex items-center gap-2">
                      <DatabaseIcon className="h-3 w-3 shrink-0" />
                      <span className="truncate">{d.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => q.refetch()}
              disabled={!activeDatasetId}
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Refresh
            </Button>
          </div>
        }
      />

      {!activeDatasetId ? (
        <EmptyState
          icon={<BarChart3 className="h-4 w-4" />}
          title="No datasets uploaded"
          description="Upload a CSV, Excel, or image of a table to see an auto-generated dashboard with KPIs and charts."
        />
      ) : q.isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-[24rem] rounded-xl" />
            ))}
          </div>
        </div>
      ) : q.isError || !q.data ? (
        <EmptyState
          icon={<BarChart3 className="h-4 w-4" />}
          title="Dashboard unavailable"
          description="Could not load the dashboard. Try selecting a different dataset or refreshing."
        />
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            {q.data.kpis.map((k) => (
              <KpiCard key={k.id} kpi={k} />
            ))}
          </div>

          {/* Chart grid with descriptions */}
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            {q.data.charts.slice(0, 5).map((c) => (
              <div key={c.id} className="space-y-2">
                <ChartCard spec={c} />
                {c.description && (
                  <p className="px-1 text-xs leading-relaxed text-muted-foreground">
                    {c.description}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Dataset info footer */}
          {activeDataset && (
            <Card className="mt-8">
              <CardContent className="flex items-center gap-3 p-4 text-xs text-muted-foreground">
                <Info className="h-4 w-4 shrink-0" />
                <span>
                  Dashboard for <strong>{activeDataset.name}</strong> —{" "}
                  {activeDataset.rows.toLocaleString()} rows,{" "}
                  {activeDataset.columns} columns
                  {activeDataset.quality_score != null
                    ? `, quality score: ${activeDataset.quality_score}%`
                    : ""}
                </span>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function DatabaseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14c0 1.66 3.66 3 9 3s9-1.34 9-3V5" />
      <path d="M3 12c0 1.66 3.66 3 9 3s9-1.34 9-3" />
    </svg>
  );
}
