import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Vehicle } from '../data/types';
import { formatARS, formatKm } from '../lib/format';
import { SmartImage } from './SmartImage';

export function StatusBadge({ status }: { status: Vehicle['status'] }) {
  const styles: Record<Vehicle['status'], string> = {
    Disponible: 'bg-lime text-petrol',
    'Nuevo ingreso': 'bg-ice text-petrol',
    Reservado: 'bg-petrol/80 text-ice border border-ice/30',
  };
  return (
    <span className={`inline-block px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.18em] ${styles[status]}`}>
      {status}
    </span>
  );
}

interface VehicleCardProps {
  vehicle: Vehicle;
  sizes?: string;
  headingLevel?: 'h2' | 'h3';
  className?: string;
}

export function VehicleCard({ vehicle: v, sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw', headingLevel: H = 'h3', className = '' }: VehicleCardProps) {
  return (
    <article className={`group relative flex flex-col bg-graphite/40 transition-colors duration-500 hover:bg-graphite/80 ${className}`}>
      <div className="relative">
        <SmartImage
          photoId={v.images[0].photoId}
          alt={v.images[0].alt}
          ratio={0.66}
          sizes={sizes}
          widths={[480, 720, 960]}
          className="aspect-[3/2]"
          imgClassName="transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.06]"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-petrol/70 via-transparent to-transparent" />
        <div className="absolute left-4 top-4">
          <StatusBadge status={v.status} />
        </div>
        <p className="absolute bottom-4 left-4 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ice/85">
          {v.year} · {formatKm(v.km)}
        </p>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="eyebrow text-steel">{v.brand}</p>
        <H className="display mt-2 text-[2.1rem] leading-[0.95] text-ice">
          <Link to={`/vehiculos/${v.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {v.model} <span className="text-ice/55">{v.version}</span>
          </Link>
        </H>
        <dl className="mt-4 mb-6 flex flex-wrap gap-x-4 gap-y-1 text-xs text-steel">
          <div className="flex gap-1">
            <dt className="sr-only">Combustible</dt>
            <dd>{v.fuel}</dd>
          </div>
          <div className="flex gap-1">
            <dt className="sr-only">Transmisión</dt>
            <dd>{v.transmission}</dd>
          </div>
          <div className="flex gap-1">
            <dt className="sr-only">Potencia</dt>
            <dd>{v.power} CV</dd>
          </div>
        </dl>
        <div className="mt-auto flex items-end justify-between gap-4 border-t border-ice/10 pt-5">
          <div>
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-steel">Precio de ejemplo</p>
            <p className="mt-1 text-lg font-semibold tracking-tight text-ice sm:text-xl">{formatARS(v.price)}</p>
          </div>
          <span
            aria-hidden
            className="inline-flex size-10 shrink-0 items-center justify-center border border-ice/20 text-ice transition-all duration-500 ease-out-expo group-hover:border-lime group-hover:bg-lime group-hover:text-petrol"
          >
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
      {/* foco visible para la tarjeta completa */}
      <span aria-hidden className="pointer-events-none absolute inset-0 ring-lime ring-offset-2 ring-offset-petrol group-has-[a:focus-visible]:ring-2" />
    </article>
  );
}
