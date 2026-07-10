import React, { useMemo, lazy, Suspense } from "react";
import type Plotly from "plotly.js";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartSpec } from "@/lib/api/types";

// A distinct, colorblind-friendlier palette so each series/category is easy to tell apart.
const PALETTE = [
  "#6366F1", // indigo
  "#22C55E", // green
  "#F59E0B", // amber
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#EF4444", // red
  "#A855F7", // purple
  "#84CC16", // lime
  "#F97316", // orange
  "#14B8A6", // teal
];

// Chart types that fall back to Plotly (heavy, lazy-loaded)
const PLOTLY_TYPES = new Set([
  "treemap",
  "heatmap",
  "radar",
  "box",
  "sunburst",
  "waterfall",
  "bubble",
]);

type PlotlyComponent = React.ComponentType<Record<string, unknown>>;

const Plot = lazy(
  () =>
    import("react-plotly.js").catch(() => ({
      default: () => null as React.ReactElement | null,
    })) as Promise<{ default: PlotlyComponent }>,
);

export function ChartCard({ spec }: { spec: ChartSpec }) {
  if (!spec.data || spec.data.length === 0) {
    return (
      <div className="my-5">
        <Card className="h-full overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{spec.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex h-88 items-center justify-center text-xs text-muted-foreground">
            No data available for this chart.
          </CardContent>
        </Card>
      </div>
    );
  }

  if (PLOTLY_TYPES.has(spec.type)) {
    return (
      <div className="my-5">
        <PlotlyChart spec={spec} />
      </div>
    );
  }

  return (
    <div className="my-5">
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{spec.title}</CardTitle>
        </CardHeader>
        <CardContent className="h-88 min-h-88 w-full pt-2">
          <div className="relative h-full w-full py-5">
            {spec.type === "pie" ? (
              <RechartsPie spec={spec} />
            ) : (
              <RechartsAxisChart spec={spec} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------- Shared legend style: top-right corner ----------

const legendStyle = {
  verticalAlign: "top" as const,
  align: "right" as const,
  wrapperStyle: { fontSize: 10, top: -4, right: 0 },
};

// ---------- Recharts axis-based charts (bar, line, area, scatter, histogram) ----------

function RechartsAxisChart({ spec }: { spec: ChartSpec }) {
  const xKey = spec.x_key ?? "x";
  const yKeys = spec.y_keys?.length ? spec.y_keys : ["y"];
  const data = spec.data ?? [];

  // Top margin includes space for the legend (22px) so it doesn't overlap chart area
  const common = { data, margin: { top: 22, right: 12, left: 4, bottom: 8 } };

  // Multi-color for single-series bars: one color per data point
  const singleSeries = yKeys.length === 1;
  const barColors = singleSeries
    ? data.map((_, i) => PALETTE[i % PALETTE.length])
    : undefined;

  const xLabel = xKey;
  const yLabel = yKeys[0];

  if (spec.type === "bar" || spec.type === "histogram") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart {...common}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 10 }}
            stroke="var(--color-muted-foreground)"
            label={{
              value: xLabel,
              position: "bottom",
              fontSize: 10,
              offset: -2,
            }}
          />
          <YAxis
            tick={{ fontSize: 10 }}
            stroke="var(--color-muted-foreground)"
            label={{
              value: yLabel,
              angle: -90,
              position: "insideLeft",
              fontSize: 10,
              offset: 10,
            }}
          />
          <Tooltip contentStyle={{ fontSize: 11 }} />
          <Legend {...legendStyle} />
          {yKeys.map((y, i) => (
            <Bar key={y} dataKey={y} radius={[3, 3, 0, 0]}>
              {singleSeries && barColors ? (
                data.map((_, j) => <Cell key={j} fill={barColors[j]} />)
              ) : (
                <Cell fill={PALETTE[i % PALETTE.length]} />
              )}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (spec.type === "line" || spec.type === "waterfall") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart {...common}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 10 }}
            stroke="var(--color-muted-foreground)"
            label={{
              value: xLabel,
              position: "bottom",
              fontSize: 10,
              offset: -2,
            }}
          />
          <YAxis
            tick={{ fontSize: 10 }}
            stroke="var(--color-muted-foreground)"
            label={{
              value: yLabel,
              position: "insideLeft",
              fontSize: 10,
              offset: 10,
            }}
          />
          <Tooltip contentStyle={{ fontSize: 11 }} />
          <Legend {...legendStyle} />
          {yKeys.map((y, i) => (
            <Line
              key={y}
              type="monotone"
              dataKey={y}
              stroke={PALETTE[i % PALETTE.length]}
              strokeWidth={2}
              dot={{ r: 3, fill: PALETTE[i % PALETTE.length] }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (spec.type === "area") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart {...common}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 10 }}
            stroke="var(--color-muted-foreground)"
            label={{
              value: xLabel,
              position: "bottom",
              fontSize: 10,
              offset: -2,
            }}
          />
          <YAxis
            tick={{ fontSize: 10 }}
            stroke="var(--color-muted-foreground)"
            label={{
              value: yLabel,
              angle: -90,
              position: "insideLeft",
              fontSize: 10,
              offset: 10,
            }}
          />
          <Tooltip contentStyle={{ fontSize: 11 }} />
          <Legend {...legendStyle} />
          {yKeys.map((y, i) => (
            <Area
              key={y}
              type="monotone"
              dataKey={y}
              stroke={PALETTE[i % PALETTE.length]}
              fill={PALETTE[i % PALETTE.length]}
              fillOpacity={0.2}
              strokeWidth={2}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  // Scatter / bubble
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart {...common}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 10 }}
          stroke="var(--color-muted-foreground)"
          label={{
            value: xLabel,
            position: "bottom",
            fontSize: 10,
            offset: -2,
          }}
        />
        <YAxis
          dataKey={yKeys[0]}
          tick={{ fontSize: 10 }}
          stroke="var(--color-muted-foreground)"
          label={{
            value: yLabel,
            angle: -90,
            position: "insideLeft",
            fontSize: 10,
            offset: 10,
          }}
        />
        <Tooltip contentStyle={{ fontSize: 11 }} />
        <Legend {...legendStyle} />
        <Scatter data={data} fill={PALETTE[0]} opacity={0.8} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

// ---------- Recharts pie chart ----------

function RechartsPie({ spec }: { spec: ChartSpec }) {
  const xKey = spec.x_key ?? "label";
  const yKey = (spec.y_keys ?? ["value"])[0];
  const data = spec.data ?? [];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 22, right: 12, left: 4, bottom: 8 }}>
        <Pie
          data={data}
          dataKey={yKey}
          nameKey={xKey}
          cx="50%"
          cy="50%"
          outerRadius="65%"
          innerRadius={spec.type === "sunburst" ? "30%" : 0}
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
          labelLine
        >
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ fontSize: 11 }} />
        <Legend {...legendStyle} />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ---------- Plotly fallback (treemap, heatmap, radar, box, waterfall) ----------

function PlotlyChart({ spec }: { spec: ChartSpec }) {
  const { data, layout } = useMemo(() => buildPlotlyFigure(spec), [spec]);

  return (
    <div className="my-5">
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{spec.title}</CardTitle>
        </CardHeader>
        <CardContent className="h-88 min-h-88 pt-2">
          <Suspense
            fallback={
              <div className="flex h-full w-full animate-pulse items-center justify-center rounded-md bg-muted/40 text-xs text-muted-foreground">
                Rendering chart…
              </div>
            }
          >
            <Plot
              data={data}
              layout={layout}
              config={{ displayModeBar: false, responsive: true }}
              style={{ width: "100%", height: "100%" }}
              useResizeHandler
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

function baseLayout(spec: ChartSpec): Partial<Plotly.Layout> {
  return {
    autosize: true,
    margin: { t: 28, r: 16, l: 48, b: 48 },
    paper_bgcolor: "transparent",
    plot_bgcolor: "transparent",
    font: {
      family: "inherit",
      size: 11,
      color: "var(--color-muted-foreground)",
    },
    legend: {
      orientation: "v",
      x: 1,
      y: 1,
      xanchor: "right",
      yanchor: "top",
      font: { size: 10 },
    },
    xaxis: {
      title: spec.x_key,
      gridcolor: "var(--color-border)",
      zeroline: false,
    },
    yaxis: {
      title: spec.y_keys?.[0],
      gridcolor: "var(--color-border)",
      zeroline: false,
    },
    colorway: PALETTE,
  };
}

function buildPlotlyFigure(spec: ChartSpec): {
  data: Plotly.Data[];
  layout: Partial<Plotly.Layout>;
} {
  const x = spec.x_key ?? "x";
  const ys = spec.y_keys?.length ? spec.y_keys : ["y"];
  const rows = spec.data ?? [];
  const xs = rows.map((r) => r[x] as string | number);
  const layout = baseLayout(spec);

  switch (spec.type) {
    case "radar":
      return {
        data: ys.map((y, i) => ({
          type: "scatterpolar",
          name: y,
          r: rows.map((r) => r[y] as number),
          theta: xs,
          fill: "toself",
          line: { color: PALETTE[i % PALETTE.length] },
          fillcolor: PALETTE[i % PALETTE.length] + "33",
        })),
        layout: {
          ...layout,
          xaxis: undefined,
          yaxis: undefined,
          polar: { radialaxis: { visible: true } },
        },
      };

    case "treemap":
      return {
        data: [
          {
            type: "treemap",
            labels: xs,
            parents: xs.map(() => ""),
            values: rows.map((r) => r[ys[0]] as number),
            marker: { colors: PALETTE },
          },
        ],
        layout: { ...layout, xaxis: undefined, yaxis: undefined },
      };

    case "heatmap": {
      const categories = [...new Set(xs)];
      const series = ys.length > 1 ? ys : ["value"];
      const z = categories.map(() => series.map(() => 0));
      rows.forEach((r) => {
        const xi = categories.indexOf(r[x] as string);
        series.forEach((s, si) => {
          if (xi >= 0) z[xi][si] = Number(r[s]) || 0;
        });
      });
      return {
        data: [
          {
            type: "heatmap",
            z,
            x: categories,
            y: series,
            colorscale: "Viridis",
          },
        ],
        layout: { ...layout, xaxis: undefined, yaxis: undefined },
      };
    }

    case "box":
      return {
        data: ys.map((y) => ({
          type: "box",
          name: y,
          y: rows.map((r) => r[y] as number),
          marker: { color: PALETTE[0] },
        })),
        layout,
      };

    case "sunburst":
      return {
        data: [
          {
            type: "sunburst",
            labels: xs,
            parents: xs.map(() => ""),
            values: rows.map((r) => r[ys[0]] as number),
            marker: { colors: PALETTE },
          },
        ],
        layout: { ...layout, xaxis: undefined, yaxis: undefined },
      };

    case "waterfall":
      return {
        data: [
          {
            type: "waterfall",
            orientation: "v",
            measure: [
              "relative",
              ...Array(xs.length - 1).fill("relative"),
              "total",
            ],
            x: [...xs, "Total"],
            textposition: "outside",
            y: [...rows.map((r) => r[ys[0]] as number), 0],
            connector: { line: { color: "rgb(63, 63, 63)" } },
            increasing: { marker: { color: PALETTE[1] } },
            decreasing: { marker: { color: PALETTE[5] } },
            totals: { marker: { color: PALETTE[0] } },
          } as Plotly.Data,
        ],
        layout: {
          ...layout,
          xaxis: { ...layout.xaxis, title: spec.x_key },
          yaxis: { ...layout.yaxis, title: spec.y_keys?.[0] },
        },
      };

    case "bubble":
      return {
        data: [
          {
            type: "scatter",
            mode: "markers",
            x: xs,
            y: rows.map((r) => r[ys[0]] as number),
            text: xs.map((x, i) => `${x}: ${rows[i][ys[0]]}`),
            marker: {
              size: rows.map((r) =>
                Math.max(
                  10,
                  Math.min(
                    60,
                    Math.abs((r[ys[1] as string] as number) || 10) * 2,
                  ),
                ),
              ),
              color: PALETTE[0],
              opacity: 0.7,
              sizemode: "area",
              sizeref:
                (2.0 *
                  Math.max(
                    ...rows.map((r) =>
                      Math.abs((r[ys[1] as string] as number) || 1),
                    ),
                  )) /
                60 ** 2,
            },
          },
        ],
        layout,
      };

    default:
      return { data: [], layout };
  }
}
