import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, Eye, Plus, Trash2 } from "lucide-react";
import { EnhancedTable } from "./enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { StatusBadge } from "./StatusBadge";
import type { Asset } from "@/hooks/useAssets";
import { SelectionPanel } from "./water-asset-details/PannelTab";

// Asset interface now imported from useAssets hook

interface AssetDataTableProps {
  assets: Asset[];
  selectedAssets: string[];
  visibleColumns: any;
  onSelectAll: (checked: boolean) => void;
  onSelectAsset: (assetId: string, checked: boolean) => void;
  onViewAsset: (assetId: string) => void;
  handleAddAsset: () => void;
  handleAddSchedule: () => void;
  handleImport: () => void;
  onFilterOpen: () => void;
  onSearch: (searchTerm: string) => void;
  onRefreshData?: () => void;
  loading?: boolean;
  availableCustomFields?: Array<{ key: string; title: string }>;
}

export const AssetDataTable: React.FC<AssetDataTableProps> = ({
  assets,
  selectedAssets,
  visibleColumns,
  onSelectAll,
  onSelectAsset,
  onViewAsset,
  handleAddAsset,
  handleAddSchedule,
  handleImport,
  onFilterOpen,
  onSearch,
  onRefreshData,
  loading,
  availableCustomFields = [],
}) => {

  console.log("AssetDataTable rendered with assets:", assets);
  console.log("Available custom fields:", availableCustomFields);
  console.log("Selected assets:", visibleColumns);
  // Status color logic moved to StatusBadge component

  const [showActionPanel, setShowActionPanel] = useState(false);
  const handleExcelExport = async () => {

    try {
      const response = await fetch(
        `https://${localStorage.getItem('baseUrl')}/pms/assets/assets_data_report.xlsx`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,

            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to export assets to Excel");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "assets_data_report.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);


    } catch (error) {
      console.error("Error exporting assets to Excel:", error);
    }
  };
  const selectionActions = [
    {
      label: "Add Schedule",
      icon: Plus,
      onClick: handleAddSchedule,
      variant: "primary" as const,
    },
  ];

  const columns: ColumnConfig[] = [
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      hideable: false,
      defaultVisible: true,
    },
    {
      key: "serialNumber",
      label: "Serial Number",
      sortable: true,
      hideable: true,
      defaultVisible: visibleColumns.serialNumber,
    },
    {
      key: "name",
      label: "Asset Name",
      sortable: true,
      hideable: true,
      defaultVisible: visibleColumns.assetName,
    },
    {
      key: "id",
      label: "Asset ID",
      sortable: true,
      hideable: true,
      defaultVisible: visibleColumns.assetId,
    },
    {
      key: "assetNumber",
      label: "Asset No.",
      sortable: true,
      hideable: true,
      defaultVisible: visibleColumns.assetNo,
    },
    {
      key: "status",
      label: "Asset Status",
      sortable: true,
      hideable: true,
      defaultVisible: visibleColumns.assetStatus,
    },
    {
      key: "siteName",
      label: "Site",
      sortable: true,
      hideable: true,
      defaultVisible: visibleColumns.site,
    },
    {
      key: "building",
      label: "Building",
      sortable: true,
      hideable: true,
      defaultVisible: visibleColumns.building,
    },
    {
      key: "wing",
      label: "Wing",
      sortable: true,
      hideable: true,
      defaultVisible: visibleColumns.wing,
    },
    {
      key: "floor",
      label: "Floor",
      sortable: true,
      hideable: true,
      defaultVisible: visibleColumns.floor,
    },
    {
      key: "area",
      label: "Area",
      sortable: true,
      hideable: true,
      defaultVisible: visibleColumns.area,
    },
    {
      key: "pmsRoom",
      label: "Room",
      sortable: true,
      hideable: true,
      defaultVisible: visibleColumns.room,
    },
    {
      key: "assetGroup",
      label: "Group",
      sortable: true,
      hideable: true,
      defaultVisible: visibleColumns.asset_group,
    },
    {
      key: "assetSubGroup",
      label: "Sub-Group",
      sortable: true,
      hideable: true,
      defaultVisible: visibleColumns.subGroup,
    },
    {
      key: "assetType",
      label: "Asset Type",
      sortable: true,
      hideable: true,
      defaultVisible: visibleColumns.assetType,
    },
    {
      key: "category",
      label: "Category Type",
      sortable: true,
      hideable: true,
      defaultVisible: visibleColumns.category,
    },
    // Required fields that were missing
    {
      key: "purchaseDate",
      label: "Purchase Date",
      sortable: true,
      hideable: true,
      defaultVisible: false,
    },
    {
      key: "vendorName",
      label: "Vendor Name",
      sortable: true,
      hideable: true,
      defaultVisible: false,
    },
    {
      key: "purchaseCost",
      label: "Cost (₹)",
      sortable: true,
      hideable: true,
      defaultVisible: false,
    },
    {
      key: "department",
      label: "Department",
      sortable: true,
      hideable: true,
      defaultVisible: false,
    },
    {
      key: "usefulLife",
      label: "Useful Life (Years)",
      sortable: true,
      hideable: true,
      defaultVisible: false,
    },
    {
      key: "depreciationMethod",
      label: "Depreciation Method",
      sortable: true,
      hideable: true,
      defaultVisible: false,
    },
    {
      key: "accumDepreciation",
      label: "Accum. Depreciation (₹)",
      sortable: true,
      hideable: true,
      defaultVisible: false,
    },
    {
      key: "currentBookValue",
      label: "Current Book Value (₹)",
      sortable: true,
      hideable: true,
      defaultVisible: false,
    },
    {
      key: "disposalDate",
      label: "Disposal Date",
      sortable: true,
      hideable: true,
      defaultVisible: false,
    },
    {
      key: "modelNumber",
      label: "Model No",
      sortable: true,
      hideable: true,
      defaultVisible: false,
    },
    {
      key: "manufacturer",
      label: "Manufacturer",
      sortable: true,
      hideable: true,
      defaultVisible: false,
    },
    {
      key: "criticality",
      label: "Criticality",
      sortable: true,
      hideable: true,
      defaultVisible: false,
    },
    {
      key: "commissioningDate",
      label: "Commissioning Date",
      sortable: true,
      hideable: true,
      defaultVisible: false,
    },
    {
      key: "warrantyStatus",
      label: "Warranty Status",
      sortable: true,
      hideable: true,
      defaultVisible: false,
    },
    {
      key: "amcStatus",
      label: "AMC Status",
      sortable: true,
      hideable: true,
      defaultVisible: false,
    },
    {
      key: "amcStartDate",
      label: "AMC Start Date",
      sortable: true,
      hideable: true,
      defaultVisible: false,
    },
    {
      key: "amcEndDate",
      label: "AMC End Date",
      sortable: true,
      hideable: true,
      defaultVisible: false,
    },
    {
      key: "amcType",
      label: "AMC Type",
      sortable: true,
      hideable: true,
      defaultVisible: false,
    },
    // Dynamic custom field columns
    ...availableCustomFields.map(field => ({
      key: `custom_${field.key}`,
      label: field.title,
      sortable: true,
      hideable: true,
      defaultVisible: true,
    })),
  ];

  console.log("Total columns:", columns.length);
  console.log("Column keys:", columns.map(col => col.key));
  console.log("Custom field columns:", columns.filter(col => col.key.startsWith('custom_')));

  const renderCell = (asset: Asset, columnKey: string) => {
    switch (columnKey) {
      case "actions":
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewAsset(asset.id);
            }}
            className="p-1 h-8 w-8"
          >
            <Eye className="w-4 h-4" />
          </Button>
        );
      case "serialNumber":
        return (
          <span className="text-sm text-gray-600">{asset.serialNumber}</span>
        );
      case "name":
        return (
          <span className="text-sm font-medium text-gray-900">
            {asset.name}
          </span>
        );
      case "id":
        return <span className="text-sm text-[#1a1a1a]">{asset.id}</span>;
      case "assetNumber":
        return (
          <span className="text-sm text-gray-600">{asset.assetNumber}</span>
        );
      case "status":
        return (
          <StatusBadge
            status={asset.status}
            assetId={asset.id}
            onStatusUpdate={onRefreshData}
          />
        );
      case "siteName":
        return <span className="text-sm text-gray-600">{asset.siteName}</span>;
      case "building":
        return (
          <span className="text-sm text-gray-600">
            {asset.building?.name || "-"}
          </span>
        );
      case "wing":
        return (
          <span className="text-sm text-gray-600">
            {asset.wing?.name || "-"}
          </span>
        );
      case "floor":
        return <span className="text-sm text-gray-600">{asset?.floor?.name || "-"}</span>;
        {
          /* Floor not in API response */
        }
      case "area":
        return (
          <span className="text-sm text-gray-600">
            {asset.area?.name || "-"}
          </span>
        );
      case "pmsRoom":
        return (
          <span className="text-sm text-gray-600">
            {asset.pmsRoom?.name || "-"}
          </span>
        );
      case "assetGroup":
        return (
          <span className="text-sm text-gray-600">
            {asset.assetGroup || "-"}
          </span>
        );
      case "assetSubGroup":
        return (
          <span className="text-sm text-gray-600">
            {asset.assetSubGroup || "-"}
          </span>
        );
      case "assetType":
        return (
          <span className="text-sm text-gray-600">
            {asset.assetType ? "Comprehensive" : "Non-Comprehensive"}
          </span>
        );
      case "category":
        return (
          <span className="text-sm text-gray-600">
            {asset.category || "-"}
          </span>
        );
      case "purchaseDate":
        return (
          <span className="text-sm text-gray-600">
            {asset.purchased_on || "-"}
          </span>
        );
      case "vendorName":
        return (
          <span className="text-sm text-gray-600">
            {asset.supplier_name || "-"}
          </span>
        );
      case "purchaseCost":
        return (
          <span className="text-sm text-gray-600">
            {asset.purchase_cost ? `₹${asset.purchase_cost}` : "-"}
          </span>
        );
      case "department":
        return (
          <span className="text-sm text-gray-600">
            {asset.allocation_type || "-"}
          </span>
        );
      case "usefulLife":
        return (
          <span className="text-sm text-gray-600">
            {asset.useful_life ? `${asset.useful_life} years` : "-"}
          </span>
        );
      case "depreciationMethod":
        return (
          <span className="text-sm text-gray-600">
            {asset.depreciation_method || "-"}
          </span>
        );
      case "accumDepreciation":
        return (
          <span className="text-sm text-gray-600">
            {asset.accumulated_depreciation ? `₹${asset.accumulated_depreciation}` : "-"}
          </span>
        );
      case "currentBookValue":
        return (
          <span className="text-sm text-gray-600">
            {asset.current_book_value ? `₹${asset.current_book_value}` : "-"}
          </span>
        );
      case "disposalDate":
        return (
          <span className="text-sm text-gray-600">
            {asset.disposal_date || "-"}
          </span>
        );
      case "modelNumber":
        return (
          <span className="text-sm text-gray-600">
            {asset.model_number || "-"}
          </span>
        );
      case "manufacturer":
        return (
          <span className="text-sm text-gray-600">
            {asset.manufacturer || "-"}
          </span>
        );
      case "criticality":
        return (
          <span className="text-sm text-gray-600">
            {asset.critical ? "Critical" : "Non-Critical"}
          </span>
        );
      case "commissioningDate":
        return (
          <span className="text-sm text-gray-600">
            {asset.commisioning_date || "-"}
          </span>
        );
      case "warrantyStatus":
        return (
          <span className="text-sm text-gray-600">
            {asset.warranty ? "Active" : "Inactive"}
          </span>
        );
      case "amcStatus":
        return (
          <span className="text-sm text-gray-600">
            {asset.amc?.amc_status || "-"}
          </span>
        );
      case "amcStartDate":
        return (
          <span className="text-sm text-gray-600">
            {asset.amc?.start_date || "-"}
          </span>
        );
      case "amcEndDate":
        return (
          <span className="text-sm text-gray-600">
            {asset.amc?.end_date || "-"}
          </span>
        );
      case "amcType":
        return (
          <span className="text-sm text-gray-600">
            {asset.asset_type ? "Comprehensive" : "Non-Comprehensive"}
          </span>
        );
      default:
        // Handle custom fields
        if (columnKey.startsWith("custom_")) {
          const fieldKey = columnKey.replace("custom_", "");
          const customFieldValue = asset[fieldKey];
          return (
            <span className="text-sm text-gray-600">
              {customFieldValue || "-"}
            </span>
          );
        }
        return null;
    }
  };

  const handleActionClick = () => {
    setShowActionPanel(true);
  };

  return (  
    <>
      {showActionPanel && (
        <SelectionPanel
          actions={selectionActions}
          onAdd={handleAddAsset}
          onClearSelection={() => setShowActionPanel(false)}
          onImport={handleImport}
        // onChecklist={onChecklist}
        />
      )}
      <EnhancedTable
        data={assets}
        columns={columns}
        renderCell={renderCell}
        storageKey="asset-data-table"
        emptyMessage="No assets found"
        selectable={true}
        selectedItems={selectedAssets}
        onSelectAll={onSelectAll}
        onSelectItem={onSelectAsset}
        getItemId={(asset) => asset.id}
        selectAllLabel="Select all assets"
        onFilterClick={onFilterOpen}
        enableExport={true}
        onSearchChange={onSearch}
        handleExport={handleExcelExport}
        loading={loading}
        key={`asset-table-${availableCustomFields.length}`} // Force re-render when custom fields change
        leftActions={
          <Button
            size="sm"
            className="mr-2"
            onClick={handleActionClick}
          >
            <Plus className="w-4 h-4 mr-2" />
            Action
          </Button>
        }
      />
    </>
  );
};
