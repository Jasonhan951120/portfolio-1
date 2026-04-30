import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useTrafficTracker = () => {
    useEffect(() => {
        const trackTraffic = async () => {
            // Check if we've already tracked this session to avoid duplicates on hot-reload/navigation
            const sessionTracked = sessionStorage.getItem('hanlan_session_tracked');
            if (sessionTracked) return;

            const urlParams = new URLSearchParams(window.location.search);
            const utmSource = urlParams.get('utm_source')?.toLowerCase();
            const utmMedium = urlParams.get('utm_medium');
            const utmCampaign = urlParams.get('utm_campaign');
            const referrer = document.referrer.toLowerCase();

            let source = 'Direct';

            // Classification Logic
            if (utmSource === 'google' || referrer.includes('google.com')) {
                source = 'Google';
            } else if (utmSource === 'ig' || utmSource === 'instagram' || referrer.includes('instagram.com')) {
                source = 'Instagram';
            } else if (utmSource === 'fb' || utmSource === 'facebook' || referrer.includes('facebook.com')) {
                source = 'Facebook';
            } else if (referrer && !referrer.includes(window.location.hostname)) {
                source = 'Referral';
            }

            try {
                const { error } = await supabase
                    .from('traffic_logs')
                    .insert([
                        {
                            source,
                            utm_medium: utmMedium,
                            utm_campaign: utmCampaign,
                            referrer: document.referrer,
                            path: window.location.pathname
                        }
                    ]);

                if (!error) {
                    sessionStorage.setItem('hanlan_session_tracked', 'true');
                } else {
                }
            } catch (err) {
            }
        };

        trackTraffic();
    }, []);
};
