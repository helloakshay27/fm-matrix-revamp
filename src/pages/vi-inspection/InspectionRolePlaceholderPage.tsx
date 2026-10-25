import { useNavigate, useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InspectionListView } from "@/components/vi-inspection/InspectionListView";
import { InspectionDetailView } from "@/components/vi-inspection/InspectionDetailView";
import { INSPECTION_PATHS } from "@/components/vi-inspection/viInspectionData";

export const INSPECTION_INSPECTOR_PATH = INSPECTION_PATHS.inspector;

// Inspector: own inspections, "Add Inspection", and edit on own drafts (can_edit).
export const InspectionInspectorListPage = () => {
  const navigate = useNavigate();
  return (
    <InspectionListView
      role="inspector"
      title="Inspection — Inspector"
      storageKey="vi-inspection-list-inspector"
      editPath={(inspection) => `${INSPECTION_INSPECTOR_PATH}/${inspection.id}/edit`}
      leftActions={
        <Button
          className="bg-brand hover:bg-brand-hover text-white"
          onClick={() => navigate(`${INSPECTION_INSPECTOR_PATH}/add`)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Inspection
        </Button>
      }
    />
  );
};

export const InspectionSpocListPage = () => (
  <InspectionListView role="spoc" title="Inspection — SPOC" storageKey="vi-inspection-list-spoc" />
);

export const InspectionActionOwnerListPage = () => (
  <InspectionListView
    role="action_owner"
    title="Inspection — Action Owner"
    storageKey="vi-inspection-list-action-owner"
    enableReportDownload
  />
);

export const InspectionFunctionalHeadListPage = () => (
  <InspectionListView role="functional_head" title="Inspection — Functional Head" storageKey="vi-inspection-list-functional-head" />
);

// Inspector: detail of an own inspection, with "Edit Draft" while it is still a draft.
export const InspectionInspectorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <InspectionDetailView
      inspectionId={id}
      listPath={INSPECTION_INSPECTOR_PATH}
      footer={({ inspection }) =>
        inspection.canEdit ? (
          <button
            type="button"
            className="fm-action-primary w-full sm:w-auto"
            onClick={() => navigate(`${INSPECTION_INSPECTOR_PATH}/${inspection.id}/edit`)}
          >
            Edit Draft
          </button>
        ) : null
      }
    />
  );
};

// Functional Head: read-only view (GET /vi_inspections/:id.json only).
export const InspectionFunctionalHeadDetailPage = () => {
  const { id } = useParams();
  return <InspectionDetailView inspectionId={id} listPath={INSPECTION_PATHS.functional_head} />;
};
