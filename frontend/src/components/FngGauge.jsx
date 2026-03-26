import { useState } from 'react';

const FNG_COMPONENTS = {
    en: [
        { name: 'Volatility', weight: '25%', desc: 'Current BTC volatility vs 30/90 day average', color: '#ef4444' },
        { name: 'Momentum / Volume', weight: '25%', desc: 'Market momentum & trading volume vs averages', color: '#f97316' },
        { name: 'Social Media', weight: '15%', desc: 'Twitter/Reddit sentiment analysis & engagement', color: '#3b82f6' },
        { name: 'Surveys', weight: '15%', desc: 'Investor polling platforms (currently paused)', color: '#8b5cf6' },
        { name: 'BTC Dominance', weight: '10%', desc: 'BTC market cap share — rising = fear (flight to safety)', color: '#eab308' },
        { name: 'Google Trends', weight: '10%', desc: 'Search volume for Bitcoin-related queries', color: '#22c55e' },
    ],
    ko: [
        { name: '변동성', weight: '25%', desc: '현재 BTC 변동성을 30일/90일 평균과 비교', color: '#ef4444' },
        { name: '모멘텀 / 거래량', weight: '25%', desc: '시장 모멘텀과 거래량을 평균과 비교', color: '#f97316' },
        { name: '소셜미디어', weight: '15%', desc: 'Twitter/Reddit 감성 분석 및 상호작용', color: '#3b82f6' },
        { name: '설문조사', weight: '15%', desc: '투자자 설문 플랫폼 (현재 일시 중단)', color: '#8b5cf6' },
        { name: 'BTC 지배력', weight: '10%', desc: 'BTC 시총 점유율 — 상승 시 공포 (안전자산 이동)', color: '#eab308' },
        { name: '구글 트렌드', weight: '10%', desc: 'Bitcoin 관련 검색량 변화', color: '#22c55e' },
    ],
};

export default function FngGauge({ value = 50, label = 'Neutral', change, t = {} }) {
    const [showInfo, setShowInfo] = useState(false);
    const lang = t.priceTitle === '비트코인 가격' ? 'ko' : 'en';
    const components = FNG_COMPONENTS[lang];

    const cx = 100;
    const cy = 90;
    const r = 70;
    const strokeW = 12;
    const gap = 3;

    const getColor = (v) => {
        if (v <= 25) return '#ef4444';
        if (v <= 45) return '#f97316';
        if (v <= 55) return '#eab308';
        if (v <= 75) return '#84cc16';
        return '#22c55e';
    };

    const angleToPoint = (deg) => {
        const rad = (Math.PI * deg) / 180;
        return {
            x: cx + r * Math.cos(Math.PI - rad),
            y: cy - r * Math.sin(Math.PI - rad),
        };
    };

    const segments = [
        { start: 0 + gap, end: 45 - gap, color: '#ef4444', zone: [0, 25] },
        { start: 45 + gap, end: 90 - gap, color: '#f97316', zone: [25, 50] },
        { start: 90 + gap, end: 135 - gap, color: '#eab308', zone: [50, 75] },
        { start: 135 + gap, end: 180 - gap, color: '#22c55e', zone: [75, 100] },
    ];

    const arcPath = (startDeg, endDeg) => {
        const s = angleToPoint(startDeg);
        const e = angleToPoint(endDeg);
        const largeArc = endDeg - startDeg > 180 ? 1 : 0;
        return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
    };

    const needleDeg = (value / 100) * 180;
    const tipX = cx + r * 0.75 * Math.cos(Math.PI - (Math.PI * needleDeg) / 180);
    const tipY = cy - r * 0.75 * Math.sin(Math.PI - (Math.PI * needleDeg) / 180);
    const isActive = (zone) => value >= zone[0] && value <= zone[1];

    return (
        <div className="card bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col items-center justify-center h-full relative">
            {/* Header with info toggle */}
            <div className="self-start mb-4 flex items-center gap-2 w-full">
                <h3 className="text-sm font-bold text-gray-800">{t.fngGaugeTitle || 'Fear & Greed Index'}</h3>
                <button
                    onMouseEnter={() => setShowInfo(true)}
                    onMouseLeave={() => setShowInfo(false)}
                    onClick={() => setShowInfo(!showInfo)}
                    className="w-4 h-4 rounded-full border border-gray-300 text-gray-400 text-[10px] font-bold flex items-center justify-center hover:bg-gray-100 transition cursor-pointer"
                >
                    ?
                </button>
            </div>

            {/* Info dropdown */}
            {showInfo && (
                <div
                    className="absolute top-14 left-4 right-4 bg-white rounded-xl border border-gray-200 shadow-xl z-20 p-4"
                    onMouseEnter={() => setShowInfo(true)}
                    onMouseLeave={() => setShowInfo(false)}
                >
                    <p className="text-[11px] font-bold text-gray-700 mb-3">
                        {lang === 'ko' ? 'FNG 지수 구성 요소 (Alternative.me)' : 'FNG Index Components (Alternative.me)'}
                    </p>
                    <div className="space-y-2.5">
                        {components.map((c, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                                <div className="flex items-center gap-1.5 min-w-[100px]">
                                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.color }}></span>
                                    <span className="text-[11px] font-semibold text-gray-700">{c.name}</span>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 min-w-[32px]">{c.weight}</span>
                                <span className="text-[10px] text-gray-500">{c.desc}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 pt-2 border-t border-gray-100">
                        <p className="text-[9px] text-gray-400 italic">
                            {lang === 'ko'
                                ? '※ Alternative.me가 6가지 지표를 종합해 0~100 점수로 산출. 우리는 이 최종 점수를 API로 수신합니다.'
                                : '※ Alternative.me calculates the 0-100 score from these 6 factors. We receive the final score via their API.'}
                        </p>
                    </div>
                </div>
            )}

            {/* Gauge */}
            <svg width="200" height="115" viewBox="0 0 200 115">
                {segments.map((seg, i) => (
                    <path
                        key={i}
                        d={arcPath(seg.start, seg.end)}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth={strokeW}
                        strokeLinecap="round"
                        opacity={isActive(seg.zone) ? 0.85 : 0.2}
                    />
                ))}
                <line x1={cx} y1={cy} x2={tipX} y2={tipY} stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx={cx} cy={cy} r="5" fill="#1f2937" />
                <circle cx={cx} cy={cy} r="2" fill="#fff" />
            </svg>

            <p className="text-4xl font-bold -mt-1" style={{ color: getColor(value) }}>{value}</p>
            <p className="text-sm font-semibold text-gray-500 mt-0.5">{label}</p>

            {change !== undefined && (
                <span className={`text-[10px] font-bold mt-1 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(1)}
                </span>
            )}

            <div className="flex items-center gap-2.5 mt-4 text-[9px] font-semibold text-gray-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>{t.extremeFear || 'Extreme Fear'}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block"></span>{t.fear || 'Fear'}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500 inline-block"></span>{t.neutral || 'Neutral'}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>{t.greed || 'Greed'}</span>
            </div>
        </div>
    );
}
