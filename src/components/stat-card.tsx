"use client";

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: string;
}

export default function StatCard({ title, value, subtitle, icon = "📊" }: StatCardProps) {
    return (
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow my-4">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium opacity-90 uppercase tracking-wide">{title}</p>
                    <p className="text-4xl font-bold mt-3">{value}</p>
                    {subtitle && <p className="text-sm opacity-80 mt-2">{subtitle}</p>}
                </div>
                <div className="text-4xl opacity-80">{icon}</div>
            </div>
        </div>
    );
}
