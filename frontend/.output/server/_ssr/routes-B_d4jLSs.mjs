import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { a as CardTitle, c as endpoints, i as CardHeader, n as CardContent, t as Card } from "./card-p0q76zfJ.mjs";
import { t as Button } from "./button-Coo4cett.mjs";
import { t as Skeleton } from "./skeleton-Cua007Ue.mjs";
import { t as PageHeader } from "./PageHeader-BNUwIXkP.mjs";
import { t as EmptyState } from "./EmptyState-BEUkqRD1.mjs";
import { t as StatusPill } from "./StatusPill-D3ZyM0ki.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { C as MessagesSquare, P as FileText, X as ChartColumn, a as Upload, d as Sparkles, et as ArrowRight, rt as Activity, z as Database } from "../_libs/lucide-react.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B_d4jLSs.js
var import_jsx_runtime = require_jsx_runtime();
var quickActions = [
	{
		label: "Upload Dataset",
		to: "/datasets/upload",
		icon: Upload,
		desc: "Bring CSV, PDF, DOCX or images"
	},
	{
		label: "Analyze Dataset",
		to: "/datasets",
		icon: Database,
		desc: "Explore rows, schema, joins"
	},
	{
		label: "Generate Dashboard",
		to: "/dashboard",
		icon: ChartColumn,
		desc: "BI-ready charts & KPIs"
	},
	{
		label: "Generate Report",
		to: "/reports",
		icon: FileText,
		desc: "One-click PDF summaries"
	},
	{
		label: "Open AI Chat",
		to: "/chat",
		icon: MessagesSquare,
		desc: "Ask questions in natural language"
	}
];
var suggested = [
	"Summarize the latest dataset and highlight anomalies",
	"Show revenue trend by region for the last 12 months",
	"Forecast next quarter's orders",
	"Compare customer churn across segments"
];
function HomePage() {
	const datasets = useQuery({
		queryKey: ["datasets"],
		queryFn: endpoints.listDatasets,
		retry: false
	});
	const reports = useQuery({
		queryKey: ["reports"],
		queryFn: endpoints.listReports,
		retry: false
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Welcome back",
				description: "Your agentic AI data analyst — chat, analyze, visualize, and report.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/chat",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mr-1.5 h-4 w-4" }), " Start a conversation"]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5",
				children: quickActions.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: a.to,
					className: "group flex flex-col justify-between rounded-lg border bg-card p-4 transition hover:border-primary/40 hover:shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(a.icon, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium",
								children: a.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 line-clamp-2 text-xs text-muted-foreground",
								children: a.desc
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center text-xs text-muted-foreground group-hover:text-primary",
							children: ["Open ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 h-3 w-3" })]
						})
					]
				}, a.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Recently uploaded"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: datasets.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: [
							0,
							1,
							2
						].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-14 w-full" }, i))
					}) : datasets.isError || !datasets.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "h-4 w-4" }),
						title: "No datasets yet",
						description: "Upload a CSV, PDF, DOCX or image to get started.",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/datasets/upload",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mr-1 h-3.5 w-3.5" }), " Upload dataset"]
							})
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y",
						children: datasets.data.slice(0, 5).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between py-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-sm font-medium",
									children: d.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [
										d.rows.toLocaleString(),
										" rows · ",
										d.columns,
										" cols ·",
										" ",
										d.type
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "sm",
								variant: "ghost",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/datasets/$id",
									params: { id: d.id },
									children: "Open"
								})
							})]
						}, d.id))
					}) })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "System status"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "API",
							pill: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
								status: datasets.isError ? "warn" : "ok",
								label: datasets.isError ? "Unreachable" : "Online"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Agent",
							pill: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
								status: "ok",
								label: "Ready"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Automation",
							pill: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
								status: "muted",
								label: "Idle"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Vector store",
							pill: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
								status: "ok",
								label: "Ready"
							})
						})
					]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Suggested questions"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "flex flex-wrap gap-2",
						children: suggested.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/chat",
							className: "rounded-full border bg-card px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-foreground",
							children: s
						}, s))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Recent reports"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: reports.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-16 w-full" }) : reports.isError || !reports.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4" }),
					title: "No reports yet",
					description: "Generated reports will appear here."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: reports.data.slice(0, 4).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: r.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: new Date(r.created_at).toLocaleDateString()
						})]
					}, r.id))
				}) })] })]
			})
		]
	});
}
function Row({ label, pill }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: label
		}), pill]
	});
}
//#endregion
export { HomePage as component };
