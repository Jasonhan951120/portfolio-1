# Zero-EMR "Side-car" Architecture Pitch

## The Vision
Most dental clinics in the UK are locked into legacy EMR systems like **EXACT** or **R4**. While functional for clinical records, these systems are "Digital Silos"—they are terrible at modern marketing, lead tracking, and conversion analytics. 

**Hanlan OC** is designed as a high-performance **"Side-car" dashboard**. We don't replace the EMR; we overlay it with a high-end revenue engine.

## Core Architectural Pillars

### 1. Zero-EMR Integration (Zero Risk)
We do not require direct database access or API integration with the legacy EMR. This removes 99% of the security risk and prevents system crashes.
- **Side-car Logic**: Hanlan OC operates on a separate cloud infrastructure (Supabase/React).
- **Data Bridge**: Use our `CSVImportZone` to pull marketing data from EXACT without touching clinical records.

### 2. PII Scrubber (Privacy-by-Design)
We never store Patient Identifiable Information (PII) on our servers. 
- **Local Parsing**: CSV files are parsed in the browser's memory.
- **Pseudonymization**: Names and contact details are dropped or pseudonymized (e.g., "Patient #4921") before any data hits the server.
- **GDPR Compliance**: By not storing clinical data or PII, Hanlan OC massively reduces the clinic's compliance burden.

### 3. Front-End Revenue Engine
While the EMR handles the "Past" (Records), Hanlan OC handles the "Future" (Revenue).
- **Reputation Autopilot**: Automated review requests triggered by status changes.
- **Lead Recovery AI**: Identifying financial leakage in real-time.
- **Clinical Luxury UI**: A premium experience for staff that drives high-value treatment conversions.

## Conclusion
Hanlan OC is the **Revenue Layer** for the modern UK dental clinic. It provides clinical intelligence and marketing automation without the technical debt or security risks of legacy system integration.
