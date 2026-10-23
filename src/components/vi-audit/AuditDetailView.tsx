import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  ClipboardList,
  FileText,
  Layers,
  Store,
  User,
  Users,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DetailCard } from "@/components/ui/detail-card";
import { getViAuditDetail } from "./viAuditData";
import {
  AuditStatusPill,
  DueLabel,
  FieldGrid,
  auditTabTriggerClass,
  auditTabsListClass,
  sectionIcon,
} from "./ViAuditUi";

/**
 * Shared audit detail layout (Audit Details + Observations tabs). Each role page supplies
 * its own list route (back arrow; observations open `${listPath}/:id/observations/:obsId`)
 * and which tab it lands on.
 */
export const AuditDetailView = ({
  auditId,
  listPath,
  defaultTab = "details",
}: {
  auditId: string | undefined;
  listPath: string;
  defaultTab?: "details" | "observations";
}) => {
  const navigate = useNavigate();
  const audit = useMemo(() => getViAuditDetail(auditId), [auditId]);

  const closedCount = audit.observations.filter((o) => o.status === "Closed By Action Owner").length;

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate(listPath)}
          className="flex h-8 w-8 items-center justify-center rounded-[8px] hover:bg-[#F5F4F0]"
          aria-label="Back to audit list"
        >
          <ArrowLeft className="w-4 h-4 text-[rgba(26,26,24,0.68)]" />
        </button>
        <h1 className="text-xl font-semibold text-[#1A1A18]">Audit — {audit.auditCode}</h1>
        <AuditStatusPill status={audit.status} />
        <span className="text-sm text-[rgba(26,26,24,0.48)]">{audit.auditType} Audit</span>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className={`${auditTabsListClass} mb-5`}>
          <TabsTrigger value="details" className={auditTabTriggerClass}>
            Audit Details
          </TabsTrigger>
          <TabsTrigger value="observations" className={auditTabTriggerClass}>
            Observations ({audit.observations.length})
          </TabsTrigger>
        </TabsList>

        {/* Audit Details tab */}
        <TabsContent value="details" className="mt-0">
          <DetailCard icon={sectionIcon(User)} title="Auditor Details" className="mb-5">
            <FieldGrid
              fields={[
                { label: "Name", value: audit.auditor.name },
                { label: "Mail ID", value: audit.auditor.mailId },
                { label: "Designation", value: audit.auditor.designation },
              ]}
            />
          </DetailCard>

          <DetailCard icon={sectionIcon(FileText)} title="Basic Details" className="mb-5">
            <FieldGrid
              columns={4}
              fields={[
                { label: "Audit ID", value: audit.basic.auditId },
                { label: "Date of Audit", value: audit.basic.dateOfAudit },
                { label: "Circle", value: audit.basic.circle },
                { label: "Personnel Area", value: audit.basic.personnelArea },
                { label: "Work Location", value: audit.basic.workLocation },
                { label: "Type of Facility", value: audit.basic.facilityType },
                { label: "Function", value: audit.basic.function },
                { label: "Audit Location", value: audit.basic.auditLocation, span: true },
              ]}
            />
          </DetailCard>

          <DetailCard icon={sectionIcon(Layers)} title="Observation Classification" className="mb-5">
            <FieldGrid
              fields={[
                { label: "Classification", value: audit.classification.classification },
                { label: "Category", value: audit.classification.category },
                { label: "Sub Category", value: audit.classification.subCategory },
              ]}
            />
          </DetailCard>

          <DetailCard icon={sectionIcon(Users)} title="People Interacted With" className="mb-5">
            <FieldGrid
              columns={2}
              fields={[
                { label: "FTE / Non-FTE", value: audit.people.fte.join(", ") },
                {
                  label: "Others",
                  value: audit.people.others.map((p) => `${p.name} (${p.designation})`).join(", "),
                },
              ]}
            />
          </DetailCard>

          <DetailCard icon={sectionIcon(Store)} title="Vendor Details" className="mb-5">
            <FieldGrid
              columns={2}
              fields={[
                { label: "Vendor Name", value: audit.vendor.vendorName },
                { label: "Sub Vendor Name", value: audit.vendor.subVendorName },
              ]}
            />
          </DetailCard>
        </TabsContent>

        {/* Observations tab — each record opens the observation detail page */}
        <TabsContent value="observations" className="mt-0">
          <DetailCard icon={sectionIcon(ClipboardList)} title="Observations" className="mb-5">
            <div className="mb-4 flex justify-end">
              <span className="rounded-full bg-[#F5F4F0] px-[10px] py-[3px] text-[11px] font-medium text-[rgba(26,26,24,0.68)]">
                {closedCount} of {audit.observations.length} closed by action owner
              </span>
            </div>
            <div className="divide-y divide-[rgba(26,26,24,0.08)] rounded-[12px] border border-[rgba(26,26,24,0.09)]">
              {audit.observations.map((obs) => (
                <button
                  key={obs.id}
                  type="button"
                  onClick={() => navigate(`${listPath}/${audit.id}/observations/${obs.id}`)}
                  className="group flex w-full items-start gap-4 px-4 py-4 text-left transition-colors hover:bg-[#F7F6F2] focus-visible:outline-none focus-visible:bg-[#F7F6F2]"
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-[rgba(26,26,24,0.48)]">{obs.observationNo ?? obs.id}</span>
                      <DueLabel label={obs.dueLabel} />
                    </div>
                    {obs.title && (
                      <div className="mb-0.5 text-sm font-semibold text-[#1A1A18]">{obs.title}</div>
                    )}
                    {obs.area && (
                      <div className="mb-1 text-xs text-[rgba(26,26,24,0.48)]">{obs.area}</div>
                    )}
                    {!obs.title && (
                      <p className="line-clamp-2 text-sm text-[#1A1A18]">{obs.description}</p>
                    )}
                    <div className="mt-2">
                      <AuditStatusPill status={obs.status} />
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
