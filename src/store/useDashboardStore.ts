import { create } from 'zustand';
import { ConsultationRequest } from '../lib/supabase';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, Timestamp, orderBy } from 'firebase/firestore';
import { DEMO_LEADS } from '../lib/demoData';
import { formatAuditTimestamp } from '../lib/utils/formatters';
import { SERVICE_CONVERSION_VALUES } from '../lib/constants';

export interface TreatmentTemplate {
  id: string;
  name: string;
  price: number;
  description?: string;
  beforeImg?: string;
  afterImg?: string;
  bookingUrl?: string;
  messageTemplates?: string[];
}

interface DashboardState {
  leads: ConsultationRequest[];
  activeCategory: string;
  activeTab: 'PIPELINE' | 'VAULT' | 'SECURITY' | 'INTELLIGENCE' | 'REPUTATION';
  setLeads: (leads: ConsultationRequest[] | ((prev: ConsultationRequest[]) => ConsultationRequest[])) => void;
  setActiveCategory: (category: string) => void;
  setActiveTab: (tab: 'PIPELINE' | 'VAULT' | 'SECURITY' | 'INTELLIGENCE' | 'REPUTATION') => void;
  updateLead: (id: string, updates: Partial<ConsultationRequest>) => void;
  injectSampleData: () => void;
  region: 'UK' | 'US';
  setRegion: (region: 'UK' | 'US') => void;
  isGoogleConnected: boolean;
  googleProfile: { name: string, rating: number, reviewCount: number } | null;
  setGoogleConnected: (isConnected: boolean, profile?: { name: string, rating: number, reviewCount: number }) => void;
  setGoogleProfile: (profile: { name: string, rating: number, reviewCount: number } | null) => void;
  liveReviews: any[];
  setLiveReviews: (reviews: any[]) => void;
  clinicId: string;
  setClinicId: (id: string) => void;
  subscribeToLeads: () => () => void;
  updateLeadStatus: (id: string, newStatus: string) => Promise<void>;
  currency: '£' | '$';
  setCurrency: (currency: '£' | '$') => void;

  // Clinic Profile
  clinicType: 'Dental' | 'Aesthetic' | 'Wellness';
  setClinicType: (type: 'Dental' | 'Aesthetic' | 'Wellness') => void;
  clinicName: string;
  setClinicName: (name: string) => void;
  clinicLogo: string;
  setClinicLogo: (url: string) => void;
  clinicSignatureImage: string;
  setClinicSignatureImage: (url: string) => void;

  // Clinic Settings
  templates: TreatmentTemplate[];
  setTemplates: (templates: TreatmentTemplate[]) => void;
  activeTreatments: any[];
  setActiveTreatments: (treatments: any[]) => void;
  googlePlaceId: string;
  setGooglePlaceId: (id: string) => void;
  isSynced: boolean;
  setIsSynced: (isSynced: boolean) => void;
  reputationMode: 'Booster' | 'Steady' | 'Saver';
  setReputationMode: (mode: 'Booster' | 'Steady' | 'Saver') => void;

  // Security & Audit State
  auditLogs: Record<string, any[]>;
  addAuditLog: (leadId: string, action: string, method: string) => void;

  getFilteredLeads: () => ConsultationRequest[];
  getDynamicCategories: () => { name: string, value: number }[];
  getEngineLogs: () => { name: string, value: number }[];
  getStats: () => {
    totalRevenue: number;
    unsecuredPipeline: number;
    pipelineValue: number;
  };

  // AI Chat
  isAIChatOpen: boolean;
  setIsAIChatOpen: (isOpen: boolean) => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  leads: [],
  activeCategory: 'All',
  activeTab: 'PIPELINE',
  region: 'UK',
  currency: '£',
  isGoogleConnected: false,
  googleProfile: null,
  auditLogs: {},

  setLeads: (leads) => set((state) => ({
    leads: typeof leads === 'function' ? leads(state.leads) : leads
  })),

  setActiveCategory: (category) => set({ activeCategory: category }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setRegion: (region) => set({ region, currency: region === 'UK' ? '£' : '$' }),
  setCurrency: (currency) => set({ currency, region: currency === '£' ? 'UK' : 'US' }),
  setGoogleConnected: (isConnected, profile) => set({ isGoogleConnected: isConnected, googleProfile: profile || null }),
  setGoogleProfile: (profile) => set({ googleProfile: profile }),
  liveReviews: [],
  setLiveReviews: (reviews) => set({ liveReviews: reviews }),

  clinicType: (localStorage.getItem('clinic_type') as 'Dental' | 'Aesthetic' | 'Wellness') || 'Dental',
  setClinicType: (type) => {
    localStorage.setItem('clinic_type', type);
    set({ clinicType: type });
  },

  clinicName: localStorage.getItem('clinic_name') || '',
  setClinicName: (name) => {
    localStorage.setItem('clinic_name', name);
    set({ clinicName: name });
  },

  clinicLogo: localStorage.getItem('clinic_logo') || '',
  setClinicLogo: (url) => {
    localStorage.setItem('clinic_logo', url);
    set({ clinicLogo: url });
  },
  clinicSignatureImage: localStorage.getItem('clinic_signature_image') || '',
  setClinicSignatureImage: (url) => {
    localStorage.setItem('clinic_signature_image', url);
    set({ clinicSignatureImage: url });
  },

  templates: (() => {
    const saved = localStorage.getItem('clinic_templates');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return Object.entries(SERVICE_CONVERSION_VALUES).map(([name, price], idx) => ({
      id: `template-${idx}`,
      name,
      price
    }));
  })(),

  setTemplates: (templates) => {
    localStorage.setItem('clinic_templates', JSON.stringify(templates));
    set({ templates });
  },

  activeTreatments: [],
  setActiveTreatments: (treatments) => set({ activeTreatments: treatments }),
  googlePlaceId: localStorage.getItem('google_place_id') || '',
  setGooglePlaceId: (id: string) => {
    localStorage.setItem('google_place_id', id);
    set({ googlePlaceId: id });
  },
  isSynced: localStorage.getItem('is_synced') === 'true',
  setIsSynced: (isSynced: boolean) => {
    localStorage.setItem('is_synced', isSynced.toString());
    set({ isSynced });
  },
  reputationMode: (localStorage.getItem('reputation_mode') as 'Booster' | 'Steady' | 'Saver') || 'Steady',
  setReputationMode: (mode) => {
    localStorage.setItem('reputation_mode', mode);
    set({ reputationMode: mode });
  },

  updateLead: (id, updates) => set((state) => ({
    leads: state.leads.map((l) => l.id === id ? { ...l, ...updates } : l)
  })),

  clinicId: '',
  setClinicId: (id) => set({ clinicId: id }),

  subscribeToLeads: () => {
    const { clinicId } = get();
    if (!clinicId) {
      return () => {};
    }

    const q = query(
      collection(db, "patients"),
      where("clinicId", "==", clinicId),
      orderBy("created_at", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const leads: ConsultationRequest[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        leads.push({
          id: doc.id,
          ...data,
          created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
          updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at,
        } as ConsultationRequest);
      });
      set({ leads });
    }, () => {
      // Firestore subscription error — leads remain as-is
    });

    return unsubscribe;
  },

  updateLeadStatus: async (id, newStatus) => {
    const leadRef = doc(db, "patients", id);
    await updateDoc(leadRef, {
      status: newStatus,
      updated_at: Timestamp.now()
    });
  },

  injectSampleData: () => {
    set({ leads: DEMO_LEADS as ConsultationRequest[] });
  },

  addAuditLog: (leadId, action, method) => {
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
      return sum + (l.potential_value || 1000);
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
  },

  isAIChatOpen: false,
  setIsAIChatOpen: (isOpen) => set({ isAIChatOpen: isOpen }),
}));
