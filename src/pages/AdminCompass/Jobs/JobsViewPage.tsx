// @ts-nocheck
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useJobs } from "./JobsContext";
import JdDetail from "./components/JdDetail";

export default function JobsViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allJds, setViewingJd } = useJobs();

  useEffect(() => {
    const numericId = Number(id);
    if (!allJds.some((j) => j.id === numericId)) {
      navigate("/admin-compass/jobs", { replace: true });
      return;
    }
    setViewingJd(numericId);
    return () => setViewingJd(null);
  }, [id, allJds]);

  return <JdDetail />;
}
