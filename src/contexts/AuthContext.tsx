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
        console.log('Fetching profile for:', userId);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Profile query error:', error);
                // If the error is 'PGRST116' it means no rows found
                if (error.code === 'PGRST116') {
                    console.log('No profile row exists for this user.');
                }
                throw error;
            }

            console.log('Profile loaded successfully:', data);
            setProfile(data);
        } catch (error: any) {
            console.error('Critical Auth Error:', error);
            // Alert user so we can get feedback on the exact error code/message
            if (error.code !== 'PGRST116') {
                alert(`Auth Error: ${error.message || 'Unknown'}\nCode: ${error.code}`);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Check for Demo Mode bypass
        const isDemo = localStorage.getItem("demo_mode") === "true";
        if (isDemo) {
            setSession({ user: { id: 'demo-user' } } as any);
            setProfile({
                id: 'demo-user',
                clinic_id: '74c99e5e-768e-4154-bd95-5e68b17a7e26',
                role: 'admin',
                full_name: 'Demo Admin'
            } as any);
            setLoading(false);
            return;
        }

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) fetchProfile(session.user.id);
            else setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (localStorage.getItem("demo_mode") === "true") return; // Ignore if in demo
            setSession(session);
            if (session) fetchProfile(session.user.id);
            else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        // Zero-Trace Protocol: Explicitly clear all client-side storage
        localStorage.clear();
        sessionStorage.clear();
        await supabase.auth.signOut();
    };

    // ─────────────────────────────────────────────────────────────────────────
    // ⏰ Inactivity Timeout Logic (30 Minutes)
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!session || localStorage.getItem("demo_mode") === "true") return;

        let timeoutId: NodeJS.Timeout;

        const resetTimer = () => {
            if (timeoutId) clearTimeout(timeoutId);
            // 30 minutes in milliseconds
            timeoutId = setTimeout(() => {
                console.log("Session timed out due to inactivity.");
                signOut();
                alert("Session expired due to 30 minutes of inactivity. Please log in again.");
            }, 30 * 60 * 1000);
        };

        // Events to track activity
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

        // Use a throttled reset to avoid excessive processing
        let lastReset = 0;
        const throttledReset = () => {
            const now = Date.now();
            if (now - lastReset > 5000) { // Reset every 5 seconds at most
                resetTimer();
                lastReset = now;
            }
        };

        events.forEach(event => document.addEventListener(event, throttledReset));
        resetTimer(); // Initial start

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            events.forEach(event => document.removeEventListener(event, throttledReset));
        };
    }, [session]);

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
