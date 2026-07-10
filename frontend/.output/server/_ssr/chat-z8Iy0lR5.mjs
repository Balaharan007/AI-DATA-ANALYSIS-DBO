import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { c as endpoints, o as baseURL, s as cn, t as Card } from "./card-CIRZ9Enz.mjs";
import { t as Button } from "./button-CFceoTe1.mjs";
import { t as EmptyState } from "./EmptyState-CmNGhisn.mjs";
import { n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { B as Download, F as FileText, H as CodeXml, O as LoaderCircle, Q as ChartColumn, S as MessageSquare, V as Database, W as Circle, X as ChevronDown, Z as Check, c as Trash2, d as Sparkles, g as Plus, m as Search, n as X, o as TriangleAlert, p as Send, s as TrendingUp, u as Square, v as Paperclip, x as Mic } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-CzW6nKw2.mjs";
import { n as AvatarFallback, t as Avatar } from "./avatar-D5Lqn09u.mjs";
import { t as Badge } from "./badge-BNzDanZ1.mjs";
import { a as TableHeader, i as TableHead$1, n as TableBody$1, o as TableRow$1, r as TableCell$1, t as Table$1 } from "./table-CNF-xQUx.mjs";
import { t as ChartCard } from "./ChartCard-BsoNyRIB.mjs";
import { a as Viewport, i as ScrollAreaThumb, n as Root, r as ScrollAreaScrollbar, t as Corner } from "../_libs/radix-ui__react-scroll-area.mjs";
import { t as Markdown } from "../_libs/react-markdown+[...].mjs";
import { t as remarkGfm } from "../_libs/remark-gfm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat-z8Iy0lR5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ScrollArea = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root, {
	ref,
	className: cn("relative overflow-hidden", className),
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {
			className: "h-full w-full rounded-[inherit]",
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollBar, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Corner, {})
	]
}));
ScrollArea.displayName = Root.displayName;
var ScrollBar = import_react.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaScrollbar, {
	ref,
	orientation,
	className: cn("flex touch-none select-none transition-colors", orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]", orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
}));
ScrollBar.displayName = ScrollAreaScrollbar.displayName;
function ExecutionTimeline({ steps }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const done = steps.filter((s) => s.status === "completed").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setOpen((v) => !v),
			className: "flex w-full items-center justify-between px-3 py-2 text-left text-xs font-medium",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: cn("h-3.5 w-3.5", steps.some((s) => s.status === "running") && "animate-spin") }),
					"Agent execution · ",
					done,
					"/",
					steps.length
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("h-3.5 w-3.5 transition-transform", open && "rotate-180") })]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "space-y-2 border-t px-3 py-3",
			children: steps.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-start gap-2 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepIcon, { status: s.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: s.label
					}), s.detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-0.5 text-muted-foreground",
						children: s.detail
					})]
				})]
			}, s.id))
		})]
	});
}
function StepIcon({ status }) {
	const base = "mt-0.5 h-3.5 w-3.5 shrink-0";
	if (status === "completed") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: cn(base, "text-success") });
	if (status === "running") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: cn(base, "animate-spin text-primary") });
	if (status === "failed") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: cn(base, "text-destructive") });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: cn(base, "text-muted-foreground") });
}
function Paragraph({ children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: cn("text-sm leading-relaxed text-foreground mb-3", props.className),
		...props,
		children
	});
}
function UnorderedList({ children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: cn("space-y-1.5 ml-4 mb-3", props.className),
		...props,
		children: import_react.Children.map(children, (child) => import_react.isValidElement(child) ? import_react.cloneElement(child, { className: "relative pl-1" }) : child)
	});
}
function ListItem({ children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: cn("text-sm leading-relaxed text-foreground", props.className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "absolute -left-4 text-success",
			"aria-hidden": "true",
			children: ["•", " "]
		}), children]
	});
}
function OrderedList({ children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: cn("space-y-1.5 ml-4 mb-3 list-decimal", props.className),
		...props,
		children
	});
}
function InlineCode({ children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
		className: cn("px-1.5 py-0.5 text-xs font-mono bg-muted rounded border border-border", props.className),
		...props,
		children
	});
}
function CodeBlock({ children, className, ...props }) {
	const language = className?.replace("language-", "") || "";
	const code = import_react.Children.toArray(children).find((c) => typeof c === "string");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative group my-4 rounded-lg border border-border bg-muted/50 overflow-hidden",
		children: [language && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute top-0 right-0 z-10 px-2 py-0.5 text-xs text-muted-foreground bg-muted/80 backdrop-blur-sm border-b border-l border-border",
			children: language
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
			...props,
			className: cn("p-4 overflow-x-auto text-xs font-mono leading-relaxed", props.className),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
				className: "text-foreground",
				children: code?.trim()
			})
		})]
	});
}
function Table({ children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "my-4 overflow-x-auto rounded-lg border border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
			className: cn("w-full text-sm", props.className),
			...props,
			children
		})
	});
}
function TableHead({ children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
		className: "bg-muted/50 border-b border-border",
		...props,
		children
	});
}
function TableBody({ children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
		className: "divide-y divide-border",
		...props,
		children
	});
}
function TableRow({ children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
		className: "hover:bg-muted/30 transition-colors",
		...props,
		children
	});
}
function TableCell({ children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
		className: cn("px-3 py-2 font-medium text-left text-foreground", props.className),
		...props,
		children
	});
}
function TableDataCell({ children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
		className: cn("px-3 py-2 text-foreground", props.className),
		...props,
		children
	});
}
function Blockquote({ children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", {
		className: cn("border-l-3 border-primary pl-4 py-1 my-3 italic text-muted-foreground", props.className),
		...props,
		children
	});
}
function ThematicBreak({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", {
		className: cn("my-4 border-border", props.className),
		...props
	});
}
function Strong({ children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
		className: cn("font-semibold text-foreground", props.className),
		...props,
		children
	});
}
function Emphasis({ children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
		className: cn("italic", props.className),
		...props,
		children
	});
}
function Link({ children, href, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href,
		target: "_blank",
		rel: "noopener noreferrer",
		className: cn("text-primary underline underline-offset-2 hover:text-primary/80", props.className),
		...props,
		children
	});
}
function H1({ children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: cn("text-xl font-semibold text-foreground mb-4 mt-6 pb-2 border-b border-border", props.className),
		...props,
		children
	});
}
function H2({ children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: cn("text-lg font-semibold text-foreground mb-3 mt-5", props.className),
		...props,
		children
	});
}
function H3({ children, ...props }) {
	const emojiMap = {
		"Key Points": "📋",
		"Key points": "📋",
		Analysis: "📈",
		Anomalies: "⚠️",
		Risks: "⚠️",
		Outlook: "🔮",
		Recommendation: "💡",
		Summary: "📝",
		Overview: "📊"
	};
	const text = import_react.Children.toArray(children).find((c) => typeof c === "string");
	const emoji = text && emojiMap[text.trim()] ? emojiMap[text.trim()] : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
		className: cn("text-base font-semibold text-foreground mb-2 mt-4 flex items-center gap-2", props.className),
		...props,
		children: [emoji && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			"aria-hidden": "true",
			children: emoji
		}), children]
	});
}
function MarkdownRenderer({ content, className }) {
	if (!content?.trim()) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("max-w-none", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, {
			remarkPlugins: [remarkGfm],
			components: {
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
				a: Link
			},
			children: content
		})
	});
}
function ChatMessage({ message }) {
	const isUser = message.role === "user";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex w-full gap-3 mb-6", isUser ? "justify-end" : "justify-start"),
		children: [
			!isUser && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
				className: "mt-1 h-7 w-7 shrink-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
					className: "bg-primary text-[10px] text-primary-foreground",
					children: "AI"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("min-w-0 max-w-[85%] space-y-4", isUser ? "rounded-2xl bg-primary px-4 py-2.5 text-primary-foreground" : "rounded-2xl bg-muted px-4 py-2.5"),
				children: [message.execution && message.execution.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExecutionTimeline, { steps: message.execution }), message.blocks.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockRenderer, {
					block: b,
					inUser: isUser
				}, i))]
			}),
			isUser && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
				className: "mt-1 h-7 w-7 shrink-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
					className: "text-[10px]",
					children: "You"
				})
			})
		]
	});
}
function BlockRenderer({ block, inUser }) {
	switch (block.type) {
		case "text":
			if (inUser) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "whitespace-pre-wrap text-sm leading-relaxed",
				children: block.text
			});
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarkdownRenderer, {
				content: block.text,
				className: "text-sm"
			});
		case "markdown": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarkdownRenderer, {
			content: block.markdown,
			className: "text-sm"
		});
		case "code": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "overflow-hidden p-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-between border-b bg-muted/50 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
				children: block.language
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "overflow-x-auto p-3 text-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: block.code })
			})]
		});
		case "table": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-80 overflow-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table$1, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow$1, { children: block.columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead$1, { children: c }, c)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody$1, { children: block.rows.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow$1, { children: block.columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell$1, {
					className: "text-xs",
					children: String(row[c] ?? "")
				}, c)) }, i)) })] })
			})
		});
		case "chart": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, { spec: block.chart });
		case "image": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: block.url,
			alt: block.alt ?? "",
			className: "max-h-96 rounded-lg border object-contain"
		});
		case "pdf":
			const pdfUrl = block.url.startsWith("http://") || block.url.startsWith("https://") ? block.url : `${baseURL}${block.url}`;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex items-center gap-3 p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-9 w-9 place-items-center rounded-md bg-destructive/10 text-destructive",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-sm font-medium",
							children: block.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "PDF report"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						variant: "secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: pdfUrl,
							target: "_blank",
							rel: "noreferrer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1 h-3.5 w-3.5" }), "Download"]
						})
					})
				]
			});
		case "status": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs italic text-muted-foreground",
			children: block.status
		});
		case "reasoning": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
			className: "rounded-md border bg-muted/40 px-3 py-2 text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
				className: "cursor-pointer font-medium text-muted-foreground",
				children: "Reasoning"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 whitespace-pre-wrap text-muted-foreground",
				children: block.text
			})]
		});
		default: return null;
	}
}
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
function ChatInput({ onSend, onVoice, onFile, disabled }) {
	const [value, setValue] = (0, import_react.useState)("");
	const [recording, setRecording] = (0, import_react.useState)(false);
	const recRef = (0, import_react.useRef)(null);
	const chunksRef = (0, import_react.useRef)([]);
	const fileInputRef = (0, import_react.useRef)(null);
	const submit = () => {
		const v = value.trim();
		if (!v || disabled) return;
		onSend(v);
		setValue("");
	};
	const toggleRecord = async () => {
		if (recording) {
			recRef.current?.stop();
			return;
		}
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const rec = new MediaRecorder(stream);
			chunksRef.current = [];
			rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
			rec.onstop = () => {
				stream.getTracks().forEach((t) => t.stop());
				setRecording(false);
				const blob = new Blob(chunksRef.current, { type: "audio/webm" });
				onVoice?.(blob);
			};
			rec.start();
			recRef.current = rec;
			setRecording(true);
		} catch {
			toast.error("Microphone access denied");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative rounded-2xl border bg-card shadow-sm focus-within:ring-2 focus-within:ring-ring",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
			value,
			onChange: (e) => setValue(e.target.value),
			onKeyDown: (e) => {
				if (e.key === "Enter" && !e.shiftKey) {
					e.preventDefault();
					submit();
				}
			},
			placeholder: "Ask about your data, generate a chart, forecast, or run SQL…",
			rows: 2,
			className: "min-h-[70px] resize-none border-0 bg-transparent px-4 py-3 pr-2 text-sm shadow-none focus-visible:ring-0",
			disabled
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-t px-2 py-1.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-0.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileInputRef,
						type: "file",
						className: "hidden",
						accept: ".csv,.pdf,.docx,.doc,.png,.jpg,.jpeg,.webp,.gif,.bmp,.tiff",
						onChange: (e) => e.target.files?.[0] && onFile?.(e.target.files[0])
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						size: "icon",
						variant: "ghost",
						className: "h-8 w-8",
						onClick: () => fileInputRef.current?.click(),
						"aria-label": "Attach file",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						size: "icon",
						variant: "ghost",
						className: cn("h-8 w-8", recording && "text-destructive"),
						onClick: toggleRecord,
						"aria-label": "Voice",
						children: recording ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-4 w-4" })
					}),
					recording && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-1 flex items-center gap-1 text-xs text-destructive",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 animate-pulse rounded-full bg-destructive" }), "Listening…"]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				onClick: submit,
				disabled: disabled || !value.trim(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "mr-1 h-3.5 w-3.5" }), " Send"]
			})]
		})]
	});
}
var quickActions = [
	{
		label: "Analyze",
		action: "analyze",
		icon: Sparkles
	},
	{
		label: "Generate Chart",
		action: "chart",
		icon: ChartColumn
	},
	{
		label: "Detect Anomalies",
		action: "anomaly",
		icon: TriangleAlert
	},
	{
		label: "Forecast",
		action: "forecast",
		icon: TrendingUp
	},
	{
		label: "Generate SQL",
		action: "sql",
		icon: CodeXml
	},
	{
		label: "Generate Pandas",
		action: "pandas",
		icon: CodeXml
	},
	{
		label: "Generate Report",
		action: "report",
		icon: FileText
	}
];
var suggestions = [
	"Give me an overview of the current dataset",
	"Which columns have the most missing values?",
	"Plot revenue vs. month as a line chart",
	"Forecast next 6 months of orders",
	"Detect anomalies in the sales column"
];
function ChatPage() {
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [conversationId, setConversationId] = (0, import_react.useState)();
	const [selectedDatasetIds, setSelectedDatasetIds] = (0, import_react.useState)([]);
	const [datasetDropdownOpen, setDatasetDropdownOpen] = (0, import_react.useState)(false);
	const scrollRef = (0, import_react.useRef)(null);
	const [showHistory, setShowHistory] = (0, import_react.useState)(true);
	const [history, setHistory] = (0, import_react.useState)([]);
	const { data: datasets = [] } = useQuery({
		queryKey: ["datasets"],
		queryFn: () => endpoints.listDatasets(),
		refetchInterval: 1e4
	});
	const selectedDatasets = datasets.filter((d) => selectedDatasetIds.includes(d.id));
	const selectedDatasetId = selectedDatasetIds.join(",") || void 0;
	const toggleDataset = (id) => {
		setSelectedDatasetIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
	};
	const chat = useMutation({
		mutationFn: (req) => endpoints.chat(req),
		onSuccess: (res) => {
			setConversationId(res.conversation_id);
			setMessages((prev) => [...prev, res.message]);
		},
		onError: (err) => toast.error(err.message)
	});
	const voice = useMutation({
		mutationFn: (blob) => endpoints.voice(blob),
		onSuccess: (res) => {
			setConversationId(res.conversation_id);
			setMessages((prev) => [...prev, res.message]);
		},
		onError: (err) => toast.error(err.message)
	});
	const uploadAndSelect = async (file) => {
		try {
			toast.info(`Uploading ${file.name}...`);
			const res = await endpoints.upload(file);
			setSelectedDatasetIds((prev) => [...prev, res.dataset.id]);
			toast.success(`${file.name} uploaded and added to active datasets`);
			send(`I just uploaded "${file.name}". Please analyze it and give me a summary.`, "analyze", [...selectedDatasetIds, res.dataset.id].join(","));
		} catch (e) {
			toast.error(e.message);
		}
	};
	(0, import_react.useEffect)(() => {
		scrollRef.current?.scrollTo({
			top: scrollRef.current.scrollHeight,
			behavior: "smooth"
		});
	}, [messages, chat.isPending]);
	(0, import_react.useEffect)(() => {
		const stored = localStorage.getItem("chat_history");
		if (stored) try {
			setHistory(JSON.parse(stored));
		} catch {
			setHistory([]);
		}
	}, []);
	const saveHistory = (newHistory) => {
		setHistory(newHistory);
		localStorage.setItem("chat_history", JSON.stringify(newHistory));
	};
	const loadConversation = (id) => {
		if (history.find((h) => h.id === id)) toast.info("Loading conversation...");
	};
	const deleteConversation = (id) => {
		const newHistory = history.filter((h) => h.id !== id);
		saveHistory(newHistory);
		toast.success("Conversation deleted");
	};
	const send = (text, action, overrideDatasetId) => {
		const user = {
			id: crypto.randomUUID(),
			role: "user",
			created_at: (/* @__PURE__ */ new Date()).toISOString(),
			blocks: [{
				type: "text",
				text
			}]
		};
		setMessages((m) => [...m, user]);
		chat.mutate({
			message: text,
			action,
			conversation_id: conversationId,
			dataset_id: overrideDatasetId ?? selectedDatasetId
		});
	};
	const newConversation = () => {
		setMessages([]);
		setConversationId(void 0);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-[calc(100vh-3.5rem)] min-h-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "hidden w-64 shrink-0 flex-col border-r bg-sidebar/30 md:flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold",
						children: "Conversations"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						className: "h-7 w-7",
						onClick: newConversation,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-b p-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search",
							className: "h-8 pl-8 text-xs"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b p-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-1 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Active Datasets" }), selectedDatasetIds.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSelectedDatasetIds([]),
								className: "normal-case text-[10px] font-normal text-muted-foreground hover:text-foreground",
								children: "Clear"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setDatasetDropdownOpen(!datasetDropdownOpen),
								className: "flex w-full items-center gap-1.5 rounded-md border bg-card px-2 py-1.5 text-left text-xs transition hover:bg-accent",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "h-3.5 w-3.5 shrink-0 text-muted-foreground" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "min-w-0 flex-1 truncate",
										children: selectedDatasets.length === 0 ? "None selected" : selectedDatasets.length === 1 ? selectedDatasets[0].name : `${selectedDatasets.length} files selected`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3 w-3 text-muted-foreground" })
								]
							}), datasetDropdownOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-auto rounded-md border bg-popover shadow-md",
								children: [datasets.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "px-3 py-2 text-xs text-muted-foreground",
									children: "No datasets uploaded yet."
								}), datasets.map((d) => {
									const checked = selectedDatasetIds.includes(d.id);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => toggleDataset(d.id),
										className: "flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs hover:bg-accent",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `grid h-3.5 w-3.5 shrink-0 place-items-center rounded-sm border ${checked ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"}`,
												children: checked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-[1px] bg-current" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "min-w-0 flex-1 truncate",
												children: d.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] uppercase text-muted-foreground",
												children: d.type
											})
										]
									}, d.id);
								})]
							})]
						}),
						selectedDatasets.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-[10px] leading-snug text-muted-foreground",
							children: [
								"Questions will be answered across all ",
								selectedDatasets.length,
								" ",
								"selected files."
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
					className: "flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-2 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex items-center justify-between px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Chat History" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								className: "h-6 w-6",
								onClick: () => setShowHistory(!showHistory),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("h-3 w-3 transition-transform", showHistory && "rotate-180") })
							})]
						}), showHistory ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: history.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
								title: "No conversations",
								description: "Start a chat to see history here."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2",
								children: history.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "group flex items-center justify-between gap-2 px-2 py-1.5 rounded-md hover:bg-accent transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => loadConversation(h.id),
										className: "flex items-center gap-2 min-w-0 flex-1 text-left text-xs text-foreground hover:text-primary",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-3.5 w-3.5 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1 truncate",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium truncate",
												children: h.title
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] text-muted-foreground truncate",
												children: new Date(h.created_at).toLocaleString()
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "icon",
										variant: "ghost",
										className: "h-6 w-6 opacity-0 group-hover:opacity-100 text-destructive",
										onClick: (e) => {
											e.stopPropagation();
											deleteConversation(h.id);
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
									})]
								}, h.id))
							})
						}) : null]
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b px-4 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium",
								children: "Agent"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								className: "text-[10px]",
								children: "LangGraph"
							}),
							selectedDatasets.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: "gap-1 text-[10px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "h-2.5 w-2.5" }), d.name]
							}, d.id))
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: newConversation,
						children: "New chat"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: scrollRef,
					className: "flex-1 overflow-y-auto px-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-7xl space-y-6 py-6",
						children: [messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-10 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-4 text-lg font-semibold",
									children: "What would you like to analyze?"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: "Upload one or more files (CSV, Excel, image of a table) or select datasets, then ask anything — I can work across multiple files at once."
								}),
								selectedDatasets.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-amber-500",
									children: "💡 Select one or more datasets from the left panel or attach a file below to get started."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mx-auto mt-6 flex max-w-xl flex-wrap justify-center gap-2",
									children: suggestions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => send(s),
										className: "rounded-full border bg-card px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-foreground",
										children: s
									}, s))
								})
							]
						}) : messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatMessage, { message: m }, m.id)), (chat.isPending || voice.isPending) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 animate-bounce rounded-full bg-current" })
								]
							}), "Thinking…"]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-t bg-background px-4 py-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-7xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-2 flex flex-wrap gap-1.5",
								children: quickActions.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									className: "h-7 gap-1 text-xs",
									onClick: () => send(`${q.label} the current dataset`, q.action),
									disabled: selectedDatasetIds.length === 0 && q.action !== "analyze",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(q.icon, { className: "h-3 w-3" }), q.label]
								}, q.action))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatInput, {
								onSend: send,
								onVoice: (b) => voice.mutate(b),
								onFile: uploadAndSelect,
								disabled: chat.isPending
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-center text-[11px] text-muted-foreground",
								children: "Responses are generated by AI. Verify important numbers."
							})
						]
					})
				})
			]
		})]
	});
}
//#endregion
export { ChatPage as component };
