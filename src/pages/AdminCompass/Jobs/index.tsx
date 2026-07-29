// @ts-nocheck
import { JobsProvider, useJobs } from "./JobsContext";
import { T } from "./constants";
import { I, ico } from "./icons";
import { Btn, card, pill } from "./components/UI";
import Stepper from "./components/Stepper";
import { StepDetails, StepDesc, StepKra, StepKpi, StepReview } from "./components/JobFormSteps";
import OrgSection from "./components/OrgSection";
import MembersSection from "./components/MembersSection";
import JdList from "./components/JdList";
import JdDetail from "./components/JdDetail";
import EditJdScreen from "./components/EditJdScreen";
import KraList from "./components/KraList";
import KpiList from "./components/KpiList";
import ActivityLogs from "./components/ActivityLogs";
import SettingsUnits from "./components/SettingsUnits";
import DeptModal from "./modals/DeptModal";
import AssignToJdModal from "./modals/AssignToJdModal";
import KraEntryModal from "./modals/KraEntryModal";
import KpiEntryModal from "./modals/KpiEntryModal";
import InviteModal from "./modals/InviteModal";
import EditMemberModal from "./modals/EditMemberModal";
import EditKraModal from "./modals/EditKraModal";
import EditKpiModal from "./modals/EditKpiModal";
import AssignPersonModal from "./modals/AssignPersonModal";
import AssignEntityToMemberModal from "./modals/AssignEntityToMemberModal";

function AdminCompassInner() {
  const {
    activeNav, setActiveNav, jobTab, setJobTab, view, setView,
    viewingJd, setViewingJd, editingJd, step, setStep, allJds,
    jdSearch, setJdSearch, kraSearch, setKraSearch, kpiSearch, setKpiSearch,
    kraDeptFilter, setKraDeptFilter, kraRoleFilter, setKraRoleFilter,
    kraMemberFilter, setKraMemberFilter, kpiDeptFilter, setKpiDeptFilter,
    kpiRoleFilter, setKpiRoleFilter, kpiMemberFilter, setKpiMemberFilter,
    kraViewMode, setKraViewMode, kpiViewMode, setKpiViewMode,
    actionMenuJd, setActionMenuJd, expandedKra, setExpandedKra,
    assignModal, setAssignModal, assignName, setAssignName,
    showAddKra, setShowAddKra, showAddKpi, setShowAddKpi,
    newKra, setNewKra, newKpi, setNewKpi,
    editingKraId, setEditingKraId, editingKpiId, setEditingKpiId,
    assignKraModal, setAssignKraModal, assignKraName, setAssignKraName,
    assignKraMemberModal, setAssignKraMemberModal, assignKraMemberKraId, setAssignKraMemberKraId,
    assignKpiMemberModal, setAssignKpiMemberModal, assignKpiMemberKraId, setAssignKpiMemberKraId,
    kraIdFilter, setKraIdFilter, kpiIdFilter, setKpiIdFilter,
    showDeptModal, setShowDeptModal, editingDept, setEditingDept,
    deptForm, setDeptForm, showInviteModal, setShowInviteModal,
    inviteMode, setInviteMode, inviteRows, setInviteRows,
    editingMember, setEditingMember, editMemberForm, setEditMemberForm,
    editKraForm, setEditKraForm, editKpiForm, setEditKpiForm,
    jdFilter, setJdFilter, kraFilter, setKraFilter, kpiFilter, setKpiFilter,
    selectedKraFilter, setSelectedKraFilter,
    resetCreate, canNext, saveJd, saveNewKra, saveNewKpi,
    saveEditKra, saveEditKpi, saveEditMember, saveDept,
    assignToKra, assignToKpi, assignKraToMember, assignKpiToMember,
    sendInvites, toggleKraStatus, toggleKpiStatus,
    kraAiDone, kpiAiDone,
    assignUser,
    filteredJds, filteredKras, filteredKpis,
    uniqueDepts, uniqueRoles, uniqueMembers,
  } = useJobs();

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        fontFamily: T.font,
        background: T.page,
        color: T.ink,
        fontSize: 14,
        WebkitFontSmoothing: "antialiased",
      }}
      onClick={() => {
        actionMenuJd && setActionMenuJd(null);
      }}
    >
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          background: T.page,
          minWidth: 0,
        }}
      >
        <div style={{ flex: 1, padding: "28px 32px 48px" }}>
          {activeNav === "organisation" && <OrgSection />}

          {activeNav === "members" && <MembersSection />}

          {activeNav === "jobs" && (
            <>
              {!viewingJd && !editingJd && (
                <div style={{ marginBottom: 24 }}>
                  {view === "create" && (
                    <button
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        border: "none", background: "transparent", cursor: "pointer",
                        color: T.inkMuted, fontSize: 12.5, fontWeight: 600,
                        fontFamily: T.font, marginBottom: 8, padding: 0,
                      }}
                      onClick={resetCreate}
                    >
                      {ico.arrowLeft} Back to all JDs
                    </button>
                  )}
                  <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
                    {view === "create"
                      ? "Create Job Description"
                      : jobTab === "descriptions"
                        ? "Jobs"
                        : jobTab === "kra"
                          ? "Key Result Areas"
                          : jobTab === "kpi"
                            ? "Key Performance Indicators"
                            : jobTab === "logs"
                              ? "Activity Logs"
                              : "Settings"}
                  </h1>
                  <p style={{ fontSize: 13.5, color: T.inkSoft, marginTop: 4, fontWeight: 400, lineHeight: 1.6 }}>
                    {view === "create"
                      ? "Define the role, describe the position, and set measurable outcomes."
                      : jobTab === "descriptions"
                        ? "Manage job descriptions, KRAs, and KPIs for every role."
                        : jobTab === "kra"
                          ? "All KRAs across your organisation. Expand any row to see linked KPIs."
                          : jobTab === "kpi"
                            ? "A consolidated view of every KPI across all roles."
                            : jobTab === "logs"
                              ? "Chronological audit trail of all KRA and KPI activities."
                              : "Configure organisation-wide KPI settings and units."}
                  </p>
                </div>
              )}

              {view === "list" && !viewingJd && !editingJd && (
                <div
                  style={{
                    display: "flex", alignItems: "center", gap: 4,
                    padding: 4, background: T.raised, borderRadius: T.rmd,
                    border: `1px solid ${T.borderSoft}`, width: "fit-content", marginBottom: 28,
                  }}
                >
                  {[
                    { key: "descriptions", label: "Job Descriptions" },
                    { key: "kra", label: "KRAs" },
                    { key: "kpi", label: "KPIs" },
                    { key: "logs", label: "Logs" },
                    { key: "settings", label: "Settings" },
                  ].map((t) => (
                    <button
                      key={t.key}
                      style={pill(jobTab === t.key)}
                      onClick={() => {
                        setJobTab(t.key);
                        setViewingJd(null);
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              )}

              {view === "list" && jobTab === "descriptions" &&
                (editingJd ? <EditJdScreen /> : viewingJd ? <JdDetail /> : <JdList />)}
              {view === "list" && jobTab === "kra" && <KraList />}
              {view === "list" && jobTab === "kpi" && <KpiList />}

              {view === "list" && jobTab === "logs" && <ActivityLogs />}
              {view === "list" && jobTab === "settings" && <SettingsUnits />}

              {view === "create" && (
                <>
                  <Stepper />
                  {step === 0 && <StepDetails />}
                  {step === 1 && <StepDesc />}
                  {step === 2 && <StepKra />}
                  {step === 3 && <StepKpi />}
                  {step === 4 && <StepReview />}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24, paddingTop: 20, borderTop: `1px solid ${T.borderSoft}` }}>
                    <div>
                      {step > 0 && <Btn onClick={() => setStep((s) => s - 1)}>{ico.arrowLeft} Previous</Btn>}
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <Btn onClick={resetCreate}>Cancel</Btn>
                      {step < 4 ? (
                        <Btn primary disabled={!canNext()} onClick={() => setStep((s) => s + 1)}>
                          Continue <I d="M9 18l6-6-6-6" size={14} stroke="#fff" />
                        </Btn>
                      ) : (
                        <Btn primary onClick={saveJd}>
                          <I d="M20 6L9 17l-5-5" size={14} stroke="#fff" /> Save
                        </Btn>
                      )}
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {!["organisation", "members", "jobs"].includes(activeNav) && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
                  {activeNav.charAt(0).toUpperCase() + activeNav.slice(1)}
                </h1>
                <p style={{ fontSize: 13.5, color: T.inkSoft, marginTop: 4 }}>This section is coming soon.</p>
              </div>
              <div style={{ ...card, display: "flex", flexDirection: "column", alignItems: "center", padding: "64px 20px", textAlign: "center" }}>
                <span style={{ fontSize: 40, marginBottom: 12 }}>
                  {activeNav === "dashboard" ? "📊" : activeNav === "plan" ? "📋" : activeNav === "goals" ? "🎯" : activeNav === "meetings" ? "👥" : activeNav === "members" ? "🧑‍🤝‍🧑" : activeNav === "sops" ? "📄" : "🌐"}
                </span>
                <p style={{ fontSize: 14, fontWeight: 600, color: T.inkSoft, margin: "0 0 4px" }}>
                  {activeNav.charAt(0).toUpperCase() + activeNav.slice(1)} module
                </p>
                <p style={{ fontSize: 12.5, color: T.inkMuted, margin: 0 }}>We're building this section. It will be available soon.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <DeptModal />
      <AssignToJdModal />
      <KraEntryModal />
      <KpiEntryModal />
      <InviteModal />
      <EditMemberModal />
      <EditKraModal />
      <EditKpiModal />
      <AssignPersonModal />
      <AssignEntityToMemberModal />
    </div>
  );
}

export default function AdminCompassJobs() {
  return (
    <JobsProvider>
      <AdminCompassInner />
    </JobsProvider>
  );
}
