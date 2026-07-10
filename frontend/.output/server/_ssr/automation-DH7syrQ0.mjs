import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { c as endpoints, n as CardContent, t as Card } from "./card-CIRZ9Enz.mjs";
import { t as Button } from "./button-CFceoTe1.mjs";
import { t as Skeleton } from "./skeleton-C5AWpaWC.mjs";
import { t as PageHeader } from "./PageHeader-BNUwIXkP.mjs";
import { t as EmptyState } from "./EmptyState-CmNGhisn.mjs";
import { t as StatusPill } from "./StatusPill-TTQxhMJP.mjs";
import { n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { P as HardDrive, _ as Play, p as Send, t as Zap, w as Mail } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/automation-DH7syrQ0.js
var import_jsx_runtime = require_jsx_runtime();
var iconFor = {
	gmail: Mail,
	telegram: Send,
	google_drive: HardDrive
};
function AutomationPage() {
	const q = useQuery({
		queryKey: ["automation"],
		queryFn: endpoints.listAutomation,
		retry: false
	});
	const run = useMutation({
		mutationFn: (service) => endpoints.runAutomation(service),
		onSuccess: (r) => toast.success(`Ran workflow: ${r.service}`),
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
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "flex flex-col gap-3 p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 place-items-center rounded-md bg-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(iconFor[s.name] ?? Zap, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-sm font-semibold",
								children: s.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
								status: s.connected ? "ok" : "muted",
								label: s.connected ? "Connected" : "Disconnected"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "secondary",
							className: "flex-1",
							children: s.connected ? "Test" : "Connect"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							className: "flex-1",
							disabled: !s.connected,
							onClick: () => run.mutate(s.name),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "mr-1 h-3.5 w-3.5" }), "Run"]
						})]
					})]
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
