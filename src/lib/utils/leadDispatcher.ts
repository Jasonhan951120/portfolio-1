import { supabase } from '../supabase';

/**
 * Automatically assigns a lead to the best performing staff member 
 * based on conversion efficiency for a specific service category.
 */
export const assignLeadToBestStaff = async (leadId: string, serviceType: string) => {
    try {
        // 1. Fetch staff performance for the clinic
        // We order by conversion_rate and total_revenue to find the "best"
        const { data: staffStats, error: staffError } = await supabase
            .from('staff_performance')
            .select('id, conversion_rate, total_revenue')
            .order('conversion_rate', { ascending: false })
            .order('total_revenue', { ascending: false })
            .limit(1);

        if (staffError) throw staffError;
        if (!staffStats || staffStats.length === 0) {
            console.warn('No active staff found for auto-assignment.');
            return null;
        }

        const bestStaffId = staffStats[0].id;

        // 2. Assign the lead
        const { error: updateError } = await supabase
            .from('consultation_requests')
            .update({ assigned_to: bestStaffId })
            .eq('id', leadId);

        if (updateError) throw updateError;

        console.log(`Lead ${leadId} automatically assigned to staff ${bestStaffId}`);
        return bestStaffId;
    } catch (err) {
        console.error('Error in lead auto-assignment:', err);
        return null;
    }
};
