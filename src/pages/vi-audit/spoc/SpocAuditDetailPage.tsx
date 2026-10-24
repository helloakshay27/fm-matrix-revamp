import { useParams } from "react-router-dom";
import { AuditDetailView } from "@/components/vi-audit/AuditDetailView";
import { VI_AUDIT_DETAIL_URLS, useViAuditDetail } from "@/components/vi-audit/useViAuditDetail";

// SPOC: audit detail (Audit Details + Observations tabs) — GET /vi_audits/spoc_audits.json?id=:id
const SpocAuditDetailPage = () => {
  const { id } = useParams();
  const { audit, loading } = useViAuditDetail(id, VI_AUDIT_DETAIL_URLS.spoc);
  return <AuditDetailView auditId={id} audit={audit} loading={loading} listPath="/safety/audit/spoc" />;
};

export default SpocAuditDetailPage;
