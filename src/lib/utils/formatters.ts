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

export const formatAuditTimestamp = (date: Date = new Date()) => {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZoneName: 'short'
  };
  
  const formatter = new Intl.DateTimeFormat('en-GB', options);
  const parts = formatter.formatToParts(date);
  
  const day = parts.find(p => p.type === 'day')?.value;
  const month = parts.find(p => p.type === 'month')?.value;
  const year = parts.find(p => p.type === 'year')?.value;
  const hour = parts.find(p => p.type === 'hour')?.value;
  const minute = parts.find(p => p.type === 'minute')?.value;
  const second = parts.find(p => p.type === 'second')?.value;
  const dayPeriod = parts.find(p => p.type === 'dayPeriod')?.value;
  const timeZoneName = parts.find(p => p.type === 'timeZoneName')?.value;

  return `[${day} ${month} ${year}, ${hour}:${minute}:${second} ${dayPeriod} ${timeZoneName}]`;
};
