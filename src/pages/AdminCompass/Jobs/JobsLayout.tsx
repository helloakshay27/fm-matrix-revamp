// @ts-nocheck
import { Outlet } from "react-router-dom";
import { JobsProvider, useJobs } from "./JobsContext";
import { T } from "./constants";
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

function JobsShell() {
  const { actionMenuJd, setActionMenuJd } = useJobs();

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
          <Outlet />
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

export default function JobsLayout() {
  return (
    <JobsProvider>
      <JobsShell />
    </JobsProvider>
  );
}
