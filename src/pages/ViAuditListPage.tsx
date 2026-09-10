import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Plus, ClipboardList, Building2, MapPinned } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/StatsCard";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

type AuditStatus = "Open" | "Completed" | "Draft";
type AuditType = "Corporate" | "Circle";

interface AuditRecord {
  id: number;
  status: AuditStatus;
  requestorName: string;
  mailId: string;
  designation: string;
  auditType: AuditType;
  auditId: number;
  dateOfAudit: string;
  auditLocation: string;
  vendorName: string;
  observationCategory: string;
  observationSubCategory: string;
  spoc: string;
  auditCircle: string;
  auditZone: string;
}

// Placeholder data — swap for a live API once the Audit backend endpoint is available.
const AUDIT_TEMPLATE: Omit<AuditRecord, "id">[] = [
  {
    status: "Open",
    requestorName: "Anis Kotwal",
    mailId: "aniskotwal99@gmail.com",
    designation: "Safety Head",
    auditType: "Corporate",
    auditId: 23,
    dateOfAudit: "01/06/2026",
    auditLocation: "Birla Centurion Pvt. Ltd.",
    vendorName: "Jethalal & Sons Pvt. Ltd.",
    observationCategory: "Electronic",
    observationSubCategory: "HVAC",
    spoc: "Arun Mohan",
    auditCircle: "Birla",
    auditZone: "Worli",
  },
  {
    status: "Completed",
    requestorName: "Priyanshi Doshi",
    mailId: "priyanshidoshi99@gmail.com",
    designation: "Safety Head",
    auditType: "Circle",
    auditId: 23,
    dateOfAudit: "18/04/2025",
    auditLocation: "Birla Centurion Pvt. Ltd.",
    vendorName: "Popatlal Pvt. Ltd.",
    observationCategory: "Electronic",
    observationSubCategory: "Wiring",
    spoc: "Veena Kumari",
    auditCircle: "Birla",
    auditZone: "Churchgate",
  },
  {
    status: "Draft",
    requestorName: "John Doe",
    mailId: "johndoe@example.com",
    designation: "Site Engineer",
    auditType: "Corporate",
    auditId: 35,
    dateOfAudit: "15/03/2026",
    auditLocation: "Tata Projects Pvt. Ltd.",
    vendorName: "Reliance Industries Ltd.",
    observationCategory: "Mechanical",
    observationSubCategory: "Plumbing",
    spoc: "Vikram Singh",
    auditCircle: "Tata",
    auditZone: "Andheri",
  },
  {
    status: "Open",
    requestorName: "Meera Patil",
    mailId: "meera.patil@infraco.in",
    designation: "QA Manager",
    auditType: "Circle",
    auditId: 42,
    dateOfAudit: "22/07/2026",
    auditLocation: "Adani Realty Pvt. Ltd.",
    vendorName: "Mahindra Infra Ltd.",
    observationCategory: "Civil",
    observationSubCategory: "Scaffolding",
    spoc: "Kiran Joshi",
    auditCircle: "Adani",
    auditZone: "Bandra",
  },
];

const MOCK_AUDITS: AuditRecord[] = Array.from({ length: 12 }, (_, i) => ({
  ...AUDIT_TEMPLATE[i % AUDIT_TEMPLATE.length],
  id: i + 1,
}));

const auditColumns: ColumnConfig[] = [
  { key: "status", label: "Status", sortable: true, defaultVisible: true },
  { key: "requestorName", label: "Requestor Name", sortable: true, defaultVisible: true },
  { key: "mailId", label: "Mail ID", sortable: true, defaultVisible: true },
  { key: "designation", label: "Designation", sortable: true, defaultVisible: true },
  { key: "auditType", label: "Audit Type", sortable: true, defaultVisible: true },
  { key: "auditId", label: "Audit ID", sortable: true, defaultVisible: true },
  { key: "dateOfAudit", label: "Date of Audit", sortable: true, defaultVisible: true },
  { key: "auditLocation", label: "Audit Location", sortable: true, defaultVisible: true },
  { key: "vendorName", label: "Vendor Name", sortable: true, defaultVisible: true },
  { key: "observationCategory", label: "Observation Category", sortable: true, defaultVisible: true },
  { key: "observationSubCategory", label: "Observation Sub-Category", sortable: true, defaultVisible: true },
  { key: "spoc", label: "SPOC", sortable: true, defaultVisible: true },
  { key: "auditCircle", label: "Audit Circle", sortable: true, defaultVisible: true },
  { key: "auditZone", label: "Audit Zone", sortable: true, defaultVisible: true },
];

const STATUS_STYLES: Record<AuditStatus, string> = {
  Open: "bg-[#F2C8C4] text-[#2c2c2c]",
  Completed: "bg-[#C7EDDA] text-[#2c2c2c]",
  Draft: "bg-[#E5E0D8] text-[#2c2c2c]",
};

const ViAuditListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAudits = MOCK_AUDITS.filter((a) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      a.requestorName.toLowerCase().includes(term) ||
      a.mailId.toLowerCase().includes(term) ||
      a.vendorName.toLowerCase().includes(term) ||
      a.auditLocation.toLowerCase().includes(term) ||
      String(a.auditId).includes(term)
    );
  });

  const totalCount = MOCK_AUDITS.length;
  const corporateCount = MOCK_AUDITS.filter((a) => a.auditType === "Corporate").length;
  const circleCount = MOCK_AUDITS.filter((a) => a.auditType === "Circle").length;

  const renderCell = (item: AuditRecord, columnKey: string) => {
    switch (columnKey) {
      case "status":
        return (
          <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[item.status]}`}>
            {item.status}
          </span>
        );
      case "auditId":
        return <span>{item.auditId}</span>;
      default:
        return <span>{(item as unknown as Record<string, unknown>)[columnKey] as string}</span>;
    }
  };

  const renderActions = (item: AuditRecord) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0 text-black hover:bg-gray-100"
      onClick={() => navigate(`/safety/audit-list/${item.id}`)}
      title="View audit"
    >
      <Eye className="w-4 h-4" />
    </Button>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 max-w-2xl">
        <StatsCard
          title="Total"
          value={totalCount}
          icon={<ClipboardList className="w-6 h-6" style={{ color: "#C72030" }} />}
        />
        <StatsCard
          title="Corporate"
          value={corporateCount}
          icon={<Building2 className="w-6 h-6" style={{ color: "#C72030" }} />}
        />
        <StatsCard
          title="Circle"
          value={circleCount}
          icon={<MapPinned className="w-6 h-6" style={{ color: "#C72030" }} />}
        />
      </div>

      <EnhancedTable
        data={filteredAudits}
        columns={auditColumns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey="vi-audit-list"
        enableSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search..."
        enableExport
        exportFileName="audit-list"
        emptyMessage="No audits found"
        pagination
        pageSize={10}
        onFilterClick={() => toast.info("Audit filters coming soon")}
        leftActions={
          <Button
            className="bg-brand hover:bg-brand-hover text-white"
            onClick={() => navigate("/safety/audit-list/add")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Audit
          </Button>
        }
      />
    </div>
  );
};

export default ViAuditListPage;
