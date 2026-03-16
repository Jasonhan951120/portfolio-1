import { create } from 'zustand';
import { ConsultationRequest } from '../lib/supabase';

interface DashboardState {
  leads: ConsultationRequest[];
  activeCategory: string;
  activeTab: 'PIPELINE' | 'VAULT' | 'SECURITY' | 'INTELLIGENCE';
  setLeads: (leads: ConsultationRequest[] | ((prev: ConsultationRequest[]) => ConsultationRequest[])) => void;
  setActiveCategory: (category: string) => void;
  setActiveTab: (tab: 'PIPELINE' | 'VAULT' | 'SECURITY' | 'INTELLIGENCE') => void;
  updateLead: (id: string, updates: Partial<ConsultationRequest>) => void;
  injectSampleData: () => void;
  region: 'UK' | 'US';
  setRegion: (region: 'UK' | 'US') => void;
  isGoogleConnected: boolean;
  googleProfile: { name: string, rating: number, reviewCount: number } | null;
  setGoogleConnected: (isConnected: boolean, profile?: { name: string, rating: number, reviewCount: number }) => void;
  
  // Security & Audit State
  auditLogs: Record<string, any[]>;
  addAuditLog: (leadId: string, action: string, method: string) => void;
  
  // Derived selectors (implemented as functions or used via compute)
  getFilteredLeads: () => ConsultationRequest[];
  getDynamicCategories: () => { name: string, value: number }[];
  getEngineLogs: () => { name: string, value: number }[];
  getStats: () => {
    totalRevenue: number;
    unsecuredPipeline: number;
    pipelineValue: number;
  };
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  leads: [],
  activeCategory: 'All',
  activeTab: 'PIPELINE',
  region: 'UK',
  isGoogleConnected: false,
  googleProfile: null,
  auditLogs: {
    "demo-3": [
      {
        time: "[14 Mar 2026, 09:12:05 AM EST]",
        action: "User: System - Action: System login and profile creation - Method: Automated Protocol",
        type: 'security'
      },
      {
        time: "[14 Mar 2026, 11:45:22 AM EST]",
        action: "User: System - Action: Patient clinical data synced from EXACT API - Method: API Integration",
        type: 'system'
      },
      {
        time: "[15 Mar 2026, 02:20:11 PM EST]",
        action: "User: Hanlan AI - Action: AI Potential Value & Insights successfully calculated - Method: Neural Engine",
        type: 'ai'
      }
    ]
  },
  
  setLeads: (leads) => set((state) => ({ 
    leads: typeof leads === 'function' ? leads(state.leads) : leads 
  })),
  
  setActiveCategory: (category) => set({ activeCategory: category }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setRegion: (region) => set({ region }),
  setGoogleConnected: (isConnected, profile) => set({ isGoogleConnected: isConnected, googleProfile: profile || null }),
  
  updateLead: (id, updates) => set((state) => ({
    leads: state.leads.map((l) => l.id === id ? { ...l, ...updates } : l)
  })),

  injectSampleData: () => {
    const { DEMO_LEADS } = require('../lib/demoData');
    set({ leads: DEMO_LEADS as ConsultationRequest[] });
  },

  addAuditLog: (leadId, action, method) => {
    const { formatAuditTimestamp } = require('../lib/utils/formatters');
    const timestamp = formatAuditTimestamp(new Date());
    const logEntry = {
      time: timestamp,
      action: `User: Dr. Hanlan - Action: ${action} - Method: ${method}`,
      type: 'user'
    };
    
    set((state) => ({
      auditLogs: {
        ...state.auditLogs,
        [leadId]: [logEntry, ...(state.auditLogs[leadId] || [])]
      }
    }));
  },

  getDynamicCategories: () => {
    const { leads } = get();
    if (!leads || leads.length === 0) return [];
    
    const categories: Record<string, number> = {};
    leads.forEach(lead => {
      const cat = lead.service || lead.category || 'Other';
      categories[cat] = (categories[cat] || 0) + (lead.potential_value || 1000);
    });
    
    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  },

  getEngineLogs: () => {
    return get().getDynamicCategories();
  },

  getFilteredLeads: () => {
    const { leads, activeCategory } = get();
    if (activeCategory === 'All') return leads;
    return (leads ?? []).filter((l) => l.category === activeCategory || l.service === activeCategory);
  },

  getStats: () => {
    const filteredLeads = get().getFilteredLeads();
    
    const totalRevenue = (filteredLeads ?? []).reduce((sum, l) => {
      const value = l.potential_value || 1000;
      return sum + value;
    }, 0);

    const unsecuredPipeline = (filteredLeads ?? [])
      .filter(l => {
        if (l.status !== 'New Lead') return false;
        const baseline = l.importedAt || new Date(l.created_at).getTime();
        return (Date.now() - baseline) >= 15 * 60000;
      })
      .reduce((sum, l) => sum + (l.potential_value || 1000), 0);

    const pipelineValue = (filteredLeads ?? []).reduce((sum, l) => {
      if (l.status === "Abandoned" || l.status === "Sale Closed") return sum;
      return sum + (l.potential_value || 1000);
    }, 0);

    return { totalRevenue, unsecuredPipeline, pipelineValue };
  }
}));
