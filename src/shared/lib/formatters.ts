const currencyFormatters = new Map<string, Intl.NumberFormat>();

export const formatCurrency = (value: number, maximumFractionDigits = 2, locale = 'ru-RU'): string => {
  const key = `${locale}:${maximumFractionDigits}`;
  let formatter = currencyFormatters.get(key);

  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits,
    });
    currencyFormatters.set(key, formatter);
  }

  return formatter.format(value);
};

const dateFormatters = new Map<string, Intl.DateTimeFormat>();

export const formatDate = (value: string, locale = 'ru-RU'): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  let formatter = dateFormatters.get(locale);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, { dateStyle: 'long' });
    dateFormatters.set(locale, formatter);
  }
  return formatter.format(date);
};
