import { useParams } from "react-router-dom";
import { AuditDetailView } from "@/components/vi-audit/AuditDetailView";

// Action Owner: audit detail (Audit Details + Observations tabs).
const ActionOwnerAuditDetailPage = () => {
  const { id } = useParams();
  return <AuditDetailView auditId={id} listPath="/safety/audit/action-owner" />;
};

export default ActionOwnerAuditDetailPage;
