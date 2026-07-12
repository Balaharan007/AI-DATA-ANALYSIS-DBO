import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { s as cn } from "./card-p0q76zfJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/StatusPill-D3ZyM0ki.js
var import_jsx_runtime = require_jsx_runtime();
function StatusPill({ status, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium", {
			ok: "bg-success/15 text-success",
			warn: "bg-warning/15 text-warning",
			error: "bg-destructive/15 text-destructive",
			info: "bg-primary/15 text-primary",
			muted: "bg-muted text-muted-foreground"
		}[status]),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-current" }), label]
	});
}
//#endregion
export { StatusPill as t };
