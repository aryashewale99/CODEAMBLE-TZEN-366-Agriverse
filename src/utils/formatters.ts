export const formatCurrency = (amount: number, currency = '₹'): string => {
  return `${currency}${amount.toLocaleString('en-IN')}`;
};

export const formatTemperature = (tempCelsius: number): string => {
  return `${Math.round(tempCelsius)}°C`;
};

export const formatPercentage = (val: number): string => {
  return `${Math.round(val)}%`;
};

export const formatDate = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
