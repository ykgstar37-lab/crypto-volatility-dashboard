import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const PERIODS = [
    { label: '7d', days: 7 },
    { label: '1m', days: 30 },
    { label: '1y', days: 365 },
    { label: 'All', days: 2000 },
];

const ZONES = [
    { y: 75, label: 'Extreme Greed', color: '#22c55e' },
    { y: 50, label: 'Neutral', color: '#eab308' },
    { y: 25, label: 'Fear', color: '#f97316' },
];

export default function FngChart({ data, t = {} }) {
    const [active, setActive] = useState(365);

    const sliced = data.slice(-active);
    const chartData = sliced.map(d => ({
        date: d.date,
        fng: d.fng,
    })).filter(d => d.fng != null);

    return (
        <div className="card bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-sm font-bold text-gray-800">{t.fngChartTitle || 'Fear & Greed Index'}</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">{t.fngChartDesc || 'CMC Crypto Fear & Greed trend'}</p>
                </div>
                <div className="flex gap-0.5 bg-gray-50 rounded-lg p-0.5">
                    {PERIODS.map(p => (
                        <button key={p.days} onClick={() => setActive(p.days)}
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition ${active === p.days ? 'bg-white text-[#2b4fcb] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="fngGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#eab308" stopOpacity={0.1} />
                            <stop offset="100%" stopColor="#eab308" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} width={30} />
                    {ZONES.map(z => (
                        <ReferenceLine key={z.y} y={z.y} stroke={z.color} strokeDasharray="4 4" strokeOpacity={0.4}>
                        </ReferenceLine>
                    ))}
                    <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }} formatter={v => [v, 'FNG']} />
                    <Area type="monotone" dataKey="fng" stroke="#eab308" strokeWidth={1.5} fill="url(#fngGrad)" dot={false} />
                </AreaChart>
            </ResponsiveContainer>
            <div className="flex justify-between mt-2 text-[9px] font-semibold text-gray-400 px-2">
                <span className="text-red-500">0 {t.extremeFear || 'Extreme Fear'}</span>
                <span className="text-orange-500">25 {t.fear || 'Fear'}</span>
                <span className="text-yellow-500">50 {t.neutral || 'Neutral'}</span>
                <span className="text-green-500">75 {t.greed || 'Greed'}</span>
                <span className="text-emerald-600">100 {t.extremeGreed || 'Extreme Greed'}</span>
            </div>
        </div>
    );
}
