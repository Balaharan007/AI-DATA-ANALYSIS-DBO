import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import {
  UploadCloud,
  FileText,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { endpoints } from "@/lib/api/endpoints";
import type { Dataset } from "@/lib/api/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/datasets/upload")({
  component: UploadPage,
  head: () => ({ meta: [{ title: "Upload Dataset — AI Data Analyst" }] }),
});

type Item = {
  file: File;
  progress: number;
  status: "uploading" | "done" | "error";
  dataset?: Dataset;
  error?: string;
};

const ACCEPT = ".csv,.pdf,.docx,.doc,.png,.jpg,.jpeg,.webp";

function UploadPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const upload = useCallback(async (file: File) => {
    setItems((prev) => [...prev, { file, progress: 0, status: "uploading" }]);
    try {
      const res = await endpoints.upload(file, (pct) =>
        setItems((prev) =>
          prev.map((it) => (it.file === file ? { ...it, progress: pct } : it)),
        ),
      );
      setItems((prev) =>
        prev.map((it) =>
          it.file === file
            ? { ...it, status: "done", progress: 100, dataset: res.dataset }
            : it,
        ),
      );
      toast.success(`${file.name} uploaded`);
    } catch (e) {
      const msg = (e as Error).message;
      setItems((prev) =>
        prev.map((it) =>
          it.file === file ? { ...it, status: "error", error: msg } : it,
        ),
      );
      toast.error(msg);
    }
  }, []);

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(upload);
  };

  const latest = items.find((i) => i.status === "done" && i.dataset)?.dataset;

  return (
    <div className="mx-auto max-w-5xl p-6">
      <PageHeader
        title="Upload dataset"
        description="Drop CSV, PDF, DOCX, or image files. We'll extract tables, text, and schema."
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          onFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-card px-6 py-14 text-center transition",
          dragOver ? "border-primary bg-primary/5" : "border-border",
        )}
      >
        <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
          <UploadCloud className="h-5 w-5" />
        </div>
        <h3 className="mt-4 text-base font-semibold">Drop files to upload</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          CSV · PDF · DOCX · Images (PNG, JPG, WEBP)
        </p>
        <label className="mt-4">
          <input
            type="file"
            multiple
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />
          <span className="inline-flex cursor-pointer items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Browse files
          </span>
        </label>
      </div>

      {items.length > 0 && (
        <div className="mt-6 space-y-2">
          {items.map((it) => (
            <Card key={it.file.name + it.file.lastModified}>
              <CardContent className="flex items-center gap-3 p-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-muted">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="min-w-0 truncate text-sm font-medium">
                      {it.file.name}
                    </div>
                    <Badge variant="outline" className="text-[10px] uppercase">
                      {it.file.type.split("/")[1] || "file"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {(it.file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <Progress value={it.progress} className="mt-1.5 h-1.5" />
                  {it.status === "error" && (
                    <div className="mt-1 text-xs text-destructive">
                      {it.error}
                    </div>
                  )}
                </div>
                <div className="shrink-0">
                  {it.status === "uploading" && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                  {it.status === "done" && (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  )}
                  {it.status === "error" && (
                    <XCircle className="h-4 w-4 text-destructive" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {latest && (
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-semibold">Extraction results</h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <MetaCard label="Rows" value={latest.rows.toLocaleString()} />
            <MetaCard label="Columns" value={latest.columns.toString()} />
            <MetaCard
              label="Detected tables"
              value={String(latest.detected_tables ?? 0)}
            />
            <MetaCard
              label="Missing values"
              value={String(latest.missing_values ?? 0)}
            />
            <MetaCard
              label="Quality score"
              value={
                latest.quality_score
                  ? `${Math.round(latest.quality_score * 100)}%`
                  : "—"
              }
            />
            <MetaCard
              label="Detected text"
              value={String(latest.detected_text ?? 0)}
            />
            <MetaCard
              label="Join keys"
              value={(latest.possible_join_keys ?? []).join(", ") || "—"}
            />
            <MetaCard label="Type" value={latest.type} />
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              onClick={() =>
                navigate({ to: "/datasets/$id", params: { id: latest.id } })
              }
            >
              Open dataset
            </Button>
            <Button variant="outline" onClick={() => navigate({ to: "/chat" })}>
              Analyze in chat
            </Button>
          </div>
        </div>
      )}
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
        <div className="mt-1 truncate text-sm font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}
