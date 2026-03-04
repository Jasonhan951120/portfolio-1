import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export interface TrafficStat {
    source: string;
    count: number;
}

/**
 * Real-time hook: subscribes to traffic_stats table via Supabase Realtime.
 * When a visit fires and traffic_stats is incremented atomically,
 * the dashboard chart updates instantly without a page refresh.
 */
export function useTrafficStats(clinicId: string | undefined) {
    const [stats, setStats] = useState<TrafficStat[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!clinicId) return;

        // ── Initial fetch ──────────────────────────────────────────────────────
        async function fetchStats() {
            const { data, error } = await supabase
                .from("traffic_stats")
                .select("source, count")
                .eq("clinic_id", clinicId)
                .order("count", { ascending: false });

            if (!error && data) {
                setStats(data as TrafficStat[]);
            }
            setIsLoading(false);
        }

        fetchStats();

        // ── Realtime subscription ──────────────────────────────────────────────
        // Listens for UPDATE events on traffic_stats (fired by upsert_traffic_stat RPC)
        const channel = supabase
            .channel(`traffic-stats-${clinicId}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "traffic_stats",
                    filter: `clinic_id=eq.${clinicId}`,
                },
                (payload) => {
                    const updated = payload.new as { source: string; count: number };
                    setStats((prev) => {
                        const exists = prev.find((s) => s.source === updated.source);
                        if (exists) {
                            return prev.map((s) =>
                                s.source === updated.source ? { ...s, count: updated.count } : s
                            );
                        } else {
                            return [...prev, { source: updated.source, count: updated.count }].sort(
                                (a, b) => b.count - a.count
                            );
                        }
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [clinicId]);

    return { stats, isLoading };
}
