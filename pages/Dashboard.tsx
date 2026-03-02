import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Settings, Save, X, TrendingUp, Users, DollarSign, Calendar, ChevronRight, LayoutDashboard, Database, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const Dashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [metrics, setMetrics] = useState({
        goal: '£25,000',
        income: '£18,420',
        clients_count: 142
    });
    const [bookings, setBookings] = useState<any[]>([]);

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
                    if (!data.is_admin) {
                        alert('Access Denied: Admin privileges required.');
                        window.location.href = '/';
                        return;
                    }
                    setMetrics({
                        goal: data.goal || '£25,000',
                        income: data.income || '£0',
                        clients_count: data.clients_count || 0
                    });
                }

                const { data: bookingsData } = await supabase
                    .from('bookings')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (bookingsData) setBookings(bookingsData);
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
            setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const containerVariants: any = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const cardVariants: any = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
    };

    // Mock chart data
    const chartData = [
        { name: 'Mon', revenue: 4000 },
        { name: 'Tue', revenue: 3000 },
        { name: 'Wed', revenue: 5000 },
        { name: 'Thu', revenue: 2780 },
        { name: 'Fri', revenue: 4890 },
        { name: 'Sat', revenue: 2390 },
        { name: 'Sun', revenue: 3490 },
    ];

    if (loading && !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0f1d]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="h-12 w-12 border-t-2 border-[#00FFCC] rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#060912] text-white selection:bg-[#00FFCC]/30 font-sans p-4 md:p-8 lg:p-12">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-[1600px] mx-auto space-y-12"
            >
                {/* Top Navigation / Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <motion.div variants={cardVariants} className="flex items-center gap-3 text-[#00FFCC] mb-2">
                            <Activity size={20} />
                            <span className="text-xs font-bold uppercase tracking-[0.2em]">Operational Excellence</span>
                        </motion.div>
                        <motion.h1
                            variants={cardVariants}
                            className="text-4xl md:text-5xl font-black tracking-tight"
                        >
                            Welcome, <span className="bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">{user?.user_metadata?.full_name?.split(' ')[0] || 'Doctor'}</span>
                        </motion.h1>
                    </div>

                    <motion.div variants={cardVariants} className="flex items-center gap-4">
                        <button
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            className="relative group overflow-hidden px-8 py-4 rounded-2xl bg-white text-black font-black text-sm flex items-center gap-3 transition-all active:scale-95"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {isEditing ? <><Save size={18} /> SAVE CHANGES</> : <><Settings size={18} /> EDIT DASHBOARD</>}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#00FFCC] to-[#0066FF] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        {isEditing && (
                            <button
                                onClick={() => setIsEditing(false)}
                                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all active:scale-95"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </motion.div>
                </header>

                {/* Main Metrics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <motion.div
                        variants={cardVariants}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 rounded-[32px] p-10 relative overflow-hidden group shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00FFCC]/5 blur-[120px] rounded-full pointer-events-none" />
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-12">
                                <div>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Revenue Overview</p>
                                    <h2 className="text-6xl md:text-7xl font-black tracking-tighter">
                                        {isEditing ? (
                                            <input
                                                className="bg-transparent border-none outline-none w-full text-[#00FFCC]"
                                                value={metrics.income}
                                                onChange={e => setMetrics({ ...metrics, income: e.target.value })}
                                            />
                                        ) : metrics.income}
                                    </h2>
                                </div>
                                <div className="text-right">
                                    <p className="text-slate-500 font-bold text-xs uppercase mb-2">Target Goal</p>
                                    <p className="text-3xl font-black text-slate-300">
                                        {isEditing ? (
                                            <input
                                                className="bg-transparent border-none outline-none text-right w-32"
                                                value={metrics.goal}
                                                onChange={e => setMetrics({ ...metrics, goal: e.target.value })}
                                            />
                                        ) : metrics.goal}
                                    </p>
                                </div>
                            </div>

                            <div className="h-[200px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#00FFCC" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#00FFCC" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#00FFCC"
                                            strokeWidth={4}
                                            fillOpacity={1}
                                            fill="url(#colorRevenue)"
                                            animationDuration={2000}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', color: '#fff' }}
                                            itemStyle={{ color: '#00FFCC' }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={cardVariants}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="bg-slate-900 rounded-[32px] p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#0066FF]/10 to-transparent pointer-events-none" />
                        <div className="relative z-10">
                            <Users className="text-[#0066FF] mb-6" size={40} />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Total Patients</p>
                            <h3 className="text-7xl font-black tracking-tighter">
                                {isEditing ? (
                                    <input
                                        type="number"
                                        className="bg-transparent border-none outline-none w-full"
                                        value={metrics.clients_count}
                                        onChange={e => setMetrics({ ...metrics, clients_count: parseInt(e.target.value) || 0 })}
                                    />
                                ) : metrics.clients_count}
                            </h3>
                        </div>
                        <div className="relative z-10 pt-8 border-t border-white/5">
                            <div className="flex items-center gap-2 text-[#00FFCC] font-bold">
                                <TrendingUp size={16} />
                                <span>+12.5% this month</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Second Row */}
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                    {/* Bookings List */}
                    <motion.div
                        variants={cardVariants}
                        className="xl:col-span-3 bg-slate-900/50 backdrop-blur-xl rounded-[32px] overflow-hidden shadow-2xl"
                    >
                        <div className="p-10 flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-black tracking-tight mb-1">Incoming Patients</h3>
                                <p className="text-slate-500 text-sm font-medium">Real-time booking flow and processing</p>
                            </div>
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold uppercase overflow-hidden">
                                        <img src={`https://i.pravatar.cc/40?img=${i + 10}`} alt="avatar" />
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black">+8</div>
                            </div>
                        </div>

                        <div className="px-6 pb-6">
                            <div className="space-y-3">
                                <AnimatePresence mode='popLayout'>
                                    {bookings.length === 0 ? (
                                        <div className="py-20 text-center opacity-20">
                                            <Database size={48} className="mx-auto mb-4" />
                                            <p className="text-xl font-black">SYSTEM COLD</p>
                                        </div>
                                    ) : (
                                        bookings.map((booking, idx) => (
                                            <motion.div
                                                layout
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                key={booking.id}
                                                className="group bg-white/5 hover:bg-white/10 rounded-2xl p-5 flex items-center justify-between transition-all cursor-pointer"
                                            >
                                                <div className="flex items-center gap-5">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${booking.status === 'pending' ? 'bg-[#FFCC00]/20 text-[#FFCC00]' : 'bg-[#00FFCC]/20 text-[#00FFCC]'}`}>
                                                        {booking.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-lg group-hover:text-[#00FFCC] transition-colors">{booking.name}</h4>
                                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{booking.treatment}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-8">
                                                    <div className="hidden md:block text-right">
                                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Appointment</p>
                                                        <p className="text-sm font-bold text-slate-300">{new Date(booking.preferred_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleStatusChange(booking.id, booking.status)}
                                                        className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${booking.status === 'pending' ? 'bg-white text-black hover:bg-[#FFCC00]' : 'bg-[#00FFCC] text-black hover:scale-105'}`}
                                                    >
                                                        {booking.status === 'pending' ? 'Verify' : 'Secured'}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Surface */}
                    <motion.div
                        variants={cardVariants}
                        className="xl:col-span-2 bg-[#0a0f1d] rounded-[32px] p-10 flex flex-col shadow-2xl relative"
                    >
                        <h3 className="text-2xl font-black tracking-tight mb-8 leading-tight">Patient Acquisition <br /><span className="text-[#00FFCC]">Machine Status</span></h3>

                        <div className="space-y-8 flex-grow">
                            {[
                                { label: 'Conversion Rate', value: '4.8%', color: '#00FFCC' },
                                { label: 'Lead Quality', value: 'High', color: '#0066FF' },
                                { label: 'Response Time', value: '1.2m', color: '#FFCC00' }
                            ].map((stat, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-end mb-3">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                                        <p className="text-xl font-black">{stat.value}</p>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '70%' }}
                                            transition={{ delay: 1 + (i * 0.2), duration: 2, ease: "circOut" }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: stat.color }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 p-6 rounded-2xl bg-[#00FFCC]/10 border border-[#00FFCC]/20">
                            <p className="text-[#00FFCC] font-black text-sm mb-1 uppercase tracking-tighter">AI Insight</p>
                            <p className="text-xs text-[#00FFCC]/80 leading-relaxed font-medium italic">"Your conversion rate has increased by 14% since implementing the new cinematic hero section."</p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};
