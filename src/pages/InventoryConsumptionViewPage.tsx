import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { RootState, AppDispatch } from "@/store/store";
import { fetchInventoryConsumptionDetails } from "@/store/slices/inventoryConsumptionDetailsSlice";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { CircularProgress } from "@mui/material";
import { toast } from "sonner";
import { useDynamicPermissions } from "@/hooks/useDynamicPermissions";

const ledgerCellClass = "block w-full text-[12.5px] text-[var(--color-ink-68)]";
const ledgerNumericCellClass = `${ledgerCellClass} text-right tabular-nums`;
const ledgerIdentifierCellClass =
  "block w-full text-[12.5px] font-medium text-[var(--color-text)]";

const InventoryConsumptionViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { shouldShow } = useDynamicPermissions();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const searchParams = new URLSearchParams(location.search);
  const startDate = searchParams.get("start_date") || "";
  const endDate = searchParams.get("end_date") || "";

  const { inventory, consumptions, loading, error } = useSelector(
    (state: RootState) => state.inventoryConsumptionDetails
  );

  const [dateRange, setDateRange] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      if (!id) {
        toast.error("Invalid inventory id");
        return;
      }
      setIsExporting(true);
      // Use query range if provided, else fallback to current month-to-date
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      const fallbackStart = `${yyyy}-${mm}-01`;
      const fallbackEnd = `${yyyy}-${mm}-${dd}`;
      const effectiveStart = startDate || fallbackStart;
      const effectiveEnd = endDate || fallbackEnd;

      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      if (!baseUrl || !token) {
        toast.error("Missing base URL or auth token");
        setIsExporting(false);
        return;
      }

      const exportUrl = `https://${baseUrl}/pms/inventories/inventory_assets_consumption_details.xlsx?resource_id=${encodeURIComponent(
        String(id)
      )}&q[start_date]=${encodeURIComponent(effectiveStart)}&q[end_date]=${encodeURIComponent(
        effectiveEnd
      )}&token=${encodeURIComponent(token)}`;

      const resp = await fetch(exportUrl, {
        // token is passed in query as required by export endpoint
        method: "GET",
      });
      if (!resp.ok) {
        throw new Error(`Export failed (${resp.status})`);
      }
      const blob = await resp.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      // filename hint
      link.download = `inventory_consumption_${id}_${effectiveStart}_to_${effectiveEnd}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Export started");
    } catch (e: any) {
      console.error("Export error:", e);
      toast.error(e?.message || "Failed to export");
    } finally {
      setIsExporting(false);
    }
  };

  // EnhancedTable: columns config
  const columns = useMemo(
    () => [
      { key: "date", label: "Date", sortable: true },
      { key: "opening", label: "Opening", sortable: true },
      { key: "add_or_consume", label: "Add / Consume", sortable: true },
      { key: "closing", label: "Closing", sortable: true },
      { key: "consumption_type", label: "Consumption Type", sortable: true },
      { key: "building", label: "Building", sortable: true },
      { key: "wing", label: "Wing", sortable: true },
      { key: "floor", label: "Floor", sortable: true },
      { key: "area", label: "Area", sortable: true },
      { key: "handover_to", label: "Handover To", sortable: true },
      { key: "comments", label: "Comments", sortable: false },
      { key: "consumed_by", label: "Consumed By", sortable: true },
    ],
    []
  );

  useEffect(() => {
    if (id && startDate && endDate) {
      dispatch(
        fetchInventoryConsumptionDetails({
          id,
          start_date: startDate,
          end_date: endDate,
        })
      );
    }
  }, [dispatch, id, startDate, endDate]);

  const handleSubmit = () => {
    console.log("Submitted with date range:", dateRange);
  };

  const handleReset = () => {
    setDateRange("");
  };

  // Add / Consume is its own page; carry the date range so it can return here.
  const handleAddConsume = () => {
    navigate(
      `/maintenance/inventory-consumption/view/${id}/add${location.search}`
    );
  };

  const handleBack = () => {
    navigate("/maintenance/inventory-consumption");
  };

  // Building/Wing/Floor/Area/Handover To can come back as a plain string,
  // a nested { id, name } object, or be absent entirely — normalize all
  // three to a renderable string instead of handing React a raw object.
  const displayName = (value: unknown): string => {
    if (value === null || value === undefined || value === "") return "";
    if (typeof value === "string" || typeof value === "number")
      return String(value);
    if (
      typeof value === "object" &&
      "name" in (value as Record<string, unknown>)
    ) {
      const name = (value as Record<string, unknown>).name;
      if (typeof name === "string" || typeof name === "number")
        return String(name);
    }
    return "";
  };

  // Backend sends consumption_type as lower-case snake_case (e.g. "issue_to_site");
  // show it title-cased without underscores ("Issue to Site").
  const formatConsumptionType = (value: unknown): string => {
    if (value === null || value === undefined || value === "") return "-";
    const text = String(value).replace(/_/g, " ").replace(/\s+/g, " ").trim();
    if (!text) return "-";
    return text.replace(/\b\w/g, (ch) => ch.toUpperCase());
  };

  // Render cell content for EnhancedTable
  const renderCell = useCallback((item: any, columnKey: string) => {
    switch (columnKey) {
      case "date":
        return (
          <span className={ledgerIdentifierCellClass}>{item?.date || "-"}</span>
        );
      case "opening":
        return (
          <span className={ledgerNumericCellClass}>{item?.opening ?? "-"}</span>
        );
      case "add_or_consume": {
        const type = String(item?.consumption_type || "").toLowerCase();
        // Everything except Add (and rows with no type) is stock going out.
        const isNegative = Boolean(type) && type !== "add";
        return (
          <span
            className={`${ledgerNumericCellClass} font-medium ${isNegative ? "text-red-500" : "text-green-500"}`}
          >
            {item?.add_or_consume ?? "-"}
          </span>
        );
      }
      case "closing":
        return (
          <span className={ledgerNumericCellClass}>{item?.closing ?? "-"}</span>
        );
      case "consumption_type":
        return (
          <span className={ledgerIdentifierCellClass}>
            {formatConsumptionType(item?.consumption_type)}
          </span>
        );
      case "building":
        return (
          <span className={ledgerIdentifierCellClass}>
            {displayName(item?.location?.building) || "-"}
          </span>
        );
      case "wing":
        return (
          <span className={ledgerIdentifierCellClass}>
            {displayName(item?.location?.wing) || "-"}
          </span>
        );
      case "floor":
        return (
          <span className={ledgerIdentifierCellClass}>
            {displayName(item?.location?.floor) || "-"}
          </span>
        );
      case "area":
        return (
          <span className={ledgerIdentifierCellClass}>
            {displayName(item?.location?.area) || "-"}
          </span>
        );
      case "handover_to":
        return (
          <span className={ledgerIdentifierCellClass}>
            {displayName(item?.handover_to) || "-"}
          </span>
        );
      case "comments":
        return <span className={ledgerCellClass}>{item?.comments || "-"}</span>;
      case "consumed_by":
        return (
          <span className={ledgerIdentifierCellClass}>
            {item?.consumed_by || "-"}
          </span>
        );
      default:
        return <span className={ledgerCellClass}>-</span>;
    }
  }, []);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">
          Inventory Name: <span className="font-bold">{inventory?.name}</span>
        </h2>
      </div>

      {error ? (
        <div className="text-center py-8 text-red-500">
          Error loading data: {error}
        </div>
      ) : (
        <EnhancedTable
          data={consumptions}
          columns={columns}
          renderCell={renderCell}
          storageKey="inventory-consumptions-table"
          loading={loading}
          enableExport={false}
          hideTableExport
          hideTableSearch
          hideColumnsButton
          pagination={false}
          getItemId={(item) => (item as any)?.id?.toString?.() ?? ""}
          emptyMessage="No consumption data available"
          leftActions={
            <div className="flex items-center gap-2">
              {shouldShow("Inventory Consumption", "create") && (
                <Button
                  onClick={handleAddConsume}
                  variant="ghost"
                  className="fm-button-fix fm-button-brand gap-1"
                >
                  Add / Consume
                </Button>
              )}
              <Button
                onClick={handleExport}
                disabled={isExporting || loading}
                className="inline-flex items-center gap-1 bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md px-3 py-2 h-9 text-sm"
                variant="outline"
              >
                {isExporting ? (
                  <>
                    <CircularProgress size={16} />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Export
                  </>
                )}
              </Button>
            </div>
          }
        />
      )}
    </div>
  );
};

export default InventoryConsumptionViewPage;
