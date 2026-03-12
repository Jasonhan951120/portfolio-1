const SERVICE_CONVERSION_VALUES = {
    "Invisalign": 3500,
    "Dental Implants": 5000,
    "Veneers": 800,
    "Teeth Whitening": 300,
    "Premium Service": 1500
};

const clinicId = "test-clinic-id";

// Simulation of the hardened logic from CSVImportZone.tsx
const processData = (data) => {
    const results = data.map((row, index) => {
        // Validation: Skip completely empty or malformed rows early
        if (!row || Object.values(row).every(v => !v || String(v).trim() === '')) {
            console.log(`Row ${index}: Skipped empty row`);
            return null;
        }

        const serviceRaw = row['TreatmentType'] || row['Treatment Type'] || row['Service'] || row['Treatment'] || 'General Consultation';
        
        let rawVal = String(row['Potential Value'] || row['Value'] || '0');
        rawVal = rawVal.replace(/[^0-9.]/g, ''); 
        
        const potentialValue = parseFloat(rawVal) || 1000;
        const statusRaw = row['Status'] || row['Lead Status'] || 'New Lead';

        const randomID = Math.floor(Math.random() * 9000) + 1000;
        const pseudonym = `Patient #${randomID}`;

        const sRawStr = String(serviceRaw).toLowerCase();
        const serviceMatch = Object.keys(SERVICE_CONVERSION_VALUES).find(k =>
            k.toLowerCase().includes(sRawStr) || sRawStr.includes(k.toLowerCase())
        );
        
        const service = serviceMatch || "Premium Consultation";

        const validStatuses = ["New Lead", "Booked", "Visited", "Treated", "Sale Closed"];
        const status = validStatuses.includes(statusRaw) ? statusRaw : "New Lead";

        return {
            name: pseudonym,
            service,
            status,
            potential_value: potentialValue
        };
    }).filter(Boolean);
    
    return results;
};

// Test Data based on dirty_leads.csv
const testData = [
    {"Patient Name": "John Doe", "Treatment Type": "Dental Implants", "Value": "£5,000.00", "Status": "New Lead"},
    {"Patient Name": "", "Treatment Type": "Invisalign", "Value": "invalid", "Status": "Booked"},
    {"Patient Name": "Jane Smith", "Treatment Type": undefined, "Value": "NULL", "Status": "Treated"},
    {"Patient Name": "Special & Characters", "Treatment Type": "Veneers", "Value": "1,234.56#", "Status": "New Lead"},
    {}, // Empty row
    {"Patient Name": "Missing Value Row", "Treatment Type": undefined, "Value": undefined, "Status": undefined},
    {"Patient Name": "Valid Record", "Treatment Type": "Implants", "Value": "2000", "Status": "New Lead"}
];

const results = processData(testData);
console.log("--- TEST RESULTS ---");
console.log(JSON.stringify(results, null, 2));
console.log(`Total Success: ${results.length}`);
