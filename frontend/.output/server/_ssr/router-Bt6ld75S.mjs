import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime, i as Slot } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, s as cn, t as Card } from "./card-_vjpV4Yv.mjs";
import { t as Button } from "./button-ih6imc4C.mjs";
import { t as Skeleton } from "./skeleton-C3GrkLUA.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { C as MessagesSquare, D as Lock, E as LogIn, F as Eye, I as EyeOff, J as ChevronRight, M as House, N as History, O as LoaderCircle, P as FileText, T as LogOut, U as Circle, Z as Check, a as Upload, b as Moon, d as Sparkles, f as Settings, i as User, k as LayoutDashboard, l as Sun, m as Search, n as X, r as Workflow, w as Mail, y as PanelLeft, z as Database } from "../_libs/lucide-react.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as Input } from "./input-BeYdqvRM.mjs";
import { n as AvatarFallback, t as Avatar } from "./avatar-D3nEL8c-.mjs";
import { t as Badge } from "./badge-10I2k8GH.mjs";
import { n as useAuth, t as AuthProvider } from "./AuthContext-CA43rVV1.mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as Label2, c as Root2, d as SubTrigger2, f as Trigger, i as ItemIndicator2, l as Separator2, n as Content2, o as Portal2, r as Item2, s as RadioItem2, t as CheckboxItem2, u as SubContent2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { _ as Link, c as HeadContent, d as createRouter, g as createRootRouteWithContext, h as createFileRoute, l as useRouterState, m as lazyRouteComponent, p as Outlet, s as Scripts, v as useNavigate, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route$11 } from "./datasets._id-DvCEZ0WQ.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-DJdzjYkn.mjs";
import { n as useTheme, t as Label } from "./label-B00hbd8G.mjs";
import { t as Root } from "../_libs/radix-ui__react-separator.mjs";
import { a as Trigger$1, i as Root3, n as Portal, r as Provider, t as Content2$1 } from "../_libs/radix-ui__react-tooltip.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Bt6ld75S.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-Ca2Pb9Kr.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var MOBILE_BREAKPOINT = 768;
function useIsMobile() {
	const [isMobile, setIsMobile] = import_react.useState(void 0);
	import_react.useEffect(() => {
		const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
		const onChange = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};
		mql.addEventListener("change", onChange);
		setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		return () => mql.removeEventListener("change", onChange);
	}, []);
	return !!isMobile;
}
var Separator = import_react.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	decorative,
	orientation,
	className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className),
	...props
}));
Separator.displayName = Root.displayName;
var Sheet = Dialog;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription.displayName;
var TooltipProvider = Provider;
var Tooltip = Root3;
var TooltipTrigger = Trigger$1;
var TooltipContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2$1, {
	ref,
	sideOffset,
	className: cn("z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-tooltip-content-transform-origin)", className),
	...props
}) }));
TooltipContent.displayName = Content2$1.displayName;
var SIDEBAR_COOKIE_NAME = "sidebar_state";
var SIDEBAR_COOKIE_MAX_AGE = 3600 * 24 * 7;
var SIDEBAR_WIDTH = "16rem";
var SIDEBAR_WIDTH_MOBILE = "18rem";
var SIDEBAR_WIDTH_ICON = "3rem";
var SIDEBAR_KEYBOARD_SHORTCUT = "b";
var SidebarContext = import_react.createContext(null);
function useSidebar() {
	const context = import_react.useContext(SidebarContext);
	if (!context) throw new Error("useSidebar must be used within a SidebarProvider.");
	return context;
}
var SidebarProvider = import_react.forwardRef(({ defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props }, ref) => {
	const isMobile = useIsMobile();
	const [openMobile, setOpenMobile] = import_react.useState(false);
	const [_open, _setOpen] = import_react.useState(defaultOpen);
	const open = openProp ?? _open;
	const setOpen = import_react.useCallback((value) => {
		const openState = typeof value === "function" ? value(open) : value;
		if (setOpenProp) setOpenProp(openState);
		else _setOpen(openState);
		document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
	}, [setOpenProp, open]);
	const toggleSidebar = import_react.useCallback(() => {
		return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
	}, [
		isMobile,
		setOpen,
		setOpenMobile
	]);
	import_react.useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				toggleSidebar();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [toggleSidebar]);
	const state = open ? "expanded" : "collapsed";
	const contextValue = import_react.useMemo(() => ({
		state,
		open,
		setOpen,
		isMobile,
		openMobile,
		setOpenMobile,
		toggleSidebar
	}), [
		state,
		open,
		setOpen,
		isMobile,
		openMobile,
		setOpenMobile,
		toggleSidebar
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarContext.Provider, {
		value: contextValue,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, {
			delayDuration: 0,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					"--sidebar-width": SIDEBAR_WIDTH,
					"--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
					...style
				},
				className: cn("group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar", className),
				ref,
				...props,
				children
			})
		})
	});
});
SidebarProvider.displayName = "SidebarProvider";
var Sidebar = import_react.forwardRef(({ side = "left", variant = "sidebar", collapsible = "offcanvas", className, children, ...props }, ref) => {
	const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
	if (collapsible === "none") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground", className),
		ref,
		...props,
		children
	});
	if (isMobile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open: openMobile,
		onOpenChange: setOpenMobile,
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			"data-sidebar": "sidebar",
			"data-mobile": "true",
			className: "w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden",
			style: { "--sidebar-width": SIDEBAR_WIDTH_MOBILE },
			side,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, {
				className: "sr-only",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, { children: "Sidebar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetDescription, { children: "Displays the mobile sidebar." })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-full w-full flex-col",
				children
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: "group peer hidden text-sidebar-foreground md:block",
		"data-state": state,
		"data-collapsible": state === "collapsed" ? collapsible : "",
		"data-variant": variant,
		"data-side": side,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear", "group-data-[collapsible=offcanvas]:w-0", "group-data-[side=right]:rotate-180", variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex", side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]", variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l", className),
			...props,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"data-sidebar": "sidebar",
				className: "flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow",
				children
			})
		})]
	});
});
Sidebar.displayName = "Sidebar";
var SidebarTrigger = import_react.forwardRef(({ className, onClick, ...props }, ref) => {
	const { toggleSidebar } = useSidebar();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		ref,
		"data-sidebar": "trigger",
		variant: "ghost",
		size: "icon",
		className: cn("h-7 w-7", className),
		onClick: (event) => {
			onClick?.(event);
			toggleSidebar();
		},
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeft, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Toggle Sidebar"
		})]
	});
});
SidebarTrigger.displayName = "SidebarTrigger";
var SidebarRail = import_react.forwardRef(({ className, ...props }, ref) => {
	const { toggleSidebar } = useSidebar();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		ref,
		"data-sidebar": "rail",
		"aria-label": "Toggle Sidebar",
		tabIndex: -1,
		onClick: toggleSidebar,
		title: "Toggle Sidebar",
		className: cn("absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex", "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize", "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize", "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar", "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2", "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2", className),
		...props
	});
});
SidebarRail.displayName = "SidebarRail";
var SidebarInset = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		ref,
		className: cn("relative flex w-full flex-1 flex-col bg-background", "md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow", className),
		...props
	});
});
SidebarInset.displayName = "SidebarInset";
var SidebarInput = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
		ref,
		"data-sidebar": "input",
		className: cn("h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring", className),
		...props
	});
});
SidebarInput.displayName = "SidebarInput";
var SidebarHeader = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		"data-sidebar": "header",
		className: cn("flex flex-col gap-2 p-2", className),
		...props
	});
});
SidebarHeader.displayName = "SidebarHeader";
var SidebarFooter = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		"data-sidebar": "footer",
		className: cn("flex flex-col gap-2 p-2", className),
		...props
	});
});
SidebarFooter.displayName = "SidebarFooter";
var SidebarSeparator = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {
		ref,
		"data-sidebar": "separator",
		className: cn("mx-2 w-auto bg-sidebar-border", className),
		...props
	});
});
SidebarSeparator.displayName = "SidebarSeparator";
var SidebarContent = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		"data-sidebar": "content",
		className: cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden", className),
		...props
	});
});
SidebarContent.displayName = "SidebarContent";
var SidebarGroup = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		"data-sidebar": "group",
		className: cn("relative flex w-full min-w-0 flex-col p-2", className),
		...props
	});
});
SidebarGroup.displayName = "SidebarGroup";
var SidebarGroupLabel = import_react.forwardRef(({ className, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "div", {
		ref,
		"data-sidebar": "group-label",
		className: cn("flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0", "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0", className),
		...props
	});
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";
var SidebarGroupAction = import_react.forwardRef(({ className, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		ref,
		"data-sidebar": "group-action",
		className: cn("absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring cursor-pointer transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0", "after:absolute after:-inset-2 after:md:hidden", "group-data-[collapsible=icon]:hidden", className),
		...props
	});
});
SidebarGroupAction.displayName = "SidebarGroupAction";
var SidebarGroupContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	"data-sidebar": "group-content",
	className: cn("w-full text-sm", className),
	...props
}));
SidebarGroupContent.displayName = "SidebarGroupContent";
var SidebarMenu = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
	ref,
	"data-sidebar": "menu",
	className: cn("flex w-full min-w-0 flex-col gap-1", className),
	...props
}));
SidebarMenu.displayName = "SidebarMenu";
var SidebarMenuItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
	ref,
	"data-sidebar": "menu-item",
	className: cn("group/menu-item relative", className),
	...props
}));
SidebarMenuItem.displayName = "SidebarMenuItem";
var sidebarMenuButtonVariants = cva("peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring cursor-pointer transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0", {
	variants: {
		variant: {
			default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
			outline: "bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]"
		},
		size: {
			default: "h-8 text-sm",
			sm: "h-7 text-xs",
			lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var SidebarMenuButton = import_react.forwardRef(({ asChild = false, isActive = false, variant = "default", size = "default", tooltip, className, ...props }, ref) => {
	const Comp = asChild ? Slot : "button";
	const { isMobile, state } = useSidebar();
	const button = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Comp, {
		ref,
		"data-sidebar": "menu-button",
		"data-size": size,
		"data-active": isActive,
		className: cn(sidebarMenuButtonVariants({
			variant,
			size
		}), className),
		...props
	});
	if (!tooltip) return button;
	if (typeof tooltip === "string") tooltip = { children: tooltip };
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
		asChild: true,
		children: button
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, {
		side: "right",
		align: "center",
		hidden: state !== "collapsed" || isMobile,
		...tooltip
	})] });
});
SidebarMenuButton.displayName = "SidebarMenuButton";
var SidebarMenuAction = import_react.forwardRef(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		ref,
		"data-sidebar": "menu-action",
		className: cn("absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring cursor-pointer transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0", "after:absolute after:-inset-2 after:md:hidden", "peer-data-[size=sm]/menu-button:top-1", "peer-data-[size=default]/menu-button:top-1.5", "peer-data-[size=lg]/menu-button:top-2.5", "group-data-[collapsible=icon]:hidden", showOnHover && "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0", className),
		...props
	});
});
SidebarMenuAction.displayName = "SidebarMenuAction";
var SidebarMenuBadge = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	"data-sidebar": "menu-badge",
	className: cn("pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground", "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground", "peer-data-[size=sm]/menu-button:top-1", "peer-data-[size=default]/menu-button:top-1.5", "peer-data-[size=lg]/menu-button:top-2.5", "group-data-[collapsible=icon]:hidden", className),
	...props
}));
SidebarMenuBadge.displayName = "SidebarMenuBadge";
var SidebarMenuSkeleton = import_react.forwardRef(({ className, showIcon = false, ...props }, ref) => {
	const width = import_react.useMemo(() => {
		return `${Math.floor(Math.random() * 40) + 50}%`;
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		"data-sidebar": "menu-skeleton",
		className: cn("flex h-8 items-center gap-2 rounded-md px-2", className),
		...props,
		children: [showIcon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, {
			className: "size-4 rounded-md",
			"data-sidebar": "menu-skeleton-icon"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, {
			className: "h-4 max-w-(--skeleton-width) flex-1",
			"data-sidebar": "menu-skeleton-text",
			style: { "--skeleton-width": width }
		})]
	});
});
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";
var SidebarMenuSub = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
	ref,
	"data-sidebar": "menu-sub",
	className: cn("mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5", "group-data-[collapsible=icon]:hidden", className),
	...props
}));
SidebarMenuSub.displayName = "SidebarMenuSub";
var SidebarMenuSubItem = import_react.forwardRef(({ ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
	ref,
	...props
}));
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";
var SidebarMenuSubButton = import_react.forwardRef(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "a", {
		ref,
		"data-sidebar": "menu-sub-button",
		"data-size": size,
		"data-active": isActive,
		className: cn("flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground", "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground", size === "sm" && "text-xs", size === "md" && "text-sm", "group-data-[collapsible=icon]:hidden", className),
		...props
	});
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";
var nav = [
	{
		title: "Home",
		url: "/",
		icon: House
	},
	{
		title: "AI Chat",
		url: "/chat",
		icon: MessagesSquare
	},
	{
		title: "Dashboard",
		url: "/dashboard",
		icon: LayoutDashboard
	},
	{
		title: "Datasets",
		url: "/datasets",
		icon: Database
	},
	{
		title: "Reports",
		url: "/reports",
		icon: FileText
	},
	{
		title: "History",
		url: "/history",
		icon: History
	},
	{
		title: "Automation",
		url: "/automation",
		icon: Workflow
	},
	{
		title: "Settings",
		url: "/settings",
		icon: Settings
	}
];
function AppSidebar() {
	const pathname = useRouterState({ select: (r) => r.location.pathname });
	const { theme, toggle, mounted } = useTheme();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sidebar, {
		collapsible: "icon",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarHeader, {
				className: "border-b",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 px-2 py-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 group-data-[collapsible=icon]:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-sm font-semibold",
							children: "AI Data Analyst"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-[11px] text-muted-foreground",
							children: "Agentic AI Platform"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SidebarGroup, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarGroupLabel, { children: "Workspace" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarGroupContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarMenu, { children: nav.map((item) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarMenuItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarMenuButton, {
					asChild: true,
					isActive: item.url === "/" ? pathname === "/" : pathname === item.url || pathname.startsWith(item.url + "/"),
					tooltip: item.title,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.url,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.title })]
					})
				}) }, item.url);
			}) }) })] }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarFooter, {
				className: "border-t",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 px-1 py-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
							className: "h-8 w-8 shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
								className: "text-[11px]",
								children: "AN"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1 group-data-[collapsible=icon]:hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-sm font-medium",
								children: "bala"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-[11px] text-muted-foreground",
								children: "balaharan16@gmail.com"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "h-8 w-8 group-data-[collapsible=icon]:hidden",
							onClick: toggle,
							"aria-label": "Toggle theme",
							children: mounted && theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "h-8 w-8 group-data-[collapsible=icon]:hidden",
							"aria-label": "Logout",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" })
						})
					]
				})
			})
		]
	});
}
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubTrigger2, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent2, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = SubContent2.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = Content2.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CheckboxItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = Label2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = Separator2.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
function TopNavbar() {
	const { user, isAuthenticated, isLoading, logout } = useAuth();
	const navigate = useNavigate();
	const handleLogout = async () => {
		await logout();
		navigate({ to: "/" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarTrigger, { className: "-ml-1" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {
				orientation: "vertical",
				className: "mx-1 h-5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate text-sm font-semibold",
					children: "Insight Engine"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					variant: "secondary",
					className: "hidden sm:inline-flex",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "mr-1 h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "max-w-[140px] truncate",
						children: "No dataset selected"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative ml-auto hidden max-w-md flex-1 md:block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Search datasets, reports, conversations…",
					className: "h-9 pl-8"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ml-auto flex items-center gap-1 md:ml-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "sm",
					className: "gap-1.5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/datasets/upload",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }), " Upload"]
					})
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-8 animate-pulse rounded-full bg-muted" }) : isAuthenticated && user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "ml-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
							className: "h-8 w-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
								className: "text-[11px]",
								children: user.name?.charAt(0).toUpperCase() || "U"
							})
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
					align: "end",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, { children: "My account" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/settings",
								children: "Settings"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: handleLogout,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "mr-2 h-4 w-4" }), "Logout"]
						})
					]
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => navigate({ to: "/" }),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "mr-1.5 h-4 w-4" }), "Login"]
				})]
			})
		]
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function AuthModal({ isOpen, onClose }) {
	const { login, signup } = useAuth();
	const [activeTab, setActiveTab] = (0, import_react.useState)("signin");
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const [signinEmail, setSigninEmail] = (0, import_react.useState)("");
	const [signinPassword, setSigninPassword] = (0, import_react.useState)("");
	const [showSigninPassword, setShowSigninPassword] = (0, import_react.useState)(false);
	const [signupName, setSignupName] = (0, import_react.useState)("");
	const [signupEmail, setSignupEmail] = (0, import_react.useState)("");
	const [signupPassword, setSignupPassword] = (0, import_react.useState)("");
	const [signupConfirmPassword, setSignupConfirmPassword] = (0, import_react.useState)("");
	const [showSignupPassword, setShowSignupPassword] = (0, import_react.useState)(false);
	const [showConfirmPassword, setShowConfirmPassword] = (0, import_react.useState)(false);
	const handleSignin = async (e) => {
		e.preventDefault();
		if (!signinEmail || !signinPassword) {
			toast.error("Please fill in all fields");
			return;
		}
		setIsLoading(true);
		try {
			await login(signinEmail, signinPassword);
			if (onClose) onClose();
		} catch (error) {
			const message = error instanceof Error ? error.message : "Sign in failed";
			toast.error(message);
		} finally {
			setIsLoading(false);
		}
	};
	const handleSignup = async (e) => {
		e.preventDefault();
		if (!signupName || !signupEmail || !signupPassword || !signupConfirmPassword) {
			toast.error("Please fill in all fields");
			return;
		}
		if (signupPassword.length < 8) {
			toast.error("Password must be at least 8 characters");
			return;
		}
		if (signupPassword !== signupConfirmPassword) {
			toast.error("Passwords do not match");
			return;
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail)) {
			toast.error("Please enter a valid email address");
			return;
		}
		setIsLoading(true);
		try {
			await signup(signupName, signupEmail, signupPassword);
			if (onClose) onClose();
		} catch (error) {
			const message = error instanceof Error ? error.message : "Signup failed";
			toast.error(message);
		} finally {
			setIsLoading(false);
		}
	};
	if (!isOpen) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-background p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-full max-w-lg",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative bg-background rounded-2xl shadow-2xl flex flex-col min-h-[90vh]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute right-4 top-4 z-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-y-auto p-8 pb-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-none shadow-none w-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "text-center pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-3xl font-bold",
								children: activeTab === "signin" ? "Welcome back" : "Create account"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
								className: "text-lg",
								children: activeTab === "signin" ? "Sign in to your account to continue" : "Enter your details to create an account"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
							value: activeTab,
							onValueChange: (v) => setActiveTab(v),
							className: "w-full",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
									className: "grid w-full grid-cols-2 bg-muted mb-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "signin",
										className: "data-[state=active]:bg-background data-[state=active]:shadow-sm py-3 text-lg",
										children: "Sign In"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "signup",
										className: "data-[state=active]:bg-background data-[state=active]:shadow-sm py-3 text-lg",
										children: "Sign Up"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
									value: "signin",
									className: "mt-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
										onSubmit: handleSignin,
										className: "space-y-5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "signin-email",
													className: "text-base font-medium",
													children: "Email"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "relative",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: "signin-email",
														type: "email",
														placeholder: "you@example.com",
														value: signinEmail,
														onChange: (e) => setSigninEmail(e.target.value),
														className: "pl-12 py-3 text-base",
														required: true,
														autoComplete: "email"
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "signin-password",
													className: "text-base font-medium",
													children: "Password"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "relative",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															id: "signin-password",
															type: showSigninPassword ? "text" : "password",
															placeholder: "••••••••",
															value: signinPassword,
															onChange: (e) => setSigninPassword(e.target.value),
															className: "pl-12 pr-12 py-3 text-base",
															required: true,
															autoComplete: "current-password"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															type: "button",
															variant: "ghost",
															size: "icon",
															className: "absolute right-3 top-1/2 -translate-y-1/2",
															onClick: () => setShowSigninPassword(!showSigninPassword),
															children: showSigninPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-5 w-5" })
														})
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "submit",
												className: "w-full py-3 text-lg",
												disabled: isLoading,
												children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-5 w-5 animate-spin" }), "Signing in..."] }) : "Sign In"
											})
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
									value: "signup",
									className: "mt-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
										onSubmit: handleSignup,
										className: "space-y-5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "signup-name",
													className: "text-base font-medium",
													children: "Full Name"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "relative",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: "signup-name",
														type: "text",
														placeholder: "John Doe",
														value: signupName,
														onChange: (e) => setSignupName(e.target.value),
														className: "pl-12 py-3 text-base",
														required: true,
														autoComplete: "name"
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "signup-email",
													className: "text-base font-medium",
													children: "Email"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "relative",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: "signup-email",
														type: "email",
														placeholder: "you@example.com",
														value: signupEmail,
														onChange: (e) => setSignupEmail(e.target.value),
														className: "pl-12 py-3 text-base",
														required: true,
														autoComplete: "email"
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														htmlFor: "signup-password",
														className: "text-base font-medium",
														children: "Password"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "relative",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																id: "signup-password",
																type: showSignupPassword ? "text" : "password",
																placeholder: "••••••••",
																value: signupPassword,
																onChange: (e) => setSignupPassword(e.target.value),
																className: "pl-12 pr-12 py-3 text-base",
																required: true,
																autoComplete: "new-password",
																minLength: 8
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																type: "button",
																variant: "ghost",
																size: "icon",
																className: "absolute right-3 top-1/2 -translate-y-1/2",
																onClick: () => setShowSignupPassword(!showSignupPassword),
																children: showSignupPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-5 w-5" })
															})
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-sm text-muted-foreground",
														children: "Must be at least 8 characters"
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "signup-confirm-password",
													className: "text-base font-medium",
													children: "Confirm Password"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "relative",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															id: "signup-confirm-password",
															type: showConfirmPassword ? "text" : "password",
															placeholder: "••••••••",
															value: signupConfirmPassword,
															onChange: (e) => setSignupConfirmPassword(e.target.value),
															className: "pl-12 pr-12 py-3 text-base",
															required: true,
															autoComplete: "new-password"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															type: "button",
															variant: "ghost",
															size: "icon",
															className: "absolute right-3 top-1/2 -translate-y-1/2",
															onClick: () => setShowConfirmPassword(!showConfirmPassword),
															children: showConfirmPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-5 w-5" })
														})
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "submit",
												className: "w-full py-3 text-lg",
												disabled: isLoading,
												children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-5 w-5 animate-spin" }), "Creating account..."] }) : "Create Account"
											})
										]
									})
								})
							]
						}) })]
					})
				})]
			})
		})
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong. Try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$10 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "AI Data Analyst — Agentic AI Data Analyst Platform" },
			{
				name: "description",
				content: "Enterprise AI platform for analyzing structured and unstructured business data with autonomous agents, dashboards, and reports."
			},
			{
				property: "og:title",
				content: "AI Data Analyst — Agentic AI Data Analyst"
			},
			{
				property: "og:description",
				content: "Chat with your data, generate BI dashboards, forecasts, and reports — powered by AI agents."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function AuthScreen() {
	const { isLoading, isAuthenticated } = useAuth();
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "animate-pulse text-muted-foreground",
			children: "Loading..."
		})
	});
	if (isAuthenticated) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-background p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-full max-w-md",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthModal, {
				isOpen: true,
				onClose: () => {}
			})
		})
	});
}
function RootComponent() {
	const { queryClient } = Route$10.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGate, {}) })
	});
}
function AuthGate() {
	const { isAuthenticated, isLoading, user } = useAuth();
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 flex items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "animate-pulse text-muted-foreground",
			children: "Loading..."
		})
	});
	if (!isAuthenticated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthScreen, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SidebarProvider, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSidebar, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SidebarInset, {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopNavbar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "min-w-0 flex-1 overflow-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			richColors: true,
			position: "top-right"
		})
	] });
}
var BASE_URL = "";
var Route$9 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async () => {
	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[
		{
			path: "/",
			changefreq: "weekly",
			priority: "1.0"
		},
		{
			path: "/chat",
			changefreq: "weekly",
			priority: "0.8"
		},
		{
			path: "/dashboard",
			changefreq: "weekly",
			priority: "0.8"
		},
		{
			path: "/datasets",
			changefreq: "weekly",
			priority: "0.7"
		},
		{
			path: "/datasets/upload",
			changefreq: "monthly",
			priority: "0.6"
		},
		{
			path: "/reports",
			changefreq: "weekly",
			priority: "0.6"
		},
		{
			path: "/history",
			changefreq: "weekly",
			priority: "0.5"
		},
		{
			path: "/automation",
			changefreq: "monthly",
			priority: "0.5"
		},
		{
			path: "/settings",
			changefreq: "yearly",
			priority: "0.3"
		}
	].map((e) => `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`).join("\n")}\n</urlset>`;
	return new Response(xml, { headers: {
		"Content-Type": "application/xml",
		"Cache-Control": "public, max-age=3600"
	} });
} } } });
var $$splitComponentImporter$8 = () => import("./settings-D1RnbwaJ.mjs");
var Route$8 = createFileRoute("/settings")({
	component: lazyRouteComponent($$splitComponentImporter$8, "component"),
	head: () => ({ meta: [{ title: "Settings — AI Data Analyst" }] })
});
var $$splitComponentImporter$7 = () => import("./reports-B3QRuUTv.mjs");
var Route$7 = createFileRoute("/reports")({
	component: lazyRouteComponent($$splitComponentImporter$7, "component"),
	head: () => ({ meta: [{ title: "Reports — AI Data Analyst" }] })
});
/**
* Resolve a report URL to an absolute URL pointing to the backend server.
* Backend stores relative paths like "/reports-files/rep_xxx.pdf".
*/
var $$splitComponentImporter$6 = () => import("./history-BLQGGnkM.mjs");
var Route$6 = createFileRoute("/history")({
	component: lazyRouteComponent($$splitComponentImporter$6, "component"),
	head: () => ({ meta: [{ title: "History — AI Data Analyst" }] })
});
var $$splitComponentImporter$5 = () => import("./datasets-C6fuOZTH.mjs");
var Route$5 = createFileRoute("/datasets")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./dashboard-Ckuu3s4v.mjs");
var Route$4 = createFileRoute("/dashboard")({
	component: lazyRouteComponent($$splitComponentImporter$4, "component"),
	head: () => ({ meta: [{ title: "Dashboard — AI Data Analyst" }] })
});
var $$splitComponentImporter$3 = () => import("./chat-C1nxW8Z0.mjs");
var Route$3 = createFileRoute("/chat")({
	component: lazyRouteComponent($$splitComponentImporter$3, "component"),
	head: () => ({ meta: [{ title: "AI Chat — AI Data Analyst" }] })
});
var $$splitComponentImporter$2 = () => import("./automation-WR_xSR7c.mjs");
var Route$2 = createFileRoute("/automation")({
	component: lazyRouteComponent($$splitComponentImporter$2, "component"),
	head: () => ({ meta: [{ title: "Automation — AI Data Analyst" }] })
});
var $$splitComponentImporter$1 = () => import("./routes-D0SMkIGu.mjs");
var Route$1 = createFileRoute("/")({
	component: lazyRouteComponent($$splitComponentImporter$1, "component"),
	head: () => ({ meta: [{ title: "Home — AI Data Analyst" }, {
		name: "description",
		content: "Welcome to your AI data analyst workspace."
	}] })
});
var $$splitComponentImporter = () => import("./datasets.upload-D0E96PDp.mjs");
var Route = createFileRoute("/datasets/upload")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: () => ({ meta: [{ title: "Upload Dataset — AI Data Analyst" }] })
});
var SitemapDotxmlRoute = Route$9.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$10
});
var SettingsRoute = Route$8.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => Route$10
});
var ReportsRoute = Route$7.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => Route$10
});
var HistoryRoute = Route$6.update({
	id: "/history",
	path: "/history",
	getParentRoute: () => Route$10
});
var DatasetsRoute = Route$5.update({
	id: "/datasets",
	path: "/datasets",
	getParentRoute: () => Route$10
});
var DashboardRoute = Route$4.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => Route$10
});
var ChatRoute = Route$3.update({
	id: "/chat",
	path: "/chat",
	getParentRoute: () => Route$10
});
var AutomationRoute = Route$2.update({
	id: "/automation",
	path: "/automation",
	getParentRoute: () => Route$10
});
var IndexRoute = Route$1.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$10
});
var DatasetsUploadRoute = Route.update({
	id: "/upload",
	path: "/upload",
	getParentRoute: () => DatasetsRoute
});
var DatasetsRouteChildren = {
	DatasetsIdRoute: Route$11.update({
		id: "/$id",
		path: "/$id",
		getParentRoute: () => DatasetsRoute
	}),
	DatasetsUploadRoute
};
var rootRouteChildren = {
	IndexRoute,
	AutomationRoute,
	ChatRoute,
	DashboardRoute,
	DatasetsRoute: DatasetsRoute._addFileChildren(DatasetsRouteChildren),
	HistoryRoute,
	ReportsRoute,
	SettingsRoute,
	SitemapDotxmlRoute
};
var routeTree = Route$10._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
