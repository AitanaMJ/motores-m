import { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { useScrollAnimations } from '../hooks/useScrollAnimations';
import { PHOTOS } from '../lib/images';
import { formatARS, formatNumber } from '../lib/format';
import { amortizationSchedule, loanSummary } from '../lib/finance';
import { PageHero } from '../components/PageHero';
import { ButtonLink, DemoNotice, Eyebrow, RevealTitle } from '../components/ui';

const TERMS = [12, 18, 24, 36, 48, 60];
const MIN_CAPITAL = 1_000_000;
const MAX_CAPITAL = 400_000_000;

const CONCEPTS = [
  {
    title: 'Sistema francés',
    text: 'La cuota se mantiene fija durante todo el plazo. Al principio pagás más intereses y, con el tiempo, más capital.',
  },
  {
    title: 'TNA',
    text: 'Tasa Nominal Anual. Se divide por 12 para obtener la tasa mensual que se aplica sobre el saldo pendiente.',
  },
  {
    title: 'CFT',
    text: 'El Costo Financiero Total suma intereses, impuestos, seguros y gastos. Siempre es mayor que la TNA y es el dato que conviene comparar.',
  },
  {
    title: 'Anticipo',
    text: 'Cuanto mayor es el anticipo, menor es el capital a financiar y, por lo tanto, menor la cuota y el total de intereses.',
  },
];

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export default function Financing() {
  usePageMeta(
    'Financiación',
    'Simulador orientativo de cuotas con sistema francés. Contenido informativo de demostración: no es una oferta de crédito.',
  );
  const pageRef = useRef<HTMLDivElement>(null);
  useScrollAnimations(pageRef);
  const [params] = useSearchParams();
  const initialCapital = clamp(Number(params.get('capital')) || 30_000_000, MIN_CAPITAL, MAX_CAPITAL);

  const [capitalInput, setCapitalInput] = useState(formatNumber(initialCapital));
  const [months, setMonths] = useState(36);
  const [rateInput, setRateInput] = useState('40');

  const capital = Number(capitalInput.replace(/\D/g, '')) || 0;
  const rate = Number(rateInput.replace(',', '.'));
  const capitalError = capital < MIN_CAPITAL || capital > MAX_CAPITAL ? `Ingresá un capital entre ${formatARS(MIN_CAPITAL)} y ${formatARS(MAX_CAPITAL)}.` : '';
  const rateError = !rateInput.trim() || !Number.isFinite(rate) || rate < 0 || rate > 300 ? 'Ingresá una tasa entre 0 y 300 %.' : '';
  const valid = !capitalError && !rateError;

  const input = { principal: capital, months, annualRate: rate };
  const summary = useMemo(() => (valid ? loanSummary(input) : null), [capital, months, rate, valid]); // eslint-disable-line react-hooks/exhaustive-deps
  const schedule = useMemo(() => (valid ? amortizationSchedule(input) : []), [capital, months, rate, valid]); // eslint-disable-line react-hooks/exhaustive-deps
  const interestShare = summary && summary.total > 0 ? summary.interest / summary.total : 0;

  return (
    <div ref={pageRef}>
      <PageHero
        eyebrow="Financiación informativa"
        title={['Planificá', 'cada kilómetro.']}
        accent={1}
        photoId={PHOTOS.financeHero}
        photoAlt="Sedán eléctrico oscuro al atardecer"
        intro="Entendé cómo funciona un préstamo prendario y simulá cuotas de forma orientativa. Contenido de demostración: no ofrecemos créditos ni garantizamos tasas o aprobaciones."
      />

      {/* Calculadora */}
      <section aria-labelledby="simulador" className="container-x py-24 md:py-32">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Eyebrow index="01">Simulador</Eyebrow>
            <RevealTitle id="simulador" lines={['Calculá tu', 'cuota estimada']} accent={1} className="mt-6 text-[clamp(3rem,7vw,6rem)]" />
          </div>
          <p data-reveal className="text-ice/70 md:col-span-4 md:col-start-9">
            Modificá capital, plazo y tasa. El cálculo usa el sistema francés y se actualiza al instante.
          </p>
        </div>

        <div className="mt-14 grid gap-px bg-ice/10 lg:grid-cols-12">
          <form className="space-y-9 bg-petrol p-6 sm:p-10 lg:col-span-6" onSubmit={(e) => e.preventDefault()} aria-label="Datos de la simulación">
            {/* Capital */}
            <div>
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor="fin-capital" className="eyebrow text-steel">
                  Capital a financiar
                </label>
                <span className="text-xs text-steel">ARS</span>
              </div>
              <div className="relative mt-3">
                <span aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-steel">
                  $
                </span>
                <input
                  id="fin-capital"
                  inputMode="numeric"
                  value={capitalInput}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setCapitalInput(digits ? formatNumber(Number(digits)) : '');
                  }}
                  aria-invalid={capitalError ? true : undefined}
                  aria-describedby={capitalError ? 'fin-capital-error' : undefined}
                  className="field !h-14 !pl-9 text-lg font-semibold tabular-nums"
                />
              </div>
              <input
                type="range"
                aria-label="Ajustar capital"
                min={MIN_CAPITAL}
                max={MAX_CAPITAL}
                step={1_000_000}
                value={clamp(capital, MIN_CAPITAL, MAX_CAPITAL)}
                onChange={(e) => setCapitalInput(formatNumber(Number(e.target.value)))}
                className="mt-4 w-full accent-lime"
              />
              {capitalError && (
                <p id="fin-capital-error" role="alert" className="mt-2 text-xs font-medium text-[#ff8a7a]">
                  {capitalError}
                </p>
              )}
            </div>

            {/* Plazo */}
            <fieldset>
              <legend className="eyebrow text-steel">Plazo en meses</legend>
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
                {TERMS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={months === t}
                    onClick={() => setMonths(t)}
                    className={`h-12 border text-sm font-semibold tabular-nums transition-colors duration-300 ${
                      months === t ? 'border-lime bg-lime text-petrol' : 'border-ice/15 text-ice/80 hover:border-ice/50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Tasa */}
            <div>
              <label htmlFor="fin-rate" className="eyebrow text-steel">
                Tasa nominal anual (TNA) — editable
              </label>
              <div className="relative mt-3 max-w-[14rem]">
                <input
                  id="fin-rate"
                  inputMode="decimal"
                  value={rateInput}
                  onChange={(e) => setRateInput(e.target.value.replace(/[^\d.,]/g, '').slice(0, 6))}
                  aria-invalid={rateError ? true : undefined}
                  aria-describedby={rateError ? 'fin-rate-error' : 'fin-rate-hint'}
                  className="field !h-14 !pr-10 text-lg font-semibold tabular-nums"
                />
                <span aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-steel">
                  %
                </span>
              </div>
              {rateError ? (
                <p id="fin-rate-error" role="alert" className="mt-2 text-xs font-medium text-[#ff8a7a]">
                  {rateError}
                </p>
              ) : (
                <p id="fin-rate-hint" className="mt-2 text-xs text-steel">
                  Valor de ejemplo. Consultá la tasa vigente con la entidad financiera que elijas.
                </p>
              )}
            </div>
          </form>

          {/* Resultado */}
          <div className="relative flex flex-col bg-graphite/50 p-6 sm:p-10 lg:col-span-6" aria-live="polite">
            <p className="eyebrow text-steel">Cuota mensual estimada</p>
            <p className="display mt-3 break-words text-[clamp(3.4rem,8vw,6.5rem)] leading-none text-lime tabular-nums">
              {summary ? formatARS(summary.payment) : '—'}
            </p>
            <p className="mt-2 text-sm text-steel">
              {months} cuotas fijas · TEM {summary ? `${(summary.monthlyRate * 100).toLocaleString('es-AR', { maximumFractionDigits: 2 })} %` : '—'}
            </p>

            <dl className="mt-10 grid grid-cols-1 gap-px bg-ice/10 sm:grid-cols-3">
              {[
                ['Capital', summary ? formatARS(capital) : '—'],
                ['Intereses', summary ? formatARS(summary.interest) : '—'],
                ['Total a pagar', summary ? formatARS(summary.total) : '—'],
              ].map(([k, val]) => (
                <div key={k} className="bg-petrol p-4">
                  <dt className="text-xs text-steel">{k}</dt>
                  <dd className="mt-1 font-semibold tabular-nums">{val}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8">
              <div className="flex justify-between text-xs text-steel">
                <span>Capital</span>
                <span>Intereses {summary ? `${Math.round(interestShare * 100)} %` : ''}</span>
              </div>
              <div className="mt-2 flex h-2 overflow-hidden bg-ice/10" aria-hidden>
                <span className="h-full bg-ice transition-[width] duration-500" style={{ width: `${(1 - interestShare) * 100}%` }} />
                <span className="h-full bg-lime transition-[width] duration-500" style={{ width: `${interestShare * 100}%` }} />
              </div>
            </div>

            <p className="mt-8 text-xs leading-relaxed text-steel">
              Fórmula: cuota = C × i ÷ (1 − (1 + i)<sup>−n</sup>), con i = TNA ÷ 12. Resultado orientativo, sin IVA sobre
              intereses, seguros, gastos administrativos ni impuestos.
            </p>
          </div>
        </div>

        <DemoNotice title="Simulación con fines ilustrativos" className="mt-6">
          MOTORES M. es una marca ficticia y este simulador no constituye una oferta, preaprobación ni promesa de crédito.
          Las condiciones reales dependen de cada entidad financiera y de la evaluación crediticia correspondiente.
        </DemoNotice>

        {/* Cronograma */}
        {schedule.length > 0 && (
          <details className="group mt-10 border border-ice/10">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-sm font-semibold uppercase tracking-[0.14em] transition-colors hover:text-lime">
              Ver cronograma de pagos ({schedule.length} cuotas)
              <span aria-hidden className="text-lime transition-transform duration-300 group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="max-h-[420px] overflow-auto border-t border-ice/10">
              <table className="w-full min-w-[560px] text-left text-sm tabular-nums">
                <caption className="sr-only">Cronograma de amortización orientativo</caption>
                <thead className="sticky top-0 bg-graphite text-xs uppercase tracking-[0.12em] text-steel">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-semibold">N.º</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Cuota</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Interés</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Amortización</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((r) => (
                    <tr key={r.period} className="border-t border-ice/5 odd:bg-ice/[0.02]">
                      <td className="px-5 py-2.5 text-steel">{r.period}</td>
                      <td className="px-5 py-2.5">{formatARS(r.payment)}</td>
                      <td className="px-5 py-2.5">{formatARS(r.interest)}</td>
                      <td className="px-5 py-2.5">{formatARS(r.amortization)}</td>
                      <td className="px-5 py-2.5">{formatARS(r.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        )}
      </section>

      {/* Conceptos */}
      <section aria-labelledby="conceptos" className="on-light bg-ice py-24 text-petrol md:py-32">
        <div className="container-x">
          <p className="eyebrow flex items-center gap-3 text-petrol/60">
            <span className="text-petrol">02</span>
            <span aria-hidden className="h-px w-8 bg-current" />
            Conceptos clave
          </p>
          <RevealTitle id="conceptos" lines={['Antes de financiar,', 'entendé los números.']} className="mt-6 text-[clamp(2.8rem,6vw,5.6rem)]" />
          <dl className="mt-16 grid border-t border-petrol/15 sm:grid-cols-2 lg:grid-cols-4">
            {CONCEPTS.map((c) => (
              <div key={c.title} data-reveal className="border-b border-petrol/15 py-8 sm:px-6 sm:[&:nth-child(odd)]:border-r lg:border-r lg:last:border-r-0 lg:first:pl-0">
                <dt className="display text-4xl">{c.title}</dt>
                <dd className="mt-3 text-sm leading-relaxed text-petrol/75">{c.text}</dd>
              </div>
            ))}
          </dl>
          <div data-reveal className="mt-14 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/catalogo" variant="dark">
              Elegí un auto
            </ButtonLink>
            <ButtonLink to="/contacto" variant="ghost" className="!text-petrol hover:!text-petrol/70">
              Hacer una consulta
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
