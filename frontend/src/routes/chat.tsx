import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Sparkles,
  BarChart3,
  AlertTriangle,
  TrendingUp,
  Code2,
  FileText,
  Search,
  Database,
  ChevronDown,
  MessageSquare,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { EmptyState } from "@/components/app/EmptyState";
import { endpoints } from "@/lib/api/endpoints";
import type { ChatMessage as Msg, ChatRequest, Dataset } from "@/lib/api/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/chat")({
  component: ChatPage,
  head: () => ({
    meta: [{ title: "AI Chat — AI Data Analyst" }],
  }),
});

const quickActions = [
  { label: "Analyze", action: "analyze" as const, icon: Sparkles },
  { label: "Generate Chart", action: "chart" as const, icon: BarChart3 },
  {
    label: "Detect Anomalies",
    action: "anomaly" as const,
    icon: AlertTriangle,
  },
  { label: "Forecast", action: "forecast" as const, icon: TrendingUp },
  { label: "Generate SQL", action: "sql" as const, icon: Code2 },
  { label: "Generate Pandas", action: "pandas" as const, icon: Code2 },
  { label: "Generate Report", action: "report" as const, icon: FileText },
];

const suggestions = [
  "Give me an overview of the current dataset",
  "Which columns have the most missing values?",
  "Plot revenue vs. month as a line chart",
  "Forecast next 6 months of orders",
  "Detect anomalies in the sales column",
];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>();
  // Multiple datasets can be active at once — the backend merges/joins them
  // and answers questions that span more than one file.
  const [selectedDatasetIds, setSelectedDatasetIds] = useState<string[]>([]);
  const [datasetDropdownOpen, setDatasetDropdownOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [showHistory, setShowHistory] = useState(true);
  const [history, setHistory] = useState<
    Array<{ id: string; title: string; created_at: string }>
  >([]);

  const { user } = useAuth();

  const { data: datasets = [] } = useQuery<Dataset[]>({
    queryKey: ["datasets"],
    queryFn: () => endpoints.listDatasets(),
    refetchInterval: 10_000,
  });

  const selectedDatasets = datasets.filter((d) =>
    selectedDatasetIds.includes(d.id),
  );
  const selectedDatasetId = selectedDatasetIds.join(",") || undefined;
  const toggleDataset = (id: string) => {
    setSelectedDatasetIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const chat = useMutation({
    mutationFn: (req: ChatRequest) => endpoints.chat(req),
    onSuccess: (res) => {
      setConversationId(res.conversation_id);
      setMessages((prev) => [...prev, res.message]);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const voice = useMutation({
    mutationFn: (blob: Blob) => endpoints.voice(blob),
    onSuccess: (res) => {
      setConversationId(res.conversation_id);
      setMessages((prev) => [...prev, res.message]);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const uploadAndSelect = async (file: File) => {
    try {
      toast.info(`Uploading ${file.name}...`);
      const res = await endpoints.upload(file);
      setSelectedDatasetIds((prev) => [...prev, res.dataset.id]);
      toast.success(`${file.name} uploaded and added to active datasets`);
      send(
        `I just uploaded "${file.name}". Please analyze it and give me a summary.`,
        "analyze",
        [...selectedDatasetIds, res.dataset.id].join(","),
      );
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, chat.isPending]);

  // Load conversation history
  useEffect(() => {
    const stored = localStorage.getItem("chat_history");
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  const saveHistory = (newHistory: typeof history) => {
    setHistory(newHistory);
    localStorage.setItem("chat_history", JSON.stringify(newHistory));
  };

  const loadConversation = (id: string) => {
    const conv = history.find((h) => h.id === id);
    if (conv) {
      // Load conversation from storage or API
      toast.info("Loading conversation...");
      // This would load the full conversation
    }
  };

  const deleteConversation = (id: string) => {
    const newHistory = history.filter((h) => h.id !== id);
    saveHistory(newHistory);
    toast.success("Conversation deleted");
  };

  const send = (
    text: string,
    action?: ChatRequest["action"],
    overrideDatasetId?: string,
  ) => {
    const user: Msg = {
      id: crypto.randomUUID(),
      role: "user",
      created_at: new Date().toISOString(),
      blocks: [{ type: "text", text }],
    };
    setMessages((m) => [...m, user]);
    chat.mutate({
      message: text,
      action,
      conversation_id: conversationId,
      dataset_id: overrideDatasetId ?? selectedDatasetId,
      user_id: user?.id,
    });
  };

  const newConversation = () => {
    // Starting a fresh conversation drops the conversation_id, so the backend
    // has no memory of prior turns and the chat "forgets" everything.
    setMessages([]);
    setConversationId(undefined);
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] min-h-0">
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-sidebar/30 md:flex">
        <div className="flex items-center justify-between border-b p-3">
          <div className="text-sm font-semibold">Conversations</div>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={newConversation}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="border-b p-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search" className="h-8 pl-8 text-xs" />
          </div>
        </div>

        <div className="border-b p-2">
          <div className="mb-1 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Active Datasets</span>
            {selectedDatasetIds.length > 0 && (
              <button
                onClick={() => setSelectedDatasetIds([])}
                className="normal-case text-[10px] font-normal text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setDatasetDropdownOpen(!datasetDropdownOpen)}
              className="flex w-full items-center gap-1.5 rounded-md border bg-card px-2 py-1.5 text-left text-xs transition hover:bg-accent"
            >
              <Database className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1 truncate">
                {selectedDatasets.length === 0
                  ? "None selected"
                  : selectedDatasets.length === 1
                    ? selectedDatasets[0].name
                    : `${selectedDatasets.length} files selected`}
              </span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
            {datasetDropdownOpen && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-auto rounded-md border bg-popover shadow-md">
                {datasets.length === 0 && (
                  <div className="px-3 py-2 text-xs text-muted-foreground">
                    No datasets uploaded yet.
                  </div>
                )}
                {datasets.map((d) => {
                  const checked = selectedDatasetIds.includes(d.id);
                  return (
                    <button
                      key={d.id}
                      onClick={() => toggleDataset(d.id)}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs hover:bg-accent"
                    >
                      <span
                        className={`grid h-3.5 w-3.5 shrink-0 place-items-center rounded-sm border ${checked ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"}`}
                      >
                        {checked && (
                          <span className="h-1.5 w-1.5 rounded-[1px] bg-current" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1 truncate">{d.name}</span>
                      <span className="text-[10px] uppercase text-muted-foreground">
                        {d.type}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {selectedDatasets.length > 1 && (
            <p className="mt-1 text-[10px] leading-snug text-muted-foreground">
              Questions will be answered across all {selectedDatasets.length}{" "}
              selected files.
            </p>
          )}
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 text-xs text-muted-foreground">
            <div className="mb-3 flex items-center justify-between px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Chat History</span>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => setShowHistory(!showHistory)}
              >
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform",
                    showHistory && "rotate-180",
                  )}
                />
              </Button>
            </div>
            {showHistory ? (
              <div className="space-y-2">
                {history.length === 0 ? (
                  <EmptyState
                    title="No conversations"
                    description="Start a chat to see history here."
                  />
                ) : (
                  <div className="space-y-2">
                    {history.map((h) => (
                      <div
                        key={h.id}
                        className="group flex items-center justify-between gap-2 px-2 py-1.5 rounded-md hover:bg-accent transition-colors"
                      >
                        <button
                          onClick={() => loadConversation(h.id)}
                          className="flex items-center gap-2 min-w-0 flex-1 text-left text-xs text-foreground hover:text-primary"
                        >
                          <MessageSquare className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          <div className="min-w-0 flex-1 truncate">
                            <div className="font-medium truncate">
                              {h.title}
                            </div>
                            <div className="text-[10px] text-muted-foreground truncate">
                              {new Date(h.created_at).toLocaleString()}
                            </div>
                          </div>
                        </button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteConversation(h.id);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </ScrollArea>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Agent</span>
            <Badge variant="secondary" className="text-[10px]">
              LangGraph
            </Badge>
            {selectedDatasets.map((d) => (
              <Badge key={d.id} variant="outline" className="gap-1 text-[10px]">
                <Database className="h-2.5 w-2.5" />
                {d.name}
              </Badge>
            ))}
          </div>
          <Button size="sm" variant="ghost" onClick={newConversation}>
            New chat
          </Button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4">
          <div className="mx-auto max-w-7xl space-y-6 py-6">
            {messages.length === 0 ? (
              <div className="mt-10 text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-semibold">
                  What would you like to analyze?
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Upload one or more files (CSV, Excel, image of a table) or
                  select datasets, then ask anything — I can work across
                  multiple files at once.
                </p>
                {selectedDatasets.length === 0 && (
                  <p className="mt-1 text-xs text-amber-500">
                    💡 Select one or more datasets from the left panel or attach
                    a file below to get started.
                  </p>
                )}
                <div className="mx-auto mt-6 flex max-w-xl flex-wrap justify-center gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border bg-card px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m) => <ChatMessage key={m.id} message={m} />)
            )}
            {(chat.isPending || voice.isPending) && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
                </span>
                Thinking…
              </div>
            )}
          </div>
        </div>

        <div className="border-t bg-background px-4 py-3">
          <div className="mx-auto max-w-7xl">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {quickActions.map((q) => (
                <Button
                  key={q.action}
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1 text-xs"
                  onClick={() =>
                    send(`${q.label} the current dataset`, q.action)
                  }
                  disabled={
                    selectedDatasetIds.length === 0 && q.action !== "analyze"
                  }
                >
                  <q.icon className="h-3 w-3" />
                  {q.label}
                </Button>
              ))}
            </div>
            <ChatInput
              onSend={send}
              onVoice={(b) => voice.mutate(b)}
              onFile={uploadAndSelect}
              disabled={chat.isPending}
            />
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              Responses are generated by AI. Verify important numbers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
