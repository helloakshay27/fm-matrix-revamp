import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { MobileOwnerCostDetails } from "@/components/mobile/MobileOwnerCostDetails";
import { useToast } from "@/hooks/use-toast";
import { baseClient } from "@/utils/withoutTokenBase";

interface Asset {
  id: number;
  name: string;
  breakdown?: boolean;
  ownership_total_cost?: number;
  ownership_costs?: OwnershipCost[];
}

interface OwnershipCost {
  id: number;
  date: string;
  status: string;
  cost: number | null;
  warranty_in_month: number | null;
  warranty_type?: string | null;
  payment_status?: string | null;
}

// Mobile Owner Cost Asset Service
const mobileOwnerCostAssetService = {
  async getAssetById(token: string, assetId: string): Promise<Asset> {
    try {
      const url = `/pms/assets/${assetId}.json`;

      console.log("🔍 FETCHING OWNER COST ASSET:");
      console.log("  - URL:", url);
      console.log("  - Asset ID:", assetId);
      console.log("  - Token:", token?.substring(0, 20) + "...");

      const response = await baseClient.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data: Asset = response.data;
      console.log("📦 OWNER COST ASSET API Response:", data);
      console.log("📊 Ownership Costs:", data.ownership_costs);
      console.log("📊 Ownership Costs Length:", data.ownership_costs?.length);
      console.log("📊 Is Array?", Array.isArray(data.ownership_costs));

      return data;
    } catch (error) {
      console.error("❌ Error fetching owner cost asset:", error);
      throw error;
    }
  },
};

export const MobileOwnerCostAssetPage: React.FC = () => {
  const { assetId, action } = useParams<{
    assetId: string;
    action: string;
  }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Get token from URL params
  const token = searchParams.get("token");

  useEffect(() => {
    fetchAsset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetId, token]);

  const fetchAsset = async () => {
    if (!assetId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Use token from URL or sessionStorage
      const tokenToUse = token || sessionStorage.getItem("mobile_token");
      
      if (tokenToUse) {
        sessionStorage.setItem("mobile_token", tokenToUse);
        console.log("💾 Mobile token stored in sessionStorage");
      }

      if (!tokenToUse) {
        throw new Error("No authentication token available");
      }

      console.log("📱 Fetching owner cost asset with ID:", assetId);
      const assetData = await mobileOwnerCostAssetService.getAssetById(tokenToUse, assetId);
      setAsset(assetData);
      console.log("✅ Owner cost asset fetched successfully");
    } catch (error) {
      console.error("❌ ERROR FETCHING ASSET:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load asset. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshAssetData = async () => {
    await fetchAsset();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Asset Not Found
        </h2>
        <p className="text-gray-600 text-center">
          The asset you are looking for could not be found.
        </p>
      </div>
    );
  }

  // Route to different components based on the action
  switch (action) {
    case "details":
    default:
      return <MobileOwnerCostDetails asset={asset} refreshAssetData={refreshAssetData} />;
  }
};
