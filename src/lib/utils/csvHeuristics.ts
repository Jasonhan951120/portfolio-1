/**
 * Local Heuristics for CSV Column Mapping
 * Ensures PII data (Names, Phones) is processed locally in the browser.
 */

export type ColumnType = 'patientName' | 'phone' | 'potentialValue' | 'appointmentDate' | 'service' | 'status' | 'unknown';

export interface ColumnMapping {
  header: string;
  type: ColumnType;
  confidence: number; // 0 to 1
}

const UK_PHONE_REGEX = /^(07|\+447)\d{9}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}|\d{2}-\d{2}-\d{4}/;
const CURRENCY_REGEX = /[£$€]/;

export function inferColumnType(header: string, sampleData: any[]): { type: ColumnType; confidence: number } {
  const h = header.toLowerCase().replace(/[^a-z]/g, '');
  const samples = sampleData.map(v => String(v || '').trim()).filter(Boolean);

  // 1. Patient Name
  if (['name', 'patient', 'client', 'contact', 'fullname', 'fullname'].some(k => h.includes(k))) {
    return { type: 'patientName', confidence: 0.9 };
  }

  // 2. Phone
  const phoneSamples = samples.filter(s => UK_PHONE_REGEX.test(s.replace(/[\s-()]/g, '')));
  if (['phone', 'mobile', 'tel', 'contactnumber'].some(k => h.includes(k))) {
    return { type: 'phone', confidence: 0.95 };
  }
  if (phoneSamples.length / samples.length > 0.5) {
    return { type: 'phone', confidence: 0.8 };
  }

  // 3. Potential Value
  const valueSamples = samples.filter(s => !isNaN(Number(s.replace(/[^0-9.]/g, ''))) || CURRENCY_REGEX.test(s));
  if (['value', 'price', 'revenue', 'cost', 'amount', 'potential'].some(k => h.includes(k))) {
    return { type: 'potentialValue', confidence: 0.95 };
  }
  if (valueSamples.length / samples.length > 0.8) {
    return { type: 'potentialValue', confidence: 0.7 };
  }

  // 4. Appointment Date
  const dateSamples = samples.filter(s => DATE_REGEX.test(s) || !isNaN(Date.parse(s)));
  if (['date', 'time', 'appointment', 'visited', 'created'].some(k => h.includes(k))) {
    return { type: 'appointmentDate', confidence: 0.9 };
  }
  if (dateSamples.length / samples.length > 0.6) {
    return { type: 'appointmentDate', confidence: 0.75 };
  }

  // 5. Service / Treatment
  if (['service', 'treatment', 'procedure', 'type'].some(k => h.includes(k))) {
    return { type: 'service', confidence: 0.85 };
  }

  // 6. Status
  if (['status', 'stage', 'leadstatus'].some(k => h.includes(k))) {
    return { type: 'status', confidence: 0.85 };
  }

  return { type: 'unknown', confidence: 0 };
}

export function getAutoMappings(headers: string[], data: any[]): ColumnMapping[] {
  return headers.map(header => {
    const samples = data.slice(0, 5).map(row => row[header]);
    const { type, confidence } = inferColumnType(header, samples);
    return { header, type, confidence };
  });
}
