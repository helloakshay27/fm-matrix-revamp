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
import { getViAuditDetail, type ViAuditDetail } from "./viAuditData";
import {
  AuditStatusPill,
  DueLabel,
  FieldGrid,
  auditTabContentClass,
  auditTabTriggerClass,
  auditTabsListClass,
  auditTabsWrapperClass,
  sectionIcon,
  AuditLoadingState,
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
  audit: auditFromApi,
  loading = false,
}: {
  auditId: string | undefined;
  /** Audit from the API. When omitted, the placeholder audit for `auditId` is shown. */
  audit?: ViAuditDetail | null;
  loading?: boolean;
  listPath: string;
  defaultTab?: "details" | "observations";
}) => {
  const navigate = useNavigate();
  const placeholderAudit = useMemo(() => getViAuditDetail(auditId), [auditId]);

  if (loading) return <AuditLoadingState message="Loading audit..." />;
  if (auditFromApi === null) return <AuditLoadingState message="Audit not found." onBack={() => navigate(listPath)} />;
  const audit = auditFromApi ?? placeholderAudit;

  const closedCount = audit.observations.filter((o) => o.status === "Closed By Action Owner").length;

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate(listPath)}
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Back to audit list"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">Audit — {audit.auditCode}</h1>
        <AuditStatusPill status={audit.status} />
        <span className="text-sm text-gray-500">{audit.auditType} Audit</span>
      </div>

      <Tabs defaultValue={defaultTab} className={`w-full ${auditTabsWrapperClass}`}>
        <TabsList className={auditTabsListClass}>
          <TabsTrigger value="details" className={auditTabTriggerClass}>
            Audit Details
          </TabsTrigger>
          <TabsTrigger value="observations" className={auditTabTriggerClass}>
            Observations ({audit.observations.length})
          </TabsTrigger>
        </TabsList>

        {/* Audit Details tab */}
        <TabsContent value="details" className={`mt-0 ${auditTabContentClass}`}>
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
        <TabsContent value="observations" className={`mt-0 ${auditTabContentClass}`}>
          <DetailCard icon={sectionIcon(ClipboardList)} title="Observations" className="mb-5">
            <div className="mb-4 flex justify-end">
              <span className="rounded-full bg-gray-100 px-[10px] py-[3px] text-[11px] font-medium text-gray-600">
                {closedCount} of {audit.observations.length} closed by action owner
              </span>
            </div>
            <div className="divide-y divide-gray-200 rounded-lg border border-gray-200">
              {audit.observations.map((obs) => (
                <button
                  key={obs.id}
                  type="button"
                  onClick={() => navigate(`${listPath}/${audit.id}/observations/${obs.id}`)}
                  className="group flex w-full items-start gap-4 px-4 py-4 text-left transition-colors hover:bg-[#F6F4EE] focus-visible:outline-none focus-visible:bg-[#F6F4EE]"
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-gray-500">{obs.observationNo ?? obs.id}</span>
                      <DueLabel label={obs.dueLabel} />
                    </div>
                    {obs.title && (
                      <div className="mb-0.5 text-sm font-semibold text-gray-900">{obs.title}</div>
                    )}
                    {obs.area && (
                      <div className="mb-1 text-xs text-gray-500">{obs.area}</div>
                    )}
                    {!obs.title && (
                      <p className="line-clamp-2 text-sm text-gray-900">{obs.description}</p>
                    )}
                    <div className="mt-2">
                      <AuditStatusPill status={obs.status} />
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
