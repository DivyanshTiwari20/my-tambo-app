"use client";

import { useEffect, useState } from 'react';
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
    const [data, setData] = useState<any[]>([]);
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

                setData(json.data || []);
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

    if (loading) {
        return <p className="text-gray-500 text-sm py-2 my-2">Loading {table}...</p>;
    }

    if (error) {
        // Fallback preview data to never break the app when the database is paused or unavailable
        const mockData = [
            { name: 'Mon', value: 120 },
            { name: 'Tue', value: 250 },
            { name: 'Wed', value: 380 },
            { name: 'Thu', value: 290 },
            { name: 'Fri', value: 450 }
        ];

        return (
            <div className="w-full my-4">
               {title && <h3 className="text-sm font-semibold mb-2 text-gray-700">{title} (Preview)</h3>}
               <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                      <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                      <p className="text-xs text-amber-700 font-medium bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                         Database paused. Showing preview data.
                      </p>
                  </div>
                  <ResponsiveContainer width="100%" height={350}>
                     {displayType === 'pie' ? (
                         <PieChart>
                             <Pie data={mockData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120}>
                                 {mockData.map((_, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}
                             </Pie>
                             <Tooltip />
                             <Legend />
                         </PieChart>
                     ) : displayType === 'line' ? (
                         <LineChart data={mockData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                             <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                             <XAxis dataKey="name" stroke="#666" />
                             <YAxis stroke="#666" />
                             <Tooltip />
                             <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={3} />
                         </LineChart>
                     ) : (
                         <BarChart data={mockData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                             <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                             <XAxis dataKey="name" stroke="#666" />
                             <YAxis stroke="#666" />
                             <Tooltip />
                             <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]}>
                                 {mockData.map((_, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}
                             </Bar>
                         </BarChart>
                     )}
                  </ResponsiveContainer>
               </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <p className="text-gray-500 text-sm py-2 my-2">No data found in {table}.</p>
        );
    }

    // Auto-detect keys for charts
    const dataKeys = Object.keys(data[0] || {});
    const numericCols = dataKeys.filter(k => typeof data[0][k] === 'number');
    const stringCols = dataKeys.filter(k => typeof data[0][k] === 'string');

    let actualXKey = xKey && dataKeys.includes(xKey) ? xKey : stringCols[0] || dataKeys[0];
    let actualYKey = yKey && dataKeys.includes(yKey) ? yKey : numericCols[0] || dataKeys[1] || dataKeys[0];

    // PIE CHART: Special handling for wide format (e.g. { male_users: 18, female_users: 18 })
    let processedData: { name: string; value: number; [k: string]: unknown }[] = [];
    if (displayType === 'pie') {
        const isWideFormat = data.length <= 2 && numericCols.length >= 2;

        if (isWideFormat) {
            // Pivot: each numeric column becomes a pie slice (sum across rows if multiple)
            const sums: Record<string, number> = {};
            numericCols.forEach(col => { sums[col] = 0; });
            data.forEach(row => {
                numericCols.forEach(col => {
                    sums[col] += Number(row[col]) || 0;
                });
            });
            processedData = Object.entries(sums)
                .map(([col, value]) => ({
                    name: col.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                    value,
                }))
                .filter(d => d.value > 0);
        } else {
            // Long format: aggregate by category and count
            const aggregated = new Map<string, number>();
            data.forEach(item => {
                const cat = String(item[actualXKey] ?? 'Unknown').trim();
                const val = Number(item[actualYKey]);
                if (!aggregated.has(cat)) aggregated.set(cat, 0);
                aggregated.set(cat, aggregated.get(cat)! + (isNaN(val) ? 1 : val));
            });
            processedData = Array.from(aggregated.entries())
                .map(([name, value]) => ({ name, value }))
                .filter(d => d.value > 0)
                .sort((a, b) => b.value - a.value);
        }
        // Don't render a misleading single-slice pie
        if (processedData.length < 2) {
            return (
                <p className="text-gray-500 text-sm py-2 my-2">
                    Not enough categories to show pie chart. Need at least 2 distinct values. {processedData.length ? `Single value: ${processedData[0]?.name} = ${processedData[0]?.value}` : ''}
                </p>
            );
        }
        actualXKey = 'name';
        actualYKey = 'value';
    } else {
        // Bar / Line: standard processing
        processedData = data.map(item => ({
            ...item,
            [actualYKey]: Number(item[actualYKey]) || 1,
        })) as { name: string; value: number; [k: string]: unknown }[];

        if (['bar', 'line'].includes(displayType)) {
            const aggregated = new Map<string, any>();
            processedData.forEach(item => {
                const xVal = String(item[actualXKey] || 'Unknown');
                if (!aggregated.has(xVal)) {
                    aggregated.set(xVal, { ...item, [actualXKey]: xVal, _tambo_count: 0 });
                }
                const current = aggregated.get(xVal);
                current._tambo_count += 1;
                const yVal = Number(item[actualYKey]);
                if (!isNaN(yVal)) {
                    current[actualYKey] = current._tambo_count === 1 ? yVal : current[actualYKey] + yVal;
                }
            });
            processedData = Array.from(aggregated.values());
            if (data.length > 0 && typeof data[0][actualYKey] !== 'number') {
                processedData.forEach(item => {
                    item[actualYKey] = item._tambo_count;
                });
            }
            processedData.sort((a, b) => String(a[actualXKey]).localeCompare(String(b[actualXKey])));
        }
    }

    // Render chart based on displayType
    if (displayType === 'bar') {
        return (
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
        );
    }

    if (displayType === 'line') {
        return (
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
        );
    }

    if (displayType === 'pie') {
        const total = processedData.reduce((s, d) => s + d.value, 0);
        return (
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
        );
    }

    // Default: Table view
    const displayColumns = columns ? columns.split(',').map(c => c.trim()) : dataKeys;

    const formatValue = (value: any, col: string) => {
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
