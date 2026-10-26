import { IncidentFieldGrid as FieldGrid } from "@/components/vi-incident/IncidentFieldGrid";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClipboardList, FileText } from "lucide-react";
import { DetailCard } from "@/components/ui/detail-card";
import { AuditLoadingState, sectionIcon } from "@/components/vi-audit/ViAuditUi";
import { IncidentHeader } from "@/components/vi-incident/IncidentDetailView";
import { IncidentActionPlanCards } from "@/components/vi-incident/IncidentActionPlanCards";
import {
  isMyAssignment,
  plansAssignedToMe,
  useViIncidentDetail,
  useViIncidentMyAssignmentIds,
} from "@/components/vi-incident/viIncidentApi";
import { INCIDENT_ACTION_OWNER_PATH } from "./IncidentActionOwnerListPage";

const ViewMoreToggle = ({ open, onClick }: { open: boolean; onClick: () => void }) => (
  <button type="button" onClick={onClick} className="text-sm font-medium text-gray-900 underline underline-offset-2">
    {open ? "View Less" : "View More"}
  </button>
);

// Action Owner: incident detail — summary, incident text, and each action plan assigned to them.
// "Add Action Taken" opens the form while any of their assignments is still open / draft;
// submitted actions are shown on the plan cards.
const IncidentActionOwnerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { incident, loading } = useViIncidentDetail(id);
  const { ids: myAssignmentIds, loading: assignmentsLoading } = useViIncidentMyAssignmentIds(id);
  // Plans this owner is on, with every co-owner kept (who has acted, who is pending).
  const plans = useMemo(
    () => (incident ? plansAssignedToMe(incident, myAssignmentIds) : []),
    [incident, myAssignmentIds],
  );
  const isMine = useMemo(
    () => (incident ? isMyAssignment(incident, myAssignmentIds) : () => false),
    [incident, myAssignmentIds],
  );
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  if (loading || assignmentsLoading) return <AuditLoadingState message="Loading incident..." />;
  if (!incident) {
    return <AuditLoadingState message="Incident not found." onBack={() => navigate(INCIDENT_ACTION_OWNER_PATH)} />;
  }

  // Only this owner's own pending / draft assignments unlock "Add Action Taken".
  const canAddActionTaken =
    incident.storedStatus === "open" &&
    plans.some((plan) => plan.assignments.some((a) => isMine(a) && a.status !== "closed"));

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      <IncidentHeader incident={incident} onBack={() => navigate(INCIDENT_ACTION_OWNER_PATH)} />

      <DetailCard icon={sectionIcon(FileText)} title="Incident Summary" className="mb-5">
        <div className="mb-3 flex justify-end">
          <ViewMoreToggle open={summaryOpen} onClick={() => setSummaryOpen((v) => !v)} />
        </div>
        <FieldGrid
          columns={3}
          fields={[
            { label: "Incident Location", value: incident.incidentLocation },
            { label: "Incident Date & Time", value: `${incident.dateOfIncident} ${incident.timeOfIncident}`.trim() },
            { label: "Status", value: incident.status },
            ...(summaryOpen
              ? [
                  { label: "Reporter", value: incident.reporter.name },
                  { label: "Circle", value: incident.circle },
                  { label: "Personnel Area", value: incident.personnelArea },
                  { label: "Classification", value: incident.classification },
                  { label: "Category", value: incident.category },
                  { label: "Assigned SPOC", value: incident.spoc },
                ]
              : []),
          ]}
        />
      </DetailCard>

      <DetailCard icon={sectionIcon(ClipboardList)} title="Incident Details" className="mb-5">
        <div className="mb-3 flex justify-end">
          <ViewMoreToggle open={detailsOpen} onClick={() => setDetailsOpen((v) => !v)} />
        </div>
        <div className="text-xs text-gray-500 mb-1">Incident</div>
        <p className={`text-sm text-gray-900 whitespace-pre-wrap ${detailsOpen ? "" : "line-clamp-2"}`}>
          {incident.incident || "-"}
        </p>
      </DetailCard>

      {plans.length ? (
        <IncidentActionPlanCards incident={incident} plans={plans} isMine={isMine} />
      ) : (
        <p className="py-8 text-center text-sm text-gray-500">No action plans assigned to you.</p>
      )}

      {canAddActionTaken && (
        <div className="flex flex-wrap gap-4 justify-center sticky bottom-0 -mx-6 mt-6 border-t border-gray-200 bg-white px-6 py-4">
          <button
            type="button"
            className="fm-button-fix fm-button-brand inline-flex items-center justify-center gap-2 px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
            onClick={() => navigate(`${INCIDENT_ACTION_OWNER_PATH}/${id}/action-taken`)}
          >
            Add Action Taken
          </button>
        </div>
      )}
    </div>
  );
};

export default IncidentActionOwnerDetailPage;
