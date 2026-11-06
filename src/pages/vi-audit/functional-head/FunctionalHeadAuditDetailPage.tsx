import { useParams } from "react-router-dom";
import { AuditDetailView } from "@/components/vi-audit/AuditDetailView";
import { VI_AUDIT_DETAIL_URLS, useViAuditDetail } from "@/components/vi-audit/useViAuditDetail";

// Functional Head: lands on the observations list; audit details are one tab away.
// GET /vi_audits/functional_head_audits.json?id=:id
const FunctionalHeadAuditDetailPage = () => {
  const { id } = useParams();
  const { audit, loading } = useViAuditDetail(id, VI_AUDIT_DETAIL_URLS.functionalHead);
  return (
    <AuditDetailView
      auditId={id}
      audit={audit}
      loading={loading}
      listPath="/safety/audit/functional-head"
      defaultTab="observations"
    />
  );
};

export default FunctionalHeadAuditDetailPage;
