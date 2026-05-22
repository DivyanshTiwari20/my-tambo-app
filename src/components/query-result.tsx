"use client";

import { useEffect, useState, Component, type ReactNode } from 'react';
import { getCredentials } from '@/components/settings-modal';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

interface QueryResultProps {
    table: string;
    columns?: string;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
    limit?: number;
    filter?: string;
    displayType?: 'table' | 'bar' | 'line' | 'pie';
    xKey?: string;
    yKey?: string;
    title?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B9D', '#C9CBCF', '#82ca9d', '#ffc658', '#ff7c43'];

// ── Error boundary to catch any Recharts rendering crashes ──
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

// ── Helper: sanitize data rows for Recharts (no NaN, no undefined keys) ──
function sanitizeRows(rows: Record<string, unknown>[]): Record<string, unknown>[] {
    return rows
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
}

export default function QueryResult({
    table,
    columns,
    orderBy,
    orderDirection = 'desc',
    limit = 10,
    filter,
    displayType = 'table',
    xKey,
    yKey,
    title
}: QueryResultProps) {
    const [data, setData] = useState<Record<string, unknown>[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const creds = getCredentials();
                if (!creds.supabaseUrl || !creds.supabaseAnonKey) {
                    throw new Error('Supabase credentials not configured. Please add them in Settings.');
                }

                const res = await fetch('/api/query', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        supabaseUrl: creds.supabaseUrl,
                        supabaseKey: creds.supabaseAnonKey,
                        userQuery: { table, columns, orderBy, orderDirection, limit, filter },
                    }),
                });

                const json = await res.json();

                if (!res.ok || json.error) {
                    throw new Error(json.error || 'Failed to fetch data');
                }

                const rows = Array.isArray(json.data) ? json.data : [];
                setData(sanitizeRows(rows));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        if (table) {
            fetchData();
        }
    }, [table, columns, orderBy, orderDirection, limit, filter]);

    // ── Loading state ──
    if (loading) {
        return (
            <div className="flex items-center gap-2 py-3 my-2">
                <div className="h-4 w-4 border-2 border-gray-300 border-t-emerald-500 rounded-full animate-spin" />
                <p className="text-gray-500 text-sm">Loading data from <span className="font-medium">{table}</span>…</p>
            </div>
        );
    }

    // ── Error state — show a clear error message, NO fake data ──
    if (error) {
        const isCredentialError = error.toLowerCase().includes('credential') || error.toLowerCase().includes('settings');
        const isConnectionError = error.toLowerCase().includes('paused') || error.toLowerCase().includes('connect') || error.toLowerCase().includes('fetch');

        return (
            <div className="w-full my-4">
                {title && <h3 className="text-sm font-semibold mb-2 text-gray-700">{title}</h3>}
                <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-semibold text-red-800 mb-1">
                                {isCredentialError ? 'Credentials Required' : isConnectionError ? 'Database Connection Failed' : 'Query Error'}
                            </h4>
                            <p className="text-sm text-red-700 leading-relaxed">{error}</p>
                            {isCredentialError && (
                                <button
                                    onClick={() => document.getElementById('settings-button')?.click()}
                                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 text-xs font-semibold rounded-md transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                    Open Settings
                                </button>
                            )}
                            {isConnectionError && (
                                <p className="mt-2 text-xs text-red-600">
                                    💡 Tip: Check if your Supabase project is active and not paused. You can resume it from the Supabase dashboard.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── Empty data ──
    if (data.length === 0) {
        return (
            <div className="w-full my-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-500 text-sm flex items-center gap-2">
                    <span>📭</span>
                    No data found in <span className="font-medium">{table}</span>.
                </p>
            </div>
        );
    }

    // ── Auto-detect keys for charts ──
    const dataKeys = Object.keys(data[0] || {});
    const numericCols = dataKeys.filter(k => typeof data[0][k] === 'number');
    const stringCols = dataKeys.filter(k => typeof data[0][k] === 'string');

    const actualXKey = xKey && dataKeys.includes(xKey) ? xKey : stringCols[0] || dataKeys[0];
    const actualYKey = yKey && dataKeys.includes(yKey) ? yKey : numericCols[0] || dataKeys[1] || dataKeys[0];

    // Guard: if we have no valid keys, fall back to table
    if (!actualXKey || !actualYKey) {
        return renderTable(data, columns, dataKeys, title);
    }

    // ── PIE CHART ──
    let processedData: { name: string; value: number; [k: string]: unknown }[] = [];
    if (displayType === 'pie') {
        const isWideFormat = data.length <= 2 && numericCols.length >= 2;

        if (isWideFormat) {
            const sums: Record<string, number> = {};
            numericCols.forEach(col => { sums[col] = 0; });
            data.forEach(row => {
                numericCols.forEach(col => {
                    sums[col] += safeNumber(row[col]);
                });
            });
            processedData = Object.entries(sums)
                .map(([col, value]) => ({
                    name: col.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                    value,
                }))
                .filter(d => d.value > 0);
        } else {
            const aggregated = new Map<string, number>();
            data.forEach(item => {
                const cat = String(item[actualXKey] ?? 'Unknown').trim();
                const val = safeNumber(item[actualYKey]);
                if (!aggregated.has(cat)) aggregated.set(cat, 0);
                aggregated.set(cat, aggregated.get(cat)! + (val === 0 && typeof item[actualYKey] !== 'number' ? 1 : val));
            });
            processedData = Array.from(aggregated.entries())
                .map(([name, value]) => ({ name, value }))
                .filter(d => d.value > 0)
                .sort((a, b) => b.value - a.value);
        }

        if (processedData.length < 2) {
            return (
                <div className="w-full my-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-amber-800 text-sm flex items-center gap-2">
                        <span>⚠️</span>
                        Not enough categories for a pie chart (need at least 2 distinct values).
                        {processedData.length === 1 && ` Found only: ${processedData[0]?.name} = ${processedData[0]?.value}`}
                    </p>
                </div>
            );
        }

        const total = processedData.reduce((s, d) => s + d.value, 0);
        return (
            <ChartErrorBoundary fallbackMessage="Could not render this pie chart. Try a different display type.">
                <div className="bg-white p-6 rounded-lg shadow my-4">
                    {title && <h3 className="text-lg font-bold mb-4 text-gray-800">{title}</h3>}
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={processedData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={120}
                                label={({ name, value }) => `${name}: ${value} (${total ? Math.round((value / total) * 100) : 0}%)`}
                            >
                                {processedData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(val) => [val ?? 0, '']} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </ChartErrorBoundary>
        );
    }

    // ── Bar / Line: standard processing ──
    processedData = data.map(item => ({
        ...item,
        [actualYKey]: safeNumber(item[actualYKey], 1),
    })) as { name: string; value: number; [k: string]: unknown }[];

    if (['bar', 'line'].includes(displayType)) {
        const aggregated = new Map<string, Record<string, unknown>>();
        processedData.forEach(item => {
            const xVal = String(item[actualXKey] || 'Unknown');
            if (!aggregated.has(xVal)) {
                aggregated.set(xVal, { ...item, [actualXKey]: xVal, _tambo_count: 0 });
            }
            const current = aggregated.get(xVal)!;
            (current._tambo_count as number) += 1;
            const yVal = safeNumber(item[actualYKey]);
            if (yVal !== 0 || typeof item[actualYKey] === 'number') {
                current[actualYKey] = (current._tambo_count as number) === 1 ? yVal : (safeNumber(current[actualYKey]) + yVal);
            }
        });
        processedData = Array.from(aggregated.values()) as { name: string; value: number; [k: string]: unknown }[];
        if (data.length > 0 && typeof data[0][actualYKey] !== 'number') {
            processedData.forEach(item => {
                item[actualYKey] = item._tambo_count as number;
            });
        }
        processedData.sort((a, b) => String(a[actualXKey]).localeCompare(String(b[actualXKey])));
    }

    // Guard: if processedData is empty after aggregation, show message
    if (processedData.length === 0) {
        return (
            <div className="w-full my-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-500 text-sm">No chartable data available after processing.</p>
            </div>
        );
    }

    // ── Render BAR chart ──
    if (displayType === 'bar') {
        return (
            <ChartErrorBoundary fallbackMessage="Could not render this bar chart. Try 'table' display instead.">
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
                                tick={{ fontSize: 11 }}
                            />
                            <YAxis stroke="#666" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                                formatter={(value) => [Number(value).toLocaleString(), actualYKey]}
                            />
                            <Legend />
                            <Bar dataKey={actualYKey} fill="#8884d8" radius={[8, 8, 0, 0]}>
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

    // ── Render LINE chart ──
    if (displayType === 'line') {
        return (
            <ChartErrorBoundary fallbackMessage="Could not render this line chart. Try 'table' display instead.">
                <div className="bg-white p-6 rounded-lg shadow-lg my-4">
                    {title && <h3 className="text-lg font-bold mb-4 text-gray-800">{title}</h3>}
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis dataKey={actualXKey} stroke="#666" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
                            <YAxis stroke="#666" />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey={actualYKey} stroke="#8884d8" strokeWidth={3} dot={{ r: 5 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </ChartErrorBoundary>
        );
    }

    // ── Default: Table view ──
    return renderTable(data, columns, dataKeys, title);
}

// ── Reusable table renderer ──
function renderTable(
    data: Record<string, unknown>[],
    columns: string | undefined,
    dataKeys: string[],
    title: string | undefined
) {
    const displayColumns = columns ? columns.split(',').map(c => c.trim()) : dataKeys;

    const formatValue = (value: unknown, col: string) => {
        if (value === null || value === undefined) return 'N/A';

        const isCurrencyField = ['price', 'revenue', 'total', 'value', 'amount', 'cost', 'profit', 'lifetime_value'].some(
            term => col.toLowerCase().includes(term)
        );

        if (typeof value === 'number' && isCurrencyField) {
            return `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }

        if (typeof value === 'boolean') {
            return value ? 'Yes' : 'No';
        }

        return String(value);
    };

    return (
        <div className="w-full my-4">
            {title && <h3 className="text-sm font-semibold mb-2 text-gray-700">{title}</h3>}
            <div className="overflow-x-auto border border-gray-300 rounded">
                <table className="min-w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-300">
                            {displayColumns.map(col => (
                                <th key={col} className="px-3 py-2 text-left font-medium text-gray-700 border-r border-gray-300 last:border-r-0">
                                    {col.replace(/_/g, ' ')}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr key={i} className={`border-b border-gray-200 last:border-b-0 ${i % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'}`}>
                                {displayColumns.map(col => (
                                    <td key={col} className="px-3 py-2 text-gray-900 border-r border-gray-200 last:border-r-0">
                                        {formatValue(row[col], col)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="text-xs text-gray-500 mt-1">Showing {data.length} {data.length === 1 ? 'row' : 'rows'}</p>
        </div>
    );
}
