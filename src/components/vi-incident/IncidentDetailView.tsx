import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, FileText, Layers, ClipboardList, User, HeartPulse, Search } from "lucide-react";
import { DetailCard } from "@/components/ui/detail-card";
import { AuditLoadingState, FieldGrid, sectionIcon } from "@/components/vi-audit/ViAuditUi";
import { AttachmentLinks } from "./IncidentFormFields";
import { IncidentStatusPill } from "./IncidentListView";
import { incidentPendingWith, type ViIncidentRecord } from "./viIncidentData";

/** Reporter / Basic / Classification / Incident Details / Injury cards for one incident (read-only). */
export const IncidentInfoCards = ({ incident }: { incident: ViIncidentRecord }) => (
  <>
    <DetailCard icon={sectionIcon(User)} title="Reporter Details" className="mb-5">
      <FieldGrid
        fields={[
          { label: "Name", value: incident.reporter.name },
          { label: "Mail ID", value: incident.reporter.mailId },
          { label: "Employer", value: incident.reporter.employer },
        ]}
      />
    </DetailCard>

    <DetailCard icon={sectionIcon(FileText)} title="Basic Details" className="mb-5">
      <FieldGrid
        columns={4}
        fields={[
          { label: "Incident ID", value: incident.incidentNo },
          { label: "Date of Report", value: incident.dateOfReport },
          { label: "Time of Report", value: incident.timeOfReport },
          { label: "Date of Incident", value: incident.dateOfIncident },
          { label: "Time of Incident", value: incident.timeOfIncident },
          { label: "Circle", value: incident.circle },
          { label: "Personnel Area", value: incident.personnelArea },
          { label: "Work Location", value: incident.workLocation },
          { label: "Type of Facility", value: incident.facilityType },
          { label: "Function", value: incident.function },
          { label: "Incident Location", value: incident.incidentLocation, span: true },
        ]}
      />
    </DetailCard>

    <DetailCard icon={sectionIcon(Layers)} title="Incident Classification" className="mb-5">
      <FieldGrid
        fields={[
          { label: "Classification", value: incident.classification },
          { label: "Category", value: incident.category },
          { label: "Sub Category", value: incident.subCategory },
        ]}
      />
    </DetailCard>

    <DetailCard icon={sectionIcon(ClipboardList)} title="Incident Details" className="mb-5">
      <div className="mb-4 border-b border-[rgba(26,26,24,0.09)] pb-4">
        <div className="text-xs text-[rgba(26,26,24,0.48)] mb-1">Incident</div>
        <p className="text-sm text-[#1A1A18] whitespace-pre-wrap">{incident.incident || "-"}</p>
      </div>
      <FieldGrid
        columns={2}
        fields={[
          { label: "Assigned SPOC", value: incident.spoc },
          { label: "Functional Head", value: incident.functionalHead },
        ]}
      />
      <div className="mt-4">
        <div className="text-xs text-[rgba(26,26,24,0.48)] mb-1">Attachments ({incident.attachments.length})</div>
        {incident.attachments.length ? (
          <AttachmentLinks attachments={incident.attachments} />
        ) : (
          <span className="text-sm font-medium text-[#1A1A18]">-</span>
        )}
      </div>
      <div className="mt-4">
        <FieldGrid
          columns={2}
          fields={[{ label: "An Injury Happened?", value: incident.injuryHappened ? "Yes" : "No" }]}
        />
      </div>
    </DetailCard>

    {incident.injuries.map((injury, index) => (
      <DetailCard
        key={injury.id || index}
        icon={sectionIcon(HeartPulse)}
        title={incident.injuries.length > 1 ? `Injury Details ${index + 1}` : "Injury Details"}
        className="mb-5"
      >
        <FieldGrid
          columns={4}
          fields={[
            { label: "Impacted Person", value: injury.name },
            { label: "Impacted Person's Age", value: injury.age },
            { label: "Nature of Person Impacted", value: injury.personType },
            { label: "Nature of Injury", value: injury.natureOfInjury },
            { label: "Body Part Affected", value: injury.bodyPart },
            { label: "Vendor", value: injury.vendor },
            { label: "Sub Vendor", value: injury.subVendor },
          ]}
        />
      </DetailCard>
    ))}
  </>
);

/** The SPOC's investigation outcome — shown once it has been submitted. */
export const IncidentInvestigationCard = ({ incident }: { incident: ViIncidentRecord }) => {
  const inv = incident.investigation;
  if (!inv.submitted) return null;
  return (
    <DetailCard icon={sectionIcon(Search)} title="Investigation" className="mb-5">
      {inv.required ? (
        <>
          <FieldGrid
            columns={4}
            fields={[
              { label: "Investigation Required?", value: "Yes" },
              { label: "Days Away from Work", value: inv.daysAwayFromWork },
              { label: "Restricted Work Days", value: inv.restrictedWorkDays },
              { label: "Breach of Absolute Safety Rules", value: inv.breach ? "Yes" : "No" },
              inv.breach
                ? {
                    label: "Safety Rule Breached",
                    value: inv.breachSafetyRuleOther
                      ? `${inv.breachSafetyRule || "Others"} — ${inv.breachSafetyRuleOther}`
                      : inv.breachSafetyRule,
                  }
                : { label: "Investigation Conclusion", value: inv.conclusion },
            ]}
          />
          <div className="mt-4 border-t border-[rgba(26,26,24,0.09)] pt-4">
            <div className="text-xs text-[rgba(26,26,24,0.48)] mb-1">Investigation Summary</div>
            <p className="text-sm text-[#1A1A18] whitespace-pre-wrap">{inv.summary || "-"}</p>
          </div>
        </>
      ) : (
        <FieldGrid
          columns={2}
          fields={[
            { label: "Investigation Required?", value: "No" },
            { label: "Reason", value: inv.notRequiredReason },
          ]}
        />
      )}
    </DetailCard>
  );
};

/** Page header: back arrow, "Incident — <no>" and the status pill. */
export const IncidentHeader = ({
  incident,
  onBack,
  draft = false,
  children,
}: {
  incident: ViIncidentRecord;
  onBack: () => void;
  /** Adds a "Draft" pill (unless the status already reads Draft). */
  draft?: boolean;
  children?: ReactNode;
}) => {
  const pending = incidentPendingWith(incident);
  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded-[8px] hover:bg-[#F5F4F0]"
          aria-label="Back to incident list"
        >
          <ArrowLeft className="w-4 h-4 text-[rgba(26,26,24,0.68)]" />
        </button>
        <h1 className="text-xl font-semibold text-[#1A1A18]">Incident — {incident.incidentNo}</h1>
        <IncidentStatusPill status={incident.status} />
        {draft && incident.status !== "Draft" && <IncidentStatusPill status="Draft" />}
        {children}
      </div>
      {/* Whose end the incident is waiting on */}
      {pending && <PendingWithLine role={pending.role} names={pending.names} className="mt-2 pl-11" />}
    </div>
  );
};

/** "Pending with (Action Owners): A, B" — clock icon, warning tone. */
export const PendingWithLine = ({
  role,
  names,
  className = "",
}: {
  role?: string;
  names: string[];
  className?: string;
}) =>
  names.length ? (
    <p className={`flex items-center gap-1.5 text-xs font-medium text-[#8A5A12] ${className}`}>
      <Clock className="w-3.5 h-3.5 shrink-0" />
      <span>
        Pending with{role ? ` (${role})` : ""}: <span className="font-semibold">{names.join(", ")}</span>
      </span>
    </p>
  ) : null;

/**
 * Shared incident detail layout (Reporter / Basic / Classification / Incident Details / Injury).
 * Each role page loads the incident (useViIncidentDetail) and supplies its list route and actions.
 */
export const IncidentDetailView = ({
  incident,
  loading,
  listPath,
  footer,
  draft = false,
  children,
}: {
  incident: ViIncidentRecord | null;
  loading: boolean;
  listPath: string;
  /** The viewing role has saved its part as a draft — shown as a "Draft" pill in the heading. */
  draft?: boolean;
  /** Sticky action bar content, e.g. the SPOC's "Create Action Plan" button. */
  footer?: ReactNode;
  /** Extra content after the incident cards (e.g. the investigation and action plans). */
  children?: ReactNode;
}) => {
  const navigate = useNavigate();

  if (loading) return <AuditLoadingState message="Loading incident..." />;
  if (!incident) return <AuditLoadingState message="Incident not found." onBack={() => navigate(listPath)} />;

  return (
    <div className="p-6 min-h-screen">
      <IncidentHeader incident={incident} onBack={() => navigate(listPath)} draft={draft} />

      <IncidentInfoCards incident={incident} />

      {children}

      {footer && (
        <div className="fm-action-bar sticky bottom-0 -mx-6 mt-6 border-t border-[rgba(26,26,24,0.09)] bg-white px-6 py-4">
          {footer}
        </div>
      )}
    </div>
  );
};
