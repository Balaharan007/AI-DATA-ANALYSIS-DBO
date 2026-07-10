import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Search, KeyRound } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/app/EmptyState";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { endpoints } from "@/lib/api/endpoints";

export const Route = createFileRoute("/datasets/$id")({
  component: DatasetDetailPage,
});

function DatasetDetailPage() {
  const { id } = Route.useParams();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const meta = useQuery({
    queryKey: ["dataset", id],
    queryFn: () => endpoints.getDataset(id),
    retry: false,
  });
  const preview = useQuery({
    queryKey: ["dataset-preview", id, page],
    queryFn: () => endpoints.previewDataset(id, page, 25),
    retry: false,
  });

  const rows = preview.data?.rows ?? [];
  const columns = preview.data?.columns ?? [];
  const filtered = q
    ? rows.filter((r) =>
        Object.values(r).some((v) =>
          String(v).toLowerCase().includes(q.toLowerCase()),
        ),
      )
    : rows;

  return (
    <div className="mx-auto max-w-7xl p-6">
      <PageHeader
        title={meta.data?.name ?? "Dataset"}
        description="Preview rows, inspect schema and key candidates."
        actions={
          <>
            <Button asChild variant="ghost" size="sm">
              <Link to="/datasets">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/chat">Analyze in chat</Link>
            </Button>
          </>
        }
      />

      {/* Statistics */}
      {meta.isLoading ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : meta.data ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <MetaCard label="Rows" value={meta.data.rows.toLocaleString()} />
          <MetaCard label="Columns" value={meta.data.columns.toString()} />
          <MetaCard
            label="Missing"
            value={String(meta.data.missing_values ?? 0)}
          />
          <MetaCard
            label="Quality"
            value={
              meta.data.quality_score
                ? `${Math.round(meta.data.quality_score * 100)}%`
                : "—"
            }
          />
        </div>
      ) : null}

      {/* Schema */}
      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold">Schema</h3>
        {preview.isLoading ? (
          <Skeleton className="h-32" />
        ) : columns.length ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Column</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Unique</TableHead>
                    <TableHead className="text-right">Missing</TableHead>
                    <TableHead>Keys</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {columns.map((c) => (
                    <TableRow key={c.name}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="font-mono text-[10px]"
                        >
                          {c.dtype}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {c.unique?.toLocaleString() ?? "—"}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {c.missing?.toLocaleString() ?? "—"}
                      </TableCell>
                      <TableCell className="space-x-1">
                        {c.is_primary_key && (
                          <Badge
                            variant="secondary"
                            className="gap-1 text-[10px]"
                          >
                            <KeyRound className="h-3 w-3" /> PK
                          </Badge>
                        )}
                        {c.is_foreign_key && (
                          <Badge variant="outline" className="text-[10px]">
                            FK
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <EmptyState title="No schema available" />
        )}
      </div>

      {/* Data preview */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold">Preview</h3>
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter rows"
              className="h-8 pl-8 text-xs"
            />
          </div>
        </div>
        {preview.isLoading ? (
          <Skeleton className="h-64" />
        ) : preview.isError ? (
          <EmptyState
            title="Preview unavailable"
            description="Ensure the backend /datasets/:id/preview endpoint is reachable."
          />
        ) : filtered.length ? (
          <>
            <Card>
              <CardContent className="p-0">
                <div className="max-h-[520px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {columns.map((c) => (
                          <TableHead key={c.name}>{c.name}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((r, i) => (
                        <TableRow key={i}>
                          {columns.map((c) => (
                            <TableCell
                              key={c.name}
                              className="text-xs tabular-nums"
                            >
                              {String(r[c.name] ?? "")}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink isActive>{page}</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext onClick={() => setPage((p) => p + 1)} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        ) : (
          <EmptyState title="No rows to display" />
        )}
      </div>
    </div>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <div className="mt-1 text-lg font-semibold tabular-nums">{value}</div>
      </CardContent>
    </Card>
  );
}
