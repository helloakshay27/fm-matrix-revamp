import React from "react";

export interface RevenueGenerationOverviewCardProps {
  title?: string;
  totalRevenue?: number | string | null;
}

export const RevenueGenerationOverviewCard: React.FC<
  RevenueGenerationOverviewCardProps
> = ({ title = "Revenue Generation Overview", totalRevenue }) => {
  const [companyName, setCompanyName] = React.useState<string>("");

  React.useEffect(() => {
    try {
      const name =
        typeof window !== "undefined"
          ? localStorage.getItem("selectedCompany")
          : null;
      if (name) setCompanyName(name);
    } catch {
      // ignore read errors
    }
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3
          className="text-base font-semibold text-gray-900"
          style={{ fontFamily: "Work Sans, sans-serif" }}
        >
          {title}
        </h3>
      </div>
      <div className="p-5">
        <div
          className="rounded-2xl p-5"
          style={{ backgroundColor: "rgba(183,220,212,0.30)" }}
        >
          <div className="flex items-end justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 mb-1">Total Revenue from</p>
              <p className="text-base font-semibold text-gray-800 truncate">
                {companyName || "—"}
              </p>
            </div>
            <div
              className="text-3xl font-bold flex-shrink-0"
              style={{ color: "#2E7D6B", fontFamily: "Work Sans, sans-serif" }}
            >
              {totalRevenue ?? "-"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueGenerationOverviewCard;
