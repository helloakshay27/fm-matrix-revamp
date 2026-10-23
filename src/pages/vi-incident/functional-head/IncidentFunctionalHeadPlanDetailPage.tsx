import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ClipboardCheck, FileText, Paperclip, ShieldCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DetailCard } from "@/components/ui/detail-card";
import {
  AuditStatusPill,
  DueLabel,
  FieldGrid,
  auditTabContentClass,
  auditTabTriggerClass,
  auditTabsListClass,
  auditTabsWrapperClass,
  sectionIcon,
} from "@/components/vi-audit/ViAuditUi";
import { IncidentStatusPill } from "@/components/vi-incident/IncidentListView";
import { getIncidentPlansWithActionTaken } from "@/components/vi-incident/viIncidentActionTakenStore";
import { getViIncident, viIncidentPlanDueLabel } from "@/components/vi-incident/viIncidentData";
import { INCIDENT_FUNCTIONAL_HEAD_PATH } from "./IncidentFunctionalHeadListPage";

// One corrective / preventive record: ID, due label, plan text, owner, target date and status —
// followed by the action taken (text, closure date, attachments) once the action owner submitted it.
const PlanRecord = ({
  planId,
  text,
  actionOwner,
  targetDate,
  dueLabel,
  closed,
  taken,
}: {
  planId: string;
  text: string;
  actionOwner: string;
  targetDate: string;
  dueLabel?: string;
  closed: boolean;
  taken?: { text: string; closureDate: string; attachments: string[] };
}) => (
  <div className="overflow-hidden rounded-lg border border-gray-200">
    <div className="px-4 py-4">
      <div className="mb-1 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-gray-500">{planId}</span>
        <DueLabel label={dueLabel} />
      </div>
      <p className="text-sm text-gray-900">{text}</p>
      <div className="mt-3 grid grid-cols-2 gap-4 sm:max-w-md">
        <div>
          <div className="text-xs text-gray-500 mb-1">Action Owner</div>
          <div className="text-sm font-medium text-gray-900">{actionOwner}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Target Date</div>
          <div className="text-sm font-medium text-gray-900">{targetDate}</div>
        </div>
      </div>
      <div className="mt-3">
        <AuditStatusPill status={closed ? "Closed By Action Owner" : "Pending By Action Owner"} />
      </div>
    </div>
    {taken && (
      <div className="border-t border-gray-200 bg-[#F6F4EE] px-4 py-4">
        <div className="mb-1 text-xs font-semibold text-gray-500">Action Taken</div>
        <p className="text-sm text-gray-900">{taken.text}</p>
        <div className="mt-3">
          <FieldGrid columns={2} fields={[{ label: "Closure Date", value: taken.closureDate }]} />
        </div>
        {taken.attachments.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {taken.attachments.map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs text-gray-900"
              >
                <Paperclip className="w-3 h-3" />
                {name}
              </span>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
);

// Functional Head: action plan detail — incident summary + Root Cause / Corrective / Preventive tabs (read-only).
const IncidentFunctionalHeadPlanDetailPage = () => {
  const { id, planId } = useParams();
  const navigate = useNavigate();
  const incident = useMemo(() => getViIncident(id), [id]);
  const plan = useMemo(() => getIncidentPlansWithActionTaken(id).find((p) => p.id === planId), [id, planId]);
  const incidentPath = `${INCIDENT_FUNCTIONAL_HEAD_PATH}/${id}`;

  if (!plan) {
    return (
      <div className="p-4 sm:p-6 min-h-screen">
        <button
          type="button"
          onClick={() => navigate(incidentPath)}
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to incident
        </button>
        <p className="text-sm text-gray-500">Action plan not found.</p>
      </div>
    );
  }

  const closed = Boolean(plan.taken);
  const dueLabel = viIncidentPlanDueLabel(plan);

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
        <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">Action Plan — {plan.id}</h1>
        <AuditStatusPill status={closed ? "Closed By Action Owner" : "Pending By Action Owner"} />
      </div>
      <p className="mb-6 pl-11 text-sm text-gray-500">
        ID: Incident{incident.incidentId}/{plan.id}
      </p>

      {/* Parent incident summary */}
      <DetailCard icon={sectionIcon(ClipboardCheck)} title={`Incident${incident.incidentId}`} className="mb-5">
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
            Corrective Action Plan (1)
          </TabsTrigger>
          <TabsTrigger value="preventive" className={auditTabTriggerClass}>
            Preventive Action Plan (1)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="root-cause" className={`mt-0 ${auditTabContentClass}`}>
          <DetailCard icon={sectionIcon(FileText)} title="Root Cause Details" className="mb-5">
            <div className="space-y-5">
              <div>
                <div className="text-xs text-gray-500 mb-1">Checklist Item</div>
                <div className="mb-0.5 text-sm font-semibold text-gray-900">{plan.cause}</div>
                <div className="text-xs text-gray-500">{plan.checklistPath}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Incident</div>
                <p className="text-sm text-gray-900">{incident.incident}</p>
              </div>
              <FieldGrid
                fields={[
                  { label: "Action Plan ID", value: plan.id },
                  { label: "Assigned SPOC", value: incident.spoc },
                  { label: "Functional Head", value: incident.functionalHead },
                ]}
              />
            </div>
          </DetailCard>
        </TabsContent>

        <TabsContent value="corrective" className={`mt-0 ${auditTabContentClass}`}>
          <DetailCard icon={sectionIcon(ShieldCheck)} title="Corrective Action Plan" className="mb-5">
            <PlanRecord
              planId={plan.id}
              text={plan.corrective}
              actionOwner={plan.actionOwner}
              targetDate={plan.targetDate}
              dueLabel={dueLabel}
              closed={closed}
              taken={
                plan.taken && {
                  text: plan.taken.corrective,
                  closureDate: plan.taken.closureDate,
                  attachments: plan.taken.attachments,
                }
              }
            />
          </DetailCard>
        </TabsContent>

        <TabsContent value="preventive" className={`mt-0 ${auditTabContentClass}`}>
          <DetailCard icon={sectionIcon(ShieldCheck)} title="Preventive Action Plan" className="mb-5">
            <PlanRecord
              planId={plan.id}
              text={plan.preventive}
              actionOwner={plan.actionOwner}
              targetDate={plan.targetDate}
              dueLabel={dueLabel}
              closed={closed}
              taken={
                plan.taken && {
                  text: plan.taken.preventive,
                  closureDate: plan.taken.closureDate,
                  attachments: plan.taken.attachments,
                }
              }
            />
          </DetailCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IncidentFunctionalHeadPlanDetailPage;
