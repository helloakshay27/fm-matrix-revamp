import { useNavigate, useParams } from "react-router-dom";
import { InspectionDetailView } from "@/components/vi-inspection/InspectionDetailView";
import { isMyAssignment } from "@/components/vi-inspection/viInspectionApi";
import { INSPECTION_PATHS, isPlanDraft } from "@/components/vi-inspection/viInspectionData";

export const INSPECTION_ACTION_OWNER_PATH = INSPECTION_PATHS.action_owner;

// Action Owner: only the checklist questions with a plan the user is responsible for (and only those
// plans), and "Add Action Taken" while one of their assignments is still unsubmitted.
const InspectionActionOwnerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <InspectionDetailView
      inspectionId={id}
      listPath={INSPECTION_ACTION_OWNER_PATH}
      onlyMyResponses
      isMine={isMyAssignment}
      footer={({ inspection }) => {
        const pending = inspection.checklistResponses.some((r) =>
          r.actionPlans.some(
            (plan) =>
              !isPlanDraft(plan) && plan.assignments.some((a) => isMyAssignment(a, inspection) && a.status !== "closed"),
          ),
        );
        if (inspection.status !== "open" || !pending) return null;
        return (
          <button
            type="button"
            className="fm-button-fix fm-button-brand inline-flex items-center justify-center gap-2 px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
            onClick={() => navigate(`${INSPECTION_ACTION_OWNER_PATH}/${inspection.id}/action-taken`)}
          >
            Add Action Taken
          </button>
        );
      }}
    />
  );
};

export default InspectionActionOwnerDetailPage;
