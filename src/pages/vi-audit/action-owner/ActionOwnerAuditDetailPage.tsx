import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronRight, ClipboardList, FileText, Paperclip, User } from "lucide-react";
import { toast } from "sonner";
import { getAuthHeader, getFullUrl } from "@/config/apiConfig";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DetailCard } from "@/components/ui/detail-card";
import {
  AuditLoadingState,
  AuditStatusPill,
  CapaProgressPill,
  DueLabel,
  FieldGrid,
  auditTabTriggerClass,
  auditTabsListClass,
  sectionIcon,
} from "@/components/vi-audit/ViAuditUi";
import { localTodayIso } from "@/components/vi-audit/viAuditData";
import { arr, obj, personName, text, toAttachment } from "@/components/vi-audit/useViAuditDetail";

const LIST_PATH = "/safety/audit/action-owner";
const CLOSED_BY_ACTION_OWNER = "capa_plan_closed_by_action_owner";

type Raw = Record<string, unknown>;

interface AoPlan {
  id: string;
  actionNo: string;
  actionType: string;
  description: string;
  targetDate: string;
  extendedTargetDate: string;
  extensionReason: string;
  capaProgress: string;
  capaProgressKey: string;
  capaClosure: string;
  closedByMe: boolean;
  capasCount: number;
  closedCapasCount: number;
}

interface AoObservation {
  id: string;
  observationNo: string;
  observation: string;
  spoc: string;
  functionalHead: string;
  classification: string;
  category: string;
  subCategory: string;
  vendorName: string;
  subVendorName: string;
  people: string[];
  attachments: { name: string; url: string }[];
  plans: AoPlan[];
}

interface AoAudit {
  id: string;
  auditNo: string;
  auditType: string;
  status: string;
  auditDate: string;
  auditorName: string;
  auditorEmail: string;
  auditorDesignation: string;
  cluster: string;
  circle: string;
  workLocation: string;
  facilityType: string;
  department: string;
  auditLocation: string;
  observations: AoObservation[];
}

// "capa_plan_not_started" / "open" -> "Capa Plan Not Started" / "Open"
const humanize = (value: string) =>
  value
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

const toPlan = (p: Raw): AoPlan => ({
  id: text(p.id),
  actionNo: text(p.action_no, p.id),
  actionType: text(p.action_type).toLowerCase(),
  description: text(p.action_plan, p.description),
  targetDate: text(p.target_date),
  extendedTargetDate: text(p.extend_target_date),
  extensionReason: text(p.extension_reason),
  capaProgress: text(p.capa_progress) || humanize(text(p.capa_progress_key)),
  capaProgressKey: text(p.capa_progress_key),
  capaClosure: text(p.capa_closure) || humanize(text(p.capa_closure_key)),
  closedByMe: text(p.capa_closure_key) === CLOSED_BY_ACTION_OWNER,
  capasCount: Number(p.capas_count) || arr(p.capas).length,
  closedCapasCount: Number(p.closed_capas_count) || 0,
});

const toObservation = (o: Raw): AoObservation => ({
  id: text(o.id),
  observationNo: text(o.observation_no, o.id),
  observation: text(o.observation),
  spoc: text(personName(o.spoc), o.spoc_name),
  functionalHead: text(personName(o.functional_head), o.functional_head_name),
  classification: text(o.classification_name, o.classification_other),
  category: text(o.category_name, o.category_other),
  subCategory: text(o.sub_category_name, o.sub_category_other),
  vendorName: text(o.vendor_name),
  subVendorName: text(o.sub_vendor_name),
  people: arr(o.people_interacted_with).map((p) =>
    text(p.type) === "other" ? [text(p.name), text(p.role)].filter(Boolean).join(" — ") : text(p.name, p.email),
  ),
  attachments: arr(o.attachments).map(toAttachment),
  plans: arr(o.action_plans).map(toPlan),
});

// GET /vi_audits/action_owner_audits.json returns { data: [audit] }; each observation carries only
// the action plans where the logged-in user is the Responsible Person.
const toAudit = (a: Raw): AoAudit => {
  const auditor = obj(a.auditor);
  return {
    id: text(a.id),
    auditNo: text(a.audit_no, a.id),
    auditType: humanize(text(a.audit_type)),
    status: humanize(text(a.status)),
    auditDate: text(a.audit_date),
    auditorName: text(a.auditor_name, personName(auditor)),
    auditorEmail: text(a.auditor_email, auditor.email),
    auditorDesignation: text(a.auditor_designation),
    cluster: text(a.cluster_name),
    circle: text(a.circle_name),
    workLocation: text(a.work_location_name),
    facilityType: text(a.visit_business_area_name),
    department: text(a.department_name),
    auditLocation: text(a.audit_location),
    observations: arr(a.observations).map(toObservation),
  };
};

// The observation is closed for me once every plan assigned to me is closed by me.
const observationStatus = (o: AoObservation) =>
  o.plans.length > 0 && o.plans.every((p) => p.closedByMe) ? "Closed By Action Owner" : "Pending By Action Owner";

const isBreached = (p: AoPlan) => {
  const due = (p.extendedTargetDate || p.targetDate).slice(0, 10);
  return !!due && !p.closedByMe && due < localTodayIso();
};

// Action Owner: audit detail — GET /vi_audits/action_owner_audits.json?q[id_eq]=:id
const ActionOwnerAuditDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [audit, setAudit] = useState<AoAudit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    (async () => {
      try {
        const params = new URLSearchParams({ "q[id_eq]": id });
        const response = await fetch(getFullUrl(`/vi_audits/action_owner_audits.json?${params}`), {
          headers: { Authorization: getAuthHeader() },
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
        const json = obj(await response.json());
        const found = arr(json.data).find((a) => text(a.id) === id);
        setAudit(found ? toAudit(found) : null);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Failed to load action owner audit:", error);
        toast.error("Failed to load audit details");
        setAudit(null);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [id]);

  if (loading) return <AuditLoadingState message="Loading audit..." />;
  if (!audit) return <AuditLoadingState message="Audit not found." onBack={() => navigate(LIST_PATH)} />;

  const auditPath = `${LIST_PATH}/${audit.id}`;
  const closedCount = audit.observations.filter((o) => observationStatus(o) === "Closed By Action Owner").length;

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate(LIST_PATH)}
          className="flex h-8 w-8 items-center justify-center rounded-[8px] hover:bg-[#F5F4F0]"
          aria-label="Back to audit list"
        >
          <ArrowLeft className="w-4 h-4 text-[rgba(26,26,24,0.68)]" />
        </button>
        <h1 className="text-xl font-semibold text-[#1A1A18]">Audit — {audit.auditNo}</h1>
        {audit.status && <AuditStatusPill status={audit.status} />}
        {audit.auditType && <span className="text-sm text-[rgba(26,26,24,0.48)]">{audit.auditType} Audit</span>}
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className={`${auditTabsListClass} mb-5`}>
          <TabsTrigger value="details" className={auditTabTriggerClass}>
            Audit Details
          </TabsTrigger>
          <TabsTrigger value="observations" className={auditTabTriggerClass}>
            Observations ({audit.observations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-0">
          <DetailCard icon={sectionIcon(User)} title="Auditor Details" className="mb-5">
            <FieldGrid
              fields={[
                { label: "Name", value: audit.auditorName },
                { label: "Mail ID", value: audit.auditorEmail },
                { label: "Designation", value: audit.auditorDesignation },
              ]}
            />
          </DetailCard>

          <DetailCard icon={sectionIcon(FileText)} title="Basic Details" className="mb-5">
            <FieldGrid
              columns={4}
              fields={[
                { label: "Audit ID", value: audit.auditNo },
                { label: "Date of Audit", value: audit.auditDate },
                { label: "Circle", value: audit.cluster },
                { label: "Personnel Area", value: audit.circle },
                { label: "Work Location", value: audit.workLocation },
                { label: "Type of Facility", value: audit.facilityType },
                { label: "Function", value: audit.department },
                { label: "Audit Location", value: audit.auditLocation, span: true },
              ]}
            />
          </DetailCard>
        </TabsContent>

        <TabsContent value="observations" className="mt-0">
          <DetailCard
            icon={sectionIcon(ClipboardList)}
            title="Observations"
            className="mb-5"
            headerActions={
              <span className="rounded-full bg-[#F5F4F0] px-[10px] py-[3px] text-[11px] font-medium text-[rgba(26,26,24,0.68)]">
                {closedCount} of {audit.observations.length} closed by action owner
              </span>
            }
          >
            {audit.observations.length === 0 ? (
              <p className="py-8 text-center text-sm text-[rgba(26,26,24,0.48)]">No observations assigned to you.</p>
            ) : (
              <div className="space-y-4">
                {audit.observations.map((obs) => (
                  <div key={obs.id} className="rounded-[12px] border border-[rgba(26,26,24,0.09)]">
                    {/* Observation summary — opens the observation detail */}
                    <button
                      type="button"
                      onClick={() => navigate(`${auditPath}/observations/${obs.id}`)}
                      className="group flex w-full items-start gap-4 px-4 py-4 text-left transition-colors hover:bg-[#F7F6F2]"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center justify-between gap-3">
                          <span className="text-xs font-semibold text-[rgba(26,26,24,0.48)]">{obs.observationNo}</span>
                          <AuditStatusPill status={observationStatus(obs)} />
                        </div>
                        <p className="line-clamp-3 text-sm text-[#1A1A18]">{obs.observation}</p>
                      </div>
                      <ChevronRight className="mt-6 w-4 h-4 shrink-0 text-[rgba(26,26,24,0.3)] group-hover:text-[#1A1A18]" />
                    </button>

                    <div className="border-t border-[rgba(26,26,24,0.08)] px-4 py-4">
                      <FieldGrid
                        columns={3}
                        fields={[
                          { label: "Classification", value: obs.classification },
                          { label: "Category", value: obs.category },
                          { label: "Sub Category", value: obs.subCategory },
                          { label: "Vendor Name", value: obs.vendorName },
                          { label: "Sub Vendor Name", value: obs.subVendorName },
                          { label: "SPOC", value: obs.spoc },
                          { label: "Functional Head", value: obs.functionalHead },
                          { label: "People Interacted With", value: obs.people.join(", "), span: true },
                        ]}
                      />
                      {obs.attachments.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {obs.attachments.map((file, i) => (
                            <a
                              key={`${file.url}-${i}`}
                              href={file.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-[8px] border border-[rgba(26,26,24,0.09)] px-2.5 py-1 text-xs text-[rgba(26,26,24,0.68)] hover:bg-[#F7F6F2]"
                            >
                              <Paperclip className="w-3.5 h-3.5" />
                              <span className="max-w-[180px] truncate">{file.name}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* My action plans on this observation */}
                    <div className="border-t border-[rgba(26,26,24,0.08)]">
                      <div className="px-4 pt-3 text-xs font-semibold uppercase text-[rgba(26,26,24,0.48)]">
                        My Action Plans ({obs.plans.length})
                      </div>
                      <div className="divide-y divide-[rgba(26,26,24,0.08)]">
                        {obs.plans.map((plan) => (
                          <button
                            key={plan.id}
                            type="button"
                            onClick={() => navigate(`${auditPath}/observations/${obs.id}/plans/${plan.id}`)}
                            className="group flex w-full items-start gap-4 px-4 py-3 text-left transition-colors hover:bg-[#F7F6F2]"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="mb-1 flex items-center justify-between gap-3">
                                <span className="text-xs font-semibold text-[rgba(26,26,24,0.48)]">
                                  {plan.actionNo}
                                  {plan.actionType && ` · ${humanize(plan.actionType)}`}
                                </span>
                                <DueLabel label={isBreached(plan) ? "Date breached" : undefined} />
                              </div>
                              <p className="line-clamp-2 text-sm text-[#1A1A18]">{plan.description}</p>
                              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[rgba(26,26,24,0.68)]">
                                <span>Target Date: {plan.targetDate || "-"}</span>
                                {plan.extendedTargetDate && <span>Extended Target Date: {plan.extendedTargetDate}</span>}
                                <span>
                                  CAPA: {plan.closedCapasCount} of {plan.capasCount} closed
                                </span>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {plan.capaProgress && (
                                  <CapaProgressPill label={plan.capaProgress} progressKey={plan.capaProgressKey} />
                                )}
                                {plan.capaClosure && (
                                  <AuditStatusPill
                                    status={plan.closedByMe ? "Closed By Action Owner" : "Pending By Action Owner"}
                                  />
                                )}
                              </div>
                            </div>
                            <ChevronRight className="mt-6 w-4 h-4 shrink-0 text-[rgba(26,26,24,0.3)] group-hover:text-[#1A1A18]" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DetailCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ActionOwnerAuditDetailPage;
