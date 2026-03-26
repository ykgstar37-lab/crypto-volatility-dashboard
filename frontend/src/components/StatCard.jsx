export default function StatCard({ label, value, sub, change, icon }) {
    const isPositive = change && change > 0;
    return (
        <div className="card bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-full flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-2 mb-3">
                {icon && <span className="text-2xl opacity-50">{icon}</span>}
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">{value}</p>
            <div className="flex items-center gap-2">
                {change !== undefined && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {isPositive ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
                    </span>
                )}
                {sub && <span className="text-xs text-gray-400">{sub}</span>}
            </div>
        </div>
    );
}
