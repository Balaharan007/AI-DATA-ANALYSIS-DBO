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
	"/assets/automation-DVsKgOGz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ceb-nlvC4yZznAx+vicPoqzil6pk5F4\"",
		"mtime": "2026-07-11T20:59:30.186Z",
		"size": 3307,
		"path": "../public/assets/automation-DVsKgOGz.js"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-07-09T12:28:22.692Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/assets/card-pJFf9xHQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"147dc-49R5QQX6tnBp1eG/8Bq+VAUT0+Q\"",
		"mtime": "2026-07-11T20:59:30.188Z",
		"size": 83932,
		"path": "../public/assets/card-pJFf9xHQ.js"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"17-ZZkCVrbr4BSdjt/K43J0tq8+Qq4\"",
		"mtime": "2026-07-09T12:28:22.708Z",
		"size": 23,
		"path": "../public/robots.txt"
	},
	"/assets/chart-column-DIy-BvFj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ef-cIQZoC5ftB+OzXosxn90VVeiZXI\"",
		"mtime": "2026-07-11T20:59:30.189Z",
		"size": 239,
		"path": "../public/assets/chart-column-DIy-BvFj.js"
	},
	"/assets/circle-check-93OBUWci.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a6-TNf42yt4UF/k8leofkJuldf+q0k\"",
		"mtime": "2026-07-11T20:59:30.191Z",
		"size": 166,
		"path": "../public/assets/circle-check-93OBUWci.js"
	},
	"/assets/dashboard-CbKx0INI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13c1-hYObBcLC5s252qGhmCEPozjwoCg\"",
		"mtime": "2026-07-11T20:59:30.191Z",
		"size": 5057,
		"path": "../public/assets/dashboard-CbKx0INI.js"
	},
	"/assets/datasets-BBR9C9TY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cc6-Rv64IrgGDjo8dv0qRbpnKp9x2u4\"",
		"mtime": "2026-07-11T20:59:30.192Z",
		"size": 3270,
		"path": "../public/assets/datasets-BBR9C9TY.js"
	},
	"/assets/datasets.upload-BqLqgdAy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ab9-XdKPTewVt0JzRLnsmFBpAe4Ut+Y\"",
		"mtime": "2026-07-11T20:59:30.194Z",
		"size": 6841,
		"path": "../public/assets/datasets.upload-BqLqgdAy.js"
	},
	"/assets/datasets._id-sIipcN8Z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1aea-EuUPqtPhLqJ5gmyoLRSEZhnG02s\"",
		"mtime": "2026-07-11T20:59:30.192Z",
		"size": 6890,
		"path": "../public/assets/datasets._id-sIipcN8Z.js"
	},
	"/assets/dist-BpbiVu4_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b5-eutF76nnzS3J107K1oJVIb81C2c\"",
		"mtime": "2026-07-11T20:59:30.195Z",
		"size": 181,
		"path": "../public/assets/dist-BpbiVu4_.js"
	},
	"/assets/download-rjx9aAK4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dc-EAknyhHcsv9ozHDMEypgksse1s0\"",
		"mtime": "2026-07-11T20:59:30.196Z",
		"size": 220,
		"path": "../public/assets/download-rjx9aAK4.js"
	},
	"/assets/ChartCard-CgztpPnW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6a89f-a5/5ZXw2ZPqe8OeKngtjtZrutYM\"",
		"mtime": "2026-07-11T20:59:30.183Z",
		"size": 436383,
		"path": "../public/assets/ChartCard-CgztpPnW.js"
	},
	"/assets/chat-C0QF4Uz5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2e1ba-pfJ/OyZK0ttPPBhK60A9W5XTZNM\"",
		"mtime": "2026-07-11T20:59:30.190Z",
		"size": 188858,
		"path": "../public/assets/chat-C0QF4Uz5.js"
	},
	"/assets/EmptyState-zJuvCUcS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"27e-Vk99zD3Pj2G1Kom1uOUQ3gznW44\"",
		"mtime": "2026-07-11T20:59:30.184Z",
		"size": 638,
		"path": "../public/assets/EmptyState-zJuvCUcS.js"
	},
	"/assets/history-WgeNs729.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8dd-dF/H9R9UrTXu/M9eqdu7C9p+Lrg\"",
		"mtime": "2026-07-11T20:59:30.197Z",
		"size": 2269,
		"path": "../public/assets/history-WgeNs729.js"
	},
	"/assets/link-ReegACCF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5b1c-NRnnegtx+G9D/He8MEjTHrefXT8\"",
		"mtime": "2026-07-11T20:59:30.199Z",
		"size": 23324,
		"path": "../public/assets/link-ReegACCF.js"
	},
	"/assets/PageHeader-CHxJRN8k.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"222-mUIUpTwUuRmHfjohQT8X8e8yl8g\"",
		"mtime": "2026-07-11T20:59:30.185Z",
		"size": 546,
		"path": "../public/assets/PageHeader-CHxJRN8k.js"
	},
	"/assets/index-DPjLoDN_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7606a-GB4u85xzzeqMOZTJpqcBvHyu/YU\"",
		"mtime": "2026-07-11T20:59:30.181Z",
		"size": 483434,
		"path": "../public/assets/index-DPjLoDN_.js"
	},
	"/assets/react-B8IZ02wI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1fe3-F1OtqcvIddSaDxcd6VGmPyy0Ww0\"",
		"mtime": "2026-07-11T20:59:30.199Z",
		"size": 8163,
		"path": "../public/assets/react-B8IZ02wI.js"
	},
	"/assets/reports-Dnh3DOaD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e8a-a9j1NdDudC5v2nUjnu/KJiLKySg\"",
		"mtime": "2026-07-11T20:59:30.202Z",
		"size": 3722,
		"path": "../public/assets/reports-Dnh3DOaD.js"
	},
	"/assets/routes-so7pZR81.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1657-3Yhm5QpBcQbGlJUlSTNKlF/mmVs\"",
		"mtime": "2026-07-11T20:59:30.204Z",
		"size": 5719,
		"path": "../public/assets/routes-so7pZR81.js"
	},
	"/assets/send-BVJ8e7y5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"116-X6PuTpxTJOrxjyYaGE7CqYxpHa8\"",
		"mtime": "2026-07-11T20:59:30.206Z",
		"size": 278,
		"path": "../public/assets/send-BVJ8e7y5.js"
	},
	"/assets/select-Df0sdndK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"55bb-SnoE6BonEt/kn3ANFnkXtNWZRSk\"",
		"mtime": "2026-07-11T20:59:30.205Z",
		"size": 21947,
		"path": "../public/assets/select-Df0sdndK.js"
	},
	"/assets/StatusPill-CK0tmcXT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ee-8bVRBluOliRw132k4Zhpi6q2JPU\"",
		"mtime": "2026-07-11T20:59:30.186Z",
		"size": 494,
		"path": "../public/assets/StatusPill-CK0tmcXT.js"
	},
	"/assets/settings-DGSUsUQW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4de3-NC0e1vA/gC6VFrMzPf12vwW++2s\"",
		"mtime": "2026-07-11T20:59:30.207Z",
		"size": 19939,
		"path": "../public/assets/settings-DGSUsUQW.js"
	},
	"/assets/styles-DJMB7sP9.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"14c1c-p+NlceY+gGkbZ90NtKjG1Ne5wpc\"",
		"mtime": "2026-07-11T20:59:30.214Z",
		"size": 85020,
		"path": "../public/assets/styles-DJMB7sP9.css"
	},
	"/assets/trash-2-Bwuuaz09.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13c-76GHa6BVrrKpasTPEsQOImwA0dk\"",
		"mtime": "2026-07-11T20:59:30.209Z",
		"size": 316,
		"path": "../public/assets/trash-2-Bwuuaz09.js"
	},
	"/assets/table-CmToN5JF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"660-Blzewp0BNAhRlqDD2Vbs0HTiSPs\"",
		"mtime": "2026-07-11T20:59:30.208Z",
		"size": 1632,
		"path": "../public/assets/table-CmToN5JF.js"
	},
	"/assets/useMutation-Po1PUvVY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8c7-t2K1K/lmYXZxsAloeF7xaMPANEo\"",
		"mtime": "2026-07-11T20:59:30.211Z",
		"size": 2247,
		"path": "../public/assets/useMutation-Po1PUvVY.js"
	},
	"/assets/useQuery-C-dDXU69.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2280-gknZy9pn7BlNk5eZMtm6cVFEYHs\"",
		"mtime": "2026-07-11T20:59:30.212Z",
		"size": 8832,
		"path": "../public/assets/useQuery-C-dDXU69.js"
	},
	"/assets/useRouter-BF2QTw7Y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8c-OgU175ueBEYnHU7rc6IrNE4svLM\"",
		"mtime": "2026-07-11T20:59:30.213Z",
		"size": 140,
		"path": "../public/assets/useRouter-BF2QTw7Y.js"
	},
	"/assets/react-plotly-DTVHBjQj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"471795-HqGELYFZRUJ3lOTfiHnRUzI4mnA\"",
		"mtime": "2026-07-11T20:59:30.201Z",
		"size": 4659093,
		"path": "../public/assets/react-plotly-DTVHBjQj.js"
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
