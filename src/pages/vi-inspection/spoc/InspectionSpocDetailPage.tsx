import { useNavigate, useParams } from "react-router-dom";
import { InspectionDetailView } from "@/components/vi-inspection/InspectionDetailView";
import { getInspectionDisplayStatus, getViInspection } from "@/components/vi-inspection/viInspectionData";

export const INSPECTION_SPOC_PATH = "/safety/vi-inspection/spoc";

// SPOC: inspection detail with the "Add Action Plan" action.
const InspectionSpocDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // The SPOC can only add the plan while the inspection is still open.
  const canAddPlan = getInspectionDisplayStatus(getViInspection(id).status) === "Open";

  return (
    <InspectionDetailView
      inspectionId={id}
      listPath={INSPECTION_SPOC_PATH}
      footer={
        canAddPlan ? (
          <button
            type="button"
            className="fm-button-fix fm-button-brand inline-flex items-center justify-center gap-2 px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
            onClick={() => navigate(`${INSPECTION_SPOC_PATH}/${id}/action-plan`)}
          >
            Add Action Plan
          </button>
        ) : undefined
      }
    />
  );
};

export default InspectionSpocDetailPage;
