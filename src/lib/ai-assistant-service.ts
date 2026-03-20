import type { ConsultationRequest } from "./supabase";

/**
 * Super Research Agent - AI Briefing Service
 * This is a placeholder for a future MCP (Model Context Protocol) or External LLM API integration.
 * In a real environment, this function would send the `leads` context to an LLM endpoint,
 * and the LLM would generate a strategic summary for the clinic administrator.
 */
export async function generateDailyBriefing(leads: ConsultationRequest[], verbosity: string = 'Detailed'): Promise<string> {
    // Simulate network delay for AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const today = new Date().toDateString();
    const newToday = leads.filter(l => new Date(l.created_at).toDateString() === today);

    if (newToday.length === 0) {
        return "No new consultation requests today. Consider reviewing the 'Ghost Patients' column to follow up on old leads.";
    }

    // Count services for today
    const serviceCounts = newToday.reduce((acc, lead) => {
        acc[lead.service] = (acc[lead.service] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Find the top service
    const topService = Object.keys(serviceCounts).sort((a, b) => serviceCounts[b] - serviceCounts[a])[0];

    // ROI Threshold Check (Mock)
    const mockConversionRate = 35; 
    
    if (verbosity === 'Summary') {
      return `📈 Summarized View: ${newToday.length} new leads today. Focus on ${topService}.`;
    }

    if (verbosity === 'Data') {
      return `[JSON_DATA_STREAM] leads_count: ${newToday.length}, primary_service: "${topService}", avg_intent: 82%, conversion_est: ${mockConversionRate}%`;
    }

    // Default: Detailed
    return `📈 AI Insight: You received ${newToday.length} new inquiries today. The most popular request is "${topService}" (${serviceCounts[topService]} leads). 
  
💡 Strategy Recommendation: For the pending "${topService}" leads, recommend pushing the £150/mo financing plan during your call-backs to increase conversion rates.`;
}
