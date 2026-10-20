import { useParams } from "react-router-dom";
import { AuditDetailView } from "@/components/vi-audit/AuditDetailView";

// SPOC: audit detail (Audit Details + Observations tabs).
const SpocAuditDetailPage = () => {
  const { id } = useParams();
  return <AuditDetailView auditId={id} listPath="/safety/audit/spoc" />;
};

export default SpocAuditDetailPage;
