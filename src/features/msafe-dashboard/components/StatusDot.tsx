import type { StatusCode } from '../data/constants';

const CHAR: Record<StatusCode, string> = {
  ok: '✓',
  pending: '⋯',
  fail: '✕',
  na: '—',
};

export function StatusDot({ value }: { value: StatusCode }) {
  return <span className={`sdot ${value}`}>{CHAR[value]}</span>;
}
