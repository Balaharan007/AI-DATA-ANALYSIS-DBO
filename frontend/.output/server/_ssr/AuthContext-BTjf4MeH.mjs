import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { c as endpoints, l as getAccessToken, u as setAccessToken } from "./card-p0q76zfJ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AuthContext-BTjf4MeH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AuthContext = (0, import_react.createContext)(void 0);
function AuthProvider({ children }) {
	const [user, setUser] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [isClient, setIsClient] = (0, import_react.useState)(false);
	const isClientRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		isClientRef.current = true;
		setIsClient(true);
	}, []);
	const refreshUser = (0, import_react.useCallback)(async () => {
		if (!isClientRef.current) return;
		if (!getAccessToken()) {
			setUser(null);
			setIsLoading(false);
			return;
		}
		try {
			const userData = await endpoints.getMe();
			setUser(userData);
		} catch {
			setAccessToken(null);
			localStorage.removeItem("access_token");
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		if (isClientRef.current) refreshUser();
	}, [refreshUser]);
	const login = async (email, password) => {
		const response = await endpoints.signin({
			email,
			password
		});
		setAccessToken(response.access_token);
		localStorage.setItem("access_token", response.access_token);
		const userData = await endpoints.getMe();
		setUser(userData);
		setIsLoading(false);
		toast.success("Welcome back!");
	};
	const signup = async (name, email, password) => {
		const response = await endpoints.signup({
			name,
			email,
			password
		});
		setAccessToken(response.access_token);
		localStorage.setItem("access_token", response.access_token);
		const userData = await endpoints.getMe();
		setUser(userData);
		setIsLoading(false);
		toast.success("Account created successfully!");
	};
	const logout = async () => {
		try {
			await endpoints.signout();
		} catch {}
		setAccessToken(null);
		localStorage.removeItem("access_token");
		setUser(null);
		setIsLoading(false);
		toast.success("Signed out successfully");
	};
	const isAuthenticated = !!user;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value: {
			user,
			isLoading: isClient ? isLoading : false,
			isAuthenticated,
			login,
			signup,
			logout,
			refreshUser
		},
		children
	});
}
function useAuth() {
	const context = (0, import_react.useContext)(AuthContext);
	if (context === void 0) throw new Error("useAuth must be used within an AuthProvider");
	return context;
}
//#endregion
export { useAuth as n, AuthProvider as t };
