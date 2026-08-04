// @ts-nocheck
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useJobs } from "../JobsContext";
import { T, COLORS } from "../constants";
import { I, ico } from "../icons";
import { Btn, StatusPill, aBtn, Loader } from "./UI";
import { useFetchJobs } from "../hooks/useFetchJobs";

const initials = (name) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function JdList() {
  const navigate = useNavigate();
  const {
    jdSearch, setJdSearch,
    resetCreate,
    actionMenuJd, setActionMenuJd,
    setAssignModal,
    publishJd,
    escalateUsers = [],
  } = useJobs();

  const { data: apiJds, isLoading, error } = useFetchJobs();
  // API kabhi sirf assignee ids bhejta hai — naam users list se resolve karte hain.
  const nameById = useMemo(
    () =>
      new Map(
        (escalateUsers || []).map((u) => [
          String(u.id),
          u.full_name || u.name || `User ${u.id}`,
        ])
      ),
    [escalateUsers]
  );
  const filteredJds = (apiJds || [])
    .filter((j) => j.title.toLowerCase().includes(jdSearch.toLowerCase()))
    .map((jd) => ({
      ...jd,
      assigned: jd.assigned?.length
        ? jd.assigned
        : (jd.assigneeIds || []).map(
            (id) => nameById.get(String(id)) || `User ${id}`
          ),
    }));

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 14px",
            background: T.raised,
            border: `1px solid ${T.borderSoft}`,
            borderRadius: T.rmd,
            minHeight: 40,
            width: 280,
          }}
        >
          <span style={{ display: "flex", color: T.inkMuted }}>
            {ico.search}
          </span>
          <input
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              flex: 1,
              fontSize: 13,
              fontWeight: 500,
              fontFamily: T.font,
              color: T.ink,
            }}
            placeholder="Search job descriptions..."
            value={jdSearch}
            onChange={(e) => setJdSearch(e.target.value)}
          />
        </div>
        <Btn
          primary
          onClick={() => {
            resetCreate();
            navigate("/admin-compass/jobs/create");
          }}
        >
          {ico.plus} Create JD
        </Btn>
      </div>

      {isLoading && (
        <Loader text="Loading job descriptions…" />
      )}

      {error && (
        <div
          style={{
            padding: 24,
            textAlign: "center",
            color: T.danger,
            fontSize: 14,
          }}
        >
          Failed to load job descriptions. Please try again.
        </div>
      )}

      {!isLoading && !error && filteredJds.length === 0 && (
        <div
          style={{
            padding: 40,
            textAlign: "center",
            color: T.inkMuted,
            fontSize: 14,
          }}
        >
          No job descriptions found.
        </div>
      )}

      {!isLoading && !error && filteredJds.length > 0 && (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 100px 90px 60px 60px 120px 90px 80px",
            gap: 10,
            padding: "10px 20px",
            fontSize: 11,
            fontWeight: 700,
            color: T.inkMuted,
            textTransform: "uppercase",
            letterSpacing: ".05em",
          }}
        >
          <span>Title</span>
          <span>Dept</span>
          <span>Level</span>
          <span>KRAs</span>
          <span>KPIs</span>
          <span>Assigned</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        {filteredJds.map((jd) => (
          <div
            key={jd.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 100px 90px 60px 60px 120px 90px 80px",
              gap: 10,
              padding: "14px 20px",
              background: T.surface,
              border: `1px solid ${T.borderSoft}`,
              borderRadius: T.rlg,
              alignItems: "center",
            }}
            onMouseOver={(e) => (e.currentTarget.style.boxShadow = T.shadow)}
            onMouseOut={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700 }}>{jd.title}</div>
              <div style={{ fontSize: 11, color: T.inkMuted, marginTop: 2 }}>
                {jd.type} · {jd.created}
              </div>
            </div>
            <span style={{ fontSize: 12, color: T.inkSoft }}>{jd.dept}</span>
            <span style={{ fontSize: 12, color: T.inkSoft }}>{jd.level}</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>
              {jd.krasCount}
            </span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>
              {jd.kpisCount}
            </span>
            <div>
              {jd.assigned.length > 0 ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  {jd.assigned.slice(0, 3).map((a, ai) => (
                    <div
                      key={ai}
                      title={a}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: [
                          T.kpiBlue,
                          T.kpiMint,
                          T.kpiLav,
                          T.kpiPeach,
                          T.kpiCream,
                        ][ai % 5],
                        display: "grid",
                        placeItems: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        color: T.ink,
                        marginLeft: ai > 0 ? -6 : 0,
                        border: `2px solid ${T.surface}`,
                        position: "relative",
                        zIndex: 3 - ai,
                      }}
                    >
                      {initials(a)}
                    </div>
                  ))}
                  {jd.assigned.length > 3 && (
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: T.borderWarm,
                        display: "grid",
                        placeItems: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        color: T.inkSoft,
                        marginLeft: -6,
                        border: `2px solid ${T.surface}`,
                      }}
                    >
                      +{jd.assigned.length - 3}
                    </div>
                  )}
                </div>
              ) : (
                <span style={{ fontSize: 11, color: T.inkMuted }}>
                  Unassigned
                </span>
              )}
            </div>
            <StatusPill s={jd.status} />
            <div
              style={{
                display: "flex",
                gap: 6,
                alignItems: "center",
                position: "relative",
              }}
            >
              <button
                style={aBtn}
                title="Actions"
                onClick={(e) => {
                  e.stopPropagation();
                  setActionMenuJd(actionMenuJd === jd.id ? null : jd.id);
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = T.orangeSoft;
                  e.currentTarget.style.color = T.orange;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = T.raised;
                  e.currentTarget.style.color = T.inkMuted;
                }}
              >
                {ico.moreVert}
              </button>
              {actionMenuJd === jd.id && (
                <div
                  style={{
                    position: "absolute",
                    top: 36,
                    right: 38,
                    background: T.raised,
                    border: `1px solid ${T.borderSoft}`,
                    borderRadius: T.rmd,
                    boxShadow: "0 6px 24px rgba(44,44,44,.12)",
                    zIndex: 20,
                    minWidth: 160,
                    overflow: "hidden",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    style={{
                      width: "100%",
                      padding: "10px 16px",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontFamily: T.font,
                      fontSize: 13,
                      fontWeight: 500,
                      color: T.ink,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      transition: "background .12s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = T.surface)
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                    onClick={() => {
                      setActionMenuJd(null);
                      navigate(`/admin-compass/jobs/edit/${jd.id}`);
                    }}
                  >
                    <span style={{ display: "flex", color: T.inkMuted }}>
                      {ico.edit}
                    </span>
                    Edit
                  </button>
                  <button
                    style={{
                      width: "100%",
                      padding: "10px 16px",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontFamily: T.font,
                      fontSize: 13,
                      fontWeight: 500,
                      color: T.ink,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      transition: "background .12s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = T.surface)
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                    onClick={() => {
                      setActionMenuJd(null);
                      setAssignModal(jd.id);
                    }}
                  >
                    <span style={{ display: "flex", color: T.inkMuted }}>
                      {ico.userPlus}
                    </span>
                    Assign Person
                  </button>
                  {jd.status === "draft" && (
                    <>
                      <div style={{ height: 1, background: T.borderSoft }} />
                      <button
                        style={{
                          width: "100%",
                          padding: "10px 16px",
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          fontFamily: T.font,
                          fontSize: 13,
                          fontWeight: 600,
                          color: T.growth,
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          transition: "background .12s",
                        }}
                        onMouseOver={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(16,140,114,.06)")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                        onClick={() => {
                          setActionMenuJd(null);
                          publishJd(jd.id);
                        }}
                      >
                        <span style={{ display: "flex" }}>{ico.power}</span>
                        Publish
                      </button>
                    </>
                  )}
                </div>
              )}
              <button
                style={aBtn}
                title="View Details"
                onClick={() => navigate(`/admin-compass/jobs/${jd.id}`)}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = T.orangeSoft;
                  e.currentTarget.style.color = T.orange;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = T.raised;
                  e.currentTarget.style.color = T.inkMuted;
                }}
              >
                {ico.eye}
              </button>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
