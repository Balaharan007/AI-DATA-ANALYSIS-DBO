"use client";

import React, { ReactElement, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

/**
 * Custom Markdown Renderer — Improves readability of AI responses
 * without changing content generation or business logic.
 * Uses design tokens from styles.css (Tailwind v4 + CSS variables).
 */

// ── Heading Components ──────────────────────────────────────────────
interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level: number;
}

function Heading({ level, children, ...props }: HeadingProps) {
  const Tag = `h${level}` as React.ElementType;
  const styles =
    {
      1: "text-xl font-semibold text-foreground mb-4 mt-6 pb-2 border-b border-border",
      2: "text-lg font-semibold text-foreground mb-3 mt-5",
      3: "text-base font-semibold text-foreground mb-2 mt-4 flex items-center gap-2",
    }[level] || "text-base font-medium text-foreground mb-2 mt-3";

  // Emoji prefix for h3 (matches narrator prompt format: ### 📋 Key Points)
  const emojiMap: Record<string, string> = {
    "Key Points": "📋",
    "Key points": "📋",
    Analysis: "📈",
    Anomalies: "⚠️",
    Risks: "⚠️",
    Outlook: "🔮",
    Recommendation: "💡",
    Summary: "📝",
    Overview: "📊",
  };

  const text = React.Children.toArray(children).find(
    (c) => typeof c === "string",
  ) as string;
  const emoji = text && emojiMap[text.trim()] ? emojiMap[text.trim()] : null;

  return (
    <Tag className={cn(styles, props.className)} {...props}>
      {emoji && <span aria-hidden="true">{emoji}</span>}
      {children}
    </Tag>
  );
}

// ── Paragraph ───────────────────────────────────────────────────────
function Paragraph({
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-sm leading-relaxed text-foreground mb-3",
        props.className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}

// ── Bullet Lists (with green dot per narrator spec) ─────────────────
function UnorderedList({
  children,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={cn("space-y-1.5 ml-4 mb-3", props.className)} {...props}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as ReactElement<any>, {
              className: "relative pl-1",
            })
          : child,
      )}
    </ul>
  );
}

function ListItem({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li
      className={cn("text-sm leading-relaxed text-foreground", props.className)}
      {...props}
    >
      <span className="absolute -left-4 text-success" aria-hidden="true">
        •{" "}
      </span>
      {children}
    </li>
  );
}

// ── Ordered Lists ───────────────────────────────────────────────────
function OrderedList({
  children,
  ...props
}: React.HTMLAttributes<HTMLOListElement>) {
  return (
    <ol
      className={cn("space-y-1.5 ml-4 mb-3 list-decimal", props.className)}
      {...props}
    >
      {children}
    </ol>
  );
}

// ── Inline Code ─────────────────────────────────────────────────────
function InlineCode({ children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn(
        "px-1.5 py-0.5 text-xs font-mono bg-muted rounded border border-border",
        props.className,
      )}
      {...props}
    >
      {children}
    </code>
  );
}

// ── Code Blocks ─────────────────────────────────────────────────────
function CodeBlock({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) {
  const language = className?.replace("language-", "") || "";
  const code = React.Children.toArray(children).find(
    (c) => typeof c === "string",
  ) as string;

  return (
    <div className="relative group my-4 rounded-lg border border-border bg-muted/50 overflow-hidden">
      {language && (
        <div className="absolute top-0 right-0 z-10 px-2 py-0.5 text-xs text-muted-foreground bg-muted/80 backdrop-blur-sm border-b border-l border-border">
          {language}
        </div>
      )}
      <pre
        {...(props as React.HTMLAttributes<HTMLPreElement>)}
        className={cn(
          "p-4 overflow-x-auto text-xs font-mono leading-relaxed",
          (props as React.HTMLAttributes<HTMLPreElement>).className,
        )}
      >
        <code className="text-foreground">{code?.trim()}</code>
      </pre>
    </div>
  );
}

// ── Tables ──────────────────────────────────────────────────────────
function Table({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="my-4 overflow-x-auto rounded-lg border border-border">
      <table className={cn("w-full text-sm", props.className)} {...props}>
        {children}
      </table>
    </div>
  );
}

function TableHead({
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className="bg-muted/50 border-b border-border" {...props}>
      {children}
    </thead>
  );
}

function TableBody({
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className="divide-y divide-border" {...props}>
      {children}
    </tbody>
  );
}

function TableRow({
  children,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className="hover:bg-muted/30 transition-colors" {...props}>
      {children}
    </tr>
  );
}

function TableCell({
  children,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "px-3 py-2 font-medium text-left text-foreground",
        props.className,
      )}
      {...props}
    >
      {children}
    </th>
  );
}

function TableDataCell({
  children,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn("px-3 py-2 text-foreground", props.className)} {...props}>
      {children}
    </td>
  );
}

// ── Blockquote ──────────────────────────────────────────────────────
function Blockquote({
  children,
  ...props
}: React.QuoteHTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className={cn(
        "border-l-3 border-primary pl-4 py-1 my-3 italic text-muted-foreground",
        props.className,
      )}
      {...props}
    >
      {children}
    </blockquote>
  );
}

// ── Horizontal Rule ─────────────────────────────────────────────────
function ThematicBreak({ ...props }: React.HTMLAttributes<HTMLHRElement>) {
  return (
    <hr className={cn("my-4 border-border", props.className)} {...props} />
  );
}

// ── Strong / Emphasis ───────────────────────────────────────────────
function Strong({ children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <strong
      className={cn("font-semibold text-foreground", props.className)}
      {...props}
    >
      {children}
    </strong>
  );
}

function Emphasis({ children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <em className={cn("italic", props.className)} {...props}>
      {children}
    </em>
  );
}

// ── Link ────────────────────────────────────────────────────────────
function Link({
  children,
  href,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "text-primary underline underline-offset-2 hover:text-primary/80",
        props.className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}

// ── Separate heading components for proper typing ───────────────────
function H1({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        "text-xl font-semibold text-foreground mb-4 mt-6 pb-2 border-b border-border",
        props.className,
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

function H2({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "text-lg font-semibold text-foreground mb-3 mt-5",
        props.className,
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

function H3({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  // Emoji prefix for h3 (matches narrator prompt format: ### 📋 Key Points)
  const emojiMap: Record<string, string> = {
    "Key Points": "📋",
    "Key points": "📋",
    Analysis: "📈",
    Anomalies: "⚠️",
    Risks: "⚠️",
    Outlook: "🔮",
    Recommendation: "💡",
    Summary: "📝",
    Overview: "📊",
  };

  const text = React.Children.toArray(children).find(
    (c) => typeof c === "string",
  ) as string;
  const emoji = text && emojiMap[text.trim()] ? emojiMap[text.trim()] : null;

  return (
    <h3
      className={cn(
        "text-base font-semibold text-foreground mb-2 mt-4 flex items-center gap-2",
        props.className,
      )}
      {...props}
    >
      {emoji && <span aria-hidden="true">{emoji}</span>}
      {children}
    </h3>
  );
}

// ── Main Component ──────────────────────────────────────────────────
interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  if (!content?.trim()) return null;

  return (
    <div className={cn("max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: H1,
          h2: H2,
          h3: H3,
          p: Paragraph,
          ul: UnorderedList,
          ol: OrderedList,
          li: ListItem,
          code: InlineCode,
          pre: CodeBlock,
          table: Table,
          thead: TableHead,
          tbody: TableBody,
          tr: TableRow,
          th: TableCell,
          td: TableDataCell,
          blockquote: Blockquote,
          hr: ThematicBreak,
          strong: Strong,
          em: Emphasis,
          a: Link,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
