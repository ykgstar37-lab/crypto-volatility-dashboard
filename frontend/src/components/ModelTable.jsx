export default function ModelTable({ predictions = [], t = {} }) {
    if (!predictions.length) return null;
    const maxVol = Math.max(...predictions.map(p => p.annualized_vol));

    return (
        <div className="card bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-full flex flex-col">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">{t.modelDetailTitle || 'Model Predictions Detail'}</h3>
            <div className="flex-1 flex flex-col justify-center">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="text-center py-2 px-3 font-semibold text-gray-500">{t.modelCol || 'Model'}</th>
                            <th className="text-center py-2 px-3 font-semibold text-gray-500">{t.dailySigma || 'Daily σ'}</th>
                            <th className="text-center py-2 px-3 font-semibold text-gray-500">{t.annualVol || 'Annualized Vol'}</th>
                            <th className="py-2 px-3 w-24"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {predictions.map((p, i) => {
                            const vol = p.annualized_vol * 100;
                            const barW = maxVol > 0 ? (p.annualized_vol / maxVol) * 100 : 0;
                            return (
                                <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition">
                                    <td className="py-3 px-3 text-center font-semibold text-gray-800">{p.model}</td>
                                    <td className="py-3 px-3 text-center font-mono text-gray-600">{p.sigma.toFixed(6)}</td>
                                    <td className="py-3 px-3 text-center font-mono font-bold text-[#2b4fcb]">{vol.toFixed(2)}%</td>
                                    <td className="py-3 px-3">
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full bg-[#2b4fcb] transition-all duration-500" style={{ width: `${barW}%`, opacity: 0.6 + (barW / 300) }}></div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
