import React, { createContext, useContext, useEffect, useState } from 'react';
import { initGA4, initHotjar } from '../lib/analytics';

type ConsentStatus = 'undecided' | 'accepted' | 'essential';

interface AnalyticsContextType {
    consentStatus: ConsentStatus;
    acceptAll: () => void;
    acceptEssential: () => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [consentStatus, setConsentStatus] = useState<ConsentStatus>('undecided');

    useEffect(() => {
        const storedConsent = localStorage.getItem('hanlan_cookie_consent') as ConsentStatus;
        if (storedConsent) {
            setConsentStatus(storedConsent);
            if (storedConsent === 'accepted') {
                loadAnalytics();
            }
        }
    }, []);

    const loadAnalytics = () => {
        // Placeholders - replace with real IDs in actual production
        const GA4_ID = import.meta.env.VITE_GA4_ID || 'G-XXXXXXXXXX';
        const HOTJAR_ID = import.meta.env.VITE_HOTJAR_ID || '1234567';

        initGA4(GA4_ID);
        initHotjar(HOTJAR_ID, 6); // hjsv: 6 is standard
    };

    const acceptAll = () => {
        setConsentStatus('accepted');
        localStorage.setItem('hanlan_cookie_consent', 'accepted');
        loadAnalytics();
    };

    const acceptEssential = () => {
        setConsentStatus('essential');
        localStorage.setItem('hanlan_cookie_consent', 'essential');
    };

    return (
        <AnalyticsContext.Provider value={{ consentStatus, acceptAll, acceptEssential }}>
            {children}
        </AnalyticsContext.Provider>
    );
};

export const useAnalytics = () => {
    const context = useContext(AnalyticsContext);
    if (context === undefined) {
        throw new Error('useAnalytics must be used within an AnalyticsProvider');
    }
    return context;
};
