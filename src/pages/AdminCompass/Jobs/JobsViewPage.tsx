// @ts-nocheck
import { useParams, useNavigate } from "react-router-dom";
import { useFetchJobDetail } from "./hooks/useFetchJobDetail";
import JdDetail from "./components/JdDetail";
import { SkeletonDetail } from "./components/UI";

export default function JobsViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useFetchJobDetail(Number(id));

  if (isLoading) return <SkeletonDetail sections={3} fields={4} />;

  if (error || !data) {
    navigate("/admin-compass/jobs", { replace: true });
    return null;
  }

  return <JdDetail jd={data.jd} kras={data.kras} kpis={data.kpis} />;
}
