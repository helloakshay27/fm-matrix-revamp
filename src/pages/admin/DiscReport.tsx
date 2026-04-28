import React, { useMemo, useState, useEffect } from "react";
import {
  BarChart3,
  BookOpen,
  Brain,
  Briefcase,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Diamond,
  Eye,
  FileVideo,
  Filter,
  Layers,
  Search,
  Square,
  TrendingUp,
  User,
  Users,
  UsersRound,
  Star,
  Mail,
  X,
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
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// ─── Design Tokens (matches BusinessPlanAndGoles) ────────────────────────────
const BP = {
  primary: "#DA7756",
  primaryHov: "#c9673f",
  primaryBg: "#fdf9f7",
  primaryTint: "rgba(218,119,86,0.06)",
  primaryBord: "#e8e3de",
  primaryBordStrong: "#d4cdc6",
  pageBg: "#f6f4ee",
  cardBg: "#ffffff",
  tealBg: "#9EC8BA",
  textMain: "#1a1a1a",
  textMuted: "#6b7280",
  borderLgt: "#ebebeb",
  font: "'Poppins', sans-serif",
};

// ─── Types & Interfaces ──────────────────────────────────────────────────────

type DiscTab = "dashboard" | "teams" | "learn";
type DiscLetter = "D" | "I" | "S" | "C";

type DiscTypeDistribution = {
  type: string;
  count: number;
};
type ProfileNameDistribution = {
  profile_name: string;
  count: number;
};
type DiscProfileData = {
  attempt_id: string | number;
  encrypted_attempt_id?: string;
  name: string;
  department?: string;
  primary_type: string;
  secondary_type?: string;
  style_code: string;
  profile_name: string;
  score_string: string;
  scores: Record<DiscLetter, number>;
  date: string;
  email?: string;
};
type ApiDashboardData = {
  summary: {
    latest_profiles_count: number;
    active_team: number;
  };
  disc_type_distribution: DiscTypeDistribution[];
  profile_name_distribution: ProfileNameDistribution[];
  disc_profiles: DiscProfileData[];
};

type RowTone = "d" | "i" | "s" | "c";

type DiscProfileRow = {
  id: string;
  name: string;
  email: string;
  department: string;
  scores: Record<DiscLetter, number>;
  style: string;
  styleTone: RowTone;
  profileName: string;
  date: string;
  rowBgClass: string;
  styleTextClass: string;
};

type DiscProfileResult = {
  counts: Record<DiscLetter, number>;
  scores: Record<DiscLetter, number>;
  totalAnswers: number;
  primary: DiscLetter;
  secondary: DiscLetter;
  patternName: string;
  blendLabel: string;
  completedAt: string;
  attemptId?: string | number;
};

// ─── Constants & Copy ────────────────────────────────────────────────────────

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

const DISC_SUMMARY = [
  {
    key: "d",
    label: "Dominance",
    count: 0,
    bg: "bg-[#fef2f2]",
    border: "border-[#ef4444]/80",
    text: "text-[#ef4444]",
  },
  {
    key: "i",
    label: "Influence",
    count: 0,
    bg: "bg-[#fffbeb]",
    border: "border-[#f59e0b]/80",
    text: "text-[#f59e0b]",
  },
  {
    key: "s",
    label: "Steadiness",
    count: 0,
    bg: "bg-[#f0fdf4]",
    border: "border-[#22c55e]/80",
    text: "text-[#22c55e]",
  },
  {
    key: "c",
    label: "Conscientiousness",
    count: 0,
    bg: "bg-[#eff6ff]",
    border: "border-[#3b82f6]/80",
    text: "text-[#3b82f6]",
  },
] as const;

const PROFILE_CHIPS = [] as const;

const DIGIT_COLORS = [
  "text-[#ef4444]",
  "text-[#f59e0b]",
  "text-[#22c55e]",
  "text-[#3b82f6]",
];

// ─── Helpers & Small Components ──────────────────────────────────────────────

function DiscScoreDigits({ scores }: { scores: Record<DiscLetter, number> }) {
  const d = scores?.D ?? 0;
  const i = scores?.I ?? 0;
  const s = scores?.S ?? 0;
  const c = scores?.C ?? 0;

  return (
    <span className="inline-flex font-mono text-sm font-semibold tabular-nums gap-1">
      <span className={DIGIT_COLORS[0]}>{d}</span>
      <span className="text-neutral-300">-</span>
      <span className={DIGIT_COLORS[1]}>{i}</span>
      <span className="text-neutral-300">-</span>
      <span className={DIGIT_COLORS[2]}>{s}</span>
      <span className="text-neutral-300">-</span>
      <span className={DIGIT_COLORS[3]}>{c}</span>
    </span>
  );
}

function scoreToPercent(score: number, totalAnswers: number = 15): number {
  if (!totalAnswers || totalAnswers === 0) return 0;
  return Math.round((score / totalAnswers) * 100);
}

function DiscDonut({
  score,
  totalAnswers = 15,
  color,
  label,
}: {
  score: number;
  totalAnswers?: number;
  color: string;
  label: string;
}) {
  const r = 38;
  const c = 2 * Math.PI * r;
  const safeTotal = totalAnswers || 1;
  const pct = Math.min(100, Math.max(0, (score / safeTotal) * 100));
  const dash = (pct / 100) * c;
  return (
    <div className="flex flex-col items-center gap-3">
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
            className="stroke-neutral-100"
            strokeWidth={10}
          />
          <circle
            cx={50}
            cy={50}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold tabular-nums text-neutral-800">
            {score}
          </span>
        </div>
      </div>
      <span className="text-xs font-bold uppercase tracking-widest text-neutral-600">
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
  const discColor = DISC_STYLE[primaryType].chart;
  return (
    <div
      style={{
        width: "100%",
        borderRadius: 16,
        overflow: "hidden",
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        border: "1px solid rgba(218,119,86,0.18)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          padding: "24px 28px",
        }}
      >
        <div
          style={{
            background: discColor,
            width: 72,
            height: 72,
            minWidth: 72,
            borderRadius: 18,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            fontWeight: 800,
            color: "#ffffff",
            border: "3px solid rgba(255,255,255,0.3)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            lineHeight: "72px",
            textAlign: "center" as const,
          }}
        >
          {initial}
        </div>
        <div
          style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}
        >
          <span
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            {displayName}
          </span>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#9333ea",
              borderRadius: 999,
              padding: "6px 14px",
              width: "fit-content",
            }}
          >
            <Star
              style={{ width: 14, height: 14, color: "rgba(255,255,255,0.8)" }}
              strokeWidth={2}
            />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#ffffff" }}>
              {patternName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Detailed Report UI Component ────────────────────────────────────────────

function DiscProfileReport({
  result,
  displayName,
  emailHint,
}: {
  result: DiscProfileResult;
  displayName: string;
  emailHint: string;
}) {
  const copy = PROFILE_COPY_DEFAULTS[result.primary];
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
  const [expandedAccordion, setExpandedAccordion] = useState<
    string | undefined
  >(undefined);
  const toggleAll = () =>
    setExpandedAccordion(expandedAccordion ? undefined : "p1");

  const card =
    "rounded-2xl border border-[rgba(218,119,86,0.18)] bg-white shadow-sm overflow-hidden";
  const cardHeader =
    "flex items-center gap-3 border-b border-[rgba(218,119,86,0.10)] p-5 bg-[#FFFAF8]";
  const iconBox = (bg: string) =>
    `flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`;

  return (
    <div
      className="mx-auto max-w-5xl space-y-5"
      style={{ fontFamily: BP.font }}
    >
      <MemberHeaderBanner
        displayName={displayName}
        patternName={result.patternName}
        primaryType={result.primary}
      />

      {/* 1. DISC Scores */}
      <div className={card}>
        <div className="flex flex-col gap-4 px-6 pt-5 pb-3 sm:flex-row sm:items-center sm:justify-between border-b border-[rgba(218,119,86,0.10)] bg-[#FFFAF8]">
          <div className="flex items-center gap-3">
            <div className={iconBox("bg-[#FFF0E8] border border-[#F6E1D7]")}>
              <Brain className="h-5 w-5 text-[#CE8261]" strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
                DISC Profile
              </p>
              <p className="text-sm font-semibold text-neutral-800">
                {result.blendLabel} — {result.patternName}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 text-[12px] text-neutral-400">
            {emailHint && (
              <div className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                {emailHint}
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Assessed: {dateStr}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 p-5 lg:grid-cols-4">
          {DISC_ORDER.map((L) => {
            const s = DISC_STYLE[L];
            const sc = result.scores[L];
            const isPrimary = L === result.primary;
            const isSecondary =
              L === result.secondary && result.primary !== result.secondary;
            return (
              <div
                key={L}
                className={cn(
                  "relative flex flex-col items-center rounded-2xl border-2 p-4 shadow-sm transition-all",
                  s.border,
                  isPrimary ? "ring-2 ring-offset-2 ring-[#DA7756]/30" : ""
                )}
              >
                {isPrimary && (
                  <div className="absolute -top-[10px] left-1/2 -translate-x-1/2 rounded-full bg-[#DA7756] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                    Primary
                  </div>
                )}
                {isSecondary && (
                  <div className="absolute -top-[10px] left-1/2 -translate-x-1/2 rounded-full border border-[#3b82f6] bg-white px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#3b82f6]">
                    Secondary
                  </div>
                )}
                <span className={cn("text-sm font-semibold", s.text)}>
                  {s.label}
                </span>
                <div
                  className={cn(
                    "mt-3 flex w-full flex-col items-center justify-center rounded-xl py-5 text-white shadow-sm",
                    s.fill
                  )}
                >
                  <span className="text-5xl font-bold leading-none">{sc}</span>
                </div>
                <div className="mt-3 w-full space-y-1.5">
                  <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        s.fill
                      )}
                      style={{
                        width: `${scoreToPercent(sc, result.totalAnswers)}%`,
                      }}
                    />
                  </div>
                  <p className="text-center text-xs font-semibold text-neutral-500">
                    {scoreToPercent(sc, result.totalAnswers)}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Understanding Your Personality */}
      <div className={cn(card, "relative")}>
        <div
          className={cn(
            "absolute bottom-0 left-0 top-0 w-1.5 rounded-l-2xl",
            DISC_STYLE[result.primary].fill
          )}
        />
        <div className="ml-2 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white shadow-sm",
                DISC_STYLE[result.primary].fill
              )}
            >
              {result.primary}
            </div>
            <h3 className="text-xl font-bold text-neutral-800">
              {DISC_STYLE[result.primary].label} — {copy.archetype}
            </h3>
          </div>
          <div>
            <h4
              className={cn(
                "text-[14px] font-semibold mb-2",
                DISC_STYLE[result.primary].text
              )}
            >
              Understanding The Personality Type
            </h4>
            <p className="text-[14px] leading-relaxed text-neutral-600">
              {copy.understanding}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Score Distribution */}
      <div className={card}>
        <div className={cardHeader}>
          <div className={iconBox("bg-[#FFF0E8] border border-[#F6E1D7]")}>
            <TrendingUp className="h-5 w-5 text-[#CE8261]" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-800">
              DISC Score Distribution
            </h3>
            <p className="text-xs text-neutral-400">
              Behavioural dimension scores (out of {result.totalAnswers || 15})
            </p>
          </div>
        </div>
        <div className="p-6 flex flex-wrap justify-center gap-10 sm:justify-between sm:px-10">
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
      </div>

      {/* 4. Pattern Line Chart */}
      <div className={card}>
        <div className={cardHeader}>
          <div className={iconBox("bg-purple-100")}>
            <ClipboardList
              className="h-5 w-5 text-purple-600"
              strokeWidth={2}
            />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-800">
              {result.patternName}
            </h3>
            <p className="text-xs text-neutral-400">Exact DISC Pattern</p>
          </div>
        </div>
        <div className="p-6">
          <div className="h-64 w-full max-w-3xl mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 30, left: -10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0ebe8"
                />
                <XAxis
                  dataKey="axis"
                  tick={{ fontSize: 14, fontWeight: 600, fill: "#1f2937" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, result.totalAnswers || 15]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <Tooltip
                  formatter={(v: number) => [`${v}`, "Score"]}
                  labelFormatter={(l) =>
                    `${l} — ${DISC_STYLE[l as DiscLetter]?.label ?? l}`
                  }
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #f0ebe8",
                    fontFamily: BP.font,
                  }}
                />
                <Line
                  type="linear"
                  dataKey="score"
                  stroke="#DA7756"
                  strokeWidth={2.5}
                  dot={{ r: 6, fill: "#DA7756", strokeWidth: 0 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-center text-xs font-semibold text-neutral-400">
            DISC Profile Visualisation
          </p>
          <div className="mt-6 border-l-4 border-[#DA7756]/60 bg-[#FFF9F6] p-5 rounded-r-xl">
            <p className="text-[14px] leading-relaxed text-neutral-700">
              {copy.patternNote}
            </p>
          </div>
        </div>
      </div>

      {/* 5. Action Plan */}
      <div className={card}>
        <div className={cn(cardHeader, "justify-between")}>
          <div className="flex items-center gap-3">
            <div className={iconBox("bg-[#FFF0E8] border border-[#F6E1D7]")}>
              <ClipboardList
                className="h-5 w-5 text-[#CE8261]"
                strokeWidth={2}
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-800">
                Personalised Action Plan
              </h3>
              <p className="text-xs text-neutral-400">{copy.archetype}</p>
            </div>
          </div>
          <button
            onClick={toggleAll}
            className="text-xs font-semibold text-[#CE8261] hover:text-[#BC6B4A] border border-[rgba(218,119,86,0.30)] bg-white px-3 py-1.5 rounded-xl transition-colors"
          >
            {expandedAccordion ? "Collapse All" : "Expand All"}
          </button>
        </div>
        <div className="p-5">
          <Accordion
            type="single"
            collapsible
            className="space-y-3"
            value={expandedAccordion}
            onValueChange={setExpandedAccordion}
          >
            {[
              {
                id: "p1",
                title: "Part 1: Superpowers (Top Strengths)",
                icon: CheckCircle2,
                iconClass: "text-[#10b981]",
                items: copy.superpowers,
              },
              {
                id: "p2",
                title: "Part 2: Growth Zones (Focus Areas)",
                icon: TrendingUp,
                iconClass: "text-[#f59e0b]",
                items: copy.growth,
              },
              {
                id: "p3",
                title: "Part 3: Where They Thrive (Best Roles)",
                icon: Briefcase,
                iconClass: "text-[#DA7756]",
                items: copy.roles,
              },
              {
                id: "p4",
                title: "Part 4: Interpersonal Toolkit (Working With Others)",
                icon: UsersRound,
                iconClass: "text-[#9333ea]",
                items: copy.toolkit,
              },
            ].map((section) => (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="rounded-2xl border border-[rgba(218,119,86,0.18)] bg-white px-2 shadow-sm data-[state=open]:border-[rgba(218,119,86,0.35)]"
              >
                <AccordionTrigger className="px-4 py-3.5 text-left hover:no-underline [&>svg]:text-neutral-400">
                  <span className="flex items-center gap-3">
                    <section.icon
                      className={cn("h-5 w-5", section.iconClass)}
                      strokeWidth={2}
                    />
                    <span className="text-[14px] font-semibold text-neutral-700">
                      {section.title}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-5 pt-1">
                  <div className="space-y-3 pl-8">
                    {section.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 rounded-xl bg-[#FFF9F6] p-4 border border-[rgba(218,119,86,0.14)]"
                      >
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#DA7756] text-xs font-bold text-white shadow-sm mt-0.5">
                          {idx + 1}
                        </div>
                        <div>
                          <h5 className="font-bold text-neutral-800">
                            {item.title}
                          </h5>
                          <p className="mt-1 text-sm text-neutral-600 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* 6. How They Work With Others */}
      <div className={card}>
        <div className={cardHeader}>
          <div className={iconBox("bg-pink-100")}>
            <Users className="h-5 w-5 text-pink-600" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-800">
              How They Work With Others
            </h3>
            <p className="text-xs text-neutral-400">
              Tips for collaborating across DISC styles
            </p>
          </div>
        </div>
        <div className="p-5">
          <div className="overflow-hidden rounded-2xl border border-[rgba(218,119,86,0.18)]">
            <table className="w-full text-left text-[14px]">
              <thead>
                <tr className="bg-[#FFF9F6]">
                  <th className="px-5 py-3.5 font-semibold text-neutral-700 w-1/3 text-sm">
                    When working with...
                  </th>
                  <th className="px-5 py-3.5 font-semibold text-neutral-700 text-sm">
                    Tips for the {result.primary}-Style
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(218,119,86,0.10)]">
                {copy.withOthers.map((row) => {
                  const sType = row.withType.charAt(0) as DiscLetter;
                  const circleBg: Record<DiscLetter, string> = {
                    D: "#e11d48",
                    I: "#f59e0b",
                    S: "#10b981",
                    C: "#3b82f6",
                  };
                  return (
                    <tr
                      key={row.withType}
                      className="bg-white hover:bg-[#FFF9F6] transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3 font-semibold text-neutral-800">
                          {/* 🔥 The Ultimate Centering Fix Using Grid */}
                          <svg
                            width="40"
                            height="40"
                            viewBox="0 0 40 40"
                            style={{ display: "block", margin: 0, padding: 0 }}
                          >
                            <circle
                              cx="20"
                              cy="20"
                              r="20"
                              fill={circleBg[sType]}
                            />
                            <text
                              x="20"
                              y="20"
                              textAnchor="middle"
                              dominantBaseline="central"
                              fill="#ffffff"
                              fontSize="18"
                              fontWeight="900"
                              fontFamily="inherit"
                            >
                              {sType}
                            </text>
                          </svg>
                          <span>{row.label}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-neutral-600 leading-relaxed text-sm">
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
    </div>
  );
}

// ─── Modal Wrapper for the Profile ───────────────────────────────────────────

function DetailedProfileModal({
  row,
  onClose,
}: {
  row: DiscProfileRow;
  onClose: () => void;
}) {
  const d = row.scores?.D || 0;
  const i = row.scores?.I || 0;
  const s = row.scores?.S || 0;
  const c = row.scores?.C || 0;
  const computedTotal = d + i + s + c;
  const totalAnswers = computedTotal || 15;

  const parts = row.style.split("/");
  const primary = (parts[0] || "D") as DiscLetter;
  const secondary = (parts[1] || parts[0] || "D") as DiscLetter;

  const profileResult: DiscProfileResult = {
    counts: { D: d, I: i, S: s, C: c },
    scores: { D: d, I: i, S: s, C: c },
    totalAnswers,
    primary,
    secondary,
    patternName: row.profileName,
    blendLabel: row.style,
    completedAt: row.date || new Date().toISOString(),
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm transition-opacity"
      style={{ background: "rgba(0,0,0,0.50)" }}
    >
      <div
        className="relative flex max-h-full w-full max-w-5xl flex-col overflow-hidden shadow-2xl"
        style={{
          borderRadius: 20,
          background: "#f6f4ee",
          border: "1px solid rgba(218,119,86,0.20)",
        }}
      >
        {/* Modal Header — matches BusinessPlan modal style */}
        <div
          className="flex shrink-0 items-center justify-between px-6 py-5 z-10"
          style={{
            background: BP.cardBg,
            borderBottom: `1px solid ${BP.primaryBord}`,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex items-center gap-3">
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: BP.primary,
                flexShrink: 0,
                display: "inline-block",
              }}
            />
            <h2
              className="font-black text-[17px] m-0"
              style={{ color: BP.textMain, fontFamily: BP.font }}
            >
              Detailed Profile: {row.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm transition-all active:scale-[0.95]"
            style={{
              background: BP.cardBg,
              borderColor: BP.primaryBord,
              color: BP.textMuted,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = BP.primaryBg;
              e.currentTarget.style.color = BP.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = BP.cardBg;
              e.currentTarget.style.color = BP.textMuted;
            }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div
          className="flex-1 overflow-y-auto p-4 sm:p-6"
          style={{
            background: BP.pageBg,
            scrollbarWidth: "thin",
            scrollbarColor: "#C4B89D transparent",
          }}
        >
          <DiscProfileReport
            result={profileResult}
            displayName={row.name}
            emailHint={row.email || ""}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Learn & Teams Content ───────────────────────────────────────────────────

const LEARN_DISC_VIDEO_ID = "YlvUztwXFuE";

type LearnDiscKey = "d" | "i" | "s" | "c";
type LearnSubTab =
  | "traits"
  | "communication"
  | "strengths"
  | "growth"
  | "roles";

const LEARN_DISC_TABS: {
  key: LearnDiscKey;
  label: string;
  name: string;
  tagline: string;
}[] = [
  {
    key: "d",
    label: "D",
    name: "Dominance",
    tagline: "Direct, results-oriented, and decisive.",
  },
  {
    key: "i",
    label: "I",
    name: "Influence",
    tagline: "Outgoing, enthusiastic, and optimistic.",
  },
  {
    key: "s",
    label: "S",
    name: "Steadiness",
    tagline: "Patient, loyal, and calm under pressure.",
  },
  {
    key: "c",
    label: "C",
    name: "Conscientiousness",
    tagline: "Analytical, precise, and quality-focused.",
  },
];

const LEARN_PROFILE_ICON_BY_DISC: Record<
  LearnDiscKey,
  { container: string; icon: string; tabSelected: string }
> = {
  d: {
    container: "border-[#fecaca] bg-[#fef2f2]",
    icon: "text-[#dc2626]",
    tabSelected: "border-[#fecaca] bg-[#fef2f2] text-[#dc2626] shadow-sm",
  },
  i: {
    container: "border-amber-200 bg-[#fffbeb]",
    icon: "text-[#d97706]",
    tabSelected: "border-amber-200 bg-[#fffbeb] text-[#d97706] shadow-sm",
  },
  s: {
    container: "border-emerald-200 bg-[#f0fdf4]",
    icon: "text-[#16a34a]",
    tabSelected: "border-emerald-200 bg-[#f0fdf4] text-[#16a34a] shadow-sm",
  },
  c: {
    container: "border-[#93c5fd] bg-[#eff6ff]",
    icon: "text-[#3b82f6]",
    tabSelected: "border-[#93c5fd] bg-[#eff6ff] text-[#2563eb] shadow-sm",
  },
};

const LEARN_SUB_TABS: { key: LearnSubTab; label: string }[] = [
  { key: "traits", label: "Traits" },
  { key: "communication", label: "Communication" },
  { key: "strengths", label: "Strengths" },
  { key: "growth", label: "Growth" },
  { key: "roles", label: "Roles" },
];

const LEARN_TRAITS_BY_TYPE: Record<LearnDiscKey, string[]> = {
  d: [
    "Ambitious and competitive",
    "Confident and commanding",
    "Results-focused",
    "Decisive and action-oriented",
    "Direct communicator",
    "Takes calculated risks",
  ],
  i: [
    "Enthusiastic and persuasive",
    "Collaborative and people-focused",
    "Optimistic and creative",
    "Expressive and verbal",
    "Open to new ideas",
    "Builds rapport quickly",
  ],
  s: [
    "Patient and consistent",
    "Supportive team player",
    "Calm and steady",
    "Listens well and builds trust",
    "Prefers predictable routines",
    "Loyal and dependable",
  ],
  c: [
    "Detail-oriented and systematic",
    "Objective and analytical",
    "High standards for accuracy",
    "Cautious and methodical",
    "Follows process and rules",
    "Quality-focused and thorough",
  ],
};

const LEARN_SUB_CONTENT: Record<LearnDiscKey, Record<LearnSubTab, string[]>> = {
  d: {
    traits: [],
    communication: [
      "Prefer clear, concise updates; avoid fluff.",
      "State the goal first, then supporting facts.",
      "Be direct when giving feedback; don't take silence as disagreement.",
    ],
    strengths: [
      "Drives clarity and momentum on tough projects.",
      "Comfortable making calls under pressure.",
      "Holds self and others accountable to outcomes.",
    ],
    growth: [
      "Pause to invite input before finalizing decisions.",
      "Soften tone when stakes are emotional, not just operational.",
      "Balance speed with alignment on cross-functional work.",
    ],
    roles: [
      "Leadership, operations, and turnaround initiatives.",
      "Roles where outcomes and speed matter more than consensus.",
    ],
  },
  i: {
    traits: [],
    communication: [
      "Use stories and enthusiasm to align teams.",
      "Keep energy high; check in on follow-through.",
      "Invite dialogue; summarize decisions in writing.",
    ],
    strengths: [
      "Rallys teams around vision and momentum.",
      "Builds strong relationships and morale.",
      "Brings creativity to messaging and change.",
    ],
    growth: [
      "Document timelines and owners so ideas become delivery.",
      "Listen for detail-oriented concerns from C-styles.",
      "Balance optimism with realistic planning.",
    ],
    roles: ["Sales, marketing, client-facing, and culture-building roles."],
  },
  s: {
    traits: [],
    communication: [
      "Prefer warm, steady tone; avoid abrupt changes.",
      "Give context before asking for big shifts.",
      "Allow time to process; don't force instant decisions.",
    ],
    strengths: [
      "Creates stability and trust on teams.",
      "Reliable execution under routine pressure.",
      "Strong collaborator in long-term projects.",
    ],
    growth: [
      "Speak up earlier when priorities conflict.",
      "Practice concise updates in fast forums.",
      "Set boundaries on scope to avoid overload.",
    ],
    roles: ["Support, HR, coaching, and service delivery roles."],
  },
  c: {
    traits: [],
    communication: [
      "Prefer clear agendas, data, and written follow-ups.",
      "Avoid vague language; specify expectations.",
      "Ask clarifying questions before committing.",
    ],
    strengths: [
      "Drives quality and risk reduction.",
      "Structured thinking and documentation.",
      "Strong analytical and audit mindset.",
    ],
    growth: [
      "Share thinking earlier even if not perfect.",
      "Balance analysis with timely decisions.",
      "Acknowledge people impact, not only process.",
    ],
    roles: ["Finance, QA, compliance, engineering, and systems roles."],
  },
};

const LEARN_INTERACTIONS = [
  {
    title: "D & I (Action-oriented)",
    body: "Fast-paced, results-focused collaboration. D brings drive and direction; I brings energy and buy-in. Together they move fast—align on strategy and enthusiasm so momentum stays productive.",
    boxClass: "border-[#fecaca] bg-[#fef2f2] text-neutral-800",
  },
  {
    title: "D & S (Stability)",
    body: "Vision paired with steady support. D pushes for outcomes; S protects people and rhythm. Clarify impact on the team so change feels fair and sustainable.",
    boxClass: "border-emerald-200 bg-[#f0fdf4] text-neutral-800",
  },
  {
    title: "I & S (People-first)",
    body: "People-oriented motivation and harmony. I energizes relationships; S sustains trust and care. Great for culture—pair with clear structure so execution doesn't slip.",
    boxClass: "border-sky-200 bg-[#eff6ff] text-neutral-800",
  },
  {
    title: "C & Everyone (Quality)",
    body: "Attention to detail and standards. C improves accuracy for everyone; pair with D/I for speed and with S for sustainable rollout. Quality scales when balanced with pace.",
    boxClass: "border-amber-200 bg-[#fffbeb] text-neutral-800",
  },
];

function LearnTabContent() {
  const [discKey, setDiscKey] = useState<LearnDiscKey>("d");
  const [subTab, setSubTab] = useState<LearnSubTab>("traits");

  const meta = LEARN_DISC_TABS.find((t) => t.key === discKey)!;
  const profileIcon = LEARN_PROFILE_ICON_BY_DISC[discKey];
  const traits = LEARN_TRAITS_BY_TYPE[discKey];
  const subCopy = LEARN_SUB_CONTENT[discKey][subTab];

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 shadow-sm">
        <div className="border-b border-[#DA7756]/20 p-4 sm:p-6">
          <div className="flex flex-wrap items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DA7756]/10">
              <FileVideo className="h-6 w-6 text-[#C72030]" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 sm:text-xl">
                Watch: What is DISC? (Video Explanation)
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                A quick overview of the DISC model and how it applies to you.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#DA7756]/5 p-3 sm:p-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[#DA7756]/25 bg-black shadow-inner">
            <iframe
              title="How to Use DISC Test in HR — What is DISC?"
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube.com/embed/${LEARN_DISC_VIDEO_ID}?rel=0&modestbranding=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-wrap items-start gap-3 sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#DA7756] bg-[#DA7756]/10 shadow-sm">
            <BookOpen className="h-6 w-6 text-[#DA7756]" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900 sm:text-xl">
              Understanding DISC
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Learn about the four main behavioral styles and how they interact.
            </p>
          </div>
        </div>
        <p className="mb-4 text-sm text-neutral-700">
          DISC is a behavioral assessment tool that measures four dimensions of
          human behavior:
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {LEARN_DISC_TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => {
                setDiscKey(t.key);
                setSubTab("traits");
              }}
              className={cn(
                "rounded-xl border px-3 py-3 text-center text-sm font-semibold transition-all",
                discKey === t.key
                  ? LEARN_PROFILE_ICON_BY_DISC[t.key].tabSelected
                  : "border-[#DA7756]/20 bg-[#DA7756]/10 text-neutral-600 hover:bg-[#DA7756]/15 hover:text-neutral-900"
              )}
            >
              <span className="text-lg font-bold">{t.label}</span>
              <span
                className={cn(
                  "mt-2 block text-xs font-medium",
                  discKey === t.key ? "opacity-95" : "opacity-90"
                )}
              >
                ({t.name})
              </span>
            </button>
          ))}
        </div>
      </Card>

      <Card className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-wrap items-start gap-3 sm:gap-4">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 shadow-sm transition-colors",
              profileIcon.container
            )}
          >
            <Square
              className={cn("h-6 w-6 transition-colors", profileIcon.icon)}
              strokeWidth={2}
            />
          </div>
          <div>
            <h3
              className={cn(
                "text-lg font-bold transition-colors",
                discKey === "d" && "text-[#dc2626]",
                discKey === "i" && "text-[#d97706]",
                discKey === "s" && "text-[#16a34a]",
                discKey === "c" && "text-[#2563eb]"
              )}
            >
              {meta.label} — {meta.name}
            </h3>
            <p className="mt-1 text-sm text-neutral-600">{meta.tagline}</p>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-1 rounded-xl border border-[#DA7756]/15 bg-[#DA7756]/10 p-1.5">
          {LEARN_SUB_TABS.map((st) => (
            <button
              key={st.key}
              type="button"
              onClick={() => setSubTab(st.key)}
              className={cn(
                "flex-1 min-w-[5.5rem] rounded-lg px-2 py-2.5 text-center text-xs font-medium transition-all sm:min-w-0 sm:text-sm",
                subTab === st.key
                  ? "bg-[#DA7756]/10 font-semibold text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              )}
            >
              {st.label}
            </button>
          ))}
        </div>

        {subTab === "traits" && (
          <div>
            <h4 className="mb-3 text-base font-bold text-neutral-900">
              Key Characteristics
            </h4>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {traits.map((line) => (
                <div
                  key={line}
                  className="flex items-start gap-2 rounded-lg border border-neutral-100 bg-[#f6f4ee]/50 px-3 py-2.5 text-sm text-neutral-800"
                >
                  <Diamond
                    className="mt-0.5 h-4 w-4 shrink-0 fill-amber-400 text-amber-500"
                    strokeWidth={1.5}
                  />
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {subTab !== "traits" && (
          <div className="space-y-3">
            <h4 className="text-base font-bold text-neutral-900">
              {LEARN_SUB_TABS.find((s) => s.key === subTab)?.label}
            </h4>
            <ul className="space-y-2 text-sm text-neutral-700">
              {subCopy.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="text-[#DA7756]" aria-hidden>
                    •
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      <Card className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-4 shadow-sm sm:p-6">
        <h3 className="text-lg font-bold text-neutral-900">
          How DISC Types Interact
        </h3>
        <p className="mt-1 text-sm text-neutral-500">
          Understanding team dynamics across different behavioral styles.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {LEARN_INTERACTIONS.map((box) => (
            <div
              key={box.title}
              className={cn(
                "rounded-xl border p-4 text-sm leading-relaxed shadow-sm",
                box.boxClass
              )}
            >
              <p className="font-semibold text-neutral-900">{box.title}</p>
              <p className="mt-2 text-neutral-700">{box.body}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

type DepartmentTeam = {
  id: string;
  name: string;
  assessmentsCompleted: number;
  discDistribution: { d: number; i: number; s: number; c: number };
  averageScores: { d: number; i: number; s: number; c: number };
  departmentHead?: string;
};

const DISC_BAR_META = [
  { key: "d" as const, label: "D", fill: "bg-[#ef4444]" },
  { key: "i" as const, label: "I", fill: "bg-[#f59e0b]" },
  { key: "s" as const, label: "S", fill: "bg-[#22c55e]" },
  { key: "c" as const, label: "C", fill: "bg-[#3b82f6]" },
];

const AVG_DOT = [
  { key: "d" as const, className: "bg-[#ef4444]" },
  { key: "i" as const, className: "bg-[#f59e0b]" },
  { key: "s" as const, className: "bg-[#22c55e]" },
  { key: "c" as const, className: "bg-[#3b82f6]" },
];

function DepartmentTeamCard({ dept }: { dept: DepartmentTeam }) {
  const maxBar = Math.max(
    1,
    ...DISC_BAR_META.map((m) => dept.discDistribution[m.key])
  );

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-4 text-left shadow-sm transition-all sm:p-5",
        "hover:border-[#DA7756]/35 hover:shadow-md"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#DA7756] bg-[#DA7756]/10 shadow-sm">
          <Users className="h-6 w-6 text-[#DA7756]" strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-neutral-900">{dept.name}</h3>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#DA7756]/20 bg-[#DA7756]/10 px-3 py-2.5 text-sm text-neutral-800">
        <User className="h-4 w-4 shrink-0 text-[#DA7756]" strokeWidth={2} />
        <span>
          <span className="font-semibold tabular-nums">
            {dept.assessmentsCompleted}
          </span>{" "}
          {dept.assessmentsCompleted === 1 ? "assessment" : "assessments"}{" "}
          completed
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-xs font-medium text-neutral-500">
          DISC Type Distribution
        </p>
        <div className="space-y-2">
          {DISC_BAR_META.map((m) => {
            const v = dept.discDistribution[m.key];
            const pct = Math.round((v / maxBar) * 100);
            return (
              <div key={m.key} className="flex items-center gap-2">
                <span className="w-4 shrink-0 text-xs font-semibold text-neutral-600">
                  {m.label}
                </span>
                <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-neutral-200">
                  <div
                    className={cn("h-full rounded-full transition-all", m.fill)}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-7 shrink-0 text-right text-xs font-medium tabular-nums text-neutral-700">
                  {v}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium text-neutral-500">
          Average DISC Scores
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-neutral-800">
          {AVG_DOT.map((dot) => (
            <span key={dot.key} className="inline-flex items-center gap-1.5">
              <span
                className={cn(
                  "h-2.5 w-2.5 shrink-0 rounded-full",
                  dot.className
                )}
                aria-hidden
              />
              <span className="font-medium uppercase">{dot.key}:</span>
              <span className="tabular-nums text-neutral-700">
                {dept.averageScores[dot.key]}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-[#DA7756]/20 bg-[#f6f4ee]/80 px-3 py-2.5">
        <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
          Department Head
        </p>
        <p className="mt-0.5 text-sm font-medium text-neutral-900">
          {dept.departmentHead ?? "—"}
        </p>
      </div>
    </div>
  );
}

function TeamsTabContent() {
  const [deptSearch, setDeptSearch] = useState("");
  const [apiDepts, setApiDepts] = useState<DepartmentTeam[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        let baseUrl = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");
        if (!baseUrl || !token) {
          setLoading(false);
          return;
        }
        if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://"))
          baseUrl = "https://" + baseUrl;
        const response = await fetch(
          `${baseUrl}/disc_assessments/department_dashboard`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data?.success) {
          const rawDepts = data.data.departments || [];
          const parseDisc = (
            data:
              | Record<string, unknown>
              | Array<Record<string, unknown>>
              | undefined,
            valKey: "count" | "score"
          ) => {
            if (Array.isArray(data)) {
              const m = { d: 0, i: 0, s: 0, c: 0 };
              data.forEach((x: Record<string, unknown>) => {
                const t = String(x.type || "").toLowerCase();
                if (t === "d") m.d = Number(x[valKey]) || 0;
                if (t === "i") m.i = Number(x[valKey]) || 0;
                if (t === "s") m.s = Number(x[valKey]) || 0;
                if (t === "c") m.c = Number(x[valKey]) || 0;
              });
              return m;
            }
            const obj = data as Record<string, unknown> | undefined;
            return {
              d: Number(obj?.d ?? obj?.D) || 0,
              i: Number(obj?.i ?? obj?.I) || 0,
              s: Number(obj?.s ?? obj?.S) || 0,
              c: Number(obj?.c ?? obj?.C) || 0,
            };
          };
          const mapped: DepartmentTeam[] = rawDepts.map(
            (d: Record<string, unknown>) => ({
              id: String(d.id || d.department_id || Math.random()),
              name: String(d.name || d.department_name || "Unknown"),
              assessmentsCompleted: Number(
                d.assessments_completed ?? d.assessmentsCompleted ?? 0
              ),
              discDistribution: parseDisc(
                (d.disc_distribution ?? d.discDistribution) as
                  | Record<string, unknown>
                  | Array<Record<string, unknown>>
                  | undefined,
                "count"
              ),
              averageScores: parseDisc(
                (d.average_scores ?? d.averageScores) as
                  | Record<string, unknown>
                  | Array<Record<string, unknown>>
                  | undefined,
                "score"
              ),
              departmentHead:
                (d.department_head ?? d.departmentHead)
                  ? String(d.department_head ?? d.departmentHead)
                  : undefined,
            })
          );
          setApiDepts(mapped);
        }
      } catch (err) {
        console.error("Error fetching departments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const filtered = useMemo(() => {
    const q = deptSearch.trim().toLowerCase();
    if (!q) return apiDepts;
    return apiDepts.filter((d) => d.name.toLowerCase().includes(q));
  }, [deptSearch, apiDepts]);

  return (
    <Card className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-start gap-2">
        <Users
          className="mt-0.5 h-5 w-5 shrink-0 text-[#DA7756]"
          strokeWidth={2}
        />
        <div>
          <h2 className="text-lg font-bold text-neutral-900">Teams</h2>
          <p className="text-sm text-neutral-500">
            Department DISC overview and completion by team
          </p>
        </div>
      </div>
      <div className="mb-6">
        <div className="relative min-w-0 w-full">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
            aria-hidden
          />
          <input
            type="search"
            value={deptSearch}
            onChange={(e) => setDeptSearch(e.target.value)}
            placeholder="Search departments..."
            className="h-10 w-full rounded-xl border border-neutral-200 bg-white py-2 pl-10 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[#DA7756]/25"
          />
        </div>
      </div>
      {loading ? (
        <div className="rounded-xl border border-dashed border-[#DA7756]/30 bg-[#DA7756]/10 py-10 text-center">
          <p className="text-sm text-neutral-500">Loading departments...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#DA7756]/30 bg-[#DA7756]/10 py-10 text-center">
          <p className="text-sm text-neutral-500">
            No departments match your search or no data available.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((dept) => (
            <DepartmentTeamCard key={dept.id} dept={dept} />
          ))}
        </div>
      )}
    </Card>
  );
}

// ─── Main Dashboard Component ────────────────────────────────────────────────

const DiscReport = () => {
  const [tab, setTab] = useState<DiscTab>("dashboard");
  const [profileFilter, setProfileFilter] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [showAllRows, setShowAllRows] = useState(false);
  const [sortKey, setSortKey] = useState<
    "name" | "department" | "score" | "style" | "profile" | "date"
  >("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // ── Single group mode: ungrouped | department ──
  const [groupMode, setGroupMode] = useState<"ungrouped" | "department">(
    "ungrouped"
  );

  const [profilePreview, setProfilePreview] = useState<DiscProfileRow | null>(
    null
  );
  const [apiData, setApiData] = useState<ApiDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        let baseUrl = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");
        if (!baseUrl || !token) {
          setLoading(false);
          return;
        }
        if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://"))
          baseUrl = "https://" + baseUrl;
        const response = await fetch(`${baseUrl}/disc_assessments/dashboard`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data?.success) setApiData(data.data);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const computedDiscSummary = useMemo(() => {
    if (!apiData?.disc_type_distribution) return DISC_SUMMARY;
    return DISC_SUMMARY.map((item) => {
      const match = apiData.disc_type_distribution.find(
        (d) => d.type.toLowerCase() === item.key
      );
      return { ...item, count: match ? match.count : 0 };
    });
  }, [apiData]);

  const computedProfileChips = useMemo(() => {
    if (!apiData?.profile_name_distribution) return PROFILE_CHIPS;
    return apiData.profile_name_distribution.map((p) => ({
      name: p.profile_name,
      count: p.count,
    }));
  }, [apiData]);

  const mapToneToClasses = (tone: string) => {
    const t = (tone || "d").toLowerCase();
    switch (t) {
      case "i":
        return {
          rowBgClass: "bg-[#fffbeb]/90",
          styleTextClass: "text-[#f59e0b] font-semibold",
          tone: "i" as RowTone,
        };
      case "s":
        return {
          rowBgClass: "bg-[#f0fdf4]/90",
          styleTextClass: "text-[#22c55e] font-semibold",
          tone: "s" as RowTone,
        };
      case "c":
        return {
          rowBgClass: "bg-[#eff6ff]/90",
          styleTextClass: "text-[#3b82f6] font-semibold",
          tone: "c" as RowTone,
        };
      case "d":
      default:
        return {
          rowBgClass: "bg-[#fef2f2]/90",
          styleTextClass: "text-[#ef4444] font-semibold",
          tone: "d" as RowTone,
        };
    }
  };

  const apiRows: DiscProfileRow[] = useMemo(() => {
    if (!apiData?.disc_profiles) return [];
    return apiData.disc_profiles.map((p) => {
      const toneData = mapToneToClasses(p.primary_type);
      return {
        id: p.encrypted_attempt_id || String(p.attempt_id),
        name: p.name || "",
        email: p.email || "",
        department: p.department || "N/A",
        scores: p.scores || { D: 0, I: 0, S: 0, C: 0 },
        style: p.style_code || "",
        styleTone: toneData.tone,
        profileName: p.profile_name || "",
        date: p.date || "",
        rowBgClass: toneData.rowBgClass,
        styleTextClass: toneData.styleTextClass,
      };
    });
  }, [apiData]);

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filteredRows = useMemo(() => {
    let rows = [...apiRows];
    const q = search.trim().toLowerCase();
    if (q)
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q) ||
          r.profileName.toLowerCase().includes(q)
      );
    if (profileFilter)
      rows = rows.filter((r) => r.profileName === profileFilter);
    if (typeFilter !== "all")
      rows = rows.filter((r) => r.styleTone === typeFilter);
    rows.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "department":
          cmp = a.department.localeCompare(b.department);
          break;
        case "score":
          cmp = Number(a.scores?.D || 0) - Number(b.scores?.D || 0); // basic sorting fallback
          break;
        case "style":
          cmp = a.style.localeCompare(b.style);
          break;
        case "profile":
          cmp = a.profileName.localeCompare(b.profileName);
          break;
        case "date":
          cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [search, profileFilter, typeFilter, sortKey, sortDir, apiRows]);

  const visibleRows = showAllRows ? filteredRows : filteredRows.slice(0, 3);
  const allSelected =
    visibleRows.length > 0 && visibleRows.every((r) => selected[r.id]);

  const toggleSelectAll = () => {
    if (allSelected) {
      const next = { ...selected };
      visibleRows.forEach((r) => {
        delete next[r.id];
      });
      setSelected(next);
    } else {
      const next = { ...selected };
      visibleRows.forEach((r) => {
        next[r.id] = true;
      });
      setSelected(next);
    }
  };

  // ── groupedRows only groups by department ──
  const groupedRows = useMemo(() => {
    if (groupMode === "ungrouped") return null;
    const groups: Record<string, DiscProfileRow[]> = {};
    visibleRows.forEach((row) => {
      const key = row.department || "—";
      if (!groups[key]) groups[key] = [];
      groups[key].push(row);
    });
    return Object.entries(groups).sort((a, b) => {
      if (a[0] === "—") return 1;
      if (b[0] === "—") return -1;
      return a[0].localeCompare(b[0]);
    });
  }, [visibleRows, groupMode]);

  const SortHeader = ({ label, k }: { label: string; k: typeof sortKey }) => (
    <button
      type="button"
      onClick={() => toggleSort(k)}
      className="flex w-full items-center justify-start gap-1 text-left font-semibold text-neutral-800 hover:text-[#DA7756]"
    >
      {label}
      {sortKey === k && (
        <span className="text-xs text-neutral-400" aria-hidden>
          {sortDir === "asc" ? "↑" : "↓"}
        </span>
      )}
    </button>
  );

  return (
    <div
      className="min-h-[calc(100vh-5rem)] px-4 py-6 sm:px-6"
      style={{ background: BP.pageBg, fontFamily: BP.font }}
    >
      {/* Poppins font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap'); .disc-wrap, .disc-wrap * { font-family: 'Poppins', sans-serif !important; }`}</style>

      <div className="disc-wrap mx-auto max-w-6xl space-y-6">
        {/* ── Page Header — matches BusinessPlan ── */}
        <div
          className="overflow-hidden rounded-2xl border shadow-sm p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
          style={{
            background: "rgba(218,119,86,0.10)",
            borderColor: BP.primaryBord,
          }}
        >
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 shadow-sm"
              style={{
                borderColor: BP.primary,
                background: "rgba(218,119,86,0.10)",
              }}
            >
              <Brain
                className="h-6 w-6"
                style={{ color: BP.primary }}
                strokeWidth={2}
              />
            </div>
            <div>
              <p
                className="text-[10px] font-black uppercase tracking-[0.18em] mb-1"
                style={{ color: BP.textMuted }}
              >
                Behavioural insights across your organisation
              </p>
              <h1
                className="text-2xl font-black tracking-tight"
                style={{ color: "#111" }}
              >
                DISC Assessment Management
              </h1>
              <p
                className="text-sm font-semibold mt-1"
                style={{ color: BP.textMuted }}
              >
                Manage DISC profiles, team analytics, and behavioral insights.
              </p>
            </div>
          </div>
        </div>

        {/* ── Tab Bar — matches BusinessPlan pill style ── */}
        <div
          className="flex w-fit rounded-2xl p-1 gap-1 overflow-x-auto"
          style={{ background: BP.primary }}
        >
          {(["dashboard", "teams", "learn"] as DiscTab[]).map((t) => {
            const Icon =
              t === "dashboard" ? Brain : t === "teams" ? BarChart3 : BookOpen;
            const labels: Record<DiscTab, string> = {
              dashboard: "Dashboard",
              teams: "Teams",
              learn: "Learn",
            };
            const isActive = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex items-center gap-2 py-2 px-5 rounded-xl text-sm font-bold transition-all duration-150 whitespace-nowrap"
                style={{
                  background: isActive ? "#fff" : "transparent",
                  color: isActive ? BP.primary : "rgba(255,255,255,0.85)",
                  boxShadow: isActive ? "0 1px 4px rgba(0,0,0,0.10)" : "none",
                }}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                {labels[t]}
              </button>
            );
          })}
        </div>

        {tab === "teams" && <TeamsTabContent />}
        {tab === "learn" && <LearnTabContent />}

        {tab === "dashboard" && (
          <>
            {/* DISC Type Distribution */}
            <Card
              className="rounded-2xl border shadow-sm p-4 sm:p-6"
              style={{
                borderColor: BP.primaryBord,
                background: "rgba(218,119,86,0.06)",
              }}
            >
              <div className="mb-4 flex flex-wrap items-start gap-2">
                <TrendingUp
                  className="mt-0.5 h-5 w-5 shrink-0"
                  style={{ color: BP.primary }}
                  strokeWidth={2}
                />
                <div>
                  <h2
                    className="text-lg font-black"
                    style={{ color: BP.textMain }}
                  >
                    DISC Type Distribution
                  </h2>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: BP.textMuted }}
                  >
                    Primary types across latest assessments
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {computedDiscSummary.map((d) => (
                  <div
                    key={d.key}
                    className={cn(
                      "flex flex-col items-center justify-center rounded-xl border-2 px-3 py-5 text-center",
                      d.bg,
                      d.border
                    )}
                  >
                    <span
                      className={cn(
                        "text-4xl font-black tabular-nums leading-none",
                        d.text
                      )}
                    >
                      {d.count}
                    </span>
                    <span className="mt-2 text-sm font-bold text-neutral-800">
                      {d.label}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Profile Name Distribution */}
            <Card
              className="rounded-2xl border shadow-sm p-4 sm:p-6"
              style={{
                borderColor: BP.primaryBord,
                background: "rgba(218,119,86,0.06)",
              }}
            >
              <div className="mb-4 flex flex-wrap items-start gap-2">
                <Users
                  className="mt-0.5 h-5 w-5 shrink-0"
                  style={{ color: BP.primary }}
                  strokeWidth={2}
                />
                <div>
                  <h2
                    className="text-lg font-black"
                    style={{ color: BP.textMain }}
                  >
                    Profile Name Distribution
                  </h2>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: BP.textMuted }}
                  >
                    Click a profile to filter the table below
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setProfileFilter(null)}
                  className="rounded-xl border px-4 py-2 text-sm font-bold transition-all"
                  style={{
                    borderColor:
                      profileFilter === null ? BP.primary : BP.primaryBord,
                    background:
                      profileFilter === null
                        ? "rgba(218,119,86,0.10)"
                        : BP.pageBg,
                    color: profileFilter === null ? BP.primary : BP.textMain,
                  }}
                >
                  All
                </button>
                {computedProfileChips.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() =>
                      setProfileFilter((prev) =>
                        prev === p.name ? null : p.name
                      )
                    }
                    className="rounded-xl border px-4 py-2 text-sm font-bold transition-all"
                    style={{
                      borderColor:
                        profileFilter === p.name ? BP.primary : BP.primaryBord,
                      background:
                        profileFilter === p.name
                          ? "rgba(218,119,86,0.10)"
                          : BP.pageBg,
                      color:
                        profileFilter === p.name ? BP.primary : BP.textMain,
                    }}
                  >
                    {p.name}{" "}
                    <span className="font-black tabular-nums">{p.count}</span>
                  </button>
                ))}
                {computedProfileChips.length === 0 && (
                  <span
                    className="text-sm font-semibold mt-2"
                    style={{ color: BP.textMuted }}
                  >
                    No profile data available.
                  </span>
                )}
              </div>
            </Card>

            {/* DISC Profiles Table */}
            <Card
              className="rounded-2xl border shadow-sm p-4 sm:p-6"
              style={{
                borderColor: BP.primaryBord,
                background: "rgba(218,119,86,0.06)",
              }}
            >
              <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-wrap items-start gap-2">
                  <Users
                    className="mt-0.5 h-5 w-5 shrink-0"
                    style={{ color: BP.primary }}
                    strokeWidth={2}
                  />
                  <div>
                    <h2
                      className="text-lg font-black"
                      style={{ color: BP.textMain }}
                    >
                      DISC Profiles
                    </h2>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: BP.textMuted }}
                    >
                      Latest per person
                      {filteredRows.length > visibleRows.length
                        ? ` (${visibleRows.length} of ${filteredRows.length} shown)`
                        : ` (${filteredRows.length} profile${filteredRows.length !== 1 ? "s" : ""})`}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Select All */}
                  <button
                    onClick={toggleSelectAll}
                    className="rounded-xl border px-4 py-2 text-sm font-bold shadow-sm transition-all active:scale-[0.97]"
                    style={{
                      borderColor: BP.primaryBord,
                      background: BP.cardBg,
                      color: BP.textMuted,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = BP.primaryBg;
                      e.currentTarget.style.borderColor = BP.primaryBordStrong;
                      e.currentTarget.style.color = BP.primary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = BP.cardBg;
                      e.currentTarget.style.borderColor = BP.primaryBord;
                      e.currentTarget.style.color = BP.textMuted;
                    }}
                  >
                    Select All
                  </button>

                  {/* ── Single "Group by Dept" toggle button ── */}
                  <button
                    onClick={() =>
                      setGroupMode(
                        groupMode === "department" ? "ungrouped" : "department"
                      )
                    }
                    className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold shadow-sm transition-all active:scale-[0.97] border"
                    style={{
                      background:
                        groupMode === "department" ? BP.primary : BP.cardBg,
                      color: groupMode === "department" ? "#fff" : BP.primary,
                      borderColor:
                        groupMode === "department"
                          ? BP.primary
                          : BP.primaryBord,
                      fontFamily: BP.font,
                    }}
                    onMouseEnter={(e) => {
                      if (groupMode !== "department") {
                        e.currentTarget.style.background = BP.primaryBg;
                        e.currentTarget.style.borderColor =
                          BP.primaryBordStrong;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (groupMode !== "department") {
                        e.currentTarget.style.background = BP.cardBg;
                        e.currentTarget.style.borderColor = BP.primaryBord;
                      }
                    }}
                  >
                    <Briefcase className="h-4 w-4" />
                    {groupMode === "department"
                      ? "Grouped by Dept"
                      : "Group by Dept"}
                  </button>

                  {/* Show All */}
                  <button
                    onClick={() => setShowAllRows((s) => !s)}
                    className="rounded-xl border px-4 py-2 text-sm font-bold shadow-sm transition-all active:scale-[0.97]"
                    style={{
                      borderColor: BP.primaryBord,
                      background: BP.cardBg,
                      color: BP.textMuted,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = BP.primaryBg;
                      e.currentTarget.style.borderColor = BP.primaryBordStrong;
                      e.currentTarget.style.color = BP.primary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = BP.cardBg;
                      e.currentTarget.style.borderColor = BP.primaryBord;
                      e.currentTarget.style.color = BP.textMuted;
                    }}
                  >
                    {showAllRows ? "Show less" : `Show All (${apiRows.length})`}
                  </button>
                </div>
              </div>

              {/* Search + Filter */}
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative min-w-0 flex-1">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                    aria-hidden
                  />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, department, email..."
                    className="h-10 w-full rounded-xl border py-2 pl-10 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none"
                    style={{
                      borderColor: BP.primaryBord,
                      background: BP.cardBg,
                      fontFamily: BP.font,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = BP.primary;
                      e.currentTarget.style.boxShadow =
                        "0 0 0 3px rgba(218,119,86,0.15)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = BP.primaryBord;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger
                    className="h-10 w-full rounded-xl sm:w-[180px]"
                    style={{
                      borderColor: BP.primaryBord,
                      background: BP.cardBg,
                      fontFamily: BP.font,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-neutral-500" />
                      <SelectValue placeholder="All Types" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="d">Dominance (D)</SelectItem>
                    <SelectItem value="i">Influence (I)</SelectItem>
                    <SelectItem value="s">Steadiness (S)</SelectItem>
                    <SelectItem value="c">Conscientiousness (C)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* ── Ungrouped Table ── */}
              {groupMode === "ungrouped" ? (
                <div
                  className="overflow-x-auto rounded-xl border"
                  style={{ borderColor: BP.primaryBord, background: BP.cardBg }}
                >
                  <table className="w-full min-w-[880px] border-collapse text-left text-sm">
                    <thead>
                      <tr
                        className="border-b"
                        style={{
                          borderColor: BP.primaryBord,
                          background: "rgba(218,119,86,0.08)",
                        }}
                      >
                        <th className="w-10 px-3 py-3">
                          <Checkbox
                            checked={allSelected}
                            onCheckedChange={() => toggleSelectAll()}
                            aria-label="Select all visible"
                          />
                        </th>
                        <th className="px-3 py-3">
                          <SortHeader label="Name" k="name" />
                        </th>
                        <th className="px-3 py-3">
                          <SortHeader label="Department" k="department" />
                        </th>
                        <th className="px-3 py-3">
                          <SortHeader label="DISC Score" k="score" />
                        </th>
                        <th className="px-3 py-3">
                          <SortHeader label="Style" k="style" />
                        </th>
                        <th className="px-3 py-3">
                          <SortHeader label="Profile Name" k="profile" />
                        </th>
                        <th className="px-3 py-3">
                          <SortHeader label="Date" k="date" />
                        </th>
                        <th className="px-3 py-3 text-center font-semibold text-neutral-800">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleRows.map((row) => (
                        <tr
                          key={row.id}
                          className={cn(
                            "border-b border-neutral-100/80",
                            row.rowBgClass
                          )}
                        >
                          <td className="px-3 py-3 align-middle">
                            <Checkbox
                              checked={!!selected[row.id]}
                              onCheckedChange={(c) =>
                                setSelected((s) => ({
                                  ...s,
                                  [row.id]: c === true,
                                }))
                              }
                            />
                          </td>
                          <td className="px-3 py-3 font-bold text-neutral-900">
                            {row.name}
                          </td>
                          <td className="px-3 py-3 text-neutral-700">
                            {row.department}
                          </td>
                          <td className="px-3 py-3">
                            <DiscScoreDigits scores={row.scores} />
                          </td>
                          <td
                            className={cn(
                              "px-3 py-3 font-bold",
                              row.styleTextClass
                            )}
                          >
                            {row.style}
                          </td>
                          <td className="px-3 py-3 text-neutral-800">
                            {row.profileName}
                          </td>
                          <td className="px-3 py-3 text-neutral-600">
                            {row.date}
                          </td>
                          <td className="px-3 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => setProfilePreview(row)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm transition-all active:scale-[0.95]"
                              style={{
                                borderColor: BP.primaryBord,
                                background: BP.cardBg,
                                color: BP.textMuted,
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = BP.primaryBg;
                                e.currentTarget.style.color = BP.primary;
                                e.currentTarget.style.borderColor =
                                  BP.primaryBordStrong;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = BP.cardBg;
                                e.currentTarget.style.color = BP.textMuted;
                                e.currentTarget.style.borderColor =
                                  BP.primaryBord;
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {visibleRows.length === 0 && (
                    <p
                      className="text-center py-8 text-sm font-semibold"
                      style={{ color: BP.textMuted }}
                    >
                      No profiles match your filters or no data available.
                    </p>
                  )}
                </div>
              ) : (
                /* ── Grouped by Department ── */
                <div className="flex flex-col gap-4">
                  {groupedRows?.map(([groupName, rows]) => (
                    <div
                      key={groupName}
                      className="overflow-hidden shadow-sm"
                      style={{
                        borderRadius: 16,
                        border: `1px solid ${BP.primaryBord}`,
                        background: BP.cardBg,
                      }}
                    >
                      {/* Group Header — matches BusinessPlan teal section style */}
                      <div
                        className="flex items-center justify-between px-5 py-3.5 border-l-4"
                        style={{
                          background: "rgba(218,119,86,0.10)",
                          borderLeftColor: BP.primary,
                          borderBottomColor: BP.primaryBord,
                          borderBottomWidth: 1,
                          borderBottomStyle: "solid",
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Briefcase
                            className="h-4 w-4"
                            style={{ color: BP.primary }}
                            strokeWidth={2}
                          />
                          <h3
                            className="text-sm font-black"
                            style={{ color: BP.primary, fontFamily: BP.font }}
                          >
                            {groupName}
                          </h3>
                        </div>
                        <span
                          className="rounded-full px-3 py-0.5 text-[11px] font-black text-white tabular-nums"
                          style={{ background: BP.primary }}
                        >
                          {rows.length} profile{rows.length !== 1 ? "s" : ""}
                        </span>
                      </div>

                      {/* Grouped Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[780px] border-collapse text-left text-sm">
                          <thead>
                            <tr
                              className="border-b"
                              style={{
                                borderColor: BP.primaryBord,
                                background: "rgba(218,119,86,0.04)",
                              }}
                            >
                              <th className="w-10 px-5 py-3"></th>
                              <th className="px-3 py-3 font-semibold text-neutral-600">
                                Name
                              </th>
                              <th className="px-3 py-3 font-semibold text-neutral-600">
                                DISC Score
                              </th>
                              <th className="px-3 py-3 font-semibold text-neutral-600">
                                Style
                              </th>
                              <th className="px-3 py-3 font-semibold text-neutral-600">
                                Profile Name
                              </th>
                              <th className="px-3 py-3 font-semibold text-neutral-600">
                                Date
                              </th>
                              <th className="px-3 py-3 text-center font-semibold text-neutral-600">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((row) => (
                              <tr
                                key={row.id}
                                className={cn(
                                  "border-b border-neutral-100/80 transition-colors",
                                  row.rowBgClass
                                )}
                              >
                                <td className="px-5 py-3 align-middle">
                                  <Checkbox
                                    checked={!!selected[row.id]}
                                    onCheckedChange={(c) =>
                                      setSelected((s) => ({
                                        ...s,
                                        [row.id]: c === true,
                                      }))
                                    }
                                  />
                                </td>
                                <td className="px-3 py-3 font-bold text-neutral-900">
                                  {row.name}
                                </td>
                                <td className="px-3 py-3">
                                  <DiscScoreDigits scores={row.scores} />
                                </td>
                                <td
                                  className={cn(
                                    "px-3 py-3 font-bold",
                                    row.styleTextClass
                                  )}
                                >
                                  {row.style}
                                </td>
                                <td className="px-3 py-3 text-neutral-800">
                                  {row.profileName}
                                </td>
                                <td className="px-3 py-3 text-neutral-500">
                                  {row.date}
                                </td>
                                <td className="px-3 py-3 text-center">
                                  <button
                                    type="button"
                                    onClick={() => setProfilePreview(row)}
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm transition-all active:scale-[0.95]"
                                    style={{
                                      borderColor: BP.primaryBord,
                                      background: BP.cardBg,
                                      color: BP.textMuted,
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.background =
                                        BP.primaryBg;
                                      e.currentTarget.style.color = BP.primary;
                                      e.currentTarget.style.borderColor =
                                        BP.primaryBordStrong;
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background =
                                        BP.cardBg;
                                      e.currentTarget.style.color =
                                        BP.textMuted;
                                      e.currentTarget.style.borderColor =
                                        BP.primaryBord;
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                  {(!groupedRows || groupedRows.length === 0) && (
                    <div
                      className="rounded-2xl border py-10 text-center"
                      style={{
                        borderColor: BP.primaryBord,
                        background: BP.cardBg,
                      }}
                    >
                      <p
                        className="text-sm font-semibold"
                        style={{ color: BP.textMuted }}
                      >
                        No profiles match your filters or no data available.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </>
        )}
      </div>

      {/* ── Detailed Profile Modal ── */}
      {profilePreview && (
        <DetailedProfileModal
          row={profilePreview}
          onClose={() => setProfilePreview(null)}
        />
      )}
    </div>
  );
};

export default DiscReport;
