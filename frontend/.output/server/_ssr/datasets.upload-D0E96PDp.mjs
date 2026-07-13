import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { c as endpoints, n as CardContent, s as cn, t as Card } from "./card-_vjpV4Yv.mjs";
import { t as Button } from "./button-ih6imc4C.mjs";
import { t as PageHeader } from "./PageHeader-BNUwIXkP.mjs";
import { G as CircleCheck, H as CloudUpload, O as LoaderCircle, P as FileText, W as CircleX } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-10I2k8GH.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Root, t as Indicator } from "../_libs/radix-ui__react-progress.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/datasets.upload-D0E96PDp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Progress = import_react.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Indicator, {
		className: "h-full w-full flex-1 bg-primary transition-all",
		style: { transform: `translateX(-${100 - (value || 0)}%)` }
	})
}));
Progress.displayName = Root.displayName;
var ACCEPT = ".csv,.pdf,.docx,.doc,.png,.jpg,.jpeg,.webp";
function UploadPage() {
	const navigate = useNavigate();
	const [items, setItems] = (0, import_react.useState)([]);
	const [dragOver, setDragOver] = (0, import_react.useState)(false);
	const upload = (0, import_react.useCallback)(async (file) => {
		setItems((prev) => [...prev, {
			file,
			progress: 0,
			status: "uploading"
		}]);
		try {
			const res = await endpoints.upload(file, (pct) => setItems((prev) => prev.map((it) => it.file === file ? {
				...it,
				progress: pct
			} : it)));
			setItems((prev) => prev.map((it) => it.file === file ? {
				...it,
				status: "done",
				progress: 100,
				dataset: res.dataset
			} : it));
			toast.success(`${file.name} uploaded`);
		} catch (e) {
			const msg = e.message;
			setItems((prev) => prev.map((it) => it.file === file ? {
				...it,
				status: "error",
				error: msg
			} : it));
			toast.error(msg);
		}
	}, []);
	const onFiles = (files) => {
		if (!files) return;
		Array.from(files).forEach(upload);
	};
	const latest = items.find((i) => i.status === "done" && i.dataset)?.dataset;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Upload dataset",
				description: "Drop CSV, PDF, DOCX, or image files. We'll extract tables, text, and schema."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				onDragOver: (e) => {
					e.preventDefault();
					setDragOver(true);
				},
				onDragLeave: () => setDragOver(false),
				onDrop: (e) => {
					e.preventDefault();
					setDragOver(false);
					onFiles(e.dataTransfer.files);
				},
				className: cn("flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-card px-6 py-14 text-center transition", dragOver ? "border-primary bg-primary/5" : "border-border"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-4 text-base font-semibold",
						children: "Drop files to upload"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "CSV · PDF · DOCX · Images (PNG, JPG, WEBP)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							multiple: true,
							accept: ACCEPT,
							className: "hidden",
							onChange: (e) => onFiles(e.target.files)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-flex cursor-pointer items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
							children: "Browse files"
						})]
					})
				]
			}),
			items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 space-y-2",
				children: items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "flex items-center gap-3 p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-9 w-9 shrink-0 place-items-center rounded-md bg-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-muted-foreground" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "min-w-0 truncate text-sm font-medium",
											children: it.file.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[10px] uppercase",
											children: it.file.type.split("/")[1] || "file"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground",
											children: [(it.file.size / 1024).toFixed(1), " KB"]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
									value: it.progress,
									className: "mt-1.5 h-1.5"
								}),
								it.status === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-xs text-destructive",
									children: it.error
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "shrink-0",
							children: [
								it.status === "uploading" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-muted-foreground" }),
								it.status === "done" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-success" }),
								it.status === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4 text-destructive" })
							]
						})
					]
				}) }, it.file.name + it.file.lastModified))
			}),
			latest && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-3 text-sm font-semibold",
						children: "Extraction results"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3 md:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaCard, {
								label: "Rows",
								value: latest.rows.toLocaleString()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaCard, {
								label: "Columns",
								value: latest.columns.toString()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaCard, {
								label: "Detected tables",
								value: String(latest.detected_tables ?? 0)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaCard, {
								label: "Missing values",
								value: String(latest.missing_values ?? 0)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaCard, {
								label: "Quality score",
								value: latest.quality_score ? `${Math.round(latest.quality_score)}%` : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaCard, {
								label: "Detected text",
								value: String(latest.detected_text ?? 0)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaCard, {
								label: "Join keys",
								value: (latest.possible_join_keys ?? []).join(", ") || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaCard, {
								label: "Type",
								value: latest.type
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => navigate({
								to: "/datasets/$id",
								params: { id: latest.id }
							}),
							children: "Open dataset"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => navigate({ to: "/chat" }),
							children: "Analyze in chat"
						})]
					})
				]
			})
		]
	});
}
function MetaCard({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] uppercase tracking-wide text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 truncate text-sm font-semibold",
			children: value
		})]
	}) });
}
//#endregion
export { UploadPage as component };
