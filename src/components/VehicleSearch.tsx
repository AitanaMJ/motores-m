import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { BRANDS, PRICE_OPTIONS } from '../data/vehicles';
import { DEFAULT_FILTERS, filtersToParams } from '../lib/filters';
import { formatMillions } from '../lib/format';

/** Buscador principal del Home: redirige al catálogo con los filtros en la URL. */
export function VehicleSearch() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [brand, setBrand] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const params = filtersToParams({ ...DEFAULT_FILTERS, q, brand, maxPrice: maxPrice ? Number(maxPrice) : null });
    const qs = params.toString();
    navigate(`/catalogo${qs ? `?${qs}` : ''}`);
  };

  return (
    <form
      onSubmit={submit}
      role="search"
      aria-label="Buscar vehículos"
      className="grid gap-px border border-ice/12 bg-ice/10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto]"
    >
      <div className="relative bg-petrol">
        <label htmlFor="search-q" className="eyebrow absolute left-5 top-4 text-steel">
          Buscar
        </label>
        <input
          id="search-q"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Marca o modelo, ej.: 911"
          autoComplete="off"
          className="h-[72px] w-full min-w-0 md:h-[76px] bg-transparent px-5 pt-6 text-base text-ice placeholder:text-ice/35 focus-visible:outline-none focus-visible:bg-graphite/60 focus-visible:shadow-[inset_0_-2px_0_#C6FF35]"
        />
      </div>
      <div className="relative bg-petrol">
        <label htmlFor="search-brand" className="eyebrow absolute left-5 top-4 text-steel">
          Marca
        </label>
        <select
          id="search-brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="h-[72px] w-full min-w-0 md:h-[76px] cursor-pointer bg-transparent px-5 pt-6 text-base text-ice focus-visible:outline-none focus-visible:bg-graphite/60 focus-visible:shadow-[inset_0_-2px_0_#C6FF35]"
        >
          <option value="">Todas las marcas</option>
          {BRANDS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
      <div className="relative bg-petrol">
        <label htmlFor="search-price" className="eyebrow absolute left-5 top-4 text-steel">
          Precio máximo
        </label>
        <select
          id="search-price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="h-[72px] w-full min-w-0 md:h-[76px] cursor-pointer bg-transparent px-5 pt-6 text-base text-ice focus-visible:outline-none focus-visible:bg-graphite/60 focus-visible:shadow-[inset_0_-2px_0_#C6FF35]"
        >
          <option value="">Sin límite</option>
          {PRICE_OPTIONS.map((p) => (
            <option key={p} value={p}>
              Hasta {formatMillions(p)}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="group flex min-h-16 items-center justify-center gap-3 bg-lime px-8 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-petrol transition-colors duration-300 hover:bg-ice lg:min-h-0"
      >
        <Search aria-hidden className="size-4 transition-transform duration-300 group-hover:scale-110" />
        Buscar
      </button>
    </form>
  );
}
