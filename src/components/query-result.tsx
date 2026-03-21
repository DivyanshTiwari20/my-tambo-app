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

                console.log('QueryResult: Starting fetch for table:', table);

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

                console.log('QueryResult: Fetch complete', json);

                if (!res.ok || json.error) {
                    throw new Error(json.error || 'Failed to fetch data');
                }

                setData(json.data || []);
            } catch (err) {
                console.error('QueryResult: Error', err);
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
        return (
            <div className="bg-white p-6 rounded-lg shadow-lg my-4">
                <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-gray-600">Loading {table} data...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-amber-50/50 p-6 rounded-xl shadow-sm my-4 border border-amber-100 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-amber-100/50 text-amber-500 rounded-full flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <h3 className="text-amber-900 font-semibold mb-1">Information Unavailable</h3>
                <p className="text-amber-700/80 text-sm max-w-md">We couldn't fetch what you were looking for. The data might not exist or the table was incorrect. You can ask me what tables are available to explore!</p>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-lg my-4">
                {title && <h3 className="text-lg font-bold mb-4 text-gray-800">{title}</h3>}
                <p className="text-gray-500 text-center">No data found in {table}</p>
            </div>
        );
    }

    // Auto-detect keys for charts
    const dataKeys = Object.keys(data[0] || {});
    const actualXKey = xKey && dataKeys.includes(xKey) ? xKey : dataKeys.find(k => typeof data[0][k] === 'string') || dataKeys[0];
    const actualYKey = yKey && dataKeys.includes(yKey) ? yKey : dataKeys.find(k => typeof data[0][k] === 'number') || dataKeys[1] || dataKeys[0];

    // Process and aggressively aggregate data for charts to fix layout explosions
    let processedData = data.map(item => ({
        ...item,
        [actualYKey]: Number(item[actualYKey]) || 1 // Fallback so we can count
    }));

    if (['bar', 'line', 'pie'].includes(displayType)) {
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
               current[actualYKey] = (current._tambo_count === 1) ? yVal : (current[actualYKey] + yVal);
            }
        });
        
        processedData = Array.from(aggregated.values());
        
        // If original actualYKey was a string/uuid, automatically switch graphing mode to absolute Counts
        if (data.length > 0 && typeof data[0][actualYKey] !== 'number') {
            processedData.forEach(item => {
                item[actualYKey] = item._tambo_count;
            });
        }

        // Clean aesthetic sorting
        if (displayType === 'line' || displayType === 'bar') {
           processedData.sort((a,b) => String(a[actualXKey]).localeCompare(String(b[actualXKey])));
        } else if (displayType === 'pie') {
           processedData.sort((a,b) => Number(b[actualYKey]) - Number(a[actualYKey]));
        }
    }

    console.log('QueryResult: Rendering', { displayType, dataCount: processedData.length, actualXKey, actualYKey });

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
        return (
            <div className="bg-white p-6 rounded-lg shadow-lg my-4">
                {title && <h3 className="text-lg font-bold mb-4 text-gray-800">{title}</h3>}
                <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                        <Pie
                            data={processedData}
                            dataKey={actualYKey}
                            nameKey={actualXKey}
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            label={({ name, value }) => `${name}: ${value}`}
                        >
                            {processedData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
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
            {title && <h3 className="text-lg font-bold mb-3 text-gray-800">{title}</h3>}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gradient-to-r from-blue-500 to-blue-600">
                            <tr>
                                {displayColumns.map(col => (
                                    <th key={col} className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                                        {col.replace(/_/g, ' ')}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.map((row, i) => (
                                <tr key={i} className="hover:bg-blue-50 transition-colors">
                                    {displayColumns.map(col => (
                                        <td key={col} className="px-6 py-4 text-sm text-gray-900 font-medium">
                                            {formatValue(row[col], col)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                        Showing <span className="font-semibold">{data.length}</span> {data.length === 1 ? 'row' : 'rows'}
                    </p>
                </div>
            </div>
        </div>
    );
}
