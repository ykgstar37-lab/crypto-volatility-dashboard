import { useState, useEffect } from 'react';
import { fetchBriefing } from '../api/client';

const MASCOTS = [
    '/mascot/3._Dude-Photoroom.png',
    '/mascot/3._Dude_1-Photoroom.png',
    '/mascot/3._Dude_2-Photoroom.png',
    '/mascot/3._Dude_3-Photoroom.png',
];

export default function AiMascot({ t = {} }) {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mascotIdx] = useState(() => Math.floor(Math.random() * MASCOTS.length));
    const lang = t.priceTitle === '비트코인 가격' ? 'ko' : 'en';

    const handleClick = () => {
        if (!open && !data) {
            setLoading(true);
            fetchBriefing(lang)
                .then(setData)
                .catch(() => setData(null))
                .finally(() => setLoading(false));
        }
        setOpen(!open);
    };

    useEffect(() => {
        if (open && data) {
            setLoading(true);
            fetchBriefing(lang)
                .then(setData)
                .catch(() => {})
                .finally(() => setLoading(false));
        }
    }, [lang]);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
            {/* Speech bubble - glassmorphism */}
            {open && (
                <div className="w-[420px] relative">
                    {/* Glass card */}
                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 overflow-hidden"
                        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.5) inset' }}>

                        {/* Header */}
                        <div className="px-5 pt-4 pb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <img src={MASCOTS[mascotIdx]} alt="" className="w-8 h-8 object-contain" />
                                <div>
                                    <p className="text-sm font-bold text-gray-800">
                                        {lang === 'ko' ? 'AI 시장 브리핑' : 'AI Market Briefing'}
                                    </p>
                                    <p className="text-[9px] text-gray-400 font-medium">GPT-4o-mini</p>
                                </div>
                            </div>
                            <button onClick={() => setOpen(false)}
                                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition text-sm font-bold">
                                ×
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-5 pb-5 max-h-[420px] overflow-y-auto">
                            {loading ? (
                                <div className="flex items-center gap-2 py-10 justify-center">
                                    <div className="w-5 h-5 border-2 border-gray-200 border-t-[#2b4fcb] rounded-full animate-spin"></div>
                                    <span className="text-sm text-gray-400">
                                        {lang === 'ko' ? '시장을 분석하고 있어요...' : 'Analyzing the market...'}
                                    </span>
                                </div>
                            ) : data?.briefing ? (
                                <>
                                    {/* AI message - speech bubble style */}
                                    <div className="bg-white/80 rounded-2xl rounded-bl-sm p-4 mb-3 border border-gray-100/50 shadow-sm">
                                        {data.briefing.split('\n').filter(l => l.trim()).map((line, i) => {
                                            const isNumbered = /^\d+\./.test(line.trim());
                                            const isRecommend = line.includes('추천') || line.includes('Recommend');
                                            return (
                                                <p key={i} className={`text-[13px] leading-[1.8] mb-1.5 last:mb-0 ${isRecommend ? 'text-[#2b4fcb] font-bold' : isNumbered ? 'text-gray-800' : 'text-gray-600'}`}>
                                                    {isNumbered ? (
                                                        <>
                                                            <span className="text-[#2b4fcb] font-bold">{line.match(/^\d+\./)?.[0]}</span>
                                                            {line.replace(/^\d+\./, '').split(':').map((part, j) =>
                                                                j === 0 ? <span key={j} className="font-semibold text-gray-900">{part}:</span> : <span key={j}>{part}</span>
                                                            )}
                                                        </>
                                                    ) : line}
                                                </p>
                                            );
                                        })}
                                    </div>

                                    {/* Disclaimer */}
                                    <div className="bg-red-50/80 border border-red-200/50 rounded-xl p-3">
                                        <p className="text-[10px] text-red-500 leading-relaxed font-medium">
                                            {data.disclaimer}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <p className="text-sm text-gray-400 py-6 text-center">
                                    {lang === 'ko' ? '브리핑을 불러올 수 없습니다.' : 'Unable to load briefing.'}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Speech bubble tail */}
                    <div className="absolute -bottom-2 right-10">
                        <div className="w-5 h-5 bg-white/70 backdrop-blur-xl border-r border-b border-white/40 rotate-45"
                            style={{ boxShadow: '4px 4px 8px rgba(0,0,0,0.05)' }}></div>
                    </div>
                </div>
            )}

            {/* Mascot character */}
            <button
                onClick={handleClick}
                className="w-28 h-28 hover:scale-110 transition-all duration-300 relative cursor-pointer drop-shadow-lg"
            >
                <img
                    src={MASCOTS[mascotIdx]}
                    alt="AI Assistant"
                    className="w-full h-full object-contain"
                />
                {!open && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
                )}
            </button>
        </div>
    );
}
