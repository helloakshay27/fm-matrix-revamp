import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Building,
  Globe,
  MapPin,
  Calendar,
  DollarSign,
  Loader2,
  Users,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { useApiConfig } from "@/hooks/useApiConfig";

interface CompanyDetails {
  id: number;
  name: string;
  organization_id: number;
  country_id: number;
  billing_term: string;
  billing_rate: string;
  live_date: string;
  remarks: string;
  created_at: string;
  updated_at: string;
  organization?: {
    id: number;
    name: string;
  };
  country?: {
    id: number;
    name: string;
  };
  bill_to_address?: {
    address: string;
    email: string;
  };
  postal_address?: {
    address: string;
    email: string;
  };
  finance_spoc?: {
    name: string;
    designation: string;
    email: string;
    mobile: string;
  };
  operation_spoc?: {
    name: string;
    designation: string;
    email: string;
    mobile: string;
  };
}

export const CompanyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getFullUrl, getAuthHeader } = useApiConfig();

  const [company, setCompany] = useState<CompanyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanyDetails = async (companyId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        getFullUrl(`/pms/company_setups/${companyId}.json`),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: getAuthHeader(),
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Company not found");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle both direct object and wrapped response
      const companyData = data.company || data.data || data;

      setCompany(companyData);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error fetching company details:", error);
      setError(errorMessage);
      toast.error(`Failed to load company details: ${errorMessage}`, {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCompanyDetails(parseInt(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "-";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-[#C72030]" />
          <p className="text-gray-600">Loading company details...</p>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Company Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The requested company could not be found."}
          </p>
          <Button
            onClick={() => navigate("/ops-console/master/location/account")}
            className="bg-[#C72030] text-white hover:bg-[#C72030]/90"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Companies
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/ops-console/master/location/account")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Account Management
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {company.name}
              </h1>
              <p className="text-gray-600 mt-2">
                {company.remarks || "No remarks"}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-[#C72030]" />
                Basic Information
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company ID
                  </label>
                  <p className="text-gray-900 font-mono">#{company.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization
                  </label>
                  <p className="text-gray-900">
                    {company.organization?.name || "Unknown"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <p className="text-gray-900">
                    {company.country?.name || "Unknown"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Live Date
                  </label>
                  <p className="text-gray-900">
                    {formatDate(company.live_date)}
                  </p>
                </div>
              </div>
            </div>

            {/* Billing Information Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#C72030]" />
                Billing Information
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Billing Rate
                  </label>
                  <p className="text-gray-900">{company.billing_rate || "-"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Billing Term
                  </label>
                  <p className="text-gray-900">{company.billing_term || "-"}</p>
                </div>
              </div>
            </div>

            {/* Addresses Card */}
            {(company.bill_to_address || company.postal_address) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#C72030]" />
                  Addresses
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  {company.bill_to_address && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bill To Address
                      </label>
                      <p className="text-gray-900 mb-2">
                        {company.bill_to_address.address || "-"}
                      </p>
                      {company.bill_to_address.email && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {company.bill_to_address.email}
                        </p>
                      )}
                    </div>
                  )}
                  {company.postal_address && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Address
                      </label>
                      <p className="text-gray-900 mb-2">
                        {company.postal_address.address || "-"}
                      </p>
                      {company.postal_address.email && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {company.postal_address.email}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SPOC Information Card */}
            {(company.finance_spoc || company.operation_spoc) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#C72030]" />
                  SPOC Contacts
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  {company.finance_spoc && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">
                        Finance SPOC
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs text-gray-600">
                            Name
                          </label>
                          <p className="text-sm text-gray-900">
                            {company.finance_spoc.name || "-"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600">
                            Designation
                          </label>
                          <p className="text-sm text-gray-900">
                            {company.finance_spoc.designation || "-"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600">
                            Email
                          </label>
                          <p className="text-sm text-gray-900">
                            {company.finance_spoc.email || "-"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600">
                            Mobile
                          </label>
                          <p className="text-sm text-gray-900">
                            {company.finance_spoc.mobile || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {company.operation_spoc && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">
                        Operation SPOC
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs text-gray-600">
                            Name
                          </label>
                          <p className="text-sm text-gray-900">
                            {company.operation_spoc.name || "-"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600">
                            Designation
                          </label>
                          <p className="text-sm text-gray-900">
                            {company.operation_spoc.designation || "-"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600">
                            Email
                          </label>
                          <p className="text-sm text-gray-900">
                            {company.operation_spoc.email || "-"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600">
                            Mobile
                          </label>
                          <p className="text-sm text-gray-900">
                            {company.operation_spoc.mobile || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Meta Information */}
          <div className="space-y-6">
            {/* Timeline Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#C72030]" />
                Timeline
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created At
                  </label>
                  <p className="text-gray-900 text-sm">
                    {formatDate(company.created_at)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Updated
                  </label>
                  <p className="text-gray-900 text-sm">
                    {formatDate(company.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
