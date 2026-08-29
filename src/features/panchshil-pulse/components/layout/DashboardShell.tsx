import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { PulseDashboardProvider, usePulseDashboard } from "../../contexts/PulseDashboardContext";
import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";
import { FilterBar } from "../common/FilterBar";
import "../../styles/pulse-dashboard.css";

const PAGE_TITLES: Record<string, string> = {
  "/pulse": "Traffic & Session",
  "/pulse/": "Traffic & Session",
  "/pulse/traffic-session": "Traffic & Session",
  "/pulse/adoption-engagement": "Adoption & Engagement",
  "/pulse/workflow-usage": "Workflow Usage"
};

const DashboardContent: React.FC = () => {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || "Traffic & Session";
  const { vm } = usePulseDashboard();

  return (
    <div className="pulse-app-scope">
      <Topbar />
      <div className="shell">
        <Sidebar />
        <main className="main">
          <div className="page-head">
            <h2 id="pageTitle">{title}</h2>
            <p className="page-sub">
              <span id="custName">Panchshil Pulse Application</span> &middot;{" "}
              <span id="scopeLabel">{vm.scopeLabel}</span>
            </p>
          </div>
          <FilterBar />
          <Outlet />
          <Footer />
        </main>
      </div>
    </div>
  );
};

export const DashboardShell: React.FC = () => {
  return (
    <PulseDashboardProvider>
      <DashboardContent />
    </PulseDashboardProvider>
  );
};
