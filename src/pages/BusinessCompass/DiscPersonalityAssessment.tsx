import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Brain,
  Briefcase,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Eye,
  FileCode2,
  Loader2,
  Mail,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  Users,
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
  primary: DiscLetter;
  secondary: DiscLetter;
  patternName: string;
  blendLabel: string;
  completedAt: string;
  attemptId?: string | number;
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

function patternNameFor(primary: DiscLetter, secondary: DiscLetter): string {
  if (primary === secondary) {
    return (
      { D: "Driver", I: "Influencer", S: "Stabilizer", C: "Analyst" }[primary] ?? "Balanced"
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
    if (counts[dim] !== undefined) counts[dim] += 1;
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
      { title: "Unflinching Execution", desc: "You cut through red tape and bureaucracy to get things done. When a milestone needs to be hit, you are the engine." },
      { title: "Crisis Leadership", desc: "When things go wrong, you don't panic. You naturally step up, take control, and make the tough calls to stabilise the situation." },
      { title: "Fearless Boundary-Pushing", desc: "You aren't afraid to challenge the status quo, demand better results, and drive aggressive growth." },
    ],
    growth: [
      { title: "Patience with Process", desc: "Slowing down to ensure others are aligned before charging forward." },
      { title: "Active Listening", desc: "Hearing out the 'why' from teammates instead of just demanding the 'what'." },
    ],
    roles: [
      { title: "Project Turnarounds", desc: "Taking over failing projects and driving them to completion." },
      { title: "Sales Leadership", desc: "Driving revenue targets and managing high-performance teams." },
    ],
    toolkit: [
      { title: "Direct Alignment", desc: "Set clear goals without micromanaging the process." },
      { title: "Results Framing", desc: "Present ideas in terms of outcomes and ROI, not process." },
    ],
    withOthers: [
      { label: "Dominance (D)", withType: "Dominance", tip: "Be brief and direct. Focus on 'winning' together. Agree on boundaries immediately to avoid clashing egos." },
      { label: "Influence (I)", withType: "Influence", tip: "Allow space for small talk and rapport-building before diving into demands. Acknowledge their creativity before expecting the deliverable." },
      { label: "Steadiness (S)", withType: "Steadiness", tip: "Slow down. Don't just order—ask for their support. Explain how the change benefits the team to get their buy-in." },
      { label: "Conscientiousness (C)", withType: "Conscientiousness", tip: "Bring the data. They don't care about your gut feeling. Give them the 'Why' and 'How' in writing, then give them space to work." },
    ],
  },
  I: {
    archetype: "The People Energiser",
    understanding:
      "You are the spark that ignites enthusiasm in any room. You connect through stories, energy, and genuine warmth. Your ability to rally people around a vision makes you a natural in roles that require persuasion and relationship-building. You thrive in dynamic environments where creativity and collaboration are valued.",
    patternNote:
      "As an I-style, your superpower is your ability to make people feel seen and heard. You bring optimism and energy that elevate team morale. Your growth challenge is maintaining follow-through once the initial excitement fades. Building systems for accountability and documentation will help turn your big ideas into lasting results.",
    superpowers: [
      { title: "Building Buy-In", desc: "You naturally create enthusiasm and alignment across different roles and personalities." },
      { title: "Storytelling", desc: "You communicate ideas in ways that are memorable, engaging, and inspiring." },
      { title: "Network Building", desc: "You form genuine connections quickly and maintain relationships effortlessly." },
    ],
    growth: [
      { title: "Follow-Through", desc: "Documenting decisions and seeing projects through to completion." },
      { title: "Detail Orientation", desc: "Slowing down to check the fine print before moving forward." },
    ],
    roles: [
      { title: "Client Success", desc: "Managing relationships and ensuring client satisfaction." },
      { title: "Marketing & Partnerships", desc: "Building brand presence and forming strategic alliances." },
    ],
    toolkit: [
      { title: "Energy Matching", desc: "Keep morale visible and celebrate small wins publicly." },
      { title: "Visual Communication", desc: "Use stories, visuals, and demos over reports and spreadsheets." },
    ],
    withOthers: [
      { label: "Dominance (D)", withType: "Dominance", tip: "Match their pace in meetings; send a one-page recap after so they have the summary." },
      { label: "Influence (I)", withType: "Influence", tip: "Brainstorm together with energy, then assign clear owners and deadlines before ending the conversation." },
      { label: "Steadiness (S)", withType: "Steadiness", tip: "Reassure them on process and avoid surprise pivots—they need predictability to feel secure." },
      { label: "Conscientiousness (C)", withType: "Conscientiousness", tip: "Lead with the bottom line first, then offer the detail if they want it." },
    ],
  },
  S: {
    archetype: "The Reliable Anchor",
    understanding:
      "You are the steady force that keeps teams grounded and functioning through change. You value consistency, loyalty, and genuine collaboration. Your patience and empathy make you someone others naturally turn to for support and guidance. You thrive in environments where you can build deep trust over time.",
    patternNote:
      "As an S-style, your greatest strength is creating psychological safety for your team. People feel comfortable being honest around you. Your growth challenge is asserting your own needs and speaking up before reaching capacity. Learning to set boundaries early and advocate for your ideas will amplify your already significant impact.",
    superpowers: [
      { title: "Psychological Safety", desc: "Creating a calm, trusting environment where people feel safe to share and take risks." },
      { title: "Consistent Delivery", desc: "You show up reliably and follow through on commitments without needing external pressure." },
      { title: "Deep Listening", desc: "You hear not just what people say, but what they mean—making you an exceptional collaborator." },
    ],
    growth: [
      { title: "Asserting Needs", desc: "Speaking up about workload and boundaries before reaching overwhelm." },
      { title: "Embracing Change", desc: "Building comfort with uncertainty and rapid pivots." },
    ],
    roles: [
      { title: "HR & People Partner", desc: "Supporting employee wellbeing and team culture." },
      { title: "Customer Care", desc: "Building long-term client relationships through trust and consistency." },
    ],
    toolkit: [
      { title: "Steady Pacing", desc: "Check in with teammates privately to surface issues before they escalate." },
      { title: "Process Documentation", desc: "Build reliable systems that others can follow consistently." },
    ],
    withOthers: [
      { label: "Dominance (D)", withType: "Dominance", tip: "Prepare a concise recommendation and invite their decision—they respect clarity and brevity." },
      { label: "Influence (I)", withType: "Influence", tip: "Affirm their ideas warmly, then help steer to one shared plan with clear next steps." },
      { label: "Steadiness (S)", withType: "Steadiness", tip: "Check workload quietly and offer to swap tasks if someone is overwhelmed." },
      { label: "Conscientiousness (C)", withType: "Conscientiousness", tip: "Share timelines and quality expectations upfront so there are no surprises." },
    ],
  },
  C: {
    archetype: "The Quality Guardian",
    understanding:
      "You are the person who catches what everyone else misses. You prioritise accuracy, structure, and sound reasoning in everything you do. Your ability to think systematically and identify risks before they become problems makes you invaluable in any technical or analytical role. You thrive when given space to work independently with clear standards.",
    patternNote:
      "As a C-style, your greatest strength is your commitment to getting it right. You bring rigour and precision that elevates the quality of everything your team produces. Your growth challenge is time-boxing your analysis to avoid perfectionism paralysis. Learning to communicate your findings as stories—not just data—will help your insights land with decision-makers.",
    superpowers: [
      { title: "Spotting Flaws Early", desc: "You catch issues before they become incidents, saving time, money, and reputation." },
      { title: "Systematic Thinking", desc: "You build processes and frameworks that stand up to scrutiny and scale." },
      { title: "Research Depth", desc: "You go further than anyone else to ensure the analysis is thorough and defensible." },
    ],
    growth: [
      { title: "Time-Boxing", desc: "Setting a hard stop on analysis to prevent perfectionism from blocking progress." },
      { title: "Communicating Uncertainty", desc: "Sharing findings even when the picture isn't fully complete." },
    ],
    roles: [
      { title: "Engineering & Architecture", desc: "Designing systems that are robust, scalable, and well-documented." },
      { title: "QA & Compliance", desc: "Ensuring standards are met and risks are identified proactively." },
    ],
    toolkit: [
      { title: "Data-Driven Arguments", desc: "Always bring evidence. Quantify the risk and the recommended action." },
      { title: "Written Clarity", desc: "Document decisions and rationale so the team can reference and learn." },
    ],
    withOthers: [
      { label: "Dominance (D)", withType: "Dominance", tip: "Offer a clear binary choice with your risk view attached—they want the conclusion, not the full analysis." },
      { label: "Influence (I)", withType: "Influence", tip: "Capture their creative vision in measurable requirements so it can actually be built." },
      { label: "Steadiness (S)", withType: "Steadiness", tip: "Give predictable rhythms and avoid surprise rework—they plan carefully and need stability." },
      { label: "Conscientiousness (C)", withType: "Conscientiousness", tip: "Agree on sources of truth and version control early to avoid duplicate or conflicting work." },
    ],
  },
};

function scoreToPercent(score: number): number {
  return Math.round((score / 7) * 100);
}

function DiscDonut({ score, color, label }: { score: number; color: string; label: string }) {
  const r = 38;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, (score / 7) * 100));
  const dash = (pct / 100) * c;
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-[7.5rem] w-[7.5rem]">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100" aria-hidden>
          <circle cx={50} cy={50} r={r} fill="none" className="stroke-neutral-100" strokeWidth={10} />
          <circle cx={50} cy={50} r={r} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" strokeDasharray={`${dash} ${c}`} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold tabular-nums text-neutral-800">{score}</span>
        </div>
      </div>
      <span className="text-xs font-bold uppercase tracking-widest text-neutral-600">{label}</span>
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
    <div style={{ width: "100%", borderRadius: 16, overflow: "hidden", background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", border: "1px solid rgba(218,119,86,0.18)", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "24px 28px" }}>
        <div style={{ background: discColor, width: 72, height: 72, minWidth: 72, borderRadius: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800, color: "#ffffff", border: "3px solid rgba(255,255,255,0.3)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", lineHeight: "72px", textAlign: "center" as const }}>
          {initial}
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#ffffff", lineHeight: 1.2, letterSpacing: "-0.02em" }}>{displayName}</span>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#9333ea", borderRadius: 999, padding: "6px 14px", width: "fit-content" }}>
            <Star style={{ width: 14, height: 14, color: "rgba(255,255,255,0.8)" }} strokeWidth={2} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#ffffff" }}>{patternName}</span>
          </div>
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
  profileCopy?: typeof PROFILE_COPY_DEFAULTS[DiscLetter];
}) {
  const copy = profileCopy ?? PROFILE_COPY_DEFAULTS[result.primary];
  const completed = new Date(result.completedAt);
  const dateStr = completed.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
  const chartData = DISC_ORDER.map((L) => ({ axis: L, score: result.scores[L] }));
  const [expandedAccordion, setExpandedAccordion] = useState<string | undefined>(undefined);
  const toggleAll = () => setExpandedAccordion(expandedAccordion ? undefined : "p1");

  const card = "rounded-2xl border border-[rgba(218,119,86,0.18)] bg-white shadow-sm overflow-hidden";
  const cardHeader = "flex items-center gap-3 border-b border-[rgba(218,119,86,0.10)] p-5 bg-[#FFFAF8]";
  const iconBox = (bg: string) => `flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`;

  return (
    <div className="mx-auto max-w-5xl space-y-5" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Retake + Assessed On bar */}
      {showRetake && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(90deg, #3b2f7a 0%, #2d2470 100%)", borderRadius: 16, padding: "14px 20px", gap: 12 }}>
          <button type="button" onClick={onRetake} style={{ background: "transparent", border: "2px solid rgba(255,255,255,0.55)", borderRadius: 10, padding: "8px 20px", fontSize: 13, fontWeight: 700, color: "#ffffff", cursor: "pointer", letterSpacing: "0.01em", whiteSpace: "nowrap" as const }}>
            Retake Assessment
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Calendar style={{ width: 16, height: 16, color: "rgba(255,255,255,0.7)" }} strokeWidth={2} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.9)", whiteSpace: "nowrap" as const }}>
              Assessed on: {completed.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" })}
            </span>
          </div>
        </div>
      )}

      {/* Member Header Banner */}
      <MemberHeaderBanner displayName={displayName} patternName={result.patternName} primaryType={result.primary} />

      {/* 1. DISC Scores */}
      <div className={card}>
        <div className="flex flex-col gap-4 px-6 pt-5 pb-3 sm:flex-row sm:items-center sm:justify-between border-b border-[rgba(218,119,86,0.10)] bg-[#FFFAF8]">
          <div className="flex items-center gap-3">
            <div className={iconBox("bg-[#FFF0E8] border border-[#F6E1D7]")}>
              <Brain className="h-5 w-5 text-[#CE8261]" strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">DISC Profile</p>
              <p className="text-sm font-semibold text-neutral-800">{result.blendLabel} — {result.patternName}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 text-[12px] text-neutral-400">
            <div className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{emailHint}</div>
            <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />Assessed: {dateStr}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 p-5 lg:grid-cols-4">
          {DISC_ORDER.map((L) => {
            const s = DISC_STYLE[L];
            const sc = result.scores[L];
            const isPrimary = L === result.primary;
            const isSecondary = L === result.secondary && result.primary !== result.secondary;
            return (
              <div key={L} className={cn("relative flex flex-col items-center rounded-2xl border-2 p-4 shadow-sm transition-all", s.border, isPrimary ? "ring-2 ring-offset-2 ring-[#DA7756]/30" : "")}>
                {isPrimary && <div className="absolute -top-[10px] left-1/2 -translate-x-1/2 rounded-full bg-[#DA7756] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">Primary</div>}
                {isSecondary && <div className="absolute -top-[10px] left-1/2 -translate-x-1/2 rounded-full border border-[#3b82f6] bg-white px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#3b82f6]">Secondary</div>}
                <span className={cn("text-sm font-semibold", s.text)}>{s.label}</span>
                <div className={cn("mt-3 flex w-full flex-col items-center justify-center rounded-xl py-5 text-white shadow-sm", s.fill)}>
                  <span className="text-5xl font-bold leading-none">{sc}</span>
                </div>
                <div className="mt-3 w-full space-y-1.5">
                  <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all duration-500", s.fill)} style={{ width: `${scoreToPercent(sc)}%` }} />
                  </div>
                  <p className="text-center text-xs font-semibold text-neutral-500">{scoreToPercent(sc)}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Understanding Your Personality */}
      <div className={cn(card, "relative")}>
        <div className={cn("absolute bottom-0 left-0 top-0 w-1.5 rounded-l-2xl", DISC_STYLE[result.primary].fill)} />
        <div className="ml-2 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white shadow-sm", DISC_STYLE[result.primary].fill)}>
              {result.primary}
            </div>
            <h3 className="text-xl font-bold text-neutral-800">{DISC_STYLE[result.primary].label} — {copy.archetype}</h3>
          </div>
          <div>
            <h4 className={cn("text-[14px] font-semibold mb-2", DISC_STYLE[result.primary].text)}>Understanding Your Personality Type</h4>
            <p className="text-[14px] leading-relaxed text-neutral-600">{copy.understanding}</p>
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
            <h3 className="text-base font-bold text-neutral-800">DISC Score Distribution</h3>
            <p className="text-xs text-neutral-400">Your behavioural dimension scores (out of 7)</p>
          </div>
        </div>
        <div className="p-6 flex flex-wrap justify-center gap-10 sm:justify-between sm:px-10">
          {DISC_ORDER.map((L) => (
            <DiscDonut key={L} score={result.scores[L]} color={DISC_STYLE[L].chart} label={DISC_STYLE[L].label} />
          ))}
        </div>
      </div>

      {/* 4. Pattern Line Chart */}
      <div className={card}>
        <div className={cardHeader}>
          <div className={iconBox("bg-purple-100")}>
            <ClipboardList className="h-5 w-5 text-purple-600" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-800">{result.patternName}</h3>
            <p className="text-xs text-neutral-400">Your Exact DISC Pattern</p>
          </div>
        </div>
        <div className="p-6">
          <div className="h-64 w-full max-w-3xl mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0ebe8" />
                <XAxis dataKey="axis" tick={{ fontSize: 14, fontWeight: 600, fill: "#1f2937" }} axisLine={false} tickLine={false} />
                <YAxis domain={[1, 7]} ticks={[1, 2, 3, 4, 5, 6, 7]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                <Tooltip formatter={(v: number) => [`${v}`, "Score"]} labelFormatter={(l) => `${l} — ${DISC_STYLE[l as DiscLetter]?.label ?? l}`} contentStyle={{ borderRadius: 12, border: "1px solid #f0ebe8", fontFamily: "'Poppins', sans-serif" }} />
                <Line type="linear" dataKey="score" stroke="#DA7756" strokeWidth={2.5} dot={{ r: 6, fill: "#DA7756", strokeWidth: 0 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-center text-xs font-semibold text-neutral-400">Your DISC Profile Visualisation</p>
          <div className="mt-6 border-l-4 border-[#DA7756]/60 bg-[#FFF9F6] p-5 rounded-r-xl">
            <p className="text-[14px] leading-relaxed text-neutral-700">{copy.patternNote}</p>
          </div>
        </div>
      </div>

      {/* 5. Action Plan */}
      <div className={card}>
        <div className={cn(cardHeader, "justify-between")}>
          <div className="flex items-center gap-3">
            <div className={iconBox("bg-[#FFF0E8] border border-[#F6E1D7]")}>
              <ClipboardList className="h-5 w-5 text-[#CE8261]" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-800">Your Personalised Action Plan</h3>
              <p className="text-xs text-neutral-400">{copy.archetype}</p>
            </div>
          </div>
          <button onClick={toggleAll} className="text-xs font-semibold text-[#CE8261] hover:text-[#BC6B4A] border border-[rgba(218,119,86,0.30)] bg-white px-3 py-1.5 rounded-xl transition-colors">
            {expandedAccordion ? "Collapse All" : "Expand All"}
          </button>
        </div>
        <div className="p-5">
          <Accordion type="single" collapsible className="space-y-3" value={expandedAccordion} onValueChange={setExpandedAccordion}>
            {[
              { id: "p1", title: "Part 1: Your Superpowers (Top Strengths)", icon: CheckCircle2, iconClass: "text-[#10b981]", items: copy.superpowers },
              { id: "p2", title: "Part 2: Your Growth Zones (Focus Areas)", icon: TrendingUp, iconClass: "text-[#f59e0b]", items: copy.growth },
              { id: "p3", title: "Part 3: Where You Thrive (Best Roles)", icon: Briefcase, iconClass: "text-[#DA7756]", items: copy.roles },
              { id: "p4", title: "Part 4: Your Interpersonal Toolkit (Working With Others)", icon: UsersRound, iconClass: "text-[#9333ea]", items: copy.toolkit },
            ].map((section) => (
              <AccordionItem key={section.id} value={section.id} className="rounded-2xl border border-[rgba(218,119,86,0.18)] bg-white px-2 shadow-sm data-[state=open]:border-[rgba(218,119,86,0.35)]">
                <AccordionTrigger className="px-4 py-3.5 text-left hover:no-underline [&>svg]:text-neutral-400">
                  <span className="flex items-center gap-3">
                    <section.icon className={cn("h-5 w-5", section.iconClass)} strokeWidth={2} />
                    <span className="text-[14px] font-semibold text-neutral-700">{section.title}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-5 pt-1">
                  <div className="space-y-3 pl-8">
                    {section.items.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 rounded-xl bg-[#FFF9F6] p-4 border border-[rgba(218,119,86,0.14)]">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#DA7756] text-xs font-bold text-white shadow-sm mt-0.5">{idx + 1}</div>
                        <div>
                          <h5 className="font-bold text-neutral-800">{item.title}</h5>
                          <p className="mt-1 text-sm text-neutral-600 leading-relaxed">{item.desc}</p>
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

      {/* 6. Personal Commitment */}
      <div className={card}>
        <div className={cardHeader}>
          <div className={iconBox("bg-neutral-100")}>
            <ClipboardList className="h-5 w-5 text-neutral-600" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-800">Personal Commitment (Your Next Steps)</h3>
            <p className="text-xs text-neutral-400">Reflective questions to anchor your growth</p>
          </div>
        </div>
        <div className="p-5 space-y-4">
          {[
            "Which 'Growth Zone' is currently holding you back the most?",
            "What is ONE specific action you will take this week to improve your communication with a team member who has a different DISC style?",
            "What is one area where you can delegate authority (not just tasks) to let someone else take the lead this month?",
          ].map((q, i) => (
            <div key={i} className="flex gap-4 border-b border-dashed border-[rgba(218,119,86,0.18)] pb-4 last:border-0">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#DA7756] text-xs font-bold text-white">{i + 1}</div>
              <p className="text-[14px] font-semibold text-neutral-800 pt-0.5">{q}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 7. How You Work With Others */}
      <div className={card}>
        <div className={cardHeader}>
          <div className={iconBox("bg-pink-100")}>
            <Users className="h-5 w-5 text-pink-600" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-800">How You Work With Others</h3>
            <p className="text-xs text-neutral-400">Tips for collaborating across DISC styles</p>
          </div>
        </div>
        <div className="p-5">
          <div className="overflow-hidden rounded-2xl border border-[rgba(218,119,86,0.18)]">
            <table className="w-full text-left text-[14px]">
              <thead>
                <tr className="bg-[#FFF9F6]">
                  <th className="px-5 py-3.5 font-semibold text-neutral-700 w-1/3 text-sm">When working with...</th>
                  <th className="px-5 py-3.5 font-semibold text-neutral-700 text-sm">Tips for the {result.primary}-Style</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(218,119,86,0.10)]">
                {copy.withOthers.map((row) => {
                  const sType = row.withType.charAt(0) as DiscLetter;
                  const circleBg: Record<DiscLetter, string> = { D: "#e11d48", I: "#f59e0b", S: "#10b981", C: "#3b82f6" };
                  return (
                    <tr key={row.withType} className="bg-white hover:bg-[#FFF9F6] transition-colors">
                      <td className="px-5 py-4">
                        <div style={{ display: "flex", alignItems: "center", gap: 12, fontWeight: 600, color: "#1f2937" }}>
                          <span style={{ width: 40, height: 40, minWidth: 40, borderRadius: "50%", background: circleBg[sType], display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#ffffff", lineHeight: "40px", textAlign: "center" }}>
                            {sType}
                          </span>
                          {row.label}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-neutral-600 leading-relaxed text-sm">{row.tip}</td>
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

function TeamMemberCard({ member }: { member: any }) {
  const avatarLetter = member.name?.[0]?.toUpperCase() || "?";
  const getDiscColor = (type: string) => {
    switch (type) {
      case "D": return "bg-[#e11d48]";
      case "I": return "bg-[#f59e0b]";
      case "S": return "bg-[#10b981]";
      case "C": return "bg-[#3b82f6]";
      default: return "bg-[#DA7756]";
    }
  };
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-[rgba(218,119,86,0.18)] bg-[#FFF9F6] shadow-sm hover:shadow-md hover:border-[rgba(218,119,86,0.35)] transition-all">
      <div className="flex gap-4 p-5">
        <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] text-lg font-bold text-white shadow-sm", getDiscColor(member.primary_type))}>
          {avatarLetter}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-neutral-900">{member.name}</h3>
          <p className="mt-0.5 text-sm text-neutral-500">{member.department}</p>
        </div>
      </div>
      <div className={cn("mx-4 mb-4 rounded-2xl px-4 py-4 text-white", getDiscColor(member.primary_type))}>
        <p className="text-xs font-medium text-white/80">DISC Score</p>
        <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight">{member.score_string || "0000"}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {member.primary_type && <span className="rounded-xl bg-white/20 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">{member.primary_type} Primary</span>}
          {member.secondary_type && <span className="rounded-xl bg-white/10 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">{member.secondary_type} Secondary</span>}
        </div>
        <p className="mt-3 w-fit border-b border-dotted border-white/70 text-sm font-medium text-white">{member.profile_name}</p>
      </div>
      <div className="mt-auto p-4 pt-0">
        <button type="button" onClick={() => member.onViewReport?.(member.attempt_id, member.name)} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#DA7756] py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#BC6B4A]">
          <Eye className="h-4 w-4" strokeWidth={2} />
          View Full Profile
        </button>
      </div>
    </div>
  );
}

function TeamProfilesTabContent({ members, loading, onViewReport }: { members: any[]; loading: boolean; onViewReport: (id: any, name: string) => void }) {
  const [search, setSearch] = useState("");
  const [discFilter, setDiscFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const q = search.trim().toLowerCase();
      const matchSearch = !q || m.name?.toLowerCase().includes(q) || m.department?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q);
      const matchDisc = discFilter === "all" || m.primary_type === discFilter;
      const matchDept = deptFilter === "all" || m.department === deptFilter;
      return matchSearch && matchDisc && matchDept;
    });
  }, [search, discFilter, deptFilter, members]);

  const departments = useMemo(() => {
    const depts = new Set<string>();
    members.forEach((m) => { if (m.department) depts.add(m.department); });
    return Array.from(depts).sort();
  }, [members]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-[#DA7756]" />
        <p className="mt-4 text-sm font-medium text-neutral-600">Loading team profiles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[rgba(218,119,86,0.18)] bg-[#FFF9F6] p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1.5 min-w-0 flex-1">
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Search by name</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search team members..." className="h-10 w-full rounded-xl border border-[rgba(218,119,86,0.20)] bg-white pl-10 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.25)]" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Filter by DISC type</label>
            <Select value={discFilter} onValueChange={setDiscFilter}>
              <SelectTrigger className="h-10 rounded-xl border-[rgba(218,119,86,0.20)] bg-white"><SelectValue placeholder="All Types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="D">D — Dominance</SelectItem>
                <SelectItem value="I">I — Influence</SelectItem>
                <SelectItem value="S">S — Steadiness</SelectItem>
                <SelectItem value="C">C — Conscientiousness</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Filter by Department</label>
            <Select value={deptFilter} onValueChange={setDeptFilter}>
              <SelectTrigger className="h-10 rounded-xl border-[rgba(218,119,86,0.20)] bg-white"><SelectValue placeholder="All Departments" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[rgba(218,119,86,0.18)] bg-[#FFF9F6] py-16 text-center shadow-sm">
          <Users className="mx-auto h-10 w-10 text-neutral-300" />
          <p className="mt-3 text-sm text-neutral-500">No team members match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
  return (
    <div className="rounded-2xl border border-[rgba(218,119,86,0.18)] bg-[#FFF9F6] p-6 shadow-sm sm:p-8 w-full">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 mb-2 uppercase tracking-widest">
          <span>Question {currentQuestion + 1} of {totalQuestions}</span>
          <span>{Math.round(((currentQuestion + 1) / totalQuestions) * 100)}% Complete</span>
        </div>
        <div className="h-2 w-full rounded-full bg-[#F0EBE8] overflow-hidden">
          <div className="h-full bg-[#DA7756] rounded-full transition-all duration-300 ease-out" style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }} />
        </div>
      </div>
      <h2 className="text-lg font-bold text-neutral-900 mb-5">{question.text}</h2>
      <div className="space-y-3 mb-8">
        {question.options.map((option, index) => (
          <button key={index} type="button" onClick={() => onAnswerSelect(index)}
            className={cn("w-full text-left p-4 rounded-2xl border transition-all duration-200", "hover:border-[rgba(218,119,86,0.40)] hover:bg-[rgba(218,119,86,0.04)]", selectedAnswer === index ? "border-[#DA7756] bg-[rgba(218,119,86,0.08)] shadow-sm" : "border-[rgba(218,119,86,0.18)] bg-white")}>
            <div className="flex items-center gap-3">
              <div className={cn("h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0", selectedAnswer === index ? "border-[#DA7756] bg-[#DA7756]" : "border-neutral-300 bg-white")}>
                {selectedAnswer === index && <div className="h-2 w-2 rounded-full bg-white" />}
              </div>
              <span className={cn("text-sm font-medium", selectedAnswer === index ? "text-[#DA7756]" : "text-neutral-900")}>{option.label}</span>
            </div>
          </button>
        ))}
      </div>
      <div className="flex gap-3 justify-between">
        <button type="button" onClick={onPrevious} disabled={currentQuestion === 0}
          className={cn("px-6 py-3 rounded-2xl font-semibold text-sm transition-colors", currentQuestion === 0 ? "bg-neutral-100 text-neutral-400 cursor-not-allowed" : "border border-[rgba(218,119,86,0.30)] bg-white text-[#CE8261] hover:bg-[#FFF9F6]")}>
          Previous
        </button>
        {currentQuestion === totalQuestions - 1 ? (
          <button type="button" onClick={onFinish} disabled={selectedAnswer === null || isSubmitting}
            className={cn("px-6 py-3 rounded-2xl font-semibold text-sm text-white transition-colors flex items-center gap-2", (selectedAnswer === null || isSubmitting) ? "bg-neutral-300 cursor-not-allowed" : "bg-[#DA7756] hover:bg-[#BC6B4A] shadow-sm")}>
            {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : "Finish Assessment"}
          </button>
        ) : (
          <button type="button" onClick={onNext} disabled={selectedAnswer === null}
            className={cn("px-6 py-3 rounded-2xl font-semibold text-sm text-white transition-colors", selectedAnswer === null ? "bg-neutral-300 cursor-not-allowed" : "bg-[#DA7756] hover:bg-[#BC6B4A] shadow-sm")}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const DiscPersonalityAssessment = () => {
  const [mainTab, setMainTab] = useState("report");
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [savedProfile, setSavedProfile] = useState<DiscProfileResult | null>(null);
  const [selectedMemberReport, setSelectedMemberReport] = useState<DiscProfileResult | null>(null);
  const [selectedMemberName, setSelectedMemberName] = useState<string>("Team Member");
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
          [parsed.first_name || parsed.firstname, parsed.last_name || parsed.lastname].filter(Boolean).join(" ") ||
          parsed.name ||
          "";
        const email = parsed.email || "";
        return { name: fullName, email };
      }
    } catch { /* ignore */ }
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
          fetch(`${baseUrl}/disc_assessments/questions`, { headers }).catch(() => null),
          fetch(`${baseUrl}/disc_assessments/my_report`, { headers }).catch(() => null),
          fetch(`${baseUrl}/disc_assessments/team_profiles`, { headers }).catch(() => null),
        ]);

        if (qRes && qRes.ok) {
          const qData = await qRes.json();
          const qs: ApiQuestion[] = qData?.data?.questions ?? qData?.questions ?? [];
          if (qs.length > 0) setQuestions(qs);
        }

        if (rRes && rRes.ok) {
          const rData = await rRes.json();
          if (rData.success && rData.data?.report) {
            const report = rData.data.report;
            const totalAnswers = report.total_answers || 15;
            const rawCounts = { D: report.scores?.D || 0, I: report.scores?.I || 0, S: report.scores?.S || 0, C: report.scores?.C || 0 };
            const toScore = (n: number) => Math.max(1, Math.min(7, Math.round(1 + (n / totalAnswers) * 6)));

            const apiName = report.user_name || report.name || rData.data?.user?.name || rData.data?.user?.full_name || "";
            const apiEmail = report.user_email || report.email || rData.data?.user?.email || "";
            if (apiName && !localStorage.getItem("user_full_name")) localStorage.setItem("user_full_name", apiName);
            if (apiEmail && !localStorage.getItem("user_email")) localStorage.setItem("user_email", apiEmail);

            const primaryType = report.primary_type as DiscLetter;
            const secondaryType = (report.secondary_type || report.primary_type) as DiscLetter;

            setSavedProfile({
              counts: rawCounts,
              scores: { D: toScore(rawCounts.D), I: toScore(rawCounts.I), S: toScore(rawCounts.S), C: toScore(rawCounts.C) },
              primary: primaryType,
              secondary: secondaryType,
              patternName: report.profile_name || patternNameFor(primaryType, secondaryType),
              blendLabel: report.style_code || `${primaryType} + ${secondaryType}`,
              completedAt: report.generated_at || new Date().toISOString(),
              attemptId: report.attempt_id || report.id || undefined,
            });
          }
        }

        if (tRes && tRes.ok) {
          const tData = await tRes.json();
          if (tData.success && tData.data?.profiles) setTeamProfiles(tData.data.profiles);
        }
      } catch (error) {
        console.error("Error fetching assessment data:", error);
      } finally {
        setLoadingQuestions(false);
      }
    };
    fetchAssessmentData();
  }, []);

  const fetchMemberReport = async (attemptId: number | string, memberName?: string) => {
    try {
      setLoadingReport(true);
      const member = teamProfiles.find(
        (m) => String(m.attempt_id) === String(attemptId) || String(m.encrypted_attempt_id) === String(attemptId)
      );
      setSelectedMemberName(memberName || member?.name || "Team Member");
      setSelectedMemberEmail(member?.email || "");

      const token = getToken();
      const baseUrl = (getBaseUrl() || "https://fm-uat-api.lockated.com").replace(/\/$/, "");
      const response = await fetch(`${baseUrl}/disc_assessments/${attemptId}/report`, {
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      const data = await response.json();
      if (data.success && data.data?.report) {
        const report = data.data.report;
        const totalAnswers = report.total_answers || 15;
        const rawCounts = { D: report.scores?.D || 0, I: report.scores?.I || 0, S: report.scores?.S || 0, C: report.scores?.C || 0 };
        const toScore = (n: number) => Math.max(1, Math.min(7, Math.round(1 + (n / totalAnswers) * 6)));
        const primaryType = report.primary_type as DiscLetter;
        const secondaryType = (report.secondary_type || report.primary_type) as DiscLetter;
        setSelectedMemberReport({
          counts: rawCounts,
          scores: { D: toScore(rawCounts.D), I: toScore(rawCounts.I), S: toScore(rawCounts.S), C: toScore(rawCounts.C) },
          primary: primaryType,
          secondary: secondaryType,
          patternName: report.profile_name || patternNameFor(primaryType, secondaryType),
          blendLabel: report.style_code || `${primaryType} + ${secondaryType}`,
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

  const handleNext = () => { if (currentQuestion < questions.length - 1) setCurrentQuestion(currentQuestion + 1); };
  const handlePrevious = () => { if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1); };

  const handleFinish = async () => {
    const allAnswered = questions.every((_, i) => answers[i] !== undefined && answers[i] !== null);
    if (!allAnswered || isSubmitting) return;
    try {
      setIsSubmitting(true);
      const token = getToken();
      const baseUrl = (getBaseUrl() || "https://fm-uat-api.lockated.com").replace(/\/$/, "");

      const formattedAnswers = answers.map((answerIndex, qIndex) => ({
        question_id: questions[qIndex].id,
        dimension: questions[qIndex].options[answerIndex].dimension,
      }));

      const existingId = savedProfile?.attemptId;
      const url = existingId ? `${baseUrl}/disc_assessments/${existingId}` : `${baseUrl}/disc_assessments/submit`;
      const method = existingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ answers: formattedAnswers }),
      });

      const data = await response.json();
      let result: DiscProfileResult;

      if (data.success && data.data?.report) {
        const report = data.data.report;
        const totalAnswers = report.total_answers || questions.length;
        const rawCounts = { D: report.scores?.D || 0, I: report.scores?.I || 0, S: report.scores?.S || 0, C: report.scores?.C || 0 };
        const toScore = (n: number) => Math.max(1, Math.min(7, Math.round(1 + (n / totalAnswers) * 6)));
        const primaryType = report.primary_type as DiscLetter;
        const secondaryType = (report.secondary_type || report.primary_type) as DiscLetter;
        result = {
          counts: rawCounts,
          scores: { D: toScore(rawCounts.D), I: toScore(rawCounts.I), S: toScore(rawCounts.S), C: toScore(rawCounts.C) },
          primary: primaryType,
          secondary: secondaryType,
          patternName: report.profile_name || patternNameFor(primaryType, secondaryType),
          blendLabel: report.style_code || `${primaryType} + ${secondaryType}`,
          completedAt: report.generated_at || new Date().toISOString(),
          attemptId: report.attempt_id || report.id || existingId,
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
    <div className="w-full bg-[#F6F1EE] px-4 py-6 sm:px-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Page Header */}
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#DA7756] shadow-sm">
              <Brain className="h-6 w-6 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">DISC Personality Assessment</h1>
              <p className="mt-0.5 text-sm text-neutral-500">Discover your DISC profile and understand your team</p>
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
          <TabsList className="grid h-auto w-full grid-cols-1 gap-1 rounded-2xl border border-[rgba(218,119,86,0.18)] bg-[#FFF9F6] p-2 sm:grid-cols-3 shadow-sm">
            {[
              { value: "report", icon: FileCode2, label: "Get Your Report" },
              { value: "profile", icon: Eye, label: "Your Profile" },
              { value: "team", icon: Users, label: "Team Profiles" },
            ].map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className={cn(
                  "gap-2 rounded-xl py-2.5 text-sm font-semibold text-neutral-500 transition-all",
                  "data-[state=active]:bg-[#DA7756] data-[state=active]:text-white data-[state=active]:shadow-sm",
                  "data-[state=inactive]:hover:bg-[rgba(218,119,86,0.08)] data-[state=inactive]:hover:text-neutral-900"
                )}
              >
                <t.icon className="h-4 w-4 shrink-0" />
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ── Get Your Report Tab ── */}
          <TabsContent value="report" className="mt-5 space-y-5 focus-visible:outline-none">
            {assessmentStarted ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-neutral-500">Answer all questions to discover your profile</p>
                  <button type="button" onClick={() => setAssessmentStarted(false)} className="px-4 py-2 text-sm font-semibold text-[#CE8261] border border-[rgba(218,119,86,0.30)] bg-white rounded-xl hover:bg-[#FFF9F6] transition-colors">
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
                {/* Already has profile banner */}
                {savedProfile && (
                  <div style={{ display: "flex", alignItems: "center", gap: 12, background: "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)", borderRadius: 14, padding: "14px 18px" }}>
                    <CheckCircle2 style={{ width: 20, height: 20, color: "#ffffff", flexShrink: 0 }} strokeWidth={2} />
                    <p style={{ fontSize: 14, fontWeight: 500, color: "#ffffff", margin: 0, lineHeight: 1.4 }}>
                      ✓ You already have a DISC profile from{" "}
                      <strong>{new Date(savedProfile.completedAt).toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" })}</strong>
                      . Retake to update it.{" "}
                      <button type="button" onClick={() => setMainTab("profile")} style={{ background: "none", border: "none", color: "#ffffff", fontWeight: 700, cursor: "pointer", textDecoration: "underline", fontSize: 14, padding: 0 }}>
                        View your profile →
                      </button>
                    </p>
                  </div>
                )}

                {/* ── What is DISC accordion — warm brand colors ── */}
                <Accordion type="single" collapsible>
                  <AccordionItem value="what-is" className="overflow-hidden rounded-2xl border shadow-sm" style={{ background: "#FFF9F6", borderColor: "rgba(218,119,86,0.25)" }}>
                    <AccordionTrigger className="px-5 py-4 text-left hover:no-underline hover:bg-[rgba(218,119,86,0.04)] [&>svg]:text-[#CE8261] [&>svg]:h-5 [&>svg]:w-5">
                      <span className="flex items-center gap-3">
                        <Brain className="h-5 w-5 shrink-0 text-[#DA7756]" />
                        <span className="text-base font-bold text-neutral-900">What is DISC & How Will It Benefit You?</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-5 pt-0">
                      <p className="text-sm leading-relaxed text-neutral-600">
                        DISC is a behavioural assessment tool that measures four dimensions of personality — Dominance, Influence, Steadiness, and Conscientiousness. Taking this assessment will help you understand your natural working style, communication preferences, and how to collaborate more effectively with others.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* ── What you'll discover accordion — warm brand colors ── */}
                <Accordion type="single" collapsible>
                  <AccordionItem value="discover" className="overflow-hidden rounded-2xl border shadow-sm" style={{ background: "#FFF9F6", borderColor: "rgba(218,119,86,0.25)" }}>
                    <AccordionTrigger className="px-5 py-4 text-left hover:no-underline hover:bg-[rgba(218,119,86,0.04)] [&>svg]:text-[#CE8261] [&>svg]:h-5 [&>svg]:w-5">
                      <span className="flex items-center gap-3">
                        <Sparkles className="h-5 w-5 shrink-0 text-[#DA7756]" />
                        <span className="text-base font-bold text-neutral-900">What you'll discover</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-0">
                      <div className="space-y-2">
                        {[
                          { text: "Your primary and secondary DISC personality types", color: "#e11d48" },
                          { text: "Your key strengths and growth areas", color: "#f59e0b" },
                          { text: "How you communicate and interact with others", color: "#3b82f6" },
                          { text: "Ideal work environments and roles for you", color: "#10b981" },
                          { text: "Your specific DISC profile with personalised recommendations", color: "#DA7756" },
                        ].map((item, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(218,119,86,0.06)", borderRadius: 10, padding: "12px 14px", borderLeft: `3px solid ${item.color}` }}>
                            <span style={{ width: 8, height: 8, minWidth: 8, borderRadius: "50%", background: item.color, display: "inline-block", flexShrink: 0 }} />
                            <span style={{ fontSize: 13, fontWeight: 500, color: "#374151", lineHeight: 1.4 }}>{item.text}</span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <button
                  type="button"
                  className={cn("w-full rounded-2xl bg-[#DA7756] py-4 text-base font-extrabold text-white shadow-sm transition-all hover:bg-[#BC6B4A] hover:scale-[1.01] active:scale-[0.99]", (loadingQuestions || questions.length === 0) && "opacity-60 cursor-not-allowed")}
                  onClick={handleStartAssessment}
                  disabled={loadingQuestions || questions.length === 0}
                >
                  {loadingQuestions
                    ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Loading assessment...</span>
                    : "🚀 Start Assessment"}
                </button>

                {/* ── Watch: What is DISC? Video — warm brand colors ── */}
                <div style={{ background: "#FFF9F6", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(218,119,86,0.25)" }}>
                  <div style={{ padding: "16px 20px 8px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      {/* Proper YouTube pill logo */}
                      <svg viewBox="0 0 90 20" width="72" height="16" xmlns="http://www.w3.org/2000/svg" aria-label="YouTube">
                        <rect width="90" height="20" rx="4" fill="#FF0000" />
                        <path d="M12 5.5l-4.5 2.5v5l4.5 2.5V5.5z" fill="white" />
                        <rect x="7.5" y="5.5" width="2" height="9" fill="white" />
                        <text x="17" y="14" fill="white" fontSize="9" fontFamily="Arial,Helvetica,sans-serif" fontWeight="bold">YouTube</text>
                      </svg>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "#1f2937" }}>Watch: What is DISC?</span>
                    </div>
                    <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>A quick overview of the DISC model and how it applies to you</p>
                  </div>
                  <div style={{ padding: "12px 16px 16px 16px" }}>
                    <a
                      href="https://youtu.be/C3T7LNHOaow"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: "block", position: "relative", borderRadius: 12, overflow: "hidden", cursor: "pointer" }}
                    >
                      <img
                        src="https://img.youtube.com/vi/C3T7LNHOaow/maxresdefault.jpg"
                        alt="What is DISC? — Watch on YouTube"
                        style={{ width: "100%", display: "block", aspectRatio: "16/9", objectFit: "cover" }}
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://img.youtube.com/vi/C3T7LNHOaow/hqdefault.jpg"; }}
                      />
                      {/* Dark overlay + centred play button */}
                      <div
                        style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.30)", transition: "background 0.2s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.45)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.30)")}
                      >
                        {/* Official YouTube pill logo as play button */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                          <svg viewBox="0 0 68 48" width="68" height="48" xmlns="http://www.w3.org/2000/svg" aria-label="Play on YouTube">
                            <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#FF0000" />
                            <path d="M45 24L27 14v20" fill="white" />
                          </svg>
                        </div>
                      </div>
                      {/* Bottom-right YouTube badge */}
                      <div style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(0,0,0,0.80)", borderRadius: 6, padding: "4px 10px", display: "flex", alignItems: "center", gap: 6 }}>
                        <svg viewBox="0 0 68 48" width="14" height="10" xmlns="http://www.w3.org/2000/svg">
                          <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#FF0000" />
                          <path d="M45 24L27 14v20" fill="white" />
                        </svg>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#ffffff" }}>Watch on YouTube</span>
                      </div>
                    </a>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {/* ── Your Profile Tab ── */}
          <TabsContent value="profile" className="mt-5 focus-visible:outline-none">
            {loadingQuestions ? (
              <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-[rgba(218,119,86,0.18)] bg-[#FFF9F6]">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-10 w-10 animate-spin text-[#DA7756]" />
                  <p className="text-sm font-medium text-neutral-600">Loading your profile...</p>
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
                <Brain className="h-14 w-14 text-[#DA7756]/40" strokeWidth={1.5} />
                <h2 className="mt-5 text-xl font-extrabold text-neutral-800">No profile yet</h2>
                <p className="mt-2 text-sm text-neutral-500">You haven't completed a DISC assessment yet.</p>
                <button type="button" onClick={() => { setMainTab("report"); handleStartAssessment(); }} className="mt-8 rounded-2xl bg-[#DA7756] px-8 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#BC6B4A]">
                  Start Assessment
                </button>
              </div>
            )}
          </TabsContent>

          {/* ── Team Profiles Tab ── */}
          <TabsContent value="team" className="mt-5 focus-visible:outline-none">
            {selectedMemberReport ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[rgba(218,119,86,0.18)] pb-4">
                  <button onClick={() => setSelectedMemberReport(null)} className="flex items-center gap-2 text-sm font-semibold text-[#CE8261] hover:text-[#BC6B4A] border border-[rgba(218,119,86,0.25)] bg-white rounded-xl px-3 py-2 transition-colors shadow-sm">
                    <ArrowLeft className="h-4 w-4" /> Back to Team
                  </button>
                  <div className="flex items-center gap-2 font-bold text-neutral-700 text-sm">
                    <Users className="h-4 w-4 text-[#DA7756]" />
                    {selectedMemberName}
                  </div>
                </div>
                {loadingReport ? (
                  <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-[rgba(218,119,86,0.18)] bg-[#FFF9F6]">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-10 w-10 animate-spin text-[#DA7756]" />
                      <p className="text-sm font-semibold text-neutral-600">Loading Report...</p>
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