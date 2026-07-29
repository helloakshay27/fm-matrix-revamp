// @ts-nocheck
import { useJobs } from "../JobsContext";
import { T, COLORS } from "../constants";
import { I, ico } from "../icons";
import { card, gBtn, aBtn, Btn, StatusPill, FilterSelect, AiBar, Loader } from "./UI";

export default function KraList() {
  const {
    filteredKras, allKpis, allJds,
    kraSearch, setKraSearch,
    kraDeptFilter, setKraDeptFilter,
    kraRoleFilter, setKraRoleFilter,
    kraMemberFilter, setKraMemberFilter,
    kraViewMode, setKraViewMode,
    uniqueDepts, uniqueRoles, uniqueMembers,
    expandedKra, setExpandedKra,
    toggleKraStatus, openEditKra, setAssignKraModal,
    kraAiDone, aiLoading, simulateAiKras,
    setShowAddKra,
    jdTitle,
  } = useJobs();

  return (
    <div>
      {!kraAiDone && !aiLoading && (
        <AiBar
          text="AI can suggest KRAs based on this role"
          sub="Generated from the job description. You can edit or remove any."
          onClick={simulateAiKras}
          label="Generate KRAs"
        />
      )}
      {aiLoading && <Loader text="Analysing role and generating KRAs…" />}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 14px", background: T.raised, border: `1px solid ${T.borderSoft}`, borderRadius: T.rmd, minHeight: 40, width: 240 }}>
            <span style={{ display: "flex", color: T.inkMuted }}>{ico.search}</span>
            <input
              style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontSize: 13, fontWeight: 500, fontFamily: T.font, color: T.ink }}
              placeholder="Search KRAs..."
              value={kraSearch}
              onChange={(e) => setKraSearch(e.target.value)}
            />
          </div>
          <FilterSelect value={kraDeptFilter} onChange={(e) => setKraDeptFilter(e.target.value)} label="All Departments" options={uniqueDepts} />
          <FilterSelect value={kraRoleFilter} onChange={(e) => setKraRoleFilter(e.target.value)} label="All Roles" options={uniqueRoles} />
          <FilterSelect value={kraMemberFilter} onChange={(e) => setKraMemberFilter(e.target.value)} label="All Members" options={uniqueMembers} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ padding: "6px 14px", borderRadius: 999, background: T.orangeSoft, fontSize: 12, fontWeight: 700, color: T.orange }}>
            {filteredKras.length} KRAs
          </div>
          <div style={{ display: "flex", border: `1px solid ${T.borderSoft}`, borderRadius: T.rsm, overflow: "hidden" }}>
            <button
              style={{ ...gBtn, width: 36, height: 36, borderRadius: 0, background: kraViewMode === "list" ? T.orangeSoft : T.raised, color: kraViewMode === "list" ? T.orange : T.inkMuted, border: "none" }}
              title="List View"
              onClick={() => setKraViewMode("list")}
            >
              {ico.listView}
            </button>
            <button
              style={{ ...gBtn, width: 36, height: 36, borderRadius: 0, background: kraViewMode === "card" ? T.orangeSoft : T.raised, color: kraViewMode === "card" ? T.orange : T.inkMuted, border: "none", borderLeft: `1px solid ${T.borderSoft}` }}
              title="Card View"
              onClick={() => setKraViewMode("card")}
            >
              {ico.grid}
            </button>
          </div>
          <Btn primary onClick={() => setShowAddKra(true)}>{ico.plus} Add KRA</Btn>
        </div>
      </div>

      {kraViewMode === "card" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {filteredKras.map((kra, i) => {
            const linked = allKpis.filter((p) => p.kraId === kra.id);
            return (
              <div
                key={kra.id}
                style={{ ...card, position: "relative", overflow: "hidden" }}
                onMouseOver={(e) => (e.currentTarget.style.boxShadow = T.shadow)}
                onMouseOut={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: COLORS[i % 5] }} />
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: COLORS[i % 5], display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{kra.title}</span>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button style={aBtn} title="Edit" onClick={() => openEditKra(kra)}
                      onMouseOver={(e) => { e.currentTarget.style.background = T.orangeSoft; e.currentTarget.style.color = T.orange; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = T.raised; e.currentTarget.style.color = T.inkMuted; }}
                    >{ico.edit}</button>
                    <button style={aBtn} title={kra.status === "active" ? "Deactivate" : "Activate"} onClick={() => toggleKraStatus(kra.id)}
                      onMouseOver={(e) => { e.currentTarget.style.background = kra.status === "active" ? "rgba(228,145,145,.1)" : T.orangeSoft; e.currentTarget.style.color = kra.status === "active" ? T.danger : T.orange; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = T.raised; e.currentTarget.style.color = T.inkMuted; }}
                    >{ico.power}</button>
                    <button style={aBtn} title="Assign Person" onClick={() => setAssignKraModal(kra.id)}
                      onMouseOver={(e) => { e.currentTarget.style.background = T.orangeSoft; e.currentTarget.style.color = T.orange; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = T.raised; e.currentTarget.style.color = T.inkMuted; }}
                    >{ico.userPlus}</button>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: T.inkMuted, marginBottom: 8 }}>{jdTitle(kra.jdId)}</div>
                {kra.desc && (
                  <p style={{ fontSize: 12, color: T.inkSoft, lineHeight: 1.5, margin: "0 0 10px" }}>{kra.desc}</p>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ padding: "3px 10px", borderRadius: 999, background: T.surface, fontSize: 11, fontWeight: 700 }}>{kra.weightage || 0}%</span>
                  <span style={{ fontSize: 11, color: T.inkSoft }}>{linked.length} KPIs</span>
                  <StatusPill s={kra.status} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filteredKras.map((kra, i) => {
            const linked = allKpis.filter((p) => p.kraId === kra.id);
            const isOpen = expandedKra === kra.id;
            return (
              <div
                key={kra.id}
                style={{ background: T.surface, border: `1px solid ${T.borderSoft}`, borderRadius: T.rlg, overflow: "hidden" }}
                onMouseOver={(e) => (e.currentTarget.style.boxShadow = T.shadow)}
                onMouseOut={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <div
                  style={{ display: "grid", gridTemplateColumns: "4px 1fr 70px 130px 100px 80px 120px 36px", alignItems: "center", gap: 12, padding: "14px 16px 14px 0", cursor: "pointer" }}
                  onClick={() => setExpandedKra(isOpen ? null : kra.id)}
                >
                  <div style={{ width: 4, height: "100%", background: COLORS[i % 5], borderRadius: "16px 0 0 16px", alignSelf: "stretch" }} />
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700 }}>{kra.title}</div>
                    <div style={{ fontSize: 11, color: T.inkMuted, marginTop: 2 }}>
                      {jdTitle(kra.jdId)}
                      {kra.effectiveFrom && <span> · {kra.effectiveFrom} → {kra.effectiveTo}</span>}
                    </div>
                  </div>
                  <div style={{ padding: "4px 10px", borderRadius: 999, background: T.surface, fontSize: 12, fontWeight: 700, color: T.ink, textAlign: "center" }}>
                    {kra.weightage || 0}%
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ display: "flex", color: T.inkMuted }}>{ico.link}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: T.inkSoft }}>{linked.length} KPIs</span>
                  </div>
                  <StatusPill s={kra.status} />
                  <div style={{ display: "flex", gap: 4 }} onClick={(e) => e.stopPropagation()}>
                    <button style={aBtn} title="Edit" onClick={() => openEditKra(kra)}
                      onMouseOver={(e) => { e.currentTarget.style.background = T.orangeSoft; e.currentTarget.style.color = T.orange; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = T.raised; e.currentTarget.style.color = T.inkMuted; }}
                    >{ico.edit}</button>
                    <button style={aBtn} title={kra.status === "active" ? "Deactivate" : "Activate"} onClick={() => toggleKraStatus(kra.id)}
                      onMouseOver={(e) => { e.currentTarget.style.background = kra.status === "active" ? "rgba(228,145,145,.1)" : T.orangeSoft; e.currentTarget.style.color = kra.status === "active" ? T.danger : T.orange; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = T.raised; e.currentTarget.style.color = T.inkMuted; }}
                    >{ico.power}</button>
                    <button style={aBtn} title="Assign Person" onClick={() => setAssignKraModal(kra.id)}
                      onMouseOver={(e) => { e.currentTarget.style.background = T.orangeSoft; e.currentTarget.style.color = T.orange; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = T.raised; e.currentTarget.style.color = T.inkMuted; }}
                    >{ico.userPlus}</button>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s", color: T.inkMuted }}>
                    {ico.chevDown}
                  </div>
                </div>
                {isOpen && (
                  <div style={{ padding: "0 20px 16px", borderTop: `1px solid ${T.borderSoft}` }}>
                    {kra.desc && (
                      <p style={{ fontSize: 12.5, color: T.inkSoft, lineHeight: 1.6, margin: "12px 0 14px 4px" }}>{kra.desc}</p>
                    )}
                    {linked.length > 0 && linked.map((kpi) => (
                      <div key={kpi.id} style={{ display: "grid", gridTemplateColumns: "1fr 70px 80px 90px 90px 100px", gap: 8, padding: "10px 8px", fontSize: 12, borderTop: `1px solid ${T.borderSoft}`, alignItems: "center" }}>
                        <span style={{ fontWeight: 600 }}>{kpi.name}</span>
                        <span style={{ color: T.inkMuted }}>{kpi.weightage}%</span>
                        <span style={{ color: T.inkMuted }}>T: {kpi.target}</span>
                        <span style={{ color: T.inkMuted }}>{kpi.freq}</span>
                        <span style={{ color: T.inkMuted }}>{kpi.unit}</span>
                        <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 600, background: kpi.updateType === "automatic" ? T.kpiMint : T.kpiCream }}>
                          {kpi.updateType === "automatic" ? `Auto · ${kpi.dataSource}` : "Manual"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
