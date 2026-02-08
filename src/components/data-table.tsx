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

    // Debug log
    console.log('DataTable received:', { originalData: data, processedData: safeData, columns: displayColumns });

    return (
        <div className="w-full my-4">
            {title && <h3 className="text-lg font-bold mb-3 text-gray-800">{title}</h3>}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gradient-to-r from-blue-500 to-blue-600">
                            <tr>
                                {displayColumns.map(col => (
                                    <th
                                        key={col}
                                        className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider"
                                    >
                                        {col.replace(/_/g, ' ')}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {safeData.length === 0 ? (
                                <tr>
                                    <td colSpan={displayColumns.length || 1} className="px-6 py-8 text-center text-gray-500">
                                        No data found
                                    </td>
                                </tr>
                            ) : (
                                safeData.map((row, i) => (
                                    <tr key={i} className="hover:bg-blue-50 transition-colors">
                                        {displayColumns.map(col => (
                                            <td
                                                key={col}
                                                className="px-6 py-4 text-sm text-gray-900 font-medium"
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
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                        Showing <span className="font-semibold">{safeData.length}</span> {safeData.length === 1 ? 'row' : 'rows'}
                    </p>
                </div>
            </div>
        </div>
    );
}