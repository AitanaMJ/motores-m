const ars = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
const num = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 });

export const formatARS = (value: number): string => ars.format(Math.round(value));
export const formatNumber = (value: number): string => num.format(Math.round(value));
export const formatKm = (value: number): string => `${num.format(value)} km`;

/** "$ 120 M" para etiquetas compactas */
export function formatMillions(value: number): string {
  return `$ ${num.format(Math.round(value / 1_000_000))} M`;
}
