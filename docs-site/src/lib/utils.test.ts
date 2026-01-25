import {describe, expect, it} from 'vitest';
import {clamp, formatNumber, formatPercent} from './utils';

describe('formatNumber', () => {
  it('formats millions correctly', () => {
    expect(formatNumber(31_746_841)).toBe('31.7M');
    expect(formatNumber(1_000_000)).toBe('1.0M');
    expect(formatNumber(5_500_000)).toBe('5.5M');
  });

  it('formats thousands correctly', () => {
    expect(formatNumber(1_000)).toBe('1.0K');
    expect(formatNumber(5_500)).toBe('5.5K');
    expect(formatNumber(999_999)).toBe('1000.0K');
  });

  it('returns plain number for small values', () => {
    expect(formatNumber(999)).toBe('999');
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(42)).toBe('42');
  });
});

describe('formatPercent', () => {
  it('converts decimal to percentage', () => {
    expect(formatPercent(0.44)).toBe('44%');
    expect(formatPercent(0.5)).toBe('50%');
    expect(formatPercent(1)).toBe('100%');
    expect(formatPercent(0)).toBe('0%');
  });
});

describe('clamp', () => {
  it('clamps values within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('handles edge cases', () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });
});
