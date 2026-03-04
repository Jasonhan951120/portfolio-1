import { useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

/**
 * Real-Time Traffic Tracking Engine — /visit/:clinicId
 *
 * UK GDPR Compliant:
 * - SHA-256 session hash from date + screen dimensions + language (ZERO PII)
 * - No IP addresses, no User-Agent strings, no cookies stored
 * - 24-hour dedup: same session+clinic only counts once per day
 *
 * Flow:
 * 1. Categorize traffic source from UTM params or Referer header
 * 2. Generate anonymous session hash
 * 3. Check for duplicate visit in last 24 hours (anti-spam)
 * 4. If unique: INSERT into traffic_events + atomically UPSERT traffic_stats
 * 5. Redirect to homepage, preserving UTM params for form capture
 */

type TrafficSource = "Google" | "Social" | "Google (Organic)" | "Direct";

function categorizeSource(utmSource: string | null, referrer: string): TrafficSource {
    const utm = (utmSource || "").toLowerCase().trim();

    if (utm === "google" || utm === "google_ads" || utm === "google-ads") return "Google";
    if (utm === "instagram" || utm === "facebook" || utm === "meta") return "Social";

    if (!utm && referrer) {
        const ref = referrer.toLowerCase();
        if (ref.includes("google.com") || ref.includes("google.co.uk")) return "Google (Organic)";
    }

    return "Direct";
}

async function generateSessionHash(): Promise<string> {
    // GDPR-safe: combines date + screen resolution + browser language
    // This creates enough entropy to identify a "session" without any PII
    const components = [
        new Date().toISOString().split("T")[0], // date only (no time)
        screen.width.toString(),
        screen.height.toString(),
        navigator.language,
    ].join("|");

    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(components));
    return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

export default function VisitTrackingPage() {
    const { clinicId } = useParams<{ clinicId: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function track() {
            if (!clinicId) return;

            const utmSource = searchParams.get("utm_source");
            const referrer = document.referrer || "";
            const source = categorizeSource(utmSource, referrer);
            const session_hash = await generateSessionHash();

            // TODO: RE-ENABLE AFTER TESTING (Anti-abuse logic) ─────────────────
            // Lines below were commented out for Developer Testing Mode.
            // To restore: uncomment lines 68–96 and wrap the insert/rpc in the if (!existingVisit) block.
            //
            // const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
            // const { data: existingVisit } = await supabase
            //     .from("traffic_events")
            //     .select("id")
            //     .eq("clinic_id", clinicId)
            //     .eq("session_hash", session_hash)
            //     .gte("created_at", since24h)
            //     .limit(1)
            //     .maybeSingle();
            // ─────────────────────────────────────────────────────────────────────

            // ── TESTING MODE: Write unconditionally on EVERY visit / refresh ──────
            await supabase.from("traffic_events").insert({
                clinic_id: clinicId,
                session_hash,
                source,
                utm_source: utmSource || null,
                utm_medium: searchParams.get("utm_medium") || null,
                utm_campaign: searchParams.get("utm_campaign") || null,
                referrer: referrer || null,
            });

            // ── Atomically increment traffic_stats counter ────────────────────────
            await supabase.rpc("upsert_traffic_stat", {
                p_clinic_id: clinicId,
                p_source: source,
            });
            // ── END TESTING MODE ─────────────────────────────────────────────────

            // ── Redirect to homepage, preserving UTM params ────────────────────
            const redirectUrl = new URL("/", window.location.origin);
            searchParams.forEach((val, key) => redirectUrl.searchParams.set(key, val));
            navigate(redirectUrl.pathname + redirectUrl.search, { replace: true });
        }

        track();
    }, [clinicId]);

    // Invisible redirect page
    return null;
}
