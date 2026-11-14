import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { MOTION_OK, gsap } from '../lib/gsap';
import { SmartImage } from './SmartImage';
import { Eyebrow } from './ui';

interface PageHeroProps {
  eyebrow: string;
  index?: string;
  title: string[];
  accent?: number;
  intro?: ReactNode;
  photoId?: string;
  photoAlt?: string;
  children?: ReactNode;
  compact?: boolean;
}

/** Cabecera editorial para páginas internas, con entrada cinematográfica corta. */
export function PageHero({ eyebrow, index, title, accent, intro, photoId, photoAlt = '', children, compact }: PageHeroProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.from(el.querySelectorAll('[data-hero-img]'), { scale: 1.12, duration: 1.8, ease: 'power3.out' }, 0)
        .from(el.querySelectorAll('.reveal-line > span'), { yPercent: 115, duration: 1.1, stagger: 0.08 }, 0.1)
        .from(el.querySelectorAll('[data-hero-fade]'), { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.08 }, 0.45);
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={ref}
      className={`relative isolate flex items-end overflow-hidden ${compact ? 'min-h-[58svh]' : 'min-h-[72svh]'} pt-28 pb-14 md:pb-20`}
    >
      {photoId && (
        <div aria-hidden={!photoAlt} className="absolute inset-0 -z-10">
          <div data-hero-img className="absolute inset-0">
            <SmartImage photoId={photoId} alt={photoAlt} eager className="absolute inset-0" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-petrol via-petrol/75 to-petrol/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-petrol/80 via-transparent to-transparent" />
        </div>
      )}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hairline-grid opacity-40" />
      <div className="container-x relative w-full">
        <div data-hero-fade>
          <Eyebrow index={index}>{eyebrow}</Eyebrow>
        </div>
        <h1 className="display mt-6 max-w-5xl text-[clamp(3.4rem,10vw,9rem)]">
          <span className="sr-only">{title.join(' ')}</span>
          {title.map((line, i) => (
            <span key={i} className="reveal-line" aria-hidden>
              <span className={i === accent ? 'text-lime' : undefined}>{line}</span>
            </span>
          ))}
        </h1>
        {intro && (
          <div data-hero-fade className="mt-6 max-w-xl text-base leading-relaxed text-ice/75 md:text-lg">
            {intro}
          </div>
        )}
        {children && (
          <div data-hero-fade className="mt-8">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
