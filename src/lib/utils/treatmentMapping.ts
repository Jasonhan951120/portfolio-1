/**
 * Semantic Treatment Mapping Utility
 * Maps messy PMS export terms to standard high-level categories.
 */

export type TreatmentCategory = 'Implants' | 'Orthodontics' | 'Cosmetic' | 'General';

export function categorizeTreatment(treatmentName: string, price: number): TreatmentCategory {
    const name = treatmentName.toLowerCase();
    
    // High-Ticket Indicators (Weights towards high-ticket if price is high)
    const isHighValue = price >= 1500;

    // Implants mapping
    if (name.includes('implant') || name.includes('fixture') || name.includes('abutment') || (isHighValue && name.includes('screw'))) {
        return 'Implants';
    }

    // Orthodontics mapping
    if (name.includes('invisalign') || name.includes('align') || name.includes('brace') || name.includes('ortho') || name.includes('itero')) {
        return 'Orthodontics';
    }

    // Cosmetic mapping
    if (name.includes('veneer') || name.includes('bonding') || name.includes('white') || name.includes('smile') || name.includes('aesthetic') || name.includes('cosmetic')) {
        return 'Cosmetic';
    }

    // Fallback based on value
    if (isHighValue) {
        return 'Cosmetic'; // Assume high value is cosmetic if unknown
    }

    return 'General';
}
