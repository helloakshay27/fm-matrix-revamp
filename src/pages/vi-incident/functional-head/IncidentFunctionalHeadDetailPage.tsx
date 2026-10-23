import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronRight, ClipboardList } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DetailCard } from "@/components/ui/detail-card";
import { AuditStatusPill, DueLabel, auditTabTriggerClass, auditTabsListClass, sectionIcon } from "@/components/vi-audit/ViAuditUi";
import { IncidentInfoCards } from "@/components/vi-incident/IncidentDetailView";
import { IncidentStatusPill } from "@/components/vi-incident/IncidentListView";
import { getIncidentPlansWithActionTaken } from "@/components/vi-incident/viIncidentActionTakenStore";
import { getViIncident, viIncidentPlanDueLabel } from "@/components/vi-incident/viIncidentData";
import { INCIDENT_FUNCTIONAL_HEAD_PATH } from "./IncidentFunctionalHeadListPage";

// Functional Head: lands on the action plans list (like the audit Functional Head's observations);
// the incident details are one tab away. Read-only.
const IncidentFunctionalHeadDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const incident = useMemo(() => getViIncident(id), [id]);
  const plans = useMemo(() => getIncidentPlansWithActionTaken(id), [id]);
  const closedCount = plans.filter((plan) => plan.taken).length;

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate(INCIDENT_FUNCTIONAL_HEAD_PATH)}
          className="flex h-8 w-8 items-center justify-center rounded-[8px] hover:bg-[#F5F4F0]"
          aria-label="Back to incident list"
        >
          <ArrowLeft className="w-4 h-4 text-[rgba(26,26,24,0.68)]" />
        </button>
        <h1 className="text-xl font-semibold text-[#1A1A18]">Incident — {incident.incidentId}</h1>
        <IncidentStatusPill status={incident.status} />
        <span className="text-sm text-[rgba(26,26,24,0.48)]">{incident.classification}</span>
      </div>

      <Tabs defaultValue="plans" className="w-full">
        <TabsList className={`${auditTabsListClass} mb-5`}>
          <TabsTrigger value="details" className={auditTabTriggerClass}>
            Incident Details
          </TabsTrigger>
          <TabsTrigger value="plans" className={auditTabTriggerClass}>
            Action Plans ({plans.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-0">
          <IncidentInfoCards incident={incident} />
        </TabsContent>

        {/* Each record opens the action plan detail page */}
        <TabsContent value="plans" className="mt-0">
          <DetailCard icon={sectionIcon(ClipboardList)} title="Action Plans" className="mb-5">
            <div className="mb-4 flex justify-end">
              <span className="rounded-full bg-[#F5F4F0] px-[10px] py-[3px] text-[11px] font-medium text-[rgba(26,26,24,0.68)]">
                {closedCount} of {plans.length} closed by action owner
              </span>
            </div>
            <div className="divide-y divide-[rgba(26,26,24,0.08)] rounded-[12px] border border-[rgba(26,26,24,0.09)]">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => navigate(`${INCIDENT_FUNCTIONAL_HEAD_PATH}/${incident.id}/plans/${plan.id}`)}
                  className="group flex w-full items-start gap-4 px-4 py-4 text-left transition-colors hover:bg-[#F7F6F2] focus-visible:outline-none focus-visible:bg-[#F7F6F2]"
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-[rgba(26,26,24,0.48)]">{plan.id}</span>
                      <DueLabel label={viIncidentPlanDueLabel(plan)} />
                    </div>
                    <div className="mb-0.5 text-sm font-semibold text-[#1A1A18]">{plan.cause}</div>
                    <div className="mb-1 text-xs text-[rgba(26,26,24,0.48)]">{plan.checklistPath}</div>
                    <div className="mt-2">
                      <AuditStatusPill status={plan.taken ? "Closed By Action Owner" : "Pending By Action Owner"} />
                    </div>
                  </div>
                  <ChevronRight className="mt-6 w-4 h-4 shrink-0 text-[rgba(26,26,24,0.3)] group-hover:text-[#1A1A18]" />
                </button>
              ))}
            </div>
          </DetailCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IncidentFunctionalHeadDetailPage;
