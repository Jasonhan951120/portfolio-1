import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Settings, Save, X } from 'lucide-react';

export const Dashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);

    // Data state
    const [metrics, setMetrics] = useState({
        goal: '',
        income: '',
        clients_count: 0
    });
    const [bookings, setBookings] = useState<any[]>([]);

    // Fetch user and data
    useEffect(() => {
        async function getData() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    window.location.href = '/login';
                    return;
                }
                setUser(user);

                const { data, error } = await supabase
                    .from('profiles')
                    .select('goal, income, clients_count, is_admin')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    // Check if user is admin
                    if (!data.is_admin) {
                        alert('Access Denied: Admin privileges required to view this page.');
                        window.location.href = '/';
                        return;
                    }

                    setMetrics({
                        goal: data.goal || 'Set a goal...',
                        income: data.income || '$0',
                        clients_count: data.clients_count || 0
                    });
                }

                // Fetch bookings
                const { data: bookingsData, error: bookingsError } = await supabase
                    .from('bookings')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (bookingsData) {
                    setBookings(bookingsData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }
        getData();
    }, []);

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    goal: metrics.goal,
                    income: metrics.income,
                    clients_count: metrics.clients_count
                })
                .eq('id', user.id);

            if (error) throw error;
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profiles:', error);
            alert('Failed to save changes!');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (bookingId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'pending' ? 'confirmed' : 'pending';

        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status: newStatus })
                .eq('id', bookingId);

            if (error) throw error;

            // Update local state
            setBookings(bookings.map(booking =>
                booking.id === bookingId
                    ? { ...booking, status: newStatus }
                    : booking
            ));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status!');
        }
    };

    if (loading && !user) {
        return <div className="min-h-screen flex items-center justify-center bg-page"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
    }

    return (
        <div className="min-h-screen bg-page pt-28 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 animate-fade-in-up">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">
                            Welcome back, <span className="text-blue-500">{user?.user_metadata?.full_name || 'Doctor'}</span>
                        </h1>
                        <p className="mt-2 text-xl text-gray-500">
                            Here's what's happening with your clinic today.
                        </p>
                    </div>
                    <button
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className={`mt-4 md:mt-0 flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-md ${isEditing
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        {isEditing ? <><Save size={20} /> Save Changes</> : <><Settings size={20} /> Edit Dashboard</>}
                    </button>
                    {isEditing && (
                        <button
                            onClick={() => setIsEditing(false)}
                            className="md:ml-2 mt-2 md:mt-0 px-4 py-3 rounded-xl bg-gray-200 text-gray-600 font-bold hover:bg-gray-300 transition-all"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 animate-fade-in-up delay-100">
                    {/* Goal Widget */}
                    <div className="bg-white rounded-2xl p-8 shadow-soft border border-gray-100 relative overflow-hidden group hover:shadow-lg transition-all">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 transform translate-x-8 -translate-y-8"></div>
                        <h3 className="text-lg font-semibold text-gray-500 mb-2 relative z-10">Current Goal</h3>
                        <div className="flex items-baseline relative z-10 w-full">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={metrics.goal}
                                    onChange={(e) => setMetrics({ ...metrics, goal: e.target.value })}
                                    className="w-full text-2xl font-bold text-gray-900 border-b-2 border-blue-200 focus:border-blue-500 outline-none bg-transparent py-1"
                                />
                            ) : (
                                <span className="text-3xl font-bold text-gray-900">{metrics.goal}</span>
                            )}
                        </div>
                        <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-400 w-2/3 rounded-full"></div>
                        </div>
                    </div>

                    {/* Income Widget */}
                    <div className="bg-white rounded-2xl p-8 shadow-soft border border-gray-100 relative overflow-hidden group hover:shadow-lg transition-all">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 transform translate-x-8 -translate-y-8"></div>
                        <h3 className="text-lg font-semibold text-gray-500 mb-2 relative z-10">Total Income</h3>
                        <div className="flex items-baseline relative z-10 w-full">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={metrics.income}
                                    onChange={(e) => setMetrics({ ...metrics, income: e.target.value })}
                                    className="w-full text-3xl font-bold text-blue-600 border-b-2 border-blue-200 focus:border-blue-500 outline-none bg-transparent py-1"
                                />
                            ) : (
                                <span className="text-4xl font-bold text-blue-600">{metrics.income}</span>
                            )}
                        </div>
                    </div>

                    {/* Clients Widget */}
                    <div className="bg-white rounded-2xl p-8 shadow-soft border border-gray-100 relative overflow-hidden group hover:shadow-lg transition-all">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 transform translate-x-8 -translate-y-8"></div>
                        <h3 className="text-lg font-semibold text-gray-500 mb-2 relative z-10">Active Clients</h3>
                        <div className="flex items-baseline relative z-10 w-full">
                            {isEditing ? (
                                <input
                                    type="number"
                                    value={metrics.clients_count}
                                    onChange={(e) => setMetrics({ ...metrics, clients_count: parseInt(e.target.value) || 0 })}
                                    className="w-full text-3xl font-bold text-gray-900 border-b-2 border-blue-200 focus:border-blue-500 outline-none bg-transparent py-1"
                                />
                            ) : (
                                <span className="text-4xl font-bold text-gray-900">{metrics.clients_count}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bookings List */}
                <div className="bg-white rounded-2xl p-8 shadow-soft border border-gray-100 animate-fade-in-up delay-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Bookings</h3>

                    {bookings.length === 0 ? (
                        <div className="text-center text-gray-400 py-12">
                            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-lg font-medium">No bookings yet</p>
                            <p className="text-sm mt-2">Bookings will appear here when customers submit the form</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Treatment</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Preferred Date</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Submitted</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((booking) => (
                                        <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-4 font-medium text-gray-900">{booking.name}</td>
                                            <td className="py-4 px-4 text-gray-600">{booking.phone}</td>
                                            <td className="py-4 px-4 text-gray-600">{booking.treatment}</td>
                                            <td className="py-4 px-4 text-gray-600">
                                                {new Date(booking.preferred_date).toLocaleDateString('ko-KR')}
                                            </td>
                                            <td className="py-4 px-4">
                                                <button
                                                    onClick={() => handleStatusChange(booking.id, booking.status)}
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all hover:opacity-80 cursor-pointer ${booking.status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                                                        }`}
                                                    title="Click to change status"
                                                >
                                                    {booking.status === 'pending' ? 'Pending' : 'Confirmed'}
                                                </button>
                                            </td>
                                            <td className="py-4 px-4 text-gray-500 text-sm">
                                                {new Date(booking.created_at).toLocaleDateString('ko-KR')} {new Date(booking.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
