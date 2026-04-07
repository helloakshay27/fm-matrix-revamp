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
import { AdminViewEmulation } from "@/components/AdminViewEmulation";

const SUMMARY_STATS = [
  {
    key: "total",
    label: "Total",
    value: 0,
    bg: "bg-sky-100",
    text: "text-sky-900",
  },
  {
    key: "bugs",
    label: "Bugs",
    value: 0,
    bg: "bg-red-100",
    text: "text-red-900",
  },
  {
    key: "features",
    label: "Features",
    value: 0,
    bg: "bg-violet-100",
    text: "text-violet-900",
  },
  {
    key: "open",
    label: "Open",
    value: 0,
    bg: "bg-slate-200/90",
    text: "text-slate-800",
  },
  {
    key: "resolved",
    label: "Resolved",
    value: 0,
    bg: "bg-emerald-100",
    text: "text-emerald-900",
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
          "max-h-[92vh] max-w-xl gap-0 overflow-y-auto rounded-2xl border-[#DA7756]/20 bg-[#fef6f4] p-0 sm:max-w-xl"
        )}
      >
        <div className="flex items-start justify-between border-b border-neutral-100 px-6 pb-4 pt-6 sm:px-8">
          <DialogHeader className="space-y-0 text-left">
            <DialogTitle className="text-xl font-bold text-neutral-900">
              {modalTitle}
            </DialogTitle>
          </DialogHeader>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 pb-6 pt-5 sm:px-8">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setReportType("bug")}
              className={cn(
                "flex flex-col items-start rounded-xl border-2 p-4 text-left transition-colors",
                reportType === "bug"
                  ? "border-[#DA7756] bg-[#DA7756]/10"
                  : "border-neutral-200 bg-white hover:border-neutral-300"
              )}
            >
              <Bug
                className={cn(
                  "h-6 w-6",
                  reportType === "bug" ? "text-[#DA7756]" : "text-neutral-400"
                )}
                strokeWidth={2}
              />
              <span className="mt-2 font-bold text-neutral-900">
                Bug Report
              </span>
              <span className="mt-0.5 text-xs text-neutral-600">
                Something is broken
              </span>
            </button>
            <button
              type="button"
              onClick={() => setReportType("feature")}
              className={cn(
                "flex flex-col items-start rounded-xl border-2 p-4 text-left transition-colors",
                reportType === "feature"
                  ? "border-violet-500 bg-violet-50"
                  : "border-neutral-200 bg-white hover:border-neutral-300"
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
              <span className="mt-2 font-bold text-neutral-900">
                Feature Request
              </span>
              <span className="mt-0.5 text-xs text-neutral-600">
                Suggest an improvement
              </span>
            </button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="report-title" className="text-sm text-neutral-700">
              Title <span className="text-red-500">*</span>
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
              className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus-visible:ring-2 focus-visible:ring-[#DA7756]/25"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="report-description"
              className="text-sm text-neutral-700"
            >
              Description <span className="text-red-500">*</span>
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
              className="min-h-[120px] resize-y rounded-xl border-neutral-200 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-neutral-700">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="h-11 rounded-xl border-neutral-200 bg-white">
                <SelectValue placeholder="Medium" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-neutral-700">Attachments</Label>
            <label
              htmlFor="report-files"
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-sky-200 bg-sky-50/50 px-4 py-8 transition-colors hover:bg-sky-50"
              )}
            >
              <Upload className="h-8 w-8 text-sky-500" strokeWidth={1.5} />
              <span className="mt-2 text-sm font-medium text-neutral-700">
                Click to upload screenshots or files
              </span>
              <span className="mt-1 text-xs text-neutral-500">
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

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-stretch sm:gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className={cn(
                "rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-900",
                "hover:bg-neutral-50 sm:order-2 sm:w-auto sm:shrink-0"
              )}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={cn(
                "w-full rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors sm:order-1 sm:flex-1",
                "bg-[#DA7756] hover:bg-[#DA7756]/85"
              )}
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
    <div className="min-h-[calc(100vh-4rem)] w-full bg-[#f6f4ee] px-4 py-6 sm:px-6">
      <SubmitReportDialog open={submitOpen} onOpenChange={setSubmitOpen} />

      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#DA7756] shadow-sm">
            <Bug className="h-7 w-7 text-white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
              Bug Reports & Feature Requests
            </h1>
            <p className="mt-1 text-sm text-neutral-500 sm:text-base">
              Report bugs, suggest improvements, and track progress.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
          {SUMMARY_STATS.map((stat) => (
            <Card
              key={stat.key}
              className={cn(
                "rounded-2xl border-0 p-5 shadow-md",
                stat.bg
              )}
            >
              <p className={cn("text-3xl font-bold tabular-nums", stat.text)}>
                {stat.value}
              </p>
              <p className={cn("mt-1 text-sm font-semibold", stat.text, "opacity-90")}>
                {stat.label}
              </p>
            </Card>
          ))}
        </div>

        <Card className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 border-b border-neutral-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <span className="text-sm font-semibold text-neutral-900">
                All Reports
              </span>
              <button
                type="button"
                onClick={() => setSubmitOpen(true)}
                className={cn(
                  "inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#DA7756] px-4 py-2.5 text-sm font-semibold text-white",
                  "shadow-sm transition-colors hover:bg-[#DA7756]/85"
                )}
              >
                <Plus className="h-4 w-4" strokeWidth={2} />
                Submit Report
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                aria-hidden
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reports..."
                className="h-11 w-full rounded-xl border border-neutral-200 bg-white py-2 pl-10 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-[#DA7756]/25"
              />
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:w-auto sm:shrink-0">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-11 w-full rounded-xl border-neutral-200 bg-white sm:w-[140px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="bug">Bug</SelectItem>
                  <SelectItem value="feature">Feature</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-11 w-full rounded-xl border-neutral-200 bg-white sm:w-[140px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-center px-4 py-16 text-center sm:py-20">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
              <FileSearch className="h-8 w-8 text-neutral-400" strokeWidth={1.5} />
            </div>
            <h2 className="mt-5 text-lg font-bold text-neutral-900">
              No reports found
            </h2>
            <p className="mt-2 max-w-sm text-sm text-neutral-500">
              Be the first to submit a report.
            </p>
            <button
              type="button"
              onClick={() => setSubmitOpen(true)}
              className="mt-6 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Submit New Report +
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BugReports;
