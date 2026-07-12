import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { c as endpoints, n as CardContent, o as baseURL, t as Card } from "./card-p0q76zfJ.mjs";
import { t as Button } from "./button-Coo4cett.mjs";
import { t as Skeleton } from "./skeleton-Cua007Ue.mjs";
import { t as PageHeader } from "./PageHeader-BNUwIXkP.mjs";
import { t as EmptyState } from "./EmptyState-BEUkqRD1.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { F as Eye, P as FileText, R as Download, W as CircleCheck, c as Trash2, p as Send } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-DsxYFuKQ.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Resolve a report URL to an absolute URL pointing to the backend server.
* Backend stores relative paths like "/reports-files/rep_xxx.pdf".
*/
function toFileUrl(path) {
	if (!path) return void 0;
	if (path.startsWith("http://") || path.startsWith("https://")) return path;
	return `${baseURL}${path}`;
}
function ReportsPage() {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["reports"],
		queryFn: endpoints.listReports,
		retry: false
	});
	const del = useMutation({
		mutationFn: (id) => endpoints.deleteReport(id),
		onSuccess: () => {
			toast.success("Report deleted");
			qc.invalidateQueries({ queryKey: ["reports"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const sendToTelegram = useMutation({
		mutationFn: (reportId) => endpoints.sendReportToTelegram(reportId),
		onSuccess: () => {
			toast.success("Report sent to Telegram");
			qc.invalidateQueries({ queryKey: ["reports"] });
		},
		onError: (e) => toast.error(e.message || "Failed to send to Telegram")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Reports",
			description: "Generated PDF and DOCX reports from your analyses."
		}), q.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 md:grid-cols-2 lg:grid-cols-3",
			children: [
				0,
				1,
				2
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-36" }, i))
		}) : q.isError || !q.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" }),
			title: "No reports yet",
			description: "Ask the AI to generate a report from any dataset."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 md:grid-cols-2 lg:grid-cols-3",
			children: q.data.map((r) => {
				toFileUrl(r.preview_url);
				toFileUrl(r.url);
				const telegramSent = r.telegram_sent;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "flex flex-col gap-3 p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 shrink-0 place-items-center rounded-md bg-destructive/10 text-destructive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-sm font-semibold",
									children: r.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: new Date(r.created_at).toLocaleString()
								}),
								r.dataset_name && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-0.5 truncate text-xs text-muted-foreground",
									children: ["Source: ", r.dataset_name]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [
							r.preview_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "sm",
								variant: "secondary",
								className: "w-full",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: toFileUrl(r.preview_url),
									target: "_blank",
									rel: "noreferrer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "mr-1 h-3.5 w-3.5" }), "Preview"]
								})
							}),
							r.url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "sm",
								variant: "secondary",
								className: "w-full",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: toFileUrl(r.url),
									target: "_blank",
									rel: "noreferrer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1 h-3.5 w-3.5" }), "Download PDF"]
								})
							}),
							r.docx_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "sm",
								variant: "secondary",
								className: "w-full",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: toFileUrl(r.docx_url),
									target: "_blank",
									rel: "noreferrer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1 h-3.5 w-3.5" }), "Download DOCX"]
								})
							}),
							telegramSent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								className: "w-full",
								disabled: true,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-1 h-3.5 w-3.5 text-green-600" }), "Sent to Telegram"]
							}),
							!telegramSent && r.url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								className: "w-full",
								onClick: () => sendToTelegram.mutate(r.id),
								disabled: sendToTelegram.isPending,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: `mr-1 h-3.5 w-3.5 ${sendToTelegram.isPending ? "animate-spin" : ""}` }), sendToTelegram.isPending ? "Sending..." : "Send to Telegram"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								className: "h-8 w-8 text-destructive",
								onClick: () => del.mutate(r.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
							})
						]
					})]
				}) }, r.id);
			})
		})]
	});
}
//#endregion
export { ReportsPage as component };
