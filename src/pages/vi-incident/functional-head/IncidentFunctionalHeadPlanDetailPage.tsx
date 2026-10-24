import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ClipboardCheck, FileText, ShieldCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DetailCard } from "@/components/ui/detail-card";
import {
  AuditLoadingState,
  AuditStatusPill,
  DueLabel,
  FieldGrid,
  auditTabTriggerClass,
  auditTabsListClass,
  sectionIcon,
  auditTabsWrapperClass,
  auditTabContentClass,
} from "@/components/vi-audit/ViAuditUi";
import { IncidentStatusPill } from "@/components/vi-incident/IncidentListView";
import {
  AssignmentTaken,
  OwnerStatusList,
  PlanStatusPill,
  planTargetLabel,
} from "@/components/vi-incident/IncidentActionPlanCards";
import { PendingWithLine } from "@/components/vi-incident/IncidentDetailView";
import { useViIncidentDetail } from "@/components/vi-incident/viIncidentApi";
import {
  groupPlansByItem,
  isPlanClosed,
  pendingOwnerNames,
  viIncidentPlanDueLabel,
  type ViIncidentActionPlan,
} from "@/components/vi-incident/viIncidentData";
import { INCIDENT_FUNCTIONAL_HEAD_PATH } from "./IncidentFunctionalHeadListPage";

// One corrective / preventive plan: text, target date, due label and status, every owner with their
// own status (whose end it's pending on) — followed by the action each owner took once submitted.
const PlanRecord = ({ plan }: { plan: ViIncidentActionPlan }) => {
  const taken = plan.assignments.filter((a) => a.actionTaken && a.status === "closed");
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <div className="px-4 py-4">
        <div className="mb-1 flex items-center justify-between gap-3">
          <PlanStatusPill plan={plan} />
          <DueLabel label={viIncidentPlanDueLabel([plan])} />
        </div>
        <p className="mt-2 text-sm text-gray-900 whitespace-pre-wrap">{plan.description || "-"}</p>
        <div className="mt-3">
          <FieldGrid
            columns={2}
            fields={[
              { label: "Target Date", value: planTargetLabel(plan) },
              ...(plan.extensionReason ? [{ label: "Reason for Extension", value: plan.extensionReason }] : []),
            ]}
          />
        </div>
        <div className="mt-4">
          <OwnerStatusList plan={plan} />
        </div>
      </div>
      {taken.map((assignment) => (
        <AssignmentTaken
          key={assignment.id}
          assignment={assignment}
          showOwner={plan.assignments.length > 1}
          tone="inset"
        />
      ))}
    </div>
  );
};

// Functional Head: one root cause's action plans — incident summary + Root Cause / Corrective /
// Preventive tabs (read-only). `planId` is the checklist item (root cause) id.
const IncidentFunctionalHeadPlanDetailPage = () => {
  const { id, planId } = useParams();
  const navigate = useNavigate();
  const { incident, loading } = useViIncidentDetail(id);
  const group = useMemo(
    () => (incident ? groupPlansByItem(incident.checklistItems, incident.actionPlans).find((g) => g.item.id === planId) : undefined),
    [incident, planId],
  );
  const incidentPath = `${INCIDENT_FUNCTIONAL_HEAD_PATH}/${id}`;

  if (loading) return <AuditLoadingState message="Loading action plan..." />;
  if (!incident || !group) {
    return <AuditLoadingState message="Action plan not found." onBack={() => navigate(incidentPath)} />;
  }

  const plans = [...group.corrective, ...group.preventive];
  const closed = plans.every(isPlanClosed);

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <button
          type="button"
          onClick={() => navigate(incidentPath)}
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Back to incident"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">Action Plan — {group.item.name}</h1>
        <AuditStatusPill status={closed ? "Closed By Action Owner" : "Pending By Action Owner"} />
      </div>
      <p className="pl-11 text-sm text-gray-500">Incident {incident.incidentNo}</p>
      <PendingWithLine names={pendingOwnerNames(plans)} className="mt-1 pl-11" />
      <div className="mb-6" />

      {/* Parent incident summary */}
      <DetailCard icon={sectionIcon(ClipboardCheck)} title={`Incident ${incident.incidentNo}`} className="mb-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="text-sm font-semibold text-gray-900">{incident.classification}</div>
            <div className="text-sm text-gray-600">{incident.incidentLocation}</div>
            <div className="flex items-center gap-2 pt-1 text-sm text-gray-500">
              Status: <IncidentStatusPill status={incident.status} />
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate(incidentPath)}
            className="text-sm font-semibold text-gray-900 underline underline-offset-4 hover:text-gray-600"
          >
            View More
          </button>
        </div>
      </DetailCard>

      <Tabs defaultValue="root-cause" className={`w-full ${auditTabsWrapperClass}`}>
        <TabsList className={auditTabsListClass}>
          <TabsTrigger value="root-cause" className={auditTabTriggerClass}>
            Root Cause Details
          </TabsTrigger>
          <TabsTrigger value="corrective" className={auditTabTriggerClass}>
            Corrective Action Plan ({group.corrective.length})
          </TabsTrigger>
          <TabsTrigger value="preventive" className={auditTabTriggerClass}>
            Preventive Action Plan ({group.preventive.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="root-cause" className={`mt-0 ${auditTabContentClass}`}>
          <DetailCard icon={sectionIcon(FileText)} title="Root Cause Details" className="mb-5">
            <div className="space-y-5">
              <div>
                <div className="text-xs text-gray-500 mb-1">Checklist Item</div>
                <div className="mb-0.5 text-sm font-semibold text-gray-900">{group.item.name}</div>
                <div className="text-xs text-gray-500">{group.item.path}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Incident</div>
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{incident.incident || "-"}</p>
              </div>
              <FieldGrid
                fields={[
                  { label: "Investigation Summary", value: incident.investigation.summary },
                  { label: "Assigned SPOC", value: incident.spoc },
                  { label: "Functional Head", value: incident.functionalHead },
                ]}
              />
            </div>
          </DetailCard>
        </TabsContent>

        {(["corrective", "preventive"] as const).map((type) => (
          <TabsContent key={type} value={type} className="mt-0">
            <DetailCard
              icon={sectionIcon(ShieldCheck)}
              title={type === "corrective" ? "Corrective Action Plan" : "Preventive Action Plan"}
              className="mb-5"
            >
              <div className="space-y-4">
                {group[type].length ? (
                  group[type].map((plan) => <PlanRecord key={plan.id} plan={plan} />)
                ) : (
                  <p className="text-sm text-gray-500">No plan added.</p>
                )}
              </div>
            </DetailCard>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default IncidentFunctionalHeadPlanDetailPage;
