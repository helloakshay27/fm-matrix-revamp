import type { PostHog } from 'posthog-js';

/**
 * One console line per PostHog event, and nothing else in the console.
 *
 * Hooks `eventCaptured`, which posthog-js emits immediately before an event goes out, so a
 * single listener covers all ~21 event modules plus `$pageview` — nothing was added at the
 * capture sites and there is nothing to strip out later.
 *
 * While enabled it also quietens the rest of the app's console chatter (the sidebar/render
 * traces and so on) by filtering `console.log/info/warn/debug/...` down to lines tagged
 * `[PostHog]`. That patch lives here rather than in the ~20 files doing the logging, so no
 * existing code changes and nothing has to be undone later.
 *
 * `console.error` is deliberately left alone — hiding real errors while you are testing
 * would cost more than the quiet is worth. Silence it too with `ph_debug = 'strict'`.
 *
 * Modes, via `localStorage.ph_debug`:
 *   '1'       PostHog lines only, everything except console.error suppressed  (default in dev)
 *   'strict'  PostHog lines only, console.error suppressed as well
 *   'all'     PostHog lines plus the app's normal console output
 *   '0'       off entirely
 *
 *   turn on   → localStorage.ph_debug = '1'; location.reload()
 *   turn off  → localStorage.removeItem('ph_debug'); location.reload()
 *   restore the console without reloading → __posthogDebug.restoreConsole()
 */

const FLAG = 'ph_debug';
const TAG = '[PostHog]';

type DebugMode = 'off' | 'only' | 'strict' | 'all';

function readMode(): DebugMode {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(FLAG);
  } catch {
    /* storage unavailable — fall through to the build-mode default */
  }
  if (raw === '0') return 'off';
  if (raw === 'all') return 'all';
  if (raw === 'strict') return 'strict';
  if (raw === '1') return 'only';
  return import.meta.env.DEV ? 'only' : 'off';
}

export function isPostHogDebugEnabled(): boolean {
  return readMode() !== 'off';
}

interface CapturedEvent {
  event?: string;
  properties?: Record<string, unknown>;
}

/** Console methods that get filtered. `error` is handled separately. */
const NOISY = [
  'log', 'info', 'warn', 'debug', 'trace', 'dir', 'table',
  'group', 'groupCollapsed', 'groupEnd', 'count', 'time', 'timeEnd', 'timeLog',
] as const;

type NoisyMethod = (typeof NOISY)[number];
type ConsoleFn = (...args: unknown[]) => void;

/* eslint-disable no-console -- this module exists to write to, and filter, the console */

/** Only our own lines survive: first argument is a string containing `[PostHog]`. */
function isPostHogLine(args: unknown[]): boolean {
  return typeof args[0] === 'string' && args[0].includes(TAG);
}

/**
 * Replaces the noisy console methods with filtered versions. Returns a function that puts
 * the originals back, so a tester can get the full console again without reloading.
 */
function silenceEverythingElse(strict: boolean): () => void {
  const originals = {} as Record<string, ConsoleFn>;
  const target = console as unknown as Record<string, ConsoleFn>;

  for (const method of NOISY) {
    const original = target[method];
    if (typeof original !== 'function') continue;
    originals[method] = original;
    target[method] = (...args: unknown[]) => {
      if (isPostHogLine(args)) original.apply(console, args);
    };
  }

  if (strict) {
    const originalError = target.error;
    if (typeof originalError === 'function') {
      originals.error = originalError;
      target.error = (...args: unknown[]) => {
        if (isPostHogLine(args)) originalError.apply(console, args);
      };
    }
  }

  return () => {
    for (const [method, fn] of Object.entries(originals)) target[method] = fn;
  };
}

export function attachPostHogDebugLogger(posthog: PostHog): void {
  const mode = readMode();
  if (mode === 'off') return;

  // Grab the real functions before any filtering, so our own output can never be swallowed
  // by this patch or by anything else that wraps the console later.
  const info: ConsoleFn = console.info.bind(console);

  let restoreConsole: () => void = () => {};
  if (mode === 'only' || mode === 'strict') {
    restoreConsole = silenceEverythingElse(mode === 'strict');
  }

  (window as unknown as Record<string, unknown>).__posthogDebug = {
    restoreConsole: () => {
      restoreConsole();
      info(`%c${TAG}%c console restored — other logs are visible again`,
        'background:#1d4ed8;color:#fff;padding:1px 5px;border-radius:3px;font-weight:600',
        'color:#6b7280');
    },
    mode,
  };

  let n = 0;

  info(
    `%c${TAG}%c trigger logging ON (${mode})${
      mode === 'all' ? '' : ' · other console output suppressed'
    } · restore: __posthogDebug.restoreConsole() · off: localStorage.removeItem('ph_debug')`,
    'background:#1d4ed8;color:#fff;padding:1px 5px;border-radius:3px;font-weight:600',
    'color:#6b7280',
  );

  posthog.on('eventCaptured', (captured: CapturedEvent) => {
    n += 1;
    const name = captured?.event ?? '(unnamed)';
    const p = captured?.properties ?? {};

    // The three properties that decide whether a query can find this event at all (§6.1/§6.7).
    const missing = (['client', 'is_test', 'screen'] as const).filter((k) => p[k] == null);
    const bad = missing.length > 0;

    info(
      `%c${TAG}%c #${n} %c${name}%c ${p.screen ?? '?'} %c${
        bad ? `⚠ missing ${missing.join(', ')}` : `${p.client} · is_test=${p.is_test}`
      }`,
      `background:${bad ? '#b45309' : '#1d4ed8'};color:#fff;padding:1px 5px;border-radius:3px;font-weight:600`,
      'color:#9ca3af',
      'font-weight:600',
      'color:#6b7280',
      `color:${bad ? '#b45309' : '#6b7280'};font-weight:${bad ? '600' : '400'}`,
      // Trailing object: collapsed by default, expand it for the full payload.
      p,
    );
  });
}

/* eslint-enable no-console */
