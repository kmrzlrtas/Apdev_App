import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WeeklyTrend } from "@shared/schema";

interface WeeklyTrendChartProps {
  data: WeeklyTrend[];
  metric: "calories" | "protein" | "carbs" | "fats";
}

const metricConfig = {
  calories: {
    color: "hsl(var(--chart-1))",
    label: "Calories",
    unit: "kcal",
  },
  protein: {
    color: "hsl(var(--chart-2))",
    label: "Protein",
    unit: "g",
  },
  carbs: {
    color: "hsl(var(--chart-3))",
    label: "Carbs",
    unit: "g",
  },
  fats: {
    color: "hsl(var(--chart-4))",
    label: "Fats",
    unit: "g",
  },
};

export function WeeklyTrendChart({ data, metric }: WeeklyTrendChartProps) {
  const config = metricConfig[metric];

  const formattedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      day: new Date(item.date).toLocaleDateString("en-US", { weekday: "short" }),
    }));
  }, [data]);

  return (
    <Card data-testid={`chart-weekly-${metric}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{config.label} Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData}>
              <defs>
                <linearGradient id={`gradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={config.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={config.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
                width={40}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-md">
                        <p className="text-sm font-medium">
                          {payload[0].value} {config.unit}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey={metric}
                stroke={config.color}
                strokeWidth={2}
                fill={`url(#gradient-${metric})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

interface MacroDistributionChartProps {
  protein: number;
  carbs: number;
  fats: number;
}

const MACRO_COLORS = [
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

export function MacroDistributionChart({ protein, carbs, fats }: MacroDistributionChartProps) {
  const data = useMemo(() => {
    const total = protein + carbs + fats;
    if (total === 0) {
      return [
        { name: "Protein", value: 33, grams: 0 },
        { name: "Carbs", value: 33, grams: 0 },
        { name: "Fats", value: 34, grams: 0 },
      ];
    }
    return [
      { name: "Protein", value: Math.round((protein / total) * 100), grams: protein },
      { name: "Carbs", value: Math.round((carbs / total) * 100), grams: carbs },
      { name: "Fats", value: Math.round((fats / total) * 100), grams: fats },
    ];
  }, [protein, carbs, fats]);

  return (
    <Card data-testid="chart-macro-distribution">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Macro Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="h-[160px] w-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={MACRO_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-md">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.grams}g ({item.value}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-3">
            {data.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: MACRO_COLORS[index] }}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="text-sm font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
