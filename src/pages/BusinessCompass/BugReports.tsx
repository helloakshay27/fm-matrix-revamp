import React, { useEffect, useState } from "react";
import {
  Bug,
  FileSearch,
  Lightbulb,
  Plus,
  Search,
  Upload,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Adjusted colors to match the soft pastel vibe of the new theme
const SUMMARY_STATS = [
  {
    key: "total",
    label: "Total",
    value: 0,
    bg: "bg-sky-50 border-sky-100",
    text: "text-sky-700",
  },
  {
    key: "bugs",
    label: "Bugs",
    value: 0,
    bg: "bg-red-50 border-red-100",
    text: "text-red-700",
  },
  {
    key: "features",
    label: "Features",
    value: 0,
    bg: "bg-violet-50 border-violet-100",
    text: "text-violet-700",
  },
  {
    key: "open",
    label: "Open",
    value: 0,
    bg: "bg-neutral-100 border-neutral-200",
    text: "text-neutral-700",
  },
  {
    key: "resolved",
    label: "Resolved",
    value: 0,
    bg: "bg-emerald-50 border-emerald-100",
    text: "text-emerald-700",
  },
] as const;

type ReportType = "bug" | "feature";

function SubmitReportDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [reportType, setReportType] = useState<ReportType>("bug");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");

  useEffect(() => {
    if (!open) {
      setReportType("bug");
      setTitle("");
      setDescription("");
      setPriority("medium");
    }
  }, [open]);

  const modalTitle =
    reportType === "bug"
      ? "Submit a Report"
      : "Submit a Feature Request";

  const submitLabel =
    reportType === "bug" ? "Submit Report" : "Submit Feature Request";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-2xl gap-0 overflow-hidden rounded-2xl bg-white p-0 shadow-xl border-0 sm:rounded-2xl"
        )}
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-100 bg-white px-6 py-4">
          <DialogHeader className="space-y-0 text-left">
            <DialogTitle className="text-[17px] font-bold text-neutral-900">
              {modalTitle}
            </DialogTitle>
          </DialogHeader>
          {/* Custom Close Button for exact match (Radix often injects its own, but we hide it via CSS usually) */}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col max-h-[75vh]"
        >
          <div className="p-6 space-y-6 overflow-y-auto">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setReportType("bug")}
                className={cn(
                  "flex flex-col items-start rounded-xl border-2 p-4 text-left transition-all",
                  reportType === "bug"
                    ? "border-[#DA7756] bg-[#FFF9F6] ring-1 ring-[#DA7756]/10 shadow-sm"
                    : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50"
                )}
              >
                <Bug
                  className={cn(
                    "h-6 w-6",
                    reportType === "bug" ? "text-[#DA7756]" : "text-neutral-400"
                  )}
                  strokeWidth={2}
                />
                <span className={cn("mt-2 font-bold", reportType === "bug" ? "text-[#DA7756]" : "text-neutral-900")}>
                  Bug Report
                </span>
                <span className="mt-0.5 text-xs font-medium text-neutral-500">
                  Something is broken
                </span>
              </button>

              <button
                type="button"
                onClick={() => setReportType("feature")}
                className={cn(
                  "flex flex-col items-start rounded-xl border-2 p-4 text-left transition-all",
                  reportType === "feature"
                    ? "border-violet-500 bg-violet-50 ring-1 ring-violet-500/10 shadow-sm"
                    : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50"
                )}
              >
                <Lightbulb
                  className={cn(
                    "h-6 w-6",
                    reportType === "feature"
                      ? "text-violet-600"
                      : "text-neutral-400"
                  )}
                  strokeWidth={2}
                />
                <span className={cn("mt-2 font-bold", reportType === "feature" ? "text-violet-700" : "text-neutral-900")}>
                  Feature Request
                </span>
                <span className="mt-0.5 text-xs font-medium text-neutral-500">
                  Suggest an improvement
                </span>
              </button>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="report-title" className="text-[13px] font-bold text-neutral-800">
                Title <span className="text-[#DA7756]">*</span>
              </Label>
              <input
                id="report-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  reportType === "bug"
                    ? "e.g. Dashboard KPI not loading"
                    : "e.g. Export weekly reports to Excel"
                }
                required
                className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400 shadow-sm outline-none focus:border-[#DA7756]/40 focus:ring-1 focus:ring-[#DA7756]/20 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="report-description"
                className="text-[13px] font-bold text-neutral-800"
              >
                Description <span className="text-[#DA7756]">*</span>
              </Label>
              <Textarea
                id="report-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder={
                  reportType === "bug"
                    ? "Describe the issue. What happened? What did you expect? Steps to reproduce..."
                    : "Describe your idea. What problem does it solve? How would you use it?"
                }
                className="min-h-[120px] resize-y rounded-xl border-neutral-200 bg-white p-3 text-sm shadow-sm outline-none focus:border-[#DA7756]/40 focus:ring-1 focus:ring-[#DA7756]/20 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[13px] font-bold text-neutral-800">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="h-11 rounded-xl border-neutral-200 bg-white shadow-sm font-medium text-neutral-700 focus:border-[#DA7756]/40 focus:ring-1 focus:ring-[#DA7756]/20 transition-all">
                  <SelectValue placeholder="Medium" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-neutral-200">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[13px] font-bold text-neutral-800">Attachments</Label>
              <label
                htmlFor="report-files"
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-sky-200 bg-sky-50/50 px-4 py-8 transition-colors hover:bg-sky-50"
                )}
              >
                <Upload className="h-8 w-8 text-sky-500" strokeWidth={1.5} />
                <span className="mt-2 text-sm font-bold text-sky-700">
                  Click to upload screenshots or files
                </span>
                <span className="mt-1 text-xs font-medium text-sky-600/70">
                  Images, PDFs, documents supported
                </span>
                <input
                  id="report-files"
                  type="file"
                  multiple
                  className="sr-only"
                  accept="image/*,.pdf,.doc,.docx"
                />
              </label>
            </div>
          </div>

          <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t border-neutral-100 bg-white px-6 py-4 mt-auto">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 text-sm font-bold text-neutral-700 shadow-sm hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#DA7756] px-6 text-sm font-bold text-white shadow-sm hover:bg-[#BC6B4A] transition-all"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const BugReports = () => {
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [submitOpen, setSubmitOpen] = useState(false);

  return (
    <div
      className="min-h-[calc(100vh-4rem)] w-full bg-[#f6f4ee] px-4 py-6 sm:px-6"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <SubmitReportDialog open={submitOpen} onOpenChange={setSubmitOpen} />

      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#DA7756] shadow-sm">
            <Bug className="h-7 w-7 text-white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">
              Bug Reports & Feature Requests
            </h1>
            <p className="mt-1 text-sm font-medium text-neutral-500 sm:text-base">
              Report bugs, suggest improvements, and track progress.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
          {SUMMARY_STATS.map((stat) => (
            <Card
              key={stat.key}
              className={cn(
                "flex flex-col items-center justify-center rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md",
                stat.bg
              )}
            >
              <p className={cn("text-3xl font-extrabold tabular-nums", stat.text)}>
                {stat.value}
              </p>
              <p
                className={cn(
                  "mt-1.5 text-[11px] font-bold uppercase tracking-wider opacity-80",
                  stat.text
                )}
              >
                {stat.label}
              </p>
            </Card>
          ))}
        </div>

        <Card className="overflow-hidden rounded-2xl border border-[#DA7756]/20 bg-white shadow-sm">
          {/* Header Area */}
          <div className="flex flex-col gap-4 border-b border-[rgba(218,119,86,0.1)] bg-[#FFF9F6] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <span className="text-[12px] font-bold uppercase tracking-wider text-neutral-600">
              All Reports
            </span>
            <button
              type="button"
              onClick={() => setSubmitOpen(true)}
              className={cn(
                "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#DA7756] px-5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#BC6B4A] active:scale-95"
              )}
            >
              <Plus className="h-4 w-4" strokeWidth={2} />
              Submit Report
            </button>
          </div>

          {/* Filters Area */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 p-4 sm:px-5">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                aria-hidden
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reports..."
                className="h-10 w-full rounded-xl border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#DA7756]/40 focus:ring-1 focus:ring-[#DA7756]/20 transition-all shadow-sm"
              />
            </div>
            
            <div className="flex w-full gap-3 sm:w-auto sm:shrink-0">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-10 w-full rounded-xl border border-neutral-200 bg-white text-sm font-semibold text-neutral-700 shadow-sm focus:ring-[#DA7756]/20 sm:w-[130px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-neutral-200">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="bug">Bug</SelectItem>
                  <SelectItem value="feature">Feature</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-10 w-full rounded-xl border border-neutral-200 bg-white text-sm font-semibold text-neutral-700 shadow-sm focus:ring-[#DA7756]/20 sm:w-[130px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-neutral-200">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center bg-white px-4 py-20 text-center sm:py-24">
            <FileSearch
              className="mb-4 h-14 w-14 text-neutral-300 sm:h-16 sm:w-16"
              strokeWidth={1.5}
            />
            <h3 className="text-lg font-bold text-neutral-800">
              No reports found
            </h3>
            <p className="mt-2 max-w-sm text-sm font-medium text-neutral-500">
              Be the first to submit a report or feature request.
            </p>
            <button
              type="button"
              onClick={() => setSubmitOpen(true)}
              className="mt-6 flex items-center gap-1 text-sm font-bold text-[#DA7756] transition-colors hover:text-[#BC6B4A] hover:underline underline-offset-4"
            >
              Submit New Report <Plus className="h-4 w-4" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BugReports;