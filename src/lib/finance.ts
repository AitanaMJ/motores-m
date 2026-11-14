/**
 * Simulador orientativo de préstamo con sistema francés (cuota fija).
 * cuota = C · i / (1 − (1 + i)^−n), con i = TNA / 12 / 100.
 * No incluye IVA sobre intereses, seguros, gastos ni impuestos: es solo una simulación.
 */
export interface LoanInput {
  principal: number;
  months: number;
  /** Tasa nominal anual en porcentaje (ej.: 45 = 45 %) */
  annualRate: number;
}

export interface AmortizationRow {
  period: number;
  payment: number;
  interest: number;
  amortization: number;
  balance: number;
}

export interface LoanSummary {
  payment: number;
  total: number;
  interest: number;
  monthlyRate: number;
}

export function monthlyRate(annualRate: number): number {
  return annualRate / 100 / 12;
}

export function monthlyPayment({ principal, months, annualRate }: LoanInput): number {
  if (!(principal > 0) || !(months > 0) || !Number.isFinite(annualRate) || annualRate < 0) return 0;
  const i = monthlyRate(annualRate);
  if (i === 0) return principal / months;
  return (principal * i) / (1 - Math.pow(1 + i, -months));
}

export function loanSummary(input: LoanInput): LoanSummary {
  const payment = monthlyPayment(input);
  const total = payment * input.months;
  return {
    payment,
    total: payment > 0 ? total : 0,
    interest: payment > 0 ? total - input.principal : 0,
    monthlyRate: monthlyRate(input.annualRate),
  };
}

export function amortizationSchedule(input: LoanInput): AmortizationRow[] {
  const payment = monthlyPayment(input);
  if (payment === 0) return [];
  const i = monthlyRate(input.annualRate);
  const rows: AmortizationRow[] = [];
  let balance = input.principal;
  for (let period = 1; period <= input.months; period++) {
    const interest = balance * i;
    const amortization = payment - interest;
    balance = period === input.months ? 0 : Math.max(0, balance - amortization);
    rows.push({ period, payment, interest, amortization, balance });
  }
  return rows;
}
