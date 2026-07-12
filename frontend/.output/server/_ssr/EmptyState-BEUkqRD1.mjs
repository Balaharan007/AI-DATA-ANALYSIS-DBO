import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { s as cn } from "./card-p0q76zfJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/EmptyState-BEUkqRD1.js
var import_jsx_runtime = require_jsx_runtime();
function EmptyState({ icon, title, description, action, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-col items-center justify-center rounded-lg border border-dashed bg-card/50 px-6 py-16 text-center", className),
		children: [
			icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 grid h-11 w-11 place-items-center rounded-full bg-muted text-muted-foreground",
				children: icon
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-medium",
				children: title
			}),
			description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 max-w-sm text-sm text-muted-foreground",
				children: description
			}) : null,
			action ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5",
				children: action
			}) : null
		]
	});
}
//#endregion
export { EmptyState as t };
