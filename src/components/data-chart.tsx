"use client";
import { Component, type ReactNode } from 'react';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

interface DataChartProps {
    data: unknown[] | { data: unknown[]; query?: string; rowCount?: number; executionTime?: number };
    xKey: string;
    yKey: string;
    type?: 'bar' | 'pie' | 'line';
    title?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B9D', '#C9CBCF', '#82ca9d', '#ffc658', '#ff7c43'];

// ── Error boundary to prevent chart crashes from breaking the whole page ──
interface ErrorBoundaryProps {
    fallbackMessage?: string;
    children: ReactNode;
}
interface ErrorBoundaryState {
    hasError: boolean;
    error: string | null;
}

class ChartErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error: error.message };
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="w-full my-4 bg-red-50 border border-red-200 rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-red-500 text-lg">⚠️</span>
                        <h4 className="text-sm font-semibold text-red-800">Chart Rendering Error</h4>
                    </div>
                    <p className="text-sm text-red-700">
                        {this.props.fallbackMessage || 'Could not render this chart. The data format may be incompatible.'}
                    </p>
                    {this.state.error && (
                        <p className="text-xs text-red-500 mt-2 font-mono bg-red-100 rounded px-2 py-1 break-all">
                            {this.state.error}
                        </p>
                    )}
                </div>
            );
        }
        return this.props.children;
    }
}

// ── Helper: safely convert any value to a finite number ──
function safeNumber(val: unknown, fallback = 0): number {
    if (val === null || val === undefined || val === '') return fallback;
    const n = Number(val);
    return Number.isFinite(n) ? n : fallback;
}

export default function DataChart({ data, xKey, yKey, type = 'bar', title }: DataChartProps) {
    // Handle both direct array and wrapped object from query-database tool
    let safeData: Record<string, unknown>[] = [];

    if (Array.isArray(data)) {
        safeData = data as Record<string, unknown>[];
    } else if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as { data: unknown[] }).data)) {
        safeData = (data as { data: Record<string, unknown>[] }).data;
    }

    // Filter out null/empty objects and sanitize values
    safeData = safeData
        .filter(row => row && typeof row === 'object' && Object.keys(row).length > 0)
        .map(row => {
            const clean: Record<string, unknown> = {};
            for (const [k, v] of Object.entries(row)) {
                if (typeof v === 'number') {
                    clean[k] = Number.isFinite(v) ? v : 0;
                } else {
                    clean[k] = v ?? '';
                }
            }
            return clean;
        });

    if (safeData.length === 0) {
        return (
            <div className="w-full my-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-500 text-sm flex items-center gap-2">
                    <span>📭</span> No data available for chart.
                </p>
            </div>
        );
    }

    const dataKeys = Object.keys(safeData[0] || {});
    const numericCols = dataKeys.filter(k => typeof safeData[0][k] === 'number');
    const stringCols = dataKeys.filter(k => typeof safeData[0][k] === 'string');
    const actualXKey = dataKeys.includes(xKey) ? xKey : stringCols[0] || dataKeys[0] || 'name';
    const actualYKey = dataKeys.includes(yKey) ? yKey : numericCols[0] || dataKeys[1] || 'value';

    let processedData: { name: string; value: number; [k: string]: unknown }[] = safeData.map(item => ({
        ...item,
        [actualYKey]: safeNumber(item[actualYKey])
    })) as { name: string; value: number; [k: string]: unknown }[];

    if (type === 'pie') {
        const isWideFormat = safeData.length <= 2 && numericCols.length >= 2;
        let pieData: { name: string; value: number }[];
        if (isWideFormat) {
            const sums: Record<string, number> = {};
            numericCols.forEach(col => { sums[col] = 0; });
            safeData.forEach(row => numericCols.forEach(col => { sums[col] += safeNumber(row[col]); }));
            pieData = Object.entries(sums)
                .map(([col, value]) => ({ name: col.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), value }))
                .filter(d => d.value > 0);
        } else {
            const agg = new Map<string, number>();
            safeData.forEach(item => {
                const cat = String(item[actualXKey] ?? 'Unknown').trim();
                const val = safeNumber(item[actualYKey]);
                agg.set(cat, (agg.get(cat) || 0) + (val === 0 && typeof item[actualYKey] !== 'number' ? 1 : val));
            });
            pieData = Array.from(agg.entries()).map(([name, value]) => ({ name, value })).filter(d => d.value > 0).sort((a, b) => b.value - a.value);
        }
        if (pieData.length < 2) {
            return (
                <div className="w-full my-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-amber-800 text-sm">⚠️ Not enough categories for pie chart (need at least 2).</p>
                </div>
            );
        }
        const total = pieData.reduce((s, d) => s + d.value, 0);
        return (
            <ChartErrorBoundary fallbackMessage="Could not render this pie chart.">
                <div className="bg-white p-6 rounded-lg shadow my-4">
                    {title && <h3 className="text-lg font-bold mb-4 text-gray-800">{title}</h3>}
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120}
                                label={({ name, value }) => `${name}: ${value} (${total ? Math.round((value / total) * 100) : 0}%)`}>
                                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip formatter={(val) => [val ?? 0, '']} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </ChartErrorBoundary>
        );
    }

    if (type === 'line') {
        return (
            <ChartErrorBoundary fallbackMessage="Could not render this line chart.">
                <div className="bg-white p-6 rounded-lg shadow-lg my-4">
                    {title && <h3 className="text-lg font-bold mb-4 text-gray-800">{title}</h3>}
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis
                                dataKey={actualXKey}
                                stroke="#666"
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                interval={0}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis stroke="#666" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey={actualYKey}
                                stroke="#8884d8"
                                strokeWidth={3}
                                dot={{ r: 5, fill: '#8884d8' }}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </ChartErrorBoundary>
        );
    }

    // Default: Bar chart
    return (
        <ChartErrorBoundary fallbackMessage="Could not render this bar chart.">
            <div className="bg-white p-6 rounded-lg shadow-lg my-4">
                {title && <h3 className="text-lg font-bold mb-4 text-gray-800">{title}</h3>}
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                            dataKey={actualXKey}
                            stroke="#666"
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            interval={0}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis stroke="#666" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                            formatter={(value) => [Number(value).toLocaleString(), actualYKey]}
                        />
                        <Legend />
                        <Bar
                            dataKey={actualYKey}
                            fill="#8884d8"
                            radius={[8, 8, 0, 0]}
                        >
                            {processedData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </ChartErrorBoundary>
    );
}
