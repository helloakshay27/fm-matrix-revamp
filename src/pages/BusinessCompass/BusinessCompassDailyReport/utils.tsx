import React, { forwardRef } from "react";
import { createPortal } from "react-dom";
import { Slide } from "@mui/material";
import { COMPLETED_STATUSES, ORIGINAL_DATA_OMIT_KEYS, PRIORITY_COLORS } from "./constants";
import type { DailyReport, DailyReportDraft, TransitionProps } from "./types";

export const cleanReportText = (value: unknown) =>
  String(value ?? "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/?[^>]+>/g, "")
    .trim();

export const getReportItemText = (item: any) =>
  cleanReportText(typeof item === "string" ? item : (item?.title ?? item?.text));

export const getReportDateKey = (date: unknown) => cleanReportText(date).slice(0, 10);

export const sanitizeOriginalData = (data: any) => {
  if (!data || typeof data !== "object") return data;
  const clone = { ...data };
  ORIGINAL_DATA_OMIT_KEYS.forEach((key) => delete clone[key]);
  return clone;
};

/**
 * Task / issue / todo ka reference jo report ki har row ke saath jana chahiye.
 * Daily tab (AdminCompass) isi se type ka icon/pill dikhata hai aur row par
 * click hone par us task/issue/todo par redirect karta hai — isliye
 * accomplishments aur tomorrow_plan me bhi wahi fields bhejte hain jo
 * `tasks_issues` bhejta hai: type + source_id + start/end date.
 * Row plain note ho (koi source na ho) to khali object, taki payload me
 * bekaar nulls na jayein.
 */
export const buildItemSourceRef = (item: any) => {
  const original = item?.originalData ?? null;
  const type = String(
    item?.type ??
    item?.source_type ??
    item?.sourceType ??
    original?.source_type ??
    ""
  ).toLowerCase();
  const sourceId = item?.source_id ?? item?.sourceId ?? original?.id ?? null;
  if (!type && sourceId == null) return {};
  return {
    ...(sourceId != null ? { source_id: sourceId } : {}),
    // `type` Daily tab ka icon/pill padhta hai, `source_type` purane consumers ke liye.
    ...(type ? { type, source_type: type } : {}),
    start_date:
      original?.estimated_start_date ??
      original?.expected_start_date ??
      original?.start_date ??
      item?.start_date ??
      null,
    end_date:
      original?.target_date ?? original?.end_date ?? item?.end_date ?? null,
  };
};

export const getNonEmptyReportItems = (
  items: any[] | { items?: any[] } | undefined | null
) => {
  const sourceItems = Array.isArray(items)
    ? items
    : Array.isArray(items?.items)
      ? items.items
      : [];

  return sourceItems.filter((item) => getReportItemText(item) !== "");
};

export const normalizeReportForUi = (report: DailyReport): DailyReport => {
  if (!report?.report_data) return report;
  const accomplishments = report.report_data.accomplishments as any;
  const normalizedAccomplishments = accomplishments
    ? {
        ...(Array.isArray(accomplishments)
          ? { attachments: [] }
          : accomplishments),
        items: getNonEmptyReportItems(accomplishments).map((item: any) => ({
          ...(typeof item === "object" && item !== null ? item : {}),
          title: getReportItemText(item),
        })),
      }
    : accomplishments;

  return {
    ...report,
    report_data: {
      ...report.report_data,
      accomplishments: normalizedAccomplishments,
      tomorrow_plan: getNonEmptyReportItems(
        report.report_data.tomorrow_plan
      ).map((item: any) => ({
        ...(typeof item === "object" && item !== null ? item : {}),
        title: getReportItemText(item),
      })),
    },
  };
};

export const isReportBackedDraft = (draft: DailyReportDraft | null) =>
  Boolean(draft?.reportId) ||
  Boolean(
    draft?.accomplishments?.some((item) =>
      String(item.id).startsWith("fetched-")
    )
  ) ||
  Boolean(
    draft?.planningItems?.some((item) => String(item.id).startsWith("fetched-"))
  );

export const hasMeaningfulDraftData = (draft: DailyReportDraft | null) => {
  if (!draft) return false;
  const hasAccomplishments =
    getNonEmptyReportItems(draft.accomplishments).length > 0;
  const hasPlanning = getNonEmptyReportItems(draft.planningItems).length > 0;
  const hasKpis = Object.values(draft.kpiEntries ?? {}).some(
    (value) => cleanReportText(value) !== ""
  );
  const hasSelectedTasks = Object.values(draft.selectedTasksIssues ?? {}).some(
    Boolean
  );
  const hasCustomRating =
    Array.isArray(draft.selfRating) &&
    draft.selfRating.some((value) => value !== 2);

  return (
    hasAccomplishments ||
    hasPlanning ||
    hasKpis ||
    hasSelectedTasks ||
    hasCustomRating ||
    draft.isAbsent === true ||
    cleanReportText(draft.absenceReason) !== ""
  );
};

export const isCompleted = (status: string) => COMPLETED_STATUSES.has(status);

export const fmtDate = (d?: string) => {
  if (!d) return null;
  const dt = new Date(d);
  return `${String(dt.getDate()).padStart(2, "0")}/${String(dt.getMonth() + 1).padStart(2, "0")}/${dt.getFullYear()}`;
};

export const fmtHours = (h?: number) => {
  if (!h) return null;
  if (h < 1) return `${Math.round(h * 60)}m`;
  const wh = Math.floor(h);
  const m = Math.round((h - wh) * 60);
  return m > 0 ? `${wh}h ${m}m` : `${wh}h`;
};

export const getOverdueLabel = (targetDate?: string) => {
  if (!targetDate) return null;
  const now = new Date();
  const end = new Date(targetDate);
  end.setHours(23, 59, 59, 999);
  const diff = end.getTime() - now.getTime();
  if (diff > 0) return null;
  const abs = Math.abs(diff);
  const d = Math.floor(abs / 86400000);
  const h = Math.floor((abs % 86400000) / 3600000);
  const m = Math.floor((abs % 3600000) / 60000);
  if (d > 0) return `${d}d ${h}h overdue`;
  if (h > 0) return `${h}h ${m}m overdue`;
  return `${m}m overdue`;
};

export const isDateOverdue = (dateStr: string | undefined) => {
  if (!dateStr) return false;
  const itemDate = new Date(dateStr);
  const today = new Date();
  itemDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return itemDate < today;
};

export const isImageFile = (fileName: string, contentType: string) => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp"];
  const lowerFileName = fileName.toLowerCase();
  return contentType.startsWith("image/") || imageExtensions.some((ext) => lowerFileName.endsWith(ext));
};

export const getPriorityClass = (priority?: string) => {
  const p = String(priority || "").toUpperCase();
  if (p === "P1") return "bc-priority-high";
  if (p === "P2") return "bc-priority-medium";
  if (p === "P3") return "bc-priority-low-medium";
  return "bc-priority-low";
};

export const getPriorityColors = (priority?: string) =>
  PRIORITY_COLORS[String(priority || "").toUpperCase()] || PRIORITY_COLORS.P4;

export const extractRealId = (prefixedId: string) =>
  Number(prefixedId.replace("task-", "").replace("issue-", "").replace("todo-", ""));

export const buildDraftStorageKey = (
  date: string,
  draftUserId: string | number | null | undefined
) => `business-compass-daily-report-draft:${draftUserId || "guest"}:${date}`;

export const Transition = forwardRef(function Transition(
  props: TransitionProps,
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export const ModalPortal = ({ children }: { children: React.ReactNode }) => {
  if (typeof document === "undefined") return null;
  return createPortal(<>{children}</>, document.body);
};

export const AiSparkleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M5.5 2.5L6.55 6.85L10.9 7.9L6.55 8.95L5.5 13.3L4.45 8.95L0.1 7.9L4.45 6.85L5.5 2.5Z"
      fill="currentColor"
    />
    <path
      d="M17.2 5.5L17.75 7.65L19.9 8.2L17.75 8.75L17.2 10.9L16.65 8.75L14.5 8.2L16.65 7.65L17.2 5.5Z"
      fill="currentColor"
    />
    <path
      d="M9.8 13.8L10.55 16.75L13.5 17.5L10.55 18.25L9.8 21.2L9.05 18.25L6.1 17.5L9.05 16.75L9.8 13.8Z"
      fill="currentColor"
    />
  </svg>
);
