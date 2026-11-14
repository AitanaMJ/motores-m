import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Vehicle } from '../data/types';
import { VehicleCard } from './VehicleCard';

/**
 * Carrusel nativo con scroll-snap: funciona con touch, trackpad y teclado.
 * Los controles desplazan de a una tarjeta y el indicador refleja la posición real.
 */
export function FeaturedCarousel({ items }: { items: Vehicle[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.children[0] as HTMLElement | undefined;
    const step = first ? first.offsetWidth + parseFloat(getComputedStyle(track).columnGap || '0') : 1;
    const max = track.scrollWidth - track.clientWidth;
    setAtStart(track.scrollLeft <= 4);
    setAtEnd(track.scrollLeft >= max - 4);
    setIndex(track.scrollLeft >= max - 4 ? items.length - 1 : Math.round(track.scrollLeft / step));
  }, [items.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    update();
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      track.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [update]);

  const scrollByCard = (dir: 1 | -1) => {
    const track = trackRef.current;
    const first = track?.children[0] as HTMLElement | undefined;
    if (!track || !first) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({ left: dir * (first.offsetWidth + 24), behavior: reduce ? 'auto' : 'smooth' });
  };

  const progress = items.length > 1 ? index / (items.length - 1) : 1;

  return (
    <div>
      <ul
        ref={trackRef}
        aria-label="Vehículos destacados"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            scrollByCard(1);
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            scrollByCard(-1);
          }
        }}
        className="no-scrollbar -mx-[clamp(16px,4.2vw,64px)] flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-[clamp(16px,4.2vw,64px)] px-[clamp(16px,4.2vw,64px)] pb-2 focus-visible:outline-offset-[-2px]"
      >
        {items.map((v) => (
          <li
            key={v.id}
            className="w-[84%] shrink-0 snap-start sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)]"
          >
            <VehicleCard vehicle={v} className="h-full" sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 84vw" />
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center gap-6">
        <p className="display min-w-[5.5rem] text-2xl tabular-nums text-ice" aria-live="polite">
          <span className="text-lime">{String(index + 1).padStart(2, '0')}</span>
          <span className="text-steel"> / {String(items.length).padStart(2, '0')}</span>
        </p>
        <div className="relative h-px flex-1 bg-ice/15" aria-hidden>
          <span
            className="absolute inset-y-0 left-0 bg-lime transition-[width] duration-500 ease-out-expo"
            style={{ width: `${Math.max(8, progress * 100)}%` }}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={atStart}
            aria-label="Vehículo anterior"
            className="inline-flex size-12 items-center justify-center border border-ice/20 text-ice transition-colors duration-300 hover:border-lime hover:bg-lime hover:text-petrol disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowLeft aria-hidden className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={atEnd}
            aria-label="Vehículo siguiente"
            className="inline-flex size-12 items-center justify-center border border-ice/20 text-ice transition-colors duration-300 hover:border-lime hover:bg-lime hover:text-petrol disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowRight aria-hidden className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
