import { useLayoutEffect, type DependencyList, type RefObject } from 'react';
import { DESKTOP, MOTION_OK, ScrollTrigger, gsap } from '../lib/gsap';
import { formatNumber } from '../lib/format';

/**
 * Animaciones declarativas por atributos dentro de un contenedor:
 *  - [data-lines]     → revelado por líneas (hijos .reveal-line > span)
 *  - [data-reveal]    → entrada con desplazamiento + opacidad (en lote)
 *  - [data-parallax]  → parallax moderado (solo ≥768px)
 *  - [data-counter]   → contador numérico (valor final en data-counter)
 *  - [data-wipe]      → revelado de imagen por clip-path
 * El contenido es visible por defecto: si no hay JS o se prefiere movimiento reducido,
 * no se oculta nada.
 */
export function useScrollAnimations(scope: RefObject<HTMLElement | null>, deps: DependencyList = []) {
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    const cleanups: (() => void)[] = [];

    // Entradas: solo dependen de la preferencia de movimiento (no se reinician al cambiar de ancho)
    mm.add(MOTION_OK, () => {
      root.querySelectorAll<HTMLElement>('[data-lines]').forEach((block) => {
        const lines = block.querySelectorAll('.reveal-line > span');
        if (!lines.length) return;
        gsap.from(lines, {
          yPercent: 115,
          duration: 1.1,
          ease: 'power4.out',
          stagger: 0.09,
          scrollTrigger: { trigger: block, start: 'top 94%', once: true },
        });
      });

      const reveals = root.querySelectorAll<HTMLElement>('[data-reveal]');
      if (reveals.length) {
        // Solo opacidad (no visibility): el contenido sigue siendo enfocable con teclado
        gsap.set(reveals, { opacity: 0, y: 36 });
        ScrollTrigger.batch(reveals, {
          start: 'top 94%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { opacity: 1, y: 0, duration: 1, stagger: 0.09, overwrite: true, clearProps: 'transform' }),
        });
        // Si el foco de teclado llega a un bloque aún oculto, se muestra de inmediato
        const onFocus = (e: FocusEvent) => {
          const block = (e.target as HTMLElement).closest<HTMLElement>('[data-reveal]');
          if (block && Number(getComputedStyle(block).opacity) < 1) gsap.to(block, { opacity: 1, y: 0, duration: 0.3, overwrite: true });
        };
        root.addEventListener('focusin', onFocus);
        cleanups.push(() => root.removeEventListener('focusin', onFocus));
      }

      root.querySelectorAll<HTMLElement>('[data-wipe]').forEach((el) => {
        gsap.from(el, {
          clipPath: 'inset(0 0 100% 0)',
          duration: 1.4,
          ease: 'power4.inOut',
          scrollTrigger: { trigger: el, start: 'top 98%', once: true },
        });
      });

      root.querySelectorAll<HTMLElement>('[data-counter]').forEach((el) => {
        const target = Number(el.dataset.counter);
        if (!Number.isFinite(target)) return;
        const suffix = el.dataset.suffix ?? '';
        const state = { v: 0 };
        el.textContent = `0${suffix}`;
        gsap.to(state, {
          v: target,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          onUpdate: () => {
            el.textContent = `${formatNumber(state.v)}${suffix}`;
          },
          onComplete: () => {
            el.textContent = `${formatNumber(target)}${suffix}`;
          },
        });
      });
    });

    // Parallax: solo escritorio/tablet horizontal, para no penalizar el scroll en móviles
    mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
      root.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
        const amount = Number(el.dataset.parallax) || 8;
        gsap.fromTo(
          el,
          { yPercent: -amount, scale: 1 + amount / 50 },
          {
            yPercent: amount,
            scale: 1 + amount / 50,
            ease: 'none',
            scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
          },
        );
      });
    });

    // Recalcular posiciones cuando terminan de cargar fuentes e imágenes
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh).catch(() => undefined);
    window.addEventListener('load', refresh);

    return () => {
      window.removeEventListener('load', refresh);
      cleanups.forEach((fn) => fn());
      mm.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
