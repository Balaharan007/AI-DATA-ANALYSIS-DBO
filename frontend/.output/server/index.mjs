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
	"/assets/automation-4GgfpFqy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f99-fvtZkj+Fq2Q2R+DSC0e3q7LLk8Y\"",
		"mtime": "2026-07-12T15:55:52.833Z",
		"size": 3993,
		"path": "../public/assets/automation-4GgfpFqy.js"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"17-ZZkCVrbr4BSdjt/K43J0tq8+Qq4\"",
		"mtime": "2026-07-09T12:28:22.708Z",
		"size": 23,
		"path": "../public/robots.txt"
	},
	"/assets/card-BdjCMhS6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"147dc-fydt06JwplgziERhB6c9yboeaws\"",
		"mtime": "2026-07-12T15:55:52.834Z",
		"size": 83932,
		"path": "../public/assets/card-BdjCMhS6.js"
	},
	"/assets/chart-column-DYrjxce8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ef-XN/jIqdmUCtyNPRSfF6YHXqkLE8\"",
		"mtime": "2026-07-12T15:55:52.834Z",
		"size": 239,
		"path": "../public/assets/chart-column-DYrjxce8.js"
	},
	"/assets/circle-check-DQO7XgJ2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a6-5gQGMBN2EOr4aHF4T+whCi+IvNA\"",
		"mtime": "2026-07-12T15:55:52.836Z",
		"size": 166,
		"path": "../public/assets/circle-check-DQO7XgJ2.js"
	},
	"/assets/chat-gsrfAjtd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2e1ba-Vv6XiQPbermcUK2kHV7dY/0UzaE\"",
		"mtime": "2026-07-12T15:55:52.835Z",
		"size": 188858,
		"path": "../public/assets/chat-gsrfAjtd.js"
	},
	"/assets/ChartCard-BbtXDhSk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6a89f-Mn8wJeOmmKKF1E8XScCb8bQeYpg\"",
		"mtime": "2026-07-12T15:55:52.828Z",
		"size": 436383,
		"path": "../public/assets/ChartCard-BbtXDhSk.js"
	},
	"/assets/datasets-BJ2mSHtY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cc6-FrX8BX2n5FddViu4bE6R9jZROjs\"",
		"mtime": "2026-07-12T15:55:52.839Z",
		"size": 3270,
		"path": "../public/assets/datasets-BJ2mSHtY.js"
	},
	"/assets/datasets.upload-B5ZcYO3C.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ab9-UhW9ZxfVeGRz0ZIQa8ITjEQpln4\"",
		"mtime": "2026-07-12T15:55:52.841Z",
		"size": 6841,
		"path": "../public/assets/datasets.upload-B5ZcYO3C.js"
	},
	"/assets/dashboard-BQqqYsLC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13c1-4g3ZJKBbOYFdwE69CBwLTVQhXE8\"",
		"mtime": "2026-07-12T15:55:52.837Z",
		"size": 5057,
		"path": "../public/assets/dashboard-BQqqYsLC.js"
	},
	"/assets/datasets._id-D-BknjXE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1aea-Oh5/9e8NMOGnX8icync2RrbvVKs\"",
		"mtime": "2026-07-12T15:55:52.839Z",
		"size": 6890,
		"path": "../public/assets/datasets._id-D-BknjXE.js"
	},
	"/assets/dist-vY-TonEC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b5-ZP24+NCIhie3vPYJUCxw33UgEkg\"",
		"mtime": "2026-07-12T15:55:52.842Z",
		"size": 181,
		"path": "../public/assets/dist-vY-TonEC.js"
	},
	"/assets/history-D5DQRwuM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8dd-E5UWkw9i4GEQKoMc+y7AnUNQDpk\"",
		"mtime": "2026-07-12T15:55:52.844Z",
		"size": 2269,
		"path": "../public/assets/history-D5DQRwuM.js"
	},
	"/assets/download-BJRXvUQA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dc-ehjZMes8DxetKwP1zXtHwd1ISNg\"",
		"mtime": "2026-07-12T15:55:52.843Z",
		"size": 220,
		"path": "../public/assets/download-BJRXvUQA.js"
	},
	"/assets/EmptyState-DzUaCj4h.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"27e-sgqEXnarim0X2PYmG32ENa/SglM\"",
		"mtime": "2026-07-12T15:55:52.829Z",
		"size": 638,
		"path": "../public/assets/EmptyState-DzUaCj4h.js"
	},
	"/assets/link-CUd2zCPW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5b1c-z76QBpOUw1yaX5L+sCe9j9D/IOs\"",
		"mtime": "2026-07-12T15:55:52.845Z",
		"size": 23324,
		"path": "../public/assets/link-CUd2zCPW.js"
	},
	"/assets/react-B8IZ02wI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1fe3-F1OtqcvIddSaDxcd6VGmPyy0Ww0\"",
		"mtime": "2026-07-12T15:55:52.846Z",
		"size": 8163,
		"path": "../public/assets/react-B8IZ02wI.js"
	},
	"/assets/PageHeader-BOQkEuRO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"222-Y3y/nRITqZ/GHRPPLJFjv5VB++8\"",
		"mtime": "2026-07-12T15:55:52.831Z",
		"size": 546,
		"path": "../public/assets/PageHeader-BOQkEuRO.js"
	},
	"/assets/reports-TjmPeY88.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10e2-rYQ58Ow8ki9pey9+AvtR/2EFO7I\"",
		"mtime": "2026-07-12T15:55:52.851Z",
		"size": 4322,
		"path": "../public/assets/reports-TjmPeY88.js"
	},
	"/assets/index-CKOvX4De.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7605a-pcrbz6tlRGMwcR2n8Dm014gd5SU\"",
		"mtime": "2026-07-12T15:55:52.827Z",
		"size": 483418,
		"path": "../public/assets/index-CKOvX4De.js"
	},
	"/assets/routes-BiFnv49r.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1657-Vkzj8ebRePqctHiTHa6Z5MEw50s\"",
		"mtime": "2026-07-12T15:55:52.852Z",
		"size": 5719,
		"path": "../public/assets/routes-BiFnv49r.js"
	},
	"/assets/select-HBNMSfaT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"55bb-4mNhfrnj+t9w+QgdsC/MzcM5tyY\"",
		"mtime": "2026-07-12T15:55:52.853Z",
		"size": 21947,
		"path": "../public/assets/select-HBNMSfaT.js"
	},
	"/assets/send-Bc28uKPX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"116-k2PjSeLNv0osbRcsq3V37ydNq2M\"",
		"mtime": "2026-07-12T15:55:52.854Z",
		"size": 278,
		"path": "../public/assets/send-Bc28uKPX.js"
	},
	"/assets/settings-B7rdK1ON.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4de3-vQaEoQWhFBV7QUVssgE51T960lk\"",
		"mtime": "2026-07-12T15:55:52.855Z",
		"size": 19939,
		"path": "../public/assets/settings-B7rdK1ON.js"
	},
	"/assets/styles-Ca2Pb9Kr.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"14c72-2M9QYPVDOQGtWi+FF5uHztRfIZE\"",
		"mtime": "2026-07-12T15:55:52.862Z",
		"size": 85106,
		"path": "../public/assets/styles-Ca2Pb9Kr.css"
	},
	"/assets/StatusPill-SnXEKtOp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ee-OitAImlvcQxq9TcD/CaccLvb644\"",
		"mtime": "2026-07-12T15:55:52.832Z",
		"size": 494,
		"path": "../public/assets/StatusPill-SnXEKtOp.js"
	},
	"/assets/table-YIbx2elI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"660-9WRDAlYN9vB3zd1WdFfcl2WR87A\"",
		"mtime": "2026-07-12T15:55:52.856Z",
		"size": 1632,
		"path": "../public/assets/table-YIbx2elI.js"
	},
	"/assets/trash-2-CwCloCo-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13c-ga80ZSD/SYTTvNtTrzvDz9MPuQ0\"",
		"mtime": "2026-07-12T15:55:52.857Z",
		"size": 316,
		"path": "../public/assets/trash-2-CwCloCo-.js"
	},
	"/assets/useMutation-CT7fxwr9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8c7-filixDYuGx7lItevWMTI1BMK8Vs\"",
		"mtime": "2026-07-12T15:55:52.858Z",
		"size": 2247,
		"path": "../public/assets/useMutation-CT7fxwr9.js"
	},
	"/assets/useQuery-MqYw5TwE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2280-FU8nIM0E2CFa4FKIO3LAGKWbMkc\"",
		"mtime": "2026-07-12T15:55:52.859Z",
		"size": 8832,
		"path": "../public/assets/useQuery-MqYw5TwE.js"
	},
	"/assets/useRouter-BF2QTw7Y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8c-OgU175ueBEYnHU7rc6IrNE4svLM\"",
		"mtime": "2026-07-12T15:55:52.860Z",
		"size": 140,
		"path": "../public/assets/useRouter-BF2QTw7Y.js"
	},
	"/assets/react-plotly-5a3ncubv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"471795-+E+bUTm1TfZ7OukUko+ojqh5gjk\"",
		"mtime": "2026-07-12T15:55:52.849Z",
		"size": 4659093,
		"path": "../public/assets/react-plotly-5a3ncubv.js"
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
