import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as axios } from "../_libs/axios+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/card-p0q76zfJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var baseURL = typeof import.meta !== "undefined" && "http://localhost:2100" || "http://localhost:8000";
var api = axios.create({
	baseURL,
	timeout: 6e4,
	headers: { "Content-Type": "application/json" }
});
var accessToken = null;
var setAccessToken = (token) => {
	accessToken = token;
	if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	else delete api.defaults.headers.common["Authorization"];
};
var getAccessToken = () => accessToken;
if (typeof window !== "undefined") {
	const stored = localStorage.getItem("access_token");
	if (stored) setAccessToken(stored);
}
api.interceptors.response.use((r) => r, (error) => {
	const message = error?.response?.data?.detail || error?.response?.data?.message || error?.message || "Request failed";
	return Promise.reject(Object.assign(new Error(message), { original: error }));
});
var endpoints = {
	async signup(payload) {
		const { data } = await api.post("/auth/signup", payload);
		return data;
	},
	async signin(payload) {
		const { data } = await api.post("/auth/signin", payload);
		return data;
	},
	async signout() {
		await api.post("/auth/signout");
	},
	async getMe() {
		const { data } = await api.get("/auth/me");
		return data;
	},
	async listDatasets() {
		const { data } = await api.get("/datasets");
		return data;
	},
	async getDataset(id) {
		const { data } = await api.get(`/datasets/${id}`);
		return data;
	},
	async previewDataset(id, page = 1, pageSize = 25) {
		const { data } = await api.get(`/datasets/${id}/preview`, { params: {
			page,
			page_size: pageSize
		} });
		return data;
	},
	async deleteDataset(id) {
		await api.delete(`/datasets/${id}`);
	},
	async upload(file, onProgress) {
		const fd = new FormData();
		fd.append("file", file);
		const { data } = await api.post("/upload", fd, {
			headers: { "Content-Type": "multipart/form-data" },
			onUploadProgress: (evt) => {
				if (evt.total && onProgress) onProgress(Math.round(evt.loaded / evt.total * 100));
			}
		});
		return data;
	},
	async chat(req) {
		const { data } = await api.post("/chat", req);
		return data;
	},
	async voice(audio) {
		const fd = new FormData();
		fd.append("audio", audio, "audio.webm");
		const { data } = await api.post("/voice", fd, { headers: { "Content-Type": "multipart/form-data" } });
		return data;
	},
	async generateChart(payload) {
		const { data } = await api.post("/generate-chart", payload);
		return data;
	},
	async generateReport(payload) {
		const { data } = await api.post("/generate-report", payload);
		return data;
	},
	async detectAnomaly(payload) {
		const { data } = await api.post("/detect-anomaly", payload);
		return data;
	},
	async forecast(payload) {
		const { data } = await api.post("/forecast", payload);
		return data;
	},
	async generateSql(payload) {
		const { data } = await api.post("/generate-sql", payload);
		return data;
	},
	async listAutomation() {
		const { data } = await api.get("/automation");
		return data;
	},
	async runAutomation(service) {
		const { data } = await api.post("/automation", { service });
		return data;
	},
	async listReports() {
		const { data } = await api.get("/reports");
		return data;
	},
	async deleteReport(id) {
		await api.delete(`/reports/${id}`);
	},
	async sendReportToTelegram(reportId) {
		const { data } = await api.post(`/reports/${reportId}/send-telegram`);
		return data;
	},
	async testTelegramConnection() {
		const { data } = await api.post("/telegram/test");
		return data;
	},
	async listHistory() {
		const { data } = await api.get("/history");
		return data;
	},
	async getDashboard(params) {
		const { data } = await api.get("/dashboard", { params });
		return data;
	},
	async getSettings() {
		const { data } = await api.get("/settings");
		return data;
	},
	async updateSettings(payload) {
		const { data } = await api.put("/settings", payload);
		return data;
	}
};
var Card = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
	...props
}));
Card.displayName = "Card";
var CardHeader = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex flex-col space-y-1.5 p-6", className),
	...props
}));
CardHeader.displayName = "CardHeader";
var CardTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("font-semibold leading-none tracking-tight", className),
	...props
}));
CardTitle.displayName = "CardTitle";
var CardDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
CardDescription.displayName = "CardDescription";
var CardContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("p-6 pt-0", className),
	...props
}));
CardContent.displayName = "CardContent";
var CardFooter = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex items-center p-6 pt-0", className),
	...props
}));
CardFooter.displayName = "CardFooter";
//#endregion
export { CardTitle as a, endpoints as c, CardHeader as i, getAccessToken as l, CardContent as n, baseURL as o, CardDescription as r, cn as s, Card as t, setAccessToken as u };
