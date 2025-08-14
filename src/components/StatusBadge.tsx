import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { API_CONFIG, getAuthHeader } from "@/config/apiConfig";

interface StatusBadgeProps {
  status: string;
  assetId: string | number;
  onStatusUpdate?: () => void; // Callback to refresh data
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  assetId,
  onStatusUpdate
}) => {
  const [currentStatus, setCurrentStatus] = useState<string>(status);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setCurrentStatus(status)
  }, [status])

  const statusOptions = [
    { value: "in_use", label: "In Use" },
    { value: "breakdown", label: "Breakdown" },
    { value: "in_storage", label: "In Store" },
    { value: "disposed", label: "Disposed" },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "in_use":
      case "in use":
        return "bg-[#DBC2A9] text-[#1A1A1A]"; // active usage → warm beige
      case "breakdown":
        return "bg-[#E4626F] text-[#1A1A1A]"; // breakdown → red/coral
      case "in_storage":
      case "in store":
        return "bg-[#C4B89D] text-[#1A1A1A]"; // in store → calm sand
      case "disposed":
        return "bg-[#D5DbDB] text-[#1A1A1A]"; // disposed → neutral light gray
      default:
        return "bg-[#AAB9C5] text-[#1A1A1A]"; // fallback → soft gray-blue
    }
  };

  const formatStatusLabel = (status: string): string => {
    switch (status.toLowerCase()) {
      case "in_use":
        return "In Use";
      case "in_storage":
        return "In Store";
      case "breakdown":
        return "Breakdown";
      case "disposed":
        return "Disposed";
      default:
        return status;
    }
  };

  const updateAssetStatus = async (newStatus: string) => {
    if (newStatus === currentStatus) return;

    setIsUpdating(true);

    try {
      const body = {
        pms_asset: {
          status: newStatus === "breakdown" ? newStatus : newStatus,
          breakdown:
            newStatus === "in_use"
              ? "false"
              : newStatus === "breakdown"
                ? "true"
                : "",
        },
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/assets/${assetId}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader(),
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Failed to update asset status');
      }

      // Fetch the updated asset data
      const updatedAssetResponse = await fetch(`${API_CONFIG.BASE_URL}/pms/assets/${assetId}.json`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader(),
        },
      });

      if (updatedAssetResponse.ok) {
        const updatedAssetData = await updatedAssetResponse.json();
        setCurrentStatus(updatedAssetData.status || newStatus);
      } else {
        setCurrentStatus(newStatus);
      }

      // Call the callback to refresh table data
      if (onStatusUpdate) {
        onStatusUpdate();
      }

      console.log('Asset status updated successfully');
    } catch (error) {
      console.error('Error updating asset status:', error);
      alert('Failed to update asset status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`${getStatusColor(
            currentStatus
          )} inline-flex items-center justify-center text-xs px-2 py-2 rounded-sm font-medium w-32 text-center h-auto hover:opacity-80 disabled:opacity-50`}
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : formatStatusLabel(currentStatus)}
          <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-32">
        {statusOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => updateAssetStatus(option.value)}
            className={`cursor-pointer ${getStatusColor(option.value)} rounded-sm mb-1 ${currentStatus.toLowerCase() === option.value.toLowerCase()
                ? "ring-2 ring-gray-400"
                : ""
              }`}
          >
            <span className="w-full text-center">{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
