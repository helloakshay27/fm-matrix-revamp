import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Brain,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Eye,
  Gauge,
  Loader2,
  Mail,
  Search,
  Sparkles,
  Users,
  UserRound,
  UsersRound,
} from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
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
import { getToken, getBaseUrl } from "@/utils/auth";

type DiscLetter = "D" | "I" | "S" | "C";

const DISC_ORDER: DiscLetter[] = ["D", "I", "S", "C"];

const DISC_STYLE = {
  D: {
    label: "Dominance",
    short: "D",
    fill: "bg-[#e11d48]",
    text: "text-[#e11d48]",
    border: "border-[#e11d48]",
    chart: "#e11d48",
    badge: "bg-[#e11d48]",
    lightBg: "bg-[#e11d48]/5",
  },
  I: {
    label: "Influence",
    short: "I",
    fill: "bg-[#f59e0b]",
    text: "text-[#f59e0b]",
    border: "border-[#f59e0b]",
    chart: "#f59e0b",
    badge: "bg-[#f59e0b]",
    lightBg: "bg-[#f59e0b]/5",
  },
  S: {
    label: "Steadiness",
    short: "S",
    fill: "bg-[#10b981]",
    text: "text-[#10b981]",
    border: "border-[#10b981]",
    chart: "#10b981",
    badge: "bg-[#10b981]",
    lightBg: "bg-[#10b981]/5",
  },
  C: {
    label: "Conscientiousness",
    short: "C",
    fill: "bg-[#3b82f6]",
    text: "text-[#3b82f6]",
    border: "border-[#3b82f6]",
    chart: "#3b82f6",
    badge: "border border-[#3b82f6] text-[#3b82f6] bg-white",
    lightBg: "bg-[#3b82f6]/5",
  },
} as const;

type ApiQuestion = {
  id: number;
  text: string;
  options: {
    label: string;
    dimension: string;
  }[];
};

type DiscProfileResult = {
  counts: Record<DiscLetter, number>;
  scores: Record<DiscLetter, number>;
  percentages?: Record<DiscLetter, number>;
  totalAnswers: number;
  primary: DiscLetter;
  secondary: DiscLetter;
  patternName: string;
  blendLabel: string;
  completedAt: string;
  attemptId?: string | number;
  encryptedAttemptId?: string;
};

const PATTERN_BY_BLEND: Record<string, string> = {
  DI: "Creative",
  DC: "Challenger",
  DS: "Achiever",
  ID: "Inspirational",
  IC: "Collaborative Analyst",
  IS: "Harmonizer",
  SD: "Steady Driver",
  SI: "Counselor",
  SC: "Perfectionist",
  CD: "Objective Thinker",
  CI: "Specialist",
  CS: "Quality Guardian",
};

const fadeUpMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.28, ease: "easeOut" },
};

function patternNameFor(primary: DiscLetter, secondary: DiscLetter): string {
  if (primary === secondary) {
    return (
      { D: "Driver", I: "Influencer", S: "Stabilizer", C: "Analyst" }[
        primary
      ] ?? "Balanced"
    );
  }
  const key = `${primary}${secondary}` as keyof typeof PATTERN_BY_BLEND;
  return PATTERN_BY_BLEND[key] ?? `${primary}${secondary} Blend`;
}

function computeDiscResult(
  answers: number[],
  questions: ApiQuestion[]
): DiscProfileResult {
  const counts: Record<DiscLetter, number> = { D: 0, I: 0, S: 0, C: 0 };
  for (let i = 0; i < questions.length; i++) {
    const idx = answers[i];
    if (idx === undefined || idx < 0 || idx >= questions[i].options.length)
      continue;
    const dim = questions[i].options[idx].dimension as DiscLetter;
    if (counts[dim] !== undefined) counts[dim] += 1;
  }

  const sorted = [...DISC_ORDER].sort((a, b) => {
    if (counts[b] !== counts[a]) return counts[b] - counts[a];
    return DISC_ORDER.indexOf(a) - DISC_ORDER.indexOf(b);
  });
  const primary = sorted[0];
  const secondary = sorted[1];

  return {
    counts,
    scores: { ...counts },
    totalAnswers: questions.length,
    primary,
    secondary,
    patternName: patternNameFor(primary, secondary),
    blendLabel: `${primary} + ${secondary}`,
    completedAt: new Date().toISOString(),
  };
}

// ─── Profile copy — loaded dynamically from API or falls back to these defaults ───
const PROFILE_COPY_DEFAULTS: Record<
  DiscLetter,
  {
    archetype: string;
    understanding: string;
    patternNote: string;
    superpowers: { title: string; desc: string }[];
    growth: { title: string; desc: string }[];
    roles: { title: string; desc: string }[];
    toolkit: { title: string; desc: string }[];
    withOthers: { withType: string; tip: string; label: string }[];
  }
> = {
  D: {
    archetype: "The Result-Driver",
    understanding:
      "In the fast-paced business landscape, you are the engine that drives growth and hits aggressive targets. You are highly valued for your ability to make quick decisions and take charge during a crisis. While you are exceptionally goal-oriented and efficient, you might sometimes overlook collaborative nuances. You perform at your best when you have autonomy and a clear focus on the bottom line—for you, it is all about the win.",
    patternNote:
      "As a D-style, you possess a unique blend of decisiveness and drive. You don't just find problems; you charge through them. Your ability to cut through ambiguity and push toward results is a massive asset in any organisation. Your growth challenge is dealing with criticism and maintaining patience with slower-paced processes. Developing active listening and learning to present your decisions as collaborative wins will help you get buy-in faster.",
    superpowers: [
      {
        title: "Unflinching Execution",
        desc: "You cut through red tape and bureaucracy to get things done. When a milestone needs to be hit, you are the engine.",
      },
      {
        title: "Crisis Leadership",
        desc: "When things go wrong, you don't panic. You naturally step up, take control, and make the tough calls to stabilise the situation.",
      },
      {
        title: "Fearless Boundary-Pushing",
        desc: "You aren't afraid to challenge the status quo, demand better results, and drive aggressive growth.",
      },
    ],
    growth: [
      {
        title: "Patience with Process",
        desc: "Slowing down to ensure others are aligned before charging forward.",
      },
      {
        title: "Active Listening",
        desc: "Hearing out the 'why' from teammates instead of just demanding the 'what'.",
      },
    ],
    roles: [
      {
        title: "Project Turnarounds",
        desc: "Taking over failing projects and driving them to completion.",
      },
      {
        title: "Sales Leadership",
        desc: "Driving revenue targets and managing high-performance teams.",
      },
    ],
    toolkit: [
      {
        title: "Direct Alignment",
        desc: "Set clear goals without micromanaging the process.",
      },
      {
        title: "Results Framing",
        desc: "Present ideas in terms of outcomes and ROI, not process.",
      },
    ],
    withOthers: [
      {
        label: "Dominance (D)",
        withType: "Dominance",
        tip: "Be brief and direct. Focus on 'winning' together. Agree on boundaries immediately to avoid clashing egos.",
      },
      {
        label: "Influence (I)",
        withType: "Influence",
        tip: "Allow space for small talk and rapport-building before diving into demands. Acknowledge their creativity before expecting the deliverable.",
      },
      {
        label: "Steadiness (S)",
        withType: "Steadiness",
        tip: "Slow down. Don't just order—ask for their support. Explain how the change benefits the team to get their buy-in.",
      },
      {
        label: "Conscientiousness (C)",
        withType: "Conscientiousness",
        tip: "Bring the data. They don't care about your gut feeling. Give them the 'Why' and 'How' in writing, then give them space to work.",
      },
    ],
  },
  I: {
    archetype: "The People Energiser",
    understanding:
      "You are the spark that ignites enthusiasm in any room. You connect through stories, energy, and genuine warmth. Your ability to rally people around a vision makes you a natural in roles that require persuasion and relationship-building. You thrive in dynamic environments where creativity and collaboration are valued.",
    patternNote:
      "As an I-style, your superpower is your ability to make people feel seen and heard. You bring optimism and energy that elevate team morale. Your growth challenge is maintaining follow-through once the initial excitement fades. Building systems for accountability and documentation will help turn your big ideas into lasting results.",
    superpowers: [
      {
        title: "Building Buy-In",
        desc: "You naturally create enthusiasm and alignment across different roles and personalities.",
      },
      {
        title: "Storytelling",
        desc: "You communicate ideas in ways that are memorable, engaging, and inspiring.",
      },
      {
        title: "Network Building",
        desc: "You form genuine connections quickly and maintain relationships effortlessly.",
      },
    ],
    growth: [
      {
        title: "Follow-Through",
        desc: "Documenting decisions and seeing projects through to completion.",
      },
      {
        title: "Detail Orientation",
        desc: "Slowing down to check the fine print before moving forward.",
      },
    ],
    roles: [
      {
        title: "Client Success",
        desc: "Managing relationships and ensuring client satisfaction.",
      },
      {
        title: "Marketing & Partnerships",
        desc: "Building brand presence and forming strategic alliances.",
      },
    ],
    toolkit: [
      {
        title: "Energy Matching",
        desc: "Keep morale visible and celebrate small wins publicly.",
      },
      {
        title: "Visual Communication",
        desc: "Use stories, visuals, and demos over reports and spreadsheets.",
      },
    ],
    withOthers: [
      {
        label: "Dominance (D)",
        withType: "Dominance",
        tip: "Match their pace in meetings; send a one-page recap after so they have the summary.",
      },
      {
        label: "Influence (I)",
        withType: "Influence",
        tip: "Brainstorm together with energy, then assign clear owners and deadlines before ending the conversation.",
      },
      {
        label: "Steadiness (S)",
        withType: "Steadiness",
        tip: "Reassure them on process and avoid surprise pivots—they need predictability to feel secure.",
      },
      {
        label: "Conscientiousness (C)",
        withType: "Conscientiousness",
        tip: "Lead with the bottom line first, then offer the detail if they want it.",
      },
    ],
  },
  S: {
    archetype: "The Reliable Anchor",
    understanding:
      "You are the steady force that keeps teams grounded and functioning through change. You value consistency, loyalty, and genuine collaboration. Your patience and empathy make you someone others naturally turn to for support and guidance. You thrive in environments where you can build deep trust over time.",
    patternNote:
      "As an S-style, your greatest strength is creating psychological safety for your team. People feel comfortable being honest around you. Your growth challenge is asserting your own needs and speaking up before reaching capacity. Learning to set boundaries early and advocate for your ideas will amplify your already significant impact.",
    superpowers: [
      {
        title: "Psychological Safety",
        desc: "Creating a calm, trusting environment where people feel safe to share and take risks.",
      },
      {
        title: "Consistent Delivery",
        desc: "You show up reliably and follow through on commitments without needing external pressure.",
      },
      {
        title: "Deep Listening",
        desc: "You hear not just what people say, but what they mean—making you an exceptional collaborator.",
      },
    ],
    growth: [
      {
        title: "Asserting Needs",
        desc: "Speaking up about workload and boundaries before reaching overwhelm.",
      },
      {
        title: "Embracing Change",
        desc: "Building comfort with uncertainty and rapid pivots.",
      },
    ],
    roles: [
      {
        title: "HR & People Partner",
        desc: "Supporting employee wellbeing and team culture.",
      },
      {
        title: "Customer Care",
        desc: "Building long-term client relationships through trust and consistency.",
      },
    ],
    toolkit: [
      {
        title: "Steady Pacing",
        desc: "Check in with teammates privately to surface issues before they escalate.",
      },
      {
        title: "Process Documentation",
        desc: "Build reliable systems that others can follow consistently.",
      },
    ],
    withOthers: [
      {
        label: "Dominance (D)",
        withType: "Dominance",
        tip: "Prepare a concise recommendation and invite their decision—they respect clarity and brevity.",
      },
      {
        label: "Influence (I)",
        withType: "Influence",
        tip: "Affirm their ideas warmly, then help steer to one shared plan with clear next steps.",
      },
      {
        label: "Steadiness (S)",
        withType: "Steadiness",
        tip: "Check workload quietly and offer to swap tasks if someone is overwhelmed.",
      },
      {
        label: "Conscientiousness (C)",
        withType: "Conscientiousness",
        tip: "Share timelines and quality expectations upfront so there are no surprises.",
      },
    ],
  },
  C: {
    archetype: "The Quality Guardian",
    understanding:
      "You are the person who catches what everyone else misses. You prioritise accuracy, structure, and sound reasoning in everything you do. Your ability to think systematically and identify risks before they become problems makes you invaluable in any technical or analytical role. You thrive when given space to work independently with clear standards.",
    patternNote:
      "As a C-style, your greatest strength is your commitment to getting it right. You bring rigour and precision that elevates the quality of everything your team produces. Your growth challenge is time-boxing your analysis to avoid perfectionism paralysis. Learning to communicate your findings as stories—not just data—will help your insights land with decision-makers.",
    superpowers: [
      {
        title: "Spotting Flaws Early",
        desc: "You catch issues before they become incidents, saving time, money, and reputation.",
      },
      {
        title: "Systematic Thinking",
        desc: "You build processes and frameworks that stand up to scrutiny and scale.",
      },
      {
        title: "Research Depth",
        desc: "You go further than anyone else to ensure the analysis is thorough and defensible.",
      },
    ],
    growth: [
      {
        title: "Time-Boxing",
        desc: "Setting a hard stop on analysis to prevent perfectionism from blocking progress.",
      },
      {
        title: "Communicating Uncertainty",
        desc: "Sharing findings even when the picture isn't fully complete.",
      },
    ],
    roles: [
      {
        title: "Engineering & Architecture",
        desc: "Designing systems that are robust, scalable, and well-documented.",
      },
      {
        title: "QA & Compliance",
        desc: "Ensuring standards are met and risks are identified proactively.",
      },
    ],
    toolkit: [
      {
        title: "Data-Driven Arguments",
        desc: "Always bring evidence. Quantify the risk and the recommended action.",
      },
      {
        title: "Written Clarity",
        desc: "Document decisions and rationale so the team can reference and learn.",
      },
    ],
    withOthers: [
      {
        label: "Dominance (D)",
        withType: "Dominance",
        tip: "Offer a clear binary choice with your risk view attached—they want the conclusion, not the full analysis.",
      },
      {
        label: "Influence (I)",
        withType: "Influence",
        tip: "Capture their creative vision in measurable requirements so it can actually be built.",
      },
      {
        label: "Steadiness (S)",
        withType: "Steadiness",
        tip: "Give predictable rhythms and avoid surprise rework—they plan carefully and need stability.",
      },
      {
        label: "Conscientiousness (C)",
        withType: "Conscientiousness",
        tip: "Agree on sources of truth and version control early to avoid duplicate or conflicting work.",
      },
    ],
  },
};

function scoreToPercent(score: number, total: number): number {
  if (!total) return 0;
  return Math.round((score / total) * 100);
}

function DiscDonut({
  score,
  totalAnswers,
  color,
  label,
}: {
  score: number;
  totalAnswers: number;
  color: string;
  label: string;
}) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, (score / (totalAnswers || 15)) * 100));
  const dash = (pct / 100) * c;
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-[66px] w-[66px]">
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
            className="stroke-[#f4f0eb]"
            strokeWidth={8}
          />
          <circle
            cx={50}
            cy={50}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[18px] font-extrabold tabular-nums" style={{ color }}>
            {score}
          </span>
        </div>
      </div>
      <span className="text-[10px] font-extrabold uppercase tracking-[0.08em]" style={{ color }}>
        {label}
      </span>
    </div>
  );
}

function MemberHeaderBanner({
  displayName,
  patternName,
  primaryType,
}: {
  displayName: string;
  patternName: string;
  primaryType: DiscLetter;
}) {
  const initial = displayName.trim().charAt(0).toUpperCase() || "?";
  return (
    <div className="rounded-[10px] bg-gradient-to-r from-[#b77bd2] via-[#cfabe0] to-[#eee5ef] px-5 py-5">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-white bg-[#e77252] text-[18px] font-extrabold text-white shadow-sm">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[18px] font-extrabold text-[#2f2638]">
            {displayName}
          </p>
          <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1.5 text-[12px] font-semibold tracking-[0.05em] text-white shadow-sm backdrop-blur-md">
            <span className="text-[12px] leading-none">✦</span>
            {DISC_STYLE[primaryType].label}
          </span>
        </div>
      </div>
    </div>
  );
}

function DiscProfileReport({
  result,
  displayName,
  emailHint,
  onRetake,
  showRetake = true,
  profileCopy,
}: {
  result: DiscProfileResult;
  displayName: string;
  emailHint: string;
  onRetake: () => void;
  showRetake?: boolean;
  profileCopy?: (typeof PROFILE_COPY_DEFAULTS)[DiscLetter];
}) {
  const copy = profileCopy ?? PROFILE_COPY_DEFAULTS[result.primary];
  const completed = new Date(result.completedAt);
  const dateStr = completed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const chartData = DISC_ORDER.map((L) => ({
    axis: L,
    score: result.scores[L],
  }));
  const percentFor = (letter: DiscLetter) =>
    result.percentages?.[letter] ??
    scoreToPercent(result.scores[letter], result.totalAnswers);
  const percentLabel = (value: number) =>
    Number.isInteger(value)
      ? `${value}%`
      : `${value.toFixed(2).replace(/\.?0+$/, "")}%`;
  const [expandedAccordion, setExpandedAccordion] = useState<string[]>([]);
  const toggleAll = () =>
    setExpandedAccordion((current) =>
      current.length === 3 ? [] : ["p1", "p2", "p3"]
    );

  const card =
    "overflow-hidden rounded-[14px] border border-[#ddd8d1] bg-white shadow-none";
  const scoreTileStyle: Record<
    DiscLetter,
    { bg: string; border: string; primaryBorder: string; text: string; bar: string }
  > = {
    D: {
      bg: "bg-[#fde8e8]",
      border: "border-transparent",
      primaryBorder: "border-[#f16b6b]",
      text: "text-[#e85f5f]",
      bar: "bg-[#e85f5f]",
    },
    I: {
      bg: "bg-[#fff5dc]",
      border: "border-transparent",
      primaryBorder: "border-[#f2bd57]",
      text: "text-[#d99205]",
      bar: "bg-[#e6c98e]",
    },
    S: {
      bg: "bg-[#e7f5ef]",
      border: "border-transparent",
      primaryBorder: "border-[#76bfae]",
      text: "text-[#218b73]",
      bar: "bg-[#b8d8cf]",
    },
    C: {
      bg: "bg-[#e6f0fb]",
      border: "border-transparent",
      primaryBorder: "border-[#6aa0d6]",
      text: "text-[#1f78b8]",
      bar: "bg-[#b7cde4]",
    },
  };

  return (
    <motion.div
      {...fadeUpMotion}
      className="w-full space-y-3"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="rounded-[14px] border border-[#ddd8d1] bg-white p-4 sm:p-5">
        {showRetake && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={onRetake}
              className="inline-flex h-9 items-center gap-2 rounded-[6px] border border-[#ef6f4f] bg-white px-4 text-[12px] font-semibold text-[#111827] transition-colors hover:bg-[#fff7f4]"
            >
              <Brain className="h-3.5 w-3.5" />
              Retake Assessment
            </button>
          </div>
        )}

        <MemberHeaderBanner
          displayName={displayName}
          patternName={result.patternName}
          primaryType={result.primary}
        />

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#9a958f]">
              DISC Profile
            </p>
            <p className="mt-1 text-[12px] font-semibold text-[#111827]">
              {result.totalAnswers}/{result.totalAnswers} —{" "}
              {DISC_STYLE[result.primary].label}
            </p>
          </div>
          <div className="flex flex-col gap-1 text-[11px] font-medium text-[#9a958f] sm:items-end">
            <div className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              {emailHint}
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Assessed {dateStr}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {DISC_ORDER.map((L) => {
            const s = scoreTileStyle[L];
            const sc = result.scores[L];
            const isPrimary = L === result.primary;
            const isSecondary =
              L === result.secondary && result.primary !== result.secondary;
            return (
              <div
                key={L}
                className={cn(
                  "relative rounded-[9px] border p-4",
                  s.bg,
                  isPrimary ? s.primaryBorder : s.border
                )}
              >
                {isPrimary && (
                  <div className="absolute -top-[8px] left-1/2 -translate-x-1/2 rounded-full bg-white px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wide text-[#ef6f4f] shadow-sm">
                    Primary
                  </div>
                )}
                {isSecondary && (
                  <div className="absolute -top-[8px] left-1/2 -translate-x-1/2 rounded-full bg-white px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wide text-[#c98905] shadow-sm">
                    Secondary
                  </div>
                )}
                <p className={cn("text-[10px] font-extrabold uppercase tracking-[0.12em]", s.text)}>
                  {DISC_STYLE[L].label}
                </p>
                <p className={cn("mt-1 text-[28px] font-extrabold leading-none", s.text)}>
                  {sc}
                </p>
                <div className="mt-2 space-y-1.5">
                  <div className="h-0.5 w-full overflow-hidden rounded-full bg-black/10">
                    <div
                      className={cn("h-full rounded-full", s.bar)}
                      style={{ width: `${percentFor(L)}%` }}
                    />
                  </div>
                  <p className={cn("text-[10px] font-medium", s.text)}>
                    {percentLabel(percentFor(L))}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Understanding Your Personality */}
      <div className={card}>
        <div className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-[#fff0eb] text-[#ef6f4f]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-[15px] font-extrabold text-[#2f2d2b]">
                {DISC_STYLE[result.primary].label} — {copy.archetype}
              </h3>
              <p className={cn("mt-0.5 text-[12px] font-semibold", DISC_STYLE[result.primary].text)}>
                Understanding Your Personality Type
              </p>
            </div>
          </div>
          <p className="mt-4 text-[13px] leading-[1.8] text-[#5f5a55]">
            {copy.understanding}
          </p>
        </div>
      </div>

      {/* 3. Score Distribution */}
      <div className={card}>
        <div className="p-5 pb-2">
          <div>
            <h3 className="text-[15px] font-extrabold text-[#2f2d2b]">
              <span className="mr-2">📊</span>
              DISC Score Distribution
            </h3>
            <p className="mt-1 text-[11px] font-medium text-[#a29d97]">
              Your DISC assessment scores (out of {result.totalAnswers || 15})
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-5 px-4 py-4 sm:grid-cols-4 sm:gap-x-10 sm:px-7">
          {DISC_ORDER.map((L) => (
            <DiscDonut
              key={L}
              score={result.scores[L]}
              totalAnswers={result.totalAnswers}
              color={DISC_STYLE[L].chart}
              label={DISC_STYLE[L].label}
            />
          ))}
        </div>
        <p className="text-center text-[11px] font-medium text-[#aaa49d]">
          Your DISC Profile Visualisation
        </p>
        <div className="px-4 pb-5 pt-2 sm:px-7">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 16, left: -18, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="2 3"
                  stroke="#eee8e1"
                />
                <XAxis
                  dataKey="axis"
                  tick={{ fontSize: 11, fill: "#9a958f" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, result.totalAnswers || 15]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#9a958f" }}
                />
                <Tooltip
                  formatter={(v: number) => [`${v}`, "Score"]}
                  labelFormatter={(l) =>
                    `${l} — ${DISC_STYLE[l as DiscLetter]?.label ?? l}`
                  }
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #f0ebe8",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                />
                <Line
                  type="linear"
                  dataKey="score"
                  stroke="#DA7756"
                  strokeWidth={2.25}
                  dot={{ r: 5, fill: "#DA7756", strokeWidth: 0 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 rounded-[8px] border border-[#efd6a5] bg-[#fff9f1] px-4 py-4">
            <p className="text-[13px] leading-relaxed text-[#5f5a55]">
              {copy.patternNote}
            </p>
          </div>
        </div>
      </div>

      {/* 5. Action Plan */}
      <div className={card}>
        <div className="flex items-center justify-between gap-3 px-5 pt-5">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-[15px] font-extrabold text-[#2f2d2b]">
                <span className="mr-2">📋</span>
                Your Personalised Action Plan
              </h3>
              <p className="mt-1 text-[11px] font-medium text-[#a29d97]">
                One Sentence Action
              </p>
            </div>
          </div>
          <button
            onClick={toggleAll}
            className="text-[11px] font-semibold text-[#e77252] transition-colors hover:text-[#c95f44]"
          >
            {expandedAccordion.length === 3 ? "Collapse All" : "Expand All"}
          </button>
        </div>
        <div className="p-5">
          <Accordion
            type="multiple"
            className="space-y-2"
            value={expandedAccordion}
            onValueChange={setExpandedAccordion}
          >
            {[
              {
                id: "p1",
                title: "Part 1: Your Superpowers (Top Strengths)",
                number: 1,
                items: copy.superpowers,
              },
              {
                id: "p2",
                title: "Part 2: Growth Edges",
                number: 2,
                items: copy.growth,
              },
              {
                id: "p3",
                title: "Part 3: Personal Commitment",
                number: 3,
                items: [
                  {
                    title: "Your Next Steps",
                    desc:
                      "Choose one specific communication action for this week and review it with a teammate.",
                  },
                ],
              },
            ].map((section) => (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="rounded-[7px] border border-[#ddd8d1] bg-white px-2 shadow-none data-[state=open]:border-[#ddd8d1]"
              >
                <AccordionTrigger className="px-3 py-3 text-left hover:no-underline [&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-[#9a958f]">
                  <span className="flex items-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#fff0eb] text-[11px] font-extrabold text-[#e77252]">
                      {section.number}
                    </span>
                    <span className="text-[13px] font-semibold text-[#2f2d2b]">
                      {section.title}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-4 pt-0">
                  <div className="space-y-2 pl-8">
                    {section.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-[8px] bg-[#faf8f5] p-3"
                      >
                        <h5 className="text-[13px] font-bold text-[#2f2d2b]">
                          {item.title}
                        </h5>
                        <p className="mt-1 text-[12px] leading-relaxed text-[#6d6862]">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* 7. How You Work With Others */}
      <div className={card}>
        <div className="px-5 pt-5">
          <div>
            <h3 className="text-[15px] font-extrabold text-[#2f2d2b]">
              <span className="mr-2">🤝</span>
              How You Work With Others
            </h3>
            <p className="mt-1 text-[11px] font-medium text-[#a29d97]">
              Tips for collaborating across DISC styles
            </p>
          </div>
        </div>
        <div className="p-5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-[13px]">
              <thead>
                <tr className="rounded-[6px] bg-[#f7f4ef]">
                  <th className="w-[260px] rounded-l-[6px] px-4 py-3 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#9a958f]">
                    When working with...
                  </th>
                  <th className="rounded-r-[6px] px-4 py-3 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#9a958f]">
                    Tips for the {result.primary}-Style
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ece8e2]">
                {copy.withOthers.map((row) => {
                  const sType = row.withType.charAt(0) as DiscLetter;
                  const circleBg: Record<DiscLetter, string> = {
                    D: "#ee8f94",
                    I: "#f5c879",
                    S: "#9bd1c3",
                    C: "#6aa0d6",
                  };
                  return (
                    <tr
                      key={row.withType}
                      className="bg-white"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3 font-semibold text-[#2f2d2b]">
                          <span
                            className="relative h-7 w-7 shrink-0 rounded-full text-white"
                            style={{ backgroundColor: circleBg[sType] }}
                          >
                            <span className="absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-[45%] text-[13px] font-extrabold leading-none">
                              {sType}
                            </span>
                          </span>
                          <span className="text-[13px]">{row.label}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[13px] leading-relaxed text-[#5f5a55]">
                        {row.tip}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TeamMemberCard({ member }: { member: any }) {
  const primaryType = (member.primary_type || "D") as DiscLetter;
  const secondaryType = member.secondary_type as DiscLetter | undefined;
  const avatarLetter = member.name?.[0]?.toUpperCase() || "?";
  const bannerColors: Record<DiscLetter, string> = {
    D: "#e58d91",
    I: "#efc985",
    S: "#9fcabb",
    C: "#6e9fd0",
  };
  const badgeColors: Record<DiscLetter, { bg: string; text: string }> = {
    D: { bg: "#ffe3e5", text: "#d94d55" },
    I: { bg: "#fff1d4", text: "#c88705" },
    S: { bg: "#e0f2eb", text: "#23836d" },
    C: { bg: "#dfefff", text: "#2f74ad" },
  };
  const profileName = member.profile_name || "Specialist";
  const typeBadge = (type: DiscLetter, label: string) => (
    <span
      className="inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-extrabold"
      style={{
        backgroundColor: badgeColors[type].bg,
        color: badgeColors[type].text,
      }}
    >
      <span
        className="flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-black text-white"
        style={{ backgroundColor: bannerColors[type] }}
      >
        {type}
      </span>
      {label}
    </span>
  );

  return (
    <motion.div
      {...fadeUpMotion}
      whileHover={{ y: -3, boxShadow: "0 10px 24px rgba(15, 23, 42, 0.10)" }}
      className="flex flex-col overflow-hidden rounded-[12px] border border-[#ded8cf] bg-white shadow-sm transition-all hover:shadow-md"
    >
      <style>
        {`
          .disc-team-score-text,
          .disc-team-score-text * {
            color: #ffffff !important;
            -webkit-text-fill-color: #ffffff !important;
          }
          .disc-team-score-label {
            color: rgba(255, 255, 255, 0.82) !important;
            -webkit-text-fill-color: rgba(255, 255, 255, 0.82) !important;
          }
        `}
      </style>
      <div
        className="px-5 py-4 text-white"
        style={{ backgroundColor: bannerColors[primaryType] }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/25 text-[16px] font-extrabold text-white">
              {avatarLetter}
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-[14px] font-extrabold leading-tight text-white">
                {member.name}
              </h3>
              <p className="mt-1 truncate text-[11px] font-medium text-white/85">
                {member.department || "Team"}
              </p>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p className="disc-team-score-label text-[9px] font-bold uppercase tracking-[0.11em]">
              DISC Score
            </p>
            <p className="disc-team-score-text mt-0.5 text-[21px] font-extrabold leading-none tracking-tight">
              {member.score_string || "0000"}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 px-5 py-4">
        <div className="flex flex-wrap items-center gap-2">
          {typeBadge(primaryType, "Primary")}
          {secondaryType && typeBadge(secondaryType, "Secondary")}
          <span className="inline-flex h-6 items-center rounded-full bg-[#f3f0ec] px-3 text-[11px] font-semibold text-[#6c6660]">
            {profileName}
          </span>
        </div>
        <button
          type="button"
          onClick={() =>
            member.onViewReport?.(
              member.attempt_id || member.encrypted_attempt_id,
              member.name
            )
          }
          className="mt-auto flex h-10 w-full items-center justify-center gap-2 rounded-[7px] border border-[#ddd6ce] bg-white text-[12px] font-bold text-[#2f2d2b] transition-colors hover:bg-[#faf8f5]"
        >
          <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.2} />
          View Full Profile
        </button>
      </div>
    </motion.div>
  );
}

function TeamProfilesTabContent({
  members,
  loading,
  onViewReport,
}: {
  members: any[];
  loading: boolean;
  onViewReport: (id: any, name: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [discFilter, setDiscFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        m.name?.toLowerCase().includes(q) ||
        m.department?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q);
      const matchDisc = discFilter === "all" || m.primary_type === discFilter;
      const matchDept = deptFilter === "all" || m.department === deptFilter;
      return matchSearch && matchDisc && matchDept;
    });
  }, [search, discFilter, deptFilter, members]);

  const departments = useMemo(() => {
    const depts = new Set<string>();
    members.forEach((m) => {
      if (m.department) depts.add(m.department);
    });
    return Array.from(depts).sort();
  }, [members]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-[#DA7756]" />
        <p className="mt-4 text-sm font-medium text-neutral-600">
          Loading team profiles...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-[240px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a5a29f]" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search team members"
            className="h-10 w-full rounded-full border border-[#e5e8ee] bg-white pl-9 pr-3 text-[13px] font-medium text-[#2f2d2b] placeholder:text-[#aaa6a2] focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.18)]"
          />
        </div>
        <Select value={discFilter} onValueChange={setDiscFilter}>
          <SelectTrigger className="h-10 w-full rounded-full border-[#e5e8ee] bg-white px-4 text-[13px] font-medium text-[#2f2d2b] shadow-none sm:w-[104px]">
            <SelectValue placeholder="All type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All type</SelectItem>
            <SelectItem value="D">D</SelectItem>
            <SelectItem value="I">I</SelectItem>
            <SelectItem value="S">S</SelectItem>
            <SelectItem value="C">C</SelectItem>
          </SelectContent>
        </Select>
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger className="h-10 w-full rounded-full border-[#e5e8ee] bg-white px-4 text-[13px] font-medium text-[#2f2d2b] shadow-none sm:w-[142px]">
            <SelectValue placeholder="All department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All department</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {filtered.length === 0 ? (
        <div className="rounded-[12px] border border-[#ded8cf] bg-white py-16 text-center shadow-sm">
          <Users className="mx-auto h-10 w-10 text-neutral-300" />
          <p className="mt-3 text-sm text-neutral-500">
            No team members match your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((member, idx) => (
            <TeamMemberCard
              key={member.attempt_id || idx}
              member={{ ...member, onViewReport }}
            />
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
  isSubmitting = false,
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
  const answered = selectedAnswer !== null;
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  return (
    <motion.div
      key={currentQuestion}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className="w-full space-y-3"
    >
      <div>
        <p className="mb-2 text-[12px] font-semibold text-[#252525]">
          {currentQuestion + 1} of {totalQuestions} questions
        </p>
        <div className="grid w-full gap-1.5" style={{ gridTemplateColumns: `repeat(${totalQuestions}, minmax(0, 1fr))` }}>
          {Array.from({ length: totalQuestions }).map((_, idx) => (
            <span
              key={idx}
              className={cn(
                "h-1.5 rounded-full transition-colors duration-300",
                idx <= currentQuestion ? "bg-[#e87355]" : "bg-[#e5e5e5]"
              )}
            />
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="rounded-[16px] border border-[#e4e4e4] bg-white px-5 pb-5 pt-6"
      >
        <h2 className="text-[14px] font-extrabold text-[#111827]">
          {question.text}
        </h2>
        <div className="my-6 h-px w-full bg-[#eeeeee]" />
        <div className="space-y-4">
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              type="button"
              onClick={() => onAnswerSelect(index)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.04 }}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.99 }}
              className="flex h-12 w-full items-center gap-3 rounded-[12px] bg-[#f4f1ec] px-4 text-left transition-colors hover:bg-[#eeeae4]"
            >
              <span
                className={cn(
                  "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  selectedAnswer === index
                    ? "border-[#e87355]"
                    : "border-[#9b9b9b] bg-transparent"
                )}
              >
                {selectedAnswer === index && (
                  <span className="h-2 w-2 rounded-full bg-[#e87355]" />
                )}
              </span>
              <span className="text-[13px] font-extrabold text-[#111827]">
                {option.label}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="flex justify-between gap-3">
        <button
          type="button"
          onClick={onPrevious}
          disabled={currentQuestion === 0}
          className={cn(
            "h-10 rounded-[8px] px-5 text-[13px] font-semibold transition-colors",
            currentQuestion === 0
              ? "cursor-not-allowed border border-[#e8e8e8] bg-white text-[#c9c9c9]"
              : "border border-[#e87355] bg-white text-[#e87355] hover:bg-[#fff7f4]"
          )}
        >
          Previous
        </button>
        {isLastQuestion ? (
          <button
            type="button"
            onClick={onFinish}
            disabled={!answered || isSubmitting}
            className={cn(
              "flex h-10 items-center gap-2 rounded-[8px] px-5 text-[13px] font-semibold text-white transition-colors",
              !answered || isSubmitting
                ? "cursor-not-allowed bg-[#d1d1d1]"
                : "bg-[#e87355] shadow-sm hover:bg-[#d96648]"
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : (
              "Finish Assessment"
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            disabled={!answered}
            className={cn(
              "h-10 rounded-[8px] px-5 text-[13px] font-semibold text-white transition-colors",
              !answered
                ? "cursor-not-allowed bg-[#d1d1d1]"
                : "bg-[#e87355] shadow-sm hover:bg-[#d96648]"
            )}
          >
            Next
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const DiscPersonalityAssessment = () => {
  const [mainTab, setMainTab] = useState("report");
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [savedProfile, setSavedProfile] = useState<DiscProfileResult | null>(
    null
  );
  const [selectedMemberReport, setSelectedMemberReport] =
    useState<DiscProfileResult | null>(null);
  const [selectedMemberName, setSelectedMemberName] =
    useState<string>("Team Member");
  const [selectedMemberEmail, setSelectedMemberEmail] = useState<string>("");
  const [loadingReport, setLoadingReport] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questions, setQuestions] = useState<ApiQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [teamProfiles, setTeamProfiles] = useState<any[]>([]);

  // ── Read logged-in user from localStorage ──
  const currentUser = useMemo(() => {
    try {
      const raw =
        localStorage.getItem("current_user") ||
        localStorage.getItem("user") ||
        localStorage.getItem("userData") ||
        localStorage.getItem("userInfo") ||
        null;
      if (raw) {
        const parsed = JSON.parse(raw);
        const fullName =
          parsed.full_name ||
          parsed.fullName ||
          [
            parsed.first_name || parsed.firstname,
            parsed.last_name || parsed.lastname,
          ]
            .filter(Boolean)
            .join(" ") ||
          parsed.name ||
          "";
        const email = parsed.email || "";
        return { name: fullName, email };
      }
    } catch {
      /* ignore */
    }
    const name =
      localStorage.getItem("user_full_name") ||
      localStorage.getItem("full_name") ||
      localStorage.getItem("user_name") ||
      localStorage.getItem("emp_name") ||
      localStorage.getItem("employee_name") ||
      localStorage.getItem("name") ||
      "";
    const email =
      localStorage.getItem("user_email") ||
      localStorage.getItem("emp_email") ||
      localStorage.getItem("email") ||
      "";
    return { name, email };
  }, []);

  useEffect(() => {
    const fetchAssessmentData = async () => {
      try {
        setLoadingQuestions(true);
        const token = getToken();
        const rawBase = getBaseUrl() || "https://fm-uat-api.lockated.com";
        const baseUrl = rawBase.replace(/\/$/, "");
        const headers: HeadersInit = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const [qRes, rRes, tRes] = await Promise.all([
          fetch(`${baseUrl}/disc_assessments/questions`, { headers }).catch(
            () => null
          ),
          fetch(`${baseUrl}/disc_assessments/my_report`, { headers }).catch(
            () => null
          ),
          fetch(`${baseUrl}/disc_assessments/team_profiles`, { headers }).catch(
            () => null
          ),
        ]);

        if (qRes && qRes.ok) {
          const qData = await qRes.json();
          const qs: ApiQuestion[] =
            qData?.data?.questions ?? qData?.questions ?? [];
          if (qs.length > 0) setQuestions(qs);
        }

        if (rRes && rRes.ok) {
          const rData = await rRes.json();
          if (rData.success && rData.data?.report) {
            const report = rData.data.report;
            const totalAnswers = report.total_answers || 15;
            const rawCounts = {
              D: report.scores?.D || 0,
              I: report.scores?.I || 0,
              S: report.scores?.S || 0,
              C: report.scores?.C || 0,
            };
            const percentages = {
              D: report.percentages?.D || 0,
              I: report.percentages?.I || 0,
              S: report.percentages?.S || 0,
              C: report.percentages?.C || 0,
            };

            const apiName =
              report.user_name ||
              report.name ||
              rData.data?.user?.name ||
              rData.data?.user?.full_name ||
              "";
            const apiEmail =
              report.user_email ||
              report.email ||
              rData.data?.user?.email ||
              "";
            if (apiName && !localStorage.getItem("user_full_name"))
              localStorage.setItem("user_full_name", apiName);
            if (apiEmail && !localStorage.getItem("user_email"))
              localStorage.setItem("user_email", apiEmail);

            const primaryType = report.primary_type as DiscLetter;
            const secondaryType = (report.secondary_type ||
              report.primary_type) as DiscLetter;

            setSavedProfile({
              counts: rawCounts,
              scores: rawCounts,
              percentages,
              totalAnswers: totalAnswers,
              primary: primaryType,
              secondary: secondaryType,
              patternName:
                report.profile_name ||
                patternNameFor(primaryType, secondaryType),
              blendLabel:
                report.style_code || `${primaryType} + ${secondaryType}`,
              completedAt:
                report.generated_at ||
                report.submitted_at ||
                new Date().toISOString(),
              attemptId: report.attempt_id || report.id || undefined,
              encryptedAttemptId:
                report.encrypted_attempt_id ||
                rData.data?.encrypted_attempt_id ||
                undefined,
            });
          }
        }

        if (tRes && tRes.ok) {
          const tData = await tRes.json();
          if (tData.success && tData.data?.profiles)
            setTeamProfiles(tData.data.profiles);
        }
      } catch (error) {
        console.error("Error fetching assessment data:", error);
      } finally {
        setLoadingQuestions(false);
      }
    };
    fetchAssessmentData();
  }, []);

  const fetchMemberReport = async (
    attemptId: number | string,
    memberName?: string
  ) => {
    try {
      setLoadingReport(true);
      const member = teamProfiles.find(
        (m) =>
          String(m.attempt_id) === String(attemptId) ||
          String(m.encrypted_attempt_id) === String(attemptId)
      );
      setSelectedMemberName(memberName || member?.name || "Team Member");
      setSelectedMemberEmail(member?.email || "");

      const token = getToken();
      const baseUrl = (
        getBaseUrl() || "https://fm-uat-api.lockated.com"
      ).replace(/\/$/, "");
      const response = await fetch(
        `${baseUrl}/disc_assessments/${attemptId}/report`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const data = await response.json();
      if (data.success && data.data?.report) {
        const report = data.data.report;
        const totalAnswers = report.total_answers || 15;
        const rawCounts = {
          D: report.scores?.D || 0,
          I: report.scores?.I || 0,
          S: report.scores?.S || 0,
          C: report.scores?.C || 0,
        };
        const percentages = {
          D: report.percentages?.D || 0,
          I: report.percentages?.I || 0,
          S: report.percentages?.S || 0,
          C: report.percentages?.C || 0,
        };
        const primaryType = report.primary_type as DiscLetter;
        const secondaryType = (report.secondary_type ||
          report.primary_type) as DiscLetter;
        setSelectedMemberReport({
          counts: rawCounts,
          scores: rawCounts,
          percentages,
          totalAnswers: totalAnswers,
          primary: primaryType,
          secondary: secondaryType,
          patternName:
            report.profile_name || patternNameFor(primaryType, secondaryType),
          blendLabel: report.style_code || `${primaryType} + ${secondaryType}`,
          completedAt:
            report.generated_at ||
            report.submitted_at ||
            new Date().toISOString(),
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
    if (currentQuestion < questions.length - 1)
      setCurrentQuestion(currentQuestion + 1);
  };
  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const handleFinish = async () => {
    const allAnswered = questions.every(
      (_, i) => answers[i] !== undefined && answers[i] !== null
    );
    if (!allAnswered || isSubmitting) return;
    try {
      setIsSubmitting(true);
      const token = getToken();
      const baseUrl = (
        getBaseUrl() || "https://fm-uat-api.lockated.com"
      ).replace(/\/$/, "");

      const formattedAnswers = answers.map((answerIndex, qIndex) => {
        const selectedOption = questions[qIndex].options[answerIndex];
        return {
          question_id: questions[qIndex].id,
          dimension: selectedOption.dimension,
          answers: selectedOption.label,
        };
      });
      const url = `${baseUrl}/disc_assessments/submit`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          answers: formattedAnswers,
        }),
      });

      const data = await response.json();
      let result: DiscProfileResult;

      if (data.success && data.data?.report) {
        const report = data.data.report;
        const totalAnswers = report.total_answers || questions.length;
        const rawCounts = {
          D: report.scores?.D || 0,
          I: report.scores?.I || 0,
          S: report.scores?.S || 0,
          C: report.scores?.C || 0,
        };
        const percentages = {
          D: report.percentages?.D || 0,
          I: report.percentages?.I || 0,
          S: report.percentages?.S || 0,
          C: report.percentages?.C || 0,
        };
        const primaryType = report.primary_type as DiscLetter;
        const secondaryType = (report.secondary_type ||
          report.primary_type) as DiscLetter;
        result = {
          counts: rawCounts,
          scores: rawCounts,
          percentages,
          totalAnswers: totalAnswers,
          primary: primaryType,
          secondary: secondaryType,
          patternName:
            report.profile_name || patternNameFor(primaryType, secondaryType),
          blendLabel: report.style_code || `${primaryType} + ${secondaryType}`,
          completedAt:
            report.generated_at ||
            report.submitted_at ||
            new Date().toISOString(),
          attemptId:
            report.attempt_id || data.data?.attempt_id || report.id || undefined,
          encryptedAttemptId:
            data.data?.encrypted_attempt_id ||
            report.encrypted_attempt_id ||
            undefined,
        };
      } else {
        result = computeDiscResult(answers, questions);
      }

      setSavedProfile(result);
      setAssessmentStarted(false);
      setMainTab("profile");
    } catch (err) {
      console.error("Submit error:", err);
      const result = computeDiscResult(answers, questions);
      setSavedProfile(result);
      setAssessmentStarted(false);
      setMainTab("profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-[calc(100vh-5rem)] w-full bg-white px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="w-full space-y-7">
        {/* Page Header */}
        <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="grid h-10 w-10 shrink-0 grid-cols-2 gap-0.5">
              {[
                { letter: "D", bg: "bg-[#f27655]" },
                { letter: "I", bg: "bg-[#f7c86f]" },
                { letter: "S", bg: "bg-[#56a8d6]" },
                { letter: "C", bg: "bg-[#94d4ce]" },
              ].map((item) => (
                <span
                  key={item.letter}
                  className={cn(
                    "flex items-center justify-center rounded-[4px] text-[9px] font-extrabold leading-none text-white",
                    item.bg
                  )}
                >
                  {item.letter}
                </span>
              ))}
            </div>
            <div>
              <h1 className="text-[20px] font-extrabold leading-tight tracking-tight text-[#111827] sm:text-[24px]">
                DISC Personality Assessment
              </h1>
              <p className="mt-1 text-[13px] font-medium text-[#64748b]">
                Discover your DISC profile and understand your team.
              </p>
            </div>
          </div>
        </header>

        <Tabs
          value={mainTab}
          onValueChange={(v) => {
            setMainTab(v);
            if (v !== "report") setAssessmentStarted(false);
          }}
          className="w-full"
        >
          <TabsList className="flex h-9 w-full max-w-full items-center justify-between gap-0.5 rounded-full border border-[#edf0f4] bg-white p-0.5 shadow-[0_6px_16px_rgba(15,23,42,0.06)] sm:inline-flex sm:h-11 sm:w-auto sm:justify-start sm:gap-1 sm:p-1">
            {[
              { value: "report", icon: Gauge, label: "Assessment" },
              { value: "profile", icon: UserRound, label: "Your report" },
              { value: "team", icon: UsersRound, label: "Team" },
            ].map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className={cn(
                  "inline-flex h-8 flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-full px-1.5 text-[10px] font-semibold text-[#111827] transition-all sm:h-9 sm:flex-none sm:gap-2 sm:px-4 sm:text-[13px]",
                  "data-[state=active]:bg-[#e77252] data-[state=active]:text-white data-[state=active]:shadow-sm",
                  "data-[state=inactive]:hover:bg-[#fff7f4]"
                )}
              >
                <t.icon className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ── Get Your Report Tab ── */}
          <TabsContent
            value="report"
            className="mt-7 space-y-4 focus-visible:outline-none"
          >
            {assessmentStarted ? (
              <div className="space-y-5">
                <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                  <p className="text-[12px] font-medium text-[#6d6d6d]">
                    Answer all questions to discover your profile
                  </p>
                  <button
                    type="button"
                    onClick={() => setAssessmentStarted(false)}
                    className="h-9 rounded-[8px] border border-[#e87355] bg-white px-5 text-[13px] font-semibold text-[#2f2d2b] transition-colors hover:bg-[#fff7f4]"
                  >
                    Exit
                  </button>
                </div>
                {/* ── FULL WIDTH — no max-w wrapper ── */}
                <div className="w-full">
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
                </div>
              </div>
            ) : (
              <>
                {/* ── What is DISC accordion — warm brand colors ── */}
                <Accordion type="single" collapsible defaultValue="what-is">
                  <AccordionItem
                    value="what-is"
                    className="overflow-hidden rounded-[18px] border border-[#e5e8ee] bg-white shadow-none"
                  >
                    <AccordionTrigger className="border-b border-[#edf0f4] px-5 py-5 text-left hover:no-underline [&>svg]:h-6 [&>svg]:w-6 [&>svg]:rounded-full [&>svg]:border [&>svg]:border-[#e5e8ee] [&>svg]:p-1 [&>svg]:text-[#f06f4f]">
                      <span className="flex items-center gap-3">
                        <span className="grid h-5 w-5 shrink-0 grid-cols-2 gap-0.5">
                          {[
                            ["D", "bg-[#f27655]"],
                            ["I", "bg-[#f7c86f]"],
                            ["S", "bg-[#56a8d6]"],
                            ["C", "bg-[#94d4ce]"],
                          ].map(([letter, bg]) => (
                            <span
                              key={letter}
                              className={cn(
                                "flex items-center justify-center rounded-[2px] text-[5px] font-extrabold text-white",
                                bg
                              )}
                            >
                              {letter}
                            </span>
                          ))}
                        </span>
                        <span className="text-[13px] font-extrabold text-[#111827]">
                          What is DISC & how will it benefit you?
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-6 pt-4">
                      <p className="rounded-[14px] bg-[#eef6ff] px-4 py-5 text-[14px] font-medium leading-relaxed text-[#111827]">
                        DISC is a behavioural assessment tool that measures four
                        dimensions of personality — Dominance, Influence,
                        Steadiness, and Conscientiousness. Taking this
                        assessment will help you understand your natural working
                        style, communication preferences, and how to collaborate
                        more effectively with others.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* ── What you'll discover accordion — warm brand colors ── */}
                <Accordion type="single" collapsible>
                  <AccordionItem
                    value="discover"
                    className="overflow-hidden rounded-[18px] border border-[#e5e8ee] bg-white shadow-none"
                  >
                    <AccordionTrigger className="px-5 py-5 text-left hover:no-underline [&>svg]:h-6 [&>svg]:w-6 [&>svg]:rounded-full [&>svg]:border [&>svg]:border-[#e5e8ee] [&>svg]:p-1 [&>svg]:text-[#f06f4f]">
                      <span className="flex items-center gap-3">
                        <Sparkles className="h-5 w-5 shrink-0 text-[#f97316]" />
                        <span className="text-[13px] font-extrabold text-[#111827]">
                          What you will discover?
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-0">
                      <div className="space-y-2">
                        {[
                          {
                            text: "Your primary and secondary DISC personality types",
                            color: "#e11d48",
                          },
                          {
                            text: "Your key strengths and growth areas",
                            color: "#f59e0b",
                          },
                          {
                            text: "How you communicate and interact with others",
                            color: "#3b82f6",
                          },
                          {
                            text: "Ideal work environments and roles for you",
                            color: "#10b981",
                          },
                          {
                            text: "Your specific DISC profile with personalised recommendations",
                            color: "#DA7756",
                          },
                        ].map((item, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              background: "rgba(218,119,86,0.06)",
                              borderRadius: 10,
                              padding: "12px 14px",
                              borderLeft: `3px solid ${item.color}`,
                            }}
                          >
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                minWidth: 8,
                                borderRadius: "50%",
                                background: item.color,
                                display: "inline-block",
                                flexShrink: 0,
                              }}
                            />
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 500,
                                color: "#374151",
                                lineHeight: 1.4,
                              }}
                            >
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="rounded-[18px] border border-[#e5e8ee] bg-white px-5 pb-3 pt-4 shadow-none">
                  <p className="mb-5 text-[13px] font-extrabold uppercase tracking-[0.28em] text-[#111827]">
                    Ready when you are
                  </p>
                  <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_330px] md:items-center">
                  <div className="rounded-[14px] bg-[#fff6e5] px-4 py-5">
                    <div>
                      <h3 className="text-[14px] font-extrabold text-[#111827]">
                        Complete your DISC assessment
                      </h3>
                      <p className="mt-5 max-w-xl text-[14px] font-medium leading-relaxed text-[#111827]">
                        Answer a few quick questions to understand your work
                        style, communication patterns, and best-fit
                        collaboration approach.
                      </p>
                    </div>
                    <button
                      type="button"
                      className={cn(
                        "mt-3 inline-flex h-10 w-full items-center justify-center rounded-[8px] bg-[#e77252] px-5 text-[13px] font-bold text-white shadow-sm transition-all hover:bg-[#d96648] active:scale-[0.99] sm:w-auto",
                        (loadingQuestions || questions.length === 0) &&
                          "opacity-60 cursor-not-allowed"
                      )}
                      onClick={handleStartAssessment}
                      disabled={loadingQuestions || questions.length === 0}
                    >
                      {loadingQuestions ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" /> Loading
                          assessment...
                        </span>
                      ) : (
                        "Start Assessment"
                      )}
                    </button>
                  </div>

                  {/* ── Watch: What is DISC? Video — warm brand colors ── */}
                  <div
                    style={{
                      background: "#FFF6E5",
                      borderRadius: 14,
                      overflow: "hidden",
                      border: "0",
                      width: "100%",
                      boxShadow: "none",
                    }}
                  >
                    <div style={{ padding: "8px 12px 5px 12px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                          marginBottom: 2,
                        }}
                      >
                        {/* Proper YouTube pill logo */}
                        <svg
                          viewBox="0 0 90 20"
                          width="52"
                          height="12"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-label="YouTube"
                        >
                          <rect width="90" height="20" rx="4" fill="#FF0000" />
                          <path
                            d="M12 5.5l-4.5 2.5v5l4.5 2.5V5.5z"
                            fill="white"
                          />
                          <rect
                            x="7.5"
                            y="5.5"
                            width="2"
                            height="9"
                            fill="white"
                          />
                          <text
                            x="17"
                            y="14"
                            fill="white"
                            fontSize="9"
                            fontFamily="Arial,Helvetica,sans-serif"
                            fontWeight="bold"
                          >
                            YouTube
                          </text>
                        </svg>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#1f2937",
                            lineHeight: 1.2,
                          }}
                        >
                          Watch: What is DISC?
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: 11,
                          color: "#6b7280",
                          margin: 0,
                          lineHeight: 1.35,
                        }}
                      >
                        A quick overview of the DISC model and how it applies
                        to you
                      </p>
                    </div>
                    <div style={{ padding: "7px 10px 10px 10px" }}>
                      <a
                        href="https://youtu.be/C3T7LNHOaow"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "block",
                          position: "relative",
                          borderRadius: 10,
                          overflow: "hidden",
                          cursor: "pointer",
                          height: 118,
                        }}
                      >
                        <img
                          src="https://img.youtube.com/vi/C3T7LNHOaow/maxresdefault.jpg"
                          alt="What is DISC? — Watch on YouTube"
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "block",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://img.youtube.com/vi/C3T7LNHOaow/hqdefault.jpg";
                          }}
                        />
                        {/* Dark overlay + centred play button */}
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(0,0,0,0.30)",
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                              "rgba(0,0,0,0.45)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background =
                              "rgba(0,0,0,0.30)")
                          }
                        >
                          <svg
                            viewBox="0 0 68 48"
                            width="44"
                            height="31"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-label="Play on YouTube"
                          >
                            <path
                              d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"
                              fill="#FF0000"
                            />
                            <path d="M45 24L27 14v20" fill="white" />
                          </svg>
                        </div>
                        {/* Bottom-right YouTube badge */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: 10,
                            right: 10,
                            background: "rgba(0,0,0,0.80)",
                            borderRadius: 5,
                            padding: "2px 7px",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <svg
                            viewBox="0 0 68 48"
                            width="12"
                            height="9"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"
                              fill="#FF0000"
                            />
                            <path d="M45 24L27 14v20" fill="white" />
                          </svg>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: "#ffffff",
                            }}
                          >
                            Watch on YouTube
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {/* ── Your Profile Tab ── */}
          <TabsContent
            value="profile"
            className="mt-5 focus-visible:outline-none"
          >
            {loadingQuestions ? (
              <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-[rgba(218,119,86,0.18)] bg-[#FFF9F6]">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-10 w-10 animate-spin text-[#DA7756]" />
                  <p className="text-sm font-medium text-neutral-600">
                    Loading your profile...
                  </p>
                </div>
              </div>
            ) : savedProfile ? (
              <DiscProfileReport
                result={savedProfile}
                displayName={currentUser.name || "You"}
                emailHint={currentUser.email || ""}
                onRetake={() => {
                  setAnswers([]);
                  setCurrentQuestion(0);
                  setAssessmentStarted(true);
                  setMainTab("report");
                }}
              />
            ) : (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-[rgba(218,119,86,0.18)] bg-[#FFF9F6] py-16 shadow-sm">
                <Brain
                  className="h-14 w-14 text-[#DA7756]/40"
                  strokeWidth={1.5}
                />
                <h2 className="mt-5 text-xl font-extrabold text-neutral-800">
                  No profile yet
                </h2>
                <p className="mt-2 text-sm text-neutral-500">
                  You haven't completed a DISC assessment yet.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMainTab("report");
                    handleStartAssessment();
                  }}
                  className="mt-8 rounded-2xl bg-[#DA7756] px-8 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#BC6B4A]"
                >
                  Start Assessment
                </button>
              </div>
            )}
          </TabsContent>

          {/* ── Team Profiles Tab ── */}
          <TabsContent value="team" className="mt-5 focus-visible:outline-none">
            {selectedMemberReport ? (
              <div className="space-y-4">
                <div className="flex items-center border-b border-[rgba(218,119,86,0.18)] pb-4">
                  <button
                    onClick={() => setSelectedMemberReport(null)}
                    className="flex items-center gap-2 text-sm font-semibold text-[#CE8261] hover:text-[#BC6B4A] border border-[rgba(218,119,86,0.25)] bg-white rounded-xl px-3 py-2 transition-colors shadow-sm"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back to Team
                  </button>
                </div>
                {loadingReport ? (
                  <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-[rgba(218,119,86,0.18)] bg-[#FFF9F6]">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-10 w-10 animate-spin text-[#DA7756]" />
                      <p className="text-sm font-semibold text-neutral-600">
                        Loading Report...
                      </p>
                    </div>
                  </div>
                ) : (
                  <DiscProfileReport
                    result={selectedMemberReport}
                    displayName={selectedMemberName}
                    emailHint={selectedMemberEmail || "Team Member"}
                    onRetake={() => setSelectedMemberReport(null)}
                    showRetake={false}
                  />
                )}
              </div>
            ) : (
              <TeamProfilesTabContent
                members={teamProfiles}
                loading={loadingQuestions}
                onViewReport={fetchMemberReport}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DiscPersonalityAssessment;
