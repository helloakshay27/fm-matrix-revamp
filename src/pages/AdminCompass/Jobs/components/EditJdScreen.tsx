// @ts-nocheck
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useJobs } from "../JobsContext";
import { useDepartments } from "../hooks/useDepartments";
import { useUpdateJob } from "../hooks/useUpdateJob";
import { buildEditJobPayload } from "../api/jobsApi";
import { T, COLORS, EMP_TYPES, EXP_LEVELS } from "../constants";
import { I, ico } from "../icons";
import { card, SH, FI, FS, FT, Fld, Btn, StatusPill } from "./UI";

export default function EditJdScreen({ jd: propJd, kras: propKras, kpis: propKpis }) {
  const navigate = useNavigate();
  const { data: departments = [], isLoading: deptLoading } = useDepartments();
  const {
    editingJd, editForm, ef,
    publishJd,
    allJds, allKras, allKpis,
  } = useJobs();
  const updateJob = useUpdateJob({
    onSuccess: (_data, variables) => {
      toast.success("Job description updated successfully");
      if (variables?.andPublish) {
        publishJd(editingJd || jd.id);
      }
      navigate("/admin-compass/jobs");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || "Failed to update job description");
    },
  });

  const fromProps = propJd;
  const linkedKras = propKras || allKras.filter((k) => k.jdId === editingJd);
  const linkedKpis = propKpis || allKpis.filter((p) => p.jdId === editingJd);

  const jd = fromProps ? propJd : allJds.find((j) => j.id === editingJd);
  if (!jd) return null;

  const handleBack = () => navigate("/admin-compass/jobs");
  const selectedDeptValue = editForm.deptId || departments.find((d) => {
    const label = [d.department_name, d.name, d.title].find(Boolean) || "";
    return String(label).trim().toLowerCase() === String(editForm.dept || "").trim().toLowerCase();
  })?.id || "";

  const doSave = (andPublish) => {
    const payload = buildEditJobPayload(editForm, departments);
    updateJob.mutate({
      jobId: editingJd || jd.id,
      payload,
      andPublish,
    });
  };

  const handleSave = () => doSave(false);
  const handleSaveAndPublish = () => doSave(true);

  return (
    <div>
      <button
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: T.inkMuted,
          fontSize: 12.5,
          fontWeight: 600,
          fontFamily: T.font,
          marginBottom: 16,
          padding: 0,
        }}
        onClick={handleBack}
      >
        {ico.arrowLeft} Back to Job Descriptions
      </button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>
            Edit Job Description
          </h2>
          <p style={{ fontSize: 13, color: T.inkSoft, margin: 0 }}>
            Update the role details and description for{" "}
            <strong>{jd.title}</strong>
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <StatusPill s={jd.status} />
          {jd.status === "draft" && (
            <Btn
              primary
              disabled={updateJob.isPending}
              onClick={handleSaveAndPublish}
            >
              {ico.power} {updateJob.isPending ? "Saving..." : "Save & Publish"}
            </Btn>
          )}
        </div>
      </div>

      <div style={{ ...card, marginBottom: 16 }}>
        <SH
          icon={ico.briefcase}
          title="Job Details"
          sub="Core identity of the role — title, department, and employment terms."
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 18 }}>
          <Fld label="Job Title *">
            <FI
              value={editForm.title}
              onChange={(e) => ef("title", e.target.value)}
            />
          </Fld>
          <Fld label="Department *">
            <FS
              value={selectedDeptValue}
              onChange={(e) => {
                const selected = departments.find((d) => String(d.id) === String(e.target.value));
                ef("deptId", e.target.value);
                ef("dept", selected?.department_name || selected?.name || selected?.title || "");
              }}
            >
              <option value="">{deptLoading ? "Loading..." : "Select department"}</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.department_name || d.name || d.title || "Unnamed department"}</option>
              ))}
            </FS>
          </Fld>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 18 }}>
          <Fld label="Employment Type *">
            <FS
              value={editForm.type}
              onChange={(e) => ef("type", e.target.value)}
            >
              <option value="">Select type</option>
              {EMP_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </FS>
          </Fld>
          <Fld label="Experience Level *">
            <FS
              value={editForm.level}
              onChange={(e) => ef("level", e.target.value)}
            >
              <option value="">Select level</option>
              {EXP_LEVELS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </FS>
          </Fld>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 18 }}>
          <Fld label="Reporting To">
            <FI
              value={editForm.reportingTo}
              onChange={(e) => ef("reportingTo", e.target.value)}
            />
          </Fld>
          <Fld label="Work Location">
            <FI
              value={editForm.location}
              onChange={(e) => ef("location", e.target.value)}
            />
          </Fld>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 18 }}>
          <Fld label="Salary Range — Min (₹)">
            <FI
              type="number"
              value={editForm.salaryMin}
              onChange={(e) => ef("salaryMin", e.target.value)}
            />
          </Fld>
          <Fld label="Salary Range — Max (₹)">
            <FI
              type="number"
              value={editForm.salaryMax}
              onChange={(e) => ef("salaryMax", e.target.value)}
            />
          </Fld>
        </div>
      </div>

      <div style={{ ...card, marginBottom: 16 }}>
        <SH
          icon={ico.doc}
          title="Job Description"
          sub="Role summary, responsibilities, qualifications, and skills."
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Fld label="Role Summary *">
            <FT
              value={editForm.summary}
              onChange={(e) => ef("summary", e.target.value)}
              style={{ minHeight: 80 }}
            />
          </Fld>
          <Fld label="Key Responsibilities *">
            <FT
              value={editForm.responsibilities}
              onChange={(e) => ef("responsibilities", e.target.value)}
              style={{ minHeight: 120 }}
            />
          </Fld>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 18 }}>
            <Fld label="Required Qualifications">
              <FT
                value={editForm.qualifications}
                onChange={(e) => ef("qualifications", e.target.value)}
              />
            </Fld>
            <Fld label="Required Skills">
              <FT
                value={editForm.skills}
                onChange={(e) => ef("skills", e.target.value)}
              />
            </Fld>
          </div>
          <Fld label="Nice to Have">
            <FT
              value={editForm.niceToHave}
              onChange={(e) => ef("niceToHave", e.target.value)}
              style={{ minHeight: 70 }}
            />
          </Fld>
        </div>
      </div>

      <div style={{ ...card, marginBottom: 16 }}>
        <SH
          icon={ico.goals}
          title="Linked KRAs & KPIs"
          sub="These are managed from the KRA and KPI tabs. Shown here for reference."
        />
        {linkedKras.length === 0 ? (
          <p style={{ fontSize: 13, color: T.inkMuted, margin: 0 }}>
            No KRAs linked to this role yet.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {linkedKras.map((kra, i) => {
              const kraKpis = linkedKpis.filter((p) => p.kraId === kra.id);
              return (
                <div
                  key={kra.id}
                  style={{
                    padding: "14px 18px",
                    borderRadius: T.rmd,
                    background: T.raised,
                    border: `1px solid ${T.borderSoft}`,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: 4,
                      height: "100%",
                      background: COLORS[i % 5],
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: COLORS[i % 5],
                          display: "grid",
                          placeItems: "center",
                          fontSize: 9,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {i + 1}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>
                        {kra.title}
                      </span>
                      <StatusPill s={kra.status} />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 11.5,
                      }}
                    >
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: 999,
                          background: T.surface,
                          fontWeight: 700,
                        }}
                      >
                        {kra.weightage || 0}%
                      </span>
                      <span style={{ color: T.inkMuted }}>
                        {kraKpis.length} KPI
                        {kraKpis.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 10,
          paddingTop: 20,
          borderTop: `1px solid ${T.borderSoft}`,
        }}
      >
        <Btn onClick={handleBack} disabled={updateJob.isPending}>Cancel</Btn>
        <Btn primary disabled={updateJob.isPending} onClick={handleSave}>
          <I d="M20 6L9 17l-5-5" size={14} stroke="#fff" /> {updateJob.isPending ? "Saving..." : "Save Changes"}
        </Btn>
      </div>
    </div>
  );
}
