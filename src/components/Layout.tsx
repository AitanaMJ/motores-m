import { Suspense, useLayoutEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { MOTION_OK, ScrollTrigger, gsap } from '../lib/gsap';

export function Layout() {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  // Al cambiar de página: scroll arriba, transición corta de entrada y recálculo de triggers
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    const el = mainRef.current;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      if (el) gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: 'power2.out', clearProps: 'opacity,visibility' });
    });
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => {
      window.clearTimeout(id);
      mm.revert();
    };
  }, [pathname]);

  return (
    <>
      <Header />
      <main id="contenido" ref={mainRef} tabIndex={-1} className="outline-none">
        <Suspense fallback={<div className="min-h-[100svh]" role="status" aria-label="Cargando página" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
