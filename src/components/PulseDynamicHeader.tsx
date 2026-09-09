import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLayout } from "../contexts/LayoutContext";
import { RootState, AppDispatch } from "@/store/store";
import { fetchAllowedCompanies } from "@/store/slices/projectSlice";
import { fetchAllowedSites } from "@/store/slices/siteSlice";
import { getUser } from "@/utils/auth";

export const PulseDynamicHeader = () => {
  const { currentSection, setCurrentSection, isSidebarCollapsed } = useLayout();

  const hostname = window.location.hostname;
  const isPulseSiteDomain = hostname === "pulse.lockated.com";
  const isPanchshilUatSiteDomain = hostname === "pulse-uat.panchshil.com" || hostname === "localhost";
  const showPulseUsageAnalytics = isPulseSiteDomain || isPanchshilUatSiteDomain;

  const packages = showPulseUsageAnalytics
    ? ["Pulse Privilege", "Master", "Settings", "Usage Analytics"]
    : ["Pulse Privilege", "Master", "Settings"];

  const dispatch = useDispatch<AppDispatch>();
  const { selectedCompany } = useSelector((state: RootState) => state.project);
  const { selectedSite } = useSelector((state: RootState) => state.site);
  const userId = getUser()?.id;

  // Pulse renders its own header instead of Header.tsx, so nothing else
  // fetches org/company/site context on these routes — without this, every
  // Pulse PostHog event would be missing company_id/company_name/site_id/
  // site_name (see posthogHelpers.ts). Mirrors Header.tsx's equivalent effects.
  useEffect(() => {
    dispatch(fetchAllowedCompanies());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCompany && userId) {
      dispatch(fetchAllowedSites(userId));
    }
  }, [selectedCompany, userId, dispatch]);

  useEffect(() => {
    if (selectedCompany) {
      localStorage.setItem("selectedCompany", selectedCompany.name);
      if (selectedCompany.id) {
        localStorage.setItem("selectedCompanyId", selectedCompany.id.toString());
      }
    }
  }, [selectedCompany]);

  useEffect(() => {
    if (selectedSite) {
      localStorage.setItem("selectedSiteName", selectedSite.name);
      if (selectedSite.id) {
        localStorage.setItem("selectedSiteId", selectedSite.id.toString());
      }
    }
  }, [selectedSite]);

  return (
    <div
      className={`h-12 border-b border-[#D5DbDB] fixed top-16 right-0 ${isSidebarCollapsed ? "left-0 md:left-16" : "left-0 md:left-64"} z-10 transition-all duration-300`}
      style={{ backgroundColor: "#f6f4ee" }}
    >
      <div className="flex items-center h-full px-4 overflow-x-auto">
        <div className="w-full overflow-x-auto md:overflow-visible no-scrollbar">
          {/* Mobile & Tablet: scroll + spacing; Desktop: full width and justify-between */}
          <div className="flex w-max lg:w-full space-x-4 md:space-x-6 lg:space-x-0 md:justify-start lg:justify-between whitespace-nowrap">
            {packages.map((packageName) => (
              <button
                key={packageName}
                onClick={() => setCurrentSection(packageName)}
                className={`pb-3 text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                  currentSection === packageName
                    ? "text-[#C72030] border-b-2 border-[#C72030] font-medium"
                    : "text-[#1a1a1a] opacity-70 hover:opacity-100"
                }`}
              >
                {packageName}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
