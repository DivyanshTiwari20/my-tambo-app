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

    // Debug: Log the data to help identify issues
    console.log('DataChart received:', { originalData: data, processedData: safeData, xKey, yKey, type });

    // If no data or empty, show message
    if (safeData.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-lg my-4">
                {title && <h3 className="text-lg font-bold mb-4 text-gray-800">{title}</h3>}
                <div className="flex items-center justify-center h-64 text-gray-500">
                    No data available for chart
                </div>
            </div>
        );
    }

    // Auto-detect keys if provided keys don't exist in data
    const dataKeys = Object.keys(safeData[0] || {});
    const actualXKey = dataKeys.includes(xKey) ? xKey : dataKeys[0] || 'name';
    const actualYKey = dataKeys.includes(yKey) ? yKey : dataKeys.find(k => typeof safeData[0][k] === 'number') || dataKeys[1] || 'value';

    // Ensure numeric values for yKey
    const processedData = safeData.map(item => ({
        ...item,
        [actualYKey]: Number(item[actualYKey]) || 0
    }));

    console.log('DataChart processed:', { processedData, actualXKey, actualYKey });

    if (type === 'pie') {
        return (
            <div className="bg-white p-6 rounded-lg shadow-lg my-4">
                {title && <h3 className="text-lg font-bold mb-4 text-gray-800">{title}</h3>}
                <div className="flex justify-center">
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
                                labelLine={true}
                            >
                                {processedData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [value, actualYKey]} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
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
