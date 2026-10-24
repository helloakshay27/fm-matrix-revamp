import React from "react";

// Section card in the Ticket details style (TicketDetailsPage section cards): beige header band
// with a round icon tile and uppercase title, light body underneath.
export const DetailCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
  /** Optional right-aligned header content, e.g. a status badge or close button */
  headerActions?: React.ReactNode;
}> = ({ icon, title, children, className, headerActions }) => (
  <div className={`w-full bg-white rounded-lg shadow-sm border ${className || ""}`}>
    <div className="flex items-center justify-between gap-3 bg-[#F6F4EE] py-3 px-4 border border-[#D9D9D9]">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E5E0D3] shrink-0">{icon}</div>
        <h3 className="text-lg font-semibold uppercase text-black truncate">{title}</h3>
      </div>
      {headerActions && <div className="flex items-center gap-2 shrink-0">{headerActions}</div>}
    </div>
    <div className="bg-[#FBFBFA] border border-t-0 border-[#D9D9D9] px-5 py-4 text-sm text-gray-800">{children}</div>
  </div>
);
