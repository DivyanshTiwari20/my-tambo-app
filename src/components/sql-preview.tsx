"use client";

interface SQLPreviewProps {
    query: string;
    results?: number;
    executionTime?: number;
}

export default function SQLPreview({ query, results = 0, executionTime }: SQLPreviewProps) {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(query);
    };

    return (
        <div className="bg-gray-900 rounded-lg overflow-hidden my-4 shadow-lg">
            <div className="flex justify-between items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center gap-2">
                    <span className="text-green-400 text-sm font-semibold">Generated SQL</span>
                    <span className="text-gray-500 text-xs">•</span>
                    <span className="text-gray-400 text-xs">{results} rows returned</span>
                    {executionTime && (
                        <>
                            <span className="text-gray-500 text-xs">•</span>
                            <span className="text-gray-400 text-xs">{executionTime}ms</span>
                        </>
                    )}
                </div>
                <button
                    onClick={copyToClipboard}
                    className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                >
                    Copy
                </button>
            </div>
            <div className="p-4 overflow-x-auto">
                <code className="text-green-400 font-mono text-sm whitespace-pre-wrap">{query}</code>
            </div>
        </div>
    );
}
