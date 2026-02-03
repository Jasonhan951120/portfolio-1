import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export const AuthForm: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [website, setWebsite] = useState('');
    const [mode, setMode] = useState<'signin' | 'signup'>('signup');
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (mode === 'signup') {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            website_url: website,
                        },
                    },
                });
                if (error) throw error;

                // Auto-login after signup
                if (data.user) {
                    setMessage({ type: 'success', text: 'Account created! Redirecting...' });
                    setTimeout(() => {
                        window.location.href = '/dashboard';
                    }, 1000);
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                window.location.href = '/dashboard';
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-white/80 backdrop-blur-md shadow-soft border border-white/50 animate-fade-in-up">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {mode === 'signup' ? 'Join the Community' : 'Welcome Back'}
                </h2>
                <p className="text-gray-500">
                    {mode === 'signup'
                        ? 'Start your journey to better results.'
                        : 'Access your dedicated dashboard.'}
                </p>
            </div>

            {message && (
                <div className={`p-4 mb-6 rounded-xl text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                    }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleAuth} className="space-y-5">
                {mode === 'signup' && (
                    <>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium placeholder:text-gray-400"
                                placeholder="John Doe"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Website URL</label>
                            <input
                                type="url"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium placeholder:text-gray-400"
                                placeholder="https://your-dental-clinic.com"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                            />
                        </div>
                    </>
                )}

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Email Address</label>
                    <input
                        type="email"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium placeholder:text-gray-400"
                        placeholder="doctor@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Password</label>
                    <input
                        type="password"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium placeholder:text-gray-400"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                >
                    {loading ? 'Processing...' : (mode === 'signup' ? 'Create Account' : 'Sign In')}
                </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500">
                {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
                <button
                    onClick={() => {
                        setMode(mode === 'signup' ? 'signin' : 'signup');
                        setMessage(null);
                    }}
                    className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                    {mode === 'signup' ? 'Sign In' : 'Sign Up'}
                </button>
            </div>
        </div>
    );
};

export default AuthForm;
