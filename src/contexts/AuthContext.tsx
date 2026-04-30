import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, type Profile } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
    session: Session | null;
    profile: Profile | null;
    loading: boolean;
    isAdmin: boolean;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    profile: null,
    loading: true,
    isAdmin: false,
    signOut: async () => { },
    refreshProfile: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                if (error.code !== 'PGRST116') throw error;
                // No profile row yet — not an error, just new user
            } else {
                setProfile(data);
            }
        } catch {
            // Profile fetch failed — user proceeds without profile data
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const isDemo = localStorage.getItem("demo_mode") === "true";
        if (isDemo) {
            setSession({ user: { id: 'demo-user' } } as any);
            setProfile({
                id: 'demo-user',
                clinic_id: 'demo-clinic',
                role: 'admin',
                full_name: 'Demo Admin'
            } as any);
            setLoading(false);
            return;
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                fetchProfile(session.user.id);
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // 30-minute inactivity timeout
    useEffect(() => {
        if (!session || localStorage.getItem("demo_mode") === "true") return;

        let timeoutId: NodeJS.Timeout;
        let lastReset = 0;

        const resetTimer = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                signOut();
                alert("Session expired due to 30 minutes of inactivity. Please log in again.");
            }, 30 * 60 * 1000);
        };

        const throttledReset = () => {
            const now = Date.now();
            if (now - lastReset > 5000) {
                resetTimer();
                lastReset = now;
            }
        };

        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        events.forEach(event => document.addEventListener(event, throttledReset));
        resetTimer();

        return () => {
            clearTimeout(timeoutId);
            events.forEach(event => document.removeEventListener(event, throttledReset));
        };
    }, [session]);

    const signOut = async () => {
        setSession(null);
        setProfile(null);
        localStorage.clear();
        sessionStorage.clear();
        await supabase.auth.signOut();
    };

    const refreshProfile = async () => {
        if (session?.user.id) {
            await fetchProfile(session.user.id);
        }
    };

    const isAdmin = profile?.role === 'admin' || profile?.role === 'owner';

    return (
        <AuthContext.Provider value={{ session, profile, loading, isAdmin, signOut, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
