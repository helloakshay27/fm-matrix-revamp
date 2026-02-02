import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Edit,
  FileText,
  File,
  FileSpreadsheet,
  Eye,
  Download,
  User,
  CreditCard,
  Calendar,
  MapPin,
  Pencil,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  API_CONFIG,
  getFullUrl,
  getAuthenticatedFetchOptions,
  ENDPOINTS,
} from "@/config/apiConfig";
import { AttachmentPreviewModal } from "@/components/AttachmentPreviewModal";
import { QRCodeModal } from "@/components/QRCodeModal";
import VisitorPassWeb from "@/components/VisitorPassWeb";

// Types
interface DocumentItem {
  id: number;
  document_url: string;
}

interface ItemDetail {
  id: number;
  name: string | null;
  number: string;
}

interface ItemMovement {
  id: number;
  movement_type: string | null;
  item_details: ItemDetail[];
}

interface AssetItem {
  id: number;
  asset_category_name?: string;
  asset_name?: string;
  serial_model_number?: string;
  notes?: string;
  documents?: DocumentItem[];
}

interface VisitorIdentity {
  id: number;
  identity_type?: string;
  government_id_number?: string;
  documents?: DocumentItem[];
}

interface AdditionalVisitor {
  id: number;
  name: string;
  mobile: string;
  email?: string;
  gatekeeper_id: number;
  pass_number?: string;
  vehicle_type?: string;
  vehicle_number?: string;
  parking_slot_number?: string;
  carring_asset?: boolean;
  identity?: VisitorIdentity;
  assets?: AssetItem[];
}

interface VisitorData {
  id: number;
  guest_name: string;
  guest_number: string;
  guest_email?: string;
  guest_vehicle_number?: string;
  guest_from?: string;
  visit_purpose?: string;
  person_to_meet_id?: number;
  vstatus: string;
  checkin_time?: string;
  checkout_time?: string;
  expected_at?: string;
  guest_entry_time?: string;
  guest_exit_time?: string;
  master_exit_time?: string;
  image?: string;
  pass_number?: string;
  guest_type?: string;
  visitor_type?: string;
  created_at?: string;
  pass_start_date?: string;
  pass_end_date?: string;
  notes?: string;
  temperature?: string;
  approve?: number;
  check_in?: boolean;
  check_out?: boolean;
  visit_to?: string;
  visit_to_number?: string;
  entry_gate?: string;
  exit_gate?: string;
  created_by?: string;
  time_since_in?: string;
  location?: string;
  qr_code_url?: string;
  otp_string?: string;
  company_name?: string;
  vehicle_type?: string;
  carring_asset?: boolean;
  additional_visitors?: AdditionalVisitor[];
  assets?: AssetItem[];
  visitor_identity?: VisitorIdentity;
  visitor_documents?: DocumentItem[];
  pass_days?: string[];
  pass_valid?: boolean;
  visitor_host_name?: string;
  visitor_host_mobile?: string;
  visitor_host_email?: string;
  building_name?: string;
  encrypted_gatekeeper_id?: string;
  item_movements?: ItemMovement[];
}

export const VisitorDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [visitorData, setVisitorData] = useState<VisitorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [disabledOTPButtons, setDisabledOTPButtons] = useState<
    Record<number, boolean>
  >({});
  const [activeTab, setActiveTab] = useState("profile");

  // State for document modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<{
    id: number;
    document_name?: string;
    document_file_name?: string;
    url: string;
  } | null>(null);

  // State for QR Code modal
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  // State for Gate Pass modal
  const [isGatePassModalOpen, setIsGatePassModalOpen] = useState(false);

  // Helper function to check if value has data
  const hasData = (value: string | undefined | null): boolean => {
    return value !== null && value !== undefined && value !== "";
  };

  useEffect(() => {
    const fetchVisitorDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const url = getFullUrl(`/pms/visitors/${id}.json`);
        const options = getAuthenticatedFetchOptions();

        const response = await fetch(url, options);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch visitor details: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        // Handle the nested gatekeeper structure from the API
        const visitor = data.gatekeeper || data.visitor || data;
        setVisitorData(visitor);
      } catch (err) {
        setError("Failed to fetch visitor details");
        console.error("Error fetching visitor details:", err);
        toast.error("Failed to load visitor details");
      } finally {
        setLoading(false);
      }
    };

    fetchVisitorDetails();
  }, [id]);

  const handleBackToList = () => {
    navigate(-1);
  };

  const handleUpdate = () => {
    navigate(`/visitor-management/edit/${id}`);
  };

  const handleResendOTP = async () => {
    if (!visitorData || !id) return;

    try {
      setDisabledOTPButtons((prev) => ({ ...prev, [visitorData.id]: true }));

      // Construct the API URL using the resend OTP endpoint
      const url = getFullUrl(ENDPOINTS.RESEND_OTP);
      const options = getAuthenticatedFetchOptions();

      // Add query parameter for visitor ID
      const urlWithParams = new URL(url);
      urlWithParams.searchParams.append("id", id.toString());
      if (API_CONFIG.TOKEN) {
        urlWithParams.searchParams.append("access_token", API_CONFIG.TOKEN);
      }

      const response = await fetch(urlWithParams.toString(), options);

      if (!response.ok) {
        throw new Error(
          `Failed to send OTP: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Show success toast
      toast.success("OTP sent successfully!");

      // Re-enable the button after 1 minute (60000ms)
      setTimeout(() => {
        setDisabledOTPButtons((prev) => ({ ...prev, [visitorData.id]: false }));
      }, 60000);
    } catch (err) {
      console.error("❌ Error sending OTP:", err);
      toast.error("Failed to send OTP. Please try again.");

      // Re-enable the button on error
      setDisabledOTPButtons((prev) => ({ ...prev, [visitorData.id]: false }));
    }
  };

  const handleSkipApproval = async () => {
    if (!visitorData || !id) return;

    try {
      // Show loading toast
      toast.info("Processing approval...");

      // Construct the API URL
      const url = getFullUrl(`/pms/visitors/${id}.json`);
      const options = getAuthenticatedFetchOptions();

      // Set the request method to PUT and add the request body
      const requestOptions = {
        ...options,
        method: "PUT",
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          approval: "true",
          gatekeeper: {
            approve: "1",
          },
        }),
      };

      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error(`Failed to skip approval: ${response.status}`);
      }

      const data = await response.json();

      // Show success toast
      toast.success("Host approval skipped successfully!");

      // Refresh visitor data
      window.location.reload();
    } catch (err) {
      console.error("❌ Error skipping approval:", err);
      toast.error("Failed to skip approval. Please try again.");
    }
  };

  function getLocalISOString() {
    const now = new Date();
    const offsetMs = now.getTimezoneOffset() * 60 * 1000; // offset in ms
    const localTime = new Date(now.getTime() - offsetMs);
    const iso = localTime.toISOString().slice(0, 19);

    const offset = -now.getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const pad = (n: number) => String(Math.floor(Math.abs(n))).padStart(2, "0");
    const hours = pad(offset / 60);
    const minutes = pad(offset % 60);

    return `${iso}${sign}${hours}:${minutes}`;
  }

  const handleCheckIn = async () => {
    if (!visitorData || !id) return;

    try {
      const url = getFullUrl(`/pms/visitors/${id}.json`);
      const options = getAuthenticatedFetchOptions();

      const requestBody = {
        gatekeeper: {
          guest_entry_time: getLocalISOString(),
          entry_gate_id: "",
          status: "checked_in",
        },
      };

      const requestOptions = {
        ...options,
        method: "PUT",
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      };

      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error(
          `Failed to check-in visitor: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Show success toast
      toast.success("Visitor checked in successfully!");

      // Refresh visitor data
      window.location.reload();
    } catch (err) {
      console.error("❌ Error checking in visitor:", err);
      toast.error("Failed to check-in visitor. Please try again.");
    }
  };

  const handleCheckOut = async () => {
    if (!visitorData || !id) return;

    try {
      const url = getFullUrl(`/pms/admin/visitors/marked_out_visitors.json`);
      const options = getAuthenticatedFetchOptions();

      // Create request body for checkout with current timestamp
      const requestBody = {
        gatekeeper: {
          guest_exit_time: new Date().toISOString().slice(0, 19) + "+05:30",
          exit_gate_id: "",
          status: "checked_out",
          gatekeeper_ids: id,
        },
      };

      // Set the request method to PUT and add the request body
      const requestOptions = {
        ...options,
        method: "PUT",
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      };

      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error(
          `Failed to checkout visitor: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Show success toast
      toast.success("Visitor checked out successfully!");

      // Refresh visitor data
      window.location.reload();
    } catch (err) {
      console.error("❌ Error checking out visitor:", err);
      toast.error("Failed to checkout visitor. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="flex items-center justify-center h-64">
          <span className="text-gray-500">Loading visitor details...</span>
        </div>
      </div>
    );
  }

  if (error || !visitorData) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="text-center text-red-500">
          <p>{error || "Visitor not found"}</p>
          <Button onClick={handleBackToList} className="mt-4">
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleBackToList}
          className="flex items-center gap-1 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Visitor List
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Visitor Details</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium">Visitor Name:</span>
                <span className="font-semibold text-gray-900">
                  {visitorData.guest_name || '--'}
                </span>
              </div>
              {visitorData.pass_number && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 font-medium">Pass Number:</span>
                  <span className="font-semibold text-gray-900">{visitorData.pass_number}</span>
                </div>
              )}
              {visitorData.vstatus && (
                <Badge
                  className={
                    visitorData.vstatus === "checked_in"
                      ? "bg-green-100 text-green-800"
                      : visitorData.vstatus === "checked_out"
                      ? "bg-blue-100 text-blue-800"
                      : visitorData.vstatus === "expected"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {visitorData.vstatus.replace(/_/g, " ").toUpperCase()}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {/* Dynamic Action Buttons based on status */}
            {visitorData.approve === 0 && (
              <Button
                onClick={handleSkipApproval}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Skip Approval
              </Button>
            )}
            
            {visitorData.vstatus !== "checked_in" &&
              visitorData.vstatus !== "checked_out" &&
              visitorData.approve === 1 && (
                <Button
                  onClick={handleCheckIn}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  Check-in
                </Button>
              )}

            {visitorData.vstatus === "checked_in" && (
              <Button
                onClick={handleCheckOut}
                className="bg-[#C72030] text-white hover:bg-[#C72030]/90"
              >
                Check-out
              </Button>
            )}

            {/* <Button
              onClick={handleResendOTP}
              disabled={disabledOTPButtons[visitorData.id]}
              className="bg-purple-600 text-white hover:bg-purple-700"
            >
              Resend OTP
            </Button> */}

            <Button
              onClick={() => {
                if (visitorData.encrypted_gatekeeper_id) {
                  setIsGatePassModalOpen(true);
                } else {
                  toast.error('Gate pass not available');
                }
              }}
              className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-4 py-2"
            >
              <svg
                width="14"
                height="15"
                viewBox="0 0 14 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                <path
                  d="M0.332031 4.20609V0.935059H3.66536V2.24347H1.66536V4.20609H0.332031ZM0.332031 14.0192V10.7481H1.66536V12.7108H3.66536V14.0192H0.332031ZM10.332 14.0192V12.7108H12.332V10.7481H13.6654V14.0192H10.332ZM12.332 4.20609V2.24347H10.332V0.935059H13.6654V4.20609H12.332ZM10.6654 11.0752H11.6654V12.0566H10.6654V11.0752ZM10.6654 9.11263H11.6654V10.0939H10.6654V9.11263ZM9.66536 10.0939H10.6654V11.0752H9.66536V10.0939ZM8.66536 11.0752H9.66536V12.0566H8.66536V11.0752ZM7.66536 10.0939H8.66536V11.0752H7.66536V10.0939ZM9.66536 8.13132H10.6654V9.11263H9.66536V8.13132ZM8.66536 9.11263H9.66536V10.0939H8.66536V9.11263ZM7.66536 8.13132H8.66536V9.11263H7.66536V8.13132ZM11.6654 2.89768V6.82291H7.66536V2.89768H11.6654ZM6.33203 8.13132V12.0566H2.33203V8.13132H6.33203ZM6.33203 2.89768V6.82291H2.33203V2.89768H6.33203ZM5.33203 11.0752V9.11263H3.33203V11.0752H5.33203ZM5.33203 5.8416V3.87898H3.33203V5.8416H5.33203ZM10.6654 5.8416V3.87898H8.66536V5.8416H10.6654Z"
                  fill="#bf213e"
                />
              </svg>
              View Pass
            </Button>

            {/* <Button
              onClick={handleUpdate}
              className="bg-white text-white hover:bg-[#C72030]/90"
            >
              <Pencil className="w-4 h-4 mr-2" /> 
            </Button> */}
             {/* <Button
                              onClick={handleUpdate}
                              variant="outline"
                              className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50 px-4 py-2"
                            >
                              <svg
                                width="21"
                                height="21"
                                viewBox="0 0 21 21"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <mask
                                  id="mask0_107_2076"
                                  style={{ maskType: "alpha" }}
                                  maskUnits="userSpaceOnUse"
                                  x="0"
                                  y="0"
                                  width="21"
                                  height="21"
                                >
                                  <rect width="21" height="21" fill="#C72030" />
                                </mask>
                                <g mask="url(#mask0_107_2076)">
                                  <path
                                    d="M4.375 16.625H5.47881L14.4358 7.66806L13.3319 6.56425L4.375 15.5212V16.625ZM3.0625 17.9375V14.9761L14.6042 3.43941C14.7365 3.31924 14.8825 3.22642 15.0423 3.16094C15.2023 3.09531 15.37 3.0625 15.5455 3.0625C15.7209 3.0625 15.8908 3.09364 16.0552 3.15591C16.2197 3.21818 16.3653 3.3172 16.492 3.45297L17.5606 4.53491C17.6964 4.66164 17.7931 4.80747 17.8509 4.97241C17.9086 5.13734 17.9375 5.30228 17.9375 5.46722C17.9375 5.64324 17.9075 5.81117 17.8474 5.971C17.7873 6.13098 17.6917 6.2771 17.5606 6.40937L6.02394 17.9375H3.0625ZM13.8742 7.12578L13.3319 6.56425L14.4358 7.66806L13.8742 7.12578Z"
                                    fill="#C72030"
                                  />
                                </g>
                              </svg>
                            </Button> */}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="w-full flex flex-wrap bg-gray-50 rounded-t-lg h-auto p-0 text-sm justify-stretch">
            <TabsTrigger
              value="profile"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Basic Info
            </TabsTrigger>
            <TabsTrigger
              value="additional"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Additional Details
            </TabsTrigger>
            <TabsTrigger
              value="assets"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Asset Details
            </TabsTrigger>
            <TabsTrigger
              value="identity"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Identity Verification
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Basic Info */}
          <TabsContent value="profile" className="p-6 space-y-6">
            {/* Visitor Information Card */}
            <Card className="w-full">
              <CardHeader className="pb-4 lg:pb-6">
                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                    <User className="w-6 h-6" style={{ color: '#C72030' }} />
                  </div>
                  <span className="uppercase tracking-wide">Visitor Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Column 1: Profile Image */}
                  {hasData(visitorData.image) && (
                    <div className="flex items-start justify-center lg:justify-start pl-9">
                      <img
                        src={
                          visitorData.image?.startsWith("http")
                            ? visitorData.image
                            : "/placeholder.svg"
                        }
                        alt={visitorData.guest_name || "Visitor"}
                        className="ml-9 w-40 h-40 object-cover rounded-lg border-2 border-gray-200"
                        onError={(e) => {
                          const target =  e.target as HTMLImageElement;
                          target.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                  )}

                  {/* Columns 2 & 3: Information Grid */}
                  <div className={`${hasData(visitorData.image) ? 'lg:col-span-2' : 'lg:col-span-3'} grid grid-cols-1 md:grid-cols-2 gap-6 text-sm`}>
                    {hasData(visitorData.guest_name) && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Visitor Name</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{visitorData.guest_name}</span>
                      </div>
                    )}

                    {hasData(visitorData.guest_type) && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Guest Type</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{visitorData.guest_type}</span>
                      </div>
                    )}

                    {hasData(visitorData.guest_number) && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Mobile No.</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{visitorData.guest_number}</span>
                      </div>
                    )}

                    {hasData(visitorData.visitor_host_name) && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Person To Meet</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{visitorData.visitor_host_name}</span>
                      </div>
                    )}

                    {hasData(visitorData.visitor_host_email) && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Visitor Email</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{visitorData.visitor_host_email}</span>
                      </div>
                    )}

                    {hasData(visitorData.location) && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">To Location</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{visitorData.location}</span>
                      </div>
                    )}

                    {hasData(visitorData.visit_purpose) && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Purpose</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{visitorData.visit_purpose}</span>
                      </div>
                    )}

                    {hasData(visitorData.pass_number) && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Pass Number</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{visitorData.pass_number}</span>
                      </div>
                    )}

                    {hasData(visitorData.expected_at) && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Expected Date</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">
                          {new Date(visitorData.expected_at).toLocaleDateString('en-GB')}
                        </span>
                      </div>
                    )}

                    {hasData(visitorData.expected_at) && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Expected Time</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">
                          {new Date(visitorData.expected_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    )}

                    {hasData(visitorData.guest_from) && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Coming From</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{visitorData.guest_from}</span>
                      </div>
                    )}

                    {hasData(visitorData.created_at) && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Created Date & Time</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">
                          {new Date(visitorData.created_at).toLocaleString()}
                        </span>
                      </div>
                    )}

                    {hasData(visitorData.remarks) && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Remarks</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">
                          {visitorData.remarks}
                        </span>
                      </div>
                    )}

                    {hasData(visitorData.guest_entry_time_show) && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Check-in Time</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">
                          {visitorData.guest_entry_time_show}
                        </span>
                      </div>
                    )}

                    {hasData(visitorData.master_exit_time_show) && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Check-out Time</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">
                          {visitorData.master_exit_time_show}
                        </span>
                      </div>
                    )}

                    {/* {hasData(visitorData.entry_gate) && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Entry Gate</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{visitorData.entry_gate}</span>
                      </div>
                    )} */}

                    {hasData(visitorData.exit_gate) && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Exit Gate</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{visitorData.exit_gate}</span>
                      </div>
                    )}

                    {hasData(visitorData.time_since_in) && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Time Since Check-in</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{visitorData.time_since_in}</span>
                      </div>
                    )}
                  

                    {visitorData.additional_visitors && visitorData.additional_visitors.length > 0 && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Additional Visitor</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">
                          {visitorData.additional_visitors.length}
                        </span>
                      </div>
                    )}

                    {hasData(visitorData.temperature) && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Temperature</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{visitorData.temperature}°C</span>
                      </div>
                    )}

                    {hasData(visitorData.notes) && (
                      <div className="flex items-start md:col-span-2">
                        <span className="text-gray-500 min-w-[140px]">Notes</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{visitorData.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pass Information Card */}
            {(hasData(visitorData.pass_start_date) ||
              hasData(visitorData.pass_end_date) ||
              (visitorData.pass_days && visitorData.pass_days.length > 0)) && (
              <Card className="w-full">
                <CardHeader className="pb-4 lg:pb-6">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                      <CreditCard className="w-6 h-6" style={{ color: '#C72030' }} />
                    </div>
                    <span className="uppercase tracking-wide">Pass Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    {hasData(visitorData.pass_start_date) && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Pass Start Date</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">
                          {new Date(visitorData.pass_start_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {hasData(visitorData.pass_end_date) && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Pass End Date</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">
                          {new Date(visitorData.pass_end_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {visitorData.pass_days && visitorData.pass_days.length > 0 && (
                      <div className="flex items-start col-span-2">
                        <span className="text-gray-500 min-w-[140px]">Pass Days</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <div className="flex-1 flex flex-wrap gap-2">
                          {visitorData.pass_days.map((day, index) => (
                            <Badge key={index} variant="outline">
                              {day}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {visitorData.pass_valid !== undefined && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Pass Valid</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <Badge
                          className={
                            visitorData.pass_valid
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {visitorData.pass_valid ? "Valid" : "Invalid"}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Check-in/Check-out Information Card */}
            {/* {(hasData(visitorData.guest_entry_time) ||
              hasData(visitorData.master_exit_time) ||
              hasData(visitorData.entry_gate) ||
              hasData(visitorData.exit_gate)) && (
              <Card className="w-full">
                <CardHeader className="pb-4 lg:pb-6">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                      <MapPin className="w-6 h-6" style={{ color: '#C72030' }} />
                    </div>
                    <span className="uppercase tracking-wide">Check-in / Check-out Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    {hasData(visitorData.guest_entry_time) && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Check-in Time</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">
                          {new Date(visitorData.guest_entry_time).toLocaleString()}
                        </span>
                      </div>
                    )}

                    {hasData(visitorData.master_exit_time) && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Check-out Time</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">
                          {new Date(visitorData.master_exit_time).toLocaleString()}
                        </span>
                      </div>
                    )}

                    {hasData(visitorData.entry_gate) && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Entry Gate</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{visitorData.entry_gate}</span>
                      </div>
                    )}

                    {hasData(visitorData.exit_gate) && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Exit Gate</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{visitorData.exit_gate}</span>
                      </div>
                    )}

                    {hasData(visitorData.time_since_in) && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Time Since Check-in</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{visitorData.time_since_in}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )} */}
          </TabsContent>

          {/* Tab 2: Additional Details */}
          <TabsContent value="additional" className="p-6 space-y-6">
            {visitorData.additional_visitors && visitorData.additional_visitors.length > 0 ? (
              visitorData.additional_visitors.map((visitor: AdditionalVisitor, index: number) => (
                <div
                  key={visitor?.id || index}
                  className="border rounded-lg p-6 bg-gray-50 space-y-6"
                >
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                    Visitor {index + 1}                    
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                      {hasData(visitor?.name) && (
                        <div className="flex items-start">
                          <span className="text-gray-500 min-w-[140px]">Visitor Name</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{visitor.name}</span>
                        </div>
                      )}

                      {hasData(visitor?.mobile) && (
                        <div className="flex items-start">
                          <span className="text-gray-500 min-w-[140px]">Mobile No.</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{visitor.mobile}</span>
                        </div>
                      )}

                       {hasData(visitor?.pass_number) && (
                        <div className="flex items-start">
                          <span className="text-gray-500 min-w-[140px]">Pass Number</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{visitor.pass_number}</span>
                        </div>
                      )}

                      {hasData(visitor?.email) && (
                        <div className="flex items-start">
                          <span className="text-gray-500 min-w-[140px]">Email</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{visitor.email}</span>
                        </div>
                      )}

                      {hasData(visitor?.vehicle_type) && (
                        <div className="flex items-start">
                          <span className="text-gray-500 min-w-[140px]">Vehicle Type</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{visitor.vehicle_type}</span>
                        </div>
                      )}

                      {hasData(visitor?.vehicle_number) && (
                        <div className="flex items-start">
                          <span className="text-gray-500 min-w-[140px]">Vehicle No</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{visitor.vehicle_number}</span>
                        </div>
                      )}

                      {hasData(visitor?.parking_slot_number) && (
                        <div className="flex items-start">
                          <span className="text-gray-500 min-w-[140px]">Parking Slot</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{visitor.parking_slot_number}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                No additional visitor details found
              </div>
            )}
          </TabsContent>

          {/* Tab 3: Asset Details */}
          <TabsContent value="assets" className="p-6 space-y-6">
            {/* Item Movements Section */}
            {visitorData.item_movements && visitorData.item_movements.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Item Movements
                </h2>
                {visitorData.item_movements.map((movement: ItemMovement, index: number) => (
                  <div key={movement.id || index} className="border rounded-lg p-6 bg-gray-50">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                      Movement {index + 1}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-4">
                      {hasData(movement?.movement_type) && (
                        <div className="flex items-start">
                          <span className="text-gray-500 min-w-[140px]">Movement Type</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{movement.movement_type}</span>
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    {movement.item_details && movement.item_details.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Items</h4>
                        <div className="space-y-3">
                          {movement.item_details.map((item: ItemDetail, itemIndex: number) => (
                            <div key={item.id || itemIndex} className="border-l-4 border-[#C72030] bg-white p-4 rounded">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                {hasData(item?.name) && (
                                  <div className="flex items-start">
                                    <span className="text-gray-500 min-w-[100px]">Item Name</span>
                                    <span className="text-gray-500 mx-2">:</span>
                                    <span className="text-gray-900 font-medium">{item.name}</span>
                                  </div>
                                )}
                                {hasData(item?.number) && (
                                  <div className="flex items-start">
                                    <span className="text-gray-500 min-w-[100px]">Item Number</span>
                                    <span className="text-gray-500 mx-2">:</span>
                                    <span className="text-gray-900 font-medium">{item.number}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Main Visitor's Assets */}
            {visitorData.assets && visitorData.assets.length > 0 && (
              <div className="space-y-6">
<h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
  {visitorData?.guest_name
    ? `${visitorData.guest_name}'s Assets`
    : 'Main Visitor Assets'}

  <span className="ml-2 text-sm font-normal text-gray-600">
    (Primary Visitor)
  </span>
</h2>
                {visitorData.assets.map((asset: AssetItem, index: number) => (
                  <div key={asset.id || index} className="border rounded-lg p-6 bg-gray-50">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                      {/* {asset?.asset_name || asset?.asset_category_name || `Asset ${index + 1}`} */}
                    </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    {hasData(asset?.asset_category_name) && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Asset Category</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{asset.asset_category_name}</span>
                      </div>
                    )}

                    {hasData(asset?.asset_name) && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Asset Name</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{asset.asset_name}</span>
                      </div>
                    )}

                    {hasData(asset?.serial_model_number) && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Serial/ Model No</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{asset.serial_model_number}</span>
                      </div>
                    )}

                    {hasData(asset?.notes) && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Notes</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{asset.notes}</span>
                      </div>
                    )}

                    {asset?.documents && asset.documents.length > 0 && (
                      <div className="flex items-start col-span-2">
                        <span className="text-gray-500 min-w-[140px]">Attachments</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <div className="flex-1 flex flex-wrap gap-2">
                          {asset.documents.map((doc, docIndex) => (
                            <Button
                              key={doc.id}
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedDoc({
                                  id: doc.id,
                                  url: doc.document_url,
                                  document_name: `Attachment ${docIndex + 1}`,
                                });
                                setIsModalOpen(true);
                              }}
                            >
                              Attachment {docIndex + 1}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              </div>
            )}

            {/* Additional Visitors' Assets */}
            {visitorData.additional_visitors && visitorData.additional_visitors.length > 0 && (
              visitorData.additional_visitors.map((visitor: AdditionalVisitor, visitorIndex: number) => (
                visitor.assets && visitor.assets.length > 0 && (
                  <div key={visitor.id || visitorIndex} className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
                      {visitor?.name ? `${visitor.name}'s Assets` : `Visitor ${visitorIndex + 1} Assets`}
                    </h2>
                    {visitor.assets.map((asset: AssetItem, assetIndex: number) => (
                      <div key={asset.id || assetIndex} className="border rounded-lg p-6 bg-gray-50">
                        {/* <h3 className="text-base font-semibold text-gray-900 mb-4">
                          {asset?.asset_name || asset?.asset_category_name || `Asset ${assetIndex + 1}`}
                        </h3> */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                          {hasData(asset?.asset_category_name) && (
                            <div className="flex items-start">
                              <span className="text-gray-500 min-w-[140px]">Asset Category</span>
                              <span className="text-gray-500 mx-2">:</span>
                              <span className="text-gray-900 font-medium">{asset.asset_category_name}</span>
                            </div>
                          )}

                          {hasData(asset?.asset_name) && (
                            <div className="flex items-start">
                              <span className="text-gray-500 min-w-[140px]">Asset Name</span>
                              <span className="text-gray-500 mx-2">:</span>
                              <span className="text-gray-900 font-medium">{asset.asset_name}</span>
                            </div>
                          )}

                          {hasData(asset?.serial_model_number) && (
                            <div className="flex items-start">
                              <span className="text-gray-500 min-w-[140px]">Serial/ Model No</span>
                              <span className="text-gray-500 mx-2">:</span>
                              <span className="text-gray-900 font-medium">{asset.serial_model_number}</span>
                            </div>
                          )}

                          {hasData(asset?.notes) && (
                            <div className="flex items-start">
                              <span className="text-gray-500 min-w-[140px]">Notes</span>
                              <span className="text-gray-500 mx-2">:</span>
                              <span className="text-gray-900 font-medium">{asset.notes}</span>
                            </div>
                          )}

                          {asset?.documents && asset.documents.length > 0 && (
                            <div className="flex items-start col-span-2">
                              <span className="text-gray-500 min-w-[140px]">Attachments</span>
                              <span className="text-gray-500 mx-2">:</span>
                              <div className="flex-1 flex flex-wrap gap-2">
                                {asset.documents.map((doc, docIndex) => (
                                  <Button
                                    key={doc.id}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedDoc({
                                        id: doc.id,
                                        url: doc.document_url,
                                        document_name: `Attachment ${docIndex + 1}`,
                                      });
                                      setIsModalOpen(true);
                                    }}
                                  >
                                    Attachment {docIndex + 1}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ))
            )}

            {!visitorData.item_movements?.length && !visitorData.assets?.length && !visitorData.additional_visitors?.some(v => v.assets?.length) && (
              <div className="text-center py-12 text-gray-500">
                No asset details found
              </div>
            )}
          </TabsContent>

          {/* Tab 4: Identity Verification */}
          <TabsContent value="identity" className="p-6 space-y-6">
            {/* Main Visitor's Documents */}
            {visitorData.visitor_documents && visitorData.visitor_documents.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-6">
                  {visitorData?.guest_name ? `${visitorData.guest_name}'s Documents` : 'Visitor Documents'}
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    (Primary Visitor)
                  </span>
                </h2>
                <div className="border rounded-lg p-6 bg-gray-50">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">
                    Uploaded Documents
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {visitorData.visitor_documents.map((doc, index) => (
                      <div
                        key={doc.id}
                        className="relative group cursor-pointer"
                        onClick={() => {
                          setSelectedDoc({
                            id: doc.id,
                            document_name: `Document ${index + 1}`,
                            url: doc.document_url,
                          });
                          setIsModalOpen(true);
                        }}
                      >
                        <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-[#C72030] transition-colors">
                          <img
                            src={doc.document_url}
                            alt={`Document ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder.svg";
                            }}
                          />
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center">
                          <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                            View
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-2 text-center">
                          Document {index + 1}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Main Visitor's Identity */}
            {visitorData.visitor_identity && (hasData(visitorData.visitor_identity.identity_type) || hasData(visitorData.visitor_identity.government_id_number) || (visitorData.visitor_identity.documents && visitorData.visitor_identity.documents.length > 0)) && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-6">
                  {visitorData?.guest_name ? `${visitorData.guest_name}'s Identity Details` : 'Main Visitor Identity'}
                    <span className="ml-2 text-sm font-normal text-gray-600">
                     (Primary Visitor)
                    </span>
                </h2>
                <div className="border rounded-lg p-6 bg-gray-50">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">
                    Identity Information
                  </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-6">
                  {hasData(visitorData.visitor_identity?.identity_type) && (
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">ID Type</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{visitorData.visitor_identity.identity_type}</span>
                    </div>
                  )}

                  {hasData(visitorData.visitor_identity?.government_id_number) && (
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Government ID</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{visitorData.visitor_identity.government_id_number}</span>
                    </div>
                  )}
                </div>

                {visitorData.visitor_identity.documents && visitorData.visitor_identity.documents.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Identity Documents</h4>
                    <div className="flex flex-wrap gap-4">
                      {visitorData.visitor_identity.documents.map((document: DocumentItem, docIndex: number) => {
                        const url = document.document_url;
                        const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url);

                        return isImage ? (
                          <div key={document.id} className="relative inline-block">
                            <img
                              src={url}
                              alt={`Document ${docIndex + 1}`}
                              className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 cursor-pointer"
                              onClick={() => {
                                setSelectedDoc({
                                  id: document.id,
                                  url,
                                  document_name: url.split("/").pop() || `Document_${document.id}`,
                                });
                                setIsModalOpen(true);
                              }}
                            />
                            <button
                              className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100"
                              onClick={() => {
                                setSelectedDoc({
                                  id: document.id,
                                  url,
                                  document_name: url.split("/").pop() || `Document_${document.id}`,
                                });
                                setIsModalOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        ) : (
                          <Button
                            key={document.id}
                            variant="outline"
                            onClick={() => {
                              setSelectedDoc({
                                id: document.id,
                                url,
                                document_name: url.split("/").pop() || `Document_${document.id}`,
                              });
                              setIsModalOpen(true);
                            }}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            View Document {docIndex + 1}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              </div>
            )}

            {/* Additional Visitors' Identities */}
            {visitorData.additional_visitors && visitorData.additional_visitors.length > 0 && (
              visitorData.additional_visitors.map((visitor: AdditionalVisitor, visitorIndex: number) => (
                visitor.identity && (hasData(visitor.identity.identity_type) || hasData(visitor.identity.government_id_number) || (visitor.identity.documents && visitor.identity.documents.length > 0)) && (
                  <div key={visitor.id || visitorIndex}>
                    <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-6">
                      {visitor?.name ? `${visitor.name}'s Identity Details` : `Visitor ${visitorIndex + 1} Identity`}
                    </h2>
                    <div className="border rounded-lg p-6 bg-gray-50">
                      <h3 className="text-base font-semibold text-gray-900 mb-4">
                        Identity Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-6">
                        {hasData(visitor.identity?.identity_type) && (
                          <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">ID Type</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{visitor.identity.identity_type}</span>
                          </div>
                        )}

                        {hasData(visitor.identity?.government_id_number) && (
                          <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Government ID</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{visitor.identity.government_id_number}</span>
                          </div>
                        )}
                      </div>

                      {visitor.identity.documents && visitor.identity.documents.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">Identity Documents</h4>
                          <div className="flex flex-wrap gap-4">
                            {visitor.identity.documents.map((document: DocumentItem, docIndex: number) => {
                              const url = document.document_url;
                              const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url);

                              return isImage ? (
                                <div key={document.id} className="relative inline-block">
                                  <img
                                    src={url}
                                    alt={`Document ${docIndex + 1}`}
                                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 cursor-pointer"
                                    onClick={() => {
                                      setSelectedDoc({
                                        id: document.id,
                                        url,
                                        document_name: url.split("/").pop() || `Document_${document.id}`,
                                      });
                                      setIsModalOpen(true);
                                    }}
                                  />
                                  <button
                                    className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100"
                                    onClick={() => {
                                      setSelectedDoc({
                                        id: document.id,
                                        url,
                                        document_name: url.split("/").pop() || `Document_${document.id}`,
                                      });
                                      setIsModalOpen(true);
                                    }}
                                  >
                                    <Eye className="w-4 h-4 text-gray-600" />
                                  </button>
                                </div>
                              ) : (
                                <Button
                                  key={document.id}
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedDoc({
                                      id: document.id,
                                      url,
                                      document_name: url.split("/").pop() || `Document_${document.id}`,
                                    });
                                    setIsModalOpen(true);
                                  }}
                                >
                                  <FileText className="w-4 h-4 mr-2" />
                                  View Document {docIndex + 1}
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              ))
            )}

            {!visitorData.visitor_documents?.length && 
             !visitorData.visitor_identity && 
             !visitorData.additional_visitors?.some(v => v.identity) && (
              <div className="text-center py-12 text-gray-500">
                No identity verification documents found
              </div>
            )}

            {/* QR Code Section */}
            {/* {hasData(visitorData.qr_code_url) && (
              <div className="border-t pt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                  QR Code
                </h3>
                <div className="flex justify-center items-center py-8">
                  <img
                    src={visitorData.qr_code_url}
                    alt="QR Code"
                    className="w-48 h-48 border-2 border-gray-200 p-4 rounded-lg bg-white shadow-sm"
                  />
                </div>
              </div>
            )} */}
          </TabsContent>
        </Tabs>
      </div>

      {/* Attachment Preview Modal */}
      <AttachmentPreviewModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedDoc={selectedDoc}
        setSelectedDoc={setSelectedDoc}
      />

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        qrCode={visitorData.qr_code_url || ""}
        serviceName={visitorData.guest_name || "Visitor"}
        site={visitorData.location || "NA"}
      />

      {/* Gate Pass Modal */}
      {isGatePassModalOpen && visitorData.encrypted_gatekeeper_id && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl my-8">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10 rounded-t-lg">
              <h2 className="text-lg font-semibold text-gray-900">Visitor Gate Pass</h2>
              <button
                onClick={() => setIsGatePassModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <VisitorPassWeb 
                apiUrl={`https://live-api.gophygital.work/pms/visitors/${visitorData.encrypted_gatekeeper_id}/gate_pass.json`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorDetailsPage;
