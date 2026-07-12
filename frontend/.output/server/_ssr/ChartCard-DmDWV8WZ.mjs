import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-p0q76zfJ.mjs";
import { _ as Legend, a as LineChart, c as Scatter, d as CartesianGrid, f as Bar, g as Tooltip, h as ResponsiveContainer, i as BarChart, l as Area, m as Cell, n as ScatterChart, o as YAxis, p as Pie, r as PieChart, s as XAxis, t as AreaChart, u as Line } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ChartCard-DmDWV8WZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PALETTE = [
	"#6366F1",
	"#22C55E",
	"#F59E0B",
	"#EC4899",
	"#06B6D4",
	"#EF4444",
	"#A855F7",
	"#84CC16",
	"#F97316",
	"#14B8A6"
];
var PLOTLY_TYPES = /* @__PURE__ */ new Set([
	"treemap",
	"heatmap",
	"radar",
	"box",
	"sunburst",
	"waterfall",
	"bubble"
]);
var Plot = (0, import_react.lazy)(() => import("../_libs/react-plotly.js.mjs").then((n) => /* @__PURE__ */ __toESM(n.t())).catch(() => ({ default: () => null })));
function ChartCard({ spec }) {
	if (!spec.data || spec.data.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "my-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "h-full overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
				className: "pb-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-sm font-medium",
					children: spec.title
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "flex h-88 items-center justify-center text-xs text-muted-foreground",
				children: "No data available for this chart."
			})]
		})
	});
	if (PLOTLY_TYPES.has(spec.type)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "my-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlotlyChart, { spec })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "my-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "h-full",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
				className: "pb-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-sm font-medium",
					children: spec.title
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "h-88 min-h-88 w-full pt-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative h-full w-full py-5",
					children: spec.type === "pie" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RechartsPie, { spec }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RechartsAxisChart, { spec })
				})
			})]
		})
	});
}
var legendStyle = {
	verticalAlign: "top",
	align: "right",
	wrapperStyle: {
		fontSize: 10,
		top: -4,
		right: 0
	}
};
function RechartsAxisChart({ spec }) {
	const xKey = spec.x_key ?? "x";
	const yKeys = spec.y_keys?.length ? spec.y_keys : ["y"];
	const data = spec.data ?? [];
	const common = {
		data,
		margin: {
			top: 22,
			right: 12,
			left: 4,
			bottom: 8
		}
	};
	const singleSeries = yKeys.length === 1;
	const barColors = singleSeries ? data.map((_, i) => PALETTE[i % PALETTE.length]) : void 0;
	const xLabel = xKey;
	const yLabel = yKeys[0];
	if (spec.type === "bar" || spec.type === "histogram") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
		width: "100%",
		height: "100%",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
			...common,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
					strokeDasharray: "3 3",
					stroke: "var(--color-border)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					dataKey: xKey,
					tick: { fontSize: 10 },
					stroke: "var(--color-muted-foreground)",
					label: {
						value: xLabel,
						position: "bottom",
						fontSize: 10,
						offset: -2
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					tick: { fontSize: 10 },
					stroke: "var(--color-muted-foreground)",
					label: {
						value: yLabel,
						angle: -90,
						position: "insideLeft",
						fontSize: 10,
						offset: 10
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: { fontSize: 11 } }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { ...legendStyle }),
				yKeys.map((y, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
					dataKey: y,
					radius: [
						3,
						3,
						0,
						0
					],
					children: singleSeries && barColors ? data.map((_, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: barColors[j] }, j)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: PALETTE[i % PALETTE.length] })
				}, y))
			]
		})
	});
	if (spec.type === "line" || spec.type === "waterfall") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
		width: "100%",
		height: "100%",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
			...common,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
					strokeDasharray: "3 3",
					stroke: "var(--color-border)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					dataKey: xKey,
					tick: { fontSize: 10 },
					stroke: "var(--color-muted-foreground)",
					label: {
						value: xLabel,
						position: "bottom",
						fontSize: 10,
						offset: -2
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					tick: { fontSize: 10 },
					stroke: "var(--color-muted-foreground)",
					label: {
						value: yLabel,
						position: "insideLeft",
						fontSize: 10,
						offset: 10
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: { fontSize: 11 } }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { ...legendStyle }),
				yKeys.map((y, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
					type: "monotone",
					dataKey: y,
					stroke: PALETTE[i % PALETTE.length],
					strokeWidth: 2,
					dot: {
						r: 3,
						fill: PALETTE[i % PALETTE.length]
					},
					activeDot: { r: 5 }
				}, y))
			]
		})
	});
	if (spec.type === "area") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
		width: "100%",
		height: "100%",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
			...common,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
					strokeDasharray: "3 3",
					stroke: "var(--color-border)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					dataKey: xKey,
					tick: { fontSize: 10 },
					stroke: "var(--color-muted-foreground)",
					label: {
						value: xLabel,
						position: "bottom",
						fontSize: 10,
						offset: -2
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					tick: { fontSize: 10 },
					stroke: "var(--color-muted-foreground)",
					label: {
						value: yLabel,
						angle: -90,
						position: "insideLeft",
						fontSize: 10,
						offset: 10
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: { fontSize: 11 } }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { ...legendStyle }),
				yKeys.map((y, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
					type: "monotone",
					dataKey: y,
					stroke: PALETTE[i % PALETTE.length],
					fill: PALETTE[i % PALETTE.length],
					fillOpacity: .2,
					strokeWidth: 2
				}, y))
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
		width: "100%",
		height: "100%",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ScatterChart, {
			...common,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
					strokeDasharray: "3 3",
					stroke: "var(--color-border)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					dataKey: xKey,
					tick: { fontSize: 10 },
					stroke: "var(--color-muted-foreground)",
					label: {
						value: xLabel,
						position: "bottom",
						fontSize: 10,
						offset: -2
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					dataKey: yKeys[0],
					tick: { fontSize: 10 },
					stroke: "var(--color-muted-foreground)",
					label: {
						value: yLabel,
						angle: -90,
						position: "insideLeft",
						fontSize: 10,
						offset: 10
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: { fontSize: 11 } }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { ...legendStyle }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scatter, {
					data,
					fill: PALETTE[0],
					opacity: .8
				})
			]
		})
	});
}
function RechartsPie({ spec }) {
	const xKey = spec.x_key ?? "label";
	const yKey = (spec.y_keys ?? ["value"])[0];
	const data = spec.data ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
		width: "100%",
		height: "100%",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, {
			margin: {
				top: 22,
				right: 12,
				left: 4,
				bottom: 8
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
					data,
					dataKey: yKey,
					nameKey: xKey,
					cx: "50%",
					cy: "50%",
					outerRadius: "65%",
					innerRadius: spec.type === "sunburst" ? "30%" : 0,
					label: ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`,
					labelLine: true,
					children: data.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: PALETTE[i % PALETTE.length] }, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: { fontSize: 11 } }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { ...legendStyle })
			]
		})
	});
}
function PlotlyChart({ spec }) {
	const { data, layout } = (0, import_react.useMemo)(() => buildPlotlyFigure(spec), [spec]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "my-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "h-full",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
				className: "pb-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-sm font-medium",
					children: spec.title
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "h-88 min-h-88 pt-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
					fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-full w-full animate-pulse items-center justify-center rounded-md bg-muted/40 text-xs text-muted-foreground",
						children: "Rendering chart…"
					}),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plot, {
						data,
						layout,
						config: {
							displayModeBar: false,
							responsive: true
						},
						style: {
							width: "100%",
							height: "100%"
						},
						useResizeHandler: true
					})
				})
			})]
		})
	});
}
function baseLayout(spec) {
	return {
		autosize: true,
		margin: {
			t: 28,
			r: 16,
			l: 48,
			b: 48
		},
		paper_bgcolor: "transparent",
		plot_bgcolor: "transparent",
		font: {
			family: "inherit",
			size: 11,
			color: "var(--color-muted-foreground)"
		},
		legend: {
			orientation: "v",
			x: 1,
			y: 1,
			xanchor: "right",
			yanchor: "top",
			font: { size: 10 }
		},
		xaxis: {
			title: spec.x_key,
			gridcolor: "var(--color-border)",
			zeroline: false
		},
		yaxis: {
			title: spec.y_keys?.[0],
			gridcolor: "var(--color-border)",
			zeroline: false
		},
		colorway: PALETTE
	};
}
function buildPlotlyFigure(spec) {
	const x = spec.x_key ?? "x";
	const ys = spec.y_keys?.length ? spec.y_keys : ["y"];
	const rows = spec.data ?? [];
	const xs = rows.map((r) => r[x]);
	const layout = baseLayout(spec);
	switch (spec.type) {
		case "radar": return {
			data: ys.map((y, i) => ({
				type: "scatterpolar",
				name: y,
				r: rows.map((r) => r[y]),
				theta: xs,
				fill: "toself",
				line: { color: PALETTE[i % PALETTE.length] },
				fillcolor: PALETTE[i % PALETTE.length] + "33"
			})),
			layout: {
				...layout,
				xaxis: void 0,
				yaxis: void 0,
				polar: { radialaxis: { visible: true } }
			}
		};
		case "treemap": return {
			data: [{
				type: "treemap",
				labels: xs,
				parents: xs.map(() => ""),
				values: rows.map((r) => r[ys[0]]),
				marker: { colors: PALETTE }
			}],
			layout: {
				...layout,
				xaxis: void 0,
				yaxis: void 0
			}
		};
		case "heatmap": {
			const categories = [...new Set(xs)];
			const series = ys.length > 1 ? ys : ["value"];
			const z = categories.map(() => series.map(() => 0));
			rows.forEach((r) => {
				const xi = categories.indexOf(r[x]);
				series.forEach((s, si) => {
					if (xi >= 0) z[xi][si] = Number(r[s]) || 0;
				});
			});
			return {
				data: [{
					type: "heatmap",
					z,
					x: categories,
					y: series,
					colorscale: "Viridis"
				}],
				layout: {
					...layout,
					xaxis: void 0,
					yaxis: void 0
				}
			};
		}
		case "box": return {
			data: ys.map((y) => ({
				type: "box",
				name: y,
				y: rows.map((r) => r[y]),
				marker: { color: PALETTE[0] }
			})),
			layout
		};
		case "sunburst": return {
			data: [{
				type: "sunburst",
				labels: xs,
				parents: xs.map(() => ""),
				values: rows.map((r) => r[ys[0]]),
				marker: { colors: PALETTE }
			}],
			layout: {
				...layout,
				xaxis: void 0,
				yaxis: void 0
			}
		};
		case "waterfall": return {
			data: [{
				type: "waterfall",
				orientation: "v",
				measure: [
					"relative",
					...Array(xs.length - 1).fill("relative"),
					"total"
				],
				x: [...xs, "Total"],
				textposition: "outside",
				y: [...rows.map((r) => r[ys[0]]), 0],
				connector: { line: { color: "rgb(63, 63, 63)" } },
				increasing: { marker: { color: PALETTE[1] } },
				decreasing: { marker: { color: PALETTE[5] } },
				totals: { marker: { color: PALETTE[0] } }
			}],
			layout: {
				...layout,
				xaxis: {
					...layout.xaxis,
					title: spec.x_key
				},
				yaxis: {
					...layout.yaxis,
					title: spec.y_keys?.[0]
				}
			}
		};
		case "bubble": return {
			data: [{
				type: "scatter",
				mode: "markers",
				x: xs,
				y: rows.map((r) => r[ys[0]]),
				text: xs.map((x, i) => `${x}: ${rows[i][ys[0]]}`),
				marker: {
					size: rows.map((r) => Math.max(10, Math.min(60, Math.abs(r[ys[1]] || 10) * 2))),
					color: PALETTE[0],
					opacity: .7,
					sizemode: "area",
					sizeref: 2 * Math.max(...rows.map((r) => Math.abs(r[ys[1]] || 1))) / 60 ** 2
				}
			}],
			layout
		};
		default: return {
			data: [],
			layout
		};
	}
}
//#endregion
export { ChartCard as t };
