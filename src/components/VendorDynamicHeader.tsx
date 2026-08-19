import React from "react";
import { Store } from "lucide-react";

export const VendorDynamicHeader: React.FC = () => {
  return (
    <div
      className="fixed top-16 right-0 left-0 md:left-64 z-20 transition-all duration-300 flex items-center px-4"
      style={{
        backgroundColor: "#f6f4ee",
        borderBottom: "1px solid #D5DbDB",
        height: "48px",
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="flex items-center justify-center w-7 h-7 rounded"
          style={{ backgroundColor: "rgba(218, 119, 86, 0.12)" }}
        >
          <Store className="w-4 h-4" style={{ color: "#DA7756" }} />
        </span>
        <span
          className="text-sm font-semibold tracking-wide uppercase"
          style={{ color: "#1a1a1a" }}
        >
          Vendor Portal
        </span>
      </div>
    </div>
  );
};

export default VendorDynamicHeader;
