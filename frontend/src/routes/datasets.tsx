import {
  createFileRoute,
  Link,
  Outlet,
  useMatches,
} from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Database, Trash2, Upload, Eye } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/app/EmptyState";
import { endpoints } from "@/lib/api/endpoints";
import { toast } from "sonner";

export const Route = createFileRoute("/datasets")({
  component: DatasetsLayout,
});

function DatasetsLayout() {
  const matches = useMatches();
  const isChild = matches.some(
    (m) => m.routeId !== "/datasets" && m.routeId.startsWith("/datasets"),
  );
  return isChild ? <Outlet /> : <DatasetsIndex />;
}

function DatasetsIndex() {
  const qc = useQueryClient();
  const datasets = useQuery({
    queryKey: ["datasets"],
    queryFn: endpoints.listDatasets,
    retry: false,
  });
  const del = useMutation({
    mutationFn: (id: string) => endpoints.deleteDataset(id),
    onSuccess: () => {
      toast.success("Dataset deleted");
      qc.invalidateQueries({ queryKey: ["datasets"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="mx-auto max-w-7xl p-6">
      <PageHeader
        title="Datasets"
        description="All uploaded datasets and their extraction status."
        actions={
          <Button asChild>
            <Link to="/datasets/upload">
              <Upload className="mr-1.5 h-4 w-4" />
              Upload dataset
            </Link>
          </Button>
        }
      />

      {datasets.isLoading ? (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : datasets.isError || !datasets.data?.length ? (
        <EmptyState
          icon={<Database className="h-4 w-4" />}
          title="No datasets yet"
          description="Upload a CSV, PDF, DOCX, or image to begin analysis."
          action={
            <Button asChild>
              <Link to="/datasets/upload">
                <Upload className="mr-1.5 h-4 w-4" />
                Upload dataset
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {datasets.data.map((d) => (
            <Card key={d.id} className="flex flex-col">
              <CardContent className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">
                      {d.name}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {new Date(d.uploaded_at).toLocaleString()}
                    </div>
                  </div>
                  <Badge variant="outline" className="uppercase">
                    {d.type}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <Stat label="Rows" value={d.rows.toLocaleString()} />
                  <Stat label="Cols" value={d.columns.toString()} />
                  <Stat
                    label="Quality"
                    value={
                      d.quality_score
                        ? `${Math.round(d.quality_score * 100)}%`
                        : "—"
                    }
                  />
                </div>
                <div className="mt-auto flex items-center gap-1.5">
                  <Button
                    asChild
                    size="sm"
                    variant="secondary"
                    className="flex-1"
                  >
                    <Link to="/datasets/$id" params={{ id: d.id }}>
                      <Eye className="mr-1 h-3.5 w-3.5" />
                      Preview
                    </Link>
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => del.mutate(d.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-muted/30 py-2">
      <div className="text-sm font-semibold tabular-nums">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
