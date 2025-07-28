import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin } from "lucide-react";

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
  activities?: Activity[];
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

  // Get breakdown date from activities or fallback to breakdown_date
  const getBreakdownDate = useCallback((): string | null => {
    if (assetData.activities) {
      // Find the latest activity where breakdown changed to true
      const breakdownActivity = assetData.activities
        .filter(activity => 
          activity.parameters.breakdown && 
          activity.parameters.breakdown[1] === true &&
          activity.parameters.breakdown_date &&
          activity.parameters.breakdown_date[1] // Use the new breakdown date
        )
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
      
      if (breakdownActivity && breakdownActivity.parameters.breakdown_date) {
        return breakdownActivity.parameters.breakdown_date[1]; // Use breakdown start date (new value)
      }
    }
    return assetData.breakdown_date || null;
  }, [assetData.activities, assetData.breakdown_date]);

  // Calculate breakdown age
  useEffect(() => {
    const breakdownDate = getBreakdownDate();
    if (breakdownDate) {
      const breakdown = new Date(breakdownDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - breakdown.getTime());
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
  }, [getBreakdownDate]);

  // Fetch detailed asset data and breakdown information
  useEffect(() => {
    const fetchBreakdownDetails = async () => {
      const idToUse = assetId || initialAsset.id;

      if (!idToUse) return;

      setLoading(true);
      try {
        // Get the mobile token specifically
        const mobileToken = sessionStorage.getItem("mobile_token");
        if (!mobileToken) {
          throw new Error("Mobile token not found");
        }

        // Get base URL
        let baseUrl =
          sessionStorage.getItem("baseUrl") || "https://oig-api.gophygital.work";
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

          // Convert activities to breakdown history format
          if (assetApiData.asset.activities && assetApiData.asset.activities.length > 0) {
            const history = assetApiData.asset.activities
              .filter((activity: Activity) => 
                activity.parameters.breakdown && 
                activity.parameters.breakdown[1] === true &&
                activity.parameters.breakdown_date &&
                activity.parameters.breakdown_date[1] // Only activities that have a new breakdown date
              )
              .map((activity: Activity) => {
                const breakdownDate = activity.parameters.breakdown_date?.[1] || activity.created_at; // Use the NEW breakdown date
                const updatedDate = activity.parameters.updated_at?.[1] || activity.updated_at;
                
                return {
                  id: activity.id,
                  date: new Date(breakdownDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit", 
                    year: "numeric"
                  }),
                  time: calculateTimeDifference(breakdownDate, updatedDate),
                  aging: calculateAging(breakdownDate, updatedDate),
                  costSpent: "NA", // As requested
                  attendeeName: "Repair Technician", // Default value
                  status: "Breakdown"
                };
              })
              .sort((a, b) => b.id - a.id); // Sort by activity ID descending (latest first)

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
            time: "00:00:00",
            aging: "1 day",
            costSpent: "NA",
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
  const calculateAging = (startDateString: string, endDateString?: string) => {
    if (!startDateString) return "N/A";

    const start = new Date(startDateString);
    const end = endDateString ? new Date(endDateString) : new Date();
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day";
    return `${diffDays} days`;
  };

  // Helper function to calculate time difference in DD:HH:MM format
  const calculateTimeDifference = (startDateString: string, endDateString: string) => {
    if (!startDateString || !endDateString) return "00:00:00";

    const start = new Date(startDateString);
    const end = new Date(endDateString);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffDays.toString().padStart(2, "0")}:${diffHours.toString().padStart(2, "0")}:${diffMinutes.toString().padStart(2, "0")}`;
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
    navigate(`/mobile/assets/${idToUse}`);
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
                {formatDate(getBreakdownDate() || "")}
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
