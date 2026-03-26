export default function RiskScore({ score = 0, label = 'N/A' }) {
    const getColor = () => {
        if (score < 25) return { bg: 'bg-blue-50', text: 'text-[#2b4fcb]', border: 'border-blue-200', bar: 'bg-[#2b4fcb]' };
        if (score < 50) return { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200', bar: 'bg-yellow-500' };
        if (score < 75) return { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', bar: 'bg-orange-500' };
        return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', bar: 'bg-red-500' };
    };
    const c = getColor();

    return (
        <div className={`rounded-2xl border p-6 shadow-sm h-full flex flex-col items-center justify-center text-center ${c.bg} ${c.border}`}>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Risk Score</span>
            <p className={`text-4xl font-bold mb-1 ${c.text}`}>{score.toFixed(0)}</p>
            <span className={`text-sm font-bold px-3 py-0.5 rounded-md ${c.bg} ${c.text}`}>{label}</span>
            <div className="w-full mt-4 h-2 bg-white/60 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${c.bar}`} style={{ width: `${Math.max(3, score)}%` }}></div>
            </div>
            <div className="w-full flex justify-between mt-1.5 text-[9px] text-gray-400 font-semibold">
                <span>Low</span><span>Moderate</span><span>High</span><span>Extreme</span>
            </div>
        </div>
    );
}
