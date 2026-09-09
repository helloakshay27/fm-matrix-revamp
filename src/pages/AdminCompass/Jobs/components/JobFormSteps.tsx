// @ts-nocheck
import { useState } from "react";
import { toast } from "sonner";
import { useJobs } from "../JobsContext";
import { ico } from "../icons";
import {
  SH, FI, FS, FT, Fld, Btn, Loader, AiBar, StatusPill, ConfirmDialog,
  card, g2, g3, COLORS, aBtn, smBtn, dashedBtn, gBtn,
} from "../components/UI";
import MemberSearchSelect from "../components/MemberSearchSelect";
import UnitField from "../components/UnitField";
import { useDepartments } from "../hooks/useDepartments";
import {
  T, EMP_TYPES, EXP_LEVELS,
  KPI_UNITS, TARGET_FREQ, DATA_SOURCES, MODULES_BY_SOURCE,
} from "../constants";

export function StepDetails() {
  const { jobForm, sf } = useJobs();
  const { data: departments = [], isLoading: deptLoading } = useDepartments();
  const departmentOptions = departments.map((d) => ({
    id: d.id,
    name: d.department_name || d.name || d.title || "Unnamed department",
  }));

  return (
    <div style={card}>
      <SH
        icon={ico.briefcase}
        title="Job Details"
        sub="Define the role identity — title, department, and employment terms."
      />
      <div style={g2}>
        <Fld label="Job Title *">
          <FI
            placeholder="e.g. Senior Product Manager"
            value={jobForm.title}
            onChange={(e) => sf("title", e.target.value)}
          />
        </Fld>
        <Fld label="Department *">
          <MemberSearchSelect
            value={jobForm.deptId || jobForm.dept || ""}
            options={departmentOptions}
            onChange={(value, selected) => {
              sf("deptId", value);
              sf("dept", selected?.name || "");
            }}
            placeholder="Search and select department"
            loading={deptLoading}
            loadingText="Loading departments..."
            emptyText="No departments found"
            disabled={deptLoading}
          />
        </Fld>
      </div>
      <div style={g2}>
        <Fld label="Employment Type *">
          <FS value={jobForm.type} onChange={(e) => sf("type", e.target.value)}>
            <option value="">Select type</option>
            {EMP_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </FS>
        </Fld>
        <Fld label="Experience Level *">
          <FS
            value={jobForm.level}
            onChange={(e) => sf("level", e.target.value)}
          >
            <option value="">Select level</option>
            {EXP_LEVELS.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </FS>
        </Fld>
      </div>
      <div style={g2}>
        <Fld label="Reporting To">
          <FI
            placeholder="e.g. VP of Product"
            value={jobForm.reportingTo}
            onChange={(e) => sf("reportingTo", e.target.value)}
          />
        </Fld>
        <Fld label="Work Location">
          <FI
            placeholder="e.g. Mumbai, Hybrid"
            value={jobForm.location}
            onChange={(e) => sf("location", e.target.value)}
          />
        </Fld>
      </div>
      <div style={g2}>
        <Fld label="Salary Range — Min (₹)" hint="Optional">
          <FI
            type="number"
            placeholder="e.g. 1200000"
            value={jobForm.salaryMin}
            onChange={(e) => sf("salaryMin", e.target.value)}
          />
        </Fld>
        <Fld label="Salary Range — Max (₹)">
          <FI
            type="number"
            placeholder="e.g. 1800000"
            value={jobForm.salaryMax}
            onChange={(e) => sf("salaryMax", e.target.value)}
          />
        </Fld>
      </div>
    </div>
  );
}

export function StepDesc() {
  const { jdMethod, setJdMethod, aiLoading, jobForm, sf, simulateAiJd, showToast } = useJobs();

  return (
    <div>
      {!jdMethod && !aiLoading && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              ...card,
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
            }}
            onClick={() => {
              jobForm.title && jobForm.deptId && jobForm.level && jobForm.type
                ? simulateAiJd()
                : showToast(
                    "Please fill job title, department, experience level, and employment type first",
                    "error"
                  );
            }}
            onMouseOver={(e) => (e.currentTarget.style.boxShadow = T.aiGlow)}
            onMouseOut={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: T.aiGrad,
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: T.rmd,
                  background: T.aiGrad,
                  display: "grid",
                  placeItems: "center",
                  color: "#fff",
                }}
              >
                {ico.ai}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>
                  Create with AI
                </div>
                <div style={{ fontSize: 12, color: T.inkSoft }}>
                  Auto-generate a complete JD
                </div>
              </div>
            </div>
            <p
              style={{
                fontSize: 12.5,
                color: T.inkMuted,
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              We'll use the job title, department, and level to draft a full
              description. You can edit everything afterwards.
            </p>
          </div>
          <div
            style={{ ...card, cursor: "pointer" }}
            onClick={() => setJdMethod("manual")}
            onMouseOver={(e) => (e.currentTarget.style.boxShadow = T.shadow)}
            onMouseOut={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: T.rmd,
                  background: T.surface,
                  display: "grid",
                  placeItems: "center",
                  color: T.orange,
                  border: `1px solid ${T.borderSoft}`,
                }}
              >
                {ico.edit}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>
                  Write Manually
                </div>
                <div style={{ fontSize: 12, color: T.inkSoft }}>
                  Craft every section yourself
                </div>
              </div>
            </div>
            <p
              style={{
                fontSize: 12.5,
                color: T.inkMuted,
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              Fill each section in your own words — best when you have a precise
              brief ready.
            </p>
          </div>
        </div>
      )}
      {aiLoading && <Loader text="Generating job description…" />}
      {jdMethod && !aiLoading && (
        <div style={card}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <SH
              icon={ico.doc}
              title="Job Description"
              sub={
                jdMethod === "ai"
                  ? "AI-generated draft — review and edit."
                  : "Write the job description for this role."
              }
            />
            {jdMethod === "ai" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 12px",
                  borderRadius: 999,
                  background: T.orangeSoft,
                  color: T.orange,
                  fontSize: 11,
                  fontWeight: 700,
                  height: "fit-content",
                }}
              >
                {ico.ai} AI-generated
              </div>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Fld label="Role Summary *">
              <FT
                placeholder="A concise overview of the role..."
                value={jobForm.summary}
                onChange={(e) => sf("summary", e.target.value)}
                style={{ minHeight: 80 }}
              />
            </Fld>
            <Fld label="Key Responsibilities *">
              <FT
                placeholder="• List core responsibilities..."
                value={jobForm.responsibilities}
                onChange={(e) => sf("responsibilities", e.target.value)}
                style={{ minHeight: 120 }}
              />
            </Fld>
            <div style={g2}>
              <Fld label="Required Qualifications *">
                <FT
                  placeholder="• Education, experience..."
                  value={jobForm.qualifications}
                  onChange={(e) => sf("qualifications", e.target.value)}
                />
              </Fld>
              <Fld label="Required Skills *">
                <FT
                  placeholder="• Technical and soft skills..."
                  value={jobForm.skills}
                  onChange={(e) => sf("skills", e.target.value)}
                />
              </Fld>
            </div>
            <Fld label="Nice to Have Skills *">
              <FT
                placeholder="• Additional desirable qualifications..."
                value={jobForm.niceToHave}
                onChange={(e) => sf("niceToHave", e.target.value)}
                style={{ minHeight: 70 }}
              />
            </Fld>
          </div>
        </div>
      )}
    </div>
  );
}

export function StepKra() {
  const {
    kraAiDone, aiLoading, formKras, totalKraWeight,
    addFormKra, updFormKra, remFormKra, simulateAiKras,
  } = useJobs();

  // Baaki KRAs ne kitna weightage le liya hai — usi se is row ka max nikalta hai.
  // Delete se pehle confirm — galti se KRA (aur uske KPIs) na ud jaayein.
  const [kraToDelete, setKraToDelete] = useState(null);

  const usedByOthers = (kraId) =>
    formKras
      .filter((k) => k.id !== kraId)
      .reduce((sum, k) => sum + (Number(k.weightage) || 0), 0);
  const overLimit = totalKraWeight > 100;
  const atLimit = totalKraWeight === 100;
  const underLimit = totalKraWeight < 100 && totalKraWeight > 0;
  // Hint sabhi rows me same dikhta hai — kitna weightage abhi bacha hua hai.
  const weightLeft = Math.max(0, 100 - totalKraWeight);

  const bannerBg = overLimit
    ? "rgba(231,132,142,.15)"
    : atLimit
      ? "rgba(16,140,114,.1)"
      : T.orangeSoft;
  const bannerColor = overLimit
    ? T.danger
    : atLimit
      ? T.growth
      : T.inkSoft;

  // Har KRA me kya-kya missing hai — banner me ek line me dikhate hain.
  const incompleteKras = formKras
    .map((kra, i) => {
      const missing = [];
      if (!kra.title || !kra.title.trim()) missing.push("name");
      if (kra.weightage === "" || Number(kra.weightage) <= 0)
        missing.push("weightage");
      if (!kra.desc || !kra.desc.trim()) missing.push("description");
      if (!kra.effectiveFrom) missing.push("effective from date");
      if (!kra.effectiveTo) missing.push("effective to date");
      if (kra.effectiveFrom && kra.effectiveTo && kra.effectiveTo < kra.effectiveFrom)
        missing.push("a valid date range (Effective To must be on or after Effective From)");
      return missing.length
        ? `KRA ${i + 1} (${kra.title || "Untitled"}): ${missing.join(", ")}`
        : null;
    })
    .filter(Boolean);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          padding: "10px 14px",
          marginBottom: 14,
          borderRadius: 10,
          fontSize: 12.5,
          fontWeight: 600,
          background: bannerBg,
          color: bannerColor,
        }}
      >
        <span>Total KRA Weightage</span>
        <span>
          {totalKraWeight}% / 100%
          {overLimit ? " — exceeds 100%, adjust before continuing" : ""}
          {atLimit ? " ✓ Ready to continue" : ""}
          {underLimit ? ` — ${weightLeft}% remaining to reach 100%` : ""}
          {totalKraWeight === 0 && formKras.length > 0 ? " — add weightage to each KRA" : ""}
        </span>
      </div>
      {!kraAiDone && !aiLoading && (
        <AiBar
          text="AI can suggest KRAs based on this role"
          sub="Generated from the job description. You can edit or remove any."
          onClick={simulateAiKras}
          label="Generate KRAs"
        />
      )}
      {aiLoading && <Loader text="Analysing role and generating KRAs…" />}

      {/* KRA step ki validation user ko inline dikhti hai — Continue tabhi khulta hai. */}
      {!aiLoading && formKras.length === 0 && (
        <div
          style={{
            padding: "12px 18px",
            marginBottom: 16,
            borderRadius: 10,
            fontSize: 12.5,
            fontWeight: 600,
            background: "rgba(231,132,142,.15)",
            color: T.danger,
          }}
        >
          No KRAs yet — generate them with AI or add one manually. Continue stays
          disabled until every KRA is complete and the total weightage is 100%.
        </div>
      )}
      {!aiLoading && formKras.length > 0 && incompleteKras.length > 0 && (
        <div
          style={{
            padding: "12px 18px",
            marginBottom: 16,
            borderRadius: 10,
            fontSize: 12.5,
            fontWeight: 600,
            background: T.orangeSoft,
            color: T.inkSoft,
          }}
        >
          Incomplete KRAs — {incompleteKras.join("; ")}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {formKras.map((kra, i) => (
          <div key={kra.id} style={{ ...card, position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 4,
                height: "100%",
                borderRadius: "16px 0 0 16px",
                background: COLORS[i % 5],
              }}
            />
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: COLORS[i % 5],
                  display: "grid",
                  placeItems: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color: T.ink,
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={g3}>
                  <Fld label="KRA Name *">
                    <FI
                      placeholder="e.g. Operational Excellence"
                      value={kra.title}
                      onChange={(e) =>
                        updFormKra(kra.id, "title", e.target.value)
                      }
                    />
                  </Fld>
                  <Fld
                    label="KRA Weightage (%) *"
                    hint={`${weightLeft}% left of 100%`}
                  >
                    <FI
                      type="number"
                      min={0}
                      max={Math.max(0, 100 - usedByOthers(kra.id))}
                      placeholder="e.g. 30"
                      value={kra.weightage}
                      onChange={(e) => {
                        const remaining = Math.max(
                          0,
                          100 - usedByOthers(kra.id)
                        );
                        const raw = e.target.value;
                        if (raw === "") {
                          updFormKra(kra.id, "weightage", "");
                          return;
                        }
                        // 100% se upar type karne par value cap ho jaati hai.
                        const capped = Math.min(Number(raw), remaining);
                        if (Number(raw) > remaining) {
                          toast.error(
                            `KRA ${i + 1} (${kra.title || "Untitled"}) can take at most ${remaining}% — total KRA weightage cannot exceed 100%`
                          );
                        }
                        updFormKra(kra.id, "weightage", String(capped));
                      }}
                    />
                    {Number(kra.weightage) > 100 - usedByOthers(kra.id) && (
                      <span style={{ fontSize: 11, color: T.danger }}>
                        Total KRA weightage cannot exceed 100%
                      </span>
                    )}
                  </Fld>
                  <Fld label="Status">
                    <FS
                      value={kra.status}
                      onChange={(e) =>
                        updFormKra(kra.id, "status", e.target.value)
                      }
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </FS>
                  </Fld>
                </div>
                <div style={{ marginBottom: 18 }}>
                  <Fld label="KRA Description *">
                    <FT
                      placeholder="Describe what this KRA measures and its expected outcomes..."
                      value={kra.desc}
                      onChange={(e) =>
                        updFormKra(kra.id, "desc", e.target.value)
                      }
                      style={{ minHeight: 68 }}
                    />
                  </Fld>
                </div>
                <div style={g2}>
                  <Fld label="Effective From *">
                    <FI
                      type="date"
                      max={kra.effectiveTo || undefined}
                      value={kra.effectiveFrom}
                      onChange={(e) =>
                        updFormKra(kra.id, "effectiveFrom", e.target.value)
                      }
                    />
                  </Fld>
                  <Fld label="Effective To *">
                    <FI
                      type="date"
                      min={kra.effectiveFrom || undefined}
                      value={kra.effectiveTo}
                      onChange={(e) => {
                        const val = e.target.value;
                        // From se pehle ki date chunne par turant bata dete hain.
                        if (val && kra.effectiveFrom && val < kra.effectiveFrom) {
                          toast.error(
                            `KRA ${i + 1} (${kra.title || "Untitled"}): Effective To cannot be earlier than Effective From`
                          );
                        }
                        updFormKra(kra.id, "effectiveTo", val);
                      }}
                    />
                    {kra.effectiveFrom &&
                      kra.effectiveTo &&
                      kra.effectiveTo < kra.effectiveFrom && (
                        <span style={{ fontSize: 11, color: T.danger }}>
                          Effective To cannot be earlier than Effective From
                        </span>
                      )}
                  </Fld>
                </div>
              </div>
              <button
                style={{ ...gBtn, marginTop: 2 }}
                onClick={() => setKraToDelete({ ...kra, index: i })}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = T.danger;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = T.inkMuted;
                }}
              >
                {ico.trash}
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        style={{
          ...dashedBtn,
          marginTop: 14,
          opacity: totalKraWeight >= 100 ? 0.5 : 1,
          cursor: totalKraWeight >= 100 ? "not-allowed" : "pointer",
        }}
        onClick={() => {
          if (totalKraWeight >= 100) {
            toast.error(
              "Total KRA weightage is already 100% — reduce an existing KRA before adding a new one"
            );
            return;
          }
          addFormKra();
        }}
        title={
          totalKraWeight >= 100
            ? "100% weightage already allocated across KRAs"
            : undefined
        }
      >
        {ico.plus} Add KRA Manually
      </button>

      <ConfirmDialog
        open={!!kraToDelete}
        title="Delete this KRA?"
        message={`"${kraToDelete?.title || `KRA ${(kraToDelete?.index ?? 0) + 1}`}" and all KPIs linked to it will be removed. This can't be undone.`}
        confirmLabel="Delete KRA"
        onCancel={() => setKraToDelete(null)}
        onConfirm={() => {
          remFormKra(kraToDelete.id);
          setKraToDelete(null);
          toast.success("KRA removed");
        }}
      />
    </div>
  );
}

export function StepKpi() {
  const {
    kpiAiDone, kpiAiLoading, formKras, formKpis, totalKpiWeight,
    addFormKpi, updFormKpi, remFormKpi, simulateAiKpis, customUnits,
    kraKpiWeight,
  } = useJobs();

  // KPI delete karne se pehle bhi wahi confirm popup dikhta hai.
  const [kpiToDelete, setKpiToDelete] = useState(null);

  const totalKraWeightage = formKras.reduce(
    (sum, kra) => sum + (Number(kra.weightage) || 0),
    0
  );
  const unitOptions = [
    ...customUnits.map((u) => u.name),
    ...formKpis.map((kpi) => kpi.unit),
  ]
    .map((unit) => String(unit || "").trim())
    .filter(Boolean)
    .filter(
      (unit, index, units) =>
        units.findIndex(
          (item) => item.toLowerCase() === unit.toLowerCase()
        ) === index
    );

  // Jin KRAs ke paas abhi tak koi KPI nahi hai — banner me inhe list karte hain.
  const missingKpiKras = formKras
    .map((kra, kraIdx) =>
      formKpis.some((kpi) => kpi.kraIdx === kraIdx)
        ? null
        : `KRA ${kraIdx + 1} (${kra.title || "Untitled"})`
    )
    .filter(Boolean);

  // Jin KRAs ki KPIs unki poori weightage cover nahi karti — Continue tabhi khulta hai.
  const unbalancedKras = formKras
    .map((kra, kraIdx) => {
      const limit = Number(kra.weightage) || 0;
      const used = kraKpiWeight(kraIdx);
      if (!formKpis.some((kpi) => kpi.kraIdx === kraIdx) || used === limit)
        return null;
      return `KRA ${kraIdx + 1} (${kra.title || "Untitled"}): ${used}% of ${limit}%${used < limit ? `, ${limit - used}% left` : " — over limit"}`;
    })
    .filter(Boolean);

  return (
    <div>
      {!kpiAiDone && !kpiAiLoading && (
        <AiBar
          text="AI can suggest KPIs for each KRA"
          sub="Measurable indicators generated per KRA."
          onClick={simulateAiKpis}
          label="Generate KPIs"
        />
      )}
      {kpiAiLoading && <Loader text="Mapping KPIs to your KRAs…" />}

      {/* Jab tak KPIs generate ya add nahi hote, Continue kyun band hai ye clearly dikhate hain. */}
      {!kpiAiLoading && formKpis.length === 0 && (
        <div
          style={{
            padding: "12px 18px",
            marginBottom: 16,
            borderRadius: 10,
            fontSize: 12.5,
            fontWeight: 600,
            background: "rgba(231,132,142,.15)",
            color: T.danger,
          }}
        >
          No KPIs yet — generate them with AI or add them manually. Continue stays
          disabled until every KRA has at least one complete KPI.
        </div>
      )}
      {!kpiAiLoading && formKpis.length > 0 && missingKpiKras.length > 0 && (
        <div
          style={{
            padding: "12px 18px",
            marginBottom: 16,
            borderRadius: 10,
            fontSize: 12.5,
            fontWeight: 600,
            background: T.orangeSoft,
            color: T.inkSoft,
          }}
        >
          {missingKpiKras.join(", ")} — add at least one KPI to continue.
        </div>
      )}
      {!kpiAiLoading && unbalancedKras.length > 0 && (
        <div
          style={{
            padding: "12px 18px",
            marginBottom: 16,
            borderRadius: 10,
            fontSize: 12.5,
            fontWeight: 600,
            background: T.orangeSoft,
            color: T.inkSoft,
          }}
        >
          Every KRA's KPIs must add up to its full weightage —{" "}
          {unbalancedKras.join("; ")}
        </div>
      )}

      {formKpis.length > 0 && (
        <div style={{ ...card, marginBottom: 16, padding: "16px 24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: T.inkSoft }}>
              Total KPI Weightage
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color:
                  totalKpiWeight === totalKraWeightage
                    ? T.growth
                    : totalKpiWeight > totalKraWeightage
                      ? T.error
                      : T.orange,
              }}
            >
              {totalKpiWeight}% / {totalKraWeightage}%
              {totalKpiWeight === totalKraWeightage
                ? " ✓ Ready to continue"
                : totalKpiWeight > totalKraWeightage
                  ? " — exceeds KRA weightage"
                  : ` — ${totalKraWeightage - totalKpiWeight}% left to allocate`}
            </span>
          </div>
          <div
            style={{
              height: 6,
              borderRadius: 3,
              background: T.surface,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${totalKraWeightage ? Math.min((totalKpiWeight / totalKraWeightage) * 100, 100) : 0}%`,
                borderRadius: 3,
                background:
                  totalKpiWeight === totalKraWeightage
                    ? T.growth
                    : totalKpiWeight > totalKraWeightage
                      ? T.error
                      : T.orange,
                transition: "width .3s",
              }}
            />
          </div>
        </div>
      )}

      {formKras.map((kra, kraIdx) => {
        const kraKpis = formKpis.filter((p) => p.kraIdx === kraIdx);
        const kraLimit = Number(kra.weightage) || 0;
        const kraKpiTotal = kraKpis.reduce(
          (sum, item) => sum + (Number(item.weightage) || 0),
          0
        );
        const currentKpiUsed = (kpiId) =>
          kraKpis
            .filter((item) => item.id !== kpiId)
            .reduce((sum, item) => sum + (Number(item.weightage) || 0), 0);
        return (
          <div key={kra.id} style={{ marginBottom: 24 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: COLORS[kraIdx % 5],
                  display: "grid",
                  placeItems: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {kraIdx + 1}
              </div>
              <span style={{ fontSize: 13.5, fontWeight: 700 }}>
                KRA {kraIdx + 1}{" "}
                <span style={{ fontWeight: 500, color: T.inkSoft }}>
                  ({kra.title || "Untitled"})
                </span>
              </span>
              {kra.weightage && (
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: 999,
                    background: T.orangeSoft,
                    fontSize: 11,
                    fontWeight: 700,
                    color: T.orange,
                    marginLeft: 4,
                  }}
                >
                  {kra.weightage}% weightage
                </span>
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                paddingLeft: 30,
              }}
            >
              {kraKpis.map((kpi) => (
                <div key={kpi.id} style={{ ...card, padding: "18px 22px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginBottom: 14,
                    }}
                  >
                    <span
                      style={{ fontSize: 12, fontWeight: 700, color: T.orange }}
                    >
                      KPI
                    </span>
                    <button
                      style={gBtn}
                      onClick={() => setKpiToDelete(kpi)}
                      onMouseOver={(e) => {
                        e.currentTarget.style.color = T.danger;
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.color = T.inkMuted;
                      }}
                    >
                      {ico.trash}
                    </button>
                  </div>
                  <div style={g3}>
                    <Fld label="KPI Name *">
                      <FI
                        placeholder="e.g. Task completion rate"
                        value={kpi.name}
                        onChange={(e) =>
                          updFormKpi(kpi.id, "name", e.target.value)
                        }
                      />
                    </Fld>
                    <UnitField
                      value={kpi.unit}
                      onChange={(unit) => updFormKpi(kpi.id, "unit", unit)}
                      extraOptions={unitOptions}
                    />
                    <Fld
                      label="KPI Weightage (%) *"
                      hint={`${kraKpiTotal}% used, ${Math.max(0, kraLimit - kraKpiTotal)}% left of ${kraLimit}% KRA weightage`}
                    >
                      <FI
                        type="number"
                        min={0}
                        max={Math.max(0, kraLimit - currentKpiUsed(kpi.id))}
                        placeholder="e.g. 15"
                        value={kpi.weightage}
                        onChange={(e) => {
                          const remaining = Math.max(
                            0,
                            kraLimit - currentKpiUsed(kpi.id)
                          );
                          const raw = e.target.value;
                          if (raw === "") {
                            updFormKpi(kpi.id, "weightage", "");
                            return;
                          }
                          // KRA ki weightage se upar KPI total nahi ja sakta.
                          const capped = Math.min(Number(raw), remaining);
                          if (Number(raw) > remaining) {
                            toast.error(
                              `KPIs of KRA ${kraIdx + 1} (${kra.title || "Untitled"}) cannot exceed its ${kraLimit}% weightage — only ${remaining}% left`
                            );
                          }
                          updFormKpi(kpi.id, "weightage", String(capped));
                        }}
                      />
                      {Number(kpi.weightage) > Math.max(0, kraLimit - currentKpiUsed(kpi.id)) && (
                        <span style={{ fontSize: 11, color: T.danger }}>
                          Exceeds {kraLimit}% total for this KRA
                        </span>
                      )}
                    </Fld>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr 1fr",
                      gap: 16,
                      marginBottom: 18,
                    }}
                  >
                    <Fld label="Target Value *">
                      <FI
                        placeholder="e.g. 95"
                        value={kpi.target}
                        onChange={(e) =>
                          updFormKpi(kpi.id, "target", e.target.value)
                        }
                      />
                    </Fld>
                    <Fld label="Target Frequency *">
                      <FS
                        value={kpi.freq}
                        onChange={(e) =>
                          updFormKpi(kpi.id, "freq", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        {TARGET_FREQ.map((fr) => (
                          <option key={fr}>{fr}</option>
                        ))}
                      </FS>
                    </Fld>
                    <Fld label="Update Type *">
                      <FS
                        value={kpi.updateType}
                        onChange={(e) =>
                          updFormKpi(kpi.id, "updateType", e.target.value)
                        }
                      >
                        <option value="manual">Manual Entry</option>
                        <option value="automatic">Automatic</option>
                      </FS>
                    </Fld>
                    <Fld
                      label="Measurement Type"
                      hint={
                        kpi.measurementType === "negative"
                          ? "Missing target deducts points"
                          : "Missing target doesn't deduct"
                      }
                    >
                      <FS
                        value={kpi.measurementType || "positive"}
                        onChange={(e) =>
                          updFormKpi(kpi.id, "measurementType", e.target.value)
                        }
                      >
                        <option value="positive">Positive</option>
                        <option value="negative">Negative</option>
                      </FS>
                    </Fld>
                  </div>
                  {kpi.updateType === "automatic" && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 16,
                        marginTop: 4,
                      }}
                    >
                      <Fld label="Data Source *">
                        <FS
                          value={kpi.dataSource}
                          onChange={(e) => {
                            updFormKpi(kpi.id, "dataSource", e.target.value);
                            updFormKpi(kpi.id, "module", "");
                          }}
                        >
                          <option value="">Select data source</option>
                          {DATA_SOURCES.map((ds) => (
                            <option key={ds}>{ds}</option>
                          ))}
                        </FS>
                      </Fld>
                      {kpi.dataSource && (
                        <Fld label="Module *">
                          <FS
                            value={kpi.module}
                            onChange={(e) =>
                              updFormKpi(kpi.id, "module", e.target.value)
                            }
                          >
                            <option value="">Select module</option>
                            {(MODULES_BY_SOURCE[kpi.dataSource] || []).map(
                              (m) => (
                                <option key={m}>{m}</option>
                              )
                            )}
                          </FS>
                        </Fld>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <button
                style={{
                  ...smBtn,
                  alignSelf: "flex-start",
                  opacity: kraKpiTotal >= kraLimit && kraLimit > 0 ? 0.5 : 1,
                  cursor:
                    kraKpiTotal >= kraLimit && kraLimit > 0
                      ? "not-allowed"
                      : "pointer",
                }}
                onClick={() => {
                  if (kraLimit > 0 && kraKpiTotal >= kraLimit) {
                    toast.error(
                      `KPIs of KRA ${kraIdx + 1} (${kra.title || "Untitled"}) already use its full ${kraLimit}% weightage`
                    );
                    return;
                  }
                  addFormKpi(kraIdx);
                }}
                title={
                  kraKpiTotal >= kraLimit && kraLimit > 0
                    ? `${kraLimit}% weightage already allocated to this KRA's KPIs`
                    : undefined
                }
              >
                {ico.plus} Add KPI
              </button>
            </div>
          </div>
        );
      })}

      <ConfirmDialog
        open={!!kpiToDelete}
        title="Delete this KPI?"
        message={`"${kpiToDelete?.name || "This KPI"}" will be removed from its KRA. This can't be undone.`}
        confirmLabel="Delete KPI"
        onCancel={() => setKpiToDelete(null)}
        onConfirm={() => {
          remFormKpi(kpiToDelete.id);
          setKpiToDelete(null);
          toast.success("KPI removed");
        }}
      />
    </div>
  );
}

export function StepReview() {
  const { jobForm, formKras, formKpis, totalKpiWeight } = useJobs();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={card}>
        <SH
          icon={ico.briefcase}
          title={jobForm.title || "Untitled Role"}
          sub={`${jobForm.dept} · ${jobForm.level} · ${jobForm.type}`}
        />
        {jobForm.location && (
          <p style={{ fontSize: 12.5, color: T.inkMuted, margin: "4px 0 0" }}>
            📍 {jobForm.location}
            {jobForm.reportingTo ? ` · Reports to ${jobForm.reportingTo}` : ""}
          </p>
        )}
      </div>
      <div style={card}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
          Role Summary
        </div>
        <p
          style={{
            fontSize: 13,
            color: T.inkSoft,
            lineHeight: 1.7,
            margin: 0,
            whiteSpace: "pre-wrap",
          }}
        >
          {jobForm.summary}
        </p>
      </div>
      <div style={card}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700 }}>KRAs & KPIs</span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: totalKpiWeight === 100 ? T.growth : T.orange,
            }}
          >
            {formKras.length} KRAs · {formKpis.length} KPIs · {totalKpiWeight}%
            weightage
          </span>
        </div>
        {formKras.map((kra, i) => (
          <div
            key={kra.id}
            style={{
              padding: "14px 0",
              borderTop: i > 0 ? `1px solid ${T.borderSoft}` : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
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
                  fontSize: 10,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <span style={{ fontSize: 13.5, fontWeight: 700 }}>
                {kra.title}
              </span>
              <StatusPill s={kra.status} />
            </div>
            {kra.effectiveFrom && (
              <p
                style={{
                  fontSize: 11,
                  color: T.inkMuted,
                  margin: "2px 0 6px 28px",
                }}
              >
                {ico.calendar} {kra.effectiveFrom} → {kra.effectiveTo}
              </p>
            )}
            {formKpis
              .filter((p) => p.kraIdx === i)
              .map((kpi) => (
                <div
                  key={kpi.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginLeft: 28,
                    padding: "6px 0",
                    fontSize: 12.5,
                  }}
                >
                  <span style={{ color: T.ink, fontWeight: 600, flex: 1 }}>
                    {kpi.name}
                  </span>
                  <span style={{ color: T.inkMuted }}>{kpi.weightage}%</span>
                  <span style={{ color: T.inkMuted }}>
                    Target: {kpi.target} {kpi.unit}
                  </span>
                  <span style={{ color: T.inkMuted }}>{kpi.freq}</span>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: 999,
                      fontSize: 10,
                      fontWeight: 600,
                      background:
                        kpi.updateType === "automatic" ? T.kpiMint : T.kpiCream,
                      color: T.ink,
                    }}
                  >
                    {kpi.updateType === "automatic"
                      ? `Auto · ${kpi.dataSource}`
                      : "Manual"}
                  </span>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
