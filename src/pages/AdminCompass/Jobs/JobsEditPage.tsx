// @ts-nocheck
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useJobs } from "./JobsContext";
import { useFetchJobDetail } from "./hooks/useFetchJobDetail";
import EditJdScreen from "./components/EditJdScreen";
import { SkeletonDetail } from "./components/UI";

export default function JobsEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setEditingJd, setEditForm } = useJobs();
  const { data, isLoading, error } = useFetchJobDetail(Number(id));

  useEffect(() => {
    if (data) {
      const jd = data.jd;
      setEditForm({
        title: jd.title || "",
        dept: jd.dept || "",
        deptId: jd.deptId || jd.departmentId || "",
        reportingTo: jd.reportingTo || "",
        type: jd.type || "",
        level: jd.level || "",
        location: jd.location || "",
        salaryMin: jd.salaryMin ?? "",
        salaryMax: jd.salaryMax ?? "",
        summary: jd.summary || "",
        responsibilities: jd.responsibilities || "",
        qualifications: jd.qualifications || "",
        skills: jd.skills || "",
        niceToHave: jd.niceToHave || "",
      });
      setEditingJd(Number(id));
    }
  }, [data, id]);

  useEffect(() => {
    return () => setEditingJd(null);
  }, []);

  if (isLoading) return <SkeletonDetail sections={3} fields={4} />;

  if (error || !data) {
    navigate("/admin-compass/jobs", { replace: true });
    return null;
  }

  return <EditJdScreen jd={data.jd} kras={data.kras} kpis={data.kpis} />;
}
