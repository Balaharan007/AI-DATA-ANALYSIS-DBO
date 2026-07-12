import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Mail, Send, Play, Zap, Calendar } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/app/EmptyState";
import { StatusPill } from "@/components/app/StatusPill";
import { endpoints } from "@/lib/api/endpoints";
import { toast } from "sonner";

export const Route = createFileRoute("/automation")({
  component: AutomationPage,
  head: () => ({ meta: [{ title: "Automation — AI Data Analyst" }] }),
});

const iconFor: Record<string, React.ComponentType<{ className?: string }>> = {
  gmail: Mail,
  telegram: Send,
  calendar: Calendar,
};

function AutomationPage() {
  const q = useQuery({
    queryKey: ["automation"],
    queryFn: endpoints.listAutomation,
    retry: false,
  });
  const run = useMutation({
    mutationFn: (service: string) => endpoints.runAutomation(service),
    onSuccess: (r) => toast.success(`Ran workflow: ${r.service}`),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="mx-auto max-w-5xl p-6">
      <PageHeader
        title="Automation"
        description="Connect services and run workflows."
      />
      {q.isLoading ? (
        <div className="grid gap-3 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : q.isError ? (
        <EmptyState
          icon={<Zap className="h-4 w-4" />}
          title="Automation unavailable"
          description="Backend /automation endpoint isn't reachable yet."
        />
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-3">
            {(q.data?.services ?? []).map((s) => {
              const Icon = iconFor[s.name] ?? Zap;
              return (
                <Card key={s.id}>
                  <CardContent className="flex flex-col gap-3 p-5">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-md bg-muted">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold">
                          {s.label}
                        </div>
                        <StatusPill
                          status={s.connected ? "ok" : "muted"}
                          label={s.connected ? "Connected" : "Disconnected"}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button size="sm" variant="secondary" className="flex-1">
                        {s.connected ? "Test" : "Connect"}
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        disabled={!s.connected}
                        onClick={() => run.mutate(s.name)}
                      >
                        <Play className="mr-1 h-3.5 w-3.5" />
                        Run
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-8">
            <h3 className="mb-3 text-sm font-semibold">Recent runs</h3>
            {q.data?.runs?.length ? (
              <div className="space-y-2">
                {q.data.runs.map((r) => (
                  <Card key={r.id}>
                    <CardContent className="flex items-center justify-between p-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          {r.service}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(r.created_at).toLocaleString()}
                        </div>
                      </div>
                      <StatusPill
                        status={
                          r.status === "success"
                            ? "ok"
                            : r.status === "failed"
                              ? "error"
                              : "info"
                        }
                        label={r.status}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState title="No runs yet" />
            )}
          </div>
        </>
      )}
    </div>
  );
}
