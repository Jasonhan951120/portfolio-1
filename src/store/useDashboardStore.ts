import { create } from 'zustand';
import { ConsultationRequest } from '../lib/supabase';

interface DashboardState {
  leads: ConsultationRequest[];
  activeCategory: string;
  activeTab: 'PIPELINE' | 'VAULT' | 'SECURITY';
  setLeads: (leads: ConsultationRequest[] | ((prev: ConsultationRequest[]) => ConsultationRequest[])) => void;
  setActiveCategory: (category: string) => void;
  setActiveTab: (tab: 'PIPELINE' | 'VAULT' | 'SECURITY') => void;
  updateLead: (id: string, updates: Partial<ConsultationRequest>) => void;
  injectSampleData: () => void;
  
  // Derived selectors (implemented as functions or used via compute)
  getFilteredLeads: () => ConsultationRequest[];
  getDynamicCategories: () => { name: string, value: number }[];
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
  
  setLeads: (leads) => set((state) => ({ 
    leads: typeof leads === 'function' ? leads(state.leads) : leads 
  })),
  
  setActiveCategory: (category) => set({ activeCategory: category }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  updateLead: (id, updates) => set((state) => ({
    leads: state.leads.map((l) => l.id === id ? { ...l, ...updates } : l)
  })),

  injectSampleData: () => {
    const { DEMO_LEADS } = require('../lib/demoData');
    set({ leads: DEMO_LEADS as ConsultationRequest[] });
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
