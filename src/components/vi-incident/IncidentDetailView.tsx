import { useMemo, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Layers, ClipboardList, Paperclip, User, HeartPulse } from "lucide-react";
import { DetailCard } from "@/components/ui/detail-card";
import { FieldGrid, sectionIcon } from "@/components/vi-audit/ViAuditUi";
import { IncidentStatusPill } from "./IncidentListView";
import { getViIncident, type ViIncidentRecord } from "./viIncidentData";

/** Reporter / Basic / Classification / Incident Details / Injury cards for one incident (read-only). */
export const IncidentInfoCards = ({ incident }: { incident: ViIncidentRecord }) => {
  const injured = incident.injuries.length > 0;
  return (
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
          { label: "Incident ID", value: String(incident.incidentId) },
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
        <p className="text-sm text-[#1A1A18] whitespace-pre-wrap">{incident.incident}</p>
      </div>
      <FieldGrid
        columns={2}
        fields={[
          { label: "Assigned SPOC", value: incident.spoc },
          { label: "Functional Head", value: incident.functionalHead },
        ]}
      />
      <div className="mt-4">
        <div className="text-xs text-[rgba(26,26,24,0.48)] mb-1">
          Attachments ({incident.attachments.length})
        </div>
        {incident.attachments.length ? (
          <div className="flex flex-wrap gap-2">
            {incident.attachments.map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#F5F4F0] px-3 py-1 text-xs text-[#1A1A18]"
              >
                <Paperclip className="w-3 h-3" />
                {name}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-sm font-medium text-[#1A1A18]">-</span>
        )}
      </div>
      <div className="mt-4">
        <FieldGrid columns={2} fields={[{ label: "An Injury Happened?", value: injured ? "Yes" : "No" }]} />
      </div>
    </DetailCard>

    {incident.injuries.map((injury, index) => (
      <DetailCard
        key={index}
        icon={sectionIcon(HeartPulse)}
        title={incident.injuries.length > 1 ? `Injury Details ${index + 1}` : "Injury Details"}
        className="mb-5"
      >
        <FieldGrid
          columns={4}
          fields={[
            { label: "Impacted Person's Age", value: injury.age },
            { label: "Nature of Person Impacted", value: injury.personType },
            { label: "Vendor", value: injury.vendor },
            { label: "Sub Vendor", value: injury.subVendor },
            { label: "Nature of Injury", value: injury.natureOfInjury },
            { label: "Body Part Affected", value: injury.bodyPart },
            { label: "Days Away from Work", value: injury.daysAwayFromWork },
            { label: "Restricted Work Days", value: injury.restrictedWorkDays },
          ]}
        />
      </DetailCard>
    ))}
    </>
  );
};

/**
 * Shared incident detail layout (Reporter / Basic / Classification / Incident Details / Injury).
 * Each role page supplies its list route (back arrow) and optional footer actions.
 */
export const IncidentDetailView = ({
  incidentId: id,
  listPath,
  footer,
  children,
}: {
  incidentId: string | undefined;
  listPath: string;
  /** Sticky action bar content, e.g. the SPOC's "Create Action Plan" button. */
  footer?: ReactNode;
  /** Extra content after the incident cards (e.g. the action plans). */
  children?: ReactNode;
}) => {
  const navigate = useNavigate();
  const incident = useMemo(() => getViIncident(id), [id]);

  return (
    <div className="p-6 min-h-screen">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate(listPath)}
          className="flex h-8 w-8 items-center justify-center rounded-[8px] hover:bg-[#F5F4F0]"
          aria-label="Back to incident list"
        >
          <ArrowLeft className="w-4 h-4 text-[rgba(26,26,24,0.68)]" />
        </button>
        <h1 className="text-xl font-semibold text-[#1A1A18]">Incident — {incident.incidentId}</h1>
        <IncidentStatusPill status={incident.status} />
      </div>

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
