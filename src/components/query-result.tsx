"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
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

                // Build query using Supabase client
                let query = supabase.from(table).select(columns || '*');

                // Add ordering
                if (orderBy) {
                    query = query.order(orderBy, { ascending: orderDirection === 'asc' });
                }

                // Add limit
                if (limit) {
                    query = query.limit(limit);
                }

                // Add filter if provided (format: column=eq.value)
                if (filter) {
                    const parts = filter.split('=');
                    if (parts.length === 2) {
                        const column = parts[0];
                        const opValue = parts[1];
                        const opParts = opValue.split('.');
                        if (opParts.length >= 2) {
                            const operator = opParts[0];
                            const value = opParts.slice(1).join('.');

                            if (operator === 'eq') {
                                query = query.eq(column, value === 'true' ? true : value === 'false' ? false : value);
                            } else if (operator === 'gt') {
                                query = query.gt(column, Number(value));
                            } else if (operator === 'lt') {
                                query = query.lt(column, Number(value));
                            } else if (operator === 'gte') {
                                query = query.gte(column, Number(value));
                            } else if (operator === 'lte') {
                                query = query.lte(column, Number(value));
                            }
                        }
                    }
                }

                const { data: result, error: queryError } = await query;

                console.log('QueryResult: Fetch complete', { result, error: queryError });

                if (queryError) {
                    throw new Error(queryError.message);
                }

                setData(result || []);
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
            <div className="bg-red-50 p-6 rounded-lg shadow-lg my-4 border border-red-200">
                <h3 className="text-red-800 font-bold">Error</h3>
                <p className="text-red-600">{error}</p>
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
    const actualYKey = yKey && dataKeys.includes(yKey) ? yKey : dataKeys.find(k => typeof data[0][k] === 'number') || dataKeys[1];

    // Process data for charts (ensure numeric values)
    const processedData = data.map(item => ({
        ...item,
        [actualYKey]: Number(item[actualYKey]) || 0
    }));

    console.log('QueryResult: Rendering', { displayType, dataCount: data.length, actualXKey, actualYKey });

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
