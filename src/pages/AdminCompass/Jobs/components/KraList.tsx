// @ts-nocheck
import { useMemo } from "react";
import { useJobs } from "../JobsContext";
import { T, COLORS } from "../constants";
import { I, ico } from "../icons";
import { useFetchKras } from "../hooks/useFetchKras";
import { useDepartments } from "../hooks/useDepartments";
import {
  card,
  gBtn,
  aBtn,
  Btn,
  StatusPill,
  FilterSelect,
  FilterSearchSelect,
  AiBar,
  Loader,
} from "./UI";

export default function KraList() {
  const {
    allKpis,
    allJds,
    kraSearch,
    setKraSearch,
    kraDeptFilter,
    setKraDeptFilter,
    kraRoleFilter,
    setKraRoleFilter,
    kraMemberFilter,
    setKraMemberFilter,
    kraViewMode,
    setKraViewMode,
    uniqueDepts,
    uniqueRoles,
    uniqueMembers,
    expandedKra,
    setExpandedKra,
    toggleKraStatus,
    openEditKra,
    setAssignKraModal,
    kraAiDone,
    aiLoading,
    simulateAiKras,
    setShowAddKra,
    jdTitle,
  } = useJobs();

  const {
    data: apiKras = [],
    isLoading: kraApiLoading,
    error: kraApiError,
    refetch: refetchKras,
  } = useFetchKras(kraDeptFilter, kraMemberFilter);
  const { data: departments = [] } = useDepartments();

  const handleToggleStatus = async (kra) => {
    await toggleKraStatus(kra);
    refetchKras();
  };

  const departmentOptions = useMemo(() => {
    const normalized = departments.map((dept) => ({
      value: String(dept.id),
      label:
        dept.name || dept.department_name || dept.title || "Unnamed department",
    }));

    return [...normalized];
  }, [departments]);

  const displayKras = useMemo(() => {
    return apiKras.map((kra) => {
      const remoteKpis = Array.isArray(kra.kpis) ? kra.kpis : [];
      const linked =
        remoteKpis.length > 0
          ? remoteKpis
          : allKpis.filter((p) => p.kraId === kra.id);
      return {
        ...kra,
        id: kra.id,
        title: kra.title || "Untitled KRA",
        desc: kra.desc || kra.description || "",
        weightage: kra.weightage ?? kra.weight ?? 0,
        status: kra.status || "active",
        effectiveFrom: kra.effectiveFrom || kra.effective_from || "",
        effectiveTo: kra.effectiveTo || kra.effective_to || "",
        departmentName:
          kra.departmentName || kra.department_name || kra.department || "",
        roleTitle:
          kra.roleTitle ||
          kra.job_title ||
          jdTitle(kra.jdId ?? kra.job_description_id) ||
          "",
        linkedKpis: linked,
        kpiCount: kra.kpiCount ?? kra.kpis_count ?? linked.length ?? 0,
      };
    });
  }, [apiKras, allKpis, jdTitle]);

  return (
    <div>
      {/* {!kraAiDone && !aiLoading && (
        <AiBar
          text="AI can suggest KRAs based on this role"
          sub="Generated from the job description. You can edit or remove any."
          onClick={simulateAiKras}
          label="Generate KRAs"
        />
      )} */}
      {/* {aiLoading && <Loader text="Analysing role and generating KRAs…" />} */}

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
            flexWrap: "wrap",
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
              width: 240,
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
              placeholder="Search KRAs..."
              value={kraSearch}
              onChange={(e) => setKraSearch(e.target.value)}
            />
          </div>
          <FilterSearchSelect
            value={kraDeptFilter}
            onChange={setKraDeptFilter}
            label="All Departments"
            options={departmentOptions}
            emptyText="No departments found"
          />
          {/* <FilterSelect value={kraRoleFilter} onChange={(e) => setKraRoleFilter(e.target.value)} label="All Roles" options={uniqueRoles} /> */}
          <FilterSearchSelect
            value={kraMemberFilter}
            onChange={setKraMemberFilter}
            label="All Members"
            options={uniqueMembers}
            emptyText="No members found"
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              background: T.orangeSoft,
              fontSize: 12,
              fontWeight: 700,
              color: T.orange,
            }}
          >
            {displayKras.length} KRAs
          </div>
          <div
            style={{
              display: "flex",
              border: `1px solid ${T.borderSoft}`,
              borderRadius: T.rsm,
              overflow: "hidden",
            }}
          >
            <button
              style={{
                ...gBtn,
                width: 36,
                height: 36,
                borderRadius: 0,
                background: kraViewMode === "list" ? T.orangeSoft : T.raised,
                color: kraViewMode === "list" ? T.orange : T.inkMuted,
                border: "none",
              }}
              title="List View"
              onClick={() => setKraViewMode("list")}
            >
              {ico.listView}
            </button>
            <button
              style={{
                ...gBtn,
                width: 36,
                height: 36,
                borderRadius: 0,
                background: kraViewMode === "card" ? T.orangeSoft : T.raised,
                color: kraViewMode === "card" ? T.orange : T.inkMuted,
                border: "none",
                borderLeft: `1px solid ${T.borderSoft}`,
              }}
              title="Card View"
              onClick={() => setKraViewMode("card")}
            >
              {ico.grid}
            </button>
          </div>
          <Btn primary onClick={() => setShowAddKra(true)}>
            {ico.plus} Add KRA
          </Btn>
        </div>
      </div>

      {kraApiLoading && apiKras.length === 0 ? (
        <div style={{ padding: 24, textAlign: "center" }}>
          <Loader text="Loading KRAs from API…" />
        </div>
      ) : (
        <>
          {kraApiError && (
            <div style={{ marginBottom: 12, fontSize: 12, color: T.danger }}>
              {kraApiError?.message || "Failed to load KRAs"}
            </div>
          )}
          {displayKras.length === 0 ? (
            <div
              style={{
                padding: "40px 24px",
                textAlign: "center",
                fontSize: 13,
                color: T.inkMuted,
              }}
            >
              No KRAs found
            </div>
          ) : kraViewMode === "card" ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              {displayKras.map((kra, i) => {
                const linked = kra.linkedKpis || [];
                return (
                  <div
                    key={kra.id}
                    style={{
                      ...card,
                      position: "relative",
                      overflow: "hidden",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.boxShadow = T.shadow)
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.boxShadow = "none")
                    }
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                        background: COLORS[i % 5],
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        marginBottom: 10,
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
                            width: 26,
                            height: 26,
                            borderRadius: "50%",
                            background: COLORS[i % 5],
                            display: "grid",
                            placeItems: "center",
                            fontSize: 11,
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {i + 1}
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 700 }}>
                          {kra.title}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button
                          style={aBtn}
                          title="Edit"
                          onClick={() => openEditKra(kra)}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = T.orangeSoft;
                            e.currentTarget.style.color = T.orange;
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = T.raised;
                            e.currentTarget.style.color = T.inkMuted;
                          }}
                        >
                          {ico.edit}
                        </button>
                        <button
                          style={aBtn}
                          title={
                            kra.status === "active" ? "Deactivate" : "Activate"
                          }
                          onClick={() => handleToggleStatus(kra)}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background =
                              kra.status === "active"
                                ? "rgba(228,145,145,.1)"
                                : T.orangeSoft;
                            e.currentTarget.style.color =
                              kra.status === "active" ? T.danger : T.orange;
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = T.raised;
                            e.currentTarget.style.color = T.inkMuted;
                          }}
                        >
                          {ico.power}
                        </button>
                        <button
                          style={aBtn}
                          title="Assign Person"
                          onClick={() => setAssignKraModal(kra.id)}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = T.orangeSoft;
                            e.currentTarget.style.color = T.orange;
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = T.raised;
                            e.currentTarget.style.color = T.inkMuted;
                          }}
                        >
                          {ico.userPlus}
                        </button>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: T.inkMuted,
                        marginBottom: 8,
                      }}
                    >
                      {kra.roleTitle || kra.departmentName || jdTitle(kra.jdId)}
                      {kra.departmentName ? ` · ${kra.departmentName}` : ""}
                    </div>
                    {kra.desc && (
                      <p
                        style={{
                          fontSize: 12,
                          color: T.inkSoft,
                          lineHeight: 1.5,
                          margin: "0 0 10px",
                        }}
                      >
                        {kra.desc}
                      </p>
                    )}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        flexWrap: "wrap",
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: 999,
                          background: T.surface,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {Number(kra.weightage || 0)}%
                      </span>
                      <span style={{ fontSize: 11, color: T.inkSoft }}>
                        {kra.kpiCount || linked.length} KPIs
                      </span>
                      <StatusPill s={kra.status} />
                    </div>
                    {kra.effectiveFrom && (
                      <div style={{ fontSize: 11, color: T.inkSoft }}>
                        {kra.effectiveFrom}{" "}
                        {kra.effectiveTo ? `→ ${kra.effectiveTo}` : ""}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {displayKras.map((kra, i) => {
                const linked = kra.linkedKpis || [];
                const isOpen = expandedKra === kra.id;
                return (
                  <div
                    key={kra.id}
                    style={{
                      background: T.surface,
                      border: `1px solid ${T.borderSoft}`,
                      borderRadius: T.rlg,
                      overflow: "hidden",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.boxShadow = T.shadow)
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.boxShadow = "none")
                    }
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "4px 1fr 70px 130px 100px 80px 120px 36px",
                        alignItems: "center",
                        gap: 12,
                        padding: "14px 16px 14px 0",
                        cursor: "pointer",
                      }}
                      onClick={() => setExpandedKra(isOpen ? null : kra.id)}
                    >
                      <div
                        style={{
                          width: 4,
                          height: "100%",
                          background: COLORS[i % 5],
                          borderRadius: "16px 0 0 16px",
                          alignSelf: "stretch",
                        }}
                      />
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 700 }}>
                          {kra.title}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: T.inkMuted,
                            marginTop: 2,
                          }}
                        >
                          {kra.roleTitle || jdTitle(kra.jdId)}
                          {kra.departmentName ? ` · ${kra.departmentName}` : ""}
                          {kra.effectiveFrom
                            ? ` · ${kra.effectiveFrom}${kra.effectiveTo ? ` → ${kra.effectiveTo}` : ""}`
                            : ""}
                        </div>
                      </div>
                      <div
                        style={{
                          padding: "4px 10px",
                          borderRadius: 999,
                          background: T.surface,
                          fontSize: 12,
                          fontWeight: 700,
                          color: T.ink,
                          textAlign: "center",
                        }}
                      >
                        {Number(kra.weightage || 0)}%
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <span style={{ display: "flex", color: T.inkMuted }}>
                          {ico.link}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: T.inkSoft,
                          }}
                        >
                          {kra.kpiCount || linked.length} KPIs
                        </span>
                      </div>
                      <StatusPill s={kra.status} />
                      <div
                        style={{ display: "flex", gap: 4 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          style={aBtn}
                          title="Edit"
                          onClick={() => openEditKra(kra)}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = T.orangeSoft;
                            e.currentTarget.style.color = T.orange;
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = T.raised;
                            e.currentTarget.style.color = T.inkMuted;
                          }}
                        >
                          {ico.edit}
                        </button>
                        <button
                          style={aBtn}
                          title={
                            kra.status === "active" ? "Deactivate" : "Activate"
                          }
                          onClick={() => handleToggleStatus(kra)}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background =
                              kra.status === "active"
                                ? "rgba(228,145,145,.1)"
                                : T.orangeSoft;
                            e.currentTarget.style.color =
                              kra.status === "active" ? T.danger : T.orange;
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = T.raised;
                            e.currentTarget.style.color = T.inkMuted;
                          }}
                        >
                          {ico.power}
                        </button>
                        <button
                          style={aBtn}
                          title="Assign Person"
                          onClick={() => setAssignKraModal(kra.id)}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = T.orangeSoft;
                            e.currentTarget.style.color = T.orange;
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = T.raised;
                            e.currentTarget.style.color = T.inkMuted;
                          }}
                        >
                          {ico.userPlus}
                        </button>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform .2s",
                          color: T.inkMuted,
                        }}
                      >
                        {ico.chevDown}
                      </div>
                    </div>
                    {isOpen && (
                      <div
                        style={{
                          padding: "0 20px 16px",
                          borderTop: `1px solid ${T.borderSoft}`,
                        }}
                      >
                        {kra.desc && (
                          <p
                            style={{
                              fontSize: 12.5,
                              color: T.inkSoft,
                              lineHeight: 1.6,
                              margin: "12px 0 14px 4px",
                            }}
                          >
                            {kra.desc}
                          </p>
                        )}
                        {linked.length > 0 &&
                          linked.map((kpi) => (
                            <div
                              key={kpi.id}
                              style={{
                                display: "grid",
                                gridTemplateColumns:
                                  "1fr 70px 80px 90px 90px 100px",
                                gap: 8,
                                padding: "10px 8px",
                                fontSize: 12,
                                borderTop: `1px solid ${T.borderSoft}`,
                                alignItems: "center",
                              }}
                            >
                              <span style={{ fontWeight: 600 }}>
                                {kpi.name || kpi.title}
                              </span>
                              <span style={{ color: T.inkMuted }}>
                                {kpi.weight ?? kpi.weightage ?? 0}%
                              </span>
                              <span style={{ color: T.inkMuted }}>
                                T: {kpi.target_value ?? kpi.target ?? "-"}
                              </span>
                              <span style={{ color: T.inkMuted }}>
                                {kpi.frequency || kpi.freq || "-"}
                              </span>
                              <span style={{ color: T.inkMuted }}>
                                {kpi.unit || "-"}
                              </span>
                              <span
                                style={{
                                  padding: "2px 8px",
                                  borderRadius: 999,
                                  fontSize: 10,
                                  fontWeight: 600,
                                  background:
                                    (kpi.updateType || kpi.measurement_type) ===
                                      "automatic"
                                      ? T.kpiMint
                                      : T.kpiCream,
                                }}
                              >
                                {(kpi.updateType || kpi.measurement_type) ===
                                  "automatic"
                                  ? `Auto · ${kpi.data_source || kpi.dataSource || "API"}`
                                  : "Manual"}
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
        </>
      )}
    </div>
  );
}
