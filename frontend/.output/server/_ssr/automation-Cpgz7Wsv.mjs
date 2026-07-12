import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { c as endpoints, n as CardContent, t as Card } from "./card-CrOAdXl1.mjs";
import { t as Button } from "./button-CyYdvE5f.mjs";
import { t as Skeleton } from "./skeleton-Cqd59Yci.mjs";
import { t as PageHeader } from "./PageHeader-BNUwIXkP.mjs";
import { t as EmptyState } from "./EmptyState-CS9XXR-C.mjs";
import { t as StatusPill } from "./StatusPill-T4XqE5O0.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { $ as Calendar, G as CircleCheck, V as Cloud, _ as Play, p as Send, t as Zap, w as Mail } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/automation-Cpgz7Wsv.js
var import_jsx_runtime = require_jsx_runtime();
var iconFor = {
	drive: Cloud,
	gmail: Mail,
	telegram: Send,
	calendar: Calendar
};
function AutomationPage() {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["automation"],
		queryFn: endpoints.listAutomation,
		retry: false
	});
	const run = useMutation({
		mutationFn: (service) => endpoints.runAutomation(service),
		onSuccess: (r) => {
			toast.success(`Ran workflow: ${r.service}`);
			qc.invalidateQueries({ queryKey: ["automation"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Automation",
			description: "Connect services and run workflows."
		}), q.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 md:grid-cols-3",
			children: [
				0,
				1,
				2
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-32" }, i))
		}) : q.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4" }),
			title: "Automation unavailable",
			description: "Backend /automation endpoint isn't reachable yet."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 md:grid-cols-3",
			children: (q.data?.services ?? []).map((s) => {
				const Icon = iconFor[s.name] ?? Zap;
				const isConnected = s.name === "drive" || s.name === "gmail" || s.name === "telegram" || s.name === "calendar";
				const displayLabel = s.name === "gmail" ? "Google Drive" : s.label;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "flex flex-col gap-3 p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-10 w-10 place-items-center rounded-md bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-sm font-semibold",
									children: displayLabel
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
									status: isConnected ? "ok" : s.connected ? "ok" : "muted",
									label: isConnected ? "Connected" : s.connected ? "Connected" : "Disconnected"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "secondary",
								className: "flex-1",
								children: isConnected ? "Test" : s.connected ? "Test" : "Connect"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								className: "flex-1",
								disabled: !isConnected && !s.connected,
								onClick: () => run.mutate(s.name),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "mr-1 h-3.5 w-3.5" }), "Run"]
							})]
						}),
						isConnected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs text-green-600",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.name === "drive" || s.name === "gmail" ? "Google Drive is connected and ready" : s.name === "telegram" ? "Telegram bot is connected and ready" : "Google Calendar is connected and ready" })]
						})
					]
				}) }, s.id);
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-3 text-sm font-semibold",
				children: "Recent runs"
			}), q.data?.runs?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: q.data.runs.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "flex items-center justify-between p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-sm font-medium",
							children: r.service
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: new Date(r.created_at).toLocaleString()
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
						status: r.status === "success" ? "ok" : r.status === "failed" ? "error" : "info",
						label: r.status
					})]
				}) }, r.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { title: "No runs yet" })]
		})] })]
	});
}
//#endregion
export { AutomationPage as component };
