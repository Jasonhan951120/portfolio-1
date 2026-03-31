export const calculateFuzzyMatch = (input: string, activeTreatments: any[]): any | null => {
    if (!input || !activeTreatments || activeTreatments.length === 0) return null;
    const cleanInput = input.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
    
    // 1. Exact match (case insensitive)
    let match = activeTreatments.find(t => (t.service_name || t.name || '').toLowerCase().trim() === input.toLowerCase().trim());
    if (match) return match;

    // 2. Substring match
    match = activeTreatments.find(t => {
        const tName = (t.service_name || t.name || '').toLowerCase().trim();
        return tName.includes(input.toLowerCase().trim()) || input.toLowerCase().trim().includes(tName);
    });
    if (match) return match;

    // 3. Singular/Plural fuzzy matching (basic)
    const singularInput = cleanInput.replace(/s$/, '').replace(/ies$/, 'y');
    match = activeTreatments.find(t => {
        const cleanName = (t.service_name || t.name || '').toLowerCase().replace(/[^a-z0-9\s]/g, '');
        const singularName = cleanName.replace(/s$/, '').replace(/ies$/, 'y');
        
        // Split into words and check if any word matches
        const inputWords = singularInput.split(' ');
        const nameWords = singularName.split(' ');
        
        // If they share at least one significant word > 3 chars, consider it a match
        const sharedWords = inputWords.filter(w => w.length > 3 && nameWords.includes(w));
        return sharedWords.length > 0;
    });

    return match || null;
};
