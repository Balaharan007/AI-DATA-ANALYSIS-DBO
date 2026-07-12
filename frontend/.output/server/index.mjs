globalThis.__nitro_main__ = import.meta.url;
import { a as FastResponse, n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx+unenv.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-07-09T12:28:22.692Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/assets/automation-cetBVVg-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f99-0W97KflwN0M+744sikClX7HhRx0\"",
		"mtime": "2026-07-12T10:17:41.190Z",
		"size": 3993,
		"path": "../public/assets/automation-cetBVVg-.js"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"17-ZZkCVrbr4BSdjt/K43J0tq8+Qq4\"",
		"mtime": "2026-07-09T12:28:22.708Z",
		"size": 23,
		"path": "../public/robots.txt"
	},
	"/assets/card-DCdkUsb8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"147dc-JUTVtCfbmy9GXnOBPX7s4/bZyGA\"",
		"mtime": "2026-07-12T10:17:41.191Z",
		"size": 83932,
		"path": "../public/assets/card-DCdkUsb8.js"
	},
	"/assets/chart-column-eEVmhAuE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ef-e7kg4Fw0TD66r7LXSFteQpSKKAY\"",
		"mtime": "2026-07-12T10:17:41.192Z",
		"size": 239,
		"path": "../public/assets/chart-column-eEVmhAuE.js"
	},
	"/assets/circle-check-I_0Kwdx-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a6-z3VudWoePEYxzp+W+yYl1E6wffs\"",
		"mtime": "2026-07-12T10:17:41.194Z",
		"size": 166,
		"path": "../public/assets/circle-check-I_0Kwdx-.js"
	},
	"/assets/dashboard-D2Nr1VrF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13c1-fxcCFAeXNSErG1tKLegSRt7rAkM\"",
		"mtime": "2026-07-12T10:17:41.195Z",
		"size": 5057,
		"path": "../public/assets/dashboard-D2Nr1VrF.js"
	},
	"/assets/datasets-Db4-kbZo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cc6-7S2bwxfYCainsE01F+vepZPeq80\"",
		"mtime": "2026-07-12T10:17:41.200Z",
		"size": 3270,
		"path": "../public/assets/datasets-Db4-kbZo.js"
	},
	"/assets/chat-gpM1MujH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2e1ba-OEspjI1ZKa9kMh1MfO9R/aw0H0o\"",
		"mtime": "2026-07-12T10:17:41.193Z",
		"size": 188858,
		"path": "../public/assets/chat-gpM1MujH.js"
	},
	"/assets/datasets.upload-BESnvVbE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ab9-0Y5cW3FvkrY6XV29YM/G9w370Ww\"",
		"mtime": "2026-07-12T10:17:41.202Z",
		"size": 6841,
		"path": "../public/assets/datasets.upload-BESnvVbE.js"
	},
	"/assets/datasets._id-B5QTT4jC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1aea-JqjYrGxOGAHCPhIzwi4up2g9Izg\"",
		"mtime": "2026-07-12T10:17:41.201Z",
		"size": 6890,
		"path": "../public/assets/datasets._id-B5QTT4jC.js"
	},
	"/assets/dist-FpvW1I0A.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b5-Y0e3cxQtVKiIUd8pmHVHNjAmP4c\"",
		"mtime": "2026-07-12T10:17:41.204Z",
		"size": 181,
		"path": "../public/assets/dist-FpvW1I0A.js"
	},
	"/assets/download-BNvhIHgN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dc-TK8eBP2BOgzk0LNc1bu0OAEI8hg\"",
		"mtime": "2026-07-12T10:17:41.205Z",
		"size": 220,
		"path": "../public/assets/download-BNvhIHgN.js"
	},
	"/assets/ChartCard-Dtp8qKyL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6a89f-OOQ/K34rQJGn8EIVMH9qOSnEm4o\"",
		"mtime": "2026-07-12T10:17:41.181Z",
		"size": 436383,
		"path": "../public/assets/ChartCard-Dtp8qKyL.js"
	},
	"/assets/EmptyState-C9j1r9Qp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"27e-fIEpCH2AWm3Cvy9Yqh3U/aVJ5iA\"",
		"mtime": "2026-07-12T10:17:41.184Z",
		"size": 638,
		"path": "../public/assets/EmptyState-C9j1r9Qp.js"
	},
	"/assets/history-dyLS3j4K.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8dd-7TMvud0cR1CnNOtXR75q+07O/DU\"",
		"mtime": "2026-07-12T10:17:41.206Z",
		"size": 2269,
		"path": "../public/assets/history-dyLS3j4K.js"
	},
	"/assets/link-jC94M5vO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5b1c-kFHil4bNh/KdfaJ+N813rtqt83Y\"",
		"mtime": "2026-07-12T10:17:41.207Z",
		"size": 23324,
		"path": "../public/assets/link-jC94M5vO.js"
	},
	"/assets/react-B8IZ02wI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1fe3-F1OtqcvIddSaDxcd6VGmPyy0Ww0\"",
		"mtime": "2026-07-12T10:17:41.208Z",
		"size": 8163,
		"path": "../public/assets/react-B8IZ02wI.js"
	},
	"/assets/PageHeader-C1Ansdcm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"222-Nza/IODhY+WWrdVWl70qqKg82iI\"",
		"mtime": "2026-07-12T10:17:41.185Z",
		"size": 546,
		"path": "../public/assets/PageHeader-C1Ansdcm.js"
	},
	"/assets/reports-DTDhslLF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10e2-hwgjfquOlmPOd8OK8+7JefGTxeY\"",
		"mtime": "2026-07-12T10:17:41.213Z",
		"size": 4322,
		"path": "../public/assets/reports-DTDhslLF.js"
	},
	"/assets/index-C79gdq4n.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7605a-0DxabOkeQd2ZDX7ukAxfg+PBo1Y\"",
		"mtime": "2026-07-12T10:17:41.179Z",
		"size": 483418,
		"path": "../public/assets/index-C79gdq4n.js"
	},
	"/assets/routes-Cq0ZlAwJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1657-DsQsYEiHKbORaO3krgQwKlz47Yc\"",
		"mtime": "2026-07-12T10:17:41.215Z",
		"size": 5719,
		"path": "../public/assets/routes-Cq0ZlAwJ.js"
	},
	"/assets/select-DAq8fzIz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"55bb-YXjR2o0a/omZ0+KL2k6GjrxdyXY\"",
		"mtime": "2026-07-12T10:17:41.216Z",
		"size": 21947,
		"path": "../public/assets/select-DAq8fzIz.js"
	},
	"/assets/send-DS1tZ_23.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"116-GUU2YQDsHAzNNziaOOlzDxewyfY\"",
		"mtime": "2026-07-12T10:17:41.218Z",
		"size": 278,
		"path": "../public/assets/send-DS1tZ_23.js"
	},
	"/assets/settings-ByxHF2Hl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4de3-4ggSaGPh1kVnZDmxCQLucrRRIrQ\"",
		"mtime": "2026-07-12T10:17:41.218Z",
		"size": 19939,
		"path": "../public/assets/settings-ByxHF2Hl.js"
	},
	"/assets/StatusPill-COMpf6vq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ee-P0RhKY2LsUAgZhWyYlwey+ZizXo\"",
		"mtime": "2026-07-12T10:17:41.188Z",
		"size": 494,
		"path": "../public/assets/StatusPill-COMpf6vq.js"
	},
	"/assets/table-CwCCcNiG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"660-cCBwrEHYtMzP8Scs3xLt0kIrNIw\"",
		"mtime": "2026-07-12T10:17:41.221Z",
		"size": 1632,
		"path": "../public/assets/table-CwCCcNiG.js"
	},
	"/assets/styles-Ca2Pb9Kr.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"14c72-2M9QYPVDOQGtWi+FF5uHztRfIZE\"",
		"mtime": "2026-07-12T10:17:41.230Z",
		"size": 85106,
		"path": "../public/assets/styles-Ca2Pb9Kr.css"
	},
	"/assets/trash-2-ChFBYLBO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13c-HY95PyJpwBl8lDVNqKZ2yjUhOS8\"",
		"mtime": "2026-07-12T10:17:41.223Z",
		"size": 316,
		"path": "../public/assets/trash-2-ChFBYLBO.js"
	},
	"/assets/useMutation-eSBuhkMR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8c7-OateIgOYHWr2NW7O7X15alqTh0w\"",
		"mtime": "2026-07-12T10:17:41.224Z",
		"size": 2247,
		"path": "../public/assets/useMutation-eSBuhkMR.js"
	},
	"/assets/useQuery-GOBSS3QM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2280-CY2h5UYzoIjcVRmYtkqjO9LF3Uo\"",
		"mtime": "2026-07-12T10:17:41.226Z",
		"size": 8832,
		"path": "../public/assets/useQuery-GOBSS3QM.js"
	},
	"/assets/useRouter-BF2QTw7Y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8c-OgU175ueBEYnHU7rc6IrNE4svLM\"",
		"mtime": "2026-07-12T10:17:41.228Z",
		"size": 140,
		"path": "../public/assets/useRouter-BF2QTw7Y.js"
	},
	"/assets/react-plotly-BSKdhVk1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"471795-bHq0YgWTrKle+5ptvWDUsYkX1+s\"",
		"mtime": "2026-07-12T10:17:41.212Z",
		"size": 4659093,
		"path": "../public/assets/react-plotly-BSKdhVk1.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_tRLVfw = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_tRLVfw
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
