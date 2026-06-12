import React from "react";
import { Store } from "lucide-react";

export const VendorDynamicHeader: React.FC = () => {
  return (
    <div
      className="fixed top-16 left-0 right-0 z-30 flex items-center px-4 py-2 gap-3"
      style={{
        background: "linear-gradient(90deg, #1a0a1e 0%, #2d0a3e 60%, #1a0a1e 100%)",
        borderBottom: "1px solid rgba(139, 92, 246, 0.25)",
        height: "48px",
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="flex items-center justify-center w-7 h-7 rounded"
          style={{ backgroundColor: "rgba(168, 85, 247, 0.25)" }}
        >
          <Store className="w-4 h-4" style={{ color: "#d8b4fe" }} />
        </span>
        <span
          className="text-sm font-semibold tracking-wide uppercase"
          style={{ color: "#d8b4fe" }}
        >
          Vendor Portal
        </span>
      </div>
    </div>
  );
};

export default VendorDynamicHeader;
