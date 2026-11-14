import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight, Quote } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { useScrollAnimations } from '../hooks/useScrollAnimations';
import { DESKTOP, MOTION_OK, gsap, prefersReducedMotion } from '../lib/gsap';
import { PHOTOS } from '../lib/images';
import { BRANDS, vehicles } from '../data/vehicles';
import { BENEFITS, TESTIMONIALS } from '../data/content';
import { SmartImage } from '../components/SmartImage';
import { VehicleSearch } from '../components/VehicleSearch';
import { FeaturedCarousel } from '../components/FeaturedCarousel';
import { ButtonLink, DemoTag, Eyebrow, RevealTitle } from '../components/ui';

export default function Home() {
  usePageMeta(
    '',
    'MOTORES M.: concesionaria ficticia de autos premium y deportivos. Explorá el catálogo de demostración, simulá tu financiación y cotizá tu usado.',
  );
  const pageRef = useRef<HTMLDivElement>(null);
  useScrollAnimations(pageRef);
  const featured = vehicles.filter((v) => v.featured);

  return (
    <div ref={pageRef}>
      <Hero />

      {/* Buscador */}
      <section aria-labelledby="buscador-titulo" className="relative z-10 -mt-10 md:-mt-14 lg:-mt-12">
        <div className="container-x">
          <h2 id="buscador-titulo" className="sr-only">
            Buscador de vehículos
          </h2>
          <VehicleSearch />
          <div className="mt-4 flex flex-wrap items-center gap-x-4 text-xs text-steel">
            <span className="eyebrow mr-1 w-full py-2 sm:w-auto">Marcas en stock</span>
            {BRANDS.map((b) => (
              <Link key={b} to={`/catalogo?marca=${encodeURIComponent(b)}`} className="inline-flex min-h-10 items-center transition-colors hover:text-lime">
                {b}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Destacados */}
      <section aria-labelledby="destacados-titulo" className="py-24 md:py-36">
        <div className="container-x">
          <div className="mb-12 grid gap-8 md:mb-16 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <Eyebrow index="01">Selección destacada</Eyebrow>
              <RevealTitle id="destacados-titulo" lines={['Máquinas que', 'merecen el garage']} accent={1} className="mt-6 text-[clamp(3rem,7.4vw,7rem)]" />
            </div>
            <div data-reveal className="md:col-span-4 md:pb-3">
              <p className="text-ice/70 leading-relaxed">
                Unidades elegidas por su estado, su historia y su carácter. Deslizá para recorrerlas o entrá al catálogo
                completo.
              </p>
              <Link to="/catalogo" className="group mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-lime">
                Ver catálogo completo
                <ArrowUpRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
          <div data-reveal>
            <FeaturedCarousel items={featured} />
          </div>
        </div>
      </section>

      {/* Editorial de marca */}
      <section aria-labelledby="marca-titulo" className="relative overflow-hidden pb-24 md:pb-36">
        <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-0">
          <div className="relative lg:col-span-8 lg:col-start-1">
            <div data-wipe className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/10] lg:aspect-[4/3]">
              <SmartImage
                photoId={PHOTOS.road}
                alt="Deportivo recorriendo una ruta sinuosa al atardecer"
                ratio={0.7}
                sizes="(min-width: 1024px) 66vw, 100vw"
                parallax={7}
                className="absolute inset-0"
              />
            </div>
            <p className="eyebrow absolute -bottom-7 left-0 text-steel">Fotografía ilustrativa</p>
          </div>
          <div className="relative lg:col-span-5 lg:col-start-8 lg:-ml-24 lg:self-end">
            <div data-reveal className="bg-petrol p-0 lg:border lg:border-ice/10 lg:p-12">
              <Eyebrow index="02">Nuestra filosofía</Eyebrow>
              <RevealTitle id="marca-titulo" lines={['Cada auto', 'tiene una', 'historia.']} accent={2} className="mt-6 text-[clamp(2.8rem,5.4vw,5.2rem)]" />
              <p className="mt-6 leading-relaxed text-ice/70">
                No llenamos un salón: armamos una colección. Buscamos autos con mantenimiento cuidado, configuraciones
                interesantes y personalidad propia, para que manejar vuelva a ser una experiencia.
              </p>
              <ButtonLink to="/nosotros" variant="outline" className="mt-8">
                Conocé MOTORES M.
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section aria-labelledby="beneficios-titulo" className="on-light bg-ice py-24 text-petrol md:py-32">
        <div className="container-x">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="eyebrow flex items-center gap-3 text-petrol/60">
                <span className="text-petrol">03</span>
                <span aria-hidden className="h-px w-8 bg-current" />
                Por qué elegirnos
              </p>
              <RevealTitle id="beneficios-titulo" lines={['Comprar un auto', 'debería sentirse', 'así de bien.']} className="mt-6 text-[clamp(2.8rem,5.6vw,5.4rem)]" />
            </div>
            <p data-reveal className="self-end text-petrol/70 leading-relaxed md:col-span-5 md:col-start-8">
              Un proceso pensado para que tomes una gran decisión con toda la información a mano y sin sorpresas.
            </p>
          </div>
          <ol className="mt-16 grid border-t border-petrol/15 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b, i) => (
              <li
                key={b.title}
                data-reveal
                className="group relative border-b border-petrol/15 py-10 sm:px-6 sm:[&:nth-child(odd)]:border-r lg:border-r lg:last:border-r-0 lg:first:pl-0"
              >
                <span aria-hidden className="absolute left-0 top-0 h-[3px] w-0 bg-petrol transition-[width] duration-700 ease-out-expo group-hover:w-full" />
                <span className="display text-5xl text-petrol/25 transition-colors duration-500 group-hover:text-petrol">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-6 text-lg font-semibold">{b.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-petrol/70">{b.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Tasación */}
      <section aria-labelledby="tasacion-titulo" className="relative isolate overflow-hidden">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[340px] overflow-hidden lg:min-h-[640px]">
            <SmartImage
              photoId={PHOTOS.workshop}
              alt="Técnico revisando el motor de un auto en el taller"
              ratio={0.9}
              sizes="(min-width: 1024px) 50vw, 100vw"
              parallax={6}
              className="absolute inset-0"
            />
            <div aria-hidden className="absolute inset-0 bg-petrol/20" />
          </div>
          <div className="relative flex items-center bg-lime text-petrol">
            <div className="on-light w-full px-[clamp(16px,4.2vw,64px)] py-20 lg:px-16 xl:px-24">
              <p className="eyebrow flex items-center gap-3 text-petrol/70">
                <span className="text-petrol">04</span>
                <span aria-hidden className="h-px w-8 bg-current" />
                Tasación de demostración
              </p>
              <RevealTitle id="tasacion-titulo" lines={['¿Cuánto vale', 'tu auto hoy?']} className="mt-6 text-[clamp(3rem,6vw,5.8rem)]" />
              <p data-reveal className="mt-6 max-w-md leading-relaxed text-petrol/80">
                Contanos marca, modelo, año y kilometraje. En un sitio real, un asesor revisaría los datos y te
                contactaría. En esta demo, el formulario es solo ilustrativo.
              </p>
              <div data-reveal className="mt-10 flex flex-wrap gap-3">
                <ButtonLink to="/vende-tu-auto" variant="dark">
                  Iniciar tasación demo
                </ButtonLink>
                <ButtonLink to="/financiacion" variant="ghost" className="!text-petrol hover:!text-petrol/70">
                  Simular financiación
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cifras demostrativas */}
      <section aria-labelledby="cifras-titulo" className="border-b border-ice/10 py-24 md:py-32">
        <div className="container-x">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Eyebrow index="05">
              <span id="cifras-titulo">MOTORES M. en números</span>
            </Eyebrow>
            <DemoTag className="text-steel">Cifras demostrativas · no son datos reales</DemoTag>
          </div>
          <dl className="mt-14 grid grid-cols-2 gap-y-14 lg:grid-cols-4">
            {[
              { value: vehicles.length, suffix: '', label: 'Unidades en el catálogo demo' },
              { value: BRANDS.length, suffix: '', label: 'Marcas de ejemplo' },
              { value: 48, suffix: ' h', label: 'Respuesta objetivo (ilustrativo)' },
              { value: 100, suffix: '%', label: 'Fichas técnicas completas' },
            ].map((s, i) => (
              <div
                key={s.label}
                data-reveal
                className={`flex flex-col-reverse pr-4 ${
                  ['', 'border-l border-ice/10 pl-6 lg:pl-8', 'lg:border-l lg:border-ice/10 lg:pl-8', 'border-l border-ice/10 pl-6 lg:pl-8'][i]
                }`}
              >
                <dt className="mt-3 text-sm text-steel">{s.label}</dt>
                <dd className="display text-[clamp(4rem,9vw,8rem)] leading-none text-ice tabular-nums">
                  <span data-counter={s.value} data-suffix={s.suffix}>
                    {s.value}
                    {s.suffix}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Testimonios */}
      <section aria-labelledby="testimonios-titulo" className="py-24 md:py-36">
        <div className="container-x">
          <div className="grid gap-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <Eyebrow index="06">Experiencias</Eyebrow>
              <RevealTitle id="testimonios-titulo" lines={['Lo que dicen', 'al volante']} accent={1} className="mt-6 text-[clamp(3rem,7vw,6.5rem)]" />
            </div>
            <div data-reveal className="md:col-span-5 md:justify-self-end">
              <DemoTag className="text-steel">Testimonios ficticios · contenido de demostración</DemoTag>
            </div>
          </div>
          <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:pb-10">
            {TESTIMONIALS.map((t, i) => (
              <li key={t.author} data-reveal className={`flex flex-col border border-ice/10 bg-graphite/30 p-8 md:p-10 ${i === 1 ? 'lg:translate-y-10' : ''} ${i === 2 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
                <Quote aria-hidden className="size-8 text-lime" strokeWidth={1.5} />
                <blockquote className="mt-6 flex-1 text-lg leading-relaxed text-ice/85">“{t.quote}”</blockquote>
                <div className="mt-8 border-t border-ice/10 pt-5">
                  <p className="font-semibold">{t.author}</p>
                  <p className="text-sm text-steel">{t.detail} · Persona ficticia</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA final */}
      <section aria-labelledby="cta-titulo" className="relative isolate overflow-hidden border-t border-ice/10 py-28 md:py-40">
        <div aria-hidden className="absolute inset-0 -z-10 hairline-grid opacity-60" />
        <div aria-hidden className="absolute -right-20 top-1/2 -z-10 h-[140%] w-[38%] -translate-y-1/2 skew-x-[-14deg] bg-graphite/50" />
        <div className="container-x">
          <Eyebrow index="07">Tu próximo capítulo</Eyebrow>
          <RevealTitle
            id="cta-titulo"
            lines={['Tu próximo auto', 'ya está acá.']}
            accent={1}
            className="mt-6 text-[clamp(3.4rem,11vw,11rem)]"
          />
          <div data-reveal className="mt-12 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/catalogo">Explorar vehículos</ButtonLink>
            <ButtonLink to="/contacto" variant="outline">
              Hablar con un asesor
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------------- HERO ---------------- */

function Hero() {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.fromTo(q('[data-hero-frame]'), { clipPath: 'inset(18% 14% 18% 14%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut' }, 0)
        .from(q('[data-hero-img] img'), { scale: 1.35, duration: 2.4, ease: 'expo.out' }, 0)
        .from(q('[data-hero-bar]'), { scaleY: 0, transformOrigin: 'top', duration: 1.2, ease: 'expo.inOut' }, 0.5)
        .from(q('.reveal-line > span'), { yPercent: 115, duration: 1.2, stagger: 0.1 }, 0.75)
        .from(q('[data-hero-fade]'), { y: 30, autoAlpha: 0, duration: 1, stagger: 0.08 }, 1.15)
        .from(q('[data-hero-cue]'), { autoAlpha: 0, duration: 0.8 }, 1.6);
    });

    // Parallax de salida del hero: solo en pantallas ≥768px
    mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
      gsap.to(q('[data-hero-img]'), {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.5 },
      });
      gsap.to(q('[data-hero-content]'), {
        yPercent: -18,
        autoAlpha: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'center center', end: 'bottom top', scrub: 0.5 },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={ref} aria-labelledby="hero-titulo" className="relative isolate overflow-hidden bg-petrol-deep">
      <div data-hero-frame className="absolute inset-0 -z-10 overflow-hidden">
        {/*
          Vertical (móvil/tablet): la foto ocupa una franja central para que el auto quede entre
          el título y los CTA. Horizontal: foto a sangre completa.
        */}
        <div data-hero-img className="absolute inset-x-0 top-[8%] bottom-[26%] landscape:inset-0">
          <SmartImage
            photoId={PHOTOS.hero}
            alt="Silueta de un coupé deportivo iluminado de forma dramática sobre fondo negro"
            eager
            sizes="100vw"
            widths={[768, 1280, 1920, 2400]}
            className="absolute inset-0 !bg-petrol-deep"
            imgClassName="object-[28%_58%] sm:object-[34%_58%] landscape:object-[50%_58%]"
          />
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-petrol-deep),transparent_22%,transparent_70%,var(--color-petrol-deep))] landscape:hidden" />
        </div>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-petrol-deep/60 via-transparent via-40% to-petrol" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-petrol-deep/55 via-transparent to-transparent" />
        <div aria-hidden className="grain absolute inset-0" />
      </div>

      <div data-hero-content className="container-x relative flex min-h-[100svh] flex-col pt-28 pb-24 sm:pt-32 md:pb-32">
        <div className="flex items-stretch gap-5 md:gap-8">
          <span data-hero-bar aria-hidden className="mt-1 hidden w-[3px] shrink-0 bg-lime sm:block" />
          <div className="min-w-0">
            <p data-hero-fade className="eyebrow mb-5 flex items-center gap-3 text-ice/70 md:mb-6">
              <span className="size-1.5 shrink-0 bg-lime" aria-hidden />
              <span>
                Concesionaria premium<span className="hidden sm:inline"> · Usados seleccionados</span>
              </span>
            </p>
            <h1 id="hero-titulo" className="display text-[clamp(3.25rem,min(12.4vw,18svh),12.5rem)] leading-[0.86]">
              <span className="sr-only">No solo conduzcas. Sentí la potencia.</span>
              <span className="reveal-line" aria-hidden>
                <span>No solo conduzcas.</span>
              </span>
              <span className="reveal-line" aria-hidden>
                <span>
                  Sentí la <span className="text-lime">potencia.</span>
                </span>
              </span>
            </h1>
          </div>
        </div>

        <div className="mt-auto grid gap-10 pt-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7 xl:col-span-6">
            <p data-hero-fade className="max-w-md text-base leading-relaxed text-ice/85 md:max-w-lg md:text-lg">
              Deportivos, sedanes de alta gama y SUV seleccionados uno por uno. Encontrá el auto que te acelera el pulso.
            </p>
            <div data-hero-fade className="mt-7 flex flex-col gap-3 sm:flex-row md:mt-8">
              <ButtonLink to="/catalogo">Explorar vehículos</ButtonLink>
              <ButtonLink to="/vende-tu-auto" variant="outline" className="bg-petrol-deep/40 backdrop-blur-sm">
                Vendé tu auto
              </ButtonLink>
            </div>
          </div>

          <div data-hero-fade className="hidden items-end justify-end gap-6 lg:col-span-5 lg:col-start-8 lg:flex xl:gap-10">
            <dl className="flex gap-6 text-right xl:gap-8">
              <div>
                <dt className="eyebrow text-steel">Catálogo demo</dt>
                <dd className="display mt-2 whitespace-nowrap text-[clamp(2.4rem,3.4vw,3rem)]">{String(vehicles.length).padStart(2, '0')} unidades</dd>
              </div>
              <div className="border-l border-ice/15 pl-6 xl:pl-8">
                <dt className="eyebrow text-steel">Marcas</dt>
                <dd className="display mt-2 text-[clamp(2.4rem,3.4vw,3rem)]">{String(BRANDS.length).padStart(2, '0')}</dd>
              </div>
            </dl>
            <a
              href="#buscador-titulo"
              data-hero-cue
              onClick={(e) => {
                e.preventDefault();
                const input = document.getElementById('search-q');
                input?.focus({ preventScroll: true });
                input?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
              }}
              className="group flex min-w-11 flex-col items-center gap-3 pb-1 text-ice/70 transition-colors hover:text-lime"
              aria-label="Bajar al buscador"
            >
              <span className="eyebrow [writing-mode:vertical-rl]">Scroll</span>
              <span className="relative h-12 w-px overflow-hidden bg-ice/20">
                <span className="animate-scroll-cue absolute inset-0 bg-lime" />
              </span>
              <ArrowDown aria-hidden className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
