import { useParams } from "react-router-dom";
import { AuditDetailView } from "@/components/vi-audit/AuditDetailView";

// Functional Head: lands on the observations list; audit details are one tab away.
const FunctionalHeadAuditDetailPage = () => {
  const { id } = useParams();
  return (
    <AuditDetailView auditId={id} listPath="/safety/audit/functional-head" defaultTab="observations" />
  );
};

export default FunctionalHeadAuditDetailPage;
