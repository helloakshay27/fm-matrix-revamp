import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { API_CONFIG, getAuthHeader } from "@/config/apiConfig";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, Plus, ChevronDown } from "lucide-react";

import { AssetInfoTab } from "@/components/asset-details/AssetInfoTab";
import { AssetAnalyticsTab } from "@/components/asset-details/AssetAnalyticsTab";
import { AMCDetailsTab } from "@/components/asset-details/AMCDetailsTab";
import { PPMTab } from "@/components/asset-details/PPMTab";
import { EBOMTab } from "@/components/asset-details/EBOMTab";
import { AttachmentsTab } from "@/components/asset-details/AttachmentsTab";
import { ReadingsTab } from "@/components/asset-details/ReadingsTab";
import { HistoryCardTab } from "@/components/asset-details/HistoryCardTab";
import { DepreciationTab } from "@/components/asset-details/DepreciationTab";
import { TicketTab } from "@/components/asset-details/TicketTab";
import { AssociationTab } from "@/components/asset-details/AssociationTab";
import { OwnerCostTab } from "@/components/asset-details/OwnerCostTab";

import { RepairReplaceModal } from "@/components/RepairReplaceModal";
import { QRCodeModal } from "@/components/QRCodeModal";
import { StatusBadge } from "@/components/StatusBadge";

export const AssetDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assetData, setAssetData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isInUse, setIsInUse] = useState(true);
  const [isRepairReplaceOpen, setIsRepairReplaceOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [showEnable, setShowEnable] = useState(false);
  const [activeTab, setActiveTab] = useState("asset-info");

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const response = await axios.get(
          `${API_CONFIG.BASE_URL}/pms/assets/${id}.json`,
          {
            headers: {
              Authorization: getAuthHeader(),
            },
          }
        );
        setAssetData(response.data.asset);
        if (
          response.data.asset.asset_type_category === "Land" ||
          response.data.asset.asset_type_category === "Building" ||
          response.data.asset.asset_type_category === "Leasehold Improvement" ||
          response.data.asset.asset_type_category === "Leasehold Land" ||
          response.data.asset.asset_type_category === "Vehicle"
        ) {
          setShowEnable(true);
        }
      } catch (error) {
        console.error("Failed to fetch asset", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAsset();
  }, [id]);

  // Function to refresh asset data after status update
  const refreshAssetData = async () => {
    try {
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}/pms/assets/${id}.json`,
        {
          headers: {
            Authorization: getAuthHeader(),
          },
        }
      );
      setAssetData(response.data.asset);
    } catch (error) {
      console.error("Failed to refresh asset data", error);
    }
  };

  console.log(showEnable);

  const handleBack = () => navigate("/maintenance/asset");

  const handleEditDetails = () => {
    navigate(`/maintenance/asset/edit/${id}`);
  };

  const handleCreateChecklist = () => {
    console.log("Create Checklist clicked");
  };

  const handleSwitchChange = (checked: boolean) => {
    setIsInUse(checked);
    if (checked) {
      setIsRepairReplaceOpen(true);
    }
  };

  if (loading || !assetData) {
    return <div className="p-6">Loading asset data...</div>;
  }

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-1 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Assets
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">
                {assetData.name} ({assetData.asset_type_category})
              </h1>

              <div className="text-base px-4 py-2 ">
                <StatusBadge
                  status={assetData.status || "-"}
                  assetId={assetData.id}
                  onStatusUpdate={refreshAssetData}
                />
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Created by {assetData.created_by} • Last updated by{" "}
              {assetData.last_updated_by} on &nbsp; {assetData.updated_at}
            </div>
          </div>


          {activeTab === "asset-info" && (
            <div className="flex items-center gap-3">
              {/* <Button
                onClick={handleCreateChecklist}
                className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-4 py-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Checklist
              </Button> */}
              <Button
                onClick={() => setIsQRModalOpen(true)}
                className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-4 py-2"
              >
                <svg
                  width="14"
                  height="15"
                  viewBox="0 0 14 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.332031 4.20609V0.935059H3.66536V2.24347H1.66536V4.20609H0.332031ZM0.332031 14.0192V10.7481H1.66536V12.7108H3.66536V14.0192H0.332031ZM10.332 14.0192V12.7108H12.332V10.7481H13.6654V14.0192H10.332ZM12.332 4.20609V2.24347H10.332V0.935059H13.6654V4.20609H12.332ZM10.6654 11.0752H11.6654V12.0566H10.6654V11.0752ZM10.6654 9.11263H11.6654V10.0939H10.6654V9.11263ZM9.66536 10.0939H10.6654V11.0752H9.66536V10.0939ZM8.66536 11.0752H9.66536V12.0566H8.66536V11.0752ZM7.66536 10.0939H8.66536V11.0752H7.66536V10.0939ZM9.66536 8.13132H10.6654V9.11263H9.66536V8.13132ZM8.66536 9.11263H9.66536V10.0939H8.66536V9.11263ZM7.66536 8.13132H8.66536V9.11263H7.66536V8.13132ZM11.6654 2.89768V6.82291H7.66536V2.89768H11.6654ZM6.33203 8.13132V12.0566H2.33203V8.13132H6.33203ZM6.33203 2.89768V6.82291H2.33203V2.89768H6.33203ZM5.33203 11.0752V9.11263H3.33203V11.0752H5.33203ZM5.33203 5.8416V3.87898H3.33203V5.8416H5.33203ZM10.6654 5.8416V3.87898H8.66536V5.8416H10.6654Z"
                    fill="#C72030"
                  />
                </svg>
                View QR
              </Button>

              <Button
                onClick={handleEditDetails}
                variant="outline"
                className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50 px-4 py-2"
              >
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 21 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="mask0_107_2076"
                    style={{ maskType: "alpha" }}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="21"
                    height="21"
                  >
                    <rect width="21" height="21" fill="#C72030" />
                  </mask>
                  <g mask="url(#mask0_107_2076)">
                    <path
                      d="M4.375 16.625H5.47881L14.4358 7.66806L13.3319 6.56425L4.375 15.5212V16.625ZM3.0625 17.9375V14.9761L14.6042 3.43941C14.7365 3.31924 14.8825 3.22642 15.0423 3.16094C15.2023 3.09531 15.37 3.0625 15.5455 3.0625C15.7209 3.0625 15.8908 3.09364 16.0552 3.15591C16.2197 3.21818 16.3653 3.3172 16.492 3.45297L17.5606 4.53491C17.6964 4.66164 17.7931 4.80747 17.8509 4.97241C17.9086 5.13734 17.9375 5.30228 17.9375 5.46722C17.9375 5.64324 17.9075 5.81117 17.8474 5.971C17.7873 6.13098 17.6917 6.2771 17.5606 6.40937L6.02394 17.9375H3.0625ZM13.8742 7.12578L13.3319 6.56425L14.4358 7.66806L13.8742 7.12578Z"
                      fill="#C72030"
                    />
                  </g>
                </svg>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <Tabs defaultValue="asset-info" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="w-full flex flex-wrap bg-gray-50 rounded-t-lg h-auto p-0 text-sm justify-stretch">
            <TabsTrigger
              value="asset-info"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Asset Info
            </TabsTrigger>

            <TabsTrigger
              value="amc-details"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              AMC Details
            </TabsTrigger>

            <TabsTrigger
              value="ppm"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              PPM
            </TabsTrigger>

            <TabsTrigger
              value="e-bom"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              E-BOM
            </TabsTrigger>

            <TabsTrigger
              value="attachments"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Attachments
            </TabsTrigger>

            {assetData.asset_type_category === "Meter" && (
              <TabsTrigger
                value="readings"
                className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
              >
                Readings
              </TabsTrigger>
            )}

            <TabsTrigger
              value="history-card"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              History Card
            </TabsTrigger>

            <TabsTrigger
              value="depreciation"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Depreciation
            </TabsTrigger>

            <TabsTrigger
              value="ticket"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Ticket
            </TabsTrigger>

            <TabsTrigger
              value="association"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Association
            </TabsTrigger>

            <TabsTrigger
              value="owner-cost"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Owner Cost
            </TabsTrigger>
          </TabsList>

          <TabsContent value="asset-info" className="p-4 sm:p-6">
            <AssetInfoTab
              asset={assetData}
              assetId={assetData.id}
              showEnable={showEnable}
            />
          </TabsContent>
          <TabsContent value="amc-details" className="p-4 sm:p-6">
            <AMCDetailsTab asset={assetData} assetId={assetData.id} />
          </TabsContent>
          <TabsContent value="ppm" className="p-4 sm:p-6">
            <PPMTab asset={assetData} assetId={assetData.id} />
          </TabsContent>
          <TabsContent value="e-bom" className="p-4 sm:p-6">
            <EBOMTab asset={assetData} assetId={assetData.id} />
          </TabsContent>
          <TabsContent value="attachments" className="p-4 sm:p-6">
            <AttachmentsTab asset={assetData} assetId={assetData.id} />
          </TabsContent>
          <TabsContent value="readings" className="p-4 sm:p-6">
            <ReadingsTab asset={assetData} assetId={assetData.id} />
          </TabsContent>
          <TabsContent value="history-card" className="p-4 sm:p-6">
            <HistoryCardTab asset={assetData} assetId={assetData.id} />
          </TabsContent>
          <TabsContent value="depreciation" className="p-4 sm:p-6">
            <DepreciationTab asset={assetData} assetId={assetData.id} />
          </TabsContent>
          <TabsContent value="ticket" className="p-4 sm:p-6">
            <TicketTab asset={assetData} assetId={assetData.id} />
          </TabsContent>
          <TabsContent value="association" className="p-4 sm:p-6">
            <AssociationTab asset={assetData} assetId={assetData.id} />
          </TabsContent>
          <TabsContent value="owner-cost" className="p-4 sm:p-6">
            <OwnerCostTab asset={assetData} assetId={assetData.id} refreshAssetData={refreshAssetData} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      {/* <RepairReplaceModal
        isOpen={isRepairReplaceOpen}
        onClose={() => setIsRepairReplaceOpen(false)}
      /> */}

      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        qrCode={assetData.qr_url}
        serviceName={assetData.name}
        site="Main Building"
      />
    </div>
  );
};
