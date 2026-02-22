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

interface ParsedFilter {
    column: string;
    operator: string;
    value: string;
}

function parseFilters(raw: string | undefined): ParsedFilter[] {
    if (!raw) return [];
    const filters: ParsedFilter[] = [];

    for (const segment of raw.split('&')) {
        const eqIdx = segment.indexOf('=');
        if (eqIdx <= 0) continue;

        const column = segment.slice(0, eqIdx).trim();
        if (!VALID_COLUMNS.has(column)) continue;

        const rest = segment.slice(eqIdx + 1);
        const dotIdx = rest.indexOf('.');
        if (dotIdx <= 0) continue;

        filters.push({
            column,
            operator: rest.slice(0, dotIdx).toLowerCase(),
            value: rest.slice(dotIdx + 1),
        });
    }

    return filters;
}

function coerceValue(value: string, column: string): unknown {
    if (column === 'recently_active' || value === 'true') return true;
    if (value === 'false') return false;
    if (value === 'null') return null;
    const num = Number(value);
    if (!isNaN(num) && value.trim() !== '') return num;
    return value;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyFilters(query: any, filters: ParsedFilter[]) {
    for (const f of filters) {
        try {
            switch (f.operator) {
                case 'eq':
                    query = query.eq(f.column, coerceValue(f.value, f.column));
                    break;
                case 'neq':
                    query = query.neq(f.column, coerceValue(f.value, f.column));
                    break;
                case 'gt':
                    query = query.gt(f.column, Number(f.value));
                    break;
                case 'lt':
                    query = query.lt(f.column, Number(f.value));
                    break;
                case 'gte':
                    query = query.gte(f.column, Number(f.value));
                    break;
                case 'lte':
                    query = query.lte(f.column, Number(f.value));
                    break;
                case 'like':
                    query = query.like(f.column, f.value);
                    break;
                case 'ilike':
                    query = query.ilike(f.column, f.value);
                    break;
                case 'is':
                    query = query.is(f.column, f.value === 'true' ? true : f.value === 'false' ? false : null);
                    break;
                case 'in': {
                    const items = f.value.replace(/^\(|\)$/g, '').split(',').map(v => v.trim());
                    query = query.in(f.column, items);
                    break;
                }
            }
        } catch {
            // skip filter that can't be applied
        }
    }
    return query;
}

function clientSideMatch(row: Record<string, unknown>, filters: ParsedFilter[]): boolean {
    for (const f of filters) {
        const val = row[f.column];
        const strVal = String(val ?? '').toLowerCase();
        const target = f.value.toLowerCase();

        switch (f.operator) {
            case 'eq':
                if (typeof val === 'boolean') {
                    if (val !== (f.value === 'true')) return false;
                } else if (strVal !== target) return false;
                break;
            case 'neq':
                if (strVal === target) return false;
                break;
            case 'ilike':
            case 'like': {
                const pattern = target.replace(/%/g, '.*').replace(/\*/g, '.*');
                if (!new RegExp(pattern, 'i').test(strVal)) return false;
                break;
            }
            case 'gt':
                if (Number(val) <= Number(f.value)) return false;
                break;
            case 'lt':
                if (Number(val) >= Number(f.value)) return false;
                break;
            case 'gte':
                if (Number(val) < Number(f.value)) return false;
                break;
            case 'lte':
                if (Number(val) > Number(f.value)) return false;
                break;
            case 'is':
                if (f.value === 'true' && val !== true) return false;
                if (f.value === 'false' && val !== false) return false;
                if (f.value === 'null' && val !== null) return false;
                break;
        }
    }
    return true;
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

    const isChart = displayType === 'bar' || displayType === 'line' || displayType === 'pie';
    const parsedFilters = useMemo(() => parseFilters(filter), [filter]);

    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
            setLoading(true);

            const selectCols = isChart ? '*' : sanitizeColumns(columns);
            const fetchLimit = isChart ? 1000 : Math.max(limit, 50);

            // Attempt 1: query with all filters applied server-side
            try {
                let query = getSupabase().from(table).select(selectCols);

                if (orderBy && VALID_COLUMNS.has(orderBy)) {
                    query = query.order(orderBy, { ascending: orderDirection === 'asc' });
                }
                query = query.limit(fetchLimit);
                query = applyFilters(query, parsedFilters);

                const { data: result, error: queryError } = await query;
                if (!queryError && result && !cancelled) {
                    setData(result as Record<string, unknown>[]);
                    setLoading(false);
                    return;
                }
            } catch {
                // fall through to fallback
            }

            // Attempt 2: fetch all data unfiltered, filter client-side
            try {
                let query = getSupabase().from(table).select('*');
                if (orderBy && VALID_COLUMNS.has(orderBy)) {
                    query = query.order(orderBy, { ascending: orderDirection === 'asc' });
                }
                query = query.limit(fetchLimit);

                const { data: result } = await query;
                if (!cancelled) {
                    const rows = (result as Record<string, unknown>[]) || [];
                    const filtered = parsedFilters.length > 0
                        ? rows.filter(row => clientSideMatch(row, parsedFilters))
                        : rows;
                    setData(filtered);
                }
            } catch {
                if (!cancelled) setData([]);
            }

            if (!cancelled) setLoading(false);
        };

        if (table) {
            fetchData();
        } else {
            setLoading(false);
        }

        return () => { cancelled = true; };
    }, [table, columns, orderBy, orderDirection, limit, filter, isChart, parsedFilters]);

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
                    <span className="ml-3 text-gray-600">Loading data...</span>
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-lg my-4">
                {title && <h3 className="text-lg font-bold mb-4 text-gray-800">{title}</h3>}
                <p className="text-gray-500 text-center">
                    No matching data found. Try adjusting your query or filters.
                </p>
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

    const safeDisplayColumns = displayColumns.length > 0 ? displayColumns : dataKeys;

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
                                {safeDisplayColumns.map(col => (
                                    <th key={col} className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                                        {col.replace(/_/g, ' ')}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.map((row, i) => (
                                <tr key={i} className="hover:bg-blue-50 transition-colors">
                                    {safeDisplayColumns.map(col => (
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
