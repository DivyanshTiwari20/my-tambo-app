"use client";

interface DataTableProps {
    columns?: string[];
    data: any[] | { data: any[]; query?: string; rowCount?: number; executionTime?: number };
    title?: string;
}

export default function DataTable({ columns, data, title }: DataTableProps) {
    // Handle both direct array and wrapped object from query-database tool
    let safeData: any[] = [];

    if (Array.isArray(data)) {
        safeData = data;
    } else if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
        // Extract data from wrapper object
        safeData = data.data;
    } else if (data && typeof data === 'object' && !Array.isArray(data)) {
        // Single object passed, wrap in array
        safeData = [data];
    }

    // Filter out null/empty objects
    safeData = safeData.filter(row => row && Object.keys(row).length > 0);

    // Auto-detect columns if not provided
    const displayColumns = columns && columns.length > 0
        ? columns
        : (safeData.length > 0 ? Object.keys(safeData[0]) : []);

    const formatValue = (value: any, col: string) => {
        if (value === null || value === undefined) return 'N/A';

        // Check if it's a currency field
        const isCurrencyField = ['price', 'revenue', 'total', 'value', 'amount', 'cost', 'profit', 'lifetime_value'].some(
            term => col.toLowerCase().includes(term)
        );

        if (typeof value === 'number' && isCurrencyField) {
            return `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }

        // Format booleans
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
                                <th
                                    key={col}
                                    className="px-3 py-2 text-left font-medium text-gray-700 border-r border-gray-300 last:border-r-0"
                                >
                                    {col.replace(/_/g, ' ')}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {safeData.length === 0 ? (
                            <tr>
                                <td colSpan={displayColumns.length || 1} className="px-3 py-4 text-center text-gray-500 text-sm">
                                    No data found
                                </td>
                            </tr>
                        ) : (
                            safeData.map((row, i) => (
                                <tr key={i} className={`border-b border-gray-200 last:border-b-0 ${i % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'}`}>
                                    {displayColumns.map(col => (
                                        <td
                                            key={col}
                                            className="px-3 py-2 text-gray-900 border-r border-gray-200 last:border-r-0"
                                        >
                                            {formatValue(row[col], col)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <p className="text-xs text-gray-500 mt-1">Showing {safeData.length} {safeData.length === 1 ? 'row' : 'rows'}</p>
        </div>
    );
}