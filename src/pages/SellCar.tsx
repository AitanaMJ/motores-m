import { useRef, useState, type FormEvent } from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { useScrollAnimations } from '../hooks/useScrollAnimations';
import { PHOTOS } from '../lib/images';
import { formatNumber } from '../lib/format';
import { CURRENT_YEAR, hasErrors, parseKm, required, validateContact, validateKm, validateName, validateYear, type Errors } from '../lib/validation';
import { BRANDS } from '../data/vehicles';
import { SELL_STEPS } from '../data/content';
import { PageHero } from '../components/PageHero';
import { Button, DemoNotice, Eyebrow, Field, RevealTitle, fieldAria } from '../components/ui';

interface SellForm {
  brand: string;
  model: string;
  year: string;
  km: string;
  name: string;
  contact: string;
}

const EMPTY: SellForm = { brand: '', model: '', year: '', km: '', name: '', contact: '' };

function validate(f: SellForm): Errors<SellForm> {
  return {
    brand: required(f.brand, 'Elegí la marca.'),
    model: required(f.model, 'Ingresá el modelo.'),
    year: validateYear(f.year),
    km: validateKm(f.km),
    name: validateName(f.name),
    contact: validateContact(f.contact),
  };
}

export default function SellCar() {
  usePageMeta('Vendé tu auto', 'Tasación de demostración en MOTORES M.: completá los datos de tu auto. Formulario ilustrativo, no se envían datos.');
  const pageRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  useScrollAnimations(pageRef);

  const [form, setForm] = useState<SellForm>(EMPTY);
  const [errors, setErrors] = useState<Errors<SellForm>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof SellForm, boolean>>>({});
  const [submitted, setSubmitted] = useState<SellForm | null>(null);

  const onChange = (k: keyof SellForm) => (e: { target: { value: string } }) => {
    const next = { ...form, [k]: e.target.value };
    setForm(next);
    if (touched[k]) setErrors((prev) => ({ ...prev, [k]: validate(next)[k] }));
  };
  const onBlur = (k: keyof SellForm) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors((prev) => ({ ...prev, [k]: validate(form)[k] }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next = validate(form);
    setErrors(next);
    setTouched({ brand: true, model: true, year: true, km: true, name: true, contact: true });
    if (hasErrors(next)) {
      const first = (Object.keys(next) as (keyof SellForm)[]).find((k) => next[k]);
      formRef.current?.querySelector<HTMLElement>(`#sell-${first}`)?.focus();
      return;
    }
    setSubmitted(form);
  };

  const reset = () => {
    setForm(EMPTY);
    setErrors({});
    setTouched({});
    setSubmitted(null);
  };

  return (
    <div ref={pageRef}>
      <PageHero
        eyebrow="Vendé tu auto"
        title={['Tu auto vale', 'más de lo', 'que pensás.']}
        accent={2}
        photoId={PHOTOS.sellHero}
        photoAlt="Coupé deportivo negro en movimiento por una ruta"
        intro="Contanos de tu auto y mirá cómo sería el proceso de tasación en MOTORES M. Esta página es una demostración: no se realiza ninguna tasación real."
      />

      {/* Pasos */}
      <section aria-labelledby="pasos" className="container-x py-24 md:py-32">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Eyebrow index="01">Cómo funciona</Eyebrow>
            <RevealTitle id="pasos" lines={['Cuatro pasos.', 'Cero vueltas.']} accent={1} className="mt-6 text-[clamp(3rem,7vw,6rem)]" />
          </div>
          <p data-reveal className="text-ice/70 md:col-span-4 md:col-start-9">
            Proceso ilustrativo de una concesionaria ficticia, pensado para mostrar cómo se vería una experiencia clara y
            ordenada.
          </p>
        </div>
        <ol className="mt-16 grid gap-px bg-ice/10 sm:grid-cols-2 lg:grid-cols-4">
          {SELL_STEPS.map((s, i) => (
            <li key={s.title} data-reveal className="group relative bg-petrol p-8">
              <span className="display text-7xl text-ice/10 transition-colors duration-500 group-hover:text-lime">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-6 text-lg font-semibold">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ice/65">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Formulario */}
      <section aria-labelledby="form-tasacion" className="border-t border-ice/10 bg-petrol-deep py-24 md:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow index="02">Datos del vehículo</Eyebrow>
            <RevealTitle id="form-tasacion" lines={['Pedí tu', 'tasación demo']} className="mt-6 text-[clamp(2.8rem,5vw,4.6rem)]" />
            <DemoNotice title="Importante: esto es una demostración" className="mt-8">
              No se envían datos a ningún servidor ni se realiza una tasación real. El formulario solo valida la información
              en tu navegador.
            </DemoNotice>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            {submitted ? (
              <div role="status" className="animate-rise border border-lime/40 bg-graphite/40 p-8 md:p-10">
                <CheckCircle2 aria-hidden className="size-10 text-lime" strokeWidth={1.5} />
                <h3 className="display mt-6 text-5xl">Datos validados</h3>
                <p className="mt-4 text-ice/75">
                  ¡Gracias, {submitted.name.trim().split(' ')[0]}! Así se vería la confirmación. Recordá que, al ser una
                  demo, <strong className="text-ice">no se envió ningún dato ni se generó una tasación</strong>.
                </p>
                <dl className="mt-8 grid grid-cols-2 gap-px bg-ice/10 sm:grid-cols-4">
                  {[
                    ['Marca', submitted.brand],
                    ['Modelo', submitted.model],
                    ['Año', submitted.year],
                    ['Kilometraje', `${formatNumber(parseKm(submitted.km))} km`],
                  ].map(([k, val]) => (
                    <div key={k} className="bg-petrol p-4">
                      <dt className="text-xs text-steel">{k}</dt>
                      <dd className="mt-1 font-semibold break-words">{val}</dd>
                    </div>
                  ))}
                </dl>
                <Button variant="outline" onClick={reset} className="mt-8">
                  <RotateCcw aria-hidden className="size-4" />
                  Cargar otro auto
                </Button>
              </div>
            ) : (
              <form ref={formRef} noValidate onSubmit={submit} aria-describedby="sell-note" className="grid gap-6 sm:grid-cols-2">
                <Field id="sell-brand" label="Marca" required error={errors.brand}>
                  <select {...fieldAria('sell-brand', errors.brand)} value={form.brand} onChange={onChange('brand')} onBlur={onBlur('brand')} className="field cursor-pointer">
                    <option value="">Elegí una marca</option>
                    {BRANDS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                    <option value="Otra">Otra marca</option>
                  </select>
                </Field>
                <Field id="sell-model" label="Modelo" required error={errors.model}>
                  <input {...fieldAria('sell-model', errors.model)} value={form.model} onChange={onChange('model')} onBlur={onBlur('model')} placeholder="Ej.: Golf GTI" className="field" />
                </Field>
                <Field id="sell-year" label="Año" required error={errors.year}>
                  <input
                    {...fieldAria('sell-year', errors.year)}
                    type="number"
                    inputMode="numeric"
                    min={1950}
                    max={CURRENT_YEAR + 1}
                    value={form.year}
                    onChange={onChange('year')}
                    onBlur={onBlur('year')}
                    placeholder={`Ej.: ${CURRENT_YEAR - 4}`}
                    className="field"
                  />
                </Field>
                <Field id="sell-km" label="Kilometraje" required error={errors.km} hint="Solo números, sin puntos.">
                  <input
                    {...fieldAria('sell-km', errors.km, 'Solo números, sin puntos.')}
                    inputMode="numeric"
                    value={form.km}
                    onChange={onChange('km')}
                    onBlur={onBlur('km')}
                    placeholder="Ej.: 45000"
                    className="field"
                  />
                </Field>
                <Field id="sell-name" label="Nombre y apellido" required error={errors.name}>
                  <input {...fieldAria('sell-name', errors.name)} value={form.name} onChange={onChange('name')} onBlur={onBlur('name')} autoComplete="name" className="field" />
                </Field>
                <Field id="sell-contact" label="Email o teléfono" required error={errors.contact}>
                  <input
                    {...fieldAria('sell-contact', errors.contact)}
                    value={form.contact}
                    onChange={onChange('contact')}
                    onBlur={onBlur('contact')}
                    placeholder="nombre@correo.com"
                    className="field"
                  />
                </Field>
                <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                  <p id="sell-note" className="text-xs text-steel">
                    <span className="text-lime">*</span> Campos obligatorios. Formulario de demostración sin envío real.
                  </p>
                  <Button type="submit" arrow>
                    Validar datos (demo)
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
