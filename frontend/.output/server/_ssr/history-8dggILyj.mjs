import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { c as endpoints, n as CardContent, t as Card } from "./card-p0q76zfJ.mjs";
import { t as Skeleton } from "./skeleton-Cua007Ue.mjs";
import { t as PageHeader } from "./PageHeader-BNUwIXkP.mjs";
import { t as EmptyState } from "./EmptyState-BEUkqRD1.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { N as History, m as Search } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-D5rG16KZ.mjs";
import { t as Badge } from "./badge-C3c8r6ZW.mjs";
import { i as TabsTrigger, r as TabsList, t as Tabs } from "./tabs-DaHw2DQ0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/history-8dggILyj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KINDS = [
	{
		id: "all",
		label: "All"
	},
	{
		id: "conversation",
		label: "Conversations"
	},
	{
		id: "analysis",
		label: "Analyses"
	},
	{
		id: "chart",
		label: "Charts"
	},
	{
		id: "report",
		label: "Reports"
	},
	{
		id: "export",
		label: "Exports"
	}
];
function HistoryPage() {
	const q = useQuery({
		queryKey: ["history"],
		queryFn: endpoints.listHistory,
		retry: false
	});
	const [kind, setKind] = (0, import_react.useState)("all");
	const [text, setText] = (0, import_react.useState)("");
	const items = (q.data ?? []).filter((h) => kind === "all" ? true : h.kind === kind).filter((h) => text ? h.title.toLowerCase().includes(text.toLowerCase()) : true);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "History",
				description: "Everything you and the agent produced."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
					value: kind,
					onValueChange: setKind,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList, { children: KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: k.id,
						children: k.label
					}, k.id)) })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full sm:max-w-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Search history",
						className: "h-9 pl-8",
						value: text,
						onChange: (e) => setText(e.target.value)
					})]
				})]
			}),
			q.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: [
					0,
					1,
					2,
					3,
					4
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-14" }, i))
			}) : q.isError || items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-4 w-4" }),
				title: "Nothing here yet",
				description: "Your conversations, charts, and reports will appear here."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: items.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "flex items-center justify-between gap-3 p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-sm font-medium",
							children: h.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: new Date(h.created_at).toLocaleString()
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "text-[10px] uppercase",
						children: h.kind
					})]
				}) }, h.id))
			})
		]
	});
}
//#endregion
export { HistoryPage as component };
