import { Download, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChartCard } from "@/components/charts/ChartCard";
import { ExecutionTimeline } from "./ExecutionTimeline";
import { MarkdownRenderer } from "./MarkdownRenderer";
import type { ChatBlock, ChatMessage as Msg } from "@/lib/api/types";
import { API_BASE_URL } from "@/lib/api/client";
import { cn } from "@/lib/utils";

export function ChatMessage({ message }: { message: Msg }) {
  const isUser = message.role === "user";
  return (
    <div
      className={cn(
        "flex w-full gap-3 mb-6",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      {!isUser && (
        <Avatar className="mt-1 h-7 w-7 shrink-0">
          <AvatarFallback className="bg-primary text-[10px] text-primary-foreground">
            AI
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "min-w-0 max-w-[85%] space-y-4",
          isUser
            ? "rounded-2xl bg-primary px-4 py-2.5 text-primary-foreground"
            : "rounded-2xl bg-muted px-4 py-2.5",
        )}
      >
        {message.execution && message.execution.length > 0 && (
          <ExecutionTimeline steps={message.execution} />
        )}
        {message.blocks.map((b, i) => (
          <BlockRenderer key={i} block={b} inUser={isUser} />
        ))}
      </div>
      {isUser && (
        <Avatar className="mt-1 h-7 w-7 shrink-0">
          <AvatarFallback className="text-[10px]">You</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

function BlockRenderer({
  block,
  inUser,
}: {
  block: ChatBlock;
  inUser: boolean;
}) {
  switch (block.type) {
    case "text":
      // User messages are plain text; assistant text often contains markdown
      // (headers, bullets, tables) from the narrator prompt, so render it as such.
      if (inUser) {
        return (
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {block.text}
          </p>
        );
      }
      return <MarkdownRenderer content={block.text} className="text-sm" />;

    case "markdown":
      return <MarkdownRenderer content={block.markdown} className="text-sm" />;
    case "code":
      return (
        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b bg-muted/50 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {block.language}
          </div>
          <pre className="overflow-x-auto p-3 text-xs">
            <code>{block.code}</code>
          </pre>
        </Card>
      );
    case "table":
      return (
        <Card className="overflow-hidden">
          <div className="max-h-80 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {block.columns.map((c) => (
                    <TableHead key={c}>{c}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {block.rows.map((row, i) => (
                  <TableRow key={i}>
                    {block.columns.map((c) => (
                      <TableCell key={c} className="text-xs">
                        {String(row[c] ?? "")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      );
    case "chart":
      return <ChartCard spec={block.chart} />;
    case "image":
      return (
        <img
          src={block.url}
          alt={block.alt ?? ""}
          className="max-h-96 rounded-lg border object-contain"
        />
      );
    case "pdf":
      const pdfUrl =
        block.url.startsWith("http://") || block.url.startsWith("https://")
          ? block.url
          : `${API_BASE_URL}${block.url}`;
      return (
        <Card className="flex items-center gap-3 p-3">
          <div className="grid h-9 w-9 place-items-center rounded-md bg-destructive/10 text-destructive">
            <FileText className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{block.name}</div>
            <div className="text-xs text-muted-foreground">PDF report</div>
          </div>
          <Button asChild size="sm" variant="secondary">
            <a href={pdfUrl} target="_blank" rel="noreferrer">
              <Download className="mr-1 h-3.5 w-3.5" />
              Download
            </a>
          </Button>
        </Card>
      );
    case "status":
      return (
        <div className="text-xs italic text-muted-foreground">
          {block.status}
        </div>
      );
    case "reasoning":
      return (
        <details className="rounded-md border bg-muted/40 px-3 py-2 text-xs">
          <summary className="cursor-pointer font-medium text-muted-foreground">
            Reasoning
          </summary>
          <div className="mt-2 whitespace-pre-wrap text-muted-foreground">
            {block.text}
          </div>
        </details>
      );
    default:
      return null;
  }
  void inUser;
}
