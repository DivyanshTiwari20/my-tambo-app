"use client";
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

interface DataChartProps {
    data: any[] | { data: any[]; query?: string; rowCount?: number; executionTime?: number };
    xKey: string;
    yKey: string;
    type?: 'bar' | 'pie' | 'line';
    title?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B9D', '#C9CBCF', '#82ca9d', '#ffc658', '#ff7c43'];

export default function DataChart({ data, xKey, yKey, type = 'bar', title }: DataChartProps) {
    // Handle both direct array and wrapped object from query-database tool
    let safeData: any[] = [];

    if (Array.isArray(data)) {
        safeData = data;
    } else if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as any).data)) {
        // Extract data from wrapper object
        safeData = (data as any).data;
    }

    // Filter out null/empty objects
    safeData = safeData.filter(row => row && Object.keys(row).length > 0);

    if (safeData.length === 0) {
        return <p className="text-gray-500 text-sm py-2 my-2">No data available for chart.</p>;
    }

    const dataKeys = Object.keys(safeData[0] || {});
    const numericCols = dataKeys.filter(k => typeof safeData[0][k] === 'number');
    const stringCols = dataKeys.filter(k => typeof safeData[0][k] === 'string');
    const actualXKey = dataKeys.includes(xKey) ? xKey : stringCols[0] || dataKeys[0] || 'name';
    const actualYKey = dataKeys.includes(yKey) ? yKey : numericCols[0] || dataKeys[1] || 'value';

    let processedData: { name: string; value: number; [k: string]: unknown }[] = safeData.map(item => ({
        ...item,
        [actualYKey]: Number(item[actualYKey]) || 0
    })) as { name: string; value: number; [k: string]: unknown }[];

    if (type === 'pie') {
        const isWideFormat = safeData.length <= 2 && numericCols.length >= 2;
        let pieData: { name: string; value: number }[];
        if (isWideFormat) {
            const sums: Record<string, number> = {};
            numericCols.forEach(col => { sums[col] = 0; });
            safeData.forEach(row => numericCols.forEach(col => { sums[col] += Number(row[col]) || 0; }));
            pieData = Object.entries(sums)
                .map(([col, value]) => ({ name: col.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), value }))
                .filter(d => d.value > 0);
        } else {
            const agg = new Map<string, number>();
            safeData.forEach(item => {
                const cat = String(item[actualXKey] ?? 'Unknown').trim();
                const val = Number(item[actualYKey]);
                agg.set(cat, (agg.get(cat) || 0) + (isNaN(val) ? 1 : val));
            });
            pieData = Array.from(agg.entries()).map(([name, value]) => ({ name, value })).filter(d => d.value > 0).sort((a, b) => b.value - a.value);
        }
        if (pieData.length < 2) {
            return <p className="text-gray-500 text-sm py-2 my-2">Not enough categories for pie chart (need at least 2).</p>;
        }
        const total = pieData.reduce((s, d) => s + d.value, 0);
        return (
            <div className="bg-white p-6 rounded-lg shadow my-4">
                {title && <h3 className="text-lg font-bold mb-4 text-gray-800">{title}</h3>}
                <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120}
                            label={({ name, value }) => `${name}: ${value} (${total ? Math.round((value / total) * 100) : 0}%)`}>
                            {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={(val: number) => [val, '']} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        );
    }

    if (type === 'line') {
        return (
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
        );
    }

    // Default: Bar chart
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
                        {processedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
