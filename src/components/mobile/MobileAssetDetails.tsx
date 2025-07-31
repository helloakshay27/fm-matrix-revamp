import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import axios from "axios";
import { API_CONFIG, getAuthHeader } from "@/config/apiConfig";
import { saveToken, saveBaseUrl } from "@/utils/auth";
import { getStatusButtonColor, formatStatusText } from "@/utils/statusUtils";
import {
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  Info,
  FileText,
  Wrench,
  Package,
  Paperclip,
  Gauge,
  History,
  Ticket,
  TrendingDown,
  CheckCircle,
  DollarSign,
  Users,
  MoreVertical,
} from "lucide-react";
import { AMCDetailsTab } from "@/components/asset-details/AMCDetailsTab";
import { PPMTab } from "@/components/asset-details/PPMTab";
import { EBOMTab } from "@/components/asset-details/EBOMTab";
import { AttachmentsTab } from "@/components/asset-details/AttachmentsTab";
import { ReadingsTab } from "@/components/asset-details/ReadingsTab";
import { HistoryCardTab } from "@/components/asset-details/HistoryCardTab";
import { DepreciationTab } from "@/components/asset-details/DepreciationTab";
import { TicketTab } from "@/components/asset-details/TicketTab";

interface Activity {
  id: number;
  trackable_id: number;
  trackable_type: string;
  owner_id: number;
  owner_type: string;
  key: string;
  parameters: {
    updated_at?: [string, string];
    created_by?: [string, string];
    breakdown?: [boolean, boolean];
    breakdown_date?: [string | null, string | null];
    location_type?: [string, string | null];
    [key: string]: any;
  };
  recipient_id?: number | null;
  recipient_type?: string | null;
  created_at: string;
  updated_at: string;
}

interface Asset {
  id: number;
  name: string;
  assetNumber?: string;
  status?: string;
  breakdown?: boolean;
  assetGroup?: string;
  assetSubGroup?: string;
  siteName?: string;
  building?: { name: string } | null;
  wing?: { name: string } | null;
  area?: { name: string } | null;
  createdAt?: string;
  updatedAt?: string;
  ownerCost?: number;
  association?: string;
  asset_type_category?: string;
  purchase_cost?: number;
  current_date_cost?: number;
  ownership_costs?: OwnershipCost[];
  activities?: Activity[];
  model_number?: string;
  ownership_total_cost?: number;
  manufacturer?: string;
}

interface OwnershipCost {
  id: number;
  date: string;
  status: string;
  cost: number;
  warranty_in_month: string;
  asset_name?: string;
  asset_id: number;
}

interface MobileAssetDetailsProps {
  asset: Asset;
}

interface TabConfig {
  key: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: any;
}

const assetTabs = [
  {
    key: "amc-details",
    label: "AMC Details",
    icon: FileText,
    component: AMCDetailsTab,
  },
  { key: "ppm", label: "PPM", icon: Wrench, component: PPMTab },
  { key: "e-bom", label: "E-BOM", icon: Package, component: EBOMTab },
  {
    key: "attachments",
    label: "Attachments",
    icon: Paperclip,
    component: AttachmentsTab,
  },
  { key: "readings", label: "Readings", icon: Gauge, component: ReadingsTab },
  {
    key: "history-card",
    label: "History Card",
    icon: History,
    component: HistoryCardTab,
  },
  {
    key: "depreciation",
    label: "Depreciation",
    icon: TrendingDown,
    component: DepreciationTab,
  },
  { key: "ticket", label: "Ticket", icon: Ticket, component: TicketTab },
];

export const MobileAssetDetails: React.FC<MobileAssetDetailsProps> = ({
  asset: initialAsset,
}) => {
  const navigate = useNavigate();
  const { assetId } = useParams();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [assetData, setAssetData] = useState<Asset>(initialAsset);
  const [loading, setLoading] = useState(false);
  const [availableTabs, setAvailableTabs] = useState<TabConfig[]>([]);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const statusOptions = [
    { value: "in_use", label: "In Use", color: "bg-green-100 text-green-800" },
    { value: "breakdown", label: "Breakdown", color: "bg-red-100 text-red-800" },
    { value: "in_storage", label: "In Store", color: "bg-yellow-100 text-yellow-800" },
    { value: "disposed", label: "Disposed", color: "bg-gray-100 text-gray-800" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch detailed asset data from API
  useEffect(() => {
    const fetchAssetDetails = async () => {
      // Use assetId from URL params if available, otherwise fall back to initialAsset.id
      const idToUse = assetId || initialAsset.id;

      if (!idToUse) {
        // If no ID, use default tabs
        setAvailableTabs(getDefaultTabs());
        return;
      }

      setLoading(true);
      try {
        // Get the mobile token specifically
        const mobileToken = sessionStorage.getItem("mobile_token");
        if (!mobileToken) {
          throw new Error("Mobile token not found");
        }

        // Temporarily set the mobile token as the main token for API calls
        saveToken(mobileToken);

        // Get base URL and ensure it's saved in the main auth system
        let baseUrl =
          sessionStorage.getItem("baseUrl") ||
          "https://oig-api.gophygital.work";
        baseUrl = baseUrl.replace(/\/$/, "");
        if (!baseUrl.startsWith("http")) {
          baseUrl = `https://${baseUrl}`;
        }
        saveBaseUrl(baseUrl);

        const response = await fetch(`${baseUrl}/pms/assets/${idToUse}.json`, {
          headers: {
            Authorization: `Bearer ${mobileToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const fetchedAsset = data.asset;
        setAssetData(fetchedAsset);

        // Determine available tabs based on asset type
        const tabs = getAvailableTabsForAsset(fetchedAsset);
        setAvailableTabs(tabs);
      } catch (error) {
        console.error("Failed to fetch asset details", error);
        // Fallback to default tabs if API fails
        setAvailableTabs(getDefaultTabs());
      } finally {
        setLoading(false);
      }
    };

    fetchAssetDetails();
  }, [assetId, initialAsset.id]);

  // Function to determine available tabs based on asset type
  const getAvailableTabsForAsset = (asset: Asset) => {
    const allTabs = [
      {
        key: "amc-details",
        label: "AMC Details",
        icon: FileText,
        component: AMCDetailsTab,
      },
      { key: "ppm", label: "PPM", icon: Wrench, component: PPMTab },
      { key: "e-bom", label: "E-BOM", icon: Package, component: EBOMTab },
      {
        key: "attachments",
        label: "Attachments",
        icon: Paperclip,
        component: AttachmentsTab,
      },
      {
        key: "history-card",
        label: "History Card",
        icon: History,
        component: HistoryCardTab,
      },
      {
        key: "depreciation",
        label: "Depreciation",
        icon: TrendingDown,
        component: DepreciationTab,
      },
      { key: "ticket", label: "Ticket", icon: Ticket, component: TicketTab },

      {
        key: "owner-cost",
        label: "Owner Cost",
        icon: DollarSign,
        component: () => (
          <div className="space-y-2 text-sm">
            <div className="p-3 bg-white rounded border">
              <p className="font-medium text-gray-900">Status</p>
              <p className="text-gray-600 mt-1">{asset.status || "N/A"}</p>
            </div>

            {asset.ownership_costs && asset.ownership_costs.length > 0 && (
              <div className="p-3 bg-white rounded border">
                <p className="font-medium text-gray-900">Recent Maintenance</p>
                <div className="mt-2 space-y-1">
                  {asset.ownership_costs
                    .slice(0, 3)
                    .map((cost: OwnershipCost, index: number) => (
                      <div key={index} className="text-xs">
                        <span className="text-gray-500">
                          {cost.date} - {cost.status}:
                        </span>
                        <span className="text-gray-900 ml-1">
                          OMR{cost.cost?.toLocaleString()}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
            <div className="p-3 bg-white rounded border">
              <p className="font-medium text-gray-900">
                Total Maintenance Cost
              </p>
              <p className="text-gray-600 mt-1">
                OMR
                {asset.ownership_costs
                  ?.reduce(
                    (total: number, cost: OwnershipCost) =>
                      total + (cost.cost || 0),
                    0
                  )
                  ?.toLocaleString() || "0"}
              </p>
            </div>
          </div>
        ),
      },
    ];

    // Add conditional tabs based on asset type
    const tabs = [...allTabs];

    // Add Readings tab only for Meter type assets
    if (asset.asset_type_category === "Meter") {
      tabs.splice(4, 0, {
        key: "readings",
        label: "Readings",
        icon: Gauge,
        component: ReadingsTab,
      });
    }

    return tabs;
  };

  // Default tabs if no asset type is available
  const getDefaultTabs = () => {
    return [
      {
        key: "amc-details",
        label: "AMC Details",
        icon: FileText,
        component: AMCDetailsTab,
      },
      { key: "ppm", label: "PPM", icon: Wrench, component: PPMTab },
      { key: "e-bom", label: "E-BOM", icon: Package, component: EBOMTab },
      {
        key: "attachments",
        label: "Attachments",
        icon: Paperclip,
        component: AttachmentsTab,
      },
      {
        key: "history-card",
        label: "History Card",
        icon: History,
        component: HistoryCardTab,
      },
      {
        key: "depreciation",
        label: "Depreciation",
        icon: TrendingDown,
        component: DepreciationTab,
      },
      { key: "ticket", label: "Ticket", icon: Ticket, component: TicketTab },

      {
        key: "owner-cost",
        label: "Owner Cost",
        icon: DollarSign,
        component: () => (
          <div className="space-y-2 text-sm">
            <div className="p-3 bg-white rounded border">
              <p className="font-medium text-gray-900">Initial Cost</p>
              <p className="text-gray-600 mt-1">₹N/A</p>
            </div>
            <div className="p-3 bg-white rounded border">
              <p className="font-medium text-gray-900">Current Date Cost</p>
              <p className="text-gray-600 mt-1">₹N/A</p>
            </div>
            <div className="p-3 bg-white rounded border">
              <p className="font-medium text-gray-900">
                Total Maintenance Cost
              </p>
              <p className="text-gray-600 mt-1">₹0</p>
            </div>
          </div>
        ),
      },
    ];
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleBreakdownClick = () => {
    const idToUse = assetId || assetData.id;
    navigate(`/mobile/assets/${idToUse}/breakdown`);
  };

  const handleStatusUpdate = async (newStatus: string) => {
    const idToUse = assetId || assetData.id;
    if (!idToUse) return;

    setUpdatingStatus(true);
    try {
      const mobileToken = sessionStorage.getItem("mobile_token");
      if (!mobileToken) {
        throw new Error("Mobile token not found");
      }

      let baseUrl = sessionStorage.getItem("baseUrl") || "https://oig-api.gophygital.work";
      baseUrl = baseUrl.replace(/\/$/, "");
      if (!baseUrl.startsWith("http")) {
        baseUrl = `https://${baseUrl}`;
      }

      const response = await fetch(`${baseUrl}/pms/assets/${idToUse}.json`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${mobileToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pms_asset: {
            status: newStatus,
            breakdown: newStatus === "breakdown" ? "true" : "false"
          }
        }),
      });

      if (response.ok) {
        setAssetData(prev => ({
          ...prev,
          status: newStatus,
          breakdown: newStatus === "breakdown"
        }));
        setShowStatusDropdown(false);
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // const handleBreakdownClick = () => {
  //   const idToUse = assetId || assetData.id;
  //   navigate(`/mobile/assets/${idToUse}?action=breakdown`);
  // };

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Asset Details</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Asset Header Card */}
        <div className="bg-[#F6F4EE] p-4">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm text-red-600 font-medium">
                Asset ID : #{assetData.id}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Status Display with Dropdown */}
              <div className="relative">
                <button
                  onClick={
                    assetData.breakdown ||
                    assetData.status?.toLowerCase() === "breakdown"
                      ? handleBreakdownClick
                      : undefined
                  }
                  className={`px-4 py-1 rounded text-xs font-medium transition-colors ${getStatusButtonColor(
                    assetData.breakdown ? "Breakdown" : assetData.status
                  )}`}
                >
                  {formatStatusText(
                    assetData.breakdown
                      ? "Breakdown"
                      : assetData.status || "In Use"
                  )}
                </button>
              </div>
              
              {/* Status Change Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  disabled={updatingStatus}
                >
                  <MoreVertical className="h-4 w-4 text-gray-600" />
                </button>
                
                {showStatusDropdown && (
                  <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[150px]">
                    <div className="p-2">
                      <p className="text-xs text-gray-500 mb-2 px-2">Change Status</p>
                      {statusOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleStatusUpdate(option.value)}
                          disabled={updatingStatus}
                          className={`w-full text-left px-2 py-1 text-xs rounded hover:opacity-80 transition-colors first:rounded-t-lg last:rounded-b-lg ${option.color} ${
                            (assetData.breakdown && option.value === "breakdown") || 
                            (!assetData.breakdown && assetData.status === option.value)
                              ? "ring-2 ring-blue-500 font-medium" 
                              : ""
                          }`}
                        >
                          {updatingStatus ? "Updating..." : option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Asset Info</h2>

            <div className="space-y-4 text-sm">
              <div className="flex items-center">
                <span className="text-gray-500 w-32">Asset Name</span>
                <span className="text-gray-900 font-medium">
                  : {assetData.name || "Diesel Generator 1"}
                </span>
              </div>

              <div className="flex items-center">
                <span className="text-gray-500 w-32">Group/Subgroup</span>
                <span className="text-gray-900">
                  : {assetData.assetGroup || "Electrical"}{" "}
                  {(assetData.assetSubGroup && `${assetData.assetSubGroup}`) ||
                    "Equipments"}
                </span>
              </div>

              <div className="flex items-center">
                <span className="text-gray-500 w-32">Equipment ID</span>
                <span className="text-gray-900">
                  : {assetData.model_number || "123456"}
                </span>
              </div>

              <div className="flex items-center">
                <span className="text-gray-500 w-32">Owner Cost</span>
                <span className="text-gray-900">
                  : OMR{assetData.ownership_total_cost || "0"}
                </span>
              </div>

              <div className="flex items-center">
                <span className="text-gray-500 w-32">Association</span>
                <span className="text-gray-900">
                  : {assetData.manufacturer || "Facility Management"}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Options Section */}
        <div className="bg-white p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Please select below options
          </h3>
          <div className="space-y-3">
            {availableTabs.map((tab) => {
              const Icon = tab.icon;
              const isOpen = openSections[tab.key];
              return (
                <Collapsible
                  key={tab.key}
                  open={isOpen}
                  onOpenChange={() => toggleSection(tab.key)}
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-orange-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {tab.label}
                        </span>
                      </div>
                      {isOpen ? (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <tab.component
                        asset={assetData}
                        assetId={assetId || assetData.id}
                        isMobile={true}
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
