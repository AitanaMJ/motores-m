export type Errors<T> = Partial<Record<keyof T, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

/** Teléfono: entre 8 y 15 dígitos; admite +, espacios, guiones y paréntesis */
export function isPhone(value: string): boolean {
  const v = value.trim();
  if (!/^[+\d\s()-]+$/.test(v)) return false;
  const digits = v.replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 15;
}

export function required(value: string, message: string): string | undefined {
  return value.trim() ? undefined : message;
}

export function validateName(value: string): string | undefined {
  if (!value.trim()) return 'Ingresá tu nombre.';
  if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres.';
  return undefined;
}

export function validateEmail(value: string): string | undefined {
  if (!value.trim()) return 'Ingresá tu email.';
  return isEmail(value) ? undefined : 'Ingresá un email válido (ej.: nombre@dominio.com).';
}

export function validateOptionalPhone(value: string): string | undefined {
  if (!value.trim()) return undefined;
  return isPhone(value) ? undefined : 'Ingresá un teléfono de 8 a 15 dígitos.';
}

export function validateContact(value: string): string | undefined {
  if (!value.trim()) return 'Ingresá un email o teléfono.';
  if (!isEmail(value) && !isPhone(value)) return 'Ingresá un email válido o un teléfono de 8 a 15 dígitos.';
  return undefined;
}

export const CURRENT_YEAR = new Date().getFullYear();

export function validateYear(value: string): string | undefined {
  if (!value.trim()) return 'Ingresá el año.';
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1950 || n > CURRENT_YEAR + 1) return `Ingresá un año entre 1950 y ${CURRENT_YEAR + 1}.`;
  return undefined;
}

export function parseKm(value: string): number {
  return Number(value.replace(/[.\s]/g, ''));
}

export function validateKm(value: string): string | undefined {
  if (!value.trim()) return 'Ingresá el kilometraje.';
  const n = parseKm(value);
  if (!Number.isInteger(n) || n < 0 || n > 1_500_000) return 'Ingresá un kilometraje válido (0 a 1.500.000).';
  return undefined;
}

export function hasErrors<T>(errors: Errors<T>): boolean {
  return Object.values(errors).some(Boolean);
}
