import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit2, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type AuditStatus = "Open" | "Completed" | "Draft";
type AuditType = "Corporate" | "Circle";

interface ActionPlanEntry {
  actionPlan: string;
  attachmentName: string;
  responsiblePerson: string;
  targetDate: string;
  reassignTargetDate: string;
  reasonForReassigning: string;
}

interface ActionTakenEntry {
  actionTaken: string;
  attachmentName: string;
  closureDate: string;
}

interface AuditDetail {
  id: number;
  status: AuditStatus;
  requestorName: string;
  mailId: string;
  designation: string;
  auditType: AuditType;
  auditId: number;
  dateOfAudit: string;
  auditCircle: string;
  auditZone: string;
  auditLocation: string;
  auditFunction: string;
  vendorName: string;
  subVendorName: string;
  observation: string;
  observationAttachments: string[];
  classification: string;
  observationCategory: string;
  observationSubCategory: string;
  spoc: string;
  functionalHead: string;
  correctivePlans: ActionPlanEntry[];
  preventivePlans: ActionPlanEntry[];
  actionsTakenSummary: string;
  actionsTakenStatus: AuditStatus;
  preventiveActionsTaken: ActionTakenEntry[];
}

// Placeholder data — swap for a live API once the Audit backend endpoint is available.
// Mirrors ViAuditListPage's 4-record cycle, extended with the fuller detail fields
// captured by ViAuditAddPage.
const AUDIT_DETAIL_TEMPLATE: Omit<AuditDetail, "id">[] = [
  {
    status: "Open",
    requestorName: "Anis Kotwal",
    mailId: "aniskotwal99@gmail.com",
    designation: "Safety Head",
    auditType: "Corporate",
    auditId: 23,
    dateOfAudit: "01/06/2026",
    auditCircle: "Birla",
    auditZone: "Worli",
    auditLocation: "Birla Centurion Pvt. Ltd.",
    auditFunction: "Test",
    vendorName: "Jethalal & Sons Pvt. Ltd.",
    subVendorName: "-",
    observation:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    observationAttachments: ["Thank You Card"],
    classification: "Very High",
    observationCategory: "Electronic",
    observationSubCategory: "HVAC",
    spoc: "Arun Mohan",
    functionalHead: "Vinit Mehra",
    correctivePlans: [
      {
        actionPlan: "Replace faulty HVAC wiring within the week.",
        attachmentName: "",
        responsiblePerson: "Arun Mohan",
        targetDate: "2026-06-05",
        reassignTargetDate: "",
        reasonForReassigning: "",
      },
    ],
    preventivePlans: [
      {
        actionPlan: "Schedule quarterly HVAC preventive maintenance.",
        attachmentName: "",
        responsiblePerson: "Vinit Mehra",
        targetDate: "2026-06-20",
        reassignTargetDate: "",
        reasonForReassigning: "",
      },
    ],
    actionsTakenSummary: "Faulty wiring replaced and tested; site re-inspected.",
    actionsTakenStatus: "Completed",
    preventiveActionsTaken: [
      { actionTaken: "Preventive maintenance schedule circulated to site team.", attachmentName: "", closureDate: "2026-06-25" },
    ],
  },
  {
    status: "Completed",
    requestorName: "Priyanshi Doshi",
    mailId: "priyanshidoshi99@gmail.com",
    designation: "Safety Head",
    auditType: "Circle",
    auditId: 23,
    dateOfAudit: "18/04/2025",
    auditCircle: "Birla",
    auditZone: "Churchgate",
    auditLocation: "Birla Centurion Pvt. Ltd.",
    auditFunction: "Operations",
    vendorName: "Popatlal Pvt. Ltd.",
    subVendorName: "-",
    observation: "Loose wiring observed near the main distribution panel on the 3rd floor.",
    observationAttachments: ["Panel Photo"],
    classification: "High",
    observationCategory: "Electronic",
    observationSubCategory: "Wiring",
    spoc: "Veena Kumari",
    functionalHead: "Priya Nair",
    correctivePlans: [
      {
        actionPlan: "Re-secure and insulate exposed wiring.",
        attachmentName: "",
        responsiblePerson: "Veena Kumari",
        targetDate: "2025-04-22",
        reassignTargetDate: "",
        reasonForReassigning: "",
      },
    ],
    preventivePlans: [
      {
        actionPlan: "Add wiring checks to monthly electrical audit checklist.",
        attachmentName: "",
        responsiblePerson: "Priya Nair",
        targetDate: "2025-05-01",
        reassignTargetDate: "",
        reasonForReassigning: "",
      },
    ],
    actionsTakenSummary: "Wiring re-secured and insulated; panel re-tested and signed off.",
    actionsTakenStatus: "Completed",
    preventiveActionsTaken: [
      { actionTaken: "Checklist updated and shared with facility team.", attachmentName: "", closureDate: "2025-05-03" },
    ],
  },
  {
    status: "Draft",
    requestorName: "John Doe",
    mailId: "johndoe@example.com",
    designation: "Site Engineer",
    auditType: "Corporate",
    auditId: 35,
    dateOfAudit: "15/03/2026",
    auditCircle: "Tata",
    auditZone: "Andheri",
    auditLocation: "Tata Projects Pvt. Ltd.",
    auditFunction: "Maintenance",
    vendorName: "Reliance Industries Ltd.",
    subVendorName: "-",
    observation: "Scaffolding at the east wing lacks proper guardrails at height.",
    observationAttachments: [],
    classification: "Very High",
    observationCategory: "Mechanical",
    observationSubCategory: "Plumbing",
    spoc: "Vikram Singh",
    functionalHead: "Rohit Sharma",
    correctivePlans: [],
    preventivePlans: [],
    actionsTakenSummary: "",
    actionsTakenStatus: "Draft",
    preventiveActionsTaken: [],
  },
  {
    status: "Open",
    requestorName: "Meera Patil",
    mailId: "meera.patil@infraco.in",
    designation: "QA Manager",
    auditType: "Circle",
    auditId: 42,
    dateOfAudit: "22/07/2026",
    auditCircle: "Adani",
    auditZone: "Bandra",
    auditLocation: "Adani Realty Pvt. Ltd.",
    auditFunction: "Security",
    vendorName: "Mahindra Infra Ltd.",
    subVendorName: "-",
    observation: "Scaffolding platform missing toe boards on the north face.",
    observationAttachments: ["Site Photo 1", "Site Photo 2"],
    classification: "Medium",
    observationCategory: "Civil",
    observationSubCategory: "Scaffolding",
    spoc: "Kiran Joshi",
    functionalHead: "Vinit Mehra",
    correctivePlans: [
      {
        actionPlan: "Install toe boards on all open platform edges.",
        attachmentName: "",
        responsiblePerson: "Kiran Joshi",
        targetDate: "2026-07-29",
        reassignTargetDate: "",
        reasonForReassigning: "",
      },
    ],
    preventivePlans: [
      {
        actionPlan: "Add toe-board check to weekly scaffolding inspection.",
        attachmentName: "",
        responsiblePerson: "Vinit Mehra",
        targetDate: "2026-08-05",
        reassignTargetDate: "",
        reasonForReassigning: "",
      },
    ],
    actionsTakenSummary: "",
    actionsTakenStatus: "Open",
    preventiveActionsTaken: [],
  },
];

function getMockAuditDetail(id: number): AuditDetail {
  const template = AUDIT_DETAIL_TEMPLATE[(id - 1) % AUDIT_DETAIL_TEMPLATE.length];
  return { ...template, id };
}

const STATUS_STYLES: Record<AuditStatus, string> = {
  Open: "bg-[#F2C8C4] text-[#2c2c2c]",
  Completed: "bg-[#C7EDDA] text-[#2c2c2c]",
  Draft: "bg-[#E5E0D8] text-[#2c2c2c]",
};

function SectionCard({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="mb-6 border-[#D9D9D9] bg-white shadow-sm">
      <CardHeader className="bg-[#F6F4EE]">
        <CardTitle className="text-[#1a1a1a] font-semibold text-lg flex items-center">
          <span className="w-6 h-6 bg-brand text-white rounded-full flex items-center justify-center text-sm mr-2 font-medium shrink-0">
            {number}
          </span>
          {title.toUpperCase()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">{children}</CardContent>
    </Card>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-gray-500">{label} : </span>
      <span className="text-sm font-semibold text-gray-800">{value || "-"}</span>
    </div>
  );
}

function AttachmentChip({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full pl-1 pr-2 py-1">
      <span className="w-6 h-6 rounded-full bg-brand flex items-center justify-center shrink-0">
        <Paperclip className="w-3 h-3 text-white" />
      </span>
      <span className="text-sm font-semibold text-gray-800">{name}</span>
    </span>
  );
}

function ActionPlanList({ entries }: { entries: ActionPlanEntry[] }) {
  if (entries.length === 0) {
    return <p className="text-sm text-gray-400">No entries added.</p>;
  }
  return (
    <div className="space-y-3">
      {entries.map((entry, i) => (
        <div key={i} className="bg-[#FAFAF7] border border-gray-100 rounded-md p-4 space-y-2">
          <DetailRow label="Action Plan" value={entry.actionPlan} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-2">
            <DetailRow label="Responsible Person" value={entry.responsiblePerson} />
            <DetailRow label="Target Date" value={entry.targetDate} />
            <DetailRow label="Reassign Target Date" value={entry.reassignTargetDate} />
          </div>
          {entry.reasonForReassigning ? (
            <DetailRow label="Reason for Reassigning" value={entry.reasonForReassigning} />
          ) : null}
        </div>
      ))}
    </div>
  );
}

function ActionTakenList({ entries }: { entries: ActionTakenEntry[] }) {
  if (entries.length === 0) {
    return <p className="text-sm text-gray-400">No entries added.</p>;
  }
  return (
    <div className="space-y-3">
      {entries.map((entry, i) => (
        <div key={i} className="bg-[#FAFAF7] border border-gray-100 rounded-md p-4 space-y-2">
          <DetailRow label="Action Taken" value={entry.actionTaken} />
          <DetailRow label="Closure Date" value={entry.closureDate} />
        </div>
      ))}
    </div>
  );
}

const ViAuditDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const audit = getMockAuditDetail(Number(id) || 1);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
          onClick={() => navigate("/safety/audit-list")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Audit List
        </button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-gray-300"
          onClick={() => navigate(`/safety/audit-list/add`)}
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </Button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-xl font-bold tracking-wide">AUDIT #{audit.auditId}</h1>
        <span
          className={`inline-flex px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[audit.status]}`}
        >
          {audit.status}
        </span>
      </div>

      <SectionCard number={1} title="Requestor Details">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-2">
          <DetailRow label="Name" value={audit.requestorName} />
          <DetailRow label="Mail ID" value={audit.mailId} />
          <DetailRow label="Designation" value={audit.designation} />
        </div>
      </SectionCard>

      <SectionCard number={2} title="Basic Details">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-2">
          <DetailRow label="Audit ID" value={String(audit.auditId)} />
          <DetailRow label="Audit Type" value={audit.auditType} />
          <DetailRow label="Date of Audit" value={audit.dateOfAudit} />
          <DetailRow label="Audit Circle" value={audit.auditCircle} />
          <DetailRow label="Audit Zone" value={audit.auditZone} />
          <DetailRow label="Audit Location" value={audit.auditLocation} />
          <DetailRow label="Audit Function" value={audit.auditFunction} />
        </div>
      </SectionCard>

      <SectionCard number={3} title="Vendor Details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          <DetailRow label="Vendor Name" value={audit.vendorName} />
          <DetailRow label="Sub Vendor Name" value={audit.subVendorName} />
        </div>
      </SectionCard>

      <SectionCard number={4} title="Observation Details">
        <DetailRow label="Observation" value={audit.observation} />
        {audit.observationAttachments.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500">Attachments :</span>
            {audit.observationAttachments.map((name, i) => (
              <AttachmentChip key={`${name}-${i}`} name={name} />
            ))}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-2">
          <DetailRow label="Classification" value={audit.classification} />
          <DetailRow label="Category" value={audit.observationCategory} />
          <DetailRow label="Sub Category" value={audit.observationSubCategory} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          <DetailRow label="SPOC" value={audit.spoc} />
          <DetailRow label="Functional Head" value={audit.functionalHead} />
        </div>
      </SectionCard>

      <SectionCard number={5} title="Corrective Action Plan (0-7 Days)">
        <ActionPlanList entries={audit.correctivePlans} />
      </SectionCard>

      <SectionCard number={6} title="Preventive Action Plan (15-30 Days)">
        <ActionPlanList entries={audit.preventivePlans} />
      </SectionCard>

      <SectionCard number={7} title="Actions Taken">
        <DetailRow label="Actions Taken Summary" value={audit.actionsTakenSummary} />
        <DetailRow label="Status" value={audit.actionsTakenStatus} />
      </SectionCard>

      <SectionCard number={8} title="Preventive Action Taken (15-30 Days)">
        <ActionTakenList entries={audit.preventiveActionsTaken} />
      </SectionCard>
    </div>
  );
};

export default ViAuditDetailPage;
