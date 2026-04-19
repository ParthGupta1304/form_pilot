"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChartDataPoint {
  date: string;
  count: number;
}

interface FieldBreakdown {
  id: string;
  label: string;
  type: string;
  breakdown?: Record<string, number>;
  avgRating?: number;
  total: number;
}

interface AnalyticsChartsProps {
  chartData: ChartDataPoint[];
  fieldBreakdowns: FieldBreakdown[];
}

export default function AnalyticsCharts({ chartData, fieldBreakdowns }: AnalyticsChartsProps) {
  console.log(`[AnalyticsCharts] chartData points: ${chartData.length}, fields: ${fieldBreakdowns.length}`);

  return (
    <div>
      {/* Response trend chart */}
      <div className="rounded-xl border border-border/40 bg-card p-5 mb-6">
        <h3 className="text-base font-semibold text-foreground mb-4">Responses over time</h3>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#534AB7" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#534AB7" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val: string) => {
                  const d = new Date(val);
                  return `${d.getDate()}/${d.getMonth() + 1}`;
                }}
                interval={4}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  padding: "8px 12px",
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [value, "Responses"]}
                labelFormatter={(label: any) =>
                  new Date(label).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                }
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#534AB7"
                strokeWidth={2}
                fill="url(#colorCount)"
                dot={false}
                activeDot={{ r: 4, fill: "#534AB7", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Field-level breakdowns */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-4">Field breakdown</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {fieldBreakdowns.map((field) => (
            <div
              key={field.id}
              className="rounded-xl border border-border/40 bg-card p-5"
            >
              <h4 className="text-sm font-medium text-foreground mb-3">{field.label}</h4>

              {/* MCQ bar chart */}
              {field.type === "mcq" && field.breakdown && (
                <div className="space-y-2.5">
                  {Object.entries(field.breakdown).map(([option, count]) => {
                    const maxCount = Math.max(...Object.values(field.breakdown!), 1);
                    const pct = Math.round((count / maxCount) * 100);
                    return (
                      <div key={option}>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span className="truncate">{option}</span>
                          <span className="ml-2 font-medium text-foreground">{count}</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Rating display */}
              {field.type === "rating" && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className="h-5 w-5"
                        fill={s <= Math.round(field.avgRating || 0) ? "#534AB7" : "transparent"}
                        stroke={s <= Math.round(field.avgRating || 0) ? "#534AB7" : "currentColor"}
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-bold text-foreground">{field.avgRating}</span>
                  <span className="text-xs text-muted-foreground">({field.total} ratings)</span>
                </div>
              )}

              {/* Text fields */}
              {(field.type === "short_text" || field.type === "long_text") && (
                <p className="text-sm text-muted-foreground">
                  {field.total} response{field.total !== 1 ? "s" : ""}
                </p>
              )}

              {/* File upload */}
              {field.type === "file_upload" && (
                <p className="text-sm text-muted-foreground">
                  {field.total} file{field.total !== 1 ? "s" : ""} uploaded
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
