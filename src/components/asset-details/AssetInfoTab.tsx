import React from "react";
import {
  MapPin,
  QrCode,
  Settings,
  CreditCard,
  UserCheck,
  TrendingUp,
  User,
  FileText,
  CheckCircle,
  Box,
  Clock,
  UserIcon,
  X,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { AssetAnalyticsTab } from "./AssetAnalyticsTab";

// Removed duplicate interface declaration for AssetInfoTabProps
interface Asset {
  id: number;
  name: string;
  model_number: string;
  serial_number: string;
  purchase_cost: number;
  purchased_on: string;
  warranty: boolean;
  warranty_expiry: string;
  manufacturer: string;
  asset_number: string;
  asset_code: string;
  group: string;
  sub_group: string;
  allocation_type: string;
  depreciation_applicable: boolean;
  depreciation_method: string;
  useful_life: number;
  salvage_value: number;
  status: string;
  current_book_value: number;
  site_name: string;
  commisioning_date: string;
  vendor_name: string;
  warranty_period?: number; // <-- Added property
  image_url?: string; // <-- Added property
  asset_image?: {
    document: string;
    document_name: string;
  };
  supplier_detail?: {
    company_name: string;
    email: string;
    mobile1: string;
  };
  asset_loan_detail?: {
    agrement_from_date: string;
    agrement_to_date: string;
    supplier: string;
  };
  depreciation_details?: {
    period: string;
    book_value_beginning: number;
    depreciation: number;
    book_value_end: number;
  }[];
  asset_amcs?: any[];
  custom_fields?: any;
  floor?: { name: string };
  building?: { name: string };
  wing?: { name: string };
  area?: { name: string };
  pms_room?: { name: string };
  allocated_to?: string[]; // Added property
  asset_move_tos?: {
    from?: { location?: string };
    to?: { location?: string };
  }[];
  consumption_pms_asset_measures?: any[];
  non_consumption_pms_asset_measures?: any[];
  asset_type_category?: string; // <-- Added property to fix type error
  it_assets?: boolean;
}
type ExtraFieldsGrouped = {
  [group: string]: { field_name: string; field_value: string }[];
};

interface AssetInfoTabProps {
  asset: Asset & { extra_fields_grouped?: ExtraFieldsGrouped };
  assetId?: string | number;
  showEnable?: boolean;
}

const renderExtraFieldsGrouped = (
  asset: Asset & { extra_fields_grouped?: ExtraFieldsGrouped }
) => {
  if (!asset.extra_fields_grouped) return null;
  return Object.entries(asset.extra_fields_grouped).map(([group, fields]) => (
    <div key={group} className="bg-white rounded-lg shadow-sm border mb-6">
      <div className="px-6 py-4 border-b font-semibold text-[#C72030] text-lg capitalize">
        {group
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())}
      </div>
      <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {fields.map((field, idx) => (
          <div key={idx} className="flex flex-col">
            <span className="text-sm text-gray-500 mb-1">
              {field.field_name
                .replace(/_/g, " ")
                .replace(/^./, (str) => str.toUpperCase())}
            </span>
            <span className="font-medium text-gray-800">
              {field.field_value || "-"}
            </span>
          </div>
        ))}
      </div>
    </div>
  ));
};

export const AssetInfoTab: React.FC<AssetInfoTabProps> = ({
  asset,
  assetId,
  showEnable,
}) => {
  return (
    <div className="min-h-full ">
      <Tabs defaultValue="analytics" style={{ width: "100%" }}>
        <TabsList className="w-full mb-6">
          <TabsTrigger
            value="analytics"
            className="w-full data-[state=active]:bg-[#EDEAE3] bg-[#FFFFFF] data-[state=active]:text-[#C72030] text-black"
          >
            <svg
              width="16"
              height="15"
              viewBox="0 0 16 15"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
            >
              <path
                d="M7.66681 11.6106C6.59669 11.5192 5.69719 11.0831 4.96831 10.3024C4.23944 9.52162 3.875 8.5875 3.875 7.5C3.875 6.35413 4.27606 5.38019 5.07819 4.57819C5.88019 3.77606 6.85413 3.375 8 3.375C9.0875 3.375 10.0216 3.73825 10.8024 4.46475C11.5831 5.19112 12.0192 6.08944 12.1106 7.15969L10.9179 6.80625C10.7557 6.13125 10.4066 5.57812 9.87031 5.14688C9.33419 4.71563 8.71075 4.5 8 4.5C7.175 4.5 6.46875 4.79375 5.88125 5.38125C5.29375 5.96875 5 6.675 5 7.5C5 8.2125 5.21681 8.8375 5.65044 9.375C6.08406 9.9125 6.636 10.2625 7.30625 10.425L7.66681 11.6106ZM8.56681 14.5946C8.47231 14.6149 8.37788 14.625 8.2835 14.625H8C7.01438 14.625 6.08812 14.438 5.22125 14.064C4.35437 13.69 3.60031 13.1824 2.95906 12.5413C2.31781 11.9002 1.81019 11.1463 1.43619 10.2795C1.06206 9.41275 0.875 8.48669 0.875 7.50131C0.875 6.51581 1.062 5.5895 1.436 4.72237C1.81 3.85525 2.31756 3.101 2.95869 2.45962C3.59981 1.81825 4.35375 1.31044 5.2205 0.936187C6.08725 0.562062 7.01331 0.375 7.99869 0.375C8.98419 0.375 9.9105 0.562062 10.7776 0.936187C11.6448 1.31019 12.399 1.81781 13.0404 2.45906C13.6818 3.10031 14.1896 3.85437 14.5638 4.72125C14.9379 5.58812 15.125 6.51438 15.125 7.5V7.77975C15.125 7.873 15.1149 7.96631 15.0946 8.05969L14 7.725V7.5C14 5.825 13.4187 4.40625 12.2563 3.24375C11.0938 2.08125 9.675 1.5 8 1.5C6.325 1.5 4.90625 2.08125 3.74375 3.24375C2.58125 4.40625 2 5.825 2 7.5C2 9.175 2.58125 10.5938 3.74375 11.7563C4.90625 12.9187 6.325 13.5 8 13.5H8.225L8.56681 14.5946ZM14.1052 14.7332L10.7043 11.325L9.88944 13.7884L8 7.5L14.2884 9.38944L11.825 10.2043L15.2332 13.6052L14.1052 14.7332Z"
                fill="#currentColor"
              />
            </svg>
            Analytics
          </TabsTrigger>
          <TabsTrigger
            value="assetDetails"
            className="w-full data-[state=active]:bg-[#EDEAE3] bg-[#FFFFFF] data-[state=active]:text-[#C72030] text-black"
          >
            <svg
              width="18"
              height="19"
              viewBox="0 0 18 19"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.875 4.25L3 5.375L5.25 3.125M1.875 9.5L3 10.625L5.25 8.375M1.875 14.75L3 15.875L5.25 13.625M7.875 9.5H16.125M7.875 14.75H16.125M7.875 4.25H16.125"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Asset Details
          </TabsTrigger>
        </TabsList>

        {/* Asset Details - Full Width */}
        <TabsContent value="assetDetails" className="space-y-8 ">
          {showEnable ? (
            <>
              {asset?.asset_image?.document && (
                <div className="w-full bg-white rounded-lg shadow-sm border">
                  <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                      <CreditCard
                        className="w-8 h-8 "
                        style={{ color: "#C72030" }}
                      />
                    </div>
                    <h3 className="text-lg font-semibold uppercase text-black">
                      Asset Image
                    </h3>
                  </div>
                  <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-6 flex items-center justify-center">
                    <img
                      src={asset.asset_image.document}
                      alt={asset.asset_image.document_name || "Asset Image"}
                      className="max-h-[200px] max-w-full w-auto h-auto rounded-md shadow object-contain"
                    />
                  </div>
                </div>
              )}
              {/* {Object.entries(asset.extra_fields_grouped).map(
                ([groupName, fields]) => (
                  <div className="w-full bg-white rounded-lg shadow-sm border">
                    <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                      <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3]">
                        <CreditCard
                          className="w-8 h-8 "
                          style={{ color: "#C72030" }}
                        />
                      </div>
                      <h3 className="text-lg font-semibold uppercase text-black">
                        {groupName}
                      </h3>
                    </div>

                    <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-6 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8 pl-4">
                        {fields.map((field, idx) => (
                          <div key={idx} className="text-sm text-gray-800">
                            <span className="text-gray-500">
                              {field.field_name}:
                            </span>{" "}
                            {field.field_value}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              )} */}
              {Object.entries(asset.extra_fields_grouped).map(
                ([groupName, fields]) => (
                  <div
                    key={groupName}
                    className="w-full bg-white rounded-lg shadow-sm border"
                  >
                    <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                        <CreditCard
                          className="w-8 h-8"
                          style={{ color: "#C72030" }}
                        />
                      </div>
                      <h3 className="text-lg font-semibold uppercase text-black">
                        {groupName}
                      </h3>
                    </div>

                    <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-6 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8 pl-4">
                        {fields.map((field, idx) => (
                          <div key={idx} className="text-sm text-gray-800">
                            <span className="text-gray-500">
                              {field.field_name}:
                            </span>{" "}
                            {field.field_value}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              )}

              {asset.asset_move_tos?.length > 0 &&
                asset.asset_move_tos[0]?.from?.location &&
                asset.asset_move_tos[0]?.to?.location && (
                  <div className="flex flex-col lg:flex-row gap-6 mt-6">
                    <div className="w-full bg-white rounded-lg shadow-sm border">
                      <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                          <TrendingUp
                            className="w-6 h-6"
                            style={{ color: "#C72030" }}
                          />
                        </div>
                        <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                          Movement Details
                        </h3>
                      </div>

                      <div className="py-[31px] bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] px-6">
                        <div className="relative w-full px-4">
                          <div
                            className="flex flex-col items-center w-full relative"
                            style={{ minHeight: "56px" }}
                          >
                            <div className="flex w-full items-center justify-between relative">
                              {/* From Site */}
                              <div className="flex flex-col items-center w-1/2 text-left">
                                <div className="text-xs text-gray-500 mb-2 ml-1">
                                  From Site
                                </div>
                                <div className="w-[14px] h-[14px] rounded-full bg-[#C72030] z-10 mt-[2px]" />
                              </div>

                              {/* Line */}
                              <div className="absolute top-[32px] left-[25%] right-[25%] h-0.5 bg-[#C72030] z-0" />

                              {/* To Site */}
                              <div className="flex flex-col items-center w-1/2 text-right">
                                <div className="text-xs text-gray-500 mb-2 mr-1">
                                  To Site
                                </div>
                                <div className="w-[14px] h-[14px] rounded-full bg-[#C72030] z-10" />
                              </div>
                            </div>

                            {/* Values */}
                            <div className="flex w-[80%] mx-auto justify-between mt-6">
                              <div className="text-sm font-medium text-[#1A1A1A] break-words px-2 w-1/2 text-left">
                                {asset.asset_move_tos[0].from.location || "NA"}
                              </div>
                              <div className="text-sm font-medium text-[#1A1A1A] break-words px-2 w-1/2 text-right">
                                {asset.asset_move_tos[0].to.location || "NA"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </>
          ) : (
            <>
              <div className="w-full bg-white rounded-lg shadow-sm border">
                {/* Header */}
                <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                  <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3]">
                    <Settings
                      className="w-6 h-6 "
                      style={{ color: "#C72030" }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                    Asset Details
                  </h3>
                </div>

                {/* Body */}
                <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-6 space-y-8 text-sm text-gray-800">
                  {/* Asset Details */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                    {/* Left Section - Asset Info */}
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
                      {/* Asset No */}
                      <div className="flex items-start">
                        <span className="w-28 text-gray-500 text-sm">
                          Asset No
                        </span>
                        <span className="mx-2 text-gray-500">:</span>
                        <span className="font-semibold text-black">
                          {asset.asset_number || "-"}
                        </span>
                      </div>

                      {/* Series No */}
                      <div className="flex items-start">
                        <span className="w-28 text-gray-500 text-sm">
                          Series No
                        </span>
                        <span className="mx-2 text-gray-500">:</span>
                        <span className="font-semibold text-black">
                          {asset.serial_number || "-"}
                        </span>
                      </div>

                      {/* Group */}
                      <div className="flex items-start">
                        <span className="w-28 text-gray-500 text-sm">
                          Group
                        </span>
                        <span className="mx-2 text-gray-500">:</span>
                        <span className="font-semibold text-black">
                          {asset.group || "-"}
                        </span>
                      </div>

                      {/* Model No */}
                      <div className="flex items-start">
                        <span className="w-28 text-gray-500 text-sm">
                          Model No
                        </span>
                        <span className="mx-2 text-gray-500">:</span>
                        <span className="font-semibold text-black">
                          {asset.model_number || "-"}
                        </span>
                      </div>

                      {/* Sub Group */}
                      <div className="flex items-start">
                        <span className="w-28 text-gray-500 text-sm">
                          Sub Group
                        </span>
                        <span className="mx-2 text-gray-500">:</span>
                        <span className="font-semibold text-black">
                          {asset.sub_group || "-"}
                        </span>
                      </div>

                      {/* Manufacturer */}
                      <div className="flex items-start">
                        <span className="w-28 text-gray-500 text-sm">
                          Manufacturer
                        </span>
                        <span className="mx-2 text-gray-500">:</span>
                        <span className="font-semibold text-black">
                          {asset.manufacturer || "-"}
                        </span>
                      </div>

                      {/* Allocation Based On */}
                      <div className="flex items-start">
                        <span className="w-28 text-gray-500 text-sm">
                          Allocation Based On
                        </span>
                        <span className="mx-2 text-gray-500">:</span>
                        <span className="font-semibold text-black">
                          {asset.allocation_type || "-"}
                        </span>
                      </div>

                      {/* Commissioning Date */}
                      <div className="flex items-start">
                        <span className="w-28 text-gray-500 text-sm">
                          Commissioning Date
                        </span>
                        <span className="mx-2 text-gray-500">:</span>
                        <span className="font-semibold text-black">
                          {asset.commisioning_date || "-"}
                        </span>
                      </div>

                      {/* Department */}
                      <div className="flex items-start">
                        <span className="w-28 text-gray-500 text-sm">
                          Department
                        </span>
                        <span className="mx-2 text-gray-500">:</span>
                        <span className="font-semibold text-black">
                          {asset.allocated_to?.join(", ") || "-"}
                        </span>
                      </div>

                      {/* Asset Details Extra Fields */}
                      {asset.extra_fields_grouped?.["Asset Details"]?.map(
                        (field, idx) => (
                          <div key={idx} className="flex items-start">
                            <span className="w-28 text-gray-500 text-sm">
                              {field.field_name
                                .replace(/_/g, " ")
                                .replace(/^./, (str) => str.toUpperCase())}
                            </span>
                            <span className="mx-2 text-gray-500">:</span>
                            <span className="font-semibold text-black">
                              {field.field_value || "-"}
                            </span>
                          </div>
                        )
                      )}
                    </div>

                    {/* Right Section - Image */}
                    <div className="lg:col-span-1 flex justify-end">
                      <div className="w-64 h-48 border border-gray-300 rounded-lg bg-white flex items-center justify-center overflow-hidden relative">
                        {asset.asset_image?.document || asset.image_url ? (
                          <img
                            src={asset.asset_image?.document || asset.image_url}
                            alt={
                              asset.asset_image?.document_name || "Asset Image"
                            }
                            className="max-w-full max-h-full object-contain rounded-lg"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              const fallback = e.currentTarget
                                .nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = "flex";
                            }}
                          />
                        ) : null}

                        {/* Fallback when image is not available */}
                        <div
                          className={`absolute inset-0 ${asset.asset_image?.document || asset.image_url
                            ? "hidden"
                            : "flex"
                            } flex-col items-center justify-center text-gray-400 text-sm`}
                        >
                          <Box className="w-12 h-12 mb-2" />
                          <span>No Image Available</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* System Details */}
                  {
                    asset.it_assets && (
                      <div className="border-t pt-8">
                        <div className="text-lg font-semibold text-black-600 mb-6">
                          System Details
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          <div className="flex items-start">
                            <span className="w-20 text-gray-500 text-sm">
                              IT Type
                            </span>
                            <span className="mx-2 text-gray-500">:</span>
                            <span className="font-semibold text-black">
                              {asset.custom_fields?.system_details?.it_type ||
                                asset.asset_type_category ||
                                "-"}
                            </span>
                          </div>
                          <div className="flex items-start">
                            <span className="w-20 text-gray-500 text-sm">OS</span>
                            <span className="mx-2 text-gray-500">:</span>
                            <span className="font-semibold text-black">
                              {asset.custom_fields?.system_details?.os ||
                                asset.asset_number ||
                                "-"}
                            </span>
                          </div>
                          <div className="flex items-start">
                            <span className="w-20 text-gray-500 text-sm">
                              Total Memory
                            </span>
                            <span className="mx-2 text-gray-500">:</span>
                            <span className="font-semibold text-black">
                              {asset.custom_fields?.system_details?.memory || "-"}
                            </span>
                          </div>
                          <div className="flex items-start">
                            <span className="w-20 text-gray-500 text-sm">
                              Processor
                            </span>
                            <span className="mx-2 text-gray-500">:</span>
                            <span className="font-semibold text-black">
                              {asset.custom_fields?.system_details?.processor ||
                                "-"}
                            </span>
                          </div>
                          {asset.extra_fields_grouped?.["System Details"] &&
                            asset.extra_fields_grouped?.["System Details"]?.map(
                              (field, index) => (
                                <div
                                  className="flex items-start"
                                  key={`system-detail-${index}`}
                                >
                                  <span className="w-20 text-gray-500 text-sm">
                                    {field.field_name}
                                  </span>
                                  <span className="mx-2 text-gray-500">:</span>
                                  <span className="font-semibold text-black">
                                    {field.field_value}
                                  </span>
                                </div>
                              )
                            )}
                        </div>
                      </div>
                    )
                  }

                  {/* Hard Disk Details */}
                  {
                    asset.it_assets && (
                      <div className="border-t pt-8">
                        <div className="text-lg font-semibold text-black-600 mb-6">
                          Hard Disk Details
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          <div className="flex items-start">
                            <span className="w-20 text-gray-500 text-sm">
                              Model
                            </span>
                            <span className="mx-2 text-gray-500">:</span>
                            <span className="font-semibold text-black">
                              {asset.custom_fields?.hardware?.model || "-"}
                            </span>
                          </div>
                          <div className="flex items-start">
                            <span className="w-20 text-gray-500 text-sm">
                              Capacity
                            </span>
                            <span className="mx-2 text-gray-500">:</span>
                            <span className="font-semibold text-black">
                              {asset.custom_fields?.hardware?.capacity || "-"}
                            </span>
                          </div>

                          <div className="flex items-start">
                            <span className="w-20 text-gray-500 text-sm">
                              Serial No.
                            </span>
                            <span className="mx-2 text-gray-500">:</span>
                            <span className="font-semibold text-black">
                              {asset.custom_fields?.hardware?.serial_no || "-"}
                            </span>
                          </div>

                          {asset.extra_fields_grouped?.["Hardware Details"] &&
                            asset.extra_fields_grouped?.["Hardware Details"]?.map(
                              (field, index) => (
                                <div
                                  className="flex items-start"
                                  key={`hardware-detail-${index}`}
                                >
                                  <span className=" text-gray-500 text-sm">
                                    {field.field_name}
                                  </span>
                                  <span className="mx-2 text-gray-500">:</span>
                                  <span className="font-semibold text-black">
                                    {field.field_value}
                                  </span>
                                </div>
                              )
                            )}
                        </div>
                      </div>
                    )
                  }
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                {/* Movement Details */}
                <div className="w-full bg-white rounded-lg shadow-sm border">
                  {/* Header */}
                  <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                    <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3]">
                      <TrendingUp
                        className="w-6 h-6"
                        style={{ color: "#C72030" }}
                      />
                    </div>
                    <h3 className="text-lg font-semibold uppercase text-[#1A1A1A ]">
                      Movement Details
                    </h3>
                  </div>

                  {/* Body */}
                  <div className="py-[31px] bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] px-6">
                    {/* Timeline with two dots */}
                    <div className="relative w-full px-4">
                      <div
                        className="flex flex-col items-center w-full relative"
                        style={{ minHeight: "56px" }}
                      >
                        <div className="flex w-full items-center justify-between relative">
                          {/* From Site */}
                          <div className="flex flex-col items-center w-1/2 text-left">
                            <div className="text-xs text-gray-500 mb-2 ml-1">
                              From Site
                            </div>
                            <div className="w-[14px] h-[14px] rounded-full bg-[#C72030] z-10 mt-[2px]" />
                          </div>

                          {/* Line */}
                          <div className="absolute top-[32px] left-[25%] right-[25%] h-0.5 bg-[#C72030] z-0" />

                          {/* To Site */}
                          <div className="flex flex-col items-center w-1/2 text-right">
                            <div className="text-xs text-gray-500 mb-2 mr-1">
                              To Site
                            </div>
                            <div className="w-[14px] h-[14px] rounded-full bg-[#C72030] z-10" />
                          </div>
                        </div>

                        {/* Values */}
                        <div className="flex w-[80%] mx-auto justify-between mt-6">
                          <div className="text-sm font-medium text-[#1A1A1A] break-words px-2 w-1/2 text-left">
                            {asset.asset_move_tos?.[0]?.from?.location || "NA"}
                          </div>
                          <div className="text-sm font-medium text-[#1A1A1A] break-words px-2 w-1/2 text-right">
                            {asset.asset_move_tos?.[0]?.to?.location || "NA"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-full bg-white rounded-lg shadow-sm border">
                  {/* Header */}
                  <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                    <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3]">
                      <MapPin
                        className="w-6 h-6 text-white"
                        style={{ color: "#C72030" }}
                      />
                    </div>
                    <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                      Location Details
                    </h3>
                  </div>

                  {/* Body */}
                  <div className="py-[31px] bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-6">
                    {/* Timeline */}
                    <div className="relative w-full px-4">
                      {/* Connecting Line */}
                      <div
                        className="absolute top-[38px] left-0 right-0 h-0.5 bg-[#C72030] z-0"
                        style={{
                          left: `calc(9%)`,
                          right: `calc(9%)`,
                        }}
                      />

                      <div className="flex justify-between items-start relative z-10">
                        {[
                          { label: "Site", value: asset.site_name || "NA" },
                          {
                            label: "Building",
                            value: asset.building?.name || "NA",
                          },
                          { label: "Wing", value: asset.wing?.name || "NA" },
                          { label: "Floor", value: asset.floor?.name || "NA" },
                          { label: "Area", value: asset.area?.name || "NA" },
                          {
                            label: "Room",
                            value: asset.pms_room?.name || "NA",
                          },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center w-full text-center"
                          >
                            {/* Label above dot */}
                            <div className="text-sm text-gray-500 mb-2 mt-1">
                              {item.label}
                            </div>

                            {/* Dot */}
                            <div className="w-[14px] h-[14px] rounded-full bg-[#C72030] z-10 mt-1" />

                            {/* Value below dot */}
                            <div className="mt-2 text-base font-medium text-[#1A1A1A] break-words px-2">
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consumption Details */}
              {asset.consumption_pms_asset_measures?.length > 0 && (
                <div className="w-full bg-white rounded-lg shadow-sm border">
                  {/* Header */}
                  <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                      <TrendingUp
                        className="w-6 h-6"
                        style={{ color: "#C72030" }}
                      />
                    </div>
                    <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                      CONSUMPTION DETAILS
                    </h3>
                  </div>

                  {/* Body */}
                  <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-gray-600 font-medium">
                            Name
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium">
                            Min
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium">
                            Max
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium">
                            Alert Below
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium">
                            Alert Above
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium">
                            Multiplier
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium">
                            Check Prev Reading
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {asset.consumption_pms_asset_measures.map(
                          (item: any) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.name || "N/A"}</TableCell>
                              <TableCell>{item.min_value || "N/A"}</TableCell>
                              <TableCell>{item.max_value || "N/A"}</TableCell>
                              <TableCell>{item.alert_below || "N/A"}</TableCell>
                              <TableCell>{item.alert_above || "N/A"}</TableCell>
                              <TableCell>
                                {item.multiplier_factor ?? "-"}
                              </TableCell>
                              <TableCell>
                                {item.check_previous_reading ? "Yes" : "No"}
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* Non-Consumption Details */}
              {asset.non_consumption_pms_asset_measures?.length > 0 && (
                <div className="w-full bg-white rounded-lg shadow-sm border">
                  {/* Header */}
                  <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                      <X className="w-6 h-6" style={{ color: "#C72030" }} />
                    </div>
                    <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                      NON-CONSUMPTION DETAILS
                    </h3>
                  </div>

                  {/* Body */}
                  <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-gray-600 font-medium">
                            Name
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium">
                            Min
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium">
                            Max
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium">
                            Alert Below
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium">
                            Alert Above
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium">
                            Multiplier
                          </TableHead>
                          <TableHead className="text-gray-600 font-medium">
                            Check Prev Reading
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {asset.non_consumption_pms_asset_measures.map(
                          (item: any) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.name || "N/A"}</TableCell>
                              <TableCell>{item.min_value || "N/A"}</TableCell>
                              <TableCell>{item.max_value || "N/A"}</TableCell>
                              <TableCell>{item.alert_below || "N/A"}</TableCell>
                              <TableCell>{item.alert_above || "N/A"}</TableCell>
                              <TableCell>
                                {item.multiplier_factor ?? "-"}
                              </TableCell>
                              <TableCell>
                                {item.check_previous_reading ? "Yes" : "No"}
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* Purchase Details - Full Width */}

              <div className="w-full bg-white rounded-lg shadow-sm border">
                {/* Header */}
                <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                  <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3]">
                    <CreditCard
                      className="w-6 h-6 "
                      style={{ color: "#C72030" }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                    Purchase Details
                  </h3>
                </div>

                {/* Body */}
                <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8 text-sm text-gray-800">
                    <div className="flex">
                      <span className="text-gray-500 w-32">Purchase Cost</span>
                      <span className="mx-2 text-gray-500">:</span>
                      <span className="font-medium">
                        {localStorage.getItem("currency")}{" "}
                        {asset.purchase_cost?.toLocaleString() || "-"}
                      </span>
                    </div>

                    <div className="flex">
                      <span className="text-gray-500 w-32">
                        Current Book Value
                      </span>
                      <span className="mx-2 text-gray-500">:</span>
                      <span className="font-medium">
                        {localStorage.getItem("currency")}{" "}
                        {asset.current_book_value?.toLocaleString() || "-"} (
                        {asset.depreciation_method || "-"})
                      </span>
                    </div>

                    <div className="flex">
                      <span className="text-gray-500 w-32">Purchase Date</span>
                      <span className="mx-2 text-gray-500">:</span>
                      <span className="font-medium">
                        {asset.purchased_on || "-"}
                      </span>
                    </div>

                    <div className="flex">
                      <span className="text-gray-500 w-32">Under Warranty</span>
                      <span className="mx-2 text-gray-500">:</span>
                      <span className="font-medium">
                        {asset.warranty ? "Yes" : "No"}
                      </span>
                    </div>

                    <div className="flex">
                      <span className="text-gray-500 w-32">
                        Warranty Period
                      </span>
                      <span className="mx-2 text-gray-500">:</span>
                      <span className="font-medium">
                        {asset.warranty_period
                          ? `${asset.warranty_period} year(s)`
                          : "-"}
                      </span>
                    </div>

                    <div className="flex">
                      <span className="text-gray-500 w-32">
                        Warranty Expiry
                      </span>
                      <span className="mx-2 text-gray-500">:</span>
                      <span className="font-medium">
                        {asset.warranty_expiry || "-"}
                      </span>
                    </div>

                    {/* Purchase Details Extra Fields */}
                    {asset.extra_fields_grouped?.["Purchase Details"]?.map(
                      (field, idx) => (
                        <div key={idx} className="flex">
                          <span className="text-gray-500 w-32">
                            {field.field_name
                              .replace(/_/g, " ")
                              .replace(/^./, (str) => str.toUpperCase())}
                          </span>
                          <span className="mx-2 text-gray-500">:</span>
                          <span className="font-medium">
                            {field.field_value || "-"}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Asset Loaned and Vendor Contact Details Side by Side */}
              <div className="flex gap-6">
                {/* Asset Loaned - 50% width */}
                <div className="w-1/2 bg-white rounded-lg shadow-sm border">
                  {/* Header */}
                  <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                    <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3]">
                      <UserCheck
                        className="w-6 h-6 "
                        style={{ color: "#C72030" }}
                      />
                    </div>
                    <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                      Asset Loaned
                    </h3>
                  </div>

                  {/* Body */}
                  <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-6">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-8 pl-4">
                      <div className="text-sm text-gray-800">
                        <span className="text-gray-500">Vendor:</span>{" "}
                        {asset.asset_loan_detail?.supplier || "-"}
                      </div>
                      <div className="text-sm text-gray-800">
                        <span className="text-gray-500">Agreement From:</span>{" "}
                        {asset.asset_loan_detail?.agrement_from_date || "-"}
                      </div>
                      <div className="text-sm text-gray-800">
                        <span className="text-gray-500">Agreement To:</span>{" "}
                        {asset.asset_loan_detail?.agrement_to_date || "-"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vendor Contact Details - 50% width */}
                <div className="w-1/2 bg-white rounded-lg shadow-sm border">
                  {/* Header */}
                  <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                    <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3]">
                      <User className="w-6 h-6 " style={{ color: "#C72030" }} />
                    </div>
                    <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                      Vendor Contact Details
                    </h3>
                  </div>

                  {/* Body */}
                  <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-6">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-8 pl-4">
                      <div className="text-sm text-gray-800 gap-x-2">
                        <span className="text-gray-500">Name:</span>{" "}
                        {asset.supplier_detail?.company_name || "-"}
                      </div>
                      <div className="text-sm text-gray-800 gap-x-2">
                        <span className="text-gray-500">Mobile No:</span>{" "}
                        {asset.supplier_detail?.mobile1 || "-"}
                      </div>
                      <div className="text-sm text-gray-800 gap-x-2">
                        <span className="text-gray-500">Email ID:</span>{" "}
                        {asset.supplier_detail?.email || "-"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <AssetAnalyticsTab asset={asset} assetId={assetId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
