import React, { useMemo, useState } from "react";
import {
  BarChart3,
  BookOpen,
  Brain,
  Diamond,
  Eye,
  FileVideo,
  Filter,
  Search,
  Square,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
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
  DiscAssessmentResultsModal,
  buildDiscProfileFromTableRow,
} from "@/components/DiscAssessmentResultsModal";
import type { DiscProfileResult } from "@/components/DiscAssessmentResultsModal";

type DiscTab = "dashboard" | "teams" | "learn";

type RowTone = "d" | "i" | "s" | "c";

type DiscProfileRow = {
  id: string;
  name: string;
  department: string;
  discScore: string;
  style: string;
  styleTone: RowTone;
  profileName: string;
  date: string;
  rowBgClass: string;
  styleTextClass: string;
};

const DISC_SUMMARY = [
  {
    key: "d",
    label: "Dominance",
    count: 1,
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
    count: 1,
    bg: "bg-[#f0fdf4]",
    border: "border-[#22c55e]/80",
    text: "text-[#22c55e]",
  },
  {
    key: "c",
    label: "Conscientiousness",
    count: 1,
    bg: "bg-[#eff6ff]",
    border: "border-[#3b82f6]/80",
    text: "text-[#3b82f6]",
  },
] as const;

const PROFILE_CHIPS = [
  { name: "Objective Thinker", count: 1 },
  { name: "Specialist", count: 1 },
  { name: "Creative", count: 1 },
] as const;

const MOCK_ROWS: DiscProfileRow[] = [
  {
    id: "1",
    name: "Alex Morgan",
    department: "Engineering",
    discScore: "2117",
    style: "C/D",
    styleTone: "c",
    profileName: "Objective Thinker",
    date: "Mar 12, 2024",
    rowBgClass: "bg-[#eff6ff]/90",
    styleTextClass: "text-[#3b82f6] font-semibold",
  },
  {
    id: "2",
    name: "Jordan Lee",
    department: "Human Resources",
    discScore: "4274",
    style: "S/D",
    styleTone: "s",
    profileName: "Specialist",
    date: "Mar 10, 2024",
    rowBgClass: "bg-[#f0fdf4]/90",
    styleTextClass: "text-[#22c55e] font-semibold",
  },
  {
    id: "3",
    name: "Sam Rivera",
    department: "Marketing",
    discScore: "7415",
    style: "D/C",
    styleTone: "d",
    profileName: "Creative",
    date: "Mar 8, 2024",
    rowBgClass: "bg-[#fef2f2]/90",
    styleTextClass: "text-[#ef4444] font-semibold",
  },
  {
    id: "4",
    name: "Taylor Chen",
    department: "Sales",
    discScore: "3652",
    style: "I/S",
    styleTone: "i",
    profileName: "Influencer",
    date: "Mar 5, 2024",
    rowBgClass: "bg-[#fffbeb]/90",
    styleTextClass: "text-[#f59e0b] font-semibold",
  },
  {
    id: "5",
    name: "Riley Patel",
    department: "QA",
    discScore: "1528",
    style: "C/S",
    styleTone: "c",
    profileName: "Perfectionist",
    date: "Mar 1, 2024",
    rowBgClass: "bg-[#eff6ff]/90",
    styleTextClass: "text-[#3b82f6] font-semibold",
  },
];

const DIGIT_COLORS = [
  "text-[#ef4444]",
  "text-[#f59e0b]",
  "text-[#22c55e]",
  "text-[#3b82f6]",
];

function DiscScoreDigits({ score }: { score: string }) {
  const digits = score.replace(/\D/g, "").slice(0, 4).padStart(4, "0");
  return (
    <span className="inline-flex font-mono text-sm font-semibold tabular-nums">
      {digits.split("").map((d, i) => (
        <span key={i} className={DIGIT_COLORS[i] ?? "text-neutral-800"}>
          {d}
        </span>
      ))}
    </span>
  );
}

/** YouTube embed — replace ID if you need a different video/thumbnail */
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

/** Profile icon + selected D/I/S/C tab — same palette per type */
const LEARN_PROFILE_ICON_BY_DISC: Record<
  LearnDiscKey,
  { container: string; icon: string; tabSelected: string }
> = {
  d: {
    container: "border-[#fecaca] bg-[#fef2f2]",
    icon: "text-[#dc2626]",
    tabSelected:
      "border-[#fecaca] bg-[#fef2f2] text-[#dc2626] shadow-sm",
  },
  i: {
    container: "border-amber-200 bg-[#fffbeb]",
    icon: "text-[#d97706]",
    tabSelected:
      "border-amber-200 bg-[#fffbeb] text-[#d97706] shadow-sm",
  },
  s: {
    container: "border-emerald-200 bg-[#f0fdf4]",
    icon: "text-[#16a34a]",
    tabSelected:
      "border-emerald-200 bg-[#f0fdf4] text-[#16a34a] shadow-sm",
  },
  c: {
    container: "border-[#93c5fd] bg-[#eff6ff]",
    icon: "text-[#3b82f6]",
    tabSelected:
      "border-[#93c5fd] bg-[#eff6ff] text-[#2563eb] shadow-sm",
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

const LEARN_SUB_CONTENT: Record<
  LearnDiscKey,
  Record<LearnSubTab, string[]>
> = {
  d: {
    traits: [],
    communication: [
      "Prefer clear, concise updates; avoid fluff.",
      "State the goal first, then supporting facts.",
      "Be direct when giving feedback; don’t take silence as disagreement.",
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
    roles: [
      "Sales, marketing, client-facing, and culture-building roles.",
    ],
  },
  s: {
    traits: [],
    communication: [
      "Prefer warm, steady tone; avoid abrupt changes.",
      "Give context before asking for big shifts.",
      "Allow time to process; don’t force instant decisions.",
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
    roles: [
      "Support, HR, coaching, and service delivery roles.",
    ],
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
    roles: [
      "Finance, QA, compliance, engineering, and systems roles.",
    ],
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
    body: "People-oriented motivation and harmony. I energizes relationships; S sustains trust and care. Great for culture—pair with clear structure so execution doesn’t slip.",
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
      <Card className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-sm">
        <div className="border-b border-neutral-100 p-4 sm:p-6">
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
        <div className="bg-neutral-900/5 p-3 sm:p-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-neutral-200 bg-black shadow-inner">
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

      <Card className="rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-wrap items-start gap-3 sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#DA7756] bg-white shadow-sm">
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
                  : "border-neutral-200 bg-neutral-100/90 text-neutral-600 hover:bg-neutral-200/80 hover:text-neutral-900"
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

      <Card className="rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-sm sm:p-6">
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

        <div className="mb-5 flex flex-wrap gap-1 rounded-xl bg-neutral-100/90 p-1.5">
          {LEARN_SUB_TABS.map((st) => (
            <button
              key={st.key}
              type="button"
              onClick={() => setSubTab(st.key)}
              className={cn(
                "flex-1 min-w-[5.5rem] rounded-lg px-2 py-2.5 text-center text-xs font-medium transition-all sm:min-w-0 sm:text-sm",
                subTab === st.key
                  ? "bg-white font-semibold text-neutral-900 shadow-sm"
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

      <Card className="rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-sm sm:p-6">
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
  /** Counts used for bar fill (0–10 scale for display) */
  discDistribution: { d: number; i: number; s: number; c: number };
  averageScores: { d: number; i: number; s: number; c: number };
  departmentHead?: string;
};

const MOCK_DEPARTMENTS: DepartmentTeam[] = [
  {
    id: "d1",
    name: "Human Resources",
    assessmentsCompleted: 0,
    discDistribution: { d: 0, i: 0, s: 0, c: 0 },
    averageScores: { d: 0, i: 0, s: 0, c: 0 },
    departmentHead: "Paloma Tushirwala",
  },
  {
    id: "d2",
    name: "Front End",
    assessmentsCompleted: 0,
    discDistribution: { d: 0, i: 0, s: 0, c: 0 },
    averageScores: { d: 0, i: 0, s: 0, c: 0 },
    departmentHead: "Akshay Shinde",
  },
  {
    id: "d3",
    name: "Design",
    assessmentsCompleted: 0,
    discDistribution: { d: 0, i: 0, s: 0, c: 0 },
    averageScores: { d: 0, i: 0, s: 0, c: 0 },
  },
  {
    id: "d4",
    name: "Engineering",
    assessmentsCompleted: 12,
    discDistribution: { d: 4, i: 3, s: 2, c: 3 },
    averageScores: { d: 72, i: 65, s: 58, c: 70 },
    departmentHead: "Mahendra Lungare",
  },
  {
    id: "d5",
    name: "Client Servicing",
    assessmentsCompleted: 5,
    discDistribution: { d: 1, i: 2, s: 1, c: 1 },
    averageScores: { d: 45, i: 62, s: 55, c: 48 },
    departmentHead: "Priya Sharma",
  },
  {
    id: "d6",
    name: "Accounts",
    assessmentsCompleted: 3,
    discDistribution: { d: 0, i: 1, s: 1, c: 1 },
    averageScores: { d: 38, i: 52, s: 61, c: 68 },
  },
];

const DISC_BAR_META = [
  {
    key: "d" as const,
    label: "D",
    fill: "bg-[#ef4444]",
  },
  {
    key: "i" as const,
    label: "I",
    fill: "bg-[#f59e0b]",
  },
  {
    key: "s" as const,
    label: "S",
    fill: "bg-[#22c55e]",
  },
  {
    key: "c" as const,
    label: "C",
    fill: "bg-[#3b82f6]",
  },
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
        "w-full rounded-2xl border border-neutral-200/90 bg-white p-4 text-left shadow-sm transition-all sm:p-5",
        "hover:border-[#DA7756]/35 hover:shadow-md"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#DA7756] bg-white shadow-sm">
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
          {dept.assessmentsCompleted === 1
            ? "assessment"
            : "assessments"}{" "}
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
                className={cn("h-2.5 w-2.5 shrink-0 rounded-full", dot.className)}
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

      <div className="mt-4 rounded-xl border border-neutral-200/80 bg-[#f6f4ee]/80 px-3 py-2.5">
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

  const filtered = useMemo(() => {
    const q = deptSearch.trim().toLowerCase();
    if (!q) return MOCK_DEPARTMENTS;
    return MOCK_DEPARTMENTS.filter((d) =>
      d.name.toLowerCase().includes(q)
    );
  }, [deptSearch]);

  return (
    <Card className="rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-sm sm:p-6">
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

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-200 bg-[#f6f4ee]/50 py-10 text-center">
          <p className="text-sm text-neutral-500">
            No departments match your search.
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
  const [profilePreview, setProfilePreview] = useState<DiscProfileResult | null>(
    null
  );

  const toggleSort = (
    key: typeof sortKey
  ) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filteredRows = useMemo(() => {
    let rows = [...MOCK_ROWS];
    const q = search.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q) ||
          r.profileName.toLowerCase().includes(q)
      );
    }
    if (profileFilter) {
      rows = rows.filter((r) => r.profileName === profileFilter);
    }
    if (typeFilter !== "all") {
      rows = rows.filter((r) => r.styleTone === typeFilter);
    }
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
          cmp = Number(a.discScore) - Number(b.discScore);
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
        default:
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [search, profileFilter, typeFilter, sortKey, sortDir]);

  const visibleRows = showAllRows ? filteredRows : filteredRows.slice(0, 3);
  const totalVisible = filteredRows.length;
  const allSelected =
    visibleRows.length > 0 &&
    visibleRows.every((r) => selected[r.id]);

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

  const SortHeader = ({
    label,
    k,
  }: {
    label: string;
    k: typeof sortKey;
  }) => (
    <button
      type="button"
      onClick={() => toggleSort(k)}
      className="flex w-full items-center justify-start gap-1 text-left font-semibold text-neutral-800 hover:text-[#DA7756]"
    >
      {label}
      {sortKey === k && (
        <span className="text-xs text-neutral-400"
          aria-hidden
        >
          {sortDir === "asc" ? "↑" : "↓"}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#f6f4ee] px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#DA7756] bg-white shadow-sm">
              <Brain className="h-6 w-6 text-[#DA7756]" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
                DISC Assessment Management
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-neutral-500 sm:text-base">
                Manage DISC profiles, team analytics, and behavioral insights
                across your organization.
              </p>
            </div>
          </div>
        </header>

        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as DiscTab)}
          className="w-full"
        >
          <TabsList
            className={cn(
              "grid h-auto w-full grid-cols-1 gap-1 rounded-xl border border-neutral-200/80 bg-neutral-100/90 p-2 sm:grid-cols-3"
            )}
            aria-label="DISC sections"
          >
            <TabsTrigger
              value="dashboard"
              className={cn(
                "gap-2 rounded-lg py-3 text-sm font-medium text-neutral-600 sm:py-3.5",
                "data-[state=active]:bg-[#DA7756]/10 data-[state=active]:text-neutral-900",
                "data-[state=active]:shadow-sm data-[state=active]:font-semibold",
                "data-[state=inactive]:transition-colors data-[state=inactive]:hover:bg-neutral-200/80 data-[state=inactive]:hover:text-neutral-900"
              )}
            >
              <Brain
                className="h-[18px] w-[18px] shrink-0 sm:h-5 sm:w-5"
                strokeWidth={2}
              />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="teams"
              className={cn(
                "gap-2 rounded-lg py-3 text-sm font-medium text-neutral-600 sm:py-3.5",
                "data-[state=active]:bg-[#DA7756]/10 data-[state=active]:text-neutral-900",
                "data-[state=active]:shadow-sm data-[state=active]:font-semibold",
                "data-[state=inactive]:transition-colors data-[state=inactive]:hover:bg-neutral-200/80 data-[state=inactive]:hover:text-neutral-900"
              )}
            >
              <BarChart3
                className="h-[18px] w-[18px] shrink-0 sm:h-5 sm:w-5"
                strokeWidth={2}
              />
              Teams
            </TabsTrigger>
            <TabsTrigger
              value="learn"
              className={cn(
                "gap-2 rounded-lg py-3 text-sm font-medium text-neutral-600 sm:py-3.5",
                "data-[state=active]:bg-[#DA7756]/10 data-[state=active]:text-neutral-900",
                "data-[state=active]:shadow-sm data-[state=active]:font-semibold",
                "data-[state=inactive]:transition-colors data-[state=inactive]:hover:bg-neutral-200/80 data-[state=inactive]:hover:text-neutral-900"
              )}
            >
              <BookOpen
                className="h-[18px] w-[18px] shrink-0 sm:h-5 sm:w-5"
                strokeWidth={2}
              />
              Learn
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {tab === "teams" && <TeamsTabContent />}
        {tab === "learn" && <LearnTabContent />}

        {tab === "dashboard" && (
          <>
            <Card className="rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-4 flex flex-wrap items-start gap-2">
                <TrendingUp
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#DA7756]"
                  strokeWidth={2}
                />
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">
                    DISC Type Distribution
                  </h2>
                  <p className="text-sm text-neutral-500">
                    Primary types across latest assessments (one per person)
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {DISC_SUMMARY.map((d) => (
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
                        "text-4xl font-bold tabular-nums leading-none",
                        d.text
                      )}
                    >
                      {d.count}
                    </span>
                    <span className="mt-2 text-sm font-semibold text-neutral-800">
                      {d.label}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-4 flex flex-wrap items-start gap-2">
                <Users
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#DA7756]"
                  strokeWidth={2}
                />
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">
                    Profile Name Distribution
                  </h2>
                  <p className="text-sm text-neutral-500">
                    Click a profile to filter the table below
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setProfileFilter(null)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                    profileFilter === null
                      ? "border-[#DA7756] bg-[#DA7756]/10 text-[#C72030]"
                      : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                  )}
                >
                  All
                </button>
                {PROFILE_CHIPS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() =>
                      setProfileFilter((prev) =>
                        prev === p.name ? null : p.name
                      )
                    }
                    className={cn(
                      "rounded-lg border px-3 py-2 text-sm transition-colors",
                      profileFilter === p.name
                        ? "border-[#DA7756] bg-[#DA7756]/10 font-semibold text-[#C72030]"
                        : "border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50"
                    )}
                  >
                    {p.name}{" "}
                    <span className="font-bold tabular-nums">{p.count}</span>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex flex-wrap items-start gap-2">
                  <Users
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#DA7756]"
                    strokeWidth={2}
                  />
                  <div>
                    <h2 className="text-lg font-bold text-neutral-900">
                      DISC Profiles
                    </h2>
                    <p className="text-sm text-neutral-500">
                      Latest per person
                      {filteredRows.length > visibleRows.length
                        ? ` (${visibleRows.length} of ${filteredRows.length} shown)`
                        : ` (${filteredRows.length} profile${
                            filteredRows.length !== 1 ? "s" : ""
                          })`}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-800 shadow-sm hover:bg-neutral-50"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAllRows((s) => !s)}
                    className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-800 shadow-sm hover:bg-neutral-50"
                  >
                    {showAllRows
                      ? "Show less"
                      : `Show All (${MOCK_ROWS.length})`}
                  </button>
                </div>
              </div>

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
                    className="h-10 w-full rounded-xl border border-neutral-200 bg-white py-2 pl-10 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[#DA7756]/25"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-10 w-full rounded-xl border-neutral-200 bg-white sm:w-[180px]">
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

              <div className="overflow-x-auto rounded-xl border border-neutral-200/80">
                <table className="w-full min-w-[880px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50/90">
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
                      <th className="px-3 py-3 text-center">Actions</th>
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
                        <td className="px-3 py-3 font-medium text-neutral-900">
                          {row.name}
                        </td>
                        <td className="px-3 py-3 text-neutral-700">
                          {row.department}
                        </td>
                        <td className="px-3 py-3">
                          <DiscScoreDigits score={row.discScore} />
                        </td>
                        <td className={cn("px-3 py-3", row.styleTextClass)}>
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
                            onClick={() =>
                              setProfilePreview(
                                buildDiscProfileFromTableRow(
                                  row.discScore,
                                  row.profileName,
                                  row.style
                                )
                              )
                            }
                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 shadow-sm hover:bg-neutral-50"
                            aria-label={`View ${row.name}`}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {visibleRows.length === 0 && (
                  <p className="text-center py-8 text-sm text-neutral-500">
                    No profiles match your filters.
                  </p>
                )}
              </div>
            </Card>
          </>
        )}
      </div>

      {profilePreview && (
        <DiscAssessmentResultsModal
          result={profilePreview}
          onClose={() => setProfilePreview(null)}
          onViewProfile={() => {
            setProfilePreview(null);
            setTab("learn");
          }}
        />
      )}
    </div>
  );
};

export default DiscReport;
