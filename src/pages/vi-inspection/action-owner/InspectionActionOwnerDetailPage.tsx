import { useNavigate, useParams } from "react-router-dom";
import { InspectionDetailView } from "@/components/vi-inspection/InspectionDetailView";
import { getInspectionDisplayStatus, getViInspection } from "@/components/vi-inspection/viInspectionData";

export const INSPECTION_ACTION_OWNER_PATH = "/safety/vi-inspection/action-owner";

// Action Owner: inspection detail with the SPOC's plans and the "Add Action Taken" action.
const InspectionActionOwnerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Action taken can only be added while the inspection is still open.
  const canAddActionTaken = getInspectionDisplayStatus(getViInspection(id).status) === "Open";

  return (
    <InspectionDetailView
      inspectionId={id}
      listPath={INSPECTION_ACTION_OWNER_PATH}
      showActionPlans
      footer={
        canAddActionTaken ? (
          <button
            type="button"
            className="fm-button-fix fm-button-brand inline-flex items-center justify-center gap-2 px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
            onClick={() => navigate(`${INSPECTION_ACTION_OWNER_PATH}/${id}/action-taken`)}
          >
            Add Action Taken
          </button>
        ) : undefined
      }
    />
  );
};

export default InspectionActionOwnerDetailPage;
