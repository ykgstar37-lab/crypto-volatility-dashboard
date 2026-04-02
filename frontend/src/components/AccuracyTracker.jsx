import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { fetchVolatilityAccuracy } from '../api/client';

const MODEL_COLORS = {
    'GARCH(1,1)': '#2b4fcb',
    'TGARCH': '#f59e0b',
    'HAR-GARCH': '#ef4444',
};

const MEDAL = ['🥇', '🥈', '🥉'];

export default function AccuracyTracker({ coin = 'BTC', t = {} }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('cumulative'); // 'cumulative' | 'daily'
    const lang = t.priceTitle === '비트코인 가격' ? 'ko' : 'en';

    useEffect(() => {
        setLoading(true);
        fetchVolatilityAccuracy(60, coin)
            .then(setData)
            .catch(() => setData(null))
            .finally(() => setLoading(false));
    }, [coin]);

    if (loading) {
        return (
            <div className="card bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="h-5 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
                <div className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>
            </div>
        );
    }

    if (!data || !data.daily?.length) {
        return (
            <div className="card bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-2">
                    {lang === 'ko' ? '예측 정확도 추이' : 'Prediction Accuracy'}
                </h3>
                <p className="text-xs text-gray-400">{lang === 'ko' ? '데이터 수집 중...' : 'Collecting data...'}</p>
            </div>
        );
    }

    // Prepare chart data
    const chartData = data.daily.map(d => ({
        date: d.date.slice(5), // MM-DD
        fullDate: d.date,
        realized: d.realized,
        ...Object.fromEntries(
            Object.keys(MODEL_COLORS).map(name => {
                if (viewMode === 'cumulative') {
                    return [`${name}`, d[`${name}_cum_rmse`] ?? null];
                }
                return [`${name}`, d[`${name}_error`] ?? null];
            })
        ),
    }));

    return (
        <div className="card bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h3 className="text-sm font-bold text-gray-800">
                        {lang === 'ko' ? '예측 정확도 추이' : 'Prediction Accuracy Tracker'}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {lang === 'ko'
                            ? `${coin} — GARCH 모형별 예측 vs 실현 변동성 정확도`
                            : `${coin} — GARCH model prediction vs realized volatility accuracy`}
                    </p>
                </div>
                <div className="flex bg-gray-50 rounded-lg p-0.5 border border-gray-100">
                    <button onClick={() => setViewMode('cumulative')}
                        className={`px-2.5 py-1 text-[10px] font-semibold rounded-md transition ${viewMode === 'cumulative' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400'}`}>
                        {lang === 'ko' ? '누적 RMSE' : 'Cumulative'}
                    </button>
                    <button onClick={() => setViewMode('daily')}
                        className={`px-2.5 py-1 text-[10px] font-semibold rounded-md transition ${viewMode === 'daily' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400'}`}>
                        {lang === 'ko' ? '일별 오차' : 'Daily Error'}
                    </button>
                </div>
            </div>

            {/* Model ranking cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {data.models.map((m, idx) => (
                    <div key={m.model} className={`rounded-xl p-3 border ${idx === 0 ? 'border-[#2b4fcb]/30 bg-[#2b4fcb]/5' : 'border-gray-100 bg-gray-50'}`}>
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-sm">{MEDAL[idx] || `#${idx + 1}`}</span>
                            <span className="text-xs font-bold text-gray-700">{m.model}</span>
                        </div>
                        <p className="text-lg font-bold" style={{ color: MODEL_COLORS[m.model] || '#666' }}>
                            {m.rmse.toFixed(4)}
                        </p>
                        <p className="text-[10px] text-gray-400">
                            RMSE · {m.samples} {lang === 'ko' ? '일' : 'days'}
                        </p>
                    </div>
                ))}
            </div>

            {/* Chart */}
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 10, fill: '#999' }}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            tick={{ fontSize: 10, fill: '#999' }}
                            label={{
                                value: viewMode === 'cumulative' ? 'RMSE' : (lang === 'ko' ? '오차 (%)' : 'Error (%)'),
                                angle: -90,
                                position: 'insideLeft',
                                offset: 20,
                                style: { fontSize: 10, fill: '#999' },
                            }}
                        />
                        <Tooltip
                            contentStyle={{ fontSize: 11, borderRadius: 12, border: '1px solid #eee' }}
                            formatter={(value, name) => [
                                value !== null ? value.toFixed(4) : '—',
                                name,
                            ]}
                            labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDate || label}
                        />
                        <Legend
                            wrapperStyle={{ fontSize: 10, paddingTop: 8 }}
                        />
                        {Object.entries(MODEL_COLORS).map(([name, color]) => (
                            <Line
                                key={name}
                                type="monotone"
                                dataKey={name}
                                stroke={color}
                                strokeWidth={2}
                                dot={false}
                                connectNulls
                                isAnimationActive={false}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Footer note */}
            <p className="text-[9px] text-gray-300 mt-4 text-center">
                {lang === 'ko'
                    ? `기반: ${data.daily.length}일 롤링 예측 (최근 ${data.daily.length}일)`
                    : `Based on ${data.daily.length}-day rolling predictions`}
            </p>
        </div>
    );
}
