// @ts-nocheck
import { useParams, useNavigate } from "react-router-dom";
import { useFetchJobDetail } from "./hooks/useFetchJobDetail";
import JdDetail from "./components/JdDetail";

export default function JobsViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useFetchJobDetail(Number(id));

  if (isLoading) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#888", fontSize: 14 }}>
        Loading job description…
      </div>
    );
  }

  if (error || !data) {
    navigate("/admin-compass/jobs", { replace: true });
    return null;
  }

  return <JdDetail jd={data.jd} kras={data.kras} kpis={data.kpis} />;
}
