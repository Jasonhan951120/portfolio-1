-- ─────────────────────────────────────────────────────────────────────────────
-- Anonymous Visit Tracking (Zero PII)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.anonymous_visits (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id     UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  session_hash  TEXT NOT NULL,           -- SHA-256 of (IP + UA + date) — no raw PII
  utm_source    TEXT,
  utm_medium    TEXT,
  utm_campaign  TEXT,
  utm_term      TEXT,
  referrer      TEXT,
  country_code  TEXT,                    -- geo from CF header, non-PII
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Index for dashboard queries
CREATE INDEX idx_anon_visits_clinic   ON public.anonymous_visits (clinic_id);
CREATE INDEX idx_anon_visits_created  ON public.anonymous_visits (created_at DESC);

-- RLS: clinics can only read their own visit data
ALTER TABLE public.anonymous_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clinic_visits_isolation" ON public.anonymous_visits
  FOR ALL USING (
    clinic_id IN (
      SELECT clinic_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- Ad Platform OAuth Connections
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.clinic_ad_connections (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id       UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  platform        TEXT NOT NULL CHECK (platform IN ('meta', 'google')),
  access_token    TEXT,                  -- stored encrypted at rest by Supabase Vault
  refresh_token   TEXT,
  token_expires_at TIMESTAMPTZ,
  account_id      TEXT,                  -- Ad Account ID from platform
  account_name    TEXT,                  -- human-readable account label
  status          TEXT DEFAULT 'connected' CHECK (status IN ('connected', 'disconnected', 'error')),
  last_synced_at  TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (clinic_id, platform)
);

ALTER TABLE public.clinic_ad_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clinic_ad_connections_isolation" ON public.clinic_ad_connections
  FOR ALL USING (
    clinic_id IN (
      SELECT clinic_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- Aggregated Ad Metrics (populated by daily cron)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.clinic_ad_metrics (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id     UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  platform      TEXT NOT NULL CHECK (platform IN ('meta', 'google')),
  date          DATE NOT NULL,
  impressions   BIGINT DEFAULT 0,
  clicks        BIGINT DEFAULT 0,
  spend_gbp     NUMERIC(12, 2) DEFAULT 0,
  ctr           NUMERIC(6, 4),           -- clicks / impressions
  cpc_gbp       NUMERIC(8, 2),           -- spend / clicks
  campaign_name TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (clinic_id, platform, date, campaign_name)
);

CREATE INDEX idx_ad_metrics_clinic  ON public.clinic_ad_metrics (clinic_id);
CREATE INDEX idx_ad_metrics_date    ON public.clinic_ad_metrics (date DESC);

ALTER TABLE public.clinic_ad_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clinic_metrics_isolation" ON public.clinic_ad_metrics
  FOR ALL USING (
    clinic_id IN (
      SELECT clinic_id FROM public.profiles WHERE id = auth.uid()
    )
  );
