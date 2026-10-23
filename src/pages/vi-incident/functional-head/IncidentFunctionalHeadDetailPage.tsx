import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronRight, ClipboardList } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DetailCard } from "@/components/ui/detail-card";
import { AuditStatusPill, DueLabel, auditTabContentClass,
  auditTabTriggerClass, auditTabsListClass,
  auditTabsWrapperClass, sectionIcon } from "@/components/vi-audit/ViAuditUi";
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
    <div className="p-4 sm:p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate(INCIDENT_FUNCTIONAL_HEAD_PATH)}
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Back to incident list"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">Incident — {incident.incidentId}</h1>
        <IncidentStatusPill status={incident.status} />
        <span className="text-sm text-gray-500">{incident.classification}</span>
      </div>

      <Tabs defaultValue="plans" className={`w-full ${auditTabsWrapperClass}`}>
        <TabsList className={auditTabsListClass}>
          <TabsTrigger value="details" className={auditTabTriggerClass}>
            Incident Details
          </TabsTrigger>
          <TabsTrigger value="plans" className={auditTabTriggerClass}>
            Action Plans ({plans.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className={`mt-0 ${auditTabContentClass}`}>
          <IncidentInfoCards incident={incident} />
        </TabsContent>

        {/* Each record opens the action plan detail page */}
        <TabsContent value="plans" className={`mt-0 ${auditTabContentClass}`}>
          <DetailCard icon={sectionIcon(ClipboardList)} title="Action Plans" className="mb-5">
            <div className="mb-4 flex justify-end">
              <span className="rounded-full bg-gray-100 px-[10px] py-[3px] text-[11px] font-medium text-gray-600">
                {closedCount} of {plans.length} closed by action owner
              </span>
            </div>
            <div className="divide-y divide-gray-200 rounded-lg border border-gray-200">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => navigate(`${INCIDENT_FUNCTIONAL_HEAD_PATH}/${incident.id}/plans/${plan.id}`)}
                  className="group flex w-full items-start gap-4 px-4 py-4 text-left transition-colors hover:bg-[#F6F4EE] focus-visible:outline-none focus-visible:bg-[#F6F4EE]"
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-gray-500">{plan.id}</span>
                      <DueLabel label={viIncidentPlanDueLabel(plan)} />
                    </div>
                    <div className="mb-0.5 text-sm font-semibold text-gray-900">{plan.cause}</div>
                    <div className="mb-1 text-xs text-gray-500">{plan.checklistPath}</div>
                    <div className="mt-2">
                      <AuditStatusPill status={plan.taken ? "Closed By Action Owner" : "Pending By Action Owner"} />
                    </div>
                  </div>
                  <ChevronRight className="mt-6 w-4 h-4 shrink-0 text-gray-400 group-hover:text-gray-900" />
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
