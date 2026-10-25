import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CalendarClock } from "lucide-react";
import { InspectionDetailView } from "@/components/vi-inspection/InspectionDetailView";
import { InspectionPlanExtensionForm } from "@/components/vi-inspection/InspectionPlanExtensionForm";
import { INSPECTION_PATHS, isPlanClosed, isPlanDraft } from "@/components/vi-inspection/viInspectionData";

export const INSPECTION_SPOC_PATH = INSPECTION_PATHS.spoc;

// SPOC: inspection detail with "Add / Edit Action Plan" (while the SPOC can manage plans) and
// "Extend Target Date" on released, unfinished plans of an open inspection.
const InspectionSpocDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [extendingPlanId, setExtendingPlanId] = useState<string | null>(null);

  return (
    <InspectionDetailView
      inspectionId={id}
      listPath={INSPECTION_SPOC_PATH}
      renderPlanActions={(plan, { inspection, reload }) => {
        const canExtend =
          inspection.canManageActionPlans && inspection.status === "open" && !isPlanDraft(plan) && !isPlanClosed(plan);
        if (!canExtend) return null;
        if (extendingPlanId === plan.id) {
          return (
            <InspectionPlanExtensionForm
              plan={plan}
              onCancel={() => setExtendingPlanId(null)}
              onExtended={() => {
                setExtendingPlanId(null);
                reload();
              }}
            />
          );
        }
        return (
          <div className="flex justify-end">
            <button type="button" className="fm-button-fix inline-flex items-center justify-center gap-2 border border-brand bg-white text-brand hover:bg-brand-selected px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed" onClick={() => setExtendingPlanId(plan.id)}>
              <CalendarClock className="w-4 h-4" />
              Extend Target Date
            </button>
          </div>
        );
      }}
      footer={({ inspection }) => {
        if (!inspection.canManageActionPlans || inspection.status !== "open") return null;
        const hasNo = inspection.checklistResponses.some((r) => r.answer === "No");
        const hasPlans = inspection.checklistResponses.some((r) => r.actionPlans.length);
        return (
          <button
            type="button"
            className="fm-button-fix fm-button-brand inline-flex items-center justify-center gap-2 px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
            onClick={() => navigate(`${INSPECTION_SPOC_PATH}/${inspection.id}/action-plan`)}
          >
            {!hasNo ? "Review & Submit" : hasPlans ? "Edit Action Plan" : "Add Action Plan"}
          </button>
        );
      }}
    />
  );
};

export default InspectionSpocDetailPage;
