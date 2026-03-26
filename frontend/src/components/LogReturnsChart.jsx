import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function LogReturnsChart({ data, t = {} }) {
    const sliced = data.slice(-60).map(d => ({
        date: d.date,
        ret: d.log_return ? Number((d.log_return * 100).toFixed(3)) : 0,
    }));

    return (
        <div className="card bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="mb-4">
                <h3 className="text-sm font-bold text-gray-800">{t.logReturnsTitle || 'Daily Log Returns'}</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">{t.logReturnsDesc || 'Last 60 days daily log returns (%)'}</p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
                <BarChart data={sliced}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#9ca3af' }} tickLine={false} axisLine={false} interval={9} />
                    <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={v => `${v}%`} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 12 }} formatter={v => [`${v}%`, 'Return']} />
                    <Bar dataKey="ret" radius={[2, 2, 0, 0]} barSize={6}>
                        {sliced.map((entry, idx) => (
                            <Cell key={idx} fill={entry.ret >= 0 ? '#2b4fcb' : '#ef4444'} opacity={0.8} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
