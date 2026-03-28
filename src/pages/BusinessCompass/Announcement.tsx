import React from "react";
import {
  Clock,
  ExternalLink,
  Info,
  Megaphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { AdminViewEmulation } from "@/components/AdminViewEmulation";

type AnnouncementItem = {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  slogan: string;
  typeLabel: string;
  categoryLabel: string;
  dateLine: string;
  ctaLabel: string;
  ctaHref?: string;
  expires: string;
};

const CURRENT_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: "1",
    title: "Live Support for any issues in Business Compass",
    subtitle: "EXTREME SUPPORT FOR YOUR BUSINESS GROWTH",
    body:
      "Morning Session: 10:30 AM - 1 PM Afternoon Session: 3 PM - 6 PM (Mon, Tue, Wed, Fri)",
    slogan:
      "GOING ABOVE & BEYOND: More Than Duty. Your Success is Our Priority.",
    typeLabel: "Info",
    categoryLabel: "Platform",
    dateLine: "Feb 25, 2026 by sj",
    ctaLabel: "Click for Live Support",
    ctaHref: "#",
    expires: "Jun 30, 2026",
  },
];

function AnnouncementCard({ item }: { item: AnnouncementItem }) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 shadow-sm",
        "pl-1"
      )}
    >
      <div className="absolute left-0 top-0 h-full w-1 bg-[#DA7756]" aria-hidden />
      <div className="flex gap-4 px-5 py-5 pl-6 sm:px-6 sm:py-6">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DA7756]/10 text-[#DA7756]"
          aria-hidden
        >
          <Info className="h-5 w-5 stroke-[2.5]" />
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2 gap-y-2">
            <span className="inline-flex items-center rounded-full bg-[#DA7756] px-2.5 py-0.5 text-xs font-semibold text-white">
              {item.typeLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DA7756] px-2.5 py-0.5 text-xs font-semibold text-white">
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white/25">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              {item.categoryLabel}
            </span>
            <span className="flex w-full items-center gap-1.5 text-xs text-neutral-400 sm:ml-1 sm:w-auto">
              <Clock className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
              {item.dateLine}
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold leading-snug text-neutral-900 sm:text-xl">
              {item.title}
            </h2>
            <p className="text-xs font-bold uppercase tracking-wide text-neutral-600 sm:text-sm">
              {item.subtitle}
            </p>
            <p className="text-sm leading-relaxed text-neutral-600">
              {item.body}
            </p>
            <p className="text-xs font-semibold uppercase leading-relaxed tracking-wide text-neutral-500">
              {item.slogan}
            </p>
          </div>

          {item.ctaHref ? (
            <a
              href={item.ctaHref}
              className="inline-flex items-center gap-2 rounded-xl bg-[#DA7756] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#DA7756]/85"
            >
              <ExternalLink className="h-4 w-4 text-white" strokeWidth={2} />
              {item.ctaLabel}
            </a>
          ) : (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-[#DA7756] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#DA7756]/85"
            >
              <ExternalLink className="h-4 w-4 text-white" strokeWidth={2} />
              {item.ctaLabel}
            </button>
          )}

          <p className="text-[11px] text-neutral-400">
            Expires: {item.expires}
          </p>
        </div>
      </div>
    </Card>
  );
}

const Announcement = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f6f4ee] px-4 py-6 sm:px-6">
      <AdminViewEmulation />
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#DA7756] shadow-sm">
            <Megaphone className="h-7 w-7 text-white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
              Announcements
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-neutral-500 sm:text-base">
              All company announcements from the admin team
            </p>
          </div>
        </header>

        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
            Current
          </h2>
          <div className="space-y-4">
            {CURRENT_ANNOUNCEMENTS.map((item) => (
              <AnnouncementCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Announcement;
