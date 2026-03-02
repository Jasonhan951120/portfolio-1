import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, type Clinic } from '../lib/supabase';
import { Loader2, ShieldAlert } from 'lucide-react';

export const SubscriptionGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { session, profile, loading: authLoading } = useAuth();
    const [subscriptionLoading, setSubscriptionLoading] = useState(true);
    const [clinic, setClinic] = useState<Clinic | null>(null);
    const location = useLocation();

    useEffect(() => {
        const checkSubscription = async () => {
            if (!session || !profile?.clinic_id) {
                setSubscriptionLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('clinics')
                    .select('*')
                    .eq('id', profile.clinic_id)
                    .single();

                if (error) throw error;
                setClinic(data);
            } catch (err) {
                console.error('Error checking subscription:', err);
            } finally {
                setSubscriptionLoading(false);
            }
        };

        if (!authLoading) {
            checkSubscription();
        }
    }, [authLoading, session, profile]);

    if (authLoading || subscriptionLoading) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Verifying Subscription...</p>
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (clinic?.subscription_status !== 'active') {
        return <Navigate to="/pricing" replace />;
    }

    return <>{children}</>;
};
