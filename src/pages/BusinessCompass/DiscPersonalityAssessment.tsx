import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Award,
  Brain,
  Briefcase,
  CheckCircle2,
  ClipboardList,
  Clock,
  Download,
  Eye,
  FileCode2,
  Globe,
  Lock,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  User,
  Users,
  UsersRound,
  Loader2,
} from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminViewEmulation } from "@/components/AdminViewEmulation";
import { DiscAssessmentResultsModal } from "@/components/DiscAssessmentResultsModal";
import { getToken, getBaseUrl } from "@/utils/auth";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "bn", label: "বাংলা" },
  { code: "mr", label: "मराठी" },
  { code: "te", label: "తెలుగు" },
  { code: "ta", label: "தமிழ்" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
] as const;

/** YouTube video ID for embed — replace with your chosen DISC overview */
const DISC_VIDEO_EMBED_ID = "MJFElqpVPIQ";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  department: string;
  avatarLetter: string;
  avatarBg: string;
  score: number;
  scorePanelClass: string;
  primaryBadge: { label: string; className: string };
  secondaryBadge: { label: string; className: string };
  trait: string;
  discType: string;
  pattern: string;
};

const MOCK_TEAM: TeamMember[] = [
  {
    id: "1",
    name: "Ken Anderson",
    role: "Manager",
    department: "Design",
    avatarLetter: "K",
    avatarBg: "bg-violet-600",
    score: 4274,
    scorePanelClass: "bg-emerald-800",
    primaryBadge: {
      label: "S Primary",
      className: "bg-emerald-500 text-white",
    },
    secondaryBadge: {
      label: "D Secondary",
      className: "bg-red-500 text-white",
    },
    trait: "Specialist",
    discType: "S",
    pattern: "SD",
  },
  {
    id: "2",
    name: "Alex Rivera",
    role: "Developer",
    department: "Front End",
    avatarLetter: "A",
    avatarBg: "bg-blue-600",
    score: 7415,
    scorePanelClass: "bg-red-800",
    primaryBadge: {
      label: "D Primary",
      className: "bg-red-500 text-white",
    },
    secondaryBadge: {
      label: "C Secondary",
      className: "bg-blue-500 text-white",
    },
    trait: "Creative",
    discType: "D",
    pattern: "DC",
  },
];

type ApiQuestion = {
  id: number;
  text: string;
  options: {
    label: string;
    dimension: string;
  }[];
};

type DiscLetter = "D" | "I" | "S" | "C";

const DISC_ORDER: DiscLetter[] = ["D", "I", "S", "C"];

const DISC_STYLE = {
  D: {
    label: "Dominance",
    short: "D",
    fill: "bg-red-500",
    text: "text-red-600",
    border: "border-red-400",
    chart: "#ef4444",
    bar: "bg-red-500",
  },
  I: {
    label: "Influence",
    short: "I",
    fill: "bg-amber-500",
    text: "text-amber-600",
    border: "border-amber-400",
    chart: "#f59e0b",
    bar: "bg-amber-500",
  },
  S: {
    label: "Steadiness",
    short: "S",
    fill: "bg-emerald-500",
    text: "text-emerald-600",
    border: "border-emerald-400",
    chart: "#10b981",
    bar: "bg-emerald-500",
  },
  C: {
    label: "Conscientiousness",
    short: "C",
    fill: "bg-sky-600",
    text: "text-sky-700",
    border: "border-sky-500",
    chart: "#0284c7",
    bar: "bg-sky-600",
  },
} as const;

/** Trait tiles in the completion report (standard DISC colors, readable on white UI). */
const DISC_TILE: Record<DiscLetter, { bg: string; label: string }> = {
  D: { bg: "#ef4444", label: "Dominance" },
  I: { bg: "#eab308", label: "Influence" },
  S: { bg: "#22c55e", label: "Steadiness" },
  C: { bg: "#3b82f6", label: "Conscientiousness" },
};

type DiscProfileResult = {
  counts: Record<DiscLetter, number>;
  scores: Record<DiscLetter, number>;
  primary: DiscLetter;
  secondary: DiscLetter;
  patternName: string;
  blendLabel: string;
  completedAt: string;
};

const PATTERN_BY_BLEND: Record<string, string> = {
  DI: "Persuasive Leader",
  DC: "Challenger",
  DS: "Achiever",
  ID: "Inspirational Driver",
  IC: "Collaborative Analyst",
  IS: "Harmonizer",
  SD: "Steady Driver",
  SI: "Counselor",
  SC: "Perfectionist",
  CD: "Objective Thinker",
  CI: "Specialist",
  CS: "Quality Guardian",
};

function patternNameFor(primary: DiscLetter, secondary: DiscLetter): string {
  if (primary === secondary) {
    return (
      {
        D: "Driver",
        I: "Influencer",
        S: "Stabilizer",
        C: "Analyst",
      }[primary] ?? "Balanced"
    );
  }
  const key = `${primary}${secondary}` as keyof typeof PATTERN_BY_BLEND;
  return PATTERN_BY_BLEND[key] ?? `${primary}${secondary} Blend`;
}

function computeDiscResult(answers: number[], questions: ApiQuestion[]): DiscProfileResult {
  const counts: Record<DiscLetter, number> = { D: 0, I: 0, S: 0, C: 0 };
  for (let i = 0; i < questions.length; i++) {
    const idx = answers[i];
    if (idx === undefined || idx < 0 || idx >= questions[i].options.length) continue;
    const dim = questions[i].options[idx].dimension as DiscLetter;
    if (counts[dim] !== undefined) {
      counts[dim] += 1;
    }
  }
  const toScore = (n: number) =>
    Math.max(1, Math.min(7, Math.round(1 + (n / questions.length) * 6)));
  const scores: Record<DiscLetter, number> = {
    D: toScore(counts.D),
    I: toScore(counts.I),
    S: toScore(counts.S),
    C: toScore(counts.C),
  };
  const sorted = [...DISC_ORDER].sort((a, b) => {
    if (counts[b] !== counts[a]) return counts[b] - counts[a];
    return DISC_ORDER.indexOf(a) - DISC_ORDER.indexOf(b);
  });
  const primary = sorted[0];
  const secondary = sorted[1];
  return {
    counts,
    scores,
    primary,
    secondary,
    patternName: patternNameFor(primary, secondary),
    blendLabel: `${primary} + ${secondary}`,
    completedAt: new Date().toISOString(),
  };
}

const PROFILE_COPY: Record<
  DiscLetter,
  {
    archetype: string;
    understanding: string;
    patternNote: string;
    famous: { name: string; role: string }[];
    superpowers: string[];
    growth: string[];
    roles: string[];
    toolkit: string[];
    withOthers: { withType: string; tip: string }[];
  }
> = {
  D: {
    archetype: "The Results Catalyst",
    understanding:
      "You lean toward directness, pace, and outcomes. You are comfortable making calls, cutting through noise, and pushing initiatives forward. Under stress you may become more forceful — channel that energy into clarity and fair expectations so others can keep up.",
    patternNote:
      "Your pattern shows a bias toward action and control. You add the most value when you pair decisiveness with brief context so teammates understand the “why” behind the push.",
    famous: [
      { name: "Steve Jobs", role: "Co-founder, Apple" },
      { name: "Indra Nooyi", role: "Former CEO, PepsiCo" },
      { name: "Jack Welch", role: "Former CEO, GE" },
      { name: "Margaret Thatcher", role: "Former PM, UK" },
    ],
    superpowers: [
      "Cutting through indecision and maintaining momentum",
      "Owning tough calls when timelines are tight",
      "Setting a high bar and modeling accountability",
    ],
    growth: [
      "Pausing to bring others along before you accelerate",
      "Softening tone when stakes feel personal, not operational",
      "Delegating outcomes, not just tasks, to build trust",
    ],
    roles: [
      "Turnaround lead, sales director, operations owner",
      "Crisis response, project rescue, zero-to-one launches",
      "Roles where clarity and pace outweigh consensus cycles",
    ],
    toolkit: [
      "With I-styles: give them a headline first, then details on request",
      "With S-styles: explain impact on people and stability, not just speed",
      "With C-styles: share criteria and data; invite their risk scan",
    ],
    withOthers: [
      { withType: "D-style", tip: "Agree on ownership fast; avoid competing agendas in the same lane." },
      { withType: "I-style", tip: "Let them energize the room; you anchor scope and deadlines." },
      { withType: "S-style", tip: "Signal stability; change in smaller, predictable steps." },
      { withType: "C-style", tip: "Respect their need for accuracy; don’t confuse speed with carelessness." },
    ],
  },
  I: {
    archetype: "The People Energizer",
    understanding:
      "You connect through enthusiasm, storytelling, and rapport. You help teams feel seen and motivated. When pressure rises, you may over-promise or avoid hard truths — balance optimism with specific commitments.",
    patternNote:
      "Your pattern highlights social energy and persuasion. You shine when you translate vision into concrete next steps others can repeat.",
    famous: [
      { name: "Oprah Winfrey", role: "Media executive" },
      { name: "Richard Branson", role: "Founder, Virgin" },
      { name: "Ellen DeGeneres", role: "Entertainer & host" },
      { name: "Tony Robbins", role: "Coach & author" },
    ],
    superpowers: [
      "Building buy-in across roles and seniority",
      "Keeping morale visible during long initiatives",
      "Spotlighting wins so progress feels real",
    ],
    growth: [
      "Documenting decisions so follow-through matches the excitement",
      "Saying no kindly to protect focus",
      "Inviting quieter voices without putting them on the spot",
    ],
    roles: [
      "Client success, marketing, facilitation, partnerships",
      "Change management and culture initiatives",
      "Roles where trust and narrative unlock execution",
    ],
    toolkit: [
      "With D-styles: lead with outcomes, keep updates crisp",
      "With I-styles: co-create energy but agree on one source of truth",
      "With S-styles: check in privately; give time to process",
      "With C-styles: share agendas early; welcome their questions",
    ],
    withOthers: [
      { withType: "D-style", tip: "Match their pace in meetings; send a one-page recap after." },
      { withType: "I-style", tip: "Brainstorm together, then assign owners and dates." },
      { withType: "S-style", tip: "Reassure on process; avoid surprise pivots." },
      { withType: "C-style", tip: "Bottom-line first, then offer depth if they want it." },
    ],
  },
  S: {
    archetype: "The Reliable Anchor",
    understanding:
      "You value consistency, loyalty, and calm collaboration. People trust you to listen and follow through. When overloaded, you may avoid conflict — practice naming trade-offs early so resentment doesn’t build.",
    patternNote:
      "Your pattern reflects patience and service to the team. You’re strongest when priorities are clear and change is communicated with empathy.",
    famous: [
      { name: "Mr. Rogers", role: "Educator & broadcaster" },
      { name: "Dalai Lama", role: "Spiritual leader" },
      { name: "Frederick Douglass", role: "Abolitionist & author" },
      { name: "Mother Teresa", role: "Humanitarian" },
    ],
    superpowers: [
      "Creating psychological safety in steady, practical ways",
      "Remembering commitments and interpersonal nuance",
      "De-escalating tension without ignoring the issue",
    ],
    growth: [
      "Asserting needs before you’re at capacity",
      "Saying yes slowly when scope creeps",
      "Pairing with a D- or I-buddy for decisive moments",
    ],
    roles: [
      "HR partner, customer care lead, program coordinator",
      "Operations with repeat processes and stakeholder care",
      "Roles where follow-through and trust define success",
    ],
    toolkit: [
      "With D-styles: propose options; they decide faster with two paths",
      "With I-styles: gently redirect from idea sprawl to one priority",
      "With S-styles: co-create routines; celebrate small milestones",
      "With C-styles: align on standards; share progress in writing",
    ],
    withOthers: [
      { withType: "D-style", tip: "Prepare a concise recommendation; invite their call." },
      { withType: "I-style", tip: "Affirm their ideas, then steer to one shared plan." },
      { withType: "S-style", tip: "Check workload quietly; offer help swapping tasks." },
      { withType: "C-style", tip: "Share timelines and quality bars up front." },
    ],
  },
  C: {
    archetype: "The Quality Guardian",
    understanding:
      "You prioritize accuracy, structure, and sound reasoning. You raise the quality bar and reduce rework. Under pressure you may over-analyze or withdraw — share “good enough” thresholds so speed and excellence coexist.",
    patternNote:
      "Your pattern points to precision and risk awareness. You deliver most when others understand your standards as a gift to the customer, not a bottleneck.",
    famous: [
      { name: "Bill Gates", role: "Co-founder, Microsoft" },
      { name: "Albert Einstein", role: "Theoretical physicist" },
      { name: "Mark Zuckerberg", role: "Co-founder, Meta" },
      { name: "Angela Merkel", role: "Former Chancellor, Germany" },
    ],
    superpowers: [
      "Spotting flaws before they become incidents",
      "Building systems, checklists, and repeatable quality",
      "Making decisions with evidence instead of hype",
    ],
    growth: [
      "Time-boxing analysis so momentum isn’t lost",
      "Sharing thinking earlier — even when imperfect",
      "Recognizing when a 90% solution unlocks the team",
    ],
    roles: [
      "Engineering lead, finance, compliance, research",
      "QA, architecture, technical writing",
      "Roles where rigor directly protects revenue or safety",
    ],
    toolkit: [
      "With D-styles: lead with the recommendation, keep appendix optional",
      "With I-styles: translate enthusiasm into acceptance criteria",
      "With S-styles: explain changes with empathy and sequence",
      "With C-styles: align definitions; avoid duplicate audits",
    ],
    withOthers: [
      { withType: "D-style", tip: "Offer a clear binary choice with your risk view attached." },
      { withType: "I-style", tip: "Capture their vision in measurable requirements." },
      { withType: "S-style", tip: "Give predictable rhythms; avoid surprise rework." },
      { withType: "C-style", tip: "Agree on sources of truth and version control early." },
    ],
  },
};

function scoreToPercent(score: number): number {
  return Math.round((score / 7) * 100);
}

function DiscDonut({
  score,
  color,
  label,
}: {
  score: number;
  color: string;
  label: string;
}) {
  const r = 38;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, (score / 7) * 100));
  const dash = (pct / 100) * c;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-[7.5rem] w-[7.5rem]">
        <svg
          className="h-full w-full -rotate-90"
          viewBox="0 0 100 100"
          aria-hidden
        >
          <circle
            cx={50}
            cy={50}
            r={r}
            fill="none"
            className="stroke-neutral-200"
            strokeWidth={9}
          />
          <circle
            cx={50}
            cy={50}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={9}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold tabular-nums text-neutral-900">
            {score}
          </span>
        </div>
      </div>
      <span className="max-w-[6.5rem] text-center text-[10px] font-bold uppercase tracking-wide text-neutral-500">
        {label}
      </span>
    </div>
  );
}

function profileCardClass(extra?: string) {
  return cn(
    "rounded-2xl border border-[#DA7756]/15 bg-white p-5 shadow-md shadow-neutral-900/[0.04] sm:p-6",
    extra
  );
}

function DiscProfileReport({
  result,
  displayName,
  emailHint,
  onRetake,
}: {
  result: DiscProfileResult;
  displayName: string;
  emailHint: string;
  onRetake: () => void;
}) {
  const copy = PROFILE_COPY[result.primary];
  const completed = new Date(result.completedAt);
  const dateStr = completed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const chartData = DISC_ORDER.map((L) => ({
    axis: L,
    score: result.scores[L],
  }));
  const initial = displayName.trim().charAt(0).toUpperCase() || "Y";

  return (
    <div className="space-y-6">
      <div
        className={cn(
          profileCardClass("overflow-hidden p-0"),
          "ring-1 ring-[#DA7756]/10"
        )}
      >
        <div className="flex flex-col gap-4 bg-gradient-to-r from-[#DA7756] to-[#c45a3d] px-5 py-5 text-white sm:flex-row sm:items-start sm:justify-between sm:px-6 sm:py-6">
          <div className="flex gap-4">
            <div
              className={cn(
                "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-2xl font-bold backdrop-blur-sm",
                "ring-2 ring-white/30"
              )}
            >
              {initial}
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                {displayName}
              </h2>
              <span className="mt-2 inline-flex rounded-full bg-white/20 px-3 py-0.5 text-xs font-semibold backdrop-blur-sm">
                {result.patternName}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/40 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <Download className="h-4 w-4" strokeWidth={2} />
            Download / Print
          </button>
        </div>
        <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
          <p className="text-xs text-neutral-500 sm:text-sm">
            <span className="font-medium text-neutral-600">{emailHint}</span>
            <span className="mx-2 text-neutral-300">·</span>
            Completed {dateStr}
          </p>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {DISC_ORDER.map((L) => {
              const s = DISC_STYLE[L];
              const sc = result.scores[L];
              const isPrimary = L === result.primary;
              const isSecondary = L === result.secondary && result.primary !== result.secondary;
              return (
                <div
                  key={L}
                  className={cn(
                    "relative flex flex-col rounded-xl border bg-neutral-50/80 p-4",
                    s.border,
                    isPrimary && "bg-white ring-2 ring-[#DA7756]/30"
                  )}
                >
                  {(isPrimary || isSecondary) && (
                    <span
                      className={cn(
                        "absolute -top-2.5 left-3 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white",
                        isPrimary ? "bg-[#DA7756]" : "bg-neutral-500"
                      )}
                    >
                      {isPrimary ? "Primary" : "Secondary"}
                    </span>
                  )}
                  <span className={cn("text-xs font-semibold", s.text)}>
                    {s.label}
                  </span>
                  <span className="mt-2 text-3xl font-bold tabular-nums text-neutral-900">
                    {sc}
                  </span>
                  <span className="mt-1 text-xs text-neutral-500">
                    {scoreToPercent(sc)}% intensity
                  </span>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
                    <div
                      className={cn("h-full rounded-full transition-all", s.bar)}
                      style={{ width: `${scoreToPercent(sc)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={profileCardClass()}>
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white",
              DISC_STYLE[result.primary].fill
            )}
          >
            {result.primary}
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900">
              {DISC_STYLE[result.primary].label} – {copy.archetype}
            </h3>
            <p className="mt-1 text-sm text-neutral-500">
              Understanding your personality type
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-neutral-600">
          {copy.understanding}
        </p>
      </div>

      <div
        className={cn(
          profileCardClass("overflow-hidden p-0"),
          "border-[#DA7756]/20"
        )}
      >
        <div className="bg-gradient-to-r from-neutral-800 to-neutral-900 px-5 py-4 text-center text-white sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/90">
            You&apos;re in good company
          </p>
          <p className="mt-1 text-sm text-white/75">
            Leaders with a similar {result.primary}-style emphasis
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 bg-[#f6f4ee] p-5 sm:grid-cols-4 sm:p-6">
          {copy.famous.map((person) => (
            <div key={person.name} className="text-center">
              <div
                className={cn(
                  "mx-auto flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold text-white shadow-md",
                  DISC_STYLE[result.primary].fill
                )}
              >
                {person.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <p className="mt-2 text-sm font-semibold text-neutral-900">
                {person.name}
              </p>
              <p className="text-xs text-neutral-500">{person.role}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={profileCardClass()}>
        <h3 className="text-lg font-bold text-neutral-900">
          DISC score distribution
        </h3>
        <p className="mt-1 text-sm text-neutral-500">
          Relative strength on a 1–7 scale for each dimension
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-8 sm:justify-between">
          {DISC_ORDER.map((L) => (
            <DiscDonut
              key={L}
              score={result.scores[L]}
              color={DISC_STYLE[L].chart}
              label={DISC_STYLE[L].label}
            />
          ))}
        </div>
      </div>

      <div className={profileCardClass()}>
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <Brain className="h-6 w-6" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900">
              {result.patternName}
            </h3>
            <p className="text-sm text-neutral-500">Your exact DISC pattern</p>
            <p className="mt-0.5 text-xs font-medium text-[#DA7756]">
              {result.blendLabel}
            </p>
          </div>
        </div>
        <div className="mt-6 h-56 w-full sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 8, right: 16, left: -20, bottom: 0 }}
            >
              <XAxis dataKey="axis" tick={{ fontSize: 12 }} />
              <YAxis domain={[1, 7]} ticks={[1, 2, 3, 4, 5, 6, 7]} width={28} />
              <Tooltip
                formatter={(v: number) => [`${v}`, "Score"]}
                labelFormatter={(l) => `${l} — ${DISC_STYLE[l as DiscLetter].label}`}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#171717"
                strokeWidth={2}
                dot={{ r: 5, fill: "#171717", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-neutral-600">
          {copy.patternNote}
        </p>
      </div>

      <div className={profileCardClass()}>
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
            <Lock className="h-5 w-5" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900">
              Your personalized action plan
            </h3>
            <p className="text-sm text-neutral-500">
              Practical moves aligned with your {result.primary}-style strengths
            </p>
          </div>
        </div>
        <Accordion type="single" collapsible className="mt-5 space-y-2">
          {[
            {
              id: "p1",
              title: "Part 1: Your superpowers (top strengths)",
              icon: Target,
              iconClass: "text-emerald-600 bg-emerald-100",
              items: copy.superpowers,
            },
            {
              id: "p2",
              title: "Part 2: Your growth zones (focus areas)",
              icon: TrendingUp,
              iconClass: "text-amber-600 bg-amber-100",
              items: copy.growth,
            },
            {
              id: "p3",
              title: "Part 3: Where you thrive (best roles)",
              icon: Briefcase,
              iconClass: "text-sky-600 bg-sky-100",
              items: copy.roles,
            },
            {
              id: "p4",
              title: "Part 4: Your interpersonal toolkit",
              icon: UsersRound,
              iconClass: "text-violet-600 bg-violet-100",
              items: copy.toolkit,
            },
          ].map((section) => (
            <AccordionItem
              key={section.id}
              value={section.id}
              className="rounded-xl border border-neutral-200 bg-neutral-50/50 px-1"
            >
              <AccordionTrigger className="px-3 py-3 text-left hover:no-underline [&>svg]:text-neutral-400">
                <span className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                      section.iconClass
                    )}
                  >
                    <section.icon className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <span className="text-sm font-semibold text-neutral-900">
                    {section.title}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-3 pb-3 pt-0">
                <ul className="list-disc space-y-2 pl-8 text-sm text-neutral-600">
                  {section.items.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className={profileCardClass()}>
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-200 text-neutral-700">
            <ClipboardList className="h-5 w-5" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900">
              Personal commitment (your next steps)
            </h3>
            <p className="mt-1 text-sm text-neutral-500">
              Jot notes here or in your journal — export via Print above.
            </p>
          </div>
        </div>
        <ol className="mt-5 space-y-6 text-sm text-neutral-700">
          {[
            "Which growth zone is currently holding you back the most — and what is one habit you will try this week?",
            "Where can you apply a superpower in a project that needs it within the next 14 days?",
            "Who on your team has a different primary style, and how will you adapt one conversation with them?",
          ].map((q, i) => (
            <li key={i}>
              <span className="font-semibold text-neutral-900">
                {i + 1}. {q}
              </span>
              <div className="mt-2 border-b border-dotted border-neutral-300 pb-1" />
            </li>
          ))}
        </ol>
      </div>

      <div className={profileCardClass()}>
        <div className="flex items-start gap-3">
          <Award className="mt-0.5 h-5 w-5 shrink-0 text-[#DA7756]" strokeWidth={2} />
          <div>
            <h3 className="text-lg font-bold text-neutral-900">
              How you work with others
            </h3>
            <p className="mt-1 text-sm text-neutral-500">
              Tips when collaborating across DISC styles
            </p>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto rounded-xl border border-neutral-200">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-[#DA7756]/10">
                <th className="px-4 py-3 font-semibold text-neutral-800">
                  When working with…
                </th>
                <th className="px-4 py-3 font-semibold text-neutral-800">
                  Tips for your style
                </th>
              </tr>
            </thead>
            <tbody>
              {copy.withOthers.map((row) => (
                <tr
                  key={row.withType}
                  className="border-b border-neutral-100 last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-neutral-800">
                    {row.withType}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{row.tip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center pb-2">
        <button
          type="button"
          onClick={onRetake}
          className="rounded-xl border border-neutral-300 bg-white px-6 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50"
        >
          Retake assessment
        </button>
      </div>
    </div>
  );
}

function TeamMemberCard({ member }: { member: any }) {
  const avatarLetter = member.name?.[0]?.toUpperCase() || "?";

  // Helper to color based on DISC type
  const getDiscColor = (type: string) => {
    switch (type) {
      case 'D': return 'bg-red-500';
      case 'I': return 'bg-amber-500';
      case 'S': return 'bg-emerald-500';
      case 'C': return 'bg-sky-600';
      default: return 'bg-neutral-500';
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-[#DA7756]/10 shadow-md",
        "ring-1 ring-neutral-900/[0.04]"
      )}
    >
      <div className="flex gap-4 p-5">
        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white",
            getDiscColor(member.primary_type)
          )}
        >
          {avatarLetter}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-neutral-900">{member.name}</h3>
          <p className="mt-0.5 text-sm text-neutral-500">
            {member.department}
          </p>
        </div>
      </div>

      <div className={cn("mx-4 mb-4 rounded-xl px-4 py-4 text-white", getDiscColor(member.primary_type))}>
        <p className="text-xs font-medium text-white/80">DISC Score</p>
        <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight">
          {member.score_string || "0000"}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {member.primary_type && (
            <span className="rounded-md bg-white/20 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {member.primary_type} Primary
            </span>
          )}
          {member.secondary_type && (
            <span className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {member.secondary_type} Secondary
            </span>
          )}
        </div>
        <p className="mt-3 w-fit border-b border-dotted border-white/70 text-sm font-medium text-white">
          {member.profile_name}
        </p>
      </div>

      <div className="mt-auto p-4 pt-0">
        <button
          type="button"
          onClick={() => member.onViewReport?.(member.attempt_id)}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl bg-[#DA7756]",
            "py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#DA7756]/85"
          )}
        >
          <Eye className="h-4 w-4" strokeWidth={2} />
          View Full Profile
        </button>
      </div>
    </div>
  );
}

function TeamProfilesTabContent({ members, loading, onViewReport }: { members: any[], loading: boolean, onViewReport: (id: any) => void }) {
  const [search, setSearch] = useState("");
  const [discFilter, setDiscFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.department?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q);
      const matchDisc =
        discFilter === "all" || m.primary_type === discFilter;
      const matchDept =
        deptFilter === "all" || m.department === deptFilter;
      return matchSearch && matchDisc && matchDept;
    });
  }, [search, discFilter, deptFilter, members]);

  // Unique departments for filter
  const departments = useMemo(() => {
    const depts = new Set<string>();
    members.forEach(m => { if (m.department) depts.add(m.department); });
    return Array.from(depts).sort();
  }, [members]);

  const filterFieldClass =
    "space-y-1.5 min-w-0 flex-1 sm:min-w-[140px]";

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-[#DA7756]" />
        <p className="mt-4 text-sm font-medium text-neutral-600">Loading team profiles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-4 shadow-sm backdrop-blur-sm sm:p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className={filterFieldClass}>
            <label className="text-xs font-medium text-neutral-500">
              Search by name
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search team members..."
                className="h-11 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-[#DA7756]/25"
              />
            </div>
          </div>
          <div className={filterFieldClass}>
            <label className="text-xs font-medium text-neutral-500">
              Filter by DISC type
            </label>
            <Select value={discFilter} onValueChange={setDiscFilter}>
              <SelectTrigger className="h-11 rounded-xl border-neutral-200 bg-white">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="D">D</SelectItem>
                <SelectItem value="I">I</SelectItem>
                <SelectItem value="S">S</SelectItem>
                <SelectItem value="C">C</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className={filterFieldClass}>
            <label className="text-xs font-medium text-neutral-500">
              Filter by Department
            </label>
            <Select value={deptFilter} onValueChange={setDeptFilter}>
              <SelectTrigger className="h-11 rounded-xl border-neutral-200 bg-white">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 py-16 text-center shadow-sm">
          <Users className="mx-auto h-10 w-10 text-neutral-300" />
          <p className="mt-3 text-sm text-neutral-600">No team members match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filtered.map((member, idx) => (
            <TeamMemberCard key={member.attempt_id || idx} member={{ ...member, onViewReport }} />
          ))}
        </div>
      )}
    </div>
  );
}

function AssessmentInterface({
  currentQuestion,
  totalQuestions,
  question,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  onPrevious,
  onFinish,
  isSubmitting = false
}: {
  currentQuestion: number;
  totalQuestions: number;
  question: ApiQuestion;
  selectedAnswer: number | null;
  onAnswerSelect: (answer: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onFinish: () => void;
  isSubmitting?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#DA7756]/20 bg-[#fef6f4] p-6 shadow-sm sm:p-8">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-neutral-600 mb-2">
          <span>Question {currentQuestion + 1} of {totalQuestions}</span>
          <span>{Math.round(((currentQuestion + 1) / totalQuestions) * 100)}% Complete</span>
        </div>
        <div className="h-2 w-full rounded-full bg-neutral-200 overflow-hidden">
          <div
            className="h-full bg-[#DA7756] transition-all duration-300 ease-out"
            style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">
          {question.text}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onAnswerSelect(index)}
              className={cn(
                "w-full text-left p-4 rounded-xl border transition-all duration-200",
                "hover:border-[#DA7756]/40 hover:bg-[#DA7756]/5",
                selectedAnswer === index
                  ? "border-[#DA7756] bg-[#DA7756]/10 shadow-sm"
                  : "border-neutral-200 bg-white"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors",
                  selectedAnswer === index
                    ? "border-[#DA7756] bg-[#DA7756]"
                    : "border-neutral-300 bg-white"
                )}>
                  {selectedAnswer === index && (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>
                <span className={cn(
                  "text-sm font-medium",
                  selectedAnswer === index ? "text-[#DA7756]" : "text-neutral-900"
                )}>
                  {option.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 justify-between">
        <button
          type="button"
          onClick={onPrevious}
          disabled={currentQuestion === 0}
          className={cn(
            "px-6 py-3 rounded-xl font-medium transition-colors",
            currentQuestion === 0
              ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
              : "border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
          )}
        >
          Previous
        </button>

        {currentQuestion === totalQuestions - 1 ? (
          <button
            type="button"
            onClick={onFinish}
            disabled={selectedAnswer === null || isSubmitting}
            className={cn(
              "px-6 py-3 rounded-xl font-medium text-white transition-colors flex items-center gap-2",
              (selectedAnswer === null || isSubmitting)
                ? "bg-neutral-300 cursor-not-allowed"
                : "bg-[#DA7756] hover:bg-[#DA7756]/85"
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Finish Assessment"
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            disabled={selectedAnswer === null}
            className={cn(
              "px-6 py-3 rounded-xl font-medium text-white transition-colors",
              selectedAnswer === null
                ? "bg-neutral-300 cursor-not-allowed"
                : "bg-[#DA7756] hover:bg-[#DA7756]/85"
            )}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

const DiscPersonalityAssessment = () => {
  const [mainTab, setMainTab] = useState("report");
  const [language, setLanguage] = useState<string>("en");
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [savedProfile, setSavedProfile] = useState<DiscProfileResult | null>(
    null
  );
  const [selectedMemberReport, setSelectedMemberReport] = useState<DiscProfileResult | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questions, setQuestions] = useState<ApiQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [teamProfiles, setTeamProfiles] = useState<any[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(false);

  useEffect(() => {
    const fetchAssessmentData = async () => {
      try {
        setLoadingQuestions(true);
        const token = getToken();
        const baseUrl = getBaseUrl() || "https://fm-uat-api.lockated.com";
        const headers = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        };

        const [qRes, rRes, tRes] = await Promise.all([
          fetch(`${baseUrl}/disc_assessments/questions`, { headers }).catch(() => null),
          fetch(`${baseUrl}/disc_assessments/my_report`, { headers }).catch(() => null),
          fetch(`${baseUrl}/disc_assessments/team_profiles`, { headers }).catch(() => null)
        ]);

        if (qRes && qRes.ok) {
          const qData = await qRes.json();
          if (qData.success && qData.data && qData.data.questions) {
            setQuestions(qData.data.questions);
          }
        }

        if (rRes && rRes.ok) {
          const rData = await rRes.json();
          if (rData.success && rData.data && rData.data.report) {
            const report = rData.data.report;
            const counts = {
              D: report.scores?.D || 0,
              I: report.scores?.I || 0,
              S: report.scores?.S || 0,
              C: report.scores?.C || 0,
            };
            const toScore = (n: number) =>
              Math.max(1, Math.min(7, Math.round(1 + (n / (report.total_answers || 15)) * 6)));

            setSavedProfile({
              counts,
              scores: {
                D: toScore(counts.D),
                I: toScore(counts.I),
                S: toScore(counts.S),
                C: toScore(counts.C),
              },
              primary: report.primary_type as DiscLetter,
              secondary: (report.secondary_type || report.primary_type) as DiscLetter,
              patternName: report.profile_name || 'Balanced',
              blendLabel: report.style_code || report.primary_type,
              completedAt: report.generated_at || new Date().toISOString(),
            });
          }
        }

        if (tRes && tRes.ok) {
          const tData = await tRes.json();
          if (tData.success && tData.data && tData.data.profiles) {
            setTeamProfiles(tData.data.profiles);
          }
        }
      } catch (error) {
        console.error("Error fetching assessment data:", error);
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchAssessmentData();
  }, []);

  const fetchMemberReport = async (attemptId: number | string) => {
    try {
      setLoadingReport(true);
      const token = getToken();
      const baseUrl = getBaseUrl() || "https://fm-uat-api.lockated.com";
      const response = await fetch(`${baseUrl}/disc_assessments/${attemptId}/report`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      const data = await response.json();
      if (data.success && data.data && data.data.report) {
        const report = data.data.report;
        const counts = {
          D: report.scores?.D || 0,
          I: report.scores?.I || 0,
          S: report.scores?.S || 0,
          C: report.scores?.C || 0,
        };
        const toScore = (n: number) =>
          Math.max(1, Math.min(7, Math.round(1 + (n / (report.total_answers || 15)) * 6)));

        setSelectedMemberReport({
          counts,
          scores: {
            D: toScore(counts.D),
            I: toScore(counts.I),
            S: toScore(counts.S),
            C: toScore(counts.C),
          },
          primary: report.primary_type as DiscLetter,
          secondary: (report.secondary_type || report.primary_type) as DiscLetter,
          patternName: report.profile_name || 'Balanced',
          blendLabel: report.style_code || report.primary_type,
          completedAt: report.generated_at || new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error fetching member report:", error);
    } finally {
      setLoadingReport(false);
    }
  };

  const handleStartAssessment = () => {
    if (questions.length === 0) return;
    setAssessmentStarted(true);
    setCurrentQuestion(0);
    setAnswers([]);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinish = async () => {
    const allAnswered = questions.every(
      (_, i) => answers[i] !== undefined && answers[i] !== null
    );
    if (!allAnswered || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const token = getToken();
      const baseUrl = getBaseUrl() || "https://fm-uat-api.lockated.com";

      // Map answers to the format expected by the backend: [{ question_id: X, dimension: 'D' }, ...]
      const formattedAnswers = answers.map((answerIndex, qIndex) => ({
        question_id: questions[qIndex].id,
        dimension: questions[qIndex].options[answerIndex].dimension
      }));

      const response = await fetch(`${baseUrl}/disc_assessments/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ answers: formattedAnswers })
      });

      const data = await response.json();

      if (data.success && data.data && data.data.report) {
        const report = data.data.report;
        const counts = {
          D: report.scores?.D || 0,
          I: report.scores?.I || 0,
          S: report.scores?.S || 0,
          C: report.scores?.C || 0,
        };
        const toScore = (n: number) =>
          Math.max(1, Math.min(7, Math.round(1 + (n / (report.total_answers || 15)) * 6)));

        const result: DiscProfileResult = {
          counts,
          scores: {
            D: toScore(counts.D),
            I: toScore(counts.I),
            S: toScore(counts.S),
            C: toScore(counts.C),
          },
          primary: report.primary_type as DiscLetter,
          secondary: (report.secondary_type || report.primary_type) as DiscLetter,
          patternName: report.profile_name || 'Balanced',
          blendLabel: report.style_code || report.primary_type,
          completedAt: report.generated_at || new Date().toISOString(),
        };

        setSavedProfile(result);
        setShowResults(true);
      } else {
        // Fallback to local computation if API fails but let's try to notify user
        console.error("Submission failed:", data.message);
        setSavedProfile(computeDiscResult(answers, questions));
        setShowResults(true);
      }
    } catch (error) {
      console.error("Error submitting assessment:", error);
      // Fallback
      setSavedProfile(computeDiscResult(answers, questions));
      setShowResults(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseResults = () => {
    setShowResults(false);
    setAssessmentStarted(false);
  };

  const handleViewProfile = () => {
    setShowResults(false);
    setAssessmentStarted(false);
    setMainTab("profile");
  };

  const handleExitAssessment = () => {
    setAssessmentStarted(false);
  };

  // If assessment is started, show the assessment interface
  if (assessmentStarted) {
    return (
      <div className="min-h-[calc(100vh-4rem)] w-full bg-[#f6f4ee] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#DA7756] shadow-sm">
                <Brain className="h-6 w-6 text-white" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                  DISC Personality Assessment
                </h1>
                <p className="text-sm text-neutral-500">
                  Answer all questions to discover your personality profile
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleExitAssessment}
              className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900"
            >
              Exit Assessment
            </button>
          </header>

          <AssessmentInterface
            currentQuestion={currentQuestion}
            totalQuestions={questions.length}
            question={questions[currentQuestion]}
            selectedAnswer={answers[currentQuestion] ?? null}
            onAnswerSelect={handleAnswerSelect}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onFinish={handleFinish}
            isSubmitting={isSubmitting}
          />

          {/* Results Popup */}
          {showResults && savedProfile && (
            <DiscAssessmentResultsModal
              result={savedProfile}
              onClose={handleCloseResults}
              onViewProfile={handleViewProfile}
              aboutYouOverride={(() => {
                const first =
                  PROFILE_COPY[savedProfile.primary].understanding
                    .split(".")[0]
                    ?.trim() ?? "";
                return first ? `${first}.` : undefined;
              })()}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-[#f6f4ee] px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#DA7756] shadow-sm">
            <Brain className="h-7 w-7 text-white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
              DISC Personality Assessment
            </h1>
            <p className="mt-1 text-sm text-neutral-500 sm:text-base">
              Discover your DISC profile and understand your team
            </p>
          </div>
        </header>

        <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
          <TabsList
            className={cn(
              "grid h-auto w-full grid-cols-1 gap-1 rounded-xl border border-neutral-200/80 bg-neutral-100/90 p-2 sm:grid-cols-3"
            )}
          >
            <TabsTrigger
              value="report"
              className={cn(
                "gap-2 rounded-lg py-2.5 text-sm font-medium text-neutral-600",
                "data-[state=active]:bg-[#DA7756]/10 data-[state=active]:text-neutral-900",
                "data-[state=active]:shadow-sm"
              )}
            >
              <FileCode2 className="h-4 w-4 shrink-0" />
              Get Your Report
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className={cn(
                "gap-2 rounded-lg py-2.5 text-sm font-medium text-neutral-600",
                "data-[state=active]:bg-[#DA7756]/10 data-[state=active]:text-neutral-900",
                "data-[state=active]:shadow-sm"
              )}
            >
              <Eye className="h-4 w-4 shrink-0" />
              Your Profile
            </TabsTrigger>
            <TabsTrigger
              value="team"
              className={cn(
                "gap-2 rounded-lg py-2.5 text-sm font-medium text-neutral-600",
                "data-[state=active]:bg-[#DA7756]/10 data-[state=active]:text-neutral-900",
                "data-[state=active]:shadow-sm"
              )}
            >
              <Users className="h-4 w-4 shrink-0" />
              Team Profiles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="report" className="mt-6 space-y-6 focus-visible:outline-none">
            <div className="space-y-3 rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                <Globe className="h-4 w-4 text-[#DA7756]" strokeWidth={2} />
                <span>Language:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setLanguage(lang.code)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                      language === lang.code
                        ? "border-[#DA7756] bg-[#DA7756] text-white shadow-md shadow-[#DA7756]/20"
                        : "border-transparent bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80 hover:text-neutral-900"
                    )}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            <Accordion type="single" collapsible className="space-y-3">
              <AccordionItem
                value="what-is"
                className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 px-1 shadow-sm"
              >
                <AccordionTrigger
                  className={cn(
                    "px-4 py-4 text-left text-neutral-900 hover:no-underline",
                    "[&>svg]:text-neutral-400"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Brain className="h-5 w-5 shrink-0 text-[#DA7756]" />
                    What is DISC & How Will It Benefit You?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-neutral-600">
                  <p className="text-sm leading-relaxed">
                    DISC is a behavior assessment framework that maps how people
                    tend to act in work settings — Dominance, Influence,
                    Steadiness, and Conscientiousness. Knowing your style helps
                    you communicate better, reduce friction, and play to your
                    strengths.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="how"
                className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 px-1 shadow-sm"
              >
                <AccordionTrigger
                  className={cn(
                    "px-4 py-4 text-left text-neutral-900 hover:no-underline",
                    "[&>svg]:text-neutral-400"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Clock className="h-5 w-5 shrink-0 text-[#DA7756]" />
                    How it works
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-neutral-600">
                  <p className="text-sm leading-relaxed">
                    You&apos;ll answer a short series of questions. There are no
                    right or wrong answers — pick what feels most like you.
                    Results summarize your primary and blend styles so you can
                    use them in day-to-day collaboration.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="discover"
                className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 px-1 shadow-sm"
              >
                <AccordionTrigger
                  className={cn(
                    "px-4 py-4 text-left text-neutral-900 hover:no-underline",
                    "[&>svg]:text-neutral-400"
                  )}
                >
                  What you&apos;ll discover
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-neutral-600">
                  <p className="text-sm leading-relaxed">
                    Your report highlights tendencies under pressure, in
                    teamwork, and when making decisions — plus practical tips to
                    work more effectively with colleagues who have different
                    styles.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <button
              type="button"
              className={cn(
                "w-full rounded-xl bg-[#DA7756]",
                "py-4 text-base font-bold text-white shadow-lg shadow-[#DA7756]/25",
                "transition-transform hover:bg-[#DA7756]/85 hover:scale-[1.01] active:scale-[0.99]",
                (loadingQuestions || questions.length === 0) && "opacity-70 cursor-not-allowed"
              )}
              onClick={handleStartAssessment}
              disabled={loadingQuestions || questions.length === 0}
            >
              {loadingQuestions ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading assessment...
                </span>
              ) : (
                "🚀 Start Assessment"
              )}
            </button>

            <div className="overflow-hidden rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-3">
                <Brain className="mt-0.5 h-5 w-5 shrink-0 text-[#DA7756]" />
                <div>
                  <h2 className="text-base font-bold text-neutral-900 sm:text-lg">
                    Watch: What is DISC?
                  </h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    A quick overview of the DISC model and how it applies to you
                  </p>
                </div>
              </div>
              <div className="mt-4 aspect-video w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                <iframe
                  title="What is DISC — overview"
                  src={`https://www.youtube.com/embed/${DISC_VIDEO_EMBED_ID}`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="profile"
            className="mt-6 focus-visible:outline-none"
          >
            {loadingQuestions ? (
              <div className="overflow-hidden rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 shadow-sm">
                <div className="flex min-h-[min(60vh,440px)] flex-col items-center justify-center px-6 py-16 sm:min-h-[400px] sm:px-10 sm:py-20">
                  <Loader2 className="h-10 w-10 animate-spin text-[#DA7756]" />
                  <p className="mt-4 text-sm font-medium text-neutral-600">Loading your profile...</p>
                </div>
              </div>
            ) : savedProfile ? (
              <div
                className={cn(
                  "rounded-2xl border border-[#DA7756]/20 p-4 shadow-sm sm:p-6",
                  "bg-gradient-to-b from-[#fef6f4] via-[#f6f4ee] to-[#ede8df]"
                )}
              >
                <DiscProfileReport
                  result={savedProfile}
                  displayName="Your profile"
                  emailHint="Saved on this device"
                  onRetake={() => {
                    setSavedProfile(null);
                    setMainTab("report");
                  }}
                />
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 shadow-sm">
                <div className="flex min-h-[min(60vh,440px)] flex-col items-center justify-center px-6 py-16 sm:min-h-[400px] sm:px-10 sm:py-20">
                  <div className="mx-auto flex w-full max-w-md flex-col items-center text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#DA7756]/10 sm:h-24 sm:w-24">
                      <Brain
                        className="h-11 w-11 text-[#DA7756] sm:h-14 sm:w-14"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                    </div>
                    <h2 className="mt-6 text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
                      No profile yet
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-neutral-500 sm:text-[15px]">
                      You haven&apos;t completed a DISC assessment yet. Start
                      the assessment to create your profile.
                    </p>
                    <button
                      type="button"
                      onClick={handleStartAssessment}
                      disabled={loadingQuestions || questions.length === 0}
                      className={cn(
                        "mt-10 flex items-center justify-center gap-2 rounded-xl bg-[#DA7756] px-8 py-3 text-sm font-semibold text-white",
                        "shadow-sm transition-colors",
                        "hover:bg-[#DA7756]/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DA7756]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                        (loadingQuestions || questions.length === 0) && "opacity-70 cursor-not-allowed"
                      )}
                    >
                      {loadingQuestions && <Loader2 className="h-4 w-4 animate-spin" />}
                      Start assessment
                    </button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="team"
            className="mt-6 focus-visible:outline-none"
          >
            <TeamProfilesTabContent members={teamProfiles} loading={loadingQuestions} onViewReport={fetchMemberReport} />
          </TabsContent>

          {/* Member Report Modal */}
          {selectedMemberReport && (
            <DiscAssessmentResultsModal
              result={selectedMemberReport}
              onClose={() => setSelectedMemberReport(null)}
              onViewProfile={() => {
                // Already viewing
              }}
            />
          )}

          {/* Loading Overlay */}
          {loadingReport && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
              <div className="rounded-2xl bg-white p-6 shadow-xl">
                <Loader2 className="h-8 w-8 animate-spin text-[#DA7756]" />
                <p className="mt-2 text-sm font-medium text-neutral-600">Loading Report...</p>
              </div>
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default DiscPersonalityAssessment;
