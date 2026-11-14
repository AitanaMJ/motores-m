import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { Logo } from './Logo';
import { NAV_LINKS } from './Header';
import { BRANDS } from '../data/vehicles';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-ice/10 bg-petrol-deep">
      <div className="container-x pt-20 pb-10">
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-steel">
              Una concesionaria ficticia de autos premium y deportivos, creada para mostrar una experiencia digital de alto
              nivel. Elegí, compará y simulá: todo en un mismo lugar.
            </p>
            <p className="display mt-10 text-[clamp(2.6rem,6vw,4.5rem)] text-ice/90">
              Sentí la <span className="text-lime">potencia.</span>
            </p>
          </div>

          <nav aria-label="Secciones" className="lg:col-span-2">
            <h2 className="eyebrow text-steel">Secciones</h2>
            <ul className="mt-4 space-y-1 text-sm">
              <li>
                <Link to="/" className="inline-flex min-h-8 items-center text-ice/80 transition-colors hover:text-lime">
                  Inicio
                </Link>
              </li>
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="inline-flex min-h-8 items-center text-ice/80 transition-colors hover:text-lime">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Marcas del catálogo" className="lg:col-span-2">
            <h2 className="eyebrow text-steel">Marcas en catálogo</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 text-sm lg:grid-cols-1">
              {BRANDS.map((b) => (
                <li key={b}>
                  <Link to={`/catalogo?marca=${encodeURIComponent(b)}`} className="inline-flex min-h-8 items-center text-ice/80 transition-colors hover:text-lime">
                    {b}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="eyebrow text-steel">Contacto</h2>
            <p className="mt-5 text-sm leading-relaxed text-ice/80">
              Las consultas se realizan mediante el{' '}
              <Link to="/contacto" className="text-lime underline-offset-4 hover:underline">
                formulario de contacto
              </Link>
              . Al ser una demo, no publicamos dirección, teléfono ni redes sociales.
            </p>
            <div className="mt-8 border border-ice/10 p-4 text-xs leading-relaxed text-steel">
              <strong className="font-semibold text-ice/85">Aviso de demostración.</strong> Marcas y modelos se mencionan
              solo como ejemplo, sin relación comercial. Precios, kilometrajes, testimonios y cifras son ficticios.
              Fotografías ilustrativas de Unsplash.
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-ice/10 pt-8 text-xs text-steel sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} MOTORES M. · Marca ficticia</p>
          <p>
            Demo desarrollada por <span className="font-semibold text-ice/85">GAP Programming</span>
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group inline-flex min-h-11 items-center gap-2 self-start uppercase tracking-[0.16em] text-ice/80 transition-colors hover:text-lime sm:self-auto"
          >
            Volver arriba
            <ArrowUp aria-hidden className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
