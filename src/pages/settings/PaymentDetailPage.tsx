import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Download,
  RefreshCw,
  FileText,
  DollarSign,
  CreditCard,
  Building2,
  RefreshCcw,
  Clock,
  User,
  Calendar,
  Hash,
  Paperclip,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { ClassFormSection } from "@/pages/ClubManagement/ClassFormSection";
import { API_CONFIG } from "@/config/apiConfig";
import { useClubManagementEvents } from "@/components/PostHogClubManagementEvents";

interface Attachment {
  id: number;
  document_file_name: string;
  document_content_type: string;
  document_file_size: number;
  attachment_url: string;
}

interface LockPayment {
  id: number;
  order_number: string;
  payment_of: string;
  payment_of_id: number;
  payment_mode: string | null;
  sub_total: string | null;
  gst: string | null;
  discount: string | null;
  total_amount: string;
  paid_amount: string | null;
  payment_status: string | null;
  pg_state: string | null;
  pg_response_code: string | null;
  pg_response_msg: string | null;
  pg_transaction_id: string | null;
  created_at: string;
  updated_at: string;
  payment_method: string | null;
  card_type: string | null;
  cheque_number: string | null;
  cheque_date: string | null;
  bank_name: string | null;
  ifsc: string | null;
  branch: string | null;
  neft_reference: string | null;
  notes: string | null;
  payment_gateway: string | null;
  user_id: number | null;
  redirect: string;
  payment_type: string | null;
  convenience_charge: string | null;
  refunded_amount: string | null;
  refund_mode: string | null;
  refund_transaction_no: string | null;
  refund_note: string | null;
  refunded_by: string | null;
  refunded_on: string | null;
  receipt_number: string | null;
  created_by_id: number | null;
  updt_balance: string | null;
  recon_status: string | null;
  reconciled_by: string | null;
  reconciled_on: string | null;
  resource_id: number;
  resource_type: string;
  sgst: string | null;
  attachments?: Attachment[];
  user?: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    mobile: string;
  };
  facility_booking?: {
    id: number;
    booking_number: string;
    startdate: string;
    enddate: string;
    comment: string;
    facility_name: string;
    status: string;
  };
  facility_booking_details?: {
    id: number;
    startdate: string;
    start_hour: number;
    start_minute: number;
    end_hour: number;
    end_minute: number;
    book_by: string;
    fac_type: string;
    current_status: string;
    member_charges: number;
    guest_charges: number;
    discount: number;
    amount_full: number;
    sub_total: number;
    gst: number;
    sgst: number;
    cgst_amount: number;
    sgst_amount: number;
    member_count: number;
    guest_count: number;
    payment_method: string;
    facility_name: string;
    schedule_text: string;
  };
  facility_booking_user_details?: {
    id: number;
    full_name: string;
    email: string;
    mobile: string;
    gender: string;
    user_type: string;
    user_title: string | null;
  };
  club_member_allocation_details?: {
    id: number;
    status: string;
    start_date: string;
    end_date: string;
    preferred_start_date: string;
    referred_by: string;
    emergency_contact_name: string;
    membership_plan_name: string;
    membership_plan_id: number;
    pms_site_id: number;
    payment_detail: {
      base_amount: string;
      discount: string;
      cgst: string;
      sgst: string;
      cgst_per: number;
      sgst_per: number;
      landed_amount: string;
    };
  };
  club_member_payee_details?: {
    member_id: number;
    full_name: string;
    email: string;
    mobile: string;
    gender: string;
    user_type: string;
    user_title: string | null;
    flat: string | null;
  };
}

export const PaymentDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { detailViewed, action } = useClubManagementEvents();
  const viewedRef = useRef(false);

  const [payment, setPayment] = useState<LockPayment | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch payment details
  useEffect(() => {
    if (id) {
      fetchPaymentDetails(id);
    }
  }, [id]);

  const fetchPaymentDetails = async (paymentId: string) => {
    setLoading(true);
    try {
      const baseUrl = API_CONFIG.BASE_URL;
      const token = API_CONFIG.TOKEN;

      const url = new URL(
        `${baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`}/lock_payments/${paymentId}.json`
      );
      url.searchParams.append("access_token", token || "");

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch payment details");
      }

      const data = await response.json();

      setPayment(data.lock_payment || data);
      if (!viewedRef.current) {
        viewedRef.current = true;
        detailViewed("Payment", id, "payment_detail");
      }
      toast.success("Payment details loaded");
    } catch (error) {
      toast.error("Failed to load payment details");
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: string | null) => {
    if (!amount) return "-";
    const num = parseFloat(amount);
    return `₹${num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const renderPaymentStatusBadge = (status: string | null) => {
    if (!status) {
      return (
        <Badge className="bg-gray-100 text-gray-800 border-0">Pending</Badge>
      );
    }

    const statusLower = status.toLowerCase();

    if (statusLower === "success" || statusLower === "paid") {
      return (
        <Badge className="bg-green-100 text-green-800 border-0">{status}</Badge>
      );
    }

    if (statusLower === "failed" || statusLower === "rejected") {
      return (
        <Badge className="bg-red-100 text-red-800 border-0">{status}</Badge>
      );
    }

    return (
      <Badge className="bg-gray-100 text-gray-800 border-0">{status}</Badge>
    );
  };

  const handleGoBack = () => {
    navigate("/accounting/payments-made");
  };

  const handleDownloadReceipt = async () => {
    if (!id) {
      toast.error("Payment ID not found");
      return;
    }

    try {
      const baseUrl = API_CONFIG.BASE_URL;
      const token = API_CONFIG.TOKEN;

      const url = `${baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`}/pms/admin/facility_bookings/${id}/payment_invoice`;

      toast.loading("Downloading receipt...");

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to download receipt");
      }

      // Get the blob from response
      const blob = await response.blob();

      // Create a download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `payment_receipt_${payment?.order_number || id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.dismiss();
      toast.success("Receipt downloaded successfully");
      action("Payment Receipt Downloaded", { entity_id: id, screen: "payment_detail" });
    } catch (error) {
      console.error("Error downloading receipt:", error);
      toast.dismiss();
      toast.error("Failed to download receipt");
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
            <p className="text-gray-600">Loading payment details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-600">Payment not found</p>
          <Button onClick={handleGoBack} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Payment List
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">
              Payment Details
            </h1>
            <p className="text-sm text-gray-500">
              Order: {payment.order_number}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDownloadReceipt}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              onClick={() => fetchPaymentDetails(id!)}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Basic Information */}
        <ClassFormSection title="Basic Information" icon={<FileText />}>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[160px]">Order Number</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {payment.order_number}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[160px]">Payment Type</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {payment.payment_of}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[160px]">Payment Of ID</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {payment.payment_of_id}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[160px]">Resource Type</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {payment.resource_type}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[160px]">Resource ID</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {payment.resource_id}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[160px]">Status</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {renderPaymentStatusBadge(payment.payment_status)}
                </span>
              </div>
            </div>
          </div>
        </ClassFormSection>

        {/* User Details */}
        {payment.user && (
          <ClassFormSection title="User Details" icon={<User />}>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[160px]">Name</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {payment.user.firstname} {payment.user.lastname}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[160px]">Email</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {payment.user.email}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[160px]">Mobile</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {payment.user.mobile}
                  </span>
                </div>
              </div>
            </div>
          </ClassFormSection>
        )}

        {/* Booking Details */}
        {payment.facility_booking && (
          <ClassFormSection title="Booking Details" icon={<Calendar />}>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[160px]">
                    Booking Number
                  </span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {payment.facility_booking.booking_number}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[160px]">Facility</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {payment.facility_booking.facility_name}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[160px]">Start Date</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {formatDate(payment.facility_booking.startdate)}
                  </span>
                </div>
                {payment.facility_booking.enddate && (
                  <div className="flex items-start">
                    <span className="text-gray-500 min-w-[160px]">End Date</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">
                      {formatDate(payment.facility_booking.enddate)}
                    </span>
                  </div>
                )}
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[160px]">Status</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {payment.facility_booking.status}
                  </span>
                </div>
                {payment.facility_booking.comment && (
                  <div className="flex items-start">
                    <span className="text-gray-500 min-w-[160px]">Comment</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">
                      {payment.facility_booking.comment}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </ClassFormSection>
        )}

        {/* Facility Booking User Details */}
        {payment.facility_booking_user_details && (
          <ClassFormSection title="User Information" icon={<User />}>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[160px]">Name</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {payment.facility_booking_user_details.full_name}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[160px]">Email</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {payment.facility_booking_user_details.email}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[160px]">Mobile</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {payment.facility_booking_user_details.mobile}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[160px]">User Type</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {payment.facility_booking_user_details.user_type}
                  </span>
                </div>
              </div>
            </div>
          </ClassFormSection>
        )}

        {/* Facility Booking Details */}
        {payment.facility_booking_details && (
          <ClassFormSection title="Facility Details" icon={<Calendar />}>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[160px]">Facility Name</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {payment.facility_booking_details.facility_name}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[160px]">Date</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {payment.facility_booking_details.startdate}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[160px]">Schedule</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {payment.facility_booking_details.schedule_text}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[160px]">Status</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {payment.facility_booking_details.current_status}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[160px]">Payment Method</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium capitalize">
                    {payment.facility_booking_details.payment_method}
                  </span>
                </div>
              </div>
            </div>
          </ClassFormSection>
        )}

        {/* Club Member Payee Details */}
        {payment.club_member_payee_details && (
          <ClassFormSection title="Member Payee Information" icon={<User />}>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[160px]">Name</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {payment.club_member_payee_details.full_name}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[160px]">Email</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {payment.club_member_payee_details.email}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[160px]">Mobile</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {payment.club_member_payee_details.mobile}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[160px]">Gender</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium capitalize">
                    {payment.club_member_payee_details.gender}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[160px]">User Type</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium capitalize">
                    {payment?.club_member_payee_details.user_type?.replace(/_/g, " ")}
                  </span>
                </div>
                {payment.club_member_payee_details.flat && (
                  <div className="flex items-start">
                    <span className="text-gray-500 min-w-[160px]">Flat</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">
                      {payment.club_member_payee_details.flat}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </ClassFormSection>
        )}

        {/* Club Member Allocation Details */}
        {payment.club_member_allocation_details && (
          <ClassFormSection title="Membership Allocation Details" icon={<Calendar />}>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[160px]">Membership Plan</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {payment.club_member_allocation_details.membership_plan_name}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[160px]">Status</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium capitalize">
                    {payment.club_member_allocation_details.status}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[160px]">Start Date</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {payment.club_member_allocation_details.start_date}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[160px]">End Date</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {payment.club_member_allocation_details.end_date}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[160px]">Preferred Start Date</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {payment.club_member_allocation_details.preferred_start_date}
                  </span>
                </div>
                {payment.club_member_allocation_details.emergency_contact_name && (
                  <div className="flex items-start">
                    <span className="text-gray-500 min-w-[160px]">Emergency Contact</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">
                      {payment.club_member_allocation_details.emergency_contact_name}
                    </span>
                  </div>
                )}
                {payment.club_member_allocation_details.referred_by && (
                  <div className="flex items-start">
                    <span className="text-gray-500 min-w-[160px]">Referred By</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">
                      {payment.club_member_allocation_details.referred_by}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </ClassFormSection>
        )}

        {/* Amount Details */}
        <ClassFormSection title="Amount Details" icon={<DollarSign />}>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[160px]">Sub Total</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {formatAmount(payment.sub_total)}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[160px]">GST</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {formatAmount(payment.gst)}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[160px]">SGST</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {formatAmount(payment.sgst)}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[160px]">Discount</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {payment.club_member_allocation_details?.payment_detail?.discount
                    ? `₹${parseFloat(payment.club_member_allocation_details.payment_detail.discount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
                    : formatAmount(payment.discount)}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[160px]">
                  Convenience Charge
                </span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {formatAmount(payment.convenience_charge)}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[160px] font-semibold">
                  Total Amount
                </span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium font-bold text-lg">
                  {payment.club_member_allocation_details?.payment_detail?.landed_amount
                    ? `₹${parseFloat(payment.club_member_allocation_details.payment_detail.landed_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
                    : formatAmount(payment.total_amount)}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[160px] font-semibold">
                  Paid Amount
                </span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="font-semibold text-green-600">
                  {formatAmount(payment.paid_amount)}
                </span>
              </div>
            </div>
          </div>
        </ClassFormSection>

        {/* Attachments */}
        {payment.attachments && payment.attachments.length > 0 && (
          <ClassFormSection title="Attachments" icon={<Paperclip />}>
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {payment.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex flex-col border border-gray-200 rounded-lg overflow-hidden bg-white hover:border-brand transition-colors group"
                  >
                    {attachment.document_content_type.startsWith("image/") ? (
                      <div className="h-32 bg-gray-100 flex items-center justify-center overflow-hidden">
                        <img
                          src={attachment.attachment_url}
                          alt={attachment.document_file_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="h-32 bg-gray-100 flex items-center justify-center">
                        <FileText className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="p-3 flex flex-col gap-1">
                      <p className="text-sm font-medium text-gray-900 truncate" title={attachment.document_file_name}>
                        {attachment.document_file_name}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">
                          {formatFileSize(attachment.document_file_size)}
                        </span>
                        <a
                          href={attachment.attachment_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-full hover:bg-gray-100 text-brand transition-colors"
                          title="View Attachment"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ClassFormSection>
        )}

        {/* Payment Method Details */}
        <ClassFormSection title="Payment Method" icon={<CreditCard />}>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[160px]">Payment Method</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {payment.payment_method || "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[160px]">Payment Mode</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {payment.payment_mode || "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[160px]">
                  Payment Gateway
                </span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {payment.payment_gateway || "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[160px]">Card Type</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {payment.card_type || "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[160px]">Receipt Number</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {payment.receipt_number || "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[160px]">
                  PG Transaction ID
                </span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium font-mono text-sm">
                  {payment.pg_transaction_id || "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[160px]">
                  PG Response Code
                </span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {payment.pg_response_code || "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[160px]">
                  PG Response Message
                </span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {payment.pg_response_msg || "-"}
                </span>
              </div>
            </div>
          </div>
        </ClassFormSection>

        {/* Bank Details (if applicable) */}
        {(payment.cheque_number ||
          payment.bank_name ||
          payment.neft_reference) && (
            <ClassFormSection title="Bank Details" icon={<Building2 />}>
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start">
                    <span className="text-gray-500 min-w-[160px]">Bank Name</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">
                      {payment.bank_name || "-"}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-500 min-w-[160px]">IFSC Code</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">
                      {payment.ifsc || "-"}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-500 min-w-[160px]">Branch</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">
                      {payment.branch || "-"}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-500 min-w-[160px]">
                      Cheque Number
                    </span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">
                      {payment.cheque_number || "-"}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-500 min-w-[160px]">Cheque Date</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">
                      {formatDate(payment.cheque_date)}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-500 min-w-[160px]">
                      NEFT Reference
                    </span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">
                      {payment.neft_reference || "-"}
                    </span>
                  </div>
                </div>
              </div>
            </ClassFormSection>
          )}

        {/* Refund Details (if applicable) */}
        {payment.refunded_amount && (
          <ClassFormSection title="Refund Details" icon={<RefreshCcw />}>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[160px] font-semibold">
                    Refunded Amount
                  </span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="font-semibold text-red-600">
                    {formatAmount(payment.refunded_amount)}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[160px]">Refund Mode</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {payment.refund_mode || "-"}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[160px]">
                    Refund Transaction No
                  </span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {payment.refund_transaction_no || "-"}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[160px]">Refunded By</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {payment.refunded_by || "-"}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[160px]">Refunded On</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {formatDate(payment.refunded_on)}
                  </span>
                </div>
                {payment.refund_note && (
                  <div className="flex items-start">
                    <span className="text-gray-500 min-w-[160px]">
                      Refund Note
                    </span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">
                      {payment.refund_note}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </ClassFormSection>
        )}

        {/* Reconciliation & Timestamps */}
        <ClassFormSection title="Reconciliation & Timestamps" icon={<Clock />}>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[160px]">
                  Reconciliation Status
                </span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {payment.recon_status || "Not Reconciled"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[160px]">Reconciled By</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {payment.reconciled_by || "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[160px]">Reconciled On</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {formatDate(payment.reconciled_on)}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[160px]">Created At</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {formatDate(payment.created_at)}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[160px]">Updated At</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {formatDate(payment.updated_at)}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[160px]">Created By ID</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {payment.created_by_id || "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[160px]">User ID</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {payment.user_id || "-"}
                </span>
              </div>
            </div>
          </div>
        </ClassFormSection>

        {/* Notes (if applicable) */}
        {payment.notes && (
          <ClassFormSection title="Notes" icon={<FileText />}>
            <div>
              <p className="text-base text-gray-900">{payment.notes}</p>
            </div>
          </ClassFormSection>
        )}
      </div>
    </div>
  );
};

export default PaymentDetailPage;
