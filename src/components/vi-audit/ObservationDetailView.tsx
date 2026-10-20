import { useMemo, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ClipboardCheck, FileText, Image as ImageIcon, ShieldCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DetailCard } from "@/components/ui/detail-card";
import {
  getViAuditDetail,
  type ViActionPlan,
  type ViAuditDetail,
  type ViObservation,
} from "./viAuditData";
import {
  AuditStatusPill,
  ActionPlanRecord,
  FieldGrid,
  auditTabTriggerClass,
  auditTabsListClass,
  sectionIcon,
  AuditLoadingState,
} from "./ViAuditUi";

// Corrective / preventive action-plan records. With `onSelect` each record is clickable
// (Action Owner opens the plan to add the action taken).
const ActionPlanList = ({
  plans,
  onSelect,
}: {
  plans: ViActionPlan[];
  onSelect?: (plan: ViActionPlan) => void;
}) =>
  plans.length === 0 ? (
    <p className="text-sm text-[rgba(26,26,24,0.48)]">No action plans added.</p>
  ) : (
    <div className="divide-y divide-[rgba(26,26,24,0.08)] overflow-hidden rounded-[12px] border border-[rgba(26,26,24,0.09)]">
      {plans.map((plan) => (
        <ActionPlanRecord
          key={plan.id}
          plan={plan}
          clampDescription={!!onSelect}
          onClick={onSelect ? () => onSelect(plan) : undefined}
        />
      ))}
    </div>
  );

export interface ObservationViewContext {
  audit: ViAuditDetail;
  observation: ViObservation;
  /** True once every corrective / preventive plan is closed by the action owner. */
  allPlansClosed: boolean;
}

/**
 * Shared observation detail layout (audit summary + Observation / Corrective / Preventive
 * tabs). Each role page supplies its audit route and its own role behaviour: `onSelectPlan`
 * makes plan records clickable, `footer` renders role actions (e.g. Create Action Plan).
 */
export const ObservationDetailView = ({
  auditId,
  observationId,
  auditPath,
  onSelectPlan,
  footer,
  audit: auditFromApi,
  loading = false,
}: {
  auditId: string | undefined;
  /** Audit from the API. When omitted, the placeholder audit for `auditId` is shown. */
  audit?: ViAuditDetail | null;
  loading?: boolean;
  observationId: string | undefined;
  /** Audit detail route — back arrow and "View More". */
  auditPath: string;
  onSelectPlan?: (plan: ViActionPlan, ctx: ObservationViewContext) => void;
  footer?: (ctx: ObservationViewContext) => ReactNode;
}) => {
  const navigate = useNavigate();
  const placeholderAudit = useMemo(() => getViAuditDetail(auditId), [auditId]);

  if (loading) return <AuditLoadingState message="Loading observation..." />;
  if (auditFromApi === null) return <AuditLoadingState message="Audit not found." onBack={() => navigate(auditPath)} />;
  const audit = auditFromApi ?? placeholderAudit;
  const observation = audit.observations.find((o) => o.id === observationId);

  const backToAudit = () => navigate(auditPath);

  if (!observation) {
    return (
      <div className="p-6 min-h-screen">
        <button
          type="button"
          onClick={backToAudit}
          className="mb-4 inline-flex items-center gap-2 text-sm text-[rgba(26,26,24,0.68)] hover:text-[#1A1A18]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to audit
        </button>
        <p className="text-sm text-[rgba(26,26,24,0.48)]">Observation not found.</p>
      </div>
    );
  }

  const allPlans = [...observation.correctiveActions, ...observation.preventiveActions];
  const allPlansClosed =
    allPlans.length > 0 && allPlans.every((plan) => plan.status === "Closed By Action Owner");

  const ctx: ObservationViewContext = { audit, observation, allPlansClosed };
  const openPlan = onSelectPlan ? (plan: ViActionPlan) => onSelectPlan(plan, ctx) : undefined;

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <button
          type="button"
          onClick={backToAudit}
          className="flex h-8 w-8 items-center justify-center rounded-[8px] hover:bg-[#F5F4F0]"
          aria-label="Back to audit"
        >
          <ArrowLeft className="w-4 h-4 text-[rgba(26,26,24,0.68)]" />
        </button>
        <h1 className="text-xl font-semibold text-[#1A1A18]">Observation — {observation.id}</h1>
        <AuditStatusPill status={observation.status} />
      </div>
      <p className="mb-6 pl-11 text-sm text-[rgba(26,26,24,0.48)]">
        ID: {audit.auditCode}/{observation.id}
      </p>

      {/* Parent audit summary */}
      <DetailCard icon={sectionIcon(ClipboardCheck)} title={audit.auditCode} className="mb-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="text-sm font-semibold text-[#1A1A18]">{audit.auditType} Audit</div>
            <div className="text-sm text-[rgba(26,26,24,0.68)]">{audit.basic.auditLocation}</div>
            <div className="flex items-center gap-2 pt-1 text-sm text-[rgba(26,26,24,0.48)]">
              Status: <AuditStatusPill status={audit.status} />
            </div>
          </div>
          <button
            type="button"
            onClick={backToAudit}
            className="text-sm font-semibold text-[#1A1A18] underline underline-offset-4 hover:text-[rgba(26,26,24,0.68)]"
          >
            View More
          </button>
        </div>
      </DetailCard>

      <Tabs defaultValue="observation" className="w-full">
        <TabsList className={`${auditTabsListClass} mb-5`}>
          <TabsTrigger value="observation" className={auditTabTriggerClass}>
            Observation Details
          </TabsTrigger>
          <TabsTrigger value="corrective" className={auditTabTriggerClass}>
            Corrective Action Plan ({observation.correctiveActions.length})
          </TabsTrigger>
          <TabsTrigger value="preventive" className={auditTabTriggerClass}>
            Preventive Action Plan ({observation.preventiveActions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="observation" className="mt-0">
          <DetailCard icon={sectionIcon(FileText)} title="Observation Details" className="mb-5">
            <div className="space-y-5">
              <div>
                <div className="text-xs text-[rgba(26,26,24,0.48)] mb-1">Observation</div>
                {observation.title && (
                  <div className="mb-0.5 text-sm font-semibold text-[#1A1A18]">{observation.title}</div>
                )}
                {observation.area && (
                  <div className="mb-2 text-xs text-[rgba(26,26,24,0.48)]">{observation.area}</div>
                )}
                <p className="text-sm text-[#1A1A18]">{observation.description}</p>
              </div>
              <FieldGrid
                fields={[
                  { label: "Observation ID", value: observation.id },
                  { label: "Assigned SPOC", value: observation.assignedSpoc },
                  { label: "Functional Head", value: observation.functionalHead },
                ]}
              />
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-[rgba(26,26,24,0.48)]">Attachments</span>
                  <span className="text-xs font-medium text-[rgba(26,26,24,0.68)]">
                    {observation.attachments.length}{" "}
                    {observation.attachments.length === 1 ? "photo" : "photos"}
                  </span>
                </div>
                {observation.attachments.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {(observation.attachmentFiles ?? observation.attachments.map((name) => ({ name, url: "" }))).map(
                      ({ name, url }, fileIndex) => {
                        const isImage = /\.(png|jpe?g)$/i.test(name) || /^data:image\//i.test(url);
                        const tileClass =
                          "flex h-24 w-32 flex-col items-center justify-center gap-1 overflow-hidden rounded-[12px] border border-[rgba(26,26,24,0.09)] bg-[#F5F4F0] px-2 text-center";
                        const content =
                          url && isImage ? (
                            <img src={url} alt={name} className="h-full w-full object-cover" />
                          ) : (
                            <>
                              {/\.pdf$/i.test(name) ? (
                                <FileText className="w-5 h-5 text-[rgba(26,26,24,0.48)]" />
                              ) : (
                                <ImageIcon className="w-5 h-5 text-[rgba(26,26,24,0.48)]" />
                              )}
                              <span className="w-full truncate text-[11px] text-[rgba(26,26,24,0.68)]">{name}</span>
                            </>
                          );
                        // Real attachments (from the API) open in a new tab; placeholders are static tiles.
                        return url ? (
                          <a
                            key={`${name}-${fileIndex}`}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={name}
                            className={`${tileClass} ${url && isImage ? "px-0" : ""} hover:border-[rgba(26,26,24,0.28)]`}
                          >
                            {content}
                          </a>
                        ) : (
                          <div key={`${name}-${fileIndex}`} title={name} className={tileClass}>
                            {content}
                          </div>
                        );
                      },
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-[rgba(26,26,24,0.48)]">No attachments.</p>
                )}
              </div>
            </div>
          </DetailCard>
        </TabsContent>

        <TabsContent value="corrective" className="mt-0">
          <DetailCard icon={sectionIcon(ShieldCheck)} title="Corrective Action Plan" className="mb-5">
            <ActionPlanList plans={observation.correctiveActions} onSelect={openPlan} />
          </DetailCard>
        </TabsContent>

        <TabsContent value="preventive" className="mt-0">
          <DetailCard icon={sectionIcon(ShieldCheck)} title="Preventive Action Plan" className="mb-5">
            <ActionPlanList plans={observation.preventiveActions} onSelect={openPlan} />
          </DetailCard>
        </TabsContent>
      </Tabs>

      {footer?.(ctx)}
    </div>
  );
};
