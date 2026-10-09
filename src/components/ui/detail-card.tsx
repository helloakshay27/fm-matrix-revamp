import React from "react";

// Shared shell for read-only detail cards (Business Genie design-system pass):
// white card, 16px radius, heading directly on the surface, neutral icon tile -
// replaces the legacy beige header/body + orange icon treatment used across
// asset/AMC detail pages.
export const DetailCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ icon, title, children, className }) => (
  <div className={`w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-6 ${className || ""}`}>
    <div className="flex items-center gap-3 mb-3">
      <div className="w-9 h-9 rounded-[10px] flex items-center justify-center bg-gray-100 shrink-0">
        {icon}
      </div>
      <h3 className="text-sm font-semibold uppercase text-[#1A1A1A]">{title}</h3>
    </div>
    <div className="text-sm text-gray-800">{children}</div>
  </div>
);
