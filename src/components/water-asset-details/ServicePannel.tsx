import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { BASE_URL, getAuthHeader } from "@/config/apiConfig";
import { useToast } from "@/hooks/use-toast";

interface Asset {
  id: string;
  name: string;
}

interface AssetSelectionPanelProps {
  selectedCount: number;
  selectedAssets: Asset[];
  onPrintQRCode: () => void;
  onClearSelection: () => void;
}

export const ServicePannel: React.FC<AssetSelectionPanelProps> = ({
  selectedCount,
  selectedAssets,
  onPrintQRCode,
  onClearSelection,
}) => {
  const [showAll, setShowAll] = useState(false);
  const [isPrintingQR, setIsPrintingQR] = useState(false);
  const { toast } = useToast();

  const handleClearClick = () => {
    onClearSelection();
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
      style={{ top: "477px", left: "629px", width: "863px", height: "105px" }}
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

        <div className="flex items-center">
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
