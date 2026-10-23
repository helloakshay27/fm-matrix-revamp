import { useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ClipboardCheck, FileText, ImageIcon, User } from "lucide-react";
import { DetailCard } from "@/components/ui/detail-card";
import { FieldGrid, sectionIcon } from "@/components/vi-audit/ViAuditUi";
import { InspectionStatusPill } from "./InspectionListView";
import { getViInspection, type ViInspectionPlan } from "./viInspectionData";

/** Corrective or preventive plans for one checklist item: id, description, action owner and target date. */
const PlanList = ({ title, plans }: { title: string; plans: ViInspectionPlan[] }) =>
  plans.length ? (
    <div className="mt-5 border-t border-[rgba(26,26,24,0.09)] pt-4">
      <div className="mb-3 text-sm font-semibold text-[#1A1A18]">{title}</div>
      <div className="space-y-4">
        {plans.map((plan) => (
          <div key={plan.id}>
            <div className="text-xs text-[rgba(26,26,24,0.48)] mb-1">{plan.id}</div>
            <p className="mb-3 text-sm text-[#1A1A18] whitespace-pre-wrap">{plan.description}</p>
            <FieldGrid
              columns={2}
              fields={[
                { label: "Action Owner", value: plan.actionOwner },
                { label: "Target Date", value: plan.targetDate },
              ]}
            />
          </div>
        ))}
      </div>
    </div>
  ) : null;

const isUrl = (value: string) => /^(https?:|blob:|data:)/.test(value);

/** Photo tile — renders the image once a real URL exists, otherwise a named placeholder. */
const AttachmentTile = ({ src }: { src: string }) =>
  isUrl(src) ? (
    <img src={src} alt="" className="h-20 w-24 rounded-[10px] object-cover border border-[rgba(26,26,24,0.09)]" />
  ) : (
    <div
      title={src}
      className="flex h-20 w-24 flex-col items-center justify-center gap-1 rounded-[10px] bg-[#F5F4F0] px-1 text-[rgba(26,26,24,0.48)]"
    >
      <ImageIcon className="w-5 h-5" />
      <span className="w-full truncate text-center text-[10px]">{src}</span>
    </div>
  );

/**
 * Shared inspection detail layout (Inspector / Basic Details / Inspection Checklist).
 * Each role page supplies its list route for the back arrow.
 */
export const InspectionDetailView = ({
  inspectionId: id,
  listPath,
  footer,
  showActionPlans = false,
}: {
  inspectionId: string | undefined;
  listPath: string;
  /** Show the SPOC's corrective / preventive plans under each checklist item (Action Owner view). */
  showActionPlans?: boolean;
  /** Sticky action bar content, e.g. the SPOC's "Add Action Plan" button. */
  footer?: ReactNode;
}) => {
  const navigate = useNavigate();
  const inspection = useMemo(() => getViInspection(id), [id]);
  const [checklistExpanded, setChecklistExpanded] = useState(true);

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
        <h1 className="text-xl font-semibold text-[#1A1A18]">Inspection — {inspection.inspectionId}</h1>
        <InspectionStatusPill status={inspection.status} />
      </div>

      <DetailCard icon={sectionIcon(User)} title="Inspector Details" className="mb-5">
        <FieldGrid
          fields={[
            { label: "Name", value: inspection.inspector.name },
            { label: "Mail ID", value: inspection.inspector.mailId },
            { label: "Employer", value: inspection.inspector.employer },
          ]}
        />
      </DetailCard>

      <DetailCard icon={sectionIcon(FileText)} title="Basic Details" className="mb-5">
        <FieldGrid
          columns={4}
          fields={[
            { label: "Inspection ID", value: String(inspection.inspectionId) },
            { label: "Date of Inspection", value: inspection.dateOfInspection },
            { label: "Circle", value: inspection.circle },
            { label: "Personnel Area", value: inspection.personnelArea },
            { label: "Work Location", value: inspection.workLocation },
            { label: "Type of Facility", value: inspection.facilityType },
            { label: "Function", value: inspection.function },
            { label: "Inspection Type", value: inspection.inspectionType },
            { label: "Inspection Location", value: inspection.inspectionLocation, span: true },
          ]}
        />
      </DetailCard>

      <DetailCard
        icon={sectionIcon(ClipboardCheck)}
        title="Inspection Checklist"
        className="mb-5"
        headerActions={
          <button
            type="button"
            onClick={() => setChecklistExpanded((v) => !v)}
            className="text-sm font-medium text-[#1A1A18] underline underline-offset-2"
          >
            {checklistExpanded ? "View Less" : "View All"}
          </button>
        }
      >
        <div className="space-y-4">
          {(checklistExpanded ? inspection.checklist : inspection.checklist.slice(0, 1)).map((item, index) => (
            <div key={index} className="rounded-xl border border-[rgba(26,26,24,0.09)] p-4">
              <div className="mb-4 flex items-start justify-between gap-4">
                <p className="text-sm font-medium text-[#1A1A18]">
                  {index + 1}. {item.question}
                </p>
                <span className="shrink-0 text-sm font-medium text-[#1A1A18]">{item.answer}</span>
              </div>
              {item.remarks && (
                <div className="mb-4">
                  <div className="text-xs text-[rgba(26,26,24,0.48)] mb-1">Remarks</div>
                  <p className="text-sm text-[#1A1A18] whitespace-pre-wrap">{item.remarks}</p>
                </div>
              )}
              <FieldGrid
                fields={[
                  { label: "Assigned SPOC", value: item.spoc },
                  { label: "Functional Head", value: item.functionalHead },
                  { label: "Target Date", value: item.targetDate },
                ]}
              />
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-xs text-[rgba(26,26,24,0.48)]">
                  <span>Attachments</span>
                  {item.attachments.length > 0 && (
                    <span className="font-medium text-[#1A1A18]">{item.attachments.length} photos</span>
                  )}
                </div>
                {item.attachments.length ? (
                  <div className="flex flex-wrap gap-2">
                    {item.attachments.map((src) => (
                      <AttachmentTile key={src} src={src} />
                    ))}
                  </div>
                ) : (
                  <span className="text-sm font-medium text-[#1A1A18]">-</span>
                )}
              </div>
              <div className="mt-4">
                <InspectionStatusPill status={item.status} />
              </div>
              {showActionPlans && (
                <>
                  <PlanList title="Corrective Action Plan" plans={item.correctivePlans} />
                  <PlanList title="Preventive Action Plan" plans={item.preventivePlans} />
                </>
              )}
            </div>
          ))}
        </div>
      </DetailCard>
      {footer && (
        <div className="fm-action-bar sticky bottom-0 -mx-6 mt-6 border-t border-[rgba(26,26,24,0.09)] bg-white px-6 py-4">
          {footer}
        </div>
      )}
    </div>
  );
};
