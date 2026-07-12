import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { s as cn } from "./card-CrOAdXl1.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/label-DJHLSquK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STORAGE_KEY = "ada.theme";
function useTheme() {
	const [theme, setThemeState] = (0, import_react.useState)("light");
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setMounted(true);
		const stored = typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY);
		const prefersDark = typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches;
		const initial = stored ?? (prefersDark ? "dark" : "light");
		apply(initial);
		setThemeState(initial);
	}, []);
	const apply = (t) => {
		if (typeof document === "undefined") return;
		document.documentElement.classList.toggle("dark", t === "dark");
	};
	const setTheme = (0, import_react.useCallback)((t) => {
		apply(t);
		localStorage.setItem(STORAGE_KEY, t);
		setThemeState(t);
	}, []);
	return {
		theme,
		setTheme,
		toggle: (0, import_react.useCallback)(() => {
			setTheme(theme === "dark" ? "light" : "dark");
		}, [theme, setTheme]),
		mounted
	};
}
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn(labelVariants(), className),
	...props
}));
Label.displayName = Root.displayName;
//#endregion
export { useTheme as n, Label as t };
