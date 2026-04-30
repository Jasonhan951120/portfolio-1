import { supabase } from "./supabase";

export async function saveTokenToBackend(platform: "google" | "meta", token: string, clinicId: string) {

    try {
        const { error } = await supabase
            .from("clinic_ad_connections")
            .upsert({
                clinic_id: clinicId,
                platform,
                access_token: token,
                updated_at: new Date().toISOString()
            }, {
                onConflict: "clinic_id,platform"
            });

        if (error) throw error;

        // Simulating a bit of final processing for UX
        await new Promise(resolve => setTimeout(resolve, 800));
    } catch (error) {
        throw error;
    }
}
