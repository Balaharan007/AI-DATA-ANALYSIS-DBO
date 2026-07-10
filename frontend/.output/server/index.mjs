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
	"/assets/automation-B4Ve9Vjx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d72-6ySyX7jcqDxcsZiyNl8mU0JVqxg\"",
		"mtime": "2026-07-10T12:48:42.419Z",
		"size": 3442,
		"path": "../public/assets/automation-B4Ve9Vjx.js"
	},
	"/assets/card-gMpY2X25.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14728-wqWn8tI8R5pqCSb5bdQQV8Rfgq8\"",
		"mtime": "2026-07-10T12:48:42.421Z",
		"size": 83752,
		"path": "../public/assets/card-gMpY2X25.js"
	},
	"/assets/chart-column-CK0QDOep.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ef-LiewcY8m1WHdndfQ1izUbWAOGjI\"",
		"mtime": "2026-07-10T12:48:42.422Z",
		"size": 239,
		"path": "../public/assets/chart-column-CK0QDOep.js"
	},
	"/assets/ChartCard-DHj-impR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6a89f-dNbMWJ1qZ6VnV0h16LHL9I1XL38\"",
		"mtime": "2026-07-10T12:48:42.410Z",
		"size": 436383,
		"path": "../public/assets/ChartCard-DHj-impR.js"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"17-ZZkCVrbr4BSdjt/K43J0tq8+Qq4\"",
		"mtime": "2026-07-09T12:28:22.708Z",
		"size": 23,
		"path": "../public/robots.txt"
	},
	"/assets/chat-DqUoFx8g.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2e18e-YDs6I7A5wUZY6CQtggJ13/bVAEU\"",
		"mtime": "2026-07-10T12:48:42.424Z",
		"size": 188814,
		"path": "../public/assets/chat-DqUoFx8g.js"
	},
	"/assets/dashboard-B2HKXVBq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13c1-pLiQcPmMxrF42hrTntafJfUlE2c\"",
		"mtime": "2026-07-10T12:48:42.426Z",
		"size": 5057,
		"path": "../public/assets/dashboard-B2HKXVBq.js"
	},
	"/assets/datasets-DHL56cdf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cc9-Q1snhYqoTpS8F6zoTGFCCACjztI\"",
		"mtime": "2026-07-10T12:48:42.427Z",
		"size": 3273,
		"path": "../public/assets/datasets-DHL56cdf.js"
	},
	"/assets/datasets._id-DkPeYdcU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1aee-2Ff3WwkCbOtlsQtP9iYaS6sWzi8\"",
		"mtime": "2026-07-10T12:48:42.429Z",
		"size": 6894,
		"path": "../public/assets/datasets._id-DkPeYdcU.js"
	},
	"/assets/datasets.upload-Bqg8jGAG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1aff-O4HOAdRFXOiYuT/sgC0zJLqmJLY\"",
		"mtime": "2026-07-10T12:48:42.430Z",
		"size": 6911,
		"path": "../public/assets/datasets.upload-Bqg8jGAG.js"
	},
	"/assets/dist-PrxMdlMx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b5-Iqr94/T/jvnhxearjPgbu2LCI3Q\"",
		"mtime": "2026-07-10T12:48:42.432Z",
		"size": 181,
		"path": "../public/assets/dist-PrxMdlMx.js"
	},
	"/assets/download-BH5UZbOX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dc-S6800vBg8tjAaP4MMr/FgmgBrp0\"",
		"mtime": "2026-07-10T12:48:42.434Z",
		"size": 220,
		"path": "../public/assets/download-BH5UZbOX.js"
	},
	"/assets/EmptyState-EFsVj64A.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"27e-HdTzm9YS1VlbFmJodDL3QUQOUGg\"",
		"mtime": "2026-07-10T12:48:42.414Z",
		"size": 638,
		"path": "../public/assets/EmptyState-EFsVj64A.js"
	},
	"/assets/history-C_mwrVqa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8e2-jmuh6U6Pq9DWtMww6vElIFZvr5Q\"",
		"mtime": "2026-07-10T12:48:42.435Z",
		"size": 2274,
		"path": "../public/assets/history-C_mwrVqa.js"
	},
	"/assets/link-6wdGnfar.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5b1c-rCJprepdwyDv6TUAhwJompA1aQs\"",
		"mtime": "2026-07-10T12:48:42.437Z",
		"size": 23324,
		"path": "../public/assets/link-6wdGnfar.js"
	},
	"/assets/PageHeader-_tyllt3u.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"222-A/oBC1l6e/rFVuD7+qtbdnhXims\"",
		"mtime": "2026-07-10T12:48:42.416Z",
		"size": 546,
		"path": "../public/assets/PageHeader-_tyllt3u.js"
	},
	"/assets/index-CQVOnBXm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"761fb-TBnPdOTcNccN+YfKMjl8iPwmQvk\"",
		"mtime": "2026-07-10T12:48:42.408Z",
		"size": 483835,
		"path": "../public/assets/index-CQVOnBXm.js"
	},
	"/assets/react-B8IZ02wI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1fe3-F1OtqcvIddSaDxcd6VGmPyy0Ww0\"",
		"mtime": "2026-07-10T12:48:42.440Z",
		"size": 8163,
		"path": "../public/assets/react-B8IZ02wI.js"
	},
	"/assets/reports-BT33Y0TN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d64-HvrNHP4zGnqttLnmHi8VEUJy5D4\"",
		"mtime": "2026-07-10T12:48:42.447Z",
		"size": 3428,
		"path": "../public/assets/reports-BT33Y0TN.js"
	},
	"/assets/routes-INHhok8w.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1657-Jjen4rjUpkG5xlub6L5ABgRb8DQ\"",
		"mtime": "2026-07-10T12:48:42.449Z",
		"size": 5719,
		"path": "../public/assets/routes-INHhok8w.js"
	},
	"/assets/select-CFu_ratG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"55ba-dIJm5rHY0BDIhEnxocwEn5TTE9w\"",
		"mtime": "2026-07-10T12:48:42.452Z",
		"size": 21946,
		"path": "../public/assets/select-CFu_ratG.js"
	},
	"/assets/send-DlWOtHSD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"116-8zLgncsehrLj8c0s0AXs+1dp/Uc\"",
		"mtime": "2026-07-10T12:48:42.454Z",
		"size": 278,
		"path": "../public/assets/send-DlWOtHSD.js"
	},
	"/assets/settings-CGI5xEQA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"421c-9Wee/OCdc1ZfVTPcW8immQu3oqA\"",
		"mtime": "2026-07-10T12:48:42.457Z",
		"size": 16924,
		"path": "../public/assets/settings-CGI5xEQA.js"
	},
	"/assets/StatusPill-DHin2BnR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ee-Wbk6H0NPac+/Lf32l9OpM+LjPF0\"",
		"mtime": "2026-07-10T12:48:42.417Z",
		"size": 494,
		"path": "../public/assets/StatusPill-DHin2BnR.js"
	},
	"/assets/styles-Dz9hwgoS.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"14a0a-ckfRBWxiZaKZZQwlLFPIJCjvKJY\"",
		"mtime": "2026-07-10T12:48:42.473Z",
		"size": 84490,
		"path": "../public/assets/styles-Dz9hwgoS.css"
	},
	"/assets/table-DHVH_5_y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"660-bSvzoThnQlrvEVV6xojaeEJJNi8\"",
		"mtime": "2026-07-10T12:48:42.459Z",
		"size": 1632,
		"path": "../public/assets/table-DHVH_5_y.js"
	},
	"/assets/useMutation-BuolirEM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8c6-NSv/TJVTM3Clm/aUqBxwqeQadcM\"",
		"mtime": "2026-07-10T12:48:42.465Z",
		"size": 2246,
		"path": "../public/assets/useMutation-BuolirEM.js"
	},
	"/assets/trash-2-CvwH7-n1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13c-SVKr8FD8ib7eI9R0EUxXBAm8+Tw\"",
		"mtime": "2026-07-10T12:48:42.462Z",
		"size": 316,
		"path": "../public/assets/trash-2-CvwH7-n1.js"
	},
	"/assets/useQuery-Bg-nlIiS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"227f-+CnptCp26BzYLPX2rUQVSaVB/m4\"",
		"mtime": "2026-07-10T12:48:42.467Z",
		"size": 8831,
		"path": "../public/assets/useQuery-Bg-nlIiS.js"
	},
	"/assets/useRouter-BF2QTw7Y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8c-OgU175ueBEYnHU7rc6IrNE4svLM\"",
		"mtime": "2026-07-10T12:48:42.470Z",
		"size": 140,
		"path": "../public/assets/useRouter-BF2QTw7Y.js"
	},
	"/assets/react-plotly-DkOC5fUK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"471795-Qx0G8EQ4IVo/zWbYtJdxTsWxDAc\"",
		"mtime": "2026-07-10T12:48:42.445Z",
		"size": 4659093,
		"path": "../public/assets/react-plotly-DkOC5fUK.js"
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
