import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin } from "lucide-react";

interface Asset {
  id: number;
  name: string;
  assetNumber?: string;
  status?: string;
  assetGroup?: string;
  assetSubGroup?: string;
  siteName?: string;
  building?: { name: string } | null;
  wing?: { name: string } | null;
  area?: { name: string } | null;
  model_number?: string;
  manufacturer?: string;
  warranty?: boolean;
  warranty_expiry?: string;
  breakdown_date?: string;
  created_by?: string;
  purchase_cost?: number;
  breakdown?: boolean;
  technical?: boolean;
  asset_type_category?: string;
  ownership_costs?: OwnershipCost[];
}

interface OwnershipCost {
  id: number;
  date: string;
  status: string;
  time: string;
  cost: number | null;
  warranty_in_month: string | null;
  asset_name: string | null;
  asset_id: number;
}

interface BreakdownHistory {
  id: number;
  date: string;
  time: string;
  aging: string;
  costSpent: string;
  attendeeName: string;
  status?: string;
  warranty_in_month?: string | null;
}

interface MobileAssetBreakdownProps {
  asset: Asset;
}

export const MobileAssetBreakdown: React.FC<MobileAssetBreakdownProps> = ({
  asset: initialAsset,
}) => {
  const navigate = useNavigate();
  const { assetId } = useParams();
  const [assetData, setAssetData] = useState<Asset>(initialAsset);
  const [breakdownHistory, setBreakdownHistory] = useState<BreakdownHistory[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [breakdownAge, setBreakdownAge] = useState<string>("");

  // Calculate breakdown age
  useEffect(() => {
    if (assetData.breakdown_date) {
      const breakdownDate = new Date(assetData.breakdown_date);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - breakdownDate.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(
        (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const diffMinutes = Math.floor(
        (diffTime % (1000 * 60 * 60)) / (1000 * 60)
      );
      setBreakdownAge(
        `${diffDays.toString().padStart(2, "0")}:${diffHours
          .toString()
          .padStart(2, "0")}:${diffMinutes.toString().padStart(2, "0")}`
      );
    }
  }, [assetData.breakdown_date]);

  // Fetch detailed asset data and breakdown information
  useEffect(() => {
    const fetchBreakdownDetails = async () => {
      const idToUse = assetId || initialAsset.id;

      if (!idToUse) return;

      setLoading(true);
      try {
        // Get the mobile token specifically
        const mobileToken = localStorage.getItem("mobile_token");
        if (!mobileToken) {
          throw new Error("Mobile token not found");
        }

        // Get base URL
        let baseUrl =
          localStorage.getItem("baseUrl") || "https://fm-uat-api.lockated.com";
        baseUrl = baseUrl.replace(/\/$/, "");
        if (!baseUrl.startsWith("http")) {
          baseUrl = `https://${baseUrl}`;
        }

        // Fetch asset details
        const assetResponse = await fetch(
          `${baseUrl}/pms/assets/${idToUse}.json`,
          {
            headers: {
              Authorization: `Bearer ${mobileToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (assetResponse.ok) {
          const assetApiData = await assetResponse.json();
          setAssetData(assetApiData.asset);

          // Convert ownership costs to breakdown history format
          if (
            assetApiData.asset.ownership_costs &&
            assetApiData.asset.ownership_costs.length > 0
          ) {
            const history = assetApiData.asset.ownership_costs.map(
              (cost: OwnershipCost) => ({
                id: cost.id,
                date: cost.date,
                aging: calculateAging(cost.date),
                costSpent: cost.cost ? `₹${cost.cost.toLocaleString()}` : "₹0",
                attendeeName:
                  cost.status === "Repaired"
                    ? "Repair Technician"
                    : "Replacement Team",
                status: cost.status,
                warranty_in_month: cost.warranty_in_month,
              })
            );

            setBreakdownHistory(history);
          } else {
            setBreakdownHistory([]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch breakdown details", error);
        // Use mock data as fallback
        setBreakdownHistory([
          {
            id: 1,
            date: "28/07/2025",
            time: "",
            aging: "1 day",
            costSpent: "₹15,000",
            attendeeName: "Repair Technician",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBreakdownDetails();
  }, [assetId, initialAsset.id]);

  // Helper function to calculate aging from date
  const calculateAging = (dateString: string, endDate?: string) => {
    if (!dateString) return "N/A";

    // Parse date in DD/MM/YYYY format
    const dateParts = dateString.split("/");
    if (dateParts.length !== 3) return "N/A";

    const start = new Date(
      parseInt(dateParts[2]),
      parseInt(dateParts[1]) - 1,
      parseInt(dateParts[0])
    );
    const end = endDate ? new Date(endDate) : new Date();
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day";
    return `${diffDays} days`;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleViewAsset = () => {
    const idToUse = assetId || assetData.id;
    navigate(`/mobile/assets/${idToUse}?action=details`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFCF9]">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            Breakdown Details
          </h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Breakdown Details Card */}
        <Card className="bg-[#F7F2E9] border border-[#F0ECE6] shadow-sm rounded-xl">
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between">
              <p className="text-sm text-gray-700">Criticality :</p>
              <Badge className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                Breakdown
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-black font-semibold">Asset Name</p>
              <p className="text-sm text-gray-700">{assetData.name}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">
                Group/Subgroup
              </p>
              <p className="text-sm text-gray-600">
                {assetData.assetGroup}
                {assetData.assetSubGroup && ` / ${assetData.assetSubGroup}`}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">
                Technical/Non-Technical
              </p>
              <p className="text-sm text-gray-600">
                {assetData.technical ? "Technical" : "Non-Technical"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">Warranty :</p>
              <p className="text-sm text-gray-600">
                {assetData.warranty
                  ? assetData.warranty_expiry
                    ? `Under Warranty (Expires: ${new Date(
                        assetData.warranty_expiry
                      ).toLocaleDateString()})`
                    : "Under Warranty"
                  : "No Warranty"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">
                Model and Manufacturer :
              </p>
              <p className="text-sm text-gray-600">
                {assetData.model_number
                  ? `Model ${assetData.model_number}`
                  : ""}
                {assetData.model_number && assetData.manufacturer ? ", " : ""}
                {assetData.manufacturer || "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Created On:</p>
              <p className="text-sm text-gray-600">
                {formatDate(assetData.breakdown_date || "")}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">Assignee Name</p>
              <p className="text-sm text-gray-600">
                {assetData.created_by || "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">
                Vendor e-mail sent :
              </p>
              <p className="text-sm text-gray-600">Yes</p>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="bg-[#F7F2E9] border border-[#F0ECE6] shadow-sm rounded-xl">
          <CardContent className="p-4 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">
              {assetData.siteName || "Sumer Kendra, Worli (W), 400018"}
              {assetData.building?.name && `, ${assetData.building.name}`}
              {assetData.wing?.name && `, ${assetData.wing.name}`}
              {assetData.area?.name && `, ${assetData.area.name}`}
            </span>
          </CardContent>
        </Card>

        {/* View Asset Button */}
        <Button
          onClick={handleViewAsset}
          className="w-full border border-red-500 text-red-600 bg-white rounded-lg hover:bg-red-50"
          variant="outline"
        >
          View Asset
        </Button>

        {/* Previous Breakdown */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Previous breakdown
          </h2>

          {breakdownHistory.length > 0 ? (
            breakdownHistory.map((breakdown) => (
              <Card
                key={breakdown.id}
                className="bg-[#FFFBF5] border border-[#EFE8DB] rounded-xl shadow-sm"
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Breakdown Date
                      </p>
                      <p className="text-sm text-gray-600">{breakdown.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">DD:HH:MM</p>
                      <p className="text-sm font-medium">{breakdown.time || "00:00:00"}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Aging</p>
                    <p className="text-sm text-gray-600">{breakdown.aging}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Cost Spend :
                    </p>
                    <p className="text-sm text-gray-600 font-medium">
                      {breakdown.costSpent}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Attendee Name :
                    </p>
                    <p className="text-sm text-gray-600">
                      {breakdown.attendeeName}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No previous breakdown history</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
