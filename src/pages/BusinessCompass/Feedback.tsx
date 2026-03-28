import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  ArrowUp,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronRight,
  Inbox,
  Lightbulb,
  MessageSquare,
  Pencil,
  Search,
  Send,
  Star,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import { RootState } from "@/store/store";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AdminViewEmulation } from "@/components/AdminViewEmulation";

type SummaryStat = {
  label: string;
  value: string | number;
  icon: React.ElementType;
  bgClass: string;
  iconClass: string;
};

const summaryStats: SummaryStat[] = [
  {
    label: "Received",
    value: 0,
    icon: Inbox,
    bgClass: "bg-sky-100/90",
    iconClass: "text-sky-600",
  },
  {
    label: "Given",
    value: 6,
    icon: Send,
    bgClass: "bg-[#E3F4E8]",
    iconClass: "text-[#2E7D32]",
  },
  {
    label: "Unread",
    value: 0,
    icon: MessageSquare,
    bgClass: "bg-orange-100/90",
    iconClass: "text-orange-600",
  },
  {
    label: "Avg Rating",
    value: 0,
    icon: TrendingUp,
    bgClass: "bg-violet-100/90",
    iconClass: "text-violet-600",
  },
  {
    label: "Feedback Points",
    value: 0,
    icon: ArrowUp,
    bgClass: "bg-teal-100/80",
    iconClass: "text-teal-600",
  },
];

function FeedbackEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <MessageSquare
        className="mb-4 h-16 w-16 text-neutral-300"
        strokeWidth={1.25}
      />
      <h3 className="text-lg font-semibold text-neutral-900">No Feedback Yet</h3>
      <p className="mt-2 max-w-sm text-sm text-neutral-500">
        You haven&apos;t received any feedback from your team members
      </p>
    </div>
  );
}

type GivenFeedbackItem = {
  id: string;
  recipientName: string;
  date: string;
  rating: number;
  status: "unread" | "read";
  showActions?: boolean;
  detailPreview?: string;
};

const MOCK_GIVEN_FEEDBACK: GivenFeedbackItem[] = [
  {
    id: "1",
    recipientName: "Bilal Shaikh",
    date: "26 Mar 2026",
    rating: 4,
    status: "unread",
    showActions: true,
    detailPreview:
      "Strong collaboration on the sprint goals. Consider syncing earlier on blockers next time.",
  },
  {
    id: "2",
    recipientName: "Sarah Khan",
    date: "24 Mar 2026",
    rating: 5,
    status: "unread",
    showActions: true,
    detailPreview:
      "Excellent documentation and clear handoffs. Keep up the proactive communication.",
  },
  {
    id: "3",
    recipientName: "James Lee",
    date: "20 Mar 2026",
    rating: 3,
    status: "read",
    detailPreview: "Good progress on deliverables. Room to improve timeline estimates.",
  },
  {
    id: "4",
    recipientName: "Priya Sharma",
    date: "18 Mar 2026",
    rating: 4,
    status: "read",
  },
];

function StarRatingRow({ value }: { value: number }) {
  return (
    <div className="flex shrink-0 gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4 sm:h-[18px] sm:w-[18px]",
            i <= value
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-neutral-300"
          )}
          strokeWidth={i <= value ? 0 : 1.5}
        />
      ))}
    </div>
  );
}

function GivenFeedbackList({
  onGiveFeedbackClick,
}: {
  onGiveFeedbackClick: () => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  const filtered = MOCK_GIVEN_FEEDBACK.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.recipientName.toLowerCase().includes(q) ||
      (item.detailPreview?.toLowerCase().includes(q) ?? false);
    const matchesRating =
      ratingFilter === "all" || String(item.rating) === ratingFilter;
    return matchesSearch && matchesRating;
  });

  return (
    <div className="space-y-4 px-4 py-4 sm:px-6 sm:py-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch sm:justify-between sm:gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
              aria-hidden
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or content..."
              className="h-10 w-full rounded-xl border border-neutral-200 bg-white py-2 pl-10 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[#C72030]/25"
            />
          </div>
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="h-10 w-full rounded-xl border-neutral-200 bg-white sm:w-[160px] sm:shrink-0">
              <SelectValue placeholder="All Ratings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 stars</SelectItem>
              <SelectItem value="4">4 stars</SelectItem>
              <SelectItem value="3">3 stars</SelectItem>
              <SelectItem value="2">2 stars</SelectItem>
              <SelectItem value="1">1 star</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <button
          type="button"
          onClick={onGiveFeedbackClick}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#DA7756] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#DA7756]/85 sm:px-5"
        >
          <Send className="h-4 w-4 text-white" strokeWidth={2} />
          Give Feedback
        </button>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-neutral-500">
            No feedback matches your search.
          </p>
        ) : (
          filtered.map((item) => {
            const expanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className={cn(
                  "rounded-xl border border-neutral-200/90 bg-[#FFFDF0] p-4 shadow-sm",
                  "transition-shadow hover:shadow-md"
                )}
              >
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2E7D32] sm:h-12 sm:w-12">
                    <Send className="h-5 w-5 text-white" strokeWidth={2} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() =>
                        setExpandedId(expanded ? null : item.id)
                      }
                    >
                      <p className="font-semibold text-neutral-900">
                        To: {item.recipientName}
                      </p>
                      <p className="text-sm text-neutral-600">{item.date}</p>
                      <p className="mt-2 text-xs text-neutral-400">
                        Click to expand feedback details
                      </p>
                    </button>
                    {expanded && item.detailPreview && (
                      <p className="mt-3 border-l-2 border-[#2E7D32]/40 pl-3 text-sm leading-relaxed text-neutral-700">
                        {item.detailPreview}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <StarRatingRow value={item.rating} />
                    <span
                      className={cn(
                        "rounded-md px-2 py-0.5 text-xs font-medium",
                        item.status === "unread"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-neutral-200/80 text-neutral-600"
                      )}
                    >
                      {item.status === "unread" ? "Unread" : "Read"}
                    </span>
                    {item.showActions && (
                      <div className="mt-1 flex flex-wrap justify-end gap-2">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-sm hover:bg-neutral-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#DA7756] px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-[#DA7756]/85"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    )}
                    <button
                      type="button"
                      className="mt-1 rounded-md p-1 text-neutral-400 hover:bg-black/5 hover:text-neutral-600"
                      aria-expanded={expanded}
                      aria-label={expanded ? "Collapse" : "Expand"}
                      onClick={() =>
                        setExpandedId(expanded ? null : item.id)
                      }
                    >
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 transition-transform",
                          expanded && "rotate-180"
                        )}
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const TEAM_MEMBERS = [
  { value: "bilal-shaikh", label: "Bilal Shaikh" },
  { value: "sarah-khan", label: "Sarah Khan" },
  { value: "james-lee", label: "James Lee" },
  { value: "priya-sharma", label: "Priya Sharma" },
];

function formatDMY(d: Date) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

const RATING_SEGMENTS = [
  { stars: 1, pts: "-10 pts", bg: "bg-red-500", text: "text-white" },
  { stars: 2, pts: "-5 pts", bg: "bg-orange-400", text: "text-white" },
  { stars: 3, pts: "0 pts", bg: "bg-sky-200", text: "text-sky-950" },
  { stars: 4, pts: "+5 pts", bg: "bg-emerald-300", text: "text-emerald-950" },
  { stars: 5, pts: "+10 pts", bg: "bg-green-600", text: "text-white" },
] as const;

function GiveFeedbackForm() {
  const [recipient, setRecipient] = useState<string | undefined>(undefined);
  const [feedbackDate, setFeedbackDate] = useState<Date>(() => new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [context, setContext] = useState("");
  const [positiveOpen, setPositiveOpen] = useState("");
  const [constructive, setConstructive] = useState("");
  const [positiveClose, setPositiveClose] = useState("");

  const clearForm = () => {
    setRecipient(undefined);
    setFeedbackDate(new Date());
    setDatePickerOpen(false);
    setRating(0);
    setContext("");
    setPositiveOpen("");
    setConstructive("");
    setPositiveClose("");
  };

  return (
    <div className="space-y-6 px-4 py-5 sm:px-6 sm:py-6">
      <div className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm leading-relaxed text-sky-950">
        <span className="font-semibold">Sandwich technique: </span>
        Start with something positive, share constructive feedback in the
        middle, and close with encouragement —{" "}
        <span className="font-medium">Positive → Constructive → Positive</span>
        .
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="feedback-recipient" className="text-neutral-800">
            Give Feedback To <span className="text-[#DA7756]">*</span>
          </Label>
          <Select
            value={recipient}
            onValueChange={setRecipient}
          >
            <SelectTrigger
              id="feedback-recipient"
              className="h-11 rounded-xl border-neutral-200 bg-white"
            >
              <SelectValue placeholder="Select team member" />
            </SelectTrigger>
            <SelectContent>
              {TEAM_MEMBERS.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="feedback-date" className="text-neutral-800">
            Date
          </Label>
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                id="feedback-date"
                className={cn(
                  "flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-neutral-200 bg-white px-3 text-left text-sm text-neutral-900",
                  "outline-none ring-offset-2 transition-colors hover:bg-neutral-50/80",
                  "focus-visible:ring-2 focus-visible:ring-[#DA7756]/25"
                )}
              >
                <span className="tabular-nums">{formatDMY(feedbackDate)}</span>
                <CalendarIcon
                  className="h-4 w-4 shrink-0 text-neutral-500"
                  strokeWidth={2}
                  aria-hidden
                />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={feedbackDate}
                onSelect={(d) => {
                  if (d) {
                    setFeedbackDate(d);
                    setDatePickerOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-neutral-800">
            Star Rating <span className="text-[#DA7756]">*</span>
          </Label>
          <p className="mt-0.5 text-sm text-neutral-500">
            Rate overall performance (1–5 stars)
          </p>
        </div>
        <div
          className="flex gap-1"
          role="radiogroup"
          aria-label="Star rating"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              onClick={() => setRating(n)}
              className="rounded-md p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C72030]/40"
            >
              <Star
                className={cn(
                  "h-8 w-8 sm:h-9 sm:w-9",
                  n <= rating
                    ? "fill-amber-400 text-amber-400"
                    : "fill-transparent text-neutral-300"
                )}
                strokeWidth={n <= rating ? 0 : 1.5}
              />
            </button>
          ))}
        </div>
        <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm">
          <div className="flex">
            {RATING_SEGMENTS.map((seg) => (
              <button
                key={seg.stars}
                type="button"
                onClick={() => setRating(seg.stars)}
                className={cn(
                  "min-w-0 flex-1 px-0.5 py-2.5 text-center transition-all sm:px-1 sm:py-3",
                  seg.bg,
                  seg.text,
                  rating === seg.stars &&
                  "relative z-10 ring-2 ring-inset ring-neutral-900/80"
                )}
              >
                <span className="block text-[10px] font-semibold leading-tight sm:text-xs">
                  {seg.stars}★
                </span>
                <span className="mt-0.5 block text-[9px] font-medium opacity-95 sm:text-[11px]">
                  {seg.pts}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="feedback-context" className="text-neutral-800">
          Context / Situation{" "}
          <span className="font-normal text-neutral-400">(Optional)</span>
        </Label>
        <input
          id="feedback-context"
          type="text"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="e.g., Regarding the client presentation last week..."
          className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[#C72030]/25"
        />
      </div>

      <div className="space-y-6 border-t border-neutral-100 pt-6">
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2E7D32] text-sm font-bold text-white">
              1
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">
                Positive opening
              </h3>
              <p className="text-sm text-neutral-500">
                Start with genuine appreciation and what they&apos;re doing
                well.
              </p>
            </div>
          </div>
          <Textarea
            value={positiveOpen}
            onChange={(e) => setPositiveOpen(e.target.value)}
            placeholder="Share what is working well..."
            className="min-h-[100px] resize-y rounded-xl border-neutral-200 bg-white text-sm"
          />
        </div>

        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
              2
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">
                Constructive feedback
              </h3>
              <p className="text-sm text-neutral-500">
                Provide specific, actionable feedback for improvement.
              </p>
            </div>
          </div>
          <Textarea
            value={constructive}
            onChange={(e) => setConstructive(e.target.value)}
            placeholder="Be clear and kind..."
            className="min-h-[100px] resize-y rounded-xl border-neutral-200 bg-white text-sm"
          />
        </div>

        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">
              3
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">
                Positive closing
              </h3>
              <p className="text-sm text-neutral-500">
                End with encouragement and confidence in their abilities.
              </p>
            </div>
          </div>
          <Textarea
            value={positiveClose}
            onChange={(e) => setPositiveClose(e.target.value)}
            placeholder="Close on a supportive note..."
            className="min-h-[100px] resize-y rounded-xl border-neutral-200 bg-white text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-neutral-100 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={clearForm}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-neutral-300 bg-white px-6 text-sm font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50"
        >
          Clear form
        </button>
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#DA7756] px-6 text-sm font-semibold text-white shadow-sm hover:bg-[#DA7756]/85"
        >
          <Send className="h-4 w-4" strokeWidth={2} />
          Send feedback
        </button>
      </div>

      <div className="rounded-2xl border border-violet-100 bg-violet-50/90 px-4 py-4 sm:px-5">
        <div className="flex gap-3 sm:gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-200/80">
            <Lightbulb className="h-5 w-5 text-violet-700" strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-semibold text-violet-950">
              Feedback tips
            </p>
            <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-violet-900/90">
              <li>Be specific — reference real situations and outcomes.</li>
              <li>Focus on behavior and impact, not personality.</li>
              <li>Make it timely; don&apos;t wait weeks to share important input.</li>
              <li>Listen openly when they respond; feedback is a conversation.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

const Feedback = () => {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [feedbackTab, setFeedbackTab] = useState("received");
  const selectedCompany = useSelector(
    (state: RootState) => state.project.selectedCompany
  );
  const orgLine =
    selectedCompany?.name?.toUpperCase() ?? "YOUR ORGANIZATION";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f6f4ee] px-4 py-6 sm:px-6">
      <AdminViewEmulation />
      <div className="mx-auto max-w-6xl space-y-6">
        {bannerVisible && (
          <div
            className={cn(
              "flex items-center gap-3 rounded-2xl border border-sky-200/60 bg-sky-50/90 px-4 py-3 shadow-sm",
              "pr-2"
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500">
              <Lightbulb className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <button
              type="button"
              className="min-w-0 flex-1 text-left"
              onClick={() => { }}
            >
              <p className="text-sm font-semibold text-sky-950">
                Giving & Receiving Feedback
              </p>
              <p className="text-xs text-sky-700/90">Click to view tips</p>
            </button>
            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                className="rounded-md p-2 text-sky-700 hover:bg-sky-100"
                aria-label="Expand tips"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="rounded-md p-2 text-sky-700 hover:bg-sky-100"
                aria-label="Dismiss banner"
                onClick={() => setBannerVisible(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <header className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#DA7756] bg-white shadow-sm">
            <MessageSquare
              className="h-6 w-6 text-[#DA7756]"
              strokeWidth={2}
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
              Team Feedback
            </h1>
            <p className="mt-1 text-sm text-neutral-500 sm:text-base">
              Give and receive constructive feedback using the Sandwich technique
            </p>
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-neutral-400">
              {orgLine}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
          {summaryStats.map(
            ({ label, value, icon: Icon, bgClass, iconClass }) => (
              <Card
                key={label}
                className={cn(
                  "border-0 shadow-md transition-shadow hover:shadow-lg",
                  "rounded-2xl p-5",
                  bgClass
                )}
              >
                <div className="flex flex-col items-center text-center">
                  <Icon className={cn("mb-3 h-7 w-7", iconClass)} />
                  <p className="text-3xl font-bold tabular-nums text-neutral-900">
                    {value}
                  </p>
                  <p className="mt-1 text-xs font-medium text-neutral-600">
                    {label}
                  </p>
                </div>
              </Card>
            )
          )}
        </div>

        <Card className="overflow-hidden rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 shadow-md">
          <Tabs
            value={feedbackTab}
            onValueChange={setFeedbackTab}
            className="w-full"
          >
            <TabsList
              className={cn(
                "h-auto w-full justify-start gap-1 rounded-none border-b border-[#DA7756]/20",
                "bg-[#DA7756]/10 p-2"
              )}
            >
              <TabsTrigger
                value="received"
                className={cn(
                  "gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-600",
                  "data-[state=active]:bg-[#DA7756]/10 data-[state=active]:text-neutral-900",
                  "data-[state=active]:shadow-sm"
                )}
              >
                <Inbox className="h-4 w-4" />
                Received
              </TabsTrigger>
              <TabsTrigger
                value="given"
                className={cn(
                  "gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-600",
                  "data-[state=active]:bg-[#DA7756]/10 data-[state=active]:text-neutral-900",
                  "data-[state=active]:shadow-sm"
                )}
              >
                <Send className="h-4 w-4" />
                Given
              </TabsTrigger>
              <TabsTrigger
                value="give"
                className={cn(
                  "gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-600",
                  "data-[state=active]:bg-[#DA7756] data-[state=active]:text-white",
                  "data-[state=active]:shadow-sm data-[state=active]:[&_svg]:text-white",
                  "data-[state=inactive]:bg-transparent"
                )}
              >
                <Pencil className="h-4 w-4" />
                Give Feedback
              </TabsTrigger>
            </TabsList>

            {feedbackTab === "received" && (
              <div className="border-b border-neutral-100 bg-[#DA7756]/10 px-4 py-3 sm:px-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                  <span className="text-sm text-neutral-600">
                    View feedback for:
                  </span>
                  <Select defaultValue="myself">
                    <SelectTrigger className="h-10 w-full max-w-[220px] rounded-lg border-neutral-200 bg-white">
                      <SelectValue placeholder="Myself" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="myself">Myself</SelectItem>
                      <SelectItem value="team">My team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <TabsContent value="received" className="m-0 focus-visible:outline-none">
              <FeedbackEmptyState />
            </TabsContent>
            <TabsContent value="given" className="m-0 focus-visible:outline-none">
              <GivenFeedbackList
                onGiveFeedbackClick={() => setFeedbackTab("give")}
              />
            </TabsContent>
            <TabsContent value="give" className="m-0 focus-visible:outline-none">
              <GiveFeedbackForm />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Feedback;
