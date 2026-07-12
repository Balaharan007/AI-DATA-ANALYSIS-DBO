import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FileText,
  Download,
  Eye,
  Trash2,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/app/EmptyState";
import { endpoints } from "@/lib/api/endpoints";
import { API_BASE_URL } from "@/lib/api/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reports")({
  component: ReportsPage,
  head: () => ({ meta: [{ title: "Reports — AI Data Analyst" }] }),
});

/**
 * Resolve a report URL to an absolute URL pointing to the backend server.
 * Backend stores relative paths like "/reports-files/rep_xxx.pdf".
 */
function toFileUrl(path: string | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE_URL}${path}`;
}

function ReportsPage() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["reports"],
    queryFn: endpoints.listReports,
    retry: false,
  });
  const del = useMutation({
    mutationFn: (id: string) => endpoints.deleteReport(id),
    onSuccess: () => {
      toast.success("Report deleted");
      qc.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const sendToTelegram = useMutation({
    mutationFn: (reportId: string) => endpoints.sendReportToTelegram(reportId),
    onSuccess: (data, reportId) => {
      toast.success("Report sent to Telegram successfully!");
      qc.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (e: Error) => toast.error(e.message || "Failed to send to Telegram"),
  });

  return (
    <div className="mx-auto max-w-7xl p-6">
      <PageHeader
        title="Reports"
        description="Generated PDF and DOCX reports from your analyses."
      />
      {q.isLoading ? (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-36" />
          ))}
        </div>
      ) : q.isError || !q.data?.length ? (
        <EmptyState
          icon={<FileText className="h-4 w-4" />}
          title="No reports yet"
          description="Ask the AI to generate a report from any dataset."
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {q.data.map((r) => {
            const previewUrl = toFileUrl(r.preview_url);
            const downloadUrl = toFileUrl(r.url);
            const telegramSent = r.telegram_sent;
            const isSending = sendToTelegram.isPending && sendToTelegram.variables === r.id;

            return (
              <Card key={r.id}>
                <CardContent className="flex flex-col gap-3 p-5">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-destructive/10 text-destructive">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">
                        {r.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleString()}
                      </div>
                      {r.dataset_name && (
                        <div className="mt-0.5 truncate text-xs text-muted-foreground">
                          Source: {r.dataset_name}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {r.preview_url && (
                      <Button
                        asChild
                        size="sm"
                        variant="secondary"
                        className="w-full"
                      >
                        <a
                          href={toFileUrl(r.preview_url)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Eye className="mr-1 h-3.5 w-3.5" />
                          Preview
                        </a>
                      </Button>
                    )}
                    {r.url && (
                      <Button
                        asChild
                        size="sm"
                        variant="secondary"
                        className="w-full"
                      >
                        <a
                          href={toFileUrl(r.url)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Download className="mr-1 h-3.5 w-3.5" />
                          Download PDF
                        </a>
                      </Button>
                    )}
                    {r.docx_url && (
                      <Button
                        asChild
                        size="sm"
                        variant="secondary"
                        className="w-full"
                      >
                        <a
                          href={toFileUrl(r.docx_url)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Download className="mr-1 h-3.5 w-3.5" />
                          Download DOCX
                        </a>
                      </Button>
                    )}
                    {telegramSent && !isSending && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => sendToTelegram.mutate(r.id)}
                      >
                        <CheckCircle2 className="mr-1 h-3.5 w-3.5 text-green-600" />
                        <span>Sent to Telegram</span>
                        <Send className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    )}
                    {!telegramSent && r.url && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => sendToTelegram.mutate(r.id)}
                        disabled={sendToTelegram.isPending && sendToTelegram.variables === r.id}
                      >
                        <Send className={`mr-1 h-3.5 w-3.5 ${sendToTelegram.isPending && sendToTelegram.variables === r.id ? "animate-spin" : ""}`} />
                        {sendToTelegram.isPending && sendToTelegram.variables === r.id ? "Sending..." : "Send to Telegram"}
                      </Button>
                    )}
                    {isSending && (
                      <div className="flex items-center justify-center text-sm text-muted-foreground">
                        <AlertCircle className="mr-1 h-3.5 w-3.5 animate-spin text-blue-500" />
                        Sending to Telegram...
                      </div>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive"
                      onClick={() => del.mutate(r.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}