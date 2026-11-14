import { usePageMeta } from '../hooks/usePageMeta';
import { PHOTOS } from '../lib/images';
import { SmartImage } from '../components/SmartImage';
import { ButtonLink } from '../components/ui';

export default function NotFound() {
  usePageMeta('Página no encontrada', 'La página que buscás no existe en MOTORES M.');
  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-24 pb-16">
      <div className="absolute inset-0 -z-10">
        <SmartImage photoId={PHOTOS.road} alt="" eager sizes="100vw" className="absolute inset-0" />
        <div className="absolute inset-0 bg-petrol/85" />
      </div>
      <div className="container-x">
        <p className="eyebrow flex items-center gap-3 text-steel">
          <span className="text-lime">Error 404</span>
          <span aria-hidden className="h-px w-8 bg-current opacity-50" />
          Fuera de ruta
        </p>
        <h1 className="display mt-6 text-[clamp(3.6rem,13vw,13rem)]">
          <span className="block text-lime">404.</span>
          Te saliste
          <br />
          del circuito.
        </h1>
        <p className="mt-6 max-w-md text-lg text-ice/75">
          La página o el vehículo que buscás no existe o ya no está disponible. Volvé a la pista desde acá.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink to="/">Volver al inicio</ButtonLink>
          <ButtonLink to="/catalogo" variant="outline">
            Ver catálogo
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
