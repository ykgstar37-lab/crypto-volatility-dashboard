import { useState, useEffect } from 'react';
import AppContext from './appContextValue';
import { translations } from '../i18n';

export default function AppProvider({ children }) {
    const [lang, setLang] = useState(() => localStorage.getItem('cv-lang') || 'ko');
    const [dark, setDark] = useState(() => localStorage.getItem('cv-dark') === 'true');
    const [coin, setCoin] = useState('BTC');

    // Persist preferences
    useEffect(() => { localStorage.setItem('cv-lang', lang); }, [lang]);
    useEffect(() => { localStorage.setItem('cv-dark', dark); }, [dark]);

    const t = translations[lang];
    const toggleDark = () => setDark(d => !d);

    return (
        <AppContext.Provider value={{ lang, setLang, dark, toggleDark, coin, setCoin, t }}>
            {children}
        </AppContext.Provider>
    );
}
