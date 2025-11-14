import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { MobileOwnerCostDetails } from "@/components/mobile/MobileOwnerCostDetails";
import { useToast } from "@/hooks/use-toast";
import { saveToken, saveBaseUrl, getOrganizationsByEmailAndAutoSelect, getBaseUrl, getToken } from '@/utils/auth';


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

/**
 * MobileOwnerCostAssetPage Component
 * 
 * Mobile page for viewing and managing asset ownership costs
 * 
 * URL Parameters:
 * - assetId: The asset ID to view
 * - action: The action to perform (e.g., "details")
 * - token: (Optional) Authentication token
 * - email: (Optional) User email for auto-organization selection
 * - orgId: (Optional) Organization ID to auto-select
 * - baseUrl: (Optional) Base API URL
 * 
 * Example URL:
 * https://localhost:5174/mobile/owner-cost-asset/204367/details?email=abhishek.sharma@lockated.com&orgId=13&token=xxx
 * 
 * Note: Use "?" before query parameters, not "/"
 */

// Mobile Owner Cost Asset Service
const mobileOwnerCostAssetService = {
  async getAssetById(token: string, assetId: string): Promise<Asset> {
    try {
      // Get the base URL from auth utils (same as DirectPDFDownloadPage)
      const baseUrl = getBaseUrl();
      
      if (!baseUrl) {
        throw new Error('Base URL not configured. Please provide baseUrl parameter or select an organization.');
      }
      
      const url = `${baseUrl}/pms/assets/${assetId}.json`;

      console.log("🔍 FETCHING OWNER COST ASSET:");
      console.log("  - Base URL:", baseUrl);
      console.log("  - Full URL:", url);
      console.log("  - Asset ID:", assetId);
      console.log("  - Token:", token?.substring(0, 20) + "...");

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawData = await response.json();
      console.log("📦 OWNER COST ASSET API Response:", rawData);

      // Normalize asset shape across different API responses
      let assetData: any =
        rawData?.pms_asset ??
        rawData?.asset ??
        rawData?.data ??
        rawData;

      // In some payloads ownership_costs might be at the root level
      if (!assetData?.ownership_costs && rawData?.ownership_costs) {
        assetData = { ...assetData, ownership_costs: rawData.ownership_costs };
      }

      // Ensure ownership_costs is always an array
      if (assetData?.ownership_costs && !Array.isArray(assetData.ownership_costs)) {
        assetData.ownership_costs = Object.values(assetData.ownership_costs);
      }

      console.log("📊 Normalized Ownership Costs:", assetData?.ownership_costs);
      console.log("📊 Ownership Costs Length:", assetData?.ownership_costs?.length);
      console.log("📊 Is Array?", Array.isArray(assetData?.ownership_costs));

      return assetData;
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

  // Get URL parameters
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const orgId = searchParams.get("orgId");
  const baseUrl = searchParams.get("baseUrl");

  useEffect(() => {
    initializeAndFetchAsset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetId, token, email, orgId, baseUrl]);

  const initializeAndFetchAsset = async () => {
    if (!assetId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Handle email and organization auto-selection
      if (email && orgId) {
        console.log('📧 Processing email and organization:', { email, orgId });
        
        try {
          const { organizations, selectedOrg } = await getOrganizationsByEmailAndAutoSelect(email, orgId);
          
          if (selectedOrg) {
            console.log('✅ Organization auto-selected:', selectedOrg.name);
            
            // Set baseUrl from organization's domain
            if (selectedOrg.domain || selectedOrg.sub_domain) {
              const orgBaseUrl = `https://${selectedOrg.sub_domain}.${selectedOrg.domain}`;
              saveBaseUrl(orgBaseUrl);
              console.log('✅ Base URL set from organization:', orgBaseUrl);
            }
          } else {
            console.warn('⚠️ Organization not found with ID:', orgId);
          }
        } catch (orgError) {
          console.error('❌ Error fetching organizations:', orgError);
        }
      }

      // Set base URL if provided in URL (overrides organization baseUrl)
      if (baseUrl) {
        saveBaseUrl(baseUrl);
        console.log('✅ Base URL set from URL parameter:', baseUrl);
      }

      // Set token if provided in URL
      if (token) {
        saveToken(token);
        sessionStorage.setItem("mobile_token", token);
        console.log('✅ Token set from URL parameter');
      }

      // Use token from URL or from auth utils
      const tokenToUse = token || getToken() || sessionStorage.getItem("mobile_token");
      
      if (!tokenToUse) {
        throw new Error("No authentication token available");
      }

      console.log("📱 Fetching owner cost asset with ID:", assetId);
      console.log("📱 Using base URL:", getBaseUrl());
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

  const fetchAsset = async () => {
    if (!assetId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Use token from URL or from auth utils
      const tokenToUse = token || getToken() || sessionStorage.getItem("mobile_token");
      
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
