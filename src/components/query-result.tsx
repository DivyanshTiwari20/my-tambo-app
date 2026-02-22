"use client";

import { useEffect, useState, useMemo } from 'react';
import { getSupabase } from '@/lib/supabase';
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

const VALID_COLUMNS = new Set([
    'id', 'name', 'firm', 'sector', 'stage', 'location',
    'ticket_size', 'portfolio_companies', 'recently_active',
    'linkedin', 'website',
]);

function sanitizeColumns(cols: string | undefined): string {
    if (!cols) return '*';
    const parsed = cols.split(',').map(c => c.trim()).filter(c => VALID_COLUMNS.has(c));
    return parsed.length > 0 ? parsed.join(',') : '*';
}

function aggregateByKey(
    rows: Record<string, unknown>[],
    groupKey: string,
    valueKey?: string,
): { label: string; count: number; sum: number }[] {
    const groups: Record<string, { count: number; sum: number }> = {};

    for (const row of rows) {
        const key = String(row[groupKey] ?? 'Unknown');
        if (!groups[key]) groups[key] = { count: 0, sum: 0 };
        groups[key].count++;
        if (valueKey && typeof row[valueKey] === 'number') {
            groups[key].sum += row[valueKey] as number;
        }
    }

    return Object.entries(groups)
        .map(([label, v]) => ({ label, count: v.count, sum: v.sum }))
        .sort((a, b) => b.count - a.count);
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

    const isChart = displayType === 'bar' || displayType === 'line' || displayType === 'pie';

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const selectCols = isChart ? '*' : sanitizeColumns(columns);
                const fetchLimit = isChart ? 1000 : limit;

                let query = getSupabase().from(table).select(selectCols);

                if (orderBy && VALID_COLUMNS.has(orderBy)) {
                    query = query.order(orderBy, { ascending: orderDirection === 'asc' });
                }

                query = query.limit(fetchLimit);

                if (filter) {
                    const eqIdx = filter.indexOf('=');
                    if (eqIdx > 0) {
                        const column = filter.slice(0, eqIdx).trim();
                        const opValue = filter.slice(eqIdx + 1);
                        const dotIdx = opValue.indexOf('.');

                        if (dotIdx > 0 && VALID_COLUMNS.has(column)) {
                            const operator = opValue.slice(0, dotIdx);
                            const value = opValue.slice(dotIdx + 1);

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

                if (queryError) {
                    throw new Error(queryError.message);
                }

                setData((result as Record<string, unknown>[]) || []);
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
    }, [table, columns, orderBy, orderDirection, limit, filter, isChart]);

    const dataKeys = useMemo(() => Object.keys(data[0] || {}), [data]);

    const chartData = useMemo(() => {
        if (!isChart || data.length === 0) return [];

        const groupKey =
            xKey && dataKeys.includes(xKey)
                ? xKey
                : dataKeys.find(k => typeof data[0][k] === 'string' && k !== 'id') || dataKeys[0];

        const numericKey =
            yKey && dataKeys.includes(yKey) && typeof data[0][yKey] === 'number'
                ? yKey
                : undefined;

        const aggregated = aggregateByKey(data, groupKey, numericKey);

        return aggregated.map(row => ({
            [groupKey]: row.label,
            count: row.count,
            ...(numericKey ? { [numericKey]: row.sum } : {}),
        }));
    }, [data, dataKeys, isChart, xKey, yKey]);

    const resolvedXKey = useMemo(() => {
        if (!isChart || chartData.length === 0) return '';
        const keys = Object.keys(chartData[0]);
        if (xKey && keys.includes(xKey)) return xKey;
        return keys.find(k => k !== 'count') || keys[0];
    }, [chartData, isChart, xKey]);

    const resolvedYKey = useMemo(() => {
        if (!isChart || chartData.length === 0) return 'count';
        if (yKey && Object.keys(chartData[0]).includes(yKey)) return yKey;
        return 'count';
    }, [chartData, isChart, yKey]);

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

    if (displayType === 'bar') {
        return (
            <div className="bg-white p-6 rounded-lg shadow-lg my-4">
                {title && <h3 className="text-lg font-bold mb-4 text-gray-800">{title}</h3>}
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                            dataKey={resolvedXKey}
                            stroke="#666"
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            interval={0}
                            tick={{ fontSize: 11 }}
                        />
                        <YAxis stroke="#666" allowDecimals={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                            formatter={(value) => [Number(value).toLocaleString(), resolvedYKey]}
                        />
                        <Legend />
                        <Bar dataKey={resolvedYKey} fill="#8884d8" radius={[8, 8, 0, 0]}>
                            {chartData.map((_, index) => (
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
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey={resolvedXKey} stroke="#666" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
                        <YAxis stroke="#666" allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey={resolvedYKey} stroke="#8884d8" strokeWidth={3} dot={{ r: 5 }} />
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
                            data={chartData}
                            dataKey={resolvedYKey}
                            nameKey={resolvedXKey}
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            label={({ name, value }) => `${name}: ${value}`}
                        >
                            {chartData.map((_, index) => (
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
    const displayColumns = columns
        ? columns.split(',').map(c => c.trim()).filter(c => VALID_COLUMNS.has(c))
        : dataKeys;

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
