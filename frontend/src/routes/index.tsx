import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Upload,
  BarChart3,
  FileText,
  MessagesSquare,
  Sparkles,
  ArrowRight,
  Database,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/app/PageHeader";
import { StatusPill } from "@/components/app/StatusPill";
import { EmptyState } from "@/components/app/EmptyState";
import { endpoints } from "@/lib/api/endpoints";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Home — AI Data Analyst" },
      {
        name: "description",
        content: "Welcome to your AI data analyst workspace.",
      },
    ],
  }),
});

const quickActions = [
  {
    label: "Upload Dataset",
    to: "/datasets/upload",
    icon: Upload,
    desc: "Bring CSV, PDF, DOCX or images",
  },
  {
    label: "Analyze Dataset",
    to: "/datasets",
    icon: Database,
    desc: "Explore rows, schema, joins",
  },
  {
    label: "Generate Dashboard",
    to: "/dashboard",
    icon: BarChart3,
    desc: "BI-ready charts & KPIs",
  },
  {
    label: "Generate Report",
    to: "/reports",
    icon: FileText,
    desc: "One-click PDF summaries",
  },
  {
    label: "Open AI Chat",
    to: "/chat",
    icon: MessagesSquare,
    desc: "Ask questions in natural language",
  },
];

const suggested = [
  "Summarize the latest dataset and highlight anomalies",
  "Show revenue trend by region for the last 12 months",
  "Forecast next quarter's orders",
  "Compare customer churn across segments",
];

function HomePage() {
  const datasets = useQuery({
    queryKey: ["datasets"],
    queryFn: endpoints.listDatasets,
    retry: false,
  });
  const reports = useQuery({
    queryKey: ["reports"],
    queryFn: endpoints.listReports,
    retry: false,
  });

  return (
    <div className="mx-auto max-w-7xl p-6">
      <PageHeader
        title="Welcome back"
        description="Your agentic AI data analyst — chat, analyze, visualize, and report."
        actions={
          <Button asChild>
            <Link to="/chat">
              <Sparkles className="mr-1.5 h-4 w-4" /> Start a conversation
            </Link>
          </Button>
        }
      />

      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {quickActions.map((a) => (
          <Link
            key={a.label}
            to={a.to}
            className="group flex flex-col justify-between rounded-lg border bg-card p-4 transition hover:border-primary/40 hover:shadow-sm"
          >
            <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
              <a.icon className="h-4 w-4" />
            </div>
            <div className="mt-4">
              <div className="text-sm font-medium">{a.label}</div>
              <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {a.desc}
              </div>
            </div>
            <div className="mt-3 flex items-center text-xs text-muted-foreground group-hover:text-primary">
              Open <ArrowRight className="ml-1 h-3 w-3" />
            </div>
          </Link>
        ))}
      </section>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recently uploaded</CardTitle>
          </CardHeader>
          <CardContent>
            {datasets.isLoading ? (
              <div className="space-y-2">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : datasets.isError || !datasets.data?.length ? (
              <EmptyState
                icon={<Database className="h-4 w-4" />}
                title="No datasets yet"
                description="Upload a CSV, PDF, DOCX or image to get started."
                action={
                  <Button asChild size="sm">
                    <Link to="/datasets/upload">
                      <Upload className="mr-1 h-3.5 w-3.5" /> Upload dataset
                    </Link>
                  </Button>
                }
              />
            ) : (
              <ul className="divide-y">
                {datasets.data.slice(0, 5).map((d) => (
                  <li
                    key={d.id}
                    className="flex items-center justify-between py-2.5"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {d.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {d.rows.toLocaleString()} rows · {d.columns} cols ·{" "}
                        {d.type}
                      </div>
                    </div>
                    <Button asChild size="sm" variant="ghost">
                      <Link to="/datasets/$id" params={{ id: d.id }}>
                        Open
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">System status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row
              label="API"
              pill={
                <StatusPill
                  status={datasets.isError ? "warn" : "ok"}
                  label={datasets.isError ? "Unreachable" : "Online"}
                />
              }
            />
            <Row
              label="Agent"
              pill={<StatusPill status="ok" label="Ready" />}
            />
            <Row
              label="Automation"
              pill={<StatusPill status="muted" label="Idle" />}
            />
            <Row
              label="Vector store"
              pill={<StatusPill status="ok" label="Ready" />}
            />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Suggested questions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {suggested.map((s) => (
              <Link
                key={s}
                to="/chat"
                className="rounded-full border bg-card px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
              >
                {s}
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent reports</CardTitle>
          </CardHeader>
          <CardContent>
            {reports.isLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : reports.isError || !reports.data?.length ? (
              <EmptyState
                icon={<Activity className="h-4 w-4" />}
                title="No reports yet"
                description="Generated reports will appear here."
              />
            ) : (
              <ul className="space-y-2">
                {reports.data.slice(0, 4).map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="truncate">{r.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, pill }: { label: string; pill: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      {pill}
    </div>
  );
}
