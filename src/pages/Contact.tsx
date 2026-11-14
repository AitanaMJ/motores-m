import { useRef, useState, type FormEvent } from 'react';
import { CheckCircle2, Clock, FileText, MessageSquare, RotateCcw } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { useScrollAnimations } from '../hooks/useScrollAnimations';
import { PHOTOS } from '../lib/images';
import { hasErrors, required, validateEmail, validateName, validateOptionalPhone, type Errors } from '../lib/validation';
import { PageHero } from '../components/PageHero';
import { Button, DemoNotice, Eyebrow, Field, fieldAria } from '../components/ui';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  consent: boolean;
}

const EMPTY: ContactForm = { name: '', email: '', phone: '', topic: '', message: '', consent: false };
const TOPICS = ['Consulta por un vehículo', 'Vender mi auto', 'Financiación', 'Otro motivo'];

function validate(f: ContactForm): Errors<ContactForm> {
  return {
    name: validateName(f.name),
    email: validateEmail(f.email),
    phone: validateOptionalPhone(f.phone),
    topic: required(f.topic, 'Elegí un motivo de consulta.'),
    message: f.message.trim().length < 10 ? 'Escribí un mensaje de al menos 10 caracteres.' : undefined,
    consent: f.consent ? undefined : 'Confirmá que entendés que es un formulario de demostración.',
  };
}

export default function Contact() {
  usePageMeta('Contacto', 'Formulario de contacto de demostración de MOTORES M. Los datos se validan localmente y no se envían.');
  const pageRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  useScrollAnimations(pageRef);

  const [form, setForm] = useState<ContactForm>(EMPTY);
  const [errors, setErrors] = useState<Errors<ContactForm>>({});
  const [sentName, setSentName] = useState<string | null>(null);

  const set = <K extends keyof ContactForm>(k: K, value: ContactForm[K]) => {
    const next = { ...form, [k]: value };
    setForm(next);
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: validate(next)[k] }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next = validate(form);
    setErrors(next);
    if (hasErrors(next)) {
      const first = (Object.keys(next) as (keyof ContactForm)[]).find((k) => next[k]);
      formRef.current?.querySelector<HTMLElement>(`#ct-${first}`)?.focus();
      return;
    }
    setSentName(form.name.trim().split(' ')[0]);
    setForm(EMPTY);
  };

  return (
    <div ref={pageRef}>
      <PageHero
        compact
        eyebrow="Contacto"
        title={['Hablemos', 'de autos.']}
        accent={1}
        photoId={PHOTOS.contactHero}
        photoAlt="Luces traseras rojas de un auto deportivo en la ciudad de noche"
        intro="Dejanos tu consulta y te mostramos cómo respondería un asesor. Recordá que este sitio es una demostración."
      />

      <section aria-label="Formulario de contacto" className="container-x grid gap-16 py-24 md:py-32 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <Eyebrow index="01">Canales</Eyebrow>
          <ul className="mt-8 space-y-8">
            {[
              { icon: MessageSquare, title: 'Formulario online', text: 'El canal de contacto de esta demo. Validamos los datos en tu navegador.' },
              { icon: Clock, title: 'Respuesta', text: 'En un sitio real, acá se indicarían los horarios de atención y tiempos de respuesta.' },
              { icon: FileText, title: 'Datos de la empresa', text: 'Al ser una marca ficticia, no publicamos dirección, teléfono ni redes sociales.' },
            ].map(({ icon: Icon, title, text }) => (
              <li key={title} data-reveal className="flex gap-4">
                <span className="inline-flex size-11 shrink-0 items-center justify-center border border-ice/15 text-lime">
                  <Icon aria-hidden className="size-5" />
                </span>
                <div>
                  <h2 className="font-semibold">{title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-steel">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        <div className="lg:col-span-7 lg:col-start-6">
          {sentName ? (
            <div role="status" className="animate-rise border border-lime/40 bg-graphite/40 p-8 md:p-10">
              <CheckCircle2 aria-hidden className="size-10 text-lime" strokeWidth={1.5} />
              <h2 className="display mt-6 text-5xl">¡Gracias, {sentName}!</h2>
              <p className="mt-4 text-ice/75">
                Tu mensaje pasó la validación. Como esto es una demo, <strong className="text-ice">no se envió a nadie ni se guardó</strong>.
                En un sitio real, acá confirmaríamos la recepción.
              </p>
              <Button variant="outline" onClick={() => setSentName(null)} className="mt-8">
                <RotateCcw aria-hidden className="size-4" />
                Escribir otro mensaje
              </Button>
            </div>
          ) : (
            <form ref={formRef} noValidate onSubmit={submit} className="grid gap-6 sm:grid-cols-2">
              <DemoNotice title="Formulario de demostración" className="sm:col-span-2">
                Los datos se validan localmente. No se envían a ningún servidor ni se almacenan.
              </DemoNotice>
              <Field id="ct-name" label="Nombre" required error={errors.name}>
                <input {...fieldAria('ct-name', errors.name)} value={form.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" className="field" />
              </Field>
              <Field id="ct-email" label="Email" required error={errors.email}>
                <input {...fieldAria('ct-email', errors.email)} type="email" value={form.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" className="field" />
              </Field>
              <Field id="ct-phone" label="Teléfono" error={errors.phone}>
                <input {...fieldAria('ct-phone', errors.phone)} type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} autoComplete="tel" className="field" />
              </Field>
              <Field id="ct-topic" label="Motivo" required error={errors.topic}>
                <select {...fieldAria('ct-topic', errors.topic)} value={form.topic} onChange={(e) => set('topic', e.target.value)} className="field cursor-pointer">
                  <option value="">Elegí un motivo</option>
                  {TOPICS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field id="ct-message" label="Mensaje" required error={errors.message} className="sm:col-span-2">
                <textarea {...fieldAria('ct-message', errors.message)} value={form.message} onChange={(e) => set('message', e.target.value)} rows={5} className="field" />
              </Field>
              <div className="sm:col-span-2">
                <label htmlFor="ct-consent" className="flex min-h-11 cursor-pointer items-center gap-3 py-1 text-sm text-ice/80">
                  <input
                    id="ct-consent"
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => set('consent', e.target.checked)}
                    aria-invalid={errors.consent ? true : undefined}
                    aria-describedby={errors.consent ? 'ct-consent-error' : undefined}
                    className="size-6 shrink-0 cursor-pointer accent-lime"
                  />
                  Entiendo que este es un formulario de demostración y que mis datos no serán enviados.
                </label>
                {errors.consent && (
                  <p id="ct-consent-error" role="alert" className="mt-1.5 text-xs font-medium text-[#ff8a7a]">
                    {errors.consent}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" arrow>
                  Validar mensaje (demo)
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
