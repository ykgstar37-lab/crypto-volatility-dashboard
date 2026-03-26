export default function ReportDownload({ price, volatility, t = {} }) {
    const lang = t.priceTitle === '비트코인 가격' ? 'ko' : 'en';

    const generateReport = () => {
        const now = new Date().toISOString().split('T')[0];
        let report = '';

        if (lang === 'ko') {
            report += `=== CryptoVol 대시보드 리포트 ===\n`;
            report += `생성일: ${now}\n\n`;
            report += `[비트코인 현황]\n`;
            report += `가격: $${price?.price?.toLocaleString() || 'N/A'}\n`;
            report += `24시간 변동: ${price?.change_24h?.toFixed(2) || 'N/A'}%\n`;
            report += `거래량: $${price?.volume_24h ? (price.volume_24h / 1e9).toFixed(2) + 'B' : 'N/A'}\n`;
            report += `공포탐욕지수: ${price?.fng || 'N/A'} (${price?.fng_label || ''})\n\n`;
            report += `[변동성 예측]\n`;
            report += `위험도 점수: ${volatility?.risk_score?.toFixed(1) || 'N/A'} (${volatility?.risk_label || ''})\n\n`;
            if (volatility?.predictions) {
                report += `모형\t\t\t일별 σ\t\t연간화 변동성\n`;
                report += `${'─'.repeat(60)}\n`;
                volatility.predictions.forEach(p => {
                    report += `${p.model.padEnd(16)}${p.sigma.toFixed(6)}\t\t${(p.annualized_vol * 100).toFixed(2)}%\n`;
                });
            }
            report += `\n※ 본 리포트는 GARCH 모형 분석 기반이며, 투자 권유가 아닙니다.\n`;
        } else {
            report += `=== CryptoVol Dashboard Report ===\n`;
            report += `Date: ${now}\n\n`;
            report += `[Bitcoin Status]\n`;
            report += `Price: $${price?.price?.toLocaleString() || 'N/A'}\n`;
            report += `24h Change: ${price?.change_24h?.toFixed(2) || 'N/A'}%\n`;
            report += `Volume: $${price?.volume_24h ? (price.volume_24h / 1e9).toFixed(2) + 'B' : 'N/A'}\n`;
            report += `FNG Index: ${price?.fng || 'N/A'} (${price?.fng_label || ''})\n\n`;
            report += `[Volatility Predictions]\n`;
            report += `Risk Score: ${volatility?.risk_score?.toFixed(1) || 'N/A'} (${volatility?.risk_label || ''})\n\n`;
            if (volatility?.predictions) {
                report += `Model\t\t\tDaily σ\t\tAnnualized Vol\n`;
                report += `${'─'.repeat(60)}\n`;
                volatility.predictions.forEach(p => {
                    report += `${p.model.padEnd(16)}${p.sigma.toFixed(6)}\t\t${(p.annualized_vol * 100).toFixed(2)}%\n`;
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
    };

    return (
        <button onClick={generateReport}
            className="card bg-white rounded-2xl border border-gray-100 p-5 shadow-sm h-full flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition cursor-pointer">
            <span className="text-2xl">📄</span>
            <span className="text-sm font-bold text-gray-800">
                {lang === 'ko' ? '리포트 다운로드' : 'Download Report'}
            </span>
            <span className="text-[10px] text-gray-400">
                {lang === 'ko' ? '현재 대시보드 상태를 텍스트로 저장' : 'Save current dashboard state as text'}
            </span>
        </button>
    );
}
