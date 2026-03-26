import { useState, useEffect } from 'react';
import { fetchBriefing } from '../api/client';

export default function AiBriefing({ t = {} }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const lang = t.priceTitle === '비트코인 가격' ? 'ko' : 'en';

    useEffect(() => {
        setLoading(true);
        fetchBriefing(lang)
            .then(setData)
            .catch(() => setData(null))
            .finally(() => setLoading(false));
    }, [lang]);

    return (
        <div className="bg-gradient-to-br from-[#2b4fcb] to-[#1b3fab] rounded-2xl p-6 shadow-lg text-white">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🤖</span>
                <div>
                    <h3 className="text-sm font-bold">
                        {lang === 'ko' ? 'AI 오늘의 시장 브리핑' : "AI Today's Market Briefing"}
                    </h3>
                    <p className="text-[10px] text-white/50">Powered by GPT-4o-mini</p>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center gap-2 py-8 justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-sm text-white/60">
                        {lang === 'ko' ? 'AI가 시장을 분석하고 있습니다...' : 'AI is analyzing the market...'}
                    </span>
                </div>
            ) : data?.briefing ? (
                <>
                    <div className="bg-white/10 rounded-xl p-4 mb-4 backdrop-blur-sm">
                        <p className="text-sm leading-relaxed whitespace-pre-line">{data.briefing}</p>
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3">
                        <p className="text-[11px] leading-relaxed text-red-100">
                            {data.disclaimer}
                        </p>
                    </div>
                </>
            ) : (
                <p className="text-sm text-white/50 py-4">
                    {lang === 'ko' ? '브리핑을 불러올 수 없습니다.' : 'Unable to load briefing.'}
                </p>
            )}
        </div>
    );
}
