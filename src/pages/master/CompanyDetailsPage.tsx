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
  Shield,
  FileText,
  Phone,
  Settings,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useApiConfig } from "@/hooks/useApiConfig";

interface CompanyDetails {
  id: number;
  name: string;
  organization_id: number;
  country_id: number;
  active: boolean;
  status: string;
  test: boolean;
  // Billing Information
  billing_term: string;
  billing_rate: number | null;
  billing_cycle: string | null;
  consolidated_billing: boolean | null;
  billing_note: string | null;
  live_date: string | null;
  start_date: string | null;
  end_date: string | null;
  // Business Information
  business_name: string | null;
  legal_entity_name: string | null;
  gst_number: string | null;
  pan_number: string | null;
  commercial_details: string | null;
  payment_terms: string | null;
  signed_agreement_available: boolean | null;
  work_order_available: boolean | null;
  // Features
  attendance_enabled: boolean | null;
  welcome_mail_enabled: boolean;
  user_approval_level: boolean;
  cost_approval_enabled: boolean;
  daily_pms_report: boolean;
  white_label: boolean;
  visitor_enabled: boolean;
  visitor_pass_enabled: boolean;
  additional_visitor_hide: boolean;
  visitor_building_enabled: boolean;
  all_sites_enabled: boolean;
  ticket_wing_enabled: boolean;
  ticket_area_enabled: boolean;
  sub_category_location_enabled: boolean;
  // Solution Information
  solution_type: string | null;
  solution_for: string | null;
  // Other
  remarks: string;
  otp: string;
  approve: boolean | null;
  approved_by_id: number | null;
  email_sender_name: string | null;
  logo: string | null;
  backend_url: string;
  frontend_url: string | null;
  created_by: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  url: string;
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
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "N/A";
    }
  };

  const formatDateOnly = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "N/A";
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
              <div className="flex items-center gap-2 mt-3">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    company.active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {company.status || (company.active ? "Active" : "Inactive")}
                </span>
                {company.test && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    Test Account
                  </span>
                )}
                {company.white_label && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    White Label
                  </span>
                )}
              </div>
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
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company ID
                    </label>
                    <p className="text-gray-900 font-mono">#{company.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <p className="text-gray-900">{company.name}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organization
                    </label>
                    <p className="text-gray-900">
                      {company.organization_name ||
                        `ID: ${company.organization_id}`}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <p className="text-gray-900">
                      {company.country_name || `ID: ${company.country_id}`}
                    </p>
                  </div>
                </div>
                {company.remarks && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Remarks
                    </label>
                    <p className="text-gray-900">{company.remarks}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Business Information Card */}
            {(company.business_name ||
              company.legal_entity_name ||
              company.gst_number ||
              company.pan_number) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#C72030]" />
                  Business Information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {company.business_name && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Name
                      </label>
                      <p className="text-gray-900">{company.business_name}</p>
                    </div>
                  )}
                  {company.legal_entity_name && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Legal Entity Name
                      </label>
                      <p className="text-gray-900">
                        {company.legal_entity_name}
                      </p>
                    </div>
                  )}
                  {company.gst_number && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GST Number
                      </label>
                      <p className="text-gray-900 font-mono">
                        {company.gst_number}
                      </p>
                    </div>
                  )}
                  {company.pan_number && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        PAN Number
                      </label>
                      <p className="text-gray-900 font-mono">
                        {company.pan_number}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Billing Information Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#C72030]" />
                Billing Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Billing Rate
                    </label>
                    <p className="text-gray-900">
                      {company.billing_rate || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Billing Term
                    </label>
                    <p className="text-gray-900">
                      {company.billing_term || "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Billing Cycle
                    </label>
                    <p className="text-gray-900">
                      {company.billing_cycle || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Live Date
                    </label>
                    <p className="text-gray-900">
                      {formatDateOnly(company.live_date)}
                    </p>
                  </div>
                </div>
                {(company.start_date || company.end_date) && (
                  <div className="grid grid-cols-2 gap-4">
                    {company.start_date && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date
                        </label>
                        <p className="text-gray-900">
                          {formatDateOnly(company.start_date)}
                        </p>
                      </div>
                    )}
                    {company.end_date && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Date
                        </label>
                        <p className="text-gray-900">
                          {formatDateOnly(company.end_date)}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {company.consolidated_billing !== null && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Consolidated Billing
                    </label>
                    <p className="text-gray-900">
                      {company.consolidated_billing ? "Yes" : "No"}
                    </p>
                  </div>
                )}
                {company.billing_note && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Billing Note
                    </label>
                    <p className="text-gray-900">{company.billing_note}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Commercial Details Card */}
            {(company.commercial_details ||
              company.payment_terms ||
              company.signed_agreement_available !== null ||
              company.work_order_available !== null) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Commercial Details
                </h2>
                <div className="space-y-4">
                  {company.commercial_details && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Commercial Details
                      </label>
                      <p className="text-gray-900">
                        {company.commercial_details}
                      </p>
                    </div>
                  )}
                  {company.payment_terms && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Terms
                      </label>
                      <p className="text-gray-900">{company.payment_terms}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    {company.signed_agreement_available !== null && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="text-sm font-medium text-gray-700">
                          Signed Agreement
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            company.signed_agreement_available
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {company.signed_agreement_available
                            ? "Available"
                            : "Not Available"}
                        </span>
                      </div>
                    )}
                    {company.work_order_available !== null && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="text-sm font-medium text-gray-700">
                          Work Order
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            company.work_order_available
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {company.work_order_available
                            ? "Available"
                            : "Not Available"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

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
                        {company.bill_to_address.address || "Not specified"}
                      </p>
                      {/* {company.bill_to_address.email && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {company.bill_to_address.email}
                        </p>
                      )} */}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bill To Email
                    </label>

                    {company.bill_to_address.email && (
                      <p className="text-sm  flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {company.bill_to_address.email}
                      </p>
                    )}
                  </div>

                  {company.postal_address && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Address
                      </label>
                      <p className="text-gray-900 mb-2">
                        {company.postal_address.address || "Not specified"}
                      </p>
                      {/* {company.postal_address.email && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {company.postal_address.email}
                        </p>
                      )} */}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Email
                    </label>

                    {company.postal_address.email && (
                      <p className="text-sm  flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {company.postal_address.email}
                      </p>
                    )}
                  </div>
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
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-3">
                        Finance SPOC
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs text-gray-600">
                            Name
                          </label>
                          <p className="text-sm text-gray-900">
                            {company.finance_spoc.name || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600">
                            Designation
                          </label>
                          <p className="text-sm text-gray-900">
                            {company.finance_spoc.designation ||
                              "Not specified"}
                          </p>
                        </div>
                        {company.finance_spoc.email && (
                          <div>
                            <label className="block text-xs text-gray-600">
                              Email
                            </label>
                            <p className="text-sm text-gray-900 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {company.finance_spoc.email}
                            </p>
                          </div>
                        )}
                        {company.finance_spoc.mobile && (
                          <div>
                            <label className="block text-xs text-gray-600">
                              Mobile
                            </label>
                            <p className="text-sm text-gray-900 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {company.finance_spoc.mobile}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {company.operation_spoc && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-3">
                        Operation SPOC
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs text-gray-600">
                            Name
                          </label>
                          <p className="text-sm text-gray-900">
                            {company.operation_spoc.name || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600">
                            Designation
                          </label>
                          <p className="text-sm text-gray-900">
                            {company.operation_spoc.designation ||
                              "Not specified"}
                          </p>
                        </div>
                        {company.operation_spoc.email && (
                          <div>
                            <label className="block text-xs text-gray-600">
                              Email
                            </label>
                            <p className="text-sm text-gray-900 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {company.operation_spoc.email}
                            </p>
                          </div>
                        )}
                        {company.operation_spoc.mobile && (
                          <div>
                            <label className="block text-xs text-gray-600">
                              Mobile
                            </label>
                            <p className="text-sm text-gray-900 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {company.operation_spoc.mobile}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Meta Information */}
          <div className="space-y-6">
            {/* Solution Information */}
            {(company.solution_type || company.solution_for) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Solution Information
                </h2>
                <div className="space-y-3">
                  {company.solution_type && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Solution Type
                      </label>
                      <p className="text-gray-900">{company.solution_type}</p>
                    </div>
                  )}
                  {company.solution_for && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Solution For
                      </label>
                      <p className="text-gray-900">{company.solution_for}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Features Card */}
            <div className="bg-white rounded-lg shadow p-6">
              {/* <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#C72030]" />
                Features
              </h2> */}
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#C72030]" />
                Company Logo & Company Banner
              </h2>
              {/* Company Logo and Banner */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-medium  mb-2">Company Logo</h3>
                  {company &&
                  company.company_logo &&
                  company.company_logo.document_url ? (
                    <img
                      src={company.company_logo.document_url}
                      alt="Company Logo"
                      className="w-40 h-40 object-contain border rounded shadow bg-white"
                    />
                  ) : (
                    <div className="text-gray-400">No logo available</div>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium  mb-2">Company Banner</h3>
                  {company &&
                  company.company_banner &&
                  company.company_banner.document_url ? (
                    <img
                      src={company.company_banner.document_url}
                      alt="Company Banner"
                      className="w-full max-w-lg h-40 object-contain border rounded shadow bg-white"
                    />
                  ) : (
                    <div className="text-gray-400">No banner available</div>
                  )}
                </div>
              </div>

              {/* <div className="space-y-2">
                {[
                  {
                    label: "Visitor Enabled",
                    value: company.visitor_enabled,
                  },
                  {
                    label: "Visitor Pass",
                    value: company.visitor_pass_enabled,
                  },
                  {
                    label: "Visitor Building",
                    value: company.visitor_building_enabled,
                  },
                  {
                    label: "Welcome Mail",
                    value: company.welcome_mail_enabled,
                  },
                  {
                    label: "User Approval",
                    value: company.user_approval_level,
                  },
                  {
                    label: "Cost Approval",
                    value: company.cost_approval_enabled,
                  },
                  {
                    label: "Daily PMS Report",
                    value: company.daily_pms_report,
                  },
                  {
                    label: "All Sites",
                    value: company.all_sites_enabled,
                  },
                  {
                    label: "Ticket Wing",
                    value: company.ticket_wing_enabled,
                  },
                  {
                    label: "Ticket Area",
                    value: company.ticket_area_enabled,
                  },
                  {
                    label: "Sub-category Location",
                    value: company.sub_category_location_enabled,
                  },
                  {
                    label: "Attendance",
                    value: company.attendance_enabled,
                  },
                ]
                  .filter((feature) => feature.value !== null)
                  .map((feature) => (
                    <div
                      key={feature.label}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm text-gray-700">
                        {feature.label}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          feature.value
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {feature.value ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  ))}
              </div> */}
            </div>

            {/* System URLs */}
            {/* <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#C72030]" />
                System URLs
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Backend URL
                  </label>
                  <p className="text-xs text-gray-600 font-mono break-all bg-gray-50 p-2 rounded">
                    {company.backend_url}
                  </p>
                </div>
                {company.frontend_url && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frontend URL
                    </label>
                    <p className="text-xs text-gray-600 font-mono break-all bg-gray-50 p-2 rounded">
                      {company.frontend_url}
                    </p>
                  </div>
                )}
                {company.email_sender_name && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Sender Name
                    </label>
                    <p className="text-gray-900">{company.email_sender_name}</p>
                  </div>
                )}
              </div>
            </div> */}

            {/* Status Information */}
            {/* <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#C72030]" />
                Status Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700">
                    Account Status
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      company.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {company.status || (company.active ? "Active" : "Inactive")}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700">
                    Account Type
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      company.test
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {company.test ? "Test" : "Production"}
                  </span>
                </div>
                {company.white_label && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-700">
                      White Label
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                      Enabled
                    </span>
                  </div>
                )}
                {company.approve !== null && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-700">
                      Approved
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        company.approve
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {company.approve ? "Yes" : "No"}
                    </span>
                  </div>
                )}
                {company.otp && (
                  <div className="p-3 bg-gray-50 rounded">
                    <label className="block text-xs text-gray-600 mb-1">
                      OTP
                    </label>
                    <p className="text-sm text-gray-900 font-mono">
                      {company.otp}
                    </p>
                  </div>
                )}
              </div>
            </div> */}

            {/* Timeline Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#C72030]" />
                Timeline
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created By
                  </label>
                  <p className="text-gray-900 text-sm">
                    User ID: {company.created_by}
                  </p>
                </div>
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
