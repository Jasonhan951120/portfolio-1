/**
 * UK GDPR Compliant Analytics Injection Utility
 */

declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
        dataLayer?: any[];
        hj?: any;
        _hjSettings?: {
            hjid: number;
            hjsv: number;
        };
    }
}

export const initGA4 = (measurementId: string) => {
    if (typeof window === 'undefined' || window.gtag) return;

    // Insert GTM Script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
        window.dataLayer?.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
        anonymize_ip: true, // UK GDPR Best Practice
        cookie_flags: 'SameSite=None;Secure'
    });
};

export const initHotjar = (hjid: string, hjsv: number) => {
    if (typeof window === 'undefined' || window.hj) return;

    (function (h: any, o: any, t: any, j: any, a: any, r: any) {
        h.hj = h.hj || function () { (h.hj.q = h.hj.q || []).push(arguments) };
        h._hjSettings = { hjid: parseInt(hjid), hjsv: hjsv };
        a = o.getElementsByTagName('head')[0];
        r = o.createElement('script'); r.async = true;
        r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
        a.appendChild(r);
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=', '', '');
};

export const trackEvent = (eventName: string, params?: object) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, params);
    }
};
