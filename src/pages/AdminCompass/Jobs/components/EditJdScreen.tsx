// @ts-nocheck
import { useJobs } from "../JobsContext";
import { T, COLORS, DEPARTMENTS, EMP_TYPES, EXP_LEVELS } from "../constants";
import { I, ico } from "../icons";
import { card, SH, FI, FS, FT, Fld, Btn, StatusPill } from "./UI";

export default function EditJdScreen() {
  const {
    allJds, editingJd, editForm, ef,
    cancelEditJd, saveEditJd, publishJd,
    allKras, allKpis,
  } = useJobs();

  const jd = allJds.find((j) => j.id === editingJd);
  if (!jd) return null;

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
        onClick={cancelEditJd}
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
              onClick={() => {
                saveEditJd();
                publishJd(editingJd);
              }}
            >
              {ico.power} Save & Publish
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
              value={editForm.dept}
              onChange={(e) => ef("dept", e.target.value)}
            >
              <option value="">Select department</option>
              {DEPARTMENTS.map((d) => (
                <option key={d}>{d}</option>
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
        {allKras.filter((k) => k.jdId === editingJd).length === 0 ? (
          <p style={{ fontSize: 13, color: T.inkMuted, margin: 0 }}>
            No KRAs linked to this role yet.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {allKras
              .filter((k) => k.jdId === editingJd)
              .map((kra, i) => {
                const kraKpis = allKpis.filter((p) => p.kraId === kra.id);
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
        <Btn onClick={cancelEditJd}>Cancel</Btn>
        <Btn primary onClick={saveEditJd}>
          <I d="M20 6L9 17l-5-5" size={14} stroke="#fff" /> Save Changes
        </Btn>
      </div>
    </div>
  );
}
