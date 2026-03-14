import { create } from 'zustand';
import { ConsultationRequest } from '../lib/supabase';

interface DashboardState {
  leads: ConsultationRequest[];
  activeCategory: string;
  setLeads: (leads: ConsultationRequest[]) => void;
  setActiveCategory: (category: string) => void;
  updateLead: (id: string, updates: Partial<ConsultationRequest>) => void;
  
  // Derived selectors (implemented as functions or used via compute)
  getFilteredLeads: () => ConsultationRequest[];
  getStats: () => {
    totalRevenue: number;
    unsecuredPipeline: number;
    pipelineValue: number;
  };
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  leads: [],
  activeCategory: 'All',
  
  setLeads: (leads) => set({ leads }),
  
  setActiveCategory: (category) => set({ activeCategory: category }),
  
  updateLead: (id, updates) => set((state) => ({
    leads: state.leads.map((l) => l.id === id ? { ...l, ...updates } : l)
  })),

  getFilteredLeads: () => {
    const { leads, activeCategory } = get();
    if (activeCategory === 'All') return leads;
    return leads.filter((l) => l.category === activeCategory || l.service === activeCategory);
  },

  getStats: () => {
    const filteredLeads = get().getFilteredLeads();
    
    const totalRevenue = filteredLeads.reduce((sum, l) => {
      // Logic from AdminDashboard.tsx for value
      const value = l.potential_value || 1000; // Placeholder logic, will refine
      return sum + value;
    }, 0);

    const unsecuredPipeline = filteredLeads
      .filter(l => {
        if (l.status !== 'New Lead') return false;
        const baseline = l.imported_at || new Date(l.created_at).getTime();
        return (Date.now() - baseline) >= 15 * 60000;
      })
      .reduce((sum, l) => sum + (l.potential_value || 1000), 0);

    const pipelineValue = filteredLeads.reduce((sum, l) => {
      if (l.status === "Abandoned" || l.status === "Sale Closed") return sum;
      return sum + (l.potential_value || 1000);
    }, 0);

    return { totalRevenue, unsecuredPipeline, pipelineValue };
  }
}));
