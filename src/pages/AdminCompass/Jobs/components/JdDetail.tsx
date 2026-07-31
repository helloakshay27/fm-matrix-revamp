// @ts-nocheck
import { useNavigate } from "react-router-dom";
import { useJobs } from "../JobsContext";
import { T, COLORS } from "../constants";
import { I, ico } from "../icons";
import { card, Btn, StatusPill } from "./UI";

export default function JdDetail({ jd: propJd, kras: propKras, kpis: propKpis }) {
  const navigate = useNavigate();
  const {
    allJds, viewingJd,
    allKras, allKpis,
    publishJd, setAssignModal,
    initials: ctxInitials,
  } = useJobs();

  const fromProps = propJd && propKras && propKpis;
  const jd = fromProps ? propJd : allJds.find((j) => j.id === viewingJd);
  if (!jd) return null;
  const jdKras = fromProps ? propKras : allKras.filter((k) => k.jdId === jd.id);
  const jdKpis = fromProps ? propKpis : allKpis.filter((p) => p.jdId === jd.id);
  const initials = fromProps ? 
    (name) => name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() :
    ctxInitials;
  const totalKraWt = jdKras.reduce((s, k) => s + (k.weightage || 0), 0);
  const totalKpiWt = jdKpis.reduce((s, p) => s + (p.weightage || 0), 0);

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
        onClick={() => navigate("/admin-compass/jobs")}
      >
        {ico.arrowLeft} Back to Job Descriptions
      </button>

      <div style={{ ...card, marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>
              {jd.title}
            </h2>
            <p style={{ fontSize: 13, color: T.inkSoft, margin: 0 }}>
              {jd.dept} · {jd.level} · {jd.type}
            </p>
            <p style={{ fontSize: 12, color: T.inkMuted, margin: "6px 0 0" }}>
              Created {jd.created}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <StatusPill s={jd.status} />
            {jd.status === "draft" && (
              <Btn primary onClick={() => publishJd(jd.id)}>
                {ico.power} Publish
              </Btn>
            )}
            <Btn
              onClick={() => {
                navigate(`/admin-compass/jobs/edit/${jd.id}`);
              }}
            >
              {ico.edit} Edit
            </Btn>
            <Btn
              onClick={() => {
                setAssignModal(jd.id);
              }}
            >
              {ico.userPlus} Assign Person
            </Btn>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {[
          { label: "KRAs", value: jdKras.length, bg: T.kpiBlue },
          { label: "KPIs", value: jdKpis.length, bg: T.kpiMint },
          { label: "KRA Weightage", value: totalKraWt + "%", bg: T.kpiLav },
          { label: "KPI Weightage", value: totalKpiWt + "%", bg: T.kpiCream },
        ].map((st, i) => (
          <div
            key={i}
            style={{
              padding: "16px 20px",
              borderRadius: T.rlg,
              background: st.bg,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: T.inkSoft,
                marginBottom: 6,
              }}
            >
              {st.label}
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.ink }}>
              {st.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ ...card, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>
          Assigned Members
        </div>
        {jd.assigned.length === 0 ? (
          <p style={{ fontSize: 13, color: T.inkMuted, margin: 0 }}>
            No members assigned to this role yet.
          </p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {jd.assigned.map((name, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 16px",
                  borderRadius: T.rmd,
                  background: T.raised,
                  border: `1px solid ${T.borderSoft}`,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: COLORS[i % 5],
                    display: "grid",
                    placeItems: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: T.ink,
                    flexShrink: 0,
                  }}
                >
                  {initials(name)}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{name}</div>
                  <div style={{ fontSize: 11, color: T.inkMuted }}>
                    Team Member
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ ...card }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700 }}>KRAs & KPIs</div>
          <span style={{ fontSize: 12, fontWeight: 600, color: T.inkSoft }}>
            {jdKras.length} KRAs · {jdKpis.length} KPIs
          </span>
        </div>
        {jdKras.length === 0 ? (
          <p style={{ fontSize: 13, color: T.inkMuted, margin: 0 }}>
            No KRAs defined for this role yet.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {jdKras.map((kra, i) => {
              const kraKpis = jdKpis.filter((p) => p.kraId === kra.id);
              return (
                <div
                  key={kra.id}
                  style={{
                    padding: "18px 20px",
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
                      marginBottom: 6,
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
                          width: 22,
                          height: 22,
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
                      <span style={{ fontSize: 14, fontWeight: 700 }}>
                        {kra.title}
                      </span>
                      <StatusPill s={kra.status} />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontSize: 12,
                      }}
                    >
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: 999,
                          background: T.surface,
                          fontWeight: 700,
                        }}
                      >
                        {kra.weightage || 0}%
                      </span>
                      {kra.effectiveFrom && (
                        <span style={{ color: T.inkMuted }}>
                          {kra.effectiveFrom} → {kra.effectiveTo}
                        </span>
                      )}
                    </div>
                  </div>
                  {kra.desc && (
                    <p
                      style={{
                        fontSize: 12.5,
                        color: T.inkSoft,
                        lineHeight: 1.6,
                        margin: "4px 0 12px 30px",
                      }}
                    >
                      {kra.desc}
                    </p>
                  )}

                  {kraKpis.length > 0 && (
                    <div
                      style={{
                        marginLeft: 30,
                        borderTop: `1px solid ${T.borderSoft}`,
                        paddingTop: 10,
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "1fr 60px 70px 80px 80px 110px",
                          gap: 8,
                          padding: "6px 0",
                          fontSize: 11,
                          fontWeight: 700,
                          color: T.inkMuted,
                          textTransform: "uppercase",
                          letterSpacing: ".04em",
                        }}
                      >
                        <span>KPI</span>
                        <span>Wt%</span>
                        <span>Target</span>
                        <span>Unit</span>
                        <span>Freq</span>
                        <span>Update</span>
                      </div>
                      {kraKpis.map((kpi) => (
                        <div
                          key={kpi.id}
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "1fr 60px 70px 80px 80px 110px",
                            gap: 8,
                            padding: "8px 0",
                            fontSize: 12.5,
                            borderTop: `1px solid ${T.borderSoft}`,
                            alignItems: "center",
                          }}
                        >
                          <span style={{ fontWeight: 600 }}>{kpi.name}</span>
                          <span style={{ fontWeight: 600 }}>
                            {kpi.weightage}%
                          </span>
                          <span style={{ color: T.inkSoft }}>
                            {kpi.target}
                          </span>
                          <span style={{ color: T.inkSoft }}>{kpi.unit}</span>
                          <span style={{ color: T.inkSoft }}>{kpi.freq}</span>
                          <span
                            style={{
                              padding: "2px 8px",
                              borderRadius: 999,
                              fontSize: 10,
                              fontWeight: 600,
                              background:
                                kpi.updateType === "automatic"
                                  ? T.kpiMint
                                  : T.kpiCream,
                            }}
                          >
                            {kpi.updateType === "automatic"
                              ? `Auto · ${kpi.dataSource}`
                              : "Manual"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {kraKpis.length === 0 && (
                    <p
                      style={{
                        fontSize: 12,
                        color: T.inkMuted,
                        margin: "4px 0 0 30px",
                      }}
                    >
                      No KPIs linked.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
