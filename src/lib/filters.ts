import type { Vehicle } from '../data/types';

export type SortKey = 'destacados' | 'precio-asc' | 'precio-desc' | 'anio-desc' | 'km-asc';

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'destacados', label: 'Destacados' },
  { value: 'precio-asc', label: 'Precio: menor a mayor' },
  { value: 'precio-desc', label: 'Precio: mayor a menor' },
  { value: 'anio-desc', label: 'Año: más nuevos' },
  { value: 'km-asc', label: 'Kilometraje: menor a mayor' },
];

export interface VehicleFilters {
  q: string;
  brand: string;
  model: string;
  maxPrice: number | null;
  minYear: number | null;
  fuel: string;
  transmission: string;
  maxKm: number | null;
  sort: SortKey;
}

export const DEFAULT_FILTERS: VehicleFilters = {
  q: '',
  brand: '',
  model: '',
  maxPrice: null,
  minYear: null,
  fuel: '',
  transmission: '',
  maxKm: null,
  sort: 'destacados',
};

/** Minúsculas y sin tildes para comparar texto */
export function normalizeText(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

export function matchesQuery(v: Vehicle, query: string): boolean {
  const tokens = normalizeText(query).replace(/-/g, ' ').split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;
  const haystack = normalizeText(`${v.brand} ${v.model} ${v.version} ${v.body}`).replace(/-/g, ' ');
  const compact = haystack.replace(/\s+/g, '');
  return tokens.every((t) => haystack.includes(t) || compact.includes(t));
}

export function filterVehicles(list: Vehicle[], f: VehicleFilters): Vehicle[] {
  return list.filter(
    (v) =>
      matchesQuery(v, f.q) &&
      (!f.brand || v.brand === f.brand) &&
      (!f.model || v.model === f.model) &&
      (f.maxPrice === null || v.price <= f.maxPrice) &&
      (f.minYear === null || v.year >= f.minYear) &&
      (!f.fuel || v.fuel === f.fuel) &&
      (!f.transmission || v.transmission === f.transmission) &&
      (f.maxKm === null || v.km <= f.maxKm),
  );
}

export function sortVehicles(list: Vehicle[], sort: SortKey): Vehicle[] {
  const copy = [...list];
  switch (sort) {
    case 'precio-asc':
      return copy.sort((a, b) => a.price - b.price);
    case 'precio-desc':
      return copy.sort((a, b) => b.price - a.price);
    case 'anio-desc':
      return copy.sort((a, b) => b.year - a.year || a.km - b.km);
    case 'km-asc':
      return copy.sort((a, b) => a.km - b.km);
    default:
      // sort es estable: mantiene el orden original dentro de cada grupo
      return copy.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}

export function applyFilters(list: Vehicle[], f: VehicleFilters): Vehicle[] {
  return sortVehicles(filterVehicles(list, f), f.sort);
}

export function countActiveFilters(f: VehicleFilters): number {
  return [f.q.trim(), f.brand, f.model, f.maxPrice, f.minYear, f.fuel, f.transmission, f.maxKm].filter(
    (x) => x !== '' && x !== null,
  ).length;
}

/* ---------- Sincronización con la URL ---------- */

const PARAM = {
  q: 'q',
  brand: 'marca',
  model: 'modelo',
  maxPrice: 'precioMax',
  minYear: 'anioDesde',
  fuel: 'combustible',
  transmission: 'transmision',
  maxKm: 'kmMax',
  sort: 'orden',
} as const;

function positiveInt(value: string | null): number | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

export function filtersFromParams(params: URLSearchParams): VehicleFilters {
  const sort = params.get(PARAM.sort);
  const validSort = SORT_OPTIONS.find((o) => o.value === sort)?.value;
  return {
    q: (params.get(PARAM.q) ?? '').slice(0, 80),
    brand: params.get(PARAM.brand) ?? '',
    model: params.get(PARAM.model) ?? '',
    maxPrice: positiveInt(params.get(PARAM.maxPrice)),
    minYear: positiveInt(params.get(PARAM.minYear)),
    fuel: params.get(PARAM.fuel) ?? '',
    transmission: params.get(PARAM.transmission) ?? '',
    maxKm: positiveInt(params.get(PARAM.maxKm)),
    sort: validSort ?? 'destacados',
  };
}

export function filtersToParams(f: VehicleFilters): URLSearchParams {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set(PARAM.q, f.q.trim());
  if (f.brand) p.set(PARAM.brand, f.brand);
  if (f.model) p.set(PARAM.model, f.model);
  if (f.maxPrice !== null) p.set(PARAM.maxPrice, String(f.maxPrice));
  if (f.minYear !== null) p.set(PARAM.minYear, String(f.minYear));
  if (f.fuel) p.set(PARAM.fuel, f.fuel);
  if (f.transmission) p.set(PARAM.transmission, f.transmission);
  if (f.maxKm !== null) p.set(PARAM.maxKm, String(f.maxKm));
  if (f.sort !== 'destacados') p.set(PARAM.sort, f.sort);
  return p;
}
