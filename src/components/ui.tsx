import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { ArrowUpRight, Info } from 'lucide-react';

/* ---------------- Botones ---------------- */

type Variant = 'primary' | 'outline' | 'dark' | 'ghost';

const base =
  'group relative inline-flex items-center justify-center gap-3 h-12 px-6 text-[0.78rem] font-semibold uppercase tracking-[0.16em] rounded-[2px] select-none whitespace-nowrap transition-[background-color,color,border-color,transform] duration-300 ease-out-expo active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary: 'bg-lime text-petrol hover:bg-ice',
  outline: 'border border-ice/30 text-ice hover:border-lime hover:text-lime',
  dark: 'bg-petrol text-ice hover:bg-graphite',
  ghost: 'text-ice hover:text-lime !px-1',
};

export function buttonClass(variant: Variant = 'primary', extra = '') {
  return `${base} ${variants[variant]} ${extra}`;
}

function Arrow() {
  return (
    <ArrowUpRight
      aria-hidden
      className="size-4 shrink-0 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
    />
  );
}

interface ButtonLinkProps extends LinkProps {
  variant?: Variant;
  arrow?: boolean;
}

export function ButtonLink({ variant = 'primary', arrow = true, className = '', children, ...rest }: ButtonLinkProps) {
  return (
    <Link className={buttonClass(variant, className)} {...rest}>
      <span className="inline-flex items-center gap-3">{children}</span>
      {arrow && <Arrow />}
    </Link>
  );
}

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: Variant;
  arrow?: boolean;
}

export function Button({ variant = 'primary', arrow = false, className = '', children, type = 'button', ...rest }: ButtonProps) {
  return (
    <button type={type} className={buttonClass(variant, className)} {...rest}>
      {children}
      {arrow && <Arrow />}
    </button>
  );
}

/* ---------------- Tipografía ---------------- */

/** Título con revelado por líneas. El texto completo queda accesible para lectores de pantalla. */
export function RevealTitle({
  lines,
  as: Tag = 'h2',
  className = '',
  accent,
  id,
}: {
  lines: string[];
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  /** índice de la línea resaltada en lima */
  accent?: number;
  id?: string;
}) {
  return (
    <Tag className={`display ${className}`} data-lines id={id}>
      <span className="sr-only">{lines.join(' ')}</span>
      {lines.map((line, i) => (
        <span key={i} className="reveal-line" aria-hidden>
          <span className={i === accent ? 'text-lime' : undefined}>{line}</span>
        </span>
      ))}
    </Tag>
  );
}

export function Eyebrow({ index, children, className = '' }: { index?: string; children: ReactNode; className?: string }) {
  return (
    <p className={`eyebrow flex items-center gap-3 text-steel ${className}`}>
      {index && <span className="text-lime">{index}</span>}
      {index && <span aria-hidden className="h-px w-8 bg-current opacity-50" />}
      <span className="inline-flex items-center gap-3">{children}</span>
    </p>
  );
}

/* ---------------- Avisos de demo ---------------- */

export function DemoTag({ children = 'Contenido de demostración', className = '' }: { children?: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border border-current/25 px-2 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.18em] ${className}`}
    >
      <span aria-hidden className="size-1.5 bg-lime" />
      {children}
    </span>
  );
}

export function DemoNotice({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div role="note" className={`flex gap-3 border-l-2 border-lime bg-graphite/60 p-4 text-sm text-ice/85 ${className}`}>
      <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-lime" />
      <div>
        <p className="font-semibold text-ice">{title}</p>
        <div className="mt-1 leading-relaxed text-ice/75">{children}</div>
      </div>
    </div>
  );
}

/* ---------------- Formularios ---------------- */

export function Field({
  id,
  label,
  error,
  hint,
  required,
  children,
  className = '',
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ice/80">
        <span>
          {label}
          {required && <span className="text-lime" aria-hidden> *</span>}
        </span>
        {!required && <span className="text-[0.66rem] font-medium normal-case tracking-normal text-steel">Opcional</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-steel">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-[#ff8a7a]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/** Atributos ARIA para un control dentro de <Field> */
export function fieldAria(id: string, error?: string, hint?: string) {
  return {
    id,
    'aria-invalid': error ? (true as const) : undefined,
    'aria-describedby': error ? `${id}-error` : hint ? `${id}-hint` : undefined,
  };
}
