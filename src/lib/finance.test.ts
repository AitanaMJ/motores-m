import { describe, expect, it } from 'vitest';
import { amortizationSchedule, loanSummary, monthlyPayment } from './finance';

describe('monthlyPayment (sistema francés)', () => {
  it('calcula la cuota con la fórmula estándar', () => {
    // 1.000.000 al 12 % anual en 12 meses → 88.848,79 (valor de referencia)
    expect(monthlyPayment({ principal: 1_000_000, months: 12, annualRate: 12 })).toBeCloseTo(88_848.79, 2);
  });

  it('con tasa 0 divide el capital en partes iguales', () => {
    expect(monthlyPayment({ principal: 1_200_000, months: 12, annualRate: 0 })).toBe(100_000);
  });

  it('devuelve 0 ante entradas inválidas', () => {
    expect(monthlyPayment({ principal: 0, months: 12, annualRate: 40 })).toBe(0);
    expect(monthlyPayment({ principal: 1000, months: 0, annualRate: 40 })).toBe(0);
    expect(monthlyPayment({ principal: 1000, months: 12, annualRate: -5 })).toBe(0);
    expect(monthlyPayment({ principal: 1000, months: 12, annualRate: Number.NaN })).toBe(0);
  });

  it('a mayor tasa, mayor cuota', () => {
    const base = { principal: 10_000_000, months: 36 };
    expect(monthlyPayment({ ...base, annualRate: 60 })).toBeGreaterThan(monthlyPayment({ ...base, annualRate: 30 }));
  });
});

describe('loanSummary', () => {
  it('total = cuota × plazo e intereses = total − capital', () => {
    const s = loanSummary({ principal: 5_000_000, months: 24, annualRate: 45 });
    expect(s.total).toBeCloseTo(s.payment * 24, 6);
    expect(s.interest).toBeCloseTo(s.total - 5_000_000, 6);
    expect(s.monthlyRate).toBeCloseTo(0.0375, 10);
  });
});

describe('amortizationSchedule', () => {
  it('amortiza todo el capital y termina con saldo 0', () => {
    const input = { principal: 8_000_000, months: 48, annualRate: 38 };
    const rows = amortizationSchedule(input);
    expect(rows).toHaveLength(48);
    const totalAmortization = rows.reduce((acc, r) => acc + r.amortization, 0);
    expect(totalAmortization).toBeCloseTo(8_000_000, 2);
    expect(rows.at(-1)?.balance).toBe(0);
    // en el sistema francés el interés decrece y la amortización crece
    expect(rows[0].interest).toBeGreaterThan(rows[47].interest);
    expect(rows[0].amortization).toBeLessThan(rows[47].amortization);
  });
});
