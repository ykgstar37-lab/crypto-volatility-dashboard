import { useState, useEffect, useRef } from 'react';

export default function ApiLog({ logs = [], t = {} }) {
    const [expanded, setExpanded] = useState(false);
    const logRef = useRef(null);

    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div id="log" className="card bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-sm font-bold text-gray-800">{t.apiLogTitle || 'API Debug Log'}</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">{t.apiLogDesc || 'Real-time data collection status'}</p>
                </div>
                <button onClick={() => setExpanded(!expanded)}
                    className="text-[10px] font-semibold text-[#2b4fcb] hover:underline">
                    {expanded ? 'Collapse' : 'Expand'}
                </button>
            </div>
            <div ref={logRef}
                className={`bg-gray-900 rounded-xl p-4 overflow-y-auto font-mono text-xs transition-all ${expanded ? 'max-h-96' : 'max-h-48'}`}>
                {logs.length === 0 ? (
                    <p className="text-gray-500">No logs yet...</p>
                ) : (
                    logs.map((log, i) => (
                        <div key={i} className="flex gap-2 mb-1.5">
                            <span className="text-gray-500 flex-shrink-0">{log.time}</span>
                            <span className={`${log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-green-400' : 'text-blue-300'}`}>
                                {log.type === 'error' ? '✗' : log.type === 'success' ? '✓' : '→'}
                            </span>
                            <span className="text-gray-300">{log.message}</span>
                            {log.data && <span className="text-gray-500">{log.data}</span>}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
