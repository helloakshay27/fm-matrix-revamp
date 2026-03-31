import React from "react";
import { ArrowLeft, CheckCircle2, Eye, Sparkles, User } from "lucide-react";

export type DiscLetter = "D" | "I" | "S" | "C";

export const DISC_ORDER: DiscLetter[] = ["D", "I", "S", "C"];

/** Trait tiles (standard DISC colors) — matches DiscPersonalityAssessment */
export const DISC_TILE: Record<DiscLetter, { bg: string; label: string }> = {
  D: { bg: "#ef4444", label: "Dominance" },
  I: { bg: "#eab308", label: "Influence" },
  S: { bg: "#22c55e", label: "Steadiness" },
  C: { bg: "#3b82f6", label: "Conscientiousness" },
};

export type DiscProfileResult = {
  counts: Record<DiscLetter, number>;
  scores: Record<DiscLetter, number>;
  primary: DiscLetter;
  secondary: DiscLetter;
  patternName: string;
  blendLabel: string;
  completedAt: string;
};

/** First sentence of PROFILE_COPY per primary — aligns with assessment “About You” */
const ABOUT_PRIMARY_FIRST_SENTENCE: Record<DiscLetter, string> = {
  D: "You lean toward directness, pace, and outcomes.",
  I: "You connect through enthusiasm, storytelling, and rapport.",
  S: "You value consistency, loyalty, and calm collaboration.",
  C: "You prioritize accuracy, structure, and sound reasoning.",
};

/**
 * Build a DISC profile from a table row’s 4-digit score string (D,I,S,C) and labels.
 */
export function buildDiscProfileFromTableRow(
  discScoreStr: string,
  profileName: string,
  style: string
): DiscProfileResult {
  const digits = discScoreStr.replace(/\D/g, "").slice(0, 4).padStart(4, "0");
  const scores: Record<DiscLetter, number> = {
    D: parseInt(digits[0], 10) || 0,
    I: parseInt(digits[1], 10) || 0,
    S: parseInt(digits[2], 10) || 0,
    C: parseInt(digits[3], 10) || 0,
  };
  const counts: Record<DiscLetter, number> = {
    D: Math.max(1, Math.round(scores.D * 1.1)),
    I: Math.max(1, Math.round(scores.I * 1.1)),
    S: Math.max(1, Math.round(scores.S * 1.1)),
    C: Math.max(1, Math.round(scores.C * 1.1)),
  };
  const order: DiscLetter[] = ["D", "I", "S", "C"];
  const sorted = [...order].sort((a, b) => scores[b] - scores[a]);
  const primary = sorted[0];
  const secondary = sorted[1] ?? primary;
  return {
    counts,
    scores,
    primary,
    secondary,
    patternName: profileName,
    blendLabel: style,
    completedAt: new Date().toISOString(),
  };
}

export function DiscAssessmentResultsModal({
  onClose,
  onViewProfile,
  result,
  aboutYouOverride,
}: {
  onClose: () => void;
  onViewProfile: () => void;
  result: DiscProfileResult;
  /** When set (e.g. from PROFILE_COPY), overrides default first-line “About You” */
  aboutYouOverride?: string;
}) {
  const aboutYou =
    aboutYouOverride?.trim() ??
    ABOUT_PRIMARY_FIRST_SENTENCE[result.primary] ??
    "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2a2620]/45 px-4 py-6 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="disc-results-title"
    >
      <div className="flex max-h-[min(92vh,880px)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#DA7756]/25 bg-[#fef6f4] shadow-xl sm:max-w-xl">
        <div className="shrink-0 bg-gradient-to-br from-[#DA7756] via-[#DA7756] to-[#b85d3c] px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
              <CheckCircle2
                className="h-7 w-7 text-[#DA7756]"
                strokeWidth={2.5}
                aria-hidden
              />
            </div>
            <div className="min-w-0 pt-0.5">
              <h2
                id="disc-results-title"
                className="text-lg font-bold text-white sm:text-xl"
              >
                Assessment Complete! 🥳
              </h2>
              <p className="mt-1 text-sm text-white/95">
                Your DISC profile has been created
              </p>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
          <div className="grid grid-cols-2 gap-3">
            <div
              className="flex flex-col items-center justify-center rounded-xl px-2 py-6 text-center shadow-sm sm:py-8"
              style={{ backgroundColor: DISC_TILE[result.primary].bg }}
            >
              <span className="text-4xl font-bold text-white sm:text-5xl">
                {result.primary}
              </span>
              <span className="mt-2 text-xs font-semibold text-white/95 sm:text-sm">
                Primary Type
              </span>
            </div>
            <div
              className="flex flex-col items-center justify-center rounded-xl px-2 py-6 text-center shadow-sm sm:py-8"
              style={{ backgroundColor: DISC_TILE[result.secondary].bg }}
            >
              <span className="text-4xl font-bold text-white sm:text-5xl">
                {result.secondary}
              </span>
              <span className="mt-2 text-xs font-semibold text-white/95 sm:text-sm">
                Secondary Type
              </span>
            </div>
          </div>

          <div className="mt-4 rounded-xl border-2 border-[#DA7756]/40 bg-gradient-to-b from-[#DA7756]/12 to-[#DA7756]/6 px-4 py-4 sm:px-5 sm:py-5">
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-900">
              <Sparkles
                className="h-4 w-4 shrink-0 text-[#DA7756]"
                aria-hidden
              />
              Your Pattern
            </div>
            <p className="mt-3 text-center text-2xl font-bold text-neutral-900 sm:text-3xl">
              {result.patternName}
            </p>
            <p className="mt-1 text-center text-sm font-medium text-neutral-600">
              The {result.patternName}
            </p>
          </div>

          <div className="mt-4 rounded-xl border-2 border-[#DA7756]/30 bg-white px-4 py-4 shadow-sm sm:px-5 sm:py-5">
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-900">
              <User className="h-4 w-4 shrink-0 text-[#DA7756]" aria-hidden />
              About You
            </div>
            <p className="mt-3 text-sm leading-relaxed text-neutral-700">
              {aboutYou}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {DISC_ORDER.map((L) => (
              <div
                key={L}
                className="flex flex-col items-center justify-center rounded-xl px-2 py-3 text-center shadow-sm sm:py-4"
                style={{ backgroundColor: DISC_TILE[L].bg }}
              >
                <span className="text-2xl font-bold tabular-nums text-white sm:text-3xl">
                  {result.scores[L]}
                </span>
                <span className="mt-1 text-center text-[10px] font-semibold leading-tight text-white sm:text-xs">
                  {DISC_TILE[L].label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-neutral-200 bg-white px-4 py-4 shadow-sm sm:px-5 sm:py-5">
            <h3 className="text-sm font-bold text-neutral-900">
              Scoring Breakdown
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {DISC_ORDER.map((L) => {
                const raw = result.counts[L];
                const calc = (raw / 15) * 7;
                return (
                  <div
                    key={L}
                    className="rounded-xl border-2 bg-[#fef6f4] px-3 py-3"
                    style={{ borderColor: DISC_TILE[L].bg }}
                  >
                    <p
                      className="text-sm font-bold"
                      style={{ color: DISC_TILE[L].bg }}
                    >
                      {DISC_TILE[L].label}
                    </p>
                    <ul className="mt-2 space-y-1 text-xs text-neutral-800 sm:text-sm">
                      <li className="flex justify-between gap-2 tabular-nums">
                        <span className="text-neutral-500">Raw</span>
                        <span className="font-medium">{raw}</span>
                      </li>
                      <li className="flex justify-between gap-2 tabular-nums">
                        <span className="text-neutral-500">Calc</span>
                        <span className="font-medium">{calc.toFixed(2)}</span>
                      </li>
                      <li className="flex justify-between gap-2 tabular-nums">
                        <span className="text-neutral-500">Final</span>
                        <span className="font-semibold text-neutral-900">
                          {result.scores[L]}
                        </span>
                      </li>
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 space-y-3 pb-1">
            <button
              type="button"
              onClick={onViewProfile}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#DA7756] to-[#c9654a] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-95"
            >
              <Eye className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
              View Full Report
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#DA7756]/30 bg-white px-6 py-3.5 text-sm font-semibold text-neutral-900 shadow-sm transition-colors hover:border-[#DA7756]/50 hover:bg-[#DA7756]/5"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
