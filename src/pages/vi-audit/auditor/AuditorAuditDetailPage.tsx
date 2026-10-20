import { useParams } from "react-router-dom";
import { AuditDetailView } from "@/components/vi-audit/AuditDetailView";
import { useViAuditDetail } from "@/components/vi-audit/useViAuditDetail";

// Auditor: audit detail (Audit Details + Observations tabs) — GET /vi_audits/:id.json.
const AuditorAuditDetailPage = () => {
  const { id } = useParams();
  const { audit, loading } = useViAuditDetail(id);
  return <AuditDetailView auditId={id} audit={audit} loading={loading} listPath="/safety/audit-list" />;
};

export default AuditorAuditDetailPage;
