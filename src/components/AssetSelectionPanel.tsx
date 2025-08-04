import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  RotateCcw,
  Trash2,
  QrCode,
  LogIn,
  X,
  Users,
  Package,
  Download,
  Loader2,
} from "lucide-react";
import { BASE_URL, getAuthHeader } from "@/config/apiConfig";
import { useToast } from "@/hooks/use-toast";

interface Asset {
  id: string;
  name: string;
}

interface AssetSelectionPanelProps {
  selectedCount: number;
  selectedAssets: Asset[];
  onMoveAsset: () => void;
  onDisposeAsset: () => void;
  onPrintQRCode: () => void;
  onCheckIn: () => void;
  onClearSelection: () => void;
}

export const AssetSelectionPanel: React.FC<AssetSelectionPanelProps> = ({
  selectedCount,
  selectedAssets,
  onMoveAsset,
  onDisposeAsset,
  onPrintQRCode,
  onCheckIn,
  onClearSelection,
}) => {
  const [showAll, setShowAll] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isPrintingQR, setIsPrintingQR] = useState(false);
  const { toast } = useToast();

  const handleClearClick = () => {
    console.log("X button clicked - clearing selection");
    onClearSelection();
  };

  const handleExport = async () => {
    if (selectedAssets.length === 0) {
      toast({
        title: "No assets selected",
        description: "Please select at least one asset to export.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);

    try {
      const params = {
        q: {
          id_in: selectedAssets.map((asset) => asset.id),
        },
      };

      const urlParams = new URLSearchParams();
      params.q.id_in.forEach((id) => {
        urlParams.append("q[id_in][]", id);
      });

      const url = `${BASE_URL}/pms/assets/assets_data_report.xlsx?${urlParams.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: getAuthHeader(),
          Accept:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Export failed: ${response.status} ${response.statusText}`
        );
      }

      const blob = await response.blob();

      // Create and trigger download
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "assets_data_report.xlsx";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      toast({
        title: "Export successful",
        description: `Successfully exported ${selectedAssets.length} asset(s) to Excel.`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to export assets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrintQRCode = async () => {
    if (selectedAssets.length === 0) {
      toast({
        title: "No assets selected",
        description: "Please select at least one asset to print QR codes.",
        variant: "destructive",
      });
      return;
    }

    setIsPrintingQR(true);

    try {
      const urlParams = new URLSearchParams();
      selectedAssets.forEach((asset) => {
        urlParams.append("asset_ids[]", asset.id);
      });

      const url = `${BASE_URL}/pms/assets/print_qr_codes?${urlParams.toString()}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: getAuthHeader(),
          Accept: "application/pdf",
        },
      });

      if (!response.ok) {
        throw new Error(
          `QR code generation failed: ${response.status} ${response.statusText}`
        );
      }

      const blob = await response.blob();

      // Create and trigger download
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "qr_codes.pdf";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      toast({
        title: "QR codes generated successfully",
        description: `Successfully generated QR codes for ${selectedAssets.length} asset(s).`,
      });
    } catch (error) {
      console.error("QR code generation error:", error);
      toast({
        title: "QR code generation failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to generate QR codes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPrintingQR(false);
    }
  };

  const getDisplayText = () => {
    if (selectedAssets.length === 0) return "";
    if (selectedAssets.length === 1) return selectedAssets[0].name;
    if (showAll) {
      return selectedAssets.map((asset) => asset.name).join(", ");
    }
    if (selectedAssets.length <= 6) {
      return selectedAssets.map((asset) => asset.name).join(", ");
    }
    return (
      <>
        {selectedAssets
          .slice(0, 6)
          .map((asset) => asset.name)
          .join(", ")}{" "}
        and{" "}
        <button
          onClick={() => setShowAll(true)}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {selectedAssets.length - 6} more
        </button>
      </>
    );
  };

  return (
    <div
      className="fixed bg-white border border-gray-200 rounded-sm shadow-lg z-50"
      style={{ top: "50%", left: "30%", width: "863px", height: "105px" }}
    >
      <div className="flex items-center justify-between w-full h-full pr-6">
        <div className="flex items-center gap-2">
          <div className="text-[#C72030] bg-[#C4B89D] rounded-lg w-[44px] h-[105px] flex items-center justify-center text-xs font-bold">
            {selectedCount}
          </div>
          <div className="flex flex-col justify-center px-3 py-2 flex-1">
            <span className="text-[16px] font-semibold text-[#1A1A1A] whitespace-nowrap leading-none">
              Selection
            </span>
            <span className="text-[12px] font-medium text-[#6B7280] break-words leading-tight">
              {getDisplayText()}
            </span>
          </div>
        </div>

        <div className="flex items-center ml-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMoveAsset}
            className="text-gray-600 hover:bg-gray-100 flex flex-col items-center gap-2 h-auto mr-5"
          >
            <svg
              className="w-6 h-6 mt-4 mb-2"
              viewBox="0 0 20 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.00195 16.3253L4.60195 14.927L7.17695 12.4001H0.00195312V10.4375H7.17695L4.60195 7.9106L6.00195 6.51224L11.002 11.4188L6.00195 16.3253ZM14.002 10.4375L9.00195 5.53093L14.002 0.62439L15.402 2.02275L12.827 4.54962H20.002V6.51224H12.827L15.402 9.0391L14.002 10.4375Z"
                fill="#1C1B1F"
              />
            </svg>
            <span className="text-xs font-medium">Move Asset</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onDisposeAsset}
            className="text-gray-600 hover:bg-gray-100 flex flex-col items-center gap-2 h-auto mr-5"
          >
            <svg
              className="w-6 h-6 mt-4"
              viewBox="0 0 16 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.4039 13.8926L8.0039 11.3412L10.6039 13.8926L12.0039 12.5187L9.4039 9.96733L12.0039 7.41593L10.6039 6.04209L8.0039 8.5935L5.4039 6.04209L4.0039 7.41593L6.6039 9.96733L4.0039 12.5187L5.4039 13.8926ZM3.0039 18.3084C2.45391 18.3084 1.98307 18.1163 1.59141 17.7319C1.19974 17.3476 1.00391 16.8856 1.00391 16.3458V3.58882H0.00390625V1.62621H5.0039V0.644897H11.0039V1.62621H16.0039V3.58882H15.0039V16.3458C15.0039 16.8856 14.8081 17.3476 14.4164 17.7319C14.0247 18.1163 13.5539 18.3084 13.0039 18.3084H3.0039ZM13.0039 3.58882H3.0039V16.3458H13.0039V3.58882Z"
                fill="#1C1B1F"
              />
            </svg>

            <span className="text-xs font-medium">Dispose Asset</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
            className="text-gray-600 hover:bg-gray-100 flex flex-col items-center gap-2 h-auto mr-5 disabled:opacity-50"
          >
            {isExporting ? (
              <Loader2 className="w-6 h-6 mt-4 animate-spin" />
            ) : (
              <svg
                className="w-6 h-6 mt-4"
                width="18"
                height="19"
                viewBox="0 0 18 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.039 13.2499L8.1 15.2817V6.80991C8.1 6.57561 8.19482 6.35092 8.3636 6.18525C8.53239 6.01958 8.7613 5.92651 9 5.92651C9.23869 5.92651 9.46761 6.01958 9.6364 6.18525C9.80518 6.35092 9.9 6.57561 9.9 6.80991V15.2817L11.961 13.2499C12.0447 13.1671 12.1442 13.1014 12.2539 13.0565C12.3636 13.0117 12.4812 12.9886 12.6 12.9886C12.7188 12.9886 12.8364 13.0117 12.9461 13.0565C13.0558 13.1014 13.1553 13.1671 13.239 13.2499C13.3234 13.332 13.3903 13.4297 13.436 13.5374C13.4817 13.645 13.5052 13.7605 13.5052 13.8771C13.5052 13.9937 13.4817 14.1092 13.436 14.2168C13.3903 14.3245 13.3234 14.4222 13.239 14.5043L9.639 18.0379C9.55341 18.1183 9.45248 18.1814 9.342 18.2234C9.12288 18.3118 8.87712 18.3118 8.658 18.2234C8.54752 18.1814 8.44659 18.1183 8.361 18.0379L4.761 14.5043C4.67709 14.4219 4.61052 14.3242 4.56511 14.2165C4.51969 14.1089 4.49632 13.9936 4.49632 13.8771C4.49632 13.7606 4.51969 13.6453 4.56511 13.5376C4.61052 13.43 4.67709 13.3322 4.761 13.2499C4.84491 13.1675 4.94454 13.1022 5.05418 13.0576C5.16382 13.013 5.28133 12.9901 5.4 12.9901C5.51867 12.9901 5.63618 13.013 5.74582 13.0576C5.85546 13.1022 5.95509 13.1675 6.039 13.2499ZM17.1 7.6933C16.8613 7.6933 16.6324 7.60023 16.4636 7.43456C16.2948 7.26889 16.2 7.0442 16.2 6.80991V3.27631C16.2 3.04202 16.1052 2.81733 15.9364 2.65166C15.7676 2.48599 15.5387 2.39292 15.3 2.39292H2.7C2.46131 2.39292 2.23239 2.48599 2.0636 2.65166C1.89482 2.81733 1.8 3.04202 1.8 3.27631V6.80991C1.8 7.0442 1.70518 7.26889 1.5364 7.43456C1.36761 7.60023 1.13869 7.6933 0.9 7.6933C0.661305 7.6933 0.432387 7.60023 0.263604 7.43456C0.0948211 7.26889 0 7.0442 0 6.80991V3.27631C0 2.57344 0.284464 1.89935 0.790812 1.40234C1.29716 0.905336 1.98392 0.626122 2.7 0.626122H15.3C16.0161 0.626122 16.7028 0.905336 17.2092 1.40234C17.7155 1.89935 18 2.57344 18 3.27631V6.80991C18 7.0442 17.9052 7.26889 17.7364 7.43456C17.5676 7.60023 17.3387 7.6933 17.1 7.6933Z"
                  fill="#1A1A1A"
                />
              </svg>
            )}

            <span className="text-xs font-medium">Export</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrintQRCode}
            disabled={isPrintingQR}
            className="text-gray-600 hover:bg-gray-100 flex flex-col items-center gap-2 h-auto mr-5 disabled:opacity-50"
          >
            {isPrintingQR ? (
              <Loader2 className="w-6 h-6 mt-4 animate-spin" />
            ) : (
              <svg
                className="w-6 h-6 mt-4"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="mask0_9_193"
                  style={{ maskType: "alpha" }}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="16"
                  height="16"
                >
                  <rect width="16" height="16" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_9_193)">
                  <path
                    d="M1.33203 4.20609V0.935059H4.66536V2.24347H2.66536V4.20609H1.33203ZM1.33203 14.0192V10.7481H2.66536V12.7108H4.66536V14.0192H1.33203ZM11.332 14.0192V12.7108H13.332V10.7481H14.6654V14.0192H11.332ZM13.332 4.20609V2.24347H11.332V0.935059H14.6654V4.20609H13.332ZM11.6654 11.0752H12.6654V12.0566H11.6654V11.0752ZM11.6654 9.11263H12.6654V10.0939H11.6654V9.11263ZM10.6654 10.0939H11.6654V11.0752H10.6654V10.0939ZM9.66536 11.0752H10.6654V12.0566H9.66536V11.0752ZM8.66536 10.0939H9.66536V11.0752H8.66536V10.0939ZM10.6654 8.13132H11.6654V9.11263H10.6654V8.13132ZM9.66536 9.11263H10.6654V10.0939H9.66536V9.11263ZM8.66536 8.13132H9.66536V9.11263H8.66536V8.13132ZM12.6654 2.89768V6.82291H8.66536V2.89768H12.6654ZM7.33203 8.13132V12.0566H3.33203V8.13132H7.33203ZM7.33203 2.89768V6.82291H3.33203V2.89768H7.33203ZM6.33203 11.0752V9.11263H4.33203V11.0752H6.33203ZM6.33203 5.8416V3.87898H4.33203V5.8416H6.33203ZM11.6654 5.8416V3.87898H9.66536V5.8416H11.6654Z"
                    fill="#1C1B1F"
                  />
                </g>
              </svg>
            )}
            <span className="text-xs font-medium">Print QR Code</span>
          </Button>

          {/* <Button
            size="sm"
            onClick={onCheckIn}
            className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2 px-4 py-2 h-auto font-bold text-xs"
          >
            <LogIn className="w-4 h-4" />
            <span>CHECK IN</span>
          </Button> */}

          <div className="w-px h-8 bg-gray-300 mr-5"></div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearClick}
            className="text-gray-600 hover:bg-gray-100"
            style={{ width: "44px", height: "44px" }}
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};
