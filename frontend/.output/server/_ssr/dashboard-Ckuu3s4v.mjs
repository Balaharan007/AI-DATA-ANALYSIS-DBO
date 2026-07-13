import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { c as endpoints, n as CardContent, s as cn, t as Card } from "./card-_vjpV4Yv.mjs";
import { t as Button } from "./button-ih6imc4C.mjs";
import { t as Skeleton } from "./skeleton-C3GrkLUA.mjs";
import { t as PageHeader } from "./PageHeader-BNUwIXkP.mjs";
import { t as EmptyState } from "./EmptyState-DjMT9mUV.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { Q as ChartColumn, h as RefreshCw, it as ArrowDownRight, j as Info, tt as ArrowUpRight } from "../_libs/lucide-react.mjs";
import { t as ChartCard } from "./ChartCard-D29BFGXv.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DfWkFfae.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-Ckuu3s4v.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function KpiCard({ kpi }) {
	const formatted = format(kpi.value, kpi.format);
	const up = (kpi.delta ?? 0) >= 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs uppercase tracking-wide text-muted-foreground",
				children: kpi.label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 text-2xl font-semibold tabular-nums",
				children: formatted
			}),
			typeof kpi.delta === "number" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("mt-1 inline-flex items-center gap-0.5 text-xs font-medium", up ? "text-success" : "text-destructive"),
				children: [
					up ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "h-3.5 w-3.5" }),
					Math.abs(kpi.delta).toFixed(1),
					"%"
				]
			})
		]
	}) });
}
function format(v, f) {
	if (typeof v === "string") return v;
	if (f === "currency") return v.toLocaleString(void 0, {
		style: "currency",
		currency: "USD"
	});
	if (f === "percent") return `${v.toFixed(1)}%`;
	return v.toLocaleString();
}
function DashboardPage() {
	const [selectedDatasetId, setSelectedDatasetId] = (0, import_react.useState)("");
	const { data: datasets = [] } = useQuery({
		queryKey: ["datasets"],
		queryFn: () => endpoints.listDatasets(),
		refetchInterval: 1e4
	});
	const activeDatasetId = selectedDatasetId || datasets[0]?.id || "";
	const q = useQuery({
		queryKey: ["dashboard", activeDatasetId],
		queryFn: () => endpoints.getDashboard({ dataset_id: activeDatasetId }),
		enabled: !!activeDatasetId,
		retry: false
	});
	const activeDataset = datasets.find((d) => d.id === activeDatasetId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Dashboard",
			description: activeDataset ? `BI overview for "${activeDataset.name}"` : "BI overview generated from your datasets.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: activeDatasetId,
					onValueChange: setSelectedDatasetId,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "h-9 w-56",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select a dataset" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [datasets.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "",
						disabled: true,
						children: "No datasets available"
					}), datasets.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: d.id,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatabaseIcon, { className: "h-3 w-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: d.name
							})]
						})
					}, d.id))] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => q.refetch(),
					disabled: !activeDatasetId,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-1.5 h-3.5 w-3.5" }), "Refresh"]
				})]
			})
		}), !activeDatasetId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-4 w-4" }),
			title: "No datasets uploaded",
			description: "Upload a CSV, Excel, or image of a table to see an auto-generated dashboard with KPIs and charts."
		}) : q.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5",
				children: [
					0,
					1,
					2,
					3,
					4,
					5
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-xl" }, i))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [
					0,
					1,
					2,
					3,
					4
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-[24rem] rounded-xl" }, i))
			})]
		}) : q.isError || !q.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-4 w-4" }),
			title: "Dashboard unavailable",
			description: "Could not load the dashboard. Try selecting a different dataset or refreshing."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5",
				children: q.data.kpis.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, { kpi: k }, k.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-8 lg:grid-cols-2",
				children: q.data.charts.slice(0, 5).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, { spec: c }), c.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-1 text-xs leading-relaxed text-muted-foreground",
						children: c.description
					})]
				}, c.id))
			}),
			activeDataset && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "flex items-center gap-3 p-4 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Dashboard for ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: activeDataset.name }),
						" —",
						" ",
						activeDataset.rows.toLocaleString(),
						" rows,",
						" ",
						activeDataset.columns,
						" columns",
						activeDataset.quality_score != null ? `, quality score: ${activeDataset.quality_score}%` : ""
					] })]
				})
			})
		] })]
	});
}
function DatabaseIcon({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		className,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "12",
				cy: "5",
				rx: "9",
				ry: "3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 5v14c0 1.66 3.66 3 9 3s9-1.34 9-3V5" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 12c0 1.66 3.66 3 9 3s9-1.34 9-3" })
		]
	});
}
//#endregion
export { DashboardPage as component };
