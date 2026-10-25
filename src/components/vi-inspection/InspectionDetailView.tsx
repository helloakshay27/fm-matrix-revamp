import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ClipboardCheck, FileText, User } from "lucide-react";
import { DetailCard } from "@/components/ui/detail-card";
import { AuditLoadingState, FieldGrid, sectionIcon } from "@/components/vi-audit/ViAuditUi";
import { AttachmentLinks } from "@/components/vi-incident/IncidentFormFields";
import { InspectionStatusPill } from "./InspectionListView";
import { InspectionPlanCard } from "./InspectionPlanCard";
import { useViInspectionDetail } from "./viInspectionApi";
import {
  ACTION_TYPES,
  formatInspectionDate,
  type ViInspectionActionPlan,
  type ViInspectionAssignment,
  type ViInspectionChecklistResponse,
  type ViInspectionRecord,
} from "./viInspectionData";

const ANSWER_TONE: Record<string, string> = {
  Yes: "bg-[#DDEBD3] text-[#4A6B2E]",
  No: "bg-[#F5B5A6] text-[#8A2F1B]",
  NA: "bg-[#F5F4F0] text-[rgba(26,26,24,0.68)]",
};

export interface InspectionDetailSlots {
  inspection: ViInspectionRecord;
  reload: () => void;
}

/**
 * Shared inspection detail (GET /vi_inspections/:id.json): Inspector, Basic Details and the checklist
 * with each response's attachments and corrective / preventive plans. Each role page supplies its
 * list route and optional controls (footer, per-plan actions).
 */
export const InspectionDetailView = ({
  inspectionId: id,
  listPath,
  footer,
  renderPlanActions,
  isMine,
  onlyMyResponses = false,
}: {
  inspectionId: string | undefined;
  listPath: string;
  /** Sticky action bar content, e.g. the SPOC's "Add Action Plan" button. */
  footer?: (slots: InspectionDetailSlots) => ReactNode;
  renderPlanActions?: (plan: ViInspectionActionPlan, slots: InspectionDetailSlots) => ReactNode;
  isMine?: (assignment: ViInspectionAssignment, inspection: ViInspectionRecord) => boolean;
  /**
   * Action Owner's view: only the checklist responses with a plan the user is a responsible person on
   * (per `isMine`), and under each only those plans.
   */
  onlyMyResponses?: boolean;
}) => {
  const navigate = useNavigate();
  const { inspection, loading, reload } = useViInspectionDetail(id);
  const [checklistExpanded, setChecklistExpanded] = useState(true);

  if (loading && !inspection) return <AuditLoadingState message="Loading inspection..." onBack={() => navigate(listPath)} />;
  if (!inspection) return <AuditLoadingState message="Inspection not found." onBack={() => navigate(listPath)} />;

  const slots = { inspection, reload };
  const responses = onlyMyResponses
    ? inspection.checklistResponses
        .map((r) => ({
          ...r,
          actionPlans: r.actionPlans.filter((plan) => plan.assignments.some((a) => isMine?.(a, inspection))),
        }))
        .filter((r) => r.actionPlans.length)
    : inspection.checklistResponses;
  const visible = checklistExpanded ? responses : responses.slice(0, 1);
  const footerContent = footer?.(slots);

  const renderResponse = (item: ViInspectionChecklistResponse, index: number) => (
    <div key={item.id || index} className="rounded-xl border border-[rgba(26,26,24,0.09)] p-4">
      <div className="mb-3 flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-[#1A1A18]">
          {index + 1}. {item.question}
        </p>
        <span
          className={`shrink-0 rounded-full px-[10px] py-[3px] text-[11px] font-medium ${
            ANSWER_TONE[item.answer] ?? ANSWER_TONE.NA
          }`}
        >
          {item.answer || "Not answered"}
        </span>
      </div>
      {item.remark && (
        <div className="mb-3">
          <div className="text-xs text-[rgba(26,26,24,0.48)] mb-1">Remarks</div>
          <p className="text-sm text-[#1A1A18] whitespace-pre-wrap">{item.remark}</p>
        </div>
      )}
      <div>
        <div className="mb-2 flex items-center justify-between text-xs text-[rgba(26,26,24,0.48)]">
          <span>Attachments</span>
          {item.attachments.length > 0 && (
            <span className="font-medium text-[#1A1A18]">{item.attachments.length} files</span>
          )}
        </div>
        {item.attachments.length ? (
          <AttachmentLinks attachments={item.attachments} />
        ) : (
          <span className="text-sm font-medium text-[#1A1A18]">-</span>
        )}
      </div>
      {item.actionPlans.length > 0 && (
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4 border-t border-[rgba(26,26,24,0.09)] pt-4">
          {ACTION_TYPES.flatMap((type) => item.actionPlans.filter((plan) => plan.actionType === type)).map((plan) => (
            <InspectionPlanCard
              key={plan.id}
              plan={plan}
              isMine={isMine && ((assignment) => isMine(assignment, inspection))}
              actions={renderPlanActions?.(plan, slots)}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 min-h-screen">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate(listPath)}
          className="flex h-8 w-8 items-center justify-center rounded-[8px] hover:bg-[#F5F4F0]"
          aria-label="Back to inspection list"
        >
          <ArrowLeft className="w-4 h-4 text-[rgba(26,26,24,0.68)]" />
        </button>
        <h1 className="text-xl font-semibold text-[#1A1A18]">Inspection — {inspection.inspectionNo}</h1>
        <InspectionStatusPill workflowKey={inspection.workflowKey} label={inspection.workflowLabel} />
      </div>

      <DetailCard icon={sectionIcon(User)} title="Inspector Details" className="mb-5">
        <FieldGrid
          fields={[
            { label: "Name", value: inspection.inspector?.name },
            { label: "Mail ID", value: inspection.inspector?.email },
            { label: "Employer", value: inspection.inspector?.employer },
          ]}
        />
      </DetailCard>

      <DetailCard icon={sectionIcon(FileText)} title="Basic Details" className="mb-5">
        <FieldGrid
          columns={4}
          fields={[
            { label: "Inspection No.", value: inspection.inspectionNo },
            { label: "Date of Inspection", value: formatInspectionDate(inspection.inspectionDate) },
            { label: "Circle", value: inspection.circle },
            { label: "Personnel Area", value: inspection.personalArea },
            { label: "Work Location", value: inspection.workLocation },
            { label: "Type of Facility", value: inspection.facilityType },
            { label: "Function", value: inspection.department },
            { label: "Inspection Type", value: inspection.inspectionType },
            { label: "SPOC", value: inspection.spoc?.name },
            { label: "Functional Head", value: inspection.functionalHead?.name },
            { label: "Target Date", value: formatInspectionDate(inspection.targetDate) },
            { label: "Submitted On", value: formatInspectionDate(inspection.submittedAt) },
            { label: "Inspector Location", value: inspection.inspectorLocation, span: true },
          ]}
        />
      </DetailCard>

      <DetailCard
        icon={sectionIcon(ClipboardCheck)}
        title="Inspection Checklist"
        className="mb-5"
        headerActions={
          responses.length > 1 ? (
            <button
              type="button"
              onClick={() => setChecklistExpanded((v) => !v)}
              className="text-sm font-medium text-[#1A1A18] underline underline-offset-2"
            >
              {checklistExpanded ? "View Less" : "View All"}
            </button>
          ) : undefined
        }
      >
        {responses.length ? (
          <div className="space-y-4">{visible.map(renderResponse)}</div>
        ) : (
          <p className="text-sm text-[rgba(26,26,24,0.48)]">
            {onlyMyResponses ? "No checklist items are assigned to you on this inspection." : "No checklist responses."}
          </p>
        )}
      </DetailCard>

      {footerContent && (
        <div className="fm-action-bar sticky bottom-0 -mx-6 mt-6 border-t border-[rgba(26,26,24,0.09)] bg-white px-6 py-4">
          {footerContent}
        </div>
      )}
    </div>
  );
};
