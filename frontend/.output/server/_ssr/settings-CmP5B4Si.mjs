import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { a as CardTitle, c as endpoints, i as CardHeader, n as CardContent, s as cn, t as Card } from "./card-CIRZ9Enz.mjs";
import { t as Button } from "./button-CFceoTe1.mjs";
import { t as PageHeader } from "./PageHeader-BNUwIXkP.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-CzW6nKw2.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-C3Pwksxu.mjs";
import { n as useTheme, t as Label } from "./label-CHe2eO6w.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/radix-ui__react-slider.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-CmP5B4Si.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
var Slider = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
	ref,
	className: cn("relative flex w-full touch-none select-none items-center", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
		className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-primary" })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" })]
}));
Slider.displayName = Slider$1.displayName;
var DEFAULTS = {
	groq_model: "llama-3.3-70b-versatile",
	temperature: .2,
	language: "en",
	theme: "system",
	automation_enabled: true,
	voice_enabled: true,
	notifications_enabled: true
};
function SettingsPage() {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["settings"],
		queryFn: endpoints.getSettings,
		retry: false
	});
	const [form, setForm] = (0, import_react.useState)(DEFAULTS);
	const { theme, setTheme } = useTheme();
	(0, import_react.useEffect)(() => {
		if (q.data) setForm(q.data);
	}, [q.data]);
	const save = useMutation({
		mutationFn: (payload) => endpoints.updateSettings(payload),
		onSuccess: () => {
			toast.success("Settings saved");
			qc.invalidateQueries({ queryKey: ["settings"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const update = (k, v) => setForm((f) => ({
		...f,
		[k]: v
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Settings",
			description: "Configure model, voice, and workspace."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Model"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Groq model" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.groq_model,
								onValueChange: (v) => update("groq_model", v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "llama-3.3-70b-versatile",
										children: "Llama 3.3 70B Versatile"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "llama-3.1-70b",
										children: "Llama 3.1 70B"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "mixtral-8x7b",
										children: "Mixtral 8x7B"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "gemma2-9b",
										children: "Gemma 2 9B"
									})
								] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Temperature" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs tabular-nums text-muted-foreground",
									children: form.temperature.toFixed(2)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
								value: [form.temperature],
								onValueChange: ([v]) => update("temperature", v),
								min: 0,
								max: 1,
								step: .05
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Language" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.language,
								onChange: (e) => update("language", e.target.value),
								placeholder: "en"
							})]
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Appearance"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "space-y-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Dark mode" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Toggle app theme."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: theme === "dark",
							onCheckedChange: (v) => setTheme(v ? "dark" : "light")
						})]
					})
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Workspace"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Enable automation",
							description: "Allow the agent to run automation workflows.",
							value: form.automation_enabled,
							onChange: (v) => update("automation_enabled", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Voice input",
							description: "Enable microphone recording in chat.",
							value: form.voice_enabled,
							onChange: (v) => update("voice_enabled", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Notifications",
							description: "Notify me when reports and forecasts finish.",
							value: form.notifications_enabled,
							onChange: (v) => update("notifications_enabled", v)
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => save.mutate(form),
						disabled: save.isPending,
						children: save.isPending ? "Saving…" : "Save changes"
					})
				})
			]
		})]
	});
}
function Toggle({ label, description, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: description
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
			checked: value,
			onCheckedChange: onChange
		})]
	});
}
//#endregion
export { SettingsPage as component };
