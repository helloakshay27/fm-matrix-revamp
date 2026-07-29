// @ts-nocheck
import { useJobs } from "../JobsContext";
import { T, COLORS } from "../constants";
import { I, ico } from "../icons";
import { card, gBtn, aBtn, Btn, FilterSelect } from "./UI";

export default function KpiList() {
  const {
    filteredKpis, allKpis, allJds, allKras,
    kpiSearch, setKpiSearch,
    kpiDeptFilter, setKpiDeptFilter,
    kpiRoleFilter, setKpiRoleFilter,
    kpiMemberFilter, setKpiMemberFilter,
    kpiViewMode, setKpiViewMode,
    uniqueDepts, uniqueRoles, uniqueMembers,
    toggleKpiStatus, openEditKpi, setAssignKpiModal,
    setShowAddKpi,
    jdTitle, kraName,
  } = useJobs();

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 14px", background: T.raised, border: `1px solid ${T.borderSoft}`, borderRadius: T.rmd, minHeight: 40, width: 240 }}>
            <span style={{ display: "flex", color: T.inkMuted }}>{ico.search}</span>
            <input
              style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontSize: 13, fontWeight: 500, fontFamily: T.font, color: T.ink }}
              placeholder="Search KPIs..."
              value={kpiSearch}
              onChange={(e) => setKpiSearch(e.target.value)}
            />
          </div>
          <FilterSelect value={kpiDeptFilter} onChange={(e) => setKpiDeptFilter(e.target.value)} label="All Departments" options={uniqueDepts} />
          <FilterSelect value={kpiRoleFilter} onChange={(e) => setKpiRoleFilter(e.target.value)} label="All Roles" options={uniqueRoles} />
          <FilterSelect value={kpiMemberFilter} onChange={(e) => setKpiMemberFilter(e.target.value)} label="All Members" options={uniqueMembers} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ padding: "6px 14px", borderRadius: 999, background: T.orangeSoft, fontSize: 12, fontWeight: 700, color: T.orange }}>
            {filteredKpis.length} KPIs
          </div>
          <div style={{ display: "flex", border: `1px solid ${T.borderSoft}`, borderRadius: T.rsm, overflow: "hidden" }}>
            <button
              style={{ ...gBtn, width: 36, height: 36, borderRadius: 0, background: kpiViewMode === "list" ? T.orangeSoft : T.raised, color: kpiViewMode === "list" ? T.orange : T.inkMuted, border: "none" }}
              title="List View"
              onClick={() => setKpiViewMode("list")}
            >
              {ico.listView}
            </button>
            <button
              style={{ ...gBtn, width: 36, height: 36, borderRadius: 0, background: kpiViewMode === "card" ? T.orangeSoft : T.raised, color: kpiViewMode === "card" ? T.orange : T.inkMuted, border: "none", borderLeft: `1px solid ${T.borderSoft}` }}
              title="Card View"
              onClick={() => setKpiViewMode("card")}
            >
              {ico.grid}
            </button>
          </div>
          <Btn primary onClick={() => setShowAddKpi(true)}>{ico.plus} Add KPI</Btn>
        </div>
      </div>

      {kpiViewMode === "card" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {filteredKpis.map((kpi, i) => (
            <div
              key={kpi.id}
              style={{ ...card, position: "relative", overflow: "hidden" }}
              onMouseOver={(e) => (e.currentTarget.style.boxShadow = T.shadow)}
              onMouseOut={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: COLORS[i % 5] }} />
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, flex: 1 }}>{kpi.name}</span>
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  <button style={aBtn} title="Edit" onClick={() => openEditKpi(kpi)}
                    onMouseOver={(e) => { e.currentTarget.style.background = T.orangeSoft; e.currentTarget.style.color = T.orange; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = T.raised; e.currentTarget.style.color = T.inkMuted; }}
                  >{ico.edit}</button>
                  <button style={aBtn} title={kpi.status === "active" ? "Deactivate" : "Activate"} onClick={() => toggleKpiStatus(kpi.id)}
                    onMouseOver={(e) => { e.currentTarget.style.background = kpi.status === "active" ? "rgba(228,145,145,.1)" : T.orangeSoft; e.currentTarget.style.color = kpi.status === "active" ? T.danger : T.orange; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = T.raised; e.currentTarget.style.color = T.inkMuted; }}
                  >{ico.power}</button>
                  <button style={aBtn} title="Assign Person" onClick={() => setAssignKpiModal(kpi.id)}
                    onMouseOver={(e) => { e.currentTarget.style.background = T.orangeSoft; e.currentTarget.style.color = T.orange; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = T.raised; e.currentTarget.style.color = T.inkMuted; }}
                  >{ico.userPlus}</button>
                </div>
              </div>
              <div style={{ fontSize: 11.5, color: T.inkMuted, marginBottom: 4 }}>
                {jdTitle(kpi.jdId)} · {kraName(kpi.kraId)}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                <span style={{ padding: "3px 10px", borderRadius: 999, background: T.surface, fontSize: 11, fontWeight: 700 }}>{kpi.weightage}%</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: T.ink }}>T: {kpi.target}</span>
                <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 600, background: T.kpiLav }}>{kpi.freq}</span>
                <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 600, background: kpi.updateType === "automatic" ? T.kpiMint : T.kpiCream }}>
                  {kpi.updateType === "automatic" ? `Auto` : "Manual"}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background: T.surface, border: `1px solid ${T.borderSoft}`, borderRadius: T.rlg, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 110px 110px 50px 60px 70px 90px 100px", gap: 10, padding: "12px 20px", fontSize: 11, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase", letterSpacing: ".05em", borderBottom: `1px solid ${T.borderSoft}` }}>
            <span>KPI Name</span>
            <span>Job Desc</span>
            <span>Linked KRA</span>
            <span>Wt%</span>
            <span>Target</span>
            <span>Freq</span>
            <span>Update</span>
            <span>Actions</span>
          </div>
          {filteredKpis.map((kpi, i) => (
            <div
              key={kpi.id}
              style={{ display: "grid", gridTemplateColumns: "1fr 110px 110px 50px 60px 70px 90px 100px", gap: 10, padding: "12px 20px", fontSize: 12.5, borderBottom: i < filteredKpis.length - 1 ? `1px solid ${T.borderSoft}` : "none", alignItems: "center" }}
              onMouseOver={(e) => (e.currentTarget.style.background = T.warm)}
              onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ fontWeight: 600 }}>{kpi.name}</span>
              <span style={{ color: T.inkSoft, fontSize: 11.5 }}>{jdTitle(kpi.jdId)}</span>
              <span style={{ color: T.inkSoft, fontSize: 11.5 }}>{kraName(kpi.kraId)}</span>
              <span style={{ fontWeight: 600 }}>{kpi.weightage}%</span>
              <span style={{ fontWeight: 600 }}>{kpi.target}</span>
              <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 600, background: T.kpiLav }}>{kpi.freq}</span>
              <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 600, background: kpi.updateType === "automatic" ? T.kpiMint : T.kpiCream }}>
                {kpi.updateType === "automatic" ? `Auto · ${kpi.dataSource}` : "Manual"}
              </span>
              <div style={{ display: "flex", gap: 4 }}>
                <button style={aBtn} title="Edit" onClick={() => openEditKpi(kpi)}
                  onMouseOver={(e) => { e.currentTarget.style.background = T.orangeSoft; e.currentTarget.style.color = T.orange; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = T.raised; e.currentTarget.style.color = T.inkMuted; }}
                >{ico.edit}</button>
                <button style={aBtn} title={kpi.status === "active" ? "Deactivate" : "Activate"} onClick={() => toggleKpiStatus(kpi.id)}
                  onMouseOver={(e) => { e.currentTarget.style.background = kpi.status === "active" ? "rgba(228,145,145,.1)" : T.orangeSoft; e.currentTarget.style.color = kpi.status === "active" ? T.danger : T.orange; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = T.raised; e.currentTarget.style.color = T.inkMuted; }}
                >{ico.power}</button>
                <button style={aBtn} title="Assign Person" onClick={() => setAssignKpiModal(kpi.id)}
                  onMouseOver={(e) => { e.currentTarget.style.background = T.orangeSoft; e.currentTarget.style.color = T.orange; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = T.raised; e.currentTarget.style.color = T.inkMuted; }}
                >{ico.userPlus}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
