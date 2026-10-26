import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight, ClipboardList } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DetailCard } from "@/components/ui/detail-card";
import {
  AuditLoadingState,
  AuditStatusPill,
  DueLabel,
  auditTabTriggerClass,
  auditTabsListClass,
  sectionIcon,
} from "@/components/vi-audit/ViAuditUi";
import {
  IncidentHeader,
  IncidentInfoCards,
  IncidentInvestigationCard,
  PendingWithLine,
} from "@/components/vi-incident/IncidentDetailView";
import { useViIncidentDetail } from "@/components/vi-incident/viIncidentApi";
import {
  groupPlansByItem,
  isPlanClosed,
  pendingOwnerNames,
  viIncidentPlanDueLabel,
} from "@/components/vi-incident/viIncidentData";
import { INCIDENT_FUNCTIONAL_HEAD_PATH } from "./IncidentFunctionalHeadListPage";

// Functional Head: lands on the action plans list (like the audit Functional Head's observations);
// the incident details are one tab away. Read-only. One record per root cause, covering its
// corrective and preventive plans.
const IncidentFunctionalHeadDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { incident, loading } = useViIncidentDetail(id);
  const groups = useMemo(
    () => (incident ? groupPlansByItem(incident.checklistItems, incident.actionPlans) : []),
    [incident],
  );

  if (loading) return <AuditLoadingState message="Loading incident..." />;
  if (!incident) {
    return <AuditLoadingState message="Incident not found." onBack={() => navigate(INCIDENT_FUNCTIONAL_HEAD_PATH)} />;
  }

  const isGroupClosed = (group: (typeof groups)[number]) =>
    [...group.corrective, ...group.preventive].every(isPlanClosed);
  const closedCount = groups.filter(isGroupClosed).length;

  return (
    <div className="p-6 min-h-screen">
      <IncidentHeader incident={incident} onBack={() => navigate(INCIDENT_FUNCTIONAL_HEAD_PATH)}>
        <span className="text-sm text-[rgba(26,26,24,0.48)]">{incident.classification}</span>
      </IncidentHeader>

      <Tabs defaultValue="plans" className="w-full">
        <TabsList className={`${auditTabsListClass} mb-5`}>
          <TabsTrigger value="details" className={auditTabTriggerClass}>
            Incident Details
          </TabsTrigger>
          <TabsTrigger value="plans" className={auditTabTriggerClass}>
            Action Plans ({groups.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-0">
          <IncidentInfoCards incident={incident} />
          <IncidentInvestigationCard incident={incident} />
        </TabsContent>

        {/* Each record opens the action plan detail page */}
        <TabsContent value="plans" className="mt-0">
          <DetailCard icon={sectionIcon(ClipboardList)} title="Action Plans" className="mb-5">
            {groups.length ? (
              <>
                <div className="mb-4 flex justify-end">
                  <span className="rounded-full bg-[#F5F4F0] px-[10px] py-[3px] text-[11px] font-medium text-[rgba(26,26,24,0.68)]">
                    {closedCount} of {groups.length} closed by action owner
                  </span>
                </div>
                <div className="divide-y divide-[rgba(26,26,24,0.08)] rounded-[12px] border border-[rgba(26,26,24,0.09)]">
                  {groups.map((group, index) => (
                    <button
                      key={group.item.id}
                      type="button"
                      onClick={() => navigate(`${INCIDENT_FUNCTIONAL_HEAD_PATH}/${incident.id}/plans/${group.item.id}`)}
                      className="group flex w-full items-start gap-4 px-4 py-4 text-left transition-colors hover:bg-[#F7F6F2] focus-visible:outline-none focus-visible:bg-[#F7F6F2]"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center justify-between gap-3">
                          <span className="text-xs font-semibold text-[rgba(26,26,24,0.48)]">{`CL0${index + 1}`}</span>
                          <DueLabel label={viIncidentPlanDueLabel([...group.corrective, ...group.preventive])} />
                        </div>
                        <div className="mb-0.5 text-sm font-semibold text-[#1A1A18]">{group.item.name}</div>
                        <div className="mb-1 text-xs text-[rgba(26,26,24,0.48)]">{group.item.path}</div>
                        <div className="mt-2">
                          <AuditStatusPill
                            status={isGroupClosed(group) ? "Closed By Action Owner" : "Pending By Action Owner"}
                          />
                        </div>
                        <PendingWithLine
                          names={pendingOwnerNames([...group.corrective, ...group.preventive])}
                          className="mt-2"
                        />
                      </div>
                      <ChevronRight className="mt-6 w-4 h-4 shrink-0 text-[rgba(26,26,24,0.3)] group-hover:text-[#1A1A18]" />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-[rgba(26,26,24,0.48)]">
                {incident.investigation.submitted
                  ? "No action plans were created for this incident."
                  : "The SPOC has not submitted the action plan yet."}
              </p>
            )}
          </DetailCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IncidentFunctionalHeadDetailPage;
