import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { BRANDS, FUELS, KM_OPTIONS, PRICE_OPTIONS, TRANSMISSIONS, getModelsByBrand, getYearOptions, vehicles } from '../data/vehicles';
import {
  DEFAULT_FILTERS,
  SORT_OPTIONS,
  applyFilters,
  countActiveFilters,
  filtersFromParams,
  filtersToParams,
  type SortKey,
  type VehicleFilters,
} from '../lib/filters';
import { formatMillions, formatNumber } from '../lib/format';
import { MOTION_OK, ScrollTrigger, gsap } from '../lib/gsap';
import { PageHero } from '../components/PageHero';
import { VehicleCard } from '../components/VehicleCard';
import { Button } from '../components/ui';

export default function Catalog() {
  usePageMeta(
    'Catálogo de vehículos',
    'Catálogo de demostración de MOTORES M.: filtrá por marca, modelo, precio, año, combustible, transmisión y kilometraje.',
  );
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => filtersFromParams(params), [params]);
  const results = useMemo(() => applyFilters(vehicles, filters), [filters]);
  const active = countActiveFilters(filters);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const gridRef = useRef<HTMLUListElement>(null);

  // Búsqueda textual con estado local (debounce) para no reescribir la URL en cada tecla
  const [query, setQuery] = useState(filters.q);
  useEffect(() => setQuery(filters.q), [filters.q]);
  useEffect(() => {
    if (query === filters.q) return;
    const id = window.setTimeout(() => update({ q: query }), 250);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function update(patch: Partial<VehicleFilters>) {
    const next = { ...filters, ...patch };
    // si cambia la marca y el modelo ya no corresponde, se limpia
    if (patch.brand !== undefined && next.model && !getModelsByBrand(next.brand).includes(next.model)) next.model = '';
    setParams(filtersToParams(next), { replace: true, preventScrollReset: true });
  }

  function clearAll() {
    setQuery('');
    setParams(filtersToParams({ ...DEFAULT_FILTERS, sort: filters.sort }), { replace: true, preventScrollReset: true });
  }

  // Entrada coordinada de resultados al filtrar
  const resultKey = results.map((v) => v.id).join('|');
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.fromTo(grid.children, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.05, ease: 'power3.out', clearProps: 'all' });
    });
    ScrollTrigger.refresh();
    return () => mm.revert();
  }, [resultKey]);

  const filterPanel = (
    <FilterPanel filters={filters} query={query} setQuery={setQuery} update={update} idPrefix={drawerOpen ? 'm' : 'd'} />
  );

  return (
    <>
      <PageHero
        compact
        eyebrow="Catálogo de demostración"
        title={['El catálogo']}
        intro={
          <>
            {vehicles.length} unidades de ejemplo de {BRANDS.length} marcas. Combiná filtros, ordená y encontrá el tuyo. Los
            datos y precios son ficticios.
          </>
        }
      />

      <section aria-label="Resultados del catálogo" className="container-x pb-28">
        {/* Barra superior */}
        <div className="sticky top-16 z-30 -mx-[clamp(16px,4.2vw,64px)] mb-8 flex flex-wrap items-center justify-between gap-3 border-y border-ice/10 bg-petrol/90 px-[clamp(16px,4.2vw,64px)] py-3 backdrop-blur-md">
          <p className="w-full text-sm text-ice/80 sm:w-auto" aria-live="polite" aria-atomic="true">
            <span className="display mr-1.5 text-2xl text-lime align-[-2px]">{String(results.length).padStart(2, '0')}</span>
            {results.length === 1 ? 'vehículo encontrado' : 'vehículos encontrados'}
          </p>
          <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-haspopup="dialog"
              className="inline-flex h-11 shrink-0 items-center gap-2 border border-ice/20 px-4 text-xs font-semibold uppercase tracking-[0.16em] transition-colors hover:border-lime hover:text-lime lg:hidden"
            >
              <SlidersHorizontal aria-hidden className="size-4" />
              Filtros
              {active > 0 && <span className="inline-flex size-5 items-center justify-center bg-lime text-[0.65rem] text-petrol">{active}</span>}
            </button>
            <label htmlFor="sort" className="sr-only">
              Ordenar por
            </label>
            <select
              id="sort"
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value as SortKey })}
              className="field !h-11 min-w-0 flex-1 cursor-pointer text-sm sm:!w-auto sm:flex-none"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr]">
          {/* Filtros escritorio */}
          <aside aria-label="Filtros" className="hidden lg:block">
            <div className="sticky top-36 max-h-[calc(100svh-10rem)] overflow-y-auto pr-2">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="eyebrow text-ice">Filtrar</h2>
                <ClearButton active={active} onClick={clearAll} />
              </div>
              {!drawerOpen && filterPanel}
            </div>
          </aside>

          {/* Resultados */}
          <div className="min-w-0">
            {active > 0 && <ActiveChips filters={filters} update={update} clearAll={clearAll} />}
            {results.length > 0 ? (
              <ul ref={gridRef} className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((v) => (
                  <li key={v.id}>
                    <VehicleCard vehicle={v} headingLevel="h2" className="h-full" sizes="(min-width: 1280px) 26vw, (min-width: 640px) 40vw, 100vw" />
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState onClear={clearAll} />
            )}
          </div>
        </div>
      </section>

      {drawerOpen && (
        <FilterDrawer onClose={closeDrawer} count={results.length} active={active} onClear={clearAll}>
          {filterPanel}
        </FilterDrawer>
      )}
    </>
  );
}

/* ---------------- Panel de filtros ---------------- */

function FilterPanel({
  filters,
  query,
  setQuery,
  update,
  idPrefix,
}: {
  filters: VehicleFilters;
  query: string;
  setQuery: (q: string) => void;
  update: (patch: Partial<VehicleFilters>) => void;
  idPrefix: string;
}) {
  const models = getModelsByBrand(filters.brand);
  const years = getYearOptions();
  const id = (name: string) => `${idPrefix}-${name}`;

  return (
    <div className="space-y-7">
      <div>
        <label htmlFor={id('q')} className="eyebrow mb-3 block text-steel">
          Marca o modelo
        </label>
        <div className="relative">
          <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-steel" />
          <input
            id={id('q')}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ej.: Mustang"
            autoComplete="off"
            className="field !pl-11"
          />
        </div>
      </div>

      <SelectFilter id={id('brand')} label="Marca" value={filters.brand} onChange={(v) => update({ brand: v, model: '' })}>
        <option value="">Todas</option>
        {BRANDS.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </SelectFilter>

      <SelectFilter id={id('model')} label="Modelo" value={filters.model} onChange={(v) => update({ model: v })}>
        <option value="">{filters.brand ? `Todos los ${filters.brand}` : 'Todos'}</option>
        {models.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </SelectFilter>

      <SelectFilter
        id={id('price')}
        label="Precio máximo"
        value={filters.maxPrice?.toString() ?? ''}
        onChange={(v) => update({ maxPrice: v ? Number(v) : null })}
      >
        <option value="">Sin límite</option>
        {PRICE_OPTIONS.map((p) => (
          <option key={p} value={p}>
            Hasta {formatMillions(p)}
          </option>
        ))}
      </SelectFilter>

      <SelectFilter id={id('year')} label="Año desde" value={filters.minYear?.toString() ?? ''} onChange={(v) => update({ minYear: v ? Number(v) : null })}>
        <option value="">Cualquier año</option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y} o posterior
          </option>
        ))}
      </SelectFilter>

      <SelectFilter id={id('km')} label="Kilometraje máximo" value={filters.maxKm?.toString() ?? ''} onChange={(v) => update({ maxKm: v ? Number(v) : null })}>
        <option value="">Sin límite</option>
        {KM_OPTIONS.map((k) => (
          <option key={k} value={k}>
            Hasta {formatNumber(k)} km
          </option>
        ))}
      </SelectFilter>

      <ChipGroup label="Combustible" options={FUELS} value={filters.fuel} onChange={(v) => update({ fuel: v })} />
      <ChipGroup label="Transmisión" options={TRANSMISSIONS} value={filters.transmission} onChange={(v) => update({ transmission: v })} />
    </div>
  );
}

function SelectFilter({ id, label, value, onChange, children }: { id: string; label: string; value: string; onChange: (v: string) => void; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow mb-3 block text-steel">
        {label}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="field cursor-pointer">
        {children}
      </select>
    </div>
  );
}

function ChipGroup({ label, options, value, onChange }: { label: string; options: readonly string[]; value: string; onChange: (v: string) => void }) {
  return (
    <fieldset>
      <legend className="eyebrow mb-3 text-steel">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {['', ...options].map((opt) => {
          const selected = value === opt;
          return (
            <button
              key={opt || 'todos'}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(opt)}
              className={`h-11 border px-4 text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-300 ${
                selected ? 'border-lime bg-lime text-petrol' : 'border-ice/15 text-ice/80 hover:border-ice/50 hover:text-ice'
              }`}
            >
              {opt || 'Todos'}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function ClearButton({ active, onClick }: { active: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={active === 0}
      className="inline-flex min-h-10 items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-lime transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:text-steel disabled:opacity-60"
    >
      <RotateCcw aria-hidden className="size-3.5" />
      Limpiar filtros
    </button>
  );
}

function ActiveChips({ filters, update, clearAll }: { filters: VehicleFilters; update: (p: Partial<VehicleFilters>) => void; clearAll: () => void }) {
  const chips: { label: string; clear: Partial<VehicleFilters> }[] = [];
  if (filters.q.trim()) chips.push({ label: `“${filters.q.trim()}”`, clear: { q: '' } });
  if (filters.brand) chips.push({ label: filters.brand, clear: { brand: '', model: '' } });
  if (filters.model) chips.push({ label: filters.model, clear: { model: '' } });
  if (filters.maxPrice !== null) chips.push({ label: `Hasta ${formatMillions(filters.maxPrice)}`, clear: { maxPrice: null } });
  if (filters.minYear !== null) chips.push({ label: `Desde ${filters.minYear}`, clear: { minYear: null } });
  if (filters.maxKm !== null) chips.push({ label: `Hasta ${formatNumber(filters.maxKm)} km`, clear: { maxKm: null } });
  if (filters.fuel) chips.push({ label: filters.fuel, clear: { fuel: '' } });
  if (filters.transmission) chips.push({ label: filters.transmission, clear: { transmission: '' } });

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {chips.map((c) => (
        <button
          key={c.label}
          type="button"
          onClick={() => update(c.clear)}
          className="group inline-flex h-10 items-center gap-2 border border-ice/15 bg-graphite/50 pl-3 pr-2 text-xs text-ice/90 transition-colors hover:border-lime"
          aria-label={`Quitar filtro ${c.label}`}
        >
          {c.label}
          <X aria-hidden className="size-3.5 text-steel group-hover:text-lime" />
        </button>
      ))}
      <button type="button" onClick={clearAll} className="ml-1 inline-flex h-10 items-center px-1 text-xs font-semibold uppercase tracking-[0.14em] text-lime hover:underline underline-offset-4">
        Limpiar todo
      </button>
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="relative overflow-hidden border border-dashed border-ice/15 px-6 py-20 text-center">
      <p aria-hidden className="display pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-[clamp(6rem,20vw,14rem)] text-ice/[0.03]">
        Sin resultados
      </p>
      <h2 className="display relative text-5xl">Ningún auto coincide</h2>
      <p className="relative mx-auto mt-4 max-w-md text-ice/70">
        Probá ampliar el precio o el kilometraje, o quitá alguno de los filtros activos para ver más opciones.
      </p>
      <Button onClick={onClear} className="relative mt-8">
        <RotateCcw aria-hidden className="size-4" />
        Limpiar filtros
      </Button>
    </div>
  );
}

/* ---------------- Drawer móvil ---------------- */

function FilterDrawer({
  children,
  onClose,
  count,
  active,
  onClear,
}: {
  children: ReactNode;
  onClose: () => void;
  count: number;
  active: number;
  onClear: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>('button')?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && panelRef.current) {
        const f = [...panelRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input, select')];
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const onResize = () => window.innerWidth >= 1024 && onClose();
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      opener?.focus();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <div className="animate-fade-in absolute inset-0 bg-petrol-deep/80 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="animate-slide-in-left absolute inset-y-0 left-0 flex w-[min(420px,92vw)] flex-col border-r border-ice/10 bg-petrol"
      >
        <div className="flex items-center justify-between border-b border-ice/10 px-5 py-4">
          <h2 id="drawer-title" className="display text-3xl">
            Filtros
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar filtros"
            className="inline-flex size-11 items-center justify-center border border-ice/20 transition-colors hover:border-lime hover:text-lime"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-6">{children}</div>
        <div className="grid grid-cols-2 gap-3 border-t border-ice/10 p-5">
          <Button variant="outline" onClick={onClear} disabled={active === 0} className="!px-3">
            Limpiar
          </Button>
          <Button onClick={onClose} className="!px-3">
            Ver {count} {count === 1 ? 'auto' : 'autos'}
          </Button>
        </div>
      </div>
    </div>
  );
}
