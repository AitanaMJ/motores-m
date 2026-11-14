import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { ButtonLink } from './ui';
import { prefersReducedMotion } from '../lib/gsap';

export const NAV_LINKS = [
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/vende-tu-auto', label: 'Vendé tu auto' },
  { to: '/financiacion', label: 'Financiación' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/contacto', label: 'Contacto' },
];

const MOBILE_LINKS = [{ to: '/', label: 'Inicio' }, ...NAV_LINKS];
const CLOSE_MS = 320;
/** Breakpoint a partir del cual se muestra la navegación de escritorio (lg) */
const DESKTOP_MIN = 1024;

type MenuState = 'closed' | 'open' | 'closing';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState<MenuState>('closed');
  const location = useLocation();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const isOpen = menu === 'open';
  const isMounted = menu !== 'closed';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = useCallback((restoreFocus = true) => {
    setMenu((m) => (m === 'open' ? (prefersReducedMotion() ? 'closed' : 'closing') : m));
    if (restoreFocus) toggleRef.current?.focus({ preventScroll: true });
  }, []);

  // Fin de la animación de salida
  useEffect(() => {
    if (menu !== 'closing') return;
    const id = window.setTimeout(() => setMenu('closed'), CLOSE_MS);
    return () => window.clearTimeout(id);
  }, [menu]);

  // Cerrar al cambiar de ruta (sin mover el foco: la página nueva lo gestiona)
  useEffect(() => closeMenu(false), [location.pathname, closeMenu]);

  // Mientras el menú está abierto: bloqueo de scroll, inert del resto, Escape, focus trap, resize
  useEffect(() => {
    if (!isOpen) return;
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    const scrollbar = window.innerWidth - html.clientWidth;
    html.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    const inertTargets = [document.getElementById('contenido'), document.querySelector('footer')].filter(Boolean) as HTMLElement[];
    inertTargets.forEach((el) => el.setAttribute('inert', ''));

    panelRef.current?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusables = [toggleRef.current, ...panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')].filter(
        Boolean,
      ) as HTMLElement[];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const inside = focusables.includes(active as HTMLElement);
      if (e.shiftKey && (active === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth >= DESKTOP_MIN) setMenu('closed');
    };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
      document.body.style.paddingRight = '';
      inertTargets.forEach((el) => el.removeAttribute('inert'));
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [isOpen, closeMenu]);

  const solid = scrolled || isMounted;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-500 ${
          solid ? 'border-ice/8 bg-petrol/90 supports-[backdrop-filter]:bg-petrol/80 supports-[backdrop-filter]:backdrop-blur-md' : 'border-transparent bg-transparent'
        } ${isMounted ? '!bg-petrol !backdrop-blur-none' : ''}`}
      >
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:bg-lime focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-petrol"
        >
          Saltar al contenido
        </a>
        <div className={`container-x flex items-center justify-between gap-4 transition-[height] duration-500 ${scrolled || isMounted ? 'h-16' : 'h-[72px] md:h-20'}`}>
          <Logo />

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-7 xl:gap-9">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `group relative whitespace-nowrap py-2 text-[0.74rem] font-medium uppercase tracking-[0.14em] transition-colors duration-300 xl:text-[0.78rem] xl:tracking-[0.16em] ${
                        isActive ? 'text-ice' : 'text-ice/65 hover:text-ice'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {link.label}
                        <span
                          aria-hidden
                          className={`absolute -bottom-0.5 left-0 h-[2px] w-full origin-left bg-lime transition-transform duration-500 ease-out-expo ${
                            isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                          }`}
                        />
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <ButtonLink to="/catalogo" className="!h-10 !px-5" tabIndex={isOpen ? -1 : undefined}>
                Ver autos
              </ButtonLink>
            </div>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => (isOpen ? closeMenu() : setMenu('open'))}
              aria-expanded={isOpen}
              aria-controls="menu-movil"
              aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
              className={`relative inline-flex size-11 items-center justify-center border transition-colors duration-300 lg:hidden ${
                isOpen ? 'border-lime bg-lime text-petrol' : 'border-ice/20 text-ice hover:border-lime hover:text-lime'
              }`}
            >
              <Menu aria-hidden className={`absolute size-5 transition-all duration-300 ease-out-expo ${isOpen ? 'rotate-90 scale-50 opacity-0' : 'opacity-100'}`} />
              <X aria-hidden className={`absolute size-5 transition-all duration-300 ease-out-expo ${isOpen ? 'opacity-100' : '-rotate-90 scale-50 opacity-0'}`} />
            </button>
          </div>
        </div>
      </header>

      {/*
        El panel se renderiza en un portal sobre <body>: si quedara dentro del <header>, el
        backdrop-filter del header (o un transform de GSAP en un ancestro) lo convertiría en el
        containing block de este elemento fixed y el panel quedaría recortado a la altura del header.
      */}
      {isMounted &&
        createPortal(
          <div
            id="menu-movil"
            ref={panelRef}
            data-state={menu}
            className="mobile-menu fixed inset-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-petrol pt-16 lg:hidden"
          >
            <div aria-hidden className="pointer-events-none absolute inset-0 hairline-grid opacity-50" />
            <div aria-hidden className="mobile-menu-accent pointer-events-none absolute left-0 top-16 h-[3px] w-full origin-left bg-lime" />
            <nav aria-label="Menú móvil" className="container-x relative flex flex-1 flex-col justify-between gap-10 py-8 md:py-12">
              <ul className="border-t border-ice/10">
                {MOBILE_LINKS.map((link, i) => (
                  <li key={link.to} className="mobile-menu-item border-b border-ice/10" style={{ animationDelay: `${120 + i * 55}ms` }}>
                    <MobileLink to={link.to} label={link.label} index={String(i).padStart(2, '0')} onNavigate={() => closeMenu(false)} />
                  </li>
                ))}
              </ul>
              <div className="mobile-menu-item space-y-4 md:flex md:items-end md:justify-between md:gap-10 md:space-y-0" style={{ animationDelay: '480ms' }}>
                <ButtonLink to="/catalogo" className="w-full md:w-auto" onClick={() => closeMenu(false)}>
                  Explorar vehículos
                </ButtonLink>
                <p className="max-w-sm text-xs leading-relaxed text-steel">
                  MOTORES M. es una concesionaria ficticia. Sitio de demostración desarrollado por GAP Programming.
                </p>
              </div>
            </nav>
          </div>,
          document.body,
        )}
    </>
  );
}

function MobileLink({ to, label, index, onNavigate }: { to: string; label: string; index: string; onNavigate: () => void }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      onClick={onNavigate}
      className={({ isActive }) =>
        `group flex min-h-[64px] items-center justify-between gap-4 py-3 transition-colors duration-300 md:min-h-[84px] ${
          isActive ? 'text-lime' : 'text-ice hover:text-lime'
        }`
      }
    >
      <span className="flex min-w-0 items-baseline gap-4 md:gap-6">
        <span className="eyebrow w-6 shrink-0 text-steel">{index}</span>
        <span className="display truncate text-[clamp(2.2rem,8vw,4rem)] leading-none">{label}</span>
      </span>
      <ArrowUpRight aria-hidden className="size-6 shrink-0 transition-transform duration-300 ease-out-expo group-hover:-translate-y-1 group-hover:translate-x-1" />
    </NavLink>
  );
}
