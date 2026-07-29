// @ts-nocheck
import { useJobs } from '../JobsContext';
import { T, COLORS } from '../constants';
import { I, ico } from '../icons';
import { card, Btn, StatusPill, FilterSelect, aBtn } from './UI';

export default function MembersSection() {
  const {
    allMembers, setAllMembers,
    memberSearch, setMemberSearch,
    memberDeptFilter, setMemberDeptFilter,
    memberStatusFilter, setMemberStatusFilter,
    memberGroupView, setMemberGroupView,
    viewingMember, setViewingMember,
    actionMenuMember, setActionMenuMember,
    showInviteModal, setShowInviteModal,
    inviteMode, setInviteMode,
    inviteRows, setInviteRows,
    editingMember, setEditingMember,
    editMemberForm, setEditMemberForm,
    assignKraMemberModal, setAssignKraMemberModal,
    assignKraMemberKraId, setAssignKraMemberKraId,
    assignKpiMemberModal, setAssignKpiMemberModal,
    assignKpiMemberKpiId, setAssignKpiMemberKpiId,
    filteredMembers, groupedMembers, ungrouped, memberDepts,
    initials,
    openInvite, updateInviteRow, addInviteRow, removeInviteRow, sendInvites,
    openEditMember, saveEditMember, toggleMemberStatus, deleteMember,
    allKras, allKpis, allJds,
  } = useJobs();

  const MemberCard = ({ m }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 18px",
        background: T.surface,
        border: `1px solid ${T.borderSoft}`,
        borderRadius: T.rmd,
        transition: "box-shadow .16s",
      }}
      onMouseOver={(e) => (e.currentTarget.style.boxShadow = T.shadow)}
      onMouseOut={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background:
              m.status === "active"
                ? COLORS[memberDepts.indexOf(m.department) % 5] || T.kpiBlue
                : T.borderWarm,
            display: "grid",
            placeItems: "center",
            fontSize: 13,
            fontWeight: 700,
            color: T.ink,
            flexShrink: 0,
            opacity: m.status === "active" ? 1 : 0.5,
          }}
        >
          {initials(m.name)}
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontSize: 13.5,
                fontWeight: 700,
                color: m.status === "active" ? T.ink : T.inkMuted,
              }}
            >
              {m.name}
            </span>
            {m.isHOD && (
              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: T.orangeSoft,
                  color: T.orange,
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                HOD
              </span>
            )}
            <StatusPill s={m.status} />
          </div>
          <div style={{ fontSize: 12, color: T.inkMuted, marginTop: 2 }}>
            {m.email}
            {m.department ? ` · ${m.department}` : ""}
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          position: "relative",
        }}
      >
        <button
          style={aBtn}
          title="Actions"
          onClick={(e) => {
            e.stopPropagation();
            setActionMenuMember(actionMenuMember === m.id ? null : m.id);
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
        {actionMenuMember === m.id && (
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
              minWidth: 170,
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
                setActionMenuMember(null);
                openEditMember(m);
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
                setActionMenuMember(null);
                setAssignKraMemberModal(m.id);
              }}
            >
              <span style={{ display: "flex", color: T.inkMuted }}>
                {ico.goals}
              </span>
              Assign KRA
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
                setActionMenuMember(null);
                setAssignKpiMemberModal(m.id);
              }}
            >
              <span style={{ display: "flex", color: T.inkMuted }}>
                {ico.bar}
              </span>
              Assign KPI
            </button>
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
                setActionMenuMember(null);
                toggleMemberStatus(m.id);
              }}
            >
              <span style={{ display: "flex", color: T.inkMuted }}>
                {ico.power}
              </span>
              {m.status === "active" ? "Deactivate" : "Activate"}
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
                fontWeight: 600,
                color: T.danger,
                display: "flex",
                alignItems: "center",
                gap: 10,
                transition: "background .12s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "rgba(228,145,145,.06)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
              onClick={() => {
                deleteMember(m.id);
              }}
            >
              <span style={{ display: "flex" }}>{ico.trash}</span>Delete
            </button>
          </div>
        )}
        <button
          style={aBtn}
          title="View Profile"
          onClick={() => setViewingMember(m.id)}
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
  );

  const MemberDetail = () => {
    const m = allMembers.find((mb) => mb.id === viewingMember);
    if (!m) return null;
    const memberKras = allKras.filter((k) => {
      const jdsWithMember = allJds
        .filter((j) => j.assigned.includes(m.name))
        .map((j) => j.id);
      return jdsWithMember.includes(k.jdId);
    });
    const memberKpis = allKpis.filter((p) =>
      memberKras.some((k) => k.id === p.kraId)
    );
    const memberJds = allJds.filter((j) => j.assigned.includes(m.name));

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
          onClick={() => setViewingMember(null)}
        >
          {ico.arrowLeft} Back to Members
        </button>

        <div style={{ ...card, marginBottom: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background:
                    m.status === "active"
                      ? COLORS[memberDepts.indexOf(m.department) % 5] ||
                        T.kpiBlue
                      : T.borderWarm,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 20,
                  fontWeight: 800,
                  color: T.ink,
                  flexShrink: 0,
                }}
              >
                {initials(m.name)}
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 4,
                  }}
                >
                  <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
                    {m.name}
                  </h2>
                  {m.isHOD && (
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: 999,
                        background: T.orangeSoft,
                        color: T.orange,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      HOD
                    </span>
                  )}
                  <StatusPill s={m.status} />
                </div>
                <p style={{ fontSize: 13, color: T.inkSoft, margin: 0 }}>
                  {m.email}
                </p>
                <p
                  style={{
                    fontSize: 12.5,
                    color: T.inkMuted,
                    margin: "4px 0 0",
                  }}
                >
                  {m.department || "No department assigned"}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Btn onClick={() => openEditMember(m)}>{ico.edit} Edit</Btn>
              <Btn onClick={() => setAssignKraMemberModal(m.id)}>
                {ico.goals} Assign KRA
              </Btn>
              <Btn onClick={() => setAssignKpiMemberModal(m.id)}>
                {ico.bar} Assign KPI
              </Btn>
              <Btn onClick={() => toggleMemberStatus(m.id)}>
                {ico.power} {m.status === "active" ? "Deactivate" : "Activate"}
              </Btn>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
            marginBottom: 16,
          }}
        >
          {[
            { label: "Assigned JDs", value: memberJds.length, bg: T.kpiBlue },
            { label: "Linked KRAs", value: memberKras.length, bg: T.kpiMint },
            { label: "Linked KPIs", value: memberKpis.length, bg: T.kpiLav },
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
            Assigned Job Descriptions
          </div>
          {memberJds.length === 0 ? (
            <p style={{ fontSize: 13, color: T.inkMuted, margin: 0 }}>
              No job descriptions assigned to this member yet.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {memberJds.map((jd) => (
                <div
                  key={jd.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    borderRadius: T.rmd,
                    background: T.raised,
                    border: `1px solid ${T.borderSoft}`,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700 }}>
                      {jd.title}
                    </div>
                    <div
                      style={{
                        fontSize: 11.5,
                        color: T.inkMuted,
                        marginTop: 2,
                      }}
                    >
                      {jd.dept} · {jd.level} · {jd.type}
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <StatusPill s={jd.status} />
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: 999,
                        background: T.surface,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {allKras.filter((k) => k.jdId === jd.id).length} KRAs
                    </span>
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
              {memberKras.length} KRAs · {memberKpis.length} KPIs
            </span>
          </div>
          {memberKras.length === 0 ? (
            <p style={{ fontSize: 13, color: T.inkMuted, margin: 0 }}>
              No KRAs linked to this member yet.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {memberKras.map((kra, i) => {
                const kraKpis = memberKpis.filter((p) => p.kraId === kra.id);
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
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: 999,
                          background: T.surface,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {kra.weightage || 0}%
                      </span>
                    </div>
                    {kra.desc && (
                      <p
                        style={{
                          fontSize: 12.5,
                          color: T.inkSoft,
                          lineHeight: 1.6,
                          margin: "4px 0 10px 30px",
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
                        {kraKpis.map((kpi) => (
                          <div
                            key={kpi.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "8px 0",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <span
                                style={{ display: "flex", color: T.orange }}
                              >
                                {ico.bar}
                              </span>
                              <span
                                style={{ fontSize: 12.5, fontWeight: 600 }}
                              >
                                {kpi.name}
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                fontSize: 11.5,
                              }}
                            >
                              <span style={{ fontWeight: 700 }}>
                                {kpi.weightage}%
                              </span>
                              <span style={{ color: T.inkMuted }}>
                                Target: {kpi.target}
                              </span>
                              <span
                                style={{
                                  padding: "2px 8px",
                                  borderRadius: 999,
                                  fontSize: 10,
                                  fontWeight: 600,
                                  background: T.kpiCream,
                                }}
                              >
                                {kpi.freq}
                              </span>
                            </div>
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
      </div>
    );
  };

  if (viewingMember) return <MemberDetail />;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{ fontSize: 22, fontWeight: 700, margin: 0, lineHeight: 1.2 }}
        >
          Members
        </h1>
        <p
          style={{
            fontSize: 13.5,
            color: T.inkSoft,
            marginTop: 4,
            lineHeight: 1.6,
          }}
        >
          Manage your team — invite members, assign departments, and track
          active status.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          gap: 12,
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
              placeholder="Search members..."
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
            />
          </div>
          <FilterSelect
            value={memberDeptFilter}
            onChange={(e) => setMemberDeptFilter(e.target.value)}
            label="All Departments"
            options={memberDepts}
          />
          <FilterSelect
            value={memberStatusFilter}
            onChange={(e) => setMemberStatusFilter(e.target.value)}
            label="All Status"
            options={["active", "inactive"]}
          />
          <button
            onClick={() => setMemberGroupView((v) => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "0 14px",
              background: memberGroupView ? T.orangeSoft : T.raised,
              border: `1px solid ${memberGroupView ? T.orange : T.borderSoft}`,
              borderRadius: T.rmd,
              minHeight: 40,
              cursor: "pointer",
              color: memberGroupView ? T.orange : T.inkSoft,
              fontSize: 12.5,
              fontWeight: 600,
              fontFamily: T.font,
            }}
          >
            {ico.layers} Group by Dept
          </button>
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
            {filteredMembers.length} members
          </div>
          <Btn onClick={() => openInvite("bulk")}>Bulk Invite</Btn>
          <Btn primary onClick={() => openInvite("single")}>
            {ico.plus} Invite Member
          </Btn>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {[
          { l: "Total Members", v: allMembers.length, bg: T.kpiBlue },
          {
            l: "Active",
            v: allMembers.filter((m) => m.status === "active").length,
            bg: T.kpiMint,
          },
          {
            l: "Inactive",
            v: allMembers.filter((m) => m.status === "inactive").length,
            bg: T.kpiCream,
          },
          {
            l: "HODs",
            v: allMembers.filter((m) => m.isHOD).length,
            bg: T.kpiLav,
          },
        ].map((c, i) => (
          <div
            key={i}
            style={{
              padding: "16px 20px",
              borderRadius: T.rlg,
              background: c.bg,
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
              {c.l}
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: T.ink }}>
              {c.v}
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 ? (
        <div
          style={{
            ...card,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "60px 20px",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: 36, marginBottom: 12 }}>👥</span>
          <p
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: T.inkSoft,
              margin: "0 0 4px",
            }}
          >
            No members found
          </p>
          <p style={{ fontSize: 12.5, color: T.inkMuted, margin: "0 0 16px" }}>
            Adjust your filters or invite new team members.
          </p>
        </div>
      ) : memberGroupView ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {Object.entries(groupedMembers).map(([dept, members]) => (
            <div key={dept}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: COLORS[memberDepts.indexOf(dept) % 5],
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>
                  {dept}
                </span>
                <span
                  style={{ fontSize: 12, color: T.inkMuted, fontWeight: 500 }}
                >
                  {members.length} member{members.length !== 1 ? "s" : ""}
                </span>
                <div style={{ flex: 1, height: 1, background: T.borderSoft }} />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  paddingLeft: 18,
                }}
              >
                {members.map((m) => (
                  <MemberCard key={m.id} m={m} />
                ))}
              </div>
            </div>
          ))}
          {ungrouped.length > 0 && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: T.inkMuted,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>
                  Unassigned
                </span>
                <span style={{ fontSize: 12, color: T.inkMuted }}>
                  {ungrouped.length}
                </span>
                <div style={{ flex: 1, height: 1, background: T.borderSoft }} />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  paddingLeft: 18,
                }}
              >
                {ungrouped.map((m) => (
                  <MemberCard key={m.id} m={m} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filteredMembers.map((m) => (
            <MemberCard key={m.id} m={m} />
          ))}
        </div>
      )}
    </div>
  );
}
