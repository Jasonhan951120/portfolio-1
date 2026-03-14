export const formatCurrency = (amount: number, region: 'UK' | 'US') => {
  const symbol = region === 'UK' ? '£' : '$';
  return `${symbol}${amount.toLocaleString('en-GB')}`;
};

export const formatDate = (date: string | number | Date, region: 'UK' | 'US') => {
  const d = new Date(date);
  if (region === 'UK') {
    return d.toLocaleDateString('en-GB'); // DD/MM/YYYY
  }
  return d.toLocaleDateString('en-US'); // MM/DD/YYYY
};

export const getCurrencySymbol = (region: 'UK' | 'US') => {
  return region === 'UK' ? '£' : '$';
};
