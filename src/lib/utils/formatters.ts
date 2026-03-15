export const formatCurrency = (amount: number, region: 'UK' | 'US') => {
  return new Intl.NumberFormat(region === 'UK' ? 'en-GB' : 'en-US', {
    style: 'currency',
    currency: region === 'UK' ? 'GBP' : 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string | number | Date, region: 'UK' | 'US') => {
  const d = new Date(date);
  return d.toLocaleDateString(region === 'UK' ? 'en-GB' : 'en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const getCurrencySymbol = (region: 'UK' | 'US') => {
  return region === 'UK' ? '£' : '$';
};

export const sanitizeString = (str: string) => {
  if (!str) return str;
  return str
    .replace(/\\u0026/gi, '&')
    .replace(/\\U0026/gi, '&')
    .replace(/&amp;/gi, '&')
    .replace(/\\u0027/gi, "'")
    .replace(/\\U0027/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/\\u0022/gi, '"')
    .replace(/\\U0022/gi, '"')
    .replace(/&quot;/gi, '"');
};
