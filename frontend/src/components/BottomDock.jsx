import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';
const PRIMARY = '#2b4fcb';

/* ─── Glass style ─── */
const glassLight = 'bg-white/60 backdrop-blur-xl border border-white/30 shadow-2xl';
const glassDark = 'bg-gray-900/50 backdrop-blur-xl border border-gray-700/30 shadow-2xl';

/* ─── SVG Icons ─── */
const icons = {
    accuracy: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    ),
    eth: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L5.5 12.5 12 16l6.5-3.5L12 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 13.5L12 22l6.5-8.5L12 17l-6.5-3.5z" />
        </svg>
    ),
    alert: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
    ),
    report: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
};

/* ─── Popup: Signal Accuracy ─── */
function PopupSignalAccuracy({ dark, lang, onClose }) {
    const [data, setData] = useState(null);
    useEffect(() => {
        axios.get(`${API_BASE}/api/signal/accuracy`).then(r => setData(r.data)).catch(() => {});
    }, []);

    return (
        <div className={`rounded-2xl p-5 w-72 ${dark ? glassDark : glassLight}`}>
            <div className="flex items-center justify-between mb-4">
                <span className={`text-sm font-bold ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
                    {lang === 'ko' ? '시그널 적중률' : 'Signal Accuracy'}
                </span>
                <button onClick={onClose} className={`w-6 h-6 rounded-full flex items-center justify-center transition ${dark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-black/5 text-gray-400'}`}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            {data && data.total > 0 ? (
                <>
                    <div className="text-center mb-4">
                        <p className="text-4xl font-bold" style={{ color: PRIMARY }}>{data.accuracy}%</p>
                        <p className={`text-xs mt-1.5 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{data.correct}/{data.total} {lang === 'ko' ? '적중' : 'correct'}</p>
                    </div>
                    <div className="flex gap-[3px] justify-center flex-wrap">
                        {data.history.map((h, i) => (
                            <div key={i} className={`w-3 h-3 rounded-sm transition-transform hover:scale-125 ${h.correct ? 'bg-[#2b4fcb]' : 'bg-red-400'}`}
                                title={`${h.date}: ${h.signal} → ${h.actual_7d > 0 ? '+' : ''}${h.actual_7d}%`} />
                        ))}
                    </div>
                    <div className="flex justify-center gap-4 mt-3">
                        <span className={`flex items-center gap-1.5 text-[10px] ${dark ? 'text-gray-400' : 'text-gray-400'}`}>
                            <span className="w-2.5 h-2.5 rounded-sm bg-[#2b4fcb]" />{lang === 'ko' ? '적중' : 'Correct'}
                        </span>
                        <span className={`flex items-center gap-1.5 text-[10px] ${dark ? 'text-gray-400' : 'text-gray-400'}`}>
                            <span className="w-2.5 h-2.5 rounded-sm bg-red-400" />{lang === 'ko' ? '미적중' : 'Wrong'}
                        </span>
                    </div>
                </>
            ) : (
                <div className="text-center py-6">
                    <p className="text-3xl font-bold" style={{ color: PRIMARY }}>—</p>
                    <p className={`text-xs mt-2 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {lang === 'ko' ? '데이터 수집 중...' : 'Collecting data...'}
                    </p>
                </div>
            )}
        </div>
    );
}

/* ─── Popup: ETH Price ─── */
function PopupEthPrice({ dark, lang, ethPrice, onClose }) {
    const ethChange = ethPrice?.usd_24h_change;
    const isPositive = ethChange && ethChange > 0;
    return (
        <div className={`rounded-2xl p-5 w-64 ${dark ? glassDark : glassLight}`}>
            <div className="flex items-center justify-between mb-4">
                <span className={`text-sm font-bold ${dark ? 'text-gray-200' : 'text-gray-800'}`}>Ethereum</span>
                <button onClick={onClose} className={`w-6 h-6 rounded-full flex items-center justify-center transition ${dark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-black/5 text-gray-400'}`}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            <div className="text-center py-2">
                <p className={`text-3xl font-bold ${dark ? 'text-gray-100' : 'text-gray-900'}`}>
                    {ethPrice ? `$${ethPrice.usd?.toLocaleString()}` : '—'}
                </p>
                {ethChange !== undefined && (
                    <span className={`inline-block mt-3 text-xs font-bold px-3 py-1 rounded-lg ${isPositive ? 'bg-green-500/15 text-green-500' : 'bg-red-500/15 text-red-500'}`}>
                        {isPositive ? '▲' : '▼'} {Math.abs(ethChange).toFixed(2)}%
                        <span className={`ml-1.5 font-normal ${dark ? 'text-gray-500' : 'text-gray-400'}`}>24h</span>
                    </span>
                )}
            </div>
        </div>
    );
}

/* ─── Popup: Price Alert ─── */
function PopupPriceAlert({ dark, lang, currentPrice, onClose, addToast }) {
    const [enabled, setEnabled] = useState(false);
    const [threshold, setThreshold] = useState('');
    const [direction, setDirection] = useState('below');
    const prevPrice = useRef(currentPrice);

    const enableAlert = () => {
        if (!threshold) return;
        setEnabled(true);
        if (addToast) {
            addToast({
                type: 'success',
                title: lang === 'ko' ? '알림 설정 완료' : 'Alert Set',
                message: lang === 'ko'
                    ? `BTC $${Number(threshold).toLocaleString()} ${direction === 'below' ? '이하 하락' : '이상 상승'} 시 알림`
                    : `Alert when BTC ${direction === 'below' ? 'drops below' : 'rises above'} $${Number(threshold).toLocaleString()}`,
            });
        }
    };

    useEffect(() => {
        if (!enabled || !threshold || !currentPrice) return;
        const target = parseFloat(threshold);
        if (isNaN(target)) return;
        const triggered = direction === 'below'
            ? currentPrice <= target && prevPrice.current > target
            : currentPrice >= target && prevPrice.current < target;
        if (triggered && addToast) {
            addToast({
                type: 'alert',
                title: lang === 'ko' ? 'BTC 가격 알림' : 'BTC Price Alert',
                message: direction === 'below'
                    ? (lang === 'ko'
                        ? `BTC가 $${currentPrice.toLocaleString()}로 하락 (기준: $${target.toLocaleString()})`
                        : `BTC dropped to $${currentPrice.toLocaleString()} (threshold: $${target.toLocaleString()})`)
                    : (lang === 'ko'
                        ? `BTC가 $${currentPrice.toLocaleString()}로 상승 (기준: $${target.toLocaleString()})`
                        : `BTC rose to $${currentPrice.toLocaleString()} (threshold: $${target.toLocaleString()})`),
                duration: 8000,
            });
        }
        prevPrice.current = currentPrice;
    }, [currentPrice, enabled, threshold, direction, addToast, lang]);

    const testAlert = () => {
        if (addToast) {
            addToast({
                type: 'alert',
                title: lang === 'ko' ? 'BTC 가격 알림 (테스트)' : 'BTC Price Alert (Test)',
                message: lang === 'ko'
                    ? `BTC $${(currentPrice || 87445).toLocaleString()} → 설정 가격 $${Number(threshold || 65000).toLocaleString()} ${direction === 'below' ? '하락 돌파' : '상승 돌파'}`
                    : `BTC $${(currentPrice || 87445).toLocaleString()} → crossed $${Number(threshold || 65000).toLocaleString()} ${direction === 'below' ? 'downward' : 'upward'}`,
                duration: 6000,
            });
        }
    };

    return (
        <div className={`rounded-2xl p-5 w-72 ${dark ? glassDark : glassLight}`}>
            <div className="flex items-center justify-between mb-4">
                <span className={`text-sm font-bold ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
                    {lang === 'ko' ? '가격 알림' : 'Price Alert'}
                </span>
                <button onClick={onClose} className={`w-6 h-6 rounded-full flex items-center justify-center transition ${dark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-black/5 text-gray-400'}`}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            <div className="flex gap-2 mb-3">
                <select value={direction} onChange={e => setDirection(e.target.value)}
                    className={`px-2.5 py-2 text-xs border rounded-xl transition ${
                        dark ? 'bg-white/10 border-white/20 text-gray-200' : 'bg-white/80 border-gray-200 text-gray-700'
                    }`}>
                    <option value="below">{lang === 'ko' ? '이하로 하락 시' : 'Drops below'}</option>
                    <option value="above">{lang === 'ko' ? '이상으로 상승 시' : 'Rises above'}</option>
                </select>
                <input type="number" value={threshold} onChange={e => setThreshold(e.target.value)}
                    placeholder="$65,000"
                    className={`flex-1 min-w-0 px-3 py-2 text-xs border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2b4fcb] transition ${
                        dark ? 'bg-white/10 border-white/20 text-gray-200 placeholder-gray-500' : 'bg-white/80 border-gray-200 text-gray-700'
                    }`} />
            </div>
            <div className="flex gap-2">
                <button onClick={enableAlert}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
                        enabled ? 'bg-[#2b4fcb] text-white' : dark ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}>
                    {enabled
                        ? `✓ ${lang === 'ko' ? '활성화됨' : 'Active'}`
                        : (lang === 'ko' ? '알림 활성화' : 'Enable')}
                </button>
                <button onClick={testAlert}
                    className={`px-3 py-2.5 text-xs rounded-xl border transition ${
                        dark ? 'border-white/20 text-gray-400 hover:bg-white/10' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                    title={lang === 'ko' ? '테스트' : 'Test'}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

/* ─── Popup: Report Download ─── */
function PopupReportDownload({ dark, lang, price, volatility, onClose }) {
    const generateReport = () => {
        const now = new Date().toISOString().split('T')[0];
        let report = '';
        if (lang === 'ko') {
            report += `=== CryptoVol 대시보드 리포트 ===\n생성일: ${now}\n\n`;
            report += `[비트코인 현황]\n가격: $${price?.price?.toLocaleString() || 'N/A'}\n`;
            report += `24시간 변동: ${price?.change_24h?.toFixed(2) || 'N/A'}%\n`;
            report += `거래량: $${price?.volume_24h ? (price.volume_24h / 1e9).toFixed(2) + 'B' : 'N/A'}\n`;
            report += `공포탐욕지수: ${price?.fng || 'N/A'} (${price?.fng_label || ''})\n\n`;
            if (volatility?.predictions) {
                report += `[변동성 예측]\n위험도 점수: ${volatility?.risk_score?.toFixed(1) || 'N/A'}\n\n`;
                volatility.predictions.forEach(p => {
                    report += `${p.model}: σ=${p.sigma.toFixed(6)}, 연간화=${(p.annualized_vol * 100).toFixed(2)}%\n`;
                });
            }
            report += `\n※ 본 리포트는 GARCH 모형 분석 기반이며, 투자 권유가 아닙니다.\n`;
        } else {
            report += `=== CryptoVol Dashboard Report ===\nDate: ${now}\n\n`;
            report += `[Bitcoin Status]\nPrice: $${price?.price?.toLocaleString() || 'N/A'}\n`;
            report += `24h Change: ${price?.change_24h?.toFixed(2) || 'N/A'}%\n`;
            report += `Volume: $${price?.volume_24h ? (price.volume_24h / 1e9).toFixed(2) + 'B' : 'N/A'}\n`;
            report += `FNG Index: ${price?.fng || 'N/A'} (${price?.fng_label || ''})\n\n`;
            if (volatility?.predictions) {
                report += `[Volatility Predictions]\nRisk Score: ${volatility?.risk_score?.toFixed(1) || 'N/A'}\n\n`;
                volatility.predictions.forEach(p => {
                    report += `${p.model}: σ=${p.sigma.toFixed(6)}, annualized=${(p.annualized_vol * 100).toFixed(2)}%\n`;
                });
            }
            report += `\n※ This report is based on GARCH model analysis and is not financial advice.\n`;
        }
        const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cryptovol-report-${now}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        onClose();
    };

    return (
        <div className={`rounded-2xl p-5 w-72 ${dark ? glassDark : glassLight}`}>
            <div className="flex items-center justify-between mb-4">
                <span className={`text-sm font-bold ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
                    {lang === 'ko' ? '리포트 다운로드' : 'Download Report'}
                </span>
                <button onClick={onClose} className={`w-6 h-6 rounded-full flex items-center justify-center transition ${dark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-black/5 text-gray-400'}`}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            <p className={`text-xs mb-4 leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                {lang === 'ko' ? '현재 대시보드의 BTC 시세, 변동성 예측, FNG 지수 등을 텍스트 파일로 저장합니다.' : 'Export current BTC price, volatility predictions, and FNG index as a text file.'}
            </p>
            <button onClick={generateReport}
                className="w-full py-2.5 text-xs font-bold rounded-xl text-white transition hover:opacity-90 active:scale-[0.98]"
                style={{ backgroundColor: PRIMARY }}>
                {lang === 'ko' ? '다운로드' : 'Download'}
            </button>
        </div>
    );
}

/* ══════════════════════════════════════════
   BottomDock — floating dock bar at bottom
   ══════════════════════════════════════════ */

export default function BottomDock({ dark, ethPrice, price, volatility, t = {}, addToast }) {
    const [activePopup, setActivePopup] = useState(null);
    const [hoveredId, setHoveredId] = useState(null);
    const dockRef = useRef(null);

    const lang = t.priceTitle === '비트코인 가격' ? 'ko' : 'en';

    const togglePopup = (id) => setActivePopup(prev => prev === id ? null : id);

    // Close popup on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (dockRef.current && !dockRef.current.contains(e.target)) {
                setActivePopup(null);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const dockItems = [
        { id: 'accuracy', icon: icons.accuracy, label: lang === 'ko' ? '적중률' : 'Accuracy', color: '#2b4fcb' },
        { id: 'eth', icon: icons.eth, label: 'ETH', color: '#627eea' },
        { id: 'alert', icon: icons.alert, label: lang === 'ko' ? '알림' : 'Alert', color: '#f59e0b' },
        { id: 'report', icon: icons.report, label: lang === 'ko' ? '리포트' : 'Report', color: '#8b5cf6' },
    ];

    const renderPopup = () => {
        const close = () => setActivePopup(null);
        switch (activePopup) {
            case 'accuracy': return <PopupSignalAccuracy dark={dark} lang={lang} onClose={close} />;
            case 'eth': return <PopupEthPrice dark={dark} lang={lang} ethPrice={ethPrice} onClose={close} />;
            case 'alert': return <PopupPriceAlert dark={dark} lang={lang} currentPrice={price?.price} onClose={close} addToast={addToast} />;
            case 'report': return <PopupReportDownload dark={dark} lang={lang} price={price} volatility={volatility} onClose={close} />;
            default: return null;
        }
    };

    return (
        <div ref={dockRef} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center lg:left-[calc(50%+7rem)]">
            {/* Popup - appears above dock */}
            {activePopup && (
                <div className="mb-3 animate-[fadeUp_0.2s_ease-out]">
                    {renderPopup()}
                </div>
            )}

            {/* Dock bar */}
            <div className={`rounded-2xl px-2 py-2 flex items-center gap-1 ${dark ? glassDark : glassLight}`}>
                {dockItems.map(item => (
                    <div key={item.id} className="relative">
                        {/* Hover tooltip */}
                        {hoveredId === item.id && !activePopup && (
                            <div className={`absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap animate-[fadeUp_0.15s_ease-out] ${
                                dark ? 'bg-gray-800/90 text-gray-200' : 'bg-gray-800/80 text-white'
                            }`}>
                                {item.label}
                            </div>
                        )}
                        <button
                            onClick={() => togglePopup(item.id)}
                            onMouseEnter={() => setHoveredId(item.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                                activePopup === item.id
                                    ? 'scale-110 shadow-lg'
                                    : 'hover:scale-110'
                            }`}
                            style={{
                                backgroundColor: activePopup === item.id
                                    ? `${item.color}20`
                                    : 'transparent',
                                color: activePopup === item.id
                                    ? item.color
                                    : dark ? '#9ca3af' : '#6b7280',
                            }}
                        >
                            {item.icon}
                        </button>
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
