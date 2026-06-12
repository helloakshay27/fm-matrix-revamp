import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLayout } from "../contexts/LayoutContext";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  PackageCheck,
  Briefcase,
  FileText,
} from "lucide-react";

interface VendorNavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const NAV_ITEMS: VendorNavItem[] = [
  { label: "My PO", href: "/vendor/po", icon: ShoppingCart },
  { label: "My GRN", href: "/vendor/grn", icon: PackageCheck },
  { label: "My WO", href: "/vendor/wo", icon: Briefcase },
  { label: "My WO Invoice", href: "/vendor/invoice", icon: FileText },
];

export const VendorSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSidebarCollapsed, setIsSidebarCollapsed } = useLayout();

  const isActive = (href: string) => {
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
  };

  return (
    <div
      className={`${
        isSidebarCollapsed ? "w-16" : "w-64"
      } fixed left-0 top-0 overflow-y-auto transition-all duration-300 z-40`}
      style={{
        top: "4rem",
        height: "91vh",
        background: "linear-gradient(180deg, #1a0a1e 0%, #2d0a3e 100%)",
        borderRight: "1px solid rgba(139, 92, 246, 0.2)",
      }}
    >
      <div className={`${isSidebarCollapsed ? "px-2 py-2" : "p-3"}`}>
        {/* Collapse / Expand Button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute right-2 top-2 p-1 rounded-md z-10 transition-colors"
          style={{
            color: "rgba(196, 160, 220, 0.8)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor =
              "rgba(139, 92, 246, 0.2)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          {isSidebarCollapsed ? (
            <div
              className="flex justify-center items-center w-8 h-8 mx-auto rounded"
              style={{
                background: "rgba(139, 92, 246, 0.15)",
                border: "1px solid rgba(139, 92, 246, 0.3)",
              }}
            >
              <ChevronRight className="w-4 h-4" style={{ color: "#c4a0dc" }} />
            </div>
          ) : (
            <ChevronLeft className="w-4 h-4" style={{ color: "#c4a0dc" }} />
          )}
        </button>

        {/* Spacer below collapse button */}
        <div className="w-full h-8 mb-2" />

        {/* Section Title */}
        {!isSidebarCollapsed && (
          <div className="mb-5 px-2">
            <h3
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "rgba(196, 160, 220, 0.6)" }}
            >
              Vendor Portal
            </h3>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            if (isSidebarCollapsed) {
              return (
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  title={item.label}
                  className="flex items-center justify-center w-full p-2 rounded-lg relative transition-all duration-200"
                  style={{
                    backgroundColor: active
                      ? "rgba(139, 92, 246, 0.25)"
                      : "transparent",
                    color: active ? "#d8b4fe" : "rgba(196, 160, 220, 0.7)",
                  }}
                  onMouseEnter={(e) => {
                    if (!active)
                      e.currentTarget.style.backgroundColor =
                        "rgba(139, 92, 246, 0.12)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active)
                      e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {active && (
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full"
                      style={{ backgroundColor: "#a855f7" }}
                    />
                  )}
                  <Icon className="w-5 h-5" />
                </button>
              );
            }

            return (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium relative transition-all duration-200"
                style={{
                  backgroundColor: active
                    ? "rgba(139, 92, 246, 0.25)"
                    : "transparent",
                  color: active ? "#d8b4fe" : "rgba(196, 160, 220, 0.8)",
                  border: active
                    ? "1px solid rgba(139, 92, 246, 0.35)"
                    : "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor =
                      "rgba(139, 92, 246, 0.12)";
                    e.currentTarget.style.color = "#d8b4fe";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "rgba(196, 160, 220, 0.8)";
                  }
                }}
              >
                {active && (
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full"
                    style={{ backgroundColor: "#a855f7" }}
                  />
                )}

                {/* Icon container */}
                <span
                  className="flex items-center justify-center w-7 h-7 rounded"
                  style={{
                    backgroundColor: active
                      ? "rgba(168, 85, 247, 0.3)"
                      : "rgba(139, 92, 246, 0.1)",
                  }}
                >
                  <Icon className="w-4 h-4" />
                </span>

                <span>{item.label}</span>

                {active && (
                  <span
                    className="ml-auto w-2 h-2 rounded-full"
                    style={{ backgroundColor: "#a855f7" }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default VendorSidebar;
