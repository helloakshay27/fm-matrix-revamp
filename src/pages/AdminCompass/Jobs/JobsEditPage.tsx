// @ts-nocheck
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useJobs } from "./JobsContext";
import EditJdScreen from "./components/EditJdScreen";

export default function JobsEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allJds, startEditJd, setEditingJd } = useJobs();

  useEffect(() => {
    const numericId = Number(id);
    if (!allJds.some((j) => j.id === numericId)) {
      navigate("/admin-compass/jobs", { replace: true });
      return;
    }
    startEditJd(numericId);
    return () => setEditingJd(null);
  }, [id, allJds]);

  return <EditJdScreen />;
}
