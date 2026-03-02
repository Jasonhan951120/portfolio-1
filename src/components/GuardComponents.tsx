import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { session, profile, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!profile?.clinic_id && location.pathname !== '/admin/onboarding') {
        return <Navigate to="/admin/onboarding" replace />;
    }

    if (profile?.clinic_id && location.pathname === '/admin/onboarding') {
        return <Navigate to="/admin" replace />;
    }

    return <>{children}</>;
};

export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAdmin, loading } = useAuth();

    if (loading) return null;

    if (!isAdmin) {
        return <Navigate to="/admin" replace />;
    }

    return <>{children}</>;
};
