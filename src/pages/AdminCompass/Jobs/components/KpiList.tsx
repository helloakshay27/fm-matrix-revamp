// @ts-nocheck
import { useMemo } from "react";
import { useJobs } from "../JobsContext";
import { T, COLORS } from "../constants";
import { I, ico } from "../icons";
import { card, gBtn, aBtn, Btn, FilterSelect, FilterSearchSelect, SkeletonCards, SkeletonTable } from "./UI";
import { useDepartments } from "../hooks/useDepartments";

export default function KpiList() {
  // Department list wahi GET /pms/company_setups/:id/departments.json se —
  // KRA tab aur KPI modals ke saath consistent.
  const { data: departments = [] } = useDepartments();
  const departmentOptions = useMemo(
    () =>
      departments.map((dept) => ({
        value: String(dept.id),
        label:
          dept.name || dept.department_name || dept.title || "Unnamed department",
      })),
    [departments]
  );
  const {
    filteredKpis, allKpis, allJds, allKras,
    kpiSearch, setKpiSearch,
    kpiDeptFilter, setKpiDeptFilter,
    kpiRoleFilter, setKpiRoleFilter,
    kpiMemberFilter, setKpiMemberFilter,
    kpiViewMode, setKpiViewMode,
    uniqueKpiRoles, uniqueMembers,
    toggleKpiStatus, openEditKpi,
    setShowAddKpi,
    jdTitle, kraName,
    kpisLoading, kpisError, refreshKpis,
  } = useJobs();
  const listColumns =
    "minmax(220px, 1.6fr) minmax(120px, .8fr) minmax(140px, 1fr) 56px 72px 84px minmax(130px, 170px) 76px";
  const tableMinWidth = 960;
  const cell = { minWidth: 0 };
  const softCell = {
    ...cell,
    color: T.inkSoft,
    fontSize: 11.5,
    lineHeight: 1.35,
    overflow: "hidden",
    textOverflow: "ellipsis",
  };
  const chip = {
    justifySelf: "start",
    display: "inline-flex",
    alignItems: "center",
    maxWidth: "100%",
    minWidth: 0,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    padding: "2px 8px",
    borderRadius: 999,
    fontSize: 10,
    fontWeight: 600,
  };
  const actions = {
    display: "flex",
    gap: 4,
    justifyContent: "flex-end",
    minWidth: 0,
  };

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
          <FilterSearchSelect value={kpiDeptFilter} onChange={setKpiDeptFilter} label="All Departments" options={departmentOptions} emptyText="No departments found" />
          {/* <FilterSelect value={kpiRoleFilter} onChange={(e) => setKpiRoleFilter(e.target.value)} label="All Roles" options={uniqueKpiRoles} /> */}
          <FilterSearchSelect value={kpiMemberFilter} onChange={setKpiMemberFilter} label="All Members" options={uniqueMembers} emptyText="No members found" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ padding: "6px 14px", borderRadius: 999, background: T.orangeSoft, fontSize: 12, fontWeight: 700, color: T.orange }}>
            {kpisLoading ? "Loading..." : `${filteredKpis.length} KPIs`}
          </div>
          <Btn onClick={refreshKpis}>{ico.refresh || "Refresh"}</Btn>
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

      {kpisError && (
        <div style={{ ...card, marginBottom: 12, color: T.error, fontSize: 12.5 }}>
          Could not load KPIs: {kpisError}
        </div>
      )}

      {kpisLoading && filteredKpis.length === 0 && (kpiViewMode === "card" ? (
        <SkeletonCards count={6} minWidth={240} height={128} />
      ) : (
        <SkeletonTable rows={8} columns={listColumns} />
      ))}

      {!kpisLoading && filteredKpis.length === 0 && (
        <div style={{ ...card, textAlign: "center", color: T.inkMuted, fontSize: 13 }}>
          No KPIs found.
        </div>
      )}

      {filteredKpis.length > 0 && (kpiViewMode === "card" ? (
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
        <div style={{ background: T.surface, border: `1px solid ${T.borderSoft}`, borderRadius: T.rlg, overflowX: "auto", overflowY: "hidden" }}>
          <div style={{ minWidth: tableMinWidth }}>
          <div style={{ display: "grid", gridTemplateColumns: listColumns, gap: 10, padding: "12px 16px", fontSize: 11, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase", letterSpacing: ".05em", borderBottom: `1px solid ${T.borderSoft}` }}>
            <span style={cell}>KPI Name</span>
            <span style={cell}>Job Desc</span>
            <span style={cell}>Linked KRA</span>
            <span style={cell}>Wt%</span>
            <span style={cell}>Target</span>
            <span style={cell}>Freq</span>
            <span style={cell}>Update</span>
            <span style={{ ...cell, textAlign: "right" }}>Actions</span>
          </div>
          {filteredKpis.map((kpi, i) => (
            <div
              key={kpi.id}
              style={{ display: "grid", gridTemplateColumns: listColumns, gap: 10, padding: "12px 16px", fontSize: 12.5, borderBottom: i < filteredKpis.length - 1 ? `1px solid ${T.borderSoft}` : "none", alignItems: "center" }}
              onMouseOver={(e) => (e.currentTarget.style.background = T.warm)}
              onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ ...cell, fontWeight: 700, lineHeight: 1.35 }}>{kpi.name}</span>
              <span style={softCell} title={jdTitle(kpi.jdId)}>{jdTitle(kpi.jdId)}</span>
              <span style={softCell} title={kraName(kpi.kraId)}>{kraName(kpi.kraId)}</span>
              <span style={{ ...cell, fontWeight: 700 }}>{kpi.weightage}%</span>
              <span style={{ ...cell, fontWeight: 700 }}>{kpi.target}</span>
              {/* Pills apne text ko hug karein — grid cell ki poori width par
                  stretch na hon. */}
              <span style={{ ...chip, background: T.kpiLav }}>{kpi.freq}</span>
              <span style={{ ...chip, background: kpi.updateType === "automatic" ? T.kpiMint : T.kpiCream }} title={kpi.updateType === "automatic" ? `Auto · ${kpi.dataSource || "API"}` : "Manual"}>
                {kpi.updateType === "automatic" ? `Auto · ${kpi.dataSource || "API"}` : "Manual"}
              </span>
              <div style={actions}>
                <button style={aBtn} title="Edit" onClick={() => openEditKpi(kpi)}
                  onMouseOver={(e) => { e.currentTarget.style.background = T.orangeSoft; e.currentTarget.style.color = T.orange; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = T.raised; e.currentTarget.style.color = T.inkMuted; }}
                >{ico.edit}</button>
                <button style={aBtn} title={kpi.status === "active" ? "Deactivate" : "Activate"} onClick={() => toggleKpiStatus(kpi.id)}
                  onMouseOver={(e) => { e.currentTarget.style.background = kpi.status === "active" ? "rgba(228,145,145,.1)" : T.orangeSoft; e.currentTarget.style.color = kpi.status === "active" ? T.danger : T.orange; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = T.raised; e.currentTarget.style.color = T.inkMuted; }}
                >{ico.power}</button>
              </div>
            </div>
          ))}
          </div>
        </div>
      ))}
    </div>
  );
}
