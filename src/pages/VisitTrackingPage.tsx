import { useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

/**
 * Anonymous Visit Tracker — /visit/:clinicId
 *
 * UK GDPR Compliant: Zero PII stored.
 * - Session hash = SHA-256(date only) — no IP, no UA stored.
 * - Collects only: utm_source, utm_medium, utm_campaign, utm_term, referrer.
 * - Immediately redirects to the main landing page after logging.
 */
async function hashSession(): Promise<string> {
    const raw = new Date().toISOString().split("T")[0]; // just the date
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
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

            const session_hash = await hashSession();

            // Log anonymously — fire and forget
            await supabase.from("anonymous_visits").insert({
                clinic_id: clinicId,
                session_hash,
                utm_source: searchParams.get("utm_source") || null,
                utm_medium: searchParams.get("utm_medium") || null,
                utm_campaign: searchParams.get("utm_campaign") || null,
                utm_term: searchParams.get("utm_term") || null,
                referrer: document.referrer || null,
            });

            // Redirect to homepage, preserving UTM for form capture
            const redirectUrl = new URL("/", window.location.origin);
            searchParams.forEach((val, key) => redirectUrl.searchParams.set(key, val));
            navigate(redirectUrl.pathname + redirectUrl.search, { replace: true });
        }

        track();
    }, [clinicId]);

    // Invisible — user sees a brief blank screen then redirect
    return null;
}
