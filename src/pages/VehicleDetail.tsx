import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calculator, Check, ChevronRight, Gauge, Fuel, Calendar, Cog, MessageSquare, X } from 'lucide-react';
import { getRelatedVehicles, getVehicleBySlug } from '../data/vehicles';
import type { Vehicle } from '../data/types';
import { usePageMeta } from '../hooks/usePageMeta';
import { useScrollAnimations } from '../hooks/useScrollAnimations';
import { formatARS, formatKm } from '../lib/format';
import { MOTION_OK, gsap } from '../lib/gsap';
import { validateContact, validateName, type Errors, hasErrors } from '../lib/validation';
import { SmartImage } from '../components/SmartImage';
import { StatusBadge, VehicleCard } from '../components/VehicleCard';
import { Button, ButtonLink, DemoNotice, Eyebrow, Field, fieldAria } from '../components/ui';
import NotFound from './NotFound';

export default function VehicleDetail() {
  const { slug } = useParams();
  const vehicle = getVehicleBySlug(slug);
  if (!vehicle) return <NotFound />;
  return <VehicleView key={vehicle.id} vehicle={vehicle} />;
}

function VehicleView({ vehicle: v }: { vehicle: Vehicle }) {
  const name = `${v.brand} ${v.model} ${v.version}`;
  usePageMeta(`${name} ${v.year}`, `${name} ${v.year}, ${formatKm(v.km)}, ${v.fuel.toLowerCase()}. Ficha técnica y equipamiento en el catálogo de demostración de MOTORES M.`);
  const pageRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  useScrollAnimations(pageRef, [v.id]);
  const related = getRelatedVehicles(v);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const closeInquiry = useCallback(() => setInquiryOpen(false), []);

  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.from(el.querySelectorAll('[data-in]'), { y: 30, autoAlpha: 0, duration: 0.9, stagger: 0.07, ease: 'power3.out', delay: 0.15 });
    });
    return () => mm.revert();
  }, []);

  const specs: [string, string][] = [
    ['Marca', v.brand],
    ['Modelo', v.model],
    ['Versión', v.version],
    ['Año', String(v.year)],
    ['Kilometraje', formatKm(v.km)],
    ['Combustible', v.fuel],
    ['Transmisión', `${v.transmission} · ${v.gearbox}`],
    ['Carrocería', v.body],
    ['Motor', v.engine],
    ['Potencia', `${v.power} CV`],
    ['Tracción', v.drivetrain],
    ['Color', v.color],
    ['Puertas', String(v.doors)],
    ['Estado', v.status],
  ];

  return (
    <div ref={pageRef} className="pt-24 md:pt-28">
      <div className="container-x">
        <nav aria-label="Ruta de navegación" className="mb-8 text-xs text-steel">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li className="flex items-center gap-1.5">
              <Link to="/" className="inline-flex min-h-8 items-center hover:text-lime">
                Inicio
              </Link>
              <ChevronRight aria-hidden className="size-3" />
            </li>
            <li className="flex items-center gap-1.5">
              <Link to="/catalogo" className="inline-flex min-h-8 items-center hover:text-lime">
                Catálogo
              </Link>
              <ChevronRight aria-hidden className="size-3" />
            </li>
            <li aria-current="page" className="text-ice/80">
              {v.brand} {v.model}
            </li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7 xl:col-span-8">
            <Gallery vehicle={v} />
          </div>

          <div ref={headRef} className="lg:col-span-5 xl:col-span-4">
            <div className="lg:sticky lg:top-24">
              <div data-in className="flex flex-wrap items-center gap-3">
                <StatusBadge status={v.status} />
                <span className="eyebrow text-steel">Unidad de demostración</span>
              </div>
              <p data-in className="eyebrow mt-6 text-steel">
                {v.brand}
              </p>
              <h1 data-in className="display mt-2 text-[clamp(3.2rem,7vw,5.6rem)]">
                {v.model} <span className="block text-ice/55">{v.version}</span>
              </h1>
              <p data-in className="mt-4 text-lg text-ice/80">{v.tagline}</p>

              <dl data-in className="mt-8 grid grid-cols-2 border-y border-ice/10">
                {[
                  { icon: Calendar, label: 'Año', value: String(v.year) },
                  { icon: Gauge, label: 'Kilometraje', value: formatKm(v.km) },
                  { icon: Fuel, label: 'Combustible', value: v.fuel },
                  { icon: Cog, label: 'Transmisión', value: v.transmission },
                ].map(({ icon: Icon, label, value }, i) => (
                  <div key={label} className={`flex gap-3 py-4 ${i % 2 ? 'border-l border-ice/10 pl-4' : ''} ${i > 1 ? 'border-t border-ice/10' : ''}`}>
                    <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-lime" />
                    <div>
                      <dt className="text-xs text-steel">{label}</dt>
                      <dd className="mt-0.5 font-semibold">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>

              <div data-in className="mt-8">
                <p className="eyebrow text-steel">Precio de ejemplo</p>
                <p className="display mt-2 text-[clamp(2.8rem,5vw,4rem)] leading-none text-lime">{formatARS(v.price)}</p>
                <p className="mt-2 text-xs text-steel">Valor ficticio en pesos argentinos. No constituye una oferta comercial.</p>
              </div>

              <div data-in className="mt-8 flex flex-col gap-3 sm:flex-row sm:[&>*]:flex-1 lg:flex-col">
                <Button onClick={() => setInquiryOpen(true)} arrow aria-haspopup="dialog">
                  <MessageSquare aria-hidden className="size-4" />
                  Consultar por este auto
                </Button>
                <ButtonLink to={`/financiacion?capital=${Math.round(v.price * 0.5)}`} variant="outline" arrow={false}>
                  <Calculator aria-hidden className="size-4" />
                  Simular financiación
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>

        {/* Descripción + ficha */}
        <div className="mt-24 grid gap-16 lg:grid-cols-12">
          <section aria-labelledby="descripcion" className="lg:col-span-5">
            <Eyebrow index="01">Descripción</Eyebrow>
            <h2 id="descripcion" className="display mt-5 text-5xl" data-reveal>
              Sobre esta unidad
            </h2>
            <p data-reveal className="mt-6 text-lg leading-relaxed text-ice/75">
              {v.description}
            </p>
            <p data-reveal className="mt-6 text-sm text-steel">
              Las fotografías son ilustrativas y pueden no corresponder exactamente a la versión, color o equipamiento descriptos.
            </p>
          </section>

          <section aria-labelledby="ficha" className="lg:col-span-6 lg:col-start-7">
            <Eyebrow index="02">Especificaciones</Eyebrow>
            <h2 id="ficha" className="display mt-5 text-5xl" data-reveal>
              Ficha técnica
            </h2>
            <dl data-reveal className="mt-8 border-t border-ice/10">
              {specs.map(([k, val]) => (
                <div key={k} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 border-b border-ice/10 py-3.5 text-sm">
                  <dt className="text-steel">{k}</dt>
                  <dd className="font-medium text-ice">{val}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        {/* Equipamiento */}
        <section aria-labelledby="equipamiento" className="mt-24">
          <Eyebrow index="03">Equipamiento</Eyebrow>
          <h2 id="equipamiento" className="display mt-5 text-5xl" data-reveal>
            Equipamiento destacado
          </h2>
          <div className="mt-10 grid gap-px bg-ice/10 sm:grid-cols-2 xl:grid-cols-4">
            {v.equipment.map((g) => (
              <div key={g.group} data-reveal className="bg-petrol p-6 md:p-8">
                <h3 className="eyebrow text-lime">{g.group}</h3>
                <ul className="mt-5 space-y-3">
                  {g.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-ice/85">
                      <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-lime" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Relacionados */}
        <section aria-labelledby="relacionados" className="mt-28 pb-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow index="04">También te puede interesar</Eyebrow>
              <h2 id="relacionados" className="display mt-5 text-[clamp(2.8rem,6vw,5rem)]" data-reveal>
                Vehículos relacionados
              </h2>
            </div>
            <ButtonLink to="/catalogo" variant="outline">
              Ver todo el catálogo
            </ButtonLink>
          </div>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <li key={r.id} data-reveal>
                <VehicleCard vehicle={r} className="h-full" />
              </li>
            ))}
          </ul>
        </section>
      </div>

      {inquiryOpen && <InquiryDialog vehicle={v} onClose={closeInquiry} />}
    </div>
  );
}

/* ---------------- Galería ---------------- */

function Gallery({ vehicle: v }: { vehicle: Vehicle }) {
  const [active, setActive] = useState(0);
  const count = v.images.length;
  const go = (dir: 1 | -1) => setActive((i) => (i + dir + count) % count);
  const img = v.images[active];

  return (
    <div>
      <div
        className="relative aspect-[16/10] overflow-hidden bg-graphite"
        role="region"
        aria-roledescription="galería"
        aria-label={`Imágenes de ${v.brand} ${v.model}`}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') go(1);
          if (e.key === 'ArrowLeft') go(-1);
        }}
      >
        {v.images.map((image, i) => (
          <SmartImage
            key={i}
            photoId={image.photoId}
            alt={image.alt}
            focus={image.focus}
            ratio={0.625}
            eager={i === 0}
            sizes="(min-width: 1024px) 64vw, 100vw"
            className={`absolute inset-0 transition-opacity duration-700 ease-out-expo ${i === active ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            imgClassName={i === active ? 'scale-100 transition-transform duration-[1400ms] ease-out-expo' : 'scale-105'}
          />
        ))}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-petrol/70 to-transparent" />
        <p className="absolute bottom-4 left-4 display text-2xl" aria-live="polite">
          <span className="text-lime">{String(active + 1).padStart(2, '0')}</span>
          <span className="text-ice/60"> / {String(count).padStart(2, '0')}</span>
          <span className="sr-only">: {img.alt}</span>
        </p>
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Imagen anterior"
            className="inline-flex size-11 items-center justify-center bg-petrol/70 text-ice backdrop-blur transition-colors hover:bg-lime hover:text-petrol"
          >
            <ArrowLeft aria-hidden className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Imagen siguiente"
            className="inline-flex size-11 items-center justify-center bg-petrol/70 text-ice backdrop-blur transition-colors hover:bg-lime hover:text-petrol"
          >
            <ArrowRight aria-hidden className="size-5" />
          </button>
        </div>
      </div>

      <ul className="mt-3 grid grid-cols-4 gap-3" aria-label="Miniaturas">
        {v.images.map((image, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver imagen ${i + 1} de ${count}`}
              aria-current={i === active ? 'true' : undefined}
              className={`group relative block w-full overflow-hidden transition-opacity duration-300 ${i === active ? 'opacity-100' : 'opacity-50 hover:opacity-90'}`}
            >
              <SmartImage
                photoId={image.photoId}
                alt=""
                focus={image.focus}
                ratio={0.625}
                sizes="15vw"
                widths={[240, 400]}
                className="aspect-[16/10]"
              />
              <span aria-hidden className={`absolute inset-x-0 bottom-0 h-[3px] bg-lime transition-transform duration-500 ease-out-expo origin-left ${i === active ? 'scale-x-100' : 'scale-x-0'}`} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Consulta de demostración ---------------- */

interface InquiryForm {
  name: string;
  contact: string;
  message: string;
}

function InquiryDialog({ vehicle: v, onClose }: { vehicle: Vehicle; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<InquiryForm>({
    name: '',
    contact: '',
    message: `Hola, me interesa el ${v.brand} ${v.model} ${v.version} ${v.year}. ¿Podrían darme más información?`,
  });
  const [errors, setErrors] = useState<Errors<InquiryForm>>({});
  const [done, setDone] = useState(false);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.querySelector<HTMLElement>('input, button')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && dialogRef.current) {
        const f = [...dialogRef.current.querySelectorAll<HTMLElement>('button, input, textarea, a')];
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
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
      opener?.focus();
    };
  }, [onClose]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Errors<InquiryForm> = {
      name: validateName(form.name),
      contact: validateContact(form.contact),
      message: form.message.trim().length < 10 ? 'Escribí un mensaje de al menos 10 caracteres.' : undefined,
    };
    setErrors(next);
    if (hasErrors(next)) {
      const firstKey = (Object.keys(next) as (keyof InquiryForm)[]).find((k) => next[k]);
      dialogRef.current?.querySelector<HTMLElement>(`#inq-${firstKey}`)?.focus();
      return;
    }
    setDone(true);
  };

  const set = (k: keyof InquiryForm) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
      <div className="animate-fade-in absolute inset-0 bg-petrol-deep/85 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="inq-title"
        className="animate-rise relative max-h-[92svh] w-full max-w-lg overflow-y-auto border border-ice/10 bg-petrol p-6 sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-steel">Consulta de demostración</p>
            <h2 id="inq-title" className="display mt-2 text-4xl">
              {v.brand} {v.model}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="inline-flex size-11 shrink-0 items-center justify-center border border-ice/20 transition-colors hover:border-lime hover:text-lime"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>

        {done ? (
          <div className="mt-6" role="status">
            <DemoNotice title="Consulta validada — no se envió">
              Los datos son correctos, pero esto es una demostración: la consulta <strong>no fue enviada</strong> a ninguna
              persona ni servidor, y no se guardó información.
            </DemoNotice>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button onClick={onClose}>Volver a la ficha</Button>
              <ButtonLink to="/catalogo" variant="outline">
                Seguir explorando
              </ButtonLink>
            </div>
          </div>
        ) : (
          <form noValidate onSubmit={submit} className="mt-6 space-y-5">
            <DemoNotice title="Formulario de demostración">Al enviar solo se validan los campos. No se transmite ni se guarda ningún dato.</DemoNotice>
            <Field id="inq-name" label="Nombre" required error={errors.name}>
              <input {...fieldAria('inq-name', errors.name)} value={form.name} onChange={set('name')} autoComplete="name" className="field" />
            </Field>
            <Field id="inq-contact" label="Email o teléfono" required error={errors.contact}>
              <input {...fieldAria('inq-contact', errors.contact)} value={form.contact} onChange={set('contact')} autoComplete="email" className="field" />
            </Field>
            <Field id="inq-message" label="Mensaje" required error={errors.message}>
              <textarea {...fieldAria('inq-message', errors.message)} value={form.message} onChange={set('message')} rows={4} className="field" />
            </Field>
            <Button type="submit" arrow className="w-full">
              Validar consulta (demo)
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
