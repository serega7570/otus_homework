const currencyFormatters = new Map<number, Intl.NumberFormat>();

export const formatCurrency = (value: number, maximumFractionDigits = 2): string => {
  let formatter = currencyFormatters.get(maximumFractionDigits);

  if (!formatter) {
    formatter = new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits,
    });
    currencyFormatters.set(maximumFractionDigits, formatter);
  }

  return formatter.format(value);
};

const dateFormatter = new Intl.DateTimeFormat('ru-RU', { dateStyle: 'long' });

export const formatDate = (value: string): string => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
};
