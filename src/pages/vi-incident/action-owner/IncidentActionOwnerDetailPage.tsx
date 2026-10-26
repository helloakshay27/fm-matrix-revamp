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
import { hasMyActionDraft } from "@/components/vi-incident/viIncidentData";
import { INCIDENT_ACTION_OWNER_PATH } from "./IncidentActionOwnerListPage";

const ViewMoreToggle = ({ open, onClick }: { open: boolean; onClick: () => void }) => (
  <button type="button" onClick={onClick} className="text-sm font-medium text-[#1A1A18] underline underline-offset-2">
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
  // Saved but not submitted: same rule as the list's edit button.
  const hasMyDraft = hasMyActionDraft(incident, isMine);

  return (
    <div className="p-6 min-h-screen">
      <IncidentHeader incident={incident} onBack={() => navigate(INCIDENT_ACTION_OWNER_PATH)} draft={hasMyDraft} />

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
        <div className="text-xs text-[rgba(26,26,24,0.48)] mb-1">Incident</div>
        <p className={`text-sm text-[#1A1A18] whitespace-pre-wrap ${detailsOpen ? "" : "line-clamp-2"}`}>
          {incident.incident || "-"}
        </p>
      </DetailCard>

      {plans.length ? (
        <IncidentActionPlanCards incident={incident} plans={plans} isMine={isMine} />
      ) : (
        <p className="py-8 text-center text-sm text-[rgba(26,26,24,0.48)]">No action plans assigned to you.</p>
      )}

      {canAddActionTaken && (
        <div className="fm-action-bar sticky bottom-0 -mx-6 mt-6 border-t border-[rgba(26,26,24,0.09)] bg-white px-6 py-4">
          <button
            type="button"
            className="fm-action-primary w-full sm:w-auto"
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
