import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { History as HistoryIcon, Search } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/app/EmptyState";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { endpoints } from "@/lib/api/endpoints";
import type { HistoryItem } from "@/lib/api/types";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
  head: () => ({ meta: [{ title: "History — AI Data Analyst" }] }),
});

const KINDS: Array<{ id: HistoryItem["kind"] | "all"; label: string }> = [
  { id: "all", label: "All" },
  { id: "conversation", label: "Conversations" },
  { id: "analysis", label: "Analyses" },
  { id: "chart", label: "Charts" },
  { id: "report", label: "Reports" },
  { id: "export", label: "Exports" },
];

function HistoryPage() {
  const q = useQuery({
    queryKey: ["history"],
    queryFn: endpoints.listHistory,
    retry: false,
  });
  const [kind, setKind] = useState<string>("all");
  const [text, setText] = useState("");

  const items = (q.data ?? [])
    .filter((h) => (kind === "all" ? true : h.kind === kind))
    .filter((h) =>
      text ? h.title.toLowerCase().includes(text.toLowerCase()) : true,
    );

  return (
    <div className="mx-auto max-w-5xl p-6">
      <PageHeader
        title="History"
        description="Everything you and the agent produced."
      />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={kind} onValueChange={setKind}>
          <TabsList>
            {KINDS.map((k) => (
              <TabsTrigger key={k.id} value={k.id}>
                {k.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search history"
            className="h-9 pl-8"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </div>

      {q.isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-14" />
          ))}
        </div>
      ) : q.isError || items.length === 0 ? (
        <EmptyState
          icon={<HistoryIcon className="h-4 w-4" />}
          title="Nothing here yet"
          description="Your conversations, charts, and reports will appear here."
        />
      ) : (
        <div className="space-y-2">
          {items.map((h) => (
            <Card key={h.id}>
              <CardContent className="flex items-center justify-between gap-3 p-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{h.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(h.created_at).toLocaleString()}
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] uppercase">
                  {h.kind}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
