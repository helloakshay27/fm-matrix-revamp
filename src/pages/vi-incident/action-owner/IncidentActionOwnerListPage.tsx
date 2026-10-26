import { useCallback, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileEdit,
  ListChecks,
  ShieldCheck,
  SquareStack,
} from "lucide-react";
import { IncidentSelectField } from "@/components/vi-incident/IncidentFormFields";
import { IncidentListView, type IncidentStatsBuilder } from "@/components/vi-incident/IncidentListView";
import {
  dashboardAssignmentStatusOptions,
  dashboardCount,
  dashboardGroupCount,
  isMyAssignment,
  useViIncidentMyDraftIncidentIds,
} from "@/components/vi-incident/viIncidentApi";
import { hasMyActionDraft, type ViIncidentRecord } from "@/components/vi-incident/viIncidentData";

export const INCIDENT_ACTION_OWNER_PATH = "/safety/vi-incident/action-owner";

// Action owner dashboard (GET /vi_incidents/action_owner_dashboard.json): counts are per assignment,
// plus the action plans and incidents they belong to.
const buildActionOwnerStats: IncidentStatsBuilder = (d) => [
  { title: "Total Incidents", value: dashboardCount(d, "total_assigned_incidents"), icon: ClipboardList },
  { title: "Total Action Plans", value: dashboardCount(d, "total_assigned_action_plans"), icon: SquareStack },
  { title: "Total Actions", value: dashboardCount(d, "total_assigned_actions"), icon: ListChecks },
  { title: "Pending Actions", value: dashboardCount(d, "pending_actions"), icon: Clock },
  { title: "Draft Actions", value: dashboardCount(d, "draft_actions"), icon: FileEdit },
  { title: "Completed Actions", value: dashboardCount(d, "completed_actions"), icon: CheckCircle2 },
  {
    title: "Pending By Action Owner",
    value: dashboardCount(d, "pending_by_action_owner") || dashboardGroupCount(d, "workflow", "pending_by_action_owner"),
    icon: AlertTriangle,
  },
  {
    title: "Closed By Action Owner",
    value: dashboardCount(d, "closed_by_action_owner") || dashboardGroupCount(d, "workflow", "closed_by_action_owner"),
    icon: ShieldCheck,
  },
];

// Action Owner: incidents with action plans assigned to them (GET /vi_incidents/action_owner_incidents.json),
// optionally narrowed by the status of their own assignments (assignment_status). Open one to add the action taken;
// a saved draft can be edited straight from the list.
const IncidentActionOwnerListPage = () => {
  const [assignmentStatus, setAssignmentStatus] = useState("");
  // The owner's own assignments say which incidents hold a draft, without loading each incident.
  const draftIncidentIds = useViIncidentMyDraftIncidentIds();
  // Or the row's my_assignments / plans (the incident detail, when the list row has neither).
  const editPath = useCallback(
    (incident: ViIncidentRecord) =>
      incident.storedStatus !== "closed" &&
      (draftIncidentIds.has(String(incident.id)) || hasMyActionDraft(incident, isMyAssignment(incident)))
        ? `${INCIDENT_ACTION_OWNER_PATH}/${incident.id}/action-taken`
        : null,
    [draftIncidentIds],
  );
  // Rows nothing above has marked as a draft and whose list data has no assignments: read the detail.
  const needsDetail = useCallback(
    (incident: ViIncidentRecord) =>
      incident.storedStatus !== "closed" &&
      !draftIncidentIds.has(String(incident.id)) &&
      !incident.myAssignmentStatuses.length &&
      !incident.actionPlans.length,
    [draftIncidentIds],
  );
  return (
    <IncidentListView
      role="action_owner"
      title="Incident — Action Owner"
      detailBasePath={INCIDENT_ACTION_OWNER_PATH}
      storageKey="vi-incident-list-action-owner"
      buildStats={buildActionOwnerStats}
      editPath={editPath}
      needsDetail={needsDetail}
      extraQuery={{ assignment_status: assignmentStatus }}
      // Options come from the action owner dashboard's counters (pending / draft / completed actions,
      // with live counts); "All actions" only clears the filter.
      leftActions={(dashboard) => {
        const statusOptions = dashboardAssignmentStatusOptions(dashboard);
        return (
          <div className="w-56">
            <IncidentSelectField
              label="My actions"
              value={assignmentStatus}
              onChange={setAssignmentStatus}
              options={statusOptions.length ? [{ value: "", label: "All actions" }, ...statusOptions] : []}
              placeholder="All actions"
            />
          </div>
        );
      }}
    />
  );
};

export default IncidentActionOwnerListPage;
