import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Instagram, Globe, Zap } from 'lucide-react';
import DailyInsight from '../../DailyInsight';
import TrafficSourceChart from '../../TrafficSourceChart';
import { LiveTrafficPanel } from '../shared/LiveTrafficPanel';
import { AutoTaggingModal } from '../shared/AutoTaggingModal';
import MarketingOnboarding from '../../MarketingOnboarding';
import { type Profile } from '../../../lib/supabase';

interface MarketingTabProps {
    marketingConnections: any[];
    marketingMetrics: any;
    unifiedTrafficData: any;
    profile: Profile | null;
    loadDashboardData: () => void;
}

export function MarketingTab({
    marketingConnections,
    marketingMetrics,
    unifiedTrafficData,
    profile,
    loadDashboardData
}: MarketingTabProps) {
    const [isAutoTagMenuOpen, setIsAutoTagMenuOpen] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState<'meta' | 'google' | null>(null);

    const handleEnableAutoTracking = (platform: 'meta' | 'google') => {
        // Here we would call the edge function `enable-auto-tracking`.
        // Because of OAuth scopes, we know it returns a fallback modal prompt,
        // so we open the modal elegantly.
        setSelectedPlatform(platform);
        setIsAutoTagMenuOpen(true);
    };

    return (
        <div className="space-y-8">
            {marketingConnections.length > 0 ? (
                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Left: Performance Summary */}
                    <div className="lg:col-span-4 space-y-6">
                        <DailyInsight
                            metrics={{
                                spend: marketingMetrics?.spend || 0,
                                leads: marketingMetrics?.leads || 0,
                                roi: Number(marketingMetrics?.roi) || 0,
                                topPlatform: marketingMetrics?.topPlatform || "Meta"
                            }}
                        />

                        {/* Live Traffic Source Panel — Real-time via Supabase Realtime */}
                        <LiveTrafficPanel clinicId={profile?.clinic_id ?? undefined} />

                        <div className="bg-white border border-[rgba(0,0,0,0.04)] rounded-[40px] p-8 shadow-[0_1px_2px_rgba(0,0,0,0.02),_0_8px_24px_-4px_rgba(0,0,0,0.04)]">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Connected Platforms</h4>
                            <div className="space-y-4">
                                {marketingConnections?.map(conn => (
                                    <div key={conn.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${conn.platform === 'meta' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                                                {conn.platform === 'meta' ? <Instagram className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                                            </div>
                                            <span className="text-sm font-bold text-gray-900 uppercase tracking-tight capitalize">{conn.platform} Ads</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex flex-col items-end mr-4">
                                                <button
                                                    onClick={() => handleEnableAutoTracking(conn.platform as 'meta' | 'google')}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#87A96B]/5 hover:bg-[#87A96B]/10 text-[#87A96B] transition-colors border border-[#87A96B]/20"
                                                >
                                                    <Zap className="w-3 h-3 fill-current" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">Enable Auto-tracking</span>
                                                </button>
                                            </div>
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#87A96B]" />
                                            <span className="text-[10px] font-black text-[#87A96B] uppercase tracking-tighter">Active</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Detailed ROI Analytics */}
                    <div className="lg:col-span-8">
                        <div className="bg-white border border-[rgba(0,0,0,0.04)] rounded-[40px] p-10 h-full relative overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.02),_0_8px_24px_-4px_rgba(0,0,0,0.04)]">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#87A96B]/5 blur-[80px] rounded-full -mr-10 -mt-10" />
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-12">
                                    <div>
                                        <h3 className="text-2xl font-semibold text-gray-900 mb-1 uppercase tracking-tight">Marketing ROI Analytics</h3>
                                        <p className="text-sm text-gray-500">Real-time correlation between ad spend and clinic revenue.</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-4xl font-black text-[#87A96B] tracking-tighter mb-1">{marketingMetrics?.roi}x</div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Efficiency Multiplier</div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-6 mb-12">
                                    <div className="p-6 bg-gray-50 rounded-[24px] border border-gray-100">
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Total Ad Spend</p>
                                        <div className="text-2xl font-bold text-gray-900">£{marketingMetrics?.spend}</div>
                                    </div>
                                    <div className="p-6 bg-gray-50 rounded-[24px] border border-gray-100">
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Treated Value (from Ads)</p>
                                        <div className="text-2xl font-bold text-gray-900">£{marketingMetrics?.revenue}</div>
                                    </div>
                                    <div className="p-6 bg-gray-50 rounded-[24px] border border-gray-100">
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Net Gain</p>
                                        <div className="text-2xl font-bold text-[#87A96B]">£{(marketingMetrics?.revenue || 0) - (marketingMetrics?.spend || 0)}</div>
                                    </div>
                                </div>

                                <TrafficSourceChart data={unifiedTrafficData} />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    <MarketingOnboarding
                        clinicId={profile?.clinic_id || ""}
                        onComplete={() => loadDashboardData()}
                    />
                    {/* Show live traffic even before ad platforms are connected */}
                    <LiveTrafficPanel clinicId={profile?.clinic_id ?? undefined} />
                </div>
            )}

            <AutoTaggingModal
                isOpen={isAutoTagMenuOpen}
                platform={selectedPlatform}
                onClose={() => setIsAutoTagMenuOpen(false)}
            />
        </div>
    );
}
