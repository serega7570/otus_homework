/** Функции из JavaScript преобразованы в TypeScript с явными типами. */

export const removePlus = (value: string): string => value.replace(/^\+/, '');

export const addPlus = (value: string): string => `+${value}`;

export const removeFirstZeros = (value: string): string => value.replace(/^(-)?[0]+(-?\d+.*)$/, '$1$2');

export const getBeautifulNumber = (
  value: string | number | null | undefined,
  separator = ' ',
): string | undefined => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);

export const round = (value: number, accuracy = 2): number => {
  const decimalFactor = 10 ** accuracy;
  return Math.round(value * decimalFactor) / decimalFactor;
};

const transformRegexp =
  /(matrix\(-?\d+(\.\d+)?, -?\d+(\.\d+)?, -?\d+(\.\d+)?, -?\d+(\.\d+)?, )(-?\d+(\.\d+)?), (-?\d+(\.\d+)?)\)/;

export type Transform = {
  x: number;
  y: number;
};

export const getTransformFromCss = (transformCssString: string): Transform => {
  const data = transformCssString.match(transformRegexp);
  if (!data) return { x: 0, y: 0 };
  return {
    x: parseInt(data[6], 10),
    y: parseInt(data[8], 10),
  };
};

export type RGB = [red: number, green: number, blue: number];

export const getColorContrastValue = ([red, green, blue]: RGB): number =>
  Math.round((red * 299 + green * 587 + blue * 114) / 1000);

export type ContrastColor = 'black' | 'white';

export const getContrastType = (contrastValue: number): ContrastColor =>
  contrastValue > 125 ? 'black' : 'white';

export const shortColorRegExp = /^#[0-9a-f]{3}$/i;
export const longColorRegExp = /^#[0-9a-f]{6}$/i;

export const checkColor = (color: string): void => {
  if (!longColorRegExp.test(color) && !shortColorRegExp.test(color)) {
    throw new Error(`invalid hex color: ${color}`);
  }
};

export const hex2rgb = (color: string): RGB => {
  checkColor(color);
  if (shortColorRegExp.test(color)) {
    const red = parseInt(color.substring(1, 2), 16);
    const green = parseInt(color.substring(2, 3), 16);
    const blue = parseInt(color.substring(3, 4), 16);
    return [red, green, blue];
  }
  const red = parseInt(color.substring(1, 3), 16);
  const green = parseInt(color.substring(3, 5), 16);
  const blue = parseInt(color.substring(5, 7), 16);
  return [red, green, blue];
};

export type NumberedValue<T> = {
  value: T;
  number: number;
};

export const getNumberedArray = <T>(arr: T[]): NumberedValue<T>[] =>
  arr.map((value, number) => ({ value, number }));

export const toStringArray = <T>(arr: NumberedValue<T>[]): string[] =>
  arr.map(({ value, number }) => `${String(value)}_${number}`);

export type Customer = {
  id: number;
  name: string;
  age: number;
  isSubscribed: boolean;
};

export type CustomerData = Omit<Customer, 'id'>;

export const transformCustomers = (customers: Customer[]): Record<number, CustomerData> =>
  customers.reduce<Record<number, CustomerData>>((result, customer) => {
    result[customer.id] = {
      name: customer.name,
      age: customer.age,
      isSubscribed: customer.isSubscribed,
    };
    return result;
  }, {});
