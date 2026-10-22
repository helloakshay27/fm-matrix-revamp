import { useParams } from "react-router-dom";
import { AuditDetailView } from "@/components/vi-audit/AuditDetailView";
import { useViAuditDetail } from "@/components/vi-audit/useViAuditDetail";

// SPOC: audit detail (Audit Details + Observations tabs) — GET /vi_audits/:id.json.
const SpocAuditDetailPage = () => {
  const { id } = useParams();
  const { audit, loading } = useViAuditDetail(id);
  return <AuditDetailView auditId={id} audit={audit} loading={loading} listPath="/safety/audit/spoc" />;
};

export default SpocAuditDetailPage;
