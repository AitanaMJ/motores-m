import { describe, expect, it } from 'vitest';
import { vehicles } from '../data/vehicles';
import {
  DEFAULT_FILTERS,
  applyFilters,
  countActiveFilters,
  filterVehicles,
  filtersFromParams,
  filtersToParams,
  matchesQuery,
  sortVehicles,
  type VehicleFilters,
} from './filters';

const f = (patch: Partial<VehicleFilters>): VehicleFilters => ({ ...DEFAULT_FILTERS, ...patch });

describe('datos del catálogo', () => {
  it('tiene 12 vehículos con slugs únicos y las 8 marcas pedidas', () => {
    expect(vehicles).toHaveLength(12);
    expect(new Set(vehicles.map((v) => v.slug)).size).toBe(12);
    expect(new Set(vehicles.map((v) => v.brand)).size).toBe(8);
    vehicles.forEach((v) => expect(v.images.length).toBeGreaterThanOrEqual(3));
  });
});

describe('búsqueda textual', () => {
  it('ignora mayúsculas, tildes y guiones', () => {
    const merc = vehicles.find((v) => v.brand === 'Mercedes-Benz')!;
    expect(matchesQuery(merc, 'mercedes benz')).toBe(true);
    expect(matchesQuery(merc, 'MERCEDES')).toBe(true);
    const tesla = vehicles.find((v) => v.brand === 'Tesla')!;
    expect(matchesQuery(tesla, 'model 3')).toBe(true);
    expect(matchesQuery(tesla, 'model3')).toBe(true);
    expect(matchesQuery(tesla, 'porsche')).toBe(false);
  });

  it('exige todas las palabras', () => {
    const r = filterVehicles(vehicles, f({ q: 'bmw m4' }));
    expect(r.map((v) => v.model)).toEqual(['M4']);
  });
});

describe('filtros combinados', () => {
  it('sin filtros devuelve todo', () => {
    expect(filterVehicles(vehicles, DEFAULT_FILTERS)).toHaveLength(12);
  });

  it('marca + precio máximo', () => {
    const r = filterVehicles(vehicles, f({ brand: 'Porsche', maxPrice: 300_000_000 }));
    expect(r.every((v) => v.brand === 'Porsche' && v.price <= 300_000_000)).toBe(true);
    expect(r.map((v) => v.model)).toEqual(['Panamera']);
  });

  it('combustible + transmisión + kilometraje + año', () => {
    const r = filterVehicles(vehicles, f({ fuel: 'Nafta', transmission: 'Automática', maxKm: 20_000, minYear: 2020 }));
    expect(r.length).toBeGreaterThan(0);
    r.forEach((v) => {
      expect(v.fuel).toBe('Nafta');
      expect(v.transmission).toBe('Automática');
      expect(v.km).toBeLessThanOrEqual(20_000);
      expect(v.year).toBeGreaterThanOrEqual(2020);
    });
  });

  it('marca + modelo', () => {
    const r = filterVehicles(vehicles, f({ brand: 'BMW', model: 'M5' }));
    expect(r).toHaveLength(1);
  });

  it('combinación imposible devuelve vacío', () => {
    expect(filterVehicles(vehicles, f({ fuel: 'Eléctrico', transmission: 'Manual' }))).toHaveLength(0);
  });
});

describe('ordenamiento', () => {
  it('precio ascendente y descendente', () => {
    const asc = sortVehicles(vehicles, 'precio-asc').map((v) => v.price);
    expect(asc).toEqual([...asc].sort((a, b) => a - b));
    const desc = sortVehicles(vehicles, 'precio-desc').map((v) => v.price);
    expect(desc).toEqual([...desc].sort((a, b) => b - a));
  });

  it('año descendente y kilometraje ascendente', () => {
    const years = sortVehicles(vehicles, 'anio-desc').map((v) => v.year);
    expect(years).toEqual([...years].sort((a, b) => b - a));
    const km = sortVehicles(vehicles, 'km-asc').map((v) => v.km);
    expect(km).toEqual([...km].sort((a, b) => a - b));
  });

  it('destacados primero sin mutar el array original', () => {
    const original = vehicles.map((v) => v.id);
    const r = sortVehicles(vehicles, 'destacados');
    const firstNonFeatured = r.findIndex((v) => !v.featured);
    expect(r.slice(firstNonFeatured).every((v) => !v.featured)).toBe(true);
    expect(vehicles.map((v) => v.id)).toEqual(original);
  });

  it('applyFilters filtra y ordena', () => {
    const r = applyFilters(vehicles, f({ fuel: 'Nafta', sort: 'precio-asc' }));
    expect(r.every((v) => v.fuel === 'Nafta')).toBe(true);
    expect(r[0].price).toBe(Math.min(...r.map((v) => v.price)));
  });
});

describe('sincronización con URL', () => {
  it('ida y vuelta conserva los filtros', () => {
    const filters = f({ q: 'gti', brand: 'Volkswagen', maxPrice: 50_000_000, minYear: 2010, maxKm: 100_000, transmission: 'Manual', sort: 'km-asc' });
    const params = filtersToParams(filters);
    expect(params.get('marca')).toBe('Volkswagen');
    expect(filtersFromParams(new URLSearchParams(params.toString()))).toEqual(filters);
  });

  it('omite valores por defecto y descarta valores inválidos', () => {
    expect(filtersToParams(DEFAULT_FILTERS).toString()).toBe('');
    const parsed = filtersFromParams(new URLSearchParams('precioMax=abc&orden=cualquiera&kmMax=-4'));
    expect(parsed.maxPrice).toBeNull();
    expect(parsed.maxKm).toBeNull();
    expect(parsed.sort).toBe('destacados');
  });

  it('cuenta filtros activos', () => {
    expect(countActiveFilters(DEFAULT_FILTERS)).toBe(0);
    expect(countActiveFilters(f({ brand: 'BMW', maxKm: 30_000, sort: 'precio-asc' }))).toBe(2);
  });
});
