import { useParams } from "react-router-dom";
import { AuditDetailView } from "@/components/vi-audit/AuditDetailView";
import { useViAuditDetail } from "@/components/vi-audit/useViAuditDetail";

// Action Owner: audit detail (Audit Details + Observations tabs) — GET /vi_audits/:id.json.
const ActionOwnerAuditDetailPage = () => {
  const { id } = useParams();
  const { audit, loading } = useViAuditDetail(id);
  return <AuditDetailView auditId={id} audit={audit} loading={loading} listPath="/safety/audit/action-owner" />;
};

export default ActionOwnerAuditDetailPage;
