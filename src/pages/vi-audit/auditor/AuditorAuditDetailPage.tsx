import { useParams } from "react-router-dom";
import { AuditDetailView } from "@/components/vi-audit/AuditDetailView";

// Auditor: audit detail (Audit Details + Observations tabs).
const AuditorAuditDetailPage = () => {
  const { id } = useParams();
  return <AuditDetailView auditId={id} listPath="/safety/audit-list" />;
};

export default AuditorAuditDetailPage;
