import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ClipboardList, FileText } from "lucide-react";
import { DetailCard } from "@/components/ui/detail-card";
import { FieldGrid, sectionIcon } from "@/components/vi-audit/ViAuditUi";
import { IncidentStatusPill } from "@/components/vi-incident/IncidentListView";
import { getViIncident, getViIncidentActionPlans } from "@/components/vi-incident/viIncidentData";
import { getSubmittedActionTaken } from "@/components/vi-incident/viIncidentActionTakenStore";
import { IncidentActionPlanCards } from "@/components/vi-incident/IncidentActionPlanCards";
import { INCIDENT_ACTION_OWNER_PATH } from "./IncidentActionOwnerListPage";

const ViewMoreToggle = ({ open, onClick }: { open: boolean; onClick: () => void }) => (
  <button type="button" onClick={onClick} className="text-sm font-medium text-[#1A1A18] underline underline-offset-2">
    {open ? "View Less" : "View More"}
  </button>
);

// Action Owner: incident detail — summary, incident text, and each action plan assigned to them.
// "Add Action Taken" opens the form while the incident is pending on the action owner; once closed,
// the corrective / preventive actions taken are shown instead.
const IncidentActionOwnerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const incident = useMemo(() => getViIncident(id), [id]);
  // Plans, with any action taken the user has already submitted merged in.
  const plans = useMemo(() => {
    const submitted = getSubmittedActionTaken(id);
    return getViIncidentActionPlans(incident).map((plan) => ({ ...plan, taken: submitted[plan.id] ?? plan.taken }));
  }, [incident, id]);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  // Action can be added until the incident is closed (or still a draft with no plans yet).
  // Hidden once the action taken has been submitted.
  const actionSubmitted = plans.length > 0 && plans.every((plan) => plan.taken);
  const canAddActionTaken =
    !actionSubmitted && !["Draft", "Closed", "Closed By Action Owner"].includes(incident.status);

  return (
    <div className="p-6 min-h-screen">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate(INCIDENT_ACTION_OWNER_PATH)}
          className="flex h-8 w-8 items-center justify-center rounded-[8px] hover:bg-[#F5F4F0]"
          aria-label="Back to incident list"
        >
          <ArrowLeft className="w-4 h-4 text-[rgba(26,26,24,0.68)]" />
        </button>
        <h1 className="text-xl font-semibold text-[#1A1A18]">Incident — {incident.incidentId}</h1>
        <IncidentStatusPill status={incident.status} />
      </div>

      <DetailCard icon={sectionIcon(FileText)} title="Incident Summary" className="mb-5">
        <div className="mb-3 flex justify-end">
          <ViewMoreToggle open={summaryOpen} onClick={() => setSummaryOpen((v) => !v)} />
        </div>
        <FieldGrid
          columns={3}
          fields={[
            { label: "Incident Location", value: incident.incidentLocation },
            { label: "Incident Date & Time", value: `${incident.dateOfIncident} ${incident.timeOfIncident}` },
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
          {incident.incident}
        </p>
      </DetailCard>

      <IncidentActionPlanCards plans={plans} />

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
