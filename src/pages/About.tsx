import { useRef } from 'react';
import { usePageMeta } from '../hooks/usePageMeta';
import { useScrollAnimations } from '../hooks/useScrollAnimations';
import { PHOTOS } from '../lib/images';
import { TIMELINE, VALUES } from '../data/content';
import { PageHero } from '../components/PageHero';
import { SmartImage } from '../components/SmartImage';
import { ButtonLink, DemoTag, Eyebrow, RevealTitle } from '../components/ui';

export default function About() {
  usePageMeta('Nosotros', 'Conocé la historia ficticia de MOTORES M., una concesionaria de demostración de autos premium y deportivos.');
  const pageRef = useRef<HTMLDivElement>(null);
  useScrollAnimations(pageRef);

  return (
    <div ref={pageRef}>
      <PageHero
        eyebrow="Nosotros"
        title={['Hechos por', 'fanáticos', 'de los fierros.']}
        accent={2}
        photoId={PHOTOS.aboutHero}
        photoAlt="Auto deportivo blanco estacionado en un garage con luz roja"
        intro="La historia de MOTORES M. es ficticia y forma parte de este sitio de demostración. La contamos como lo haría una marca real, para mostrar el potencial de la experiencia."
      >
        <DemoTag className="text-ice/80">Historia ficticia · contenido de demostración</DemoTag>
      </PageHero>

      {/* Manifiesto */}
      <section aria-labelledby="manifiesto" className="container-x py-24 md:py-36">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow index="01">Manifiesto</Eyebrow>
          </div>
          <div className="lg:col-span-7">
            <h2 id="manifiesto" className="sr-only">
              Manifiesto
            </h2>
            <p data-reveal className="text-[clamp(1.6rem,3.2vw,2.6rem)] font-medium leading-[1.2] tracking-tight text-ice">
              Creemos que un auto no es solo un medio de transporte. Es una forma de vivir el camino.{' '}
              <span className="text-steel">
                Por eso elegimos cada unidad con criterio, la presentamos con transparencia y acompañamos a cada persona
                hasta que se sienta en casa detrás del volante.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Imagen + línea de tiempo */}
      <section aria-labelledby="historia" className="border-t border-ice/10 py-24 md:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Eyebrow index="02">Nuestra historia</Eyebrow>
              <RevealTitle id="historia" lines={['Del garage', 'al showroom.']} accent={1} className="mt-6 text-[clamp(3rem,6vw,5.6rem)]" />
              <div data-wipe className="relative mt-10 aspect-[4/3] overflow-hidden">
                <SmartImage photoId={PHOTOS.workshop} alt="Técnico trabajando sobre el motor de un auto" ratio={0.75} sizes="(min-width: 1024px) 40vw, 100vw" parallax={6} className="absolute inset-0" />
              </div>
            </div>
          </div>
          <ol className="relative lg:col-span-6 lg:col-start-7">
            <span aria-hidden className="absolute left-0 top-2 bottom-2 w-px bg-ice/15" />
            {TIMELINE.map((t) => (
              <li key={t.year} data-reveal className="relative pb-14 pl-10 last:pb-0">
                <span aria-hidden className="absolute -left-[5px] top-2 size-[11px] bg-lime" />
                <p className="eyebrow text-steel">{t.year}</p>
                <h3 className="display mt-3 text-4xl md:text-5xl">{t.title}</h3>
                <p className="mt-3 max-w-lg leading-relaxed text-ice/70">{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Valores */}
      <section aria-labelledby="valores" className="on-light bg-ice py-24 text-petrol md:py-32">
        <div className="container-x">
          <p className="eyebrow flex items-center gap-3 text-petrol/60">
            <span className="text-petrol">03</span>
            <span aria-hidden className="h-px w-8 bg-current" />
            Valores
          </p>
          <RevealTitle id="valores" lines={['Lo que nos', 'mueve.']} className="mt-6 text-[clamp(3rem,7vw,6.5rem)]" />
          <ul className="mt-16 grid gap-px bg-petrol/15 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <li key={v.title} data-reveal className="group bg-ice p-8 md:p-10">
                <span className="display text-6xl text-petrol/15 transition-colors duration-500 group-hover:text-petrol">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="display mt-6 text-4xl">{v.title}</h3>
                <p className="mt-3 leading-relaxed text-petrol/75">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Garage */}
      <section aria-labelledby="visita" className="relative isolate overflow-hidden py-32 md:py-44">
        <div className="absolute inset-0 -z-10">
          <SmartImage photoId={PHOTOS.garage} alt="" sizes="100vw" parallax={8} className="absolute inset-0" />
          <div className="absolute inset-0 bg-petrol/75" />
        </div>
        <div className="container-x">
          <RevealTitle id="visita" lines={['Tu próximo auto', 'te está esperando.']} accent={1} className="text-[clamp(3rem,8vw,8rem)]" />
          <div data-reveal className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/catalogo">Ver catálogo</ButtonLink>
            <ButtonLink to="/contacto" variant="outline">
              Escribinos
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
