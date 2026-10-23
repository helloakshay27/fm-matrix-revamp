import { useNavigate, useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InspectionListView } from "@/components/vi-inspection/InspectionListView";
import { InspectionDetailView } from "@/components/vi-inspection/InspectionDetailView";

export const INSPECTION_INSPECTOR_PATH = "/safety/vi-inspection/inspector";
const INSPECTION_SPOC_PATH = "/safety/vi-inspection/spoc";
const INSPECTION_ACTION_OWNER_PATH = "/safety/vi-inspection/action-owner";
const INSPECTION_FUNCTIONAL_HEAD_PATH = "/safety/vi-inspection/functional-head";

// Inspector: inspection list with "Add Inspection" (creates a new inspection in a 3-step form).
export const InspectionInspectorListPage = () => {
  const navigate = useNavigate();
  return (
    <InspectionListView
      title="Inspection — Inspector"
      detailBasePath={INSPECTION_INSPECTOR_PATH}
      storageKey="vi-inspection-list-inspector"
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

// Functional Head shares the SPOC list view, with read-only inspection details.
export const InspectionSpocListPage = () => (
  <InspectionListView
    title="Inspection — SPOC"
    detailBasePath={INSPECTION_SPOC_PATH}
    storageKey="vi-inspection-list-spoc"
  />
);

export const InspectionActionOwnerListPage = () => (
  <InspectionListView
    title="Inspection — Action Owner"
    detailBasePath={INSPECTION_ACTION_OWNER_PATH}
    storageKey="vi-inspection-list-action-owner"
    enableReportDownload
  />
);

export const InspectionFunctionalHeadListPage = () => (
  <InspectionListView
    title="Inspection — Functional Head"
    detailBasePath={INSPECTION_FUNCTIONAL_HEAD_PATH}
    storageKey="vi-inspection-list-functional-head"
  />
);

const InspectionRoleDetailPage = ({ listPath }: { listPath: string }) => {
  const { id } = useParams();
  return <InspectionDetailView inspectionId={id} listPath={listPath} />;
};

export const InspectionInspectorDetailPage = () => <InspectionRoleDetailPage listPath={INSPECTION_INSPECTOR_PATH} />;
export const InspectionFunctionalHeadDetailPage = () => (
  <InspectionRoleDetailPage listPath={INSPECTION_FUNCTIONAL_HEAD_PATH} />
);
