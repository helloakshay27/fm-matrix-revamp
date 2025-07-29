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
  handleImport: () => void;
  onFilterOpen: () => void;
  onSearch: (searchTerm: string) => void;
  onRefreshData?: () => void;
}

export const AssetDataTable: React.FC<AssetDataTableProps> = ({
  assets,
  selectedAssets,
  visibleColumns,
  onSelectAll,
  onSelectAsset,
  onViewAsset,
  handleAddAsset,
  handleImport,
  onFilterOpen,
  onSearch,
  onRefreshData
}) => {

  console.log("AssetDataTable rendered with assets:", assets);
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
    // {
    //   label: 'Update',
    //   icon: Clock,
    //   // onClick: handleUpdateSelected,
    //   variant: 'outline' as const,
    // },
    // {
    //   label: 'Flag',
    //   icon: AlertCircle,
    //   // onClick: handleFlagSelected,
    //   variant: 'outline' as const,
    // },
    // {
    //   label: 'Delete',
    //   icon: Trash2,
    //   // onClick: () => handleBulkDelete(selectedAMCObjects),
    //   variant: 'destructive' as const,
    // },
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
      key: "assetName",
      label: "Asset Name",
      sortable: true,
      hideable: true,
      defaultVisible: visibleColumns.assetName,
    },
    {
      key: "assetId",
      label: "Asset ID",
      sortable: true,
      hideable: true,
      defaultVisible: visibleColumns.assetId,
    },
    {
      key: "assetNo",
      label: "Asset No.",
      sortable: true,
      hideable: true,
      defaultVisible: visibleColumns.assetNo,
    },
    {
      key: "assetStatus",
      label: "Asset Status",
      sortable: true,
      hideable: true,
      defaultVisible: visibleColumns.assetStatus,
    },
    {
      key: "site",
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
      key: "room",
      label: "Room",
      sortable: true,
      hideable: true,
      defaultVisible: visibleColumns.room,
    },
    {
      key: "group",
      label: "Group",
      sortable: true,
      hideable: true,
      defaultVisible: visibleColumns.asset_group,
    },
    {
      key: "subGroup",
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
  ];

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
      case "assetName":
        return (
          <span className="text-sm font-medium text-gray-900">
            {asset.name}
          </span>
        );
      case "assetId":
        return <span className="text-sm text-[#1a1a1a]">{asset.id}</span>;
      case "assetNo":
        return (
          <span className="text-sm text-gray-600">{asset.assetNumber}</span>
        );
      case "assetStatus":
        return (
          <StatusBadge
            status={asset.status}
            assetId={asset.id}
            onStatusUpdate={onRefreshData}
          />
        );
      case "site":
        return <span className="text-sm text-gray-600">{asset.siteName}</span>;
      case "building":
        return (
          <span className="text-sm text-gray-600">
            {asset.building?.name || "NA"}
          </span>
        );
      case "wing":
        return (
          <span className="text-sm text-gray-600">
            {asset.wing?.name || "NA"}
          </span>
        );
      case "floor":
        return <span className="text-sm text-gray-600">{asset?.floor?.name}</span>;
        {
          /* Floor not in API response */
        }
      case "area":
        return (
          <span className="text-sm text-gray-600">
            {asset.area?.name || "NA"}
          </span>
        );
      case "room":
        return (
          <span className="text-sm text-gray-600">
            {asset.pmsRoom?.name || "NA"}
          </span>
        );
      case "group":
        return (
          <span className="text-sm text-gray-600">
            {asset.assetGroup || "N/A"}
          </span>
        );
      case "subGroup":
        return (
          <span className="text-sm text-gray-600">
            {asset.assetSubGroup || "N/A"}
          </span>
        );
      case "assetType":
        return (
          <span className="text-sm text-gray-600">
            {asset.assetType ? "Comprehensive" : "Non-Comprehensive"}
          </span>
        );
      default:
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
        onRowClick={(asset) => onViewAsset(asset.id)}
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
