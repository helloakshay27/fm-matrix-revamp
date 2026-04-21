import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import {
  FacilityBookingDetails,
  fetchBookingDetails,
  getLogs,
} from "@/store/slices/facilityBookingsSlice";
import { ArrowLeft, Logs, Ticket, CreditCard, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CustomTabs } from "@/components/CustomTabs";
import { LogsTimeline } from "@/components/LogTimeline";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select';
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import Invoice from '@/components/Invoice';
import { API_CONFIG } from '@/config/apiConfig';
import { getToken } from '@/utils/auth';
import Receipt from "@/components/Reciept";
import BookingReceipt from "@/components/BookingReceipt";
import {
  CloudUpload,
  PictureAsPdf,
  Image,
  Description,
  AudioFile,
  VideoLibrary,
  AttachFile,
} from '@mui/icons-material';
import { Close as CloseIcon } from '@mui/icons-material';

// Formatter helper: Converts facility booking API response into Invoice-compatible format
const formatFacilityBookingInvoice = (apiResponse: any): any => {
  const invoiceData = apiResponse?.invoice_data;
  if (!invoiceData) return null;

  const invoice = invoiceData?.invoice || {};
  const member = invoiceData?.member || {};
  const booking = invoiceData?.booking || {};
  const lineItems = invoiceData?.line_items || [];
  const totals = invoiceData?.totals || {};

  return {
    id: invoice.invoice_number || apiResponse?.booking_id || 'FB-' + apiResponse?.booking_id,
    created_at: invoice.invoice_date || new Date().toLocaleDateString('en-IN'),
    booking_id: apiResponse?.booking_id,
    bill_id: apiResponse?.bill_id,
    club_members: [{
      user_name: member.full_name || 'Guest',
      user_email: member.email || '',
      user_mobile: member.mobile || '',
    }],
    membership_plan: { name: booking.facility_name || 'Facility Booking' },
    site_name: 'Site',
    facility_name: booking.facility_name || 'Facility Booking',
    startdate: booking.startdate,
    allocation_payment_detail: {
      base_amount: lineItems[0]?.rate || 0,
      discount: totals.discount || 0,
      cgst: totals.cgst || 0,
      sgst: totals.sgst || 0,
      cgst_per: 9,
      sgst_per: 9,
      total_tax: (totals.cgst || 0) + (totals.sgst || 0),
      total_amount: totals.total_amount || 0,
      payment_mode: 'online',
      payment_status: invoiceData?.status || 'pending',
    },
    invoice_data: {
      lock_account_bill_id: invoiceData.lock_account_bill_id,
      invoice: invoice,
      member: member,
      booking: booking,
      line_items: lineItems,
      totals: totals,
    },
  };
};

export const AmenityBookingDetailsClubPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  const [bookings, setBookings] = useState<FacilityBookingDetails | null>(null);
  console.log(bookings)
  const [statusUpdating, setStatusUpdating] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [logs, setLogs] = useState([
    {
      id: "",
      description: "",
      timestamp: "",
    }
  ]);
  // Cancel modal state
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Payment modal state
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [paymentMode, setPaymentMode] = useState('online');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [transactionId, setTransactionId] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Invoice PDF state
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [autoDownloadInvoice, setAutoDownloadInvoice] = useState(false);
  const [collectedPDF, setCollectedPDF] = useState<{ bill_id: number | string; base64: string; filename: string } | null>(null);
  const [isUploadingPDF, setIsUploadingPDF] = useState(false);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);

  // Attachment state
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragDropRef = useRef<HTMLDivElement>(null);

  // Handle when PDF is generated
  const handleBase64Generated = (base64: string) => {
    console.log('PDF generated from Invoice');
    setIsGeneratingInvoice(false);
    const billId = invoiceData?.bill_id || invoiceData?.booking_id;

    if (billId) {
      setCollectedPDF({
        bill_id: billId,
        base64: base64,
        filename: `invoice_${invoiceData?.id}.pdf`
      });
      console.log('PDF collected with bill_id:', billId);
    }
  };

  // Send PDF to API
  const handleUploadPDFToAPI = async () => {
    if (!collectedPDF) {
      toast.error('No PDF to upload');
      return;
    }

    setIsUploadingPDF(true);
    try {
      const savedToken = getToken();

      console.log('Uploading PDF with bill_id:', collectedPDF.bill_id);

      // Build the bills array for API
      const billsPayload = [
        {
          bill_id: collectedPDF.bill_id,
          attachment_type: 'facility_booking_payment',
          filename: collectedPDF.filename,
          file: collectedPDF.base64 // Contains the data:image/png;base64,... format
        }
      ];

      console.log('Bills payload:', billsPayload);

      // Send to API
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/lock_account_bills/bulk_attach_invoice.json`,
        { bills: billsPayload },
        {
          headers: {
            Authorization: `Bearer ${savedToken}`,
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success('Invoice uploaded successfully!');
        console.log('PDF uploaded successfully');

        // Reset states and refresh
        setCollectedPDF(null);
        setShowInvoice(false);
        setInvoiceData(null);
        setOpenPaymentModal(false);

        // Refresh booking details after a short delay
        setTimeout(() => {
          fetchDetails();
        }, 1000);
      }
    } catch (error: any) {
      console.error('Error uploading PDF:', error);
      const errorMsg = axios.isAxiosError(error) ? error.response?.data?.message || error.message : 'Failed to upload invoice';
      toast.error(errorMsg);

      // Still refresh after delay
      setTimeout(() => {
        fetchDetails();
      }, 2000);
    } finally {
      setIsUploadingPDF(false);
    }
  };

  // Auto-upload PDF when collected
  useEffect(() => {
    if (collectedPDF && !isUploadingPDF && showInvoice) {
      console.log('PDF collected, auto-uploading...');
      const timer = setTimeout(() => {
        handleUploadPDFToAPI();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [collectedPDF, isUploadingPDF, showInvoice]);

  // Close invoice display
  const handleCloseInvoice = () => {
    setShowInvoice(false);
    setInvoiceData(null);
    setCollectedPDF(null);
  };

  // Payment API handler
  const handlePayment = async () => {
    if (!id) return;
    setPaymentLoading(true);
    try {
      let data: any;
      let headers: any = { Authorization: `Bearer ${token}` };

      if (attachments.length > 0) {
        const formData = new FormData();
        formData.append('lock_payment[payment_mode]', paymentMode);
        formData.append('lock_payment[payment_method]', paymentMethod);
        formData.append('lock_payment[pg_transaction_id]', transactionId);
        attachments.forEach((file) => {
          formData.append('attachments[]', file);
        });
        data = formData;
        headers['Content-Type'] = 'multipart/form-data';
      } else {
        data = {
          lock_payment: {
            payment_mode: paymentMode,
            payment_method: paymentMethod,
            pg_transaction_id: transactionId
          }
        };
        headers['Content-Type'] = 'application/json';
      }

      const response = await axios.post(
        `https://${baseUrl}/pms/admin/facility_bookings/${id}/payment`,
        data,
        { headers }
      );
      toast.success('Payment request sent successfully!');

      // Clear attachments on success
      setAttachments([]);

      // Format and display invoice
      const responseData = response.data;
      if (responseData.invoice_data) {
        const formattedInvoice = formatFacilityBookingInvoice(responseData);
        if (formattedInvoice) {
          console.log('Displaying invoice:', formattedInvoice);
          setInvoiceData(formattedInvoice);
          setShowInvoice(true);
          setIsGeneratingInvoice(true);
          setAutoDownloadInvoice(true);
          setOpenPaymentModal(false);
        } else {
          setOpenPaymentModal(false);
          fetchDetails();
        }
      } else {
        setOpenPaymentModal(false);
        fetchDetails();
      }
    } catch (error) {
      toast.error('Failed to send payment request');
      console.error('Payment error:', error);
      // Clear attachments on error
      setAttachments([]);
    } finally {
      setPaymentLoading(false);
    }
  };

  // Cancel Booking API handler
  const handleCancelBooking = async () => {
    if (!id || !bookings?.user_id) {
      toast.error('User ID not found in booking details. Cannot cancel booking.');
      return;
    }
    try {
      await axios.patch(
        `https://${baseUrl}/pms/admin/facility_bookings/${id}`,
        {
          facility_booking: {
            canceled_by: 'user',
            canceler_id: bookings.user_id,
            comment: 'User cancelled via API',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success('Booking cancelled successfully!');
      setShowCancelModal(false); // Close the modal after success
      fetchDetails();
    } catch (error) {
      toast.error('Failed to cancel booking');
      console.error('Cancel booking error:', error);
    }
  };

  const getFileTypeInfo = useCallback((fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    if (['pdf'].includes(ext)) {
      return { icon: PictureAsPdf, color: '#DC2626', bgColor: '#FEE2E2', type: 'PDF' };
    }
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
      return { icon: Image, color: '#2563EB', bgColor: '#DBEAFE', type: 'Image' };
    }
    if (['mp3', 'wav', 'aac', 'flac', 'm4a'].includes(ext)) {
      return { icon: AudioFile, color: '#9333EA', bgColor: '#F3E8FF', type: 'Audio' };
    }
    if (['mp4', 'avi', 'mov', 'mkv', 'webm'].includes(ext)) {
      return { icon: VideoLibrary, color: '#EA580C', bgColor: '#FFEDD5', type: 'Video' };
    }
    if (['doc', 'docx', 'txt', 'rtf', 'xlsx', 'xls', 'csv', 'ppt', 'pptx'].includes(ext)) {
      return { icon: Description, color: '#16A34A', bgColor: '#DCFCE7', type: 'Document' };
    }
    return { icon: AttachFile, color: '#6B7280', bgColor: '#F3F4F6', type: 'File' };
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const validateAndAddFiles = useCallback((filesToAdd: File[]) => {
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    filesToAdd.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        invalidFiles.push(`${file.name} (${formatFileSize(file.size)})`);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      toast.dismiss();
      invalidFiles.forEach((fileName) => {
        toast.error(`${fileName} exceeds 10MB limit`);
      });
    }

    if (validFiles.length > 0) {
      setAttachments([...attachments, ...validFiles]);
      toast.dismiss();
      toast.success(`${validFiles.length} file(s) added successfully`);
    }
  }, [attachments]);

  const handleDrag = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    const files = Array.from(e.dataTransfer.files || []) as File[];
    if (files.length > 0) {
      validateAndAddFiles(files);
    }
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length > 0) {
      validateAndAddFiles(files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const fetchDetails = async () => {
    try {
      const response = await dispatch(
        fetchBookingDetails({ baseUrl, token, id })
      ).unwrap();
      setBookings(response);
    } catch (error) {
      console.error("Error fetching booking details:", error);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await dispatch(
        getLogs({ baseUrl, token, id })
      ).unwrap();
      setLogs(response.logs.map((log, index) => ({
        id: index,
        description: log.text,
        timestamp: log.date + " " + log.time,
      })));
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  useEffect(() => {
    fetchDetails();
    fetchLogs();
  }, []);

  const handleStatusChange = async (newStatus: string) => {
    setStatusUpdating(id);
    try {
      await axios.patch(
        `https://${baseUrl}/pms/admin/facility_bookings/${id}.json`,
        { current_status: newStatus.toLowerCase() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`Booking ${id} status updated to ${newStatus}`);
      fetchDetails();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleDownloadInvoice = async () => {
    const loadingToast = toast.loading('Generating invoice...');
    try {
      const response = await axios.get(
        `https://${baseUrl}/pms/admin/facility_bookings/${id}/invoice.json`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob', // Important for PDF download
        }
      );

      // Create a blob from the response
      const blob = new Blob([response.data], { type: 'application/pdf' });

      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;

      // Generate filename with current date
      const date = new Date().toISOString().split('T')[0];
      link.download = `facility_booking_invoice_${id}_${date}.pdf`;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      window.URL.revokeObjectURL(downloadUrl);

      toast.success('Invoice downloaded successfully', { id: loadingToast });
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice', { id: loadingToast });
    }
  };

  console.log(logs)

  const tabs = [
    {
      value: "details",
      label: "Details",
      content: (
        <div className="bg-white rounded-lg shadow border-2 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
              <Ticket className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">BOOKING DETAILS</h3>
          </div>
          <div
            className="grid grid-cols-3 gap-8 px-3"
          >

            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Booking ID</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {bookings?.id}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Comment</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium truncate max-w-[170px] overflow-hidden whitespace-nowrap" title={bookings?.comment}>
                  {bookings?.comment}
                </span>
              </div>
              {/* <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Status</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className={`text-gray-900 px-2 py-[2px] flex items-center gap-2 text-sm ${bookings?.current_status === "Cancelled"
                  ? "bg-red-100"
                  : bookings?.current_status === "Confirmed"
                    ? "bg-green-100"
                    : "bg-yellow-100"
                  }`} title={bookings?.comment} style={{ borderRadius: "4px" }}>
                  <span className={`rounded-full w-2 h-2 inline-block ${bookings?.current_status === "Cancelled"
                    ? "bg-[#D92E14]"
                    : bookings?.current_status === "Confirmed"
                      ? "bg-[#16B364]"
                      : "bg-[#D9CA20]"
                    }`}></span>
                  {bookings?.current_status}
                </span>
              </div> */}

              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Status</span>
                <span className="text-gray-500 mx-2">:</span>

                <Select
                  value={bookings?.current_status}
                  onValueChange={(newStatus) => handleStatusChange(newStatus)}
                >
                  <SelectTrigger className="border-none bg-transparent p-0 h-auto [&>svg]:hidden">
                    <div
                      className={`text-gray-900 px-2 py-[2px] flex items-center gap-2 text-sm cursor-pointer ${bookings?.current_status === "Cancelled"
                        ? "bg-red-100"
                        : bookings?.current_status === "Confirmed"
                          ? "bg-green-100"
                          : "bg-yellow-100"
                        }`}
                      style={{ borderRadius: "4px" }}
                      title={bookings?.comment}
                    >
                      <span
                        className={`rounded-full w-2 h-2 inline-block ${bookings?.current_status === "Cancelled"
                          ? "bg-[#D92E14]"
                          : bookings?.current_status === "Confirmed"
                            ? "bg-[#16B364]"
                            : "bg-[#D9CA20]"
                          }`}
                      ></span>
                      {bookings?.current_status}
                    </div>
                  </SelectTrigger>
                  {
                    bookings?.fac_type === "Request" && <SelectContent>
                      <SelectItem value="Pending">
                        Pending
                      </SelectItem>

                      <SelectItem value="Confirmed">
                        Confirmed
                      </SelectItem>

                      <SelectItem value="Cancelled">
                        Cancelled
                      </SelectItem>
                    </SelectContent>
                  }
                </Select>
              </div>


              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Payment Method</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {bookings?.payment_method === "NA"
                    ? "Complimentory"
                    : bookings?.payment_method
                      ?.split('_')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Booked by</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {bookings?.booked_by_name}
                </span>
              </div>
              {(bookings?.payment_method !== 'complementary' && bookings?.payment_method !== "NA") && (
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">CGST</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {bookings?.gst || "-"}%
                  </span>
                </div>
              )}
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Scheduled Date</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {bookings?.startdate
                    ? (() => {
                      const d = bookings.startdate.split(" ")[0];
                      const [year, month, day] = d.split("-");
                      return `${day}/${month}/${year.slice(-2)}`;
                    })()
                    : "-"}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Schedule Slot</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium truncate max-w-[170px] overflow-hidden whitespace-nowrap" title={bookings?.show_schedule_24_hour}>
                  {bookings?.show_schedule_24_hour}
                </span>
              </div>

              {(bookings?.payment_method !== 'complementary' && bookings?.payment_method !== "NA") && (
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">SGST</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {bookings?.sgst || "-"}%
                  </span>
                </div>
              )}
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Booked On</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {bookings?.created_at
                    ? new Date(bookings.created_at.replace(' +0530', '').replace(/-/g, '/')).toLocaleString('en-GB', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })
                    : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      value: "payment",
      label: "Payment Details",
      content: (
        <div className="bg-white rounded-lg shadow border-2 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                <CreditCard className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">PAYMENT DETAILS</h3>
            </div>
            <Button
              onClick={handleDownloadInvoice}
              className="bg-[#C72030] hover:bg-[#A01020] text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Invoice
            </Button>
          </div>

          <div className="space-y-6">
            {/* Payment Summary */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h4 className="font-semibold text-gray-900 mb-3">Payment Summary</h4>

              {/* Number of Slots Selected */}
              {bookings?.selected_slots && bookings.selected_slots.length > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200 bg-blue-50">
                  <span className="text-gray-700 font-medium">Number of Slots Selected</span>
                  <span className="font-semibold text-blue-600">{bookings.selected_slots.length}</span>
                </div>
              )}

              {/* Member Charge */}
              {bookings?.member_count != null && bookings.member_count > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">Member Charge</span>
                    <span className="text-sm text-gray-500">({bookings.member_count} member{bookings.member_count > 1 ? 's' : ''})</span>
                  </div>
                  <span className="font-medium">₹{((bookings?.member_charges || 0)).toFixed(2)}</span>
                </div>
              )}

              {/* Guest Charge */}
              {bookings?.guest_count != null && bookings.guest_count > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">Guest Charge</span>
                    <span className="text-sm text-gray-500">({bookings.guest_count} guest{bookings.guest_count > 1 ? 's' : ''})</span>
                  </div>
                  <span className="font-medium">₹{((bookings?.guest_charges || 0)).toFixed(2)}</span>
                </div>
              )}

              {/* Slot Charges */}
              {bookings?.slot_charges != null && bookings.slot_charges > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">Slot Charges</span>
                    <span className="text-sm text-gray-500">({bookings.selected_slots?.length || 0} slot{(bookings.selected_slots?.length || 0) > 1 ? 's' : ''})</span>
                  </div>
                  <span className="font-medium">₹{bookings.slot_charges.toFixed(2)}</span>
                </div>
              )}

              {/* Accessories Charges */}
              {bookings?.facility_booking_accessories && bookings.facility_booking_accessories.length > 0 && (
                <div className="space-y-2 py-2 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-medium">Accessories Charges</span>
                    <span className="text-sm text-gray-500">({bookings.facility_booking_accessories.length} item{bookings.facility_booking_accessories.length > 1 ? 's' : ''})</span>
                  </div>
                  {bookings.facility_booking_accessories.map((item, index) => (
                    <div key={index} className="flex justify-between items-center pl-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{item.facility_booking_accessory.name}</span>
                        <span className="text-xs text-gray-400">({item.facility_booking_accessory.quantity} x ₹{item.facility_booking_accessory?.price?.toFixed(2)})</span>
                      </div>
                      <span className="text-sm font-medium">₹{item.facility_booking_accessory.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Subtotal */}
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-700 font-medium">Subtotal</span>
                <span className="text-gray-900 font-medium">
                  ₹{(
                    (bookings?.member_charges || 0) +
                    (bookings?.guest_charges || 0) +
                    (bookings?.slot_charges || 0) +
                    (bookings?.facility_booking_accessories?.reduce((acc, curr) => acc + curr.facility_booking_accessory.total, 0) || 0)
                  ).toFixed(2)}
                </span>
              </div>

              {/* Discount */}
              {bookings?.discount != null && bookings.discount > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-green-600 font-medium"> ₹{bookings.discount.toFixed(2)}</span>
                </div>
              )}

              {/* Subtotal After Discount */}
              {bookings?.discount != null && bookings.discount > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700 font-medium">Subtotal After Discount</span>
                  <span className="font-medium">₹{((bookings.sub_total || 0))}</span>
                </div>
              )}

              {/* CGST */}
              {bookings?.cgst_amount != null && bookings.cgst_amount > 0 && bookings?.payment_method !== 'complementary' && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">CGST</span>
                    {bookings?.gst != null && <span className="text-sm text-gray-500">({bookings.gst}%)</span>}
                  </div>
                  <span className="text-gray-900 font-medium">₹{bookings.cgst_amount.toFixed(2)}</span>
                </div>
              )}

              {/* SGST */}
              {bookings?.sgst_amount != null && bookings.sgst_amount > 0 && bookings?.payment_method !== 'complementary' && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">SGST</span>
                    {bookings?.sgst != null && <span className="text-sm text-gray-500">({bookings.sgst}%)</span>}
                  </div>
                  <span className="text-gray-900 font-medium">₹{bookings.sgst_amount.toFixed(2)}</span>
                </div>
              )}

              {/* Convenience Charge */}
              {bookings?.conv_charge && bookings.conv_charge > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Convenience Charge</span>
                  <span className="text-gray-900 font-medium">₹{bookings.conv_charge.toFixed(2)}</span>
                </div>
              )}

              {/* Grand Total */}
              <div className="flex justify-between items-center py-3 bg-[#8B4B8C] bg-opacity-10 px-4 rounded-lg mt-2">
                <span className="text-lg font-bold" style={{ color: '#8B4B8C' }}>Grand Total</span>
                <span className="text-lg font-bold" style={{ color: '#8B4B8C' }}>₹{bookings?.amount_full?.toFixed(2) || '0.00'}</span>
              </div>
            </div>

            {/* Payment Information */}
            {/* <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[150px]">Payment Status</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    bookings?.payment_status === 'Paid' 
                      ? 'bg-green-100 text-green-800' 
                      : bookings?.payment_status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {bookings?.payment_status || 'NA'}
                  </span>
                </div>

                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[150px]">Payment Method</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {bookings?.payment_method === "NA" ? "Complimentary" : bookings?.payment_method || '-'}
                  </span>
                </div>

                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[150px]">Payment Mode</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {bookings?.payment_mode || 'NA'}
                  </span>
                </div>

                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[150px]">Amount Paid</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {bookings?.amount_paid ? `₹${bookings.amount_paid.toFixed(2)}` : 'NA'}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[150px]">PG State</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {bookings?.pg_state || 'NA'}
                  </span>
                </div>

                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[150px]">Transaction ID</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium break-all">
                    {bookings?.pg_transaction_id || 'NA'}
                  </span>
                </div>

                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[150px]">Response Code</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {bookings?.pg_response_code || 'NA'}
                  </span>
                </div>

                {bookings?.deposit_amount && bookings.deposit_amount > 0 && (
                  <div className="flex items-start">
                    <span className="text-gray-500 min-w-[150px]">Deposit Amount</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">
                      ₹{bookings.deposit_amount.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div> */}

            {/* Booked Members */}
            {bookings?.booked_members && bookings.booked_members.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Booked Members</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#E5E0D3]">
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Sr No.</th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Name</th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Mobile</th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Type</th>
                        <th className="border border-gray-300 px-4 py-3 text-right font-semibold">Charge</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.booked_members.map((member: { booked_member: { id: number; name: string | null; mobile: string | null; oftype: string; charge: number | null; total: number; total_charge: number } }, index: number) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-3">{index + 1}</td>
                          <td className="border border-gray-300 px-4 py-3">
                            {member.booked_member?.name || '-'}
                          </td>
                          <td className="border border-gray-300 px-4 py-3">
                            {member.booked_member?.mobile || '-'}
                          </td>
                          <td className="border border-gray-300 px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${member.booked_member?.oftype === 'primary'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                              }`}>
                              {member.booked_member?.oftype || '-'}
                            </span>
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-right">
                            ₹{member.booked_member?.total_charge?.toFixed(2) || '0.00'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      value: "logs",
      label: "Logs",
      content: (
        <div className="bg-white rounded-lg shadow border-2 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
              <Logs className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">LOGS</h3>
          </div>
          <div className="overflow-x-auto px-3">
            <LogsTimeline logs={logs} />
          </div>
        </div>
      )
    }
  ]

  if (!bookings) {
    return <div className="p-10 text-gray-600">Loading booking details...</div>;
  }

  return (
    <div className="p-[30px] min-h-screen bg-transparent">
      {showInvoice && invoiceData ? (
        <div className="w-full">
          {/* Loading Overlay while generating or uploading invoice */}
          {(isGeneratingInvoice || isUploadingPDF) && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-2xl p-8 text-center max-w-sm">
                <div className="mb-6 flex justify-center">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-spin" style={{
                      backgroundClip: 'padding-box',
                      padding: '3px',
                      background: 'conic-gradient(from 0deg, #3b82f6, #1e40af)'
                    }}>
                      <div className="absolute inset-3 bg-white rounded-full"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl animate-spin">⏳</span>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Booking Payment Successfull</h3>
                <p className="text-gray-600 font-medium">
                  Preparing invoicing and sending mail...
                </p>
              </div>
            </div>
          )}

          {/* Invoice Section with blur when generating or uploading */}
          <div className={`w-full transition-all duration-300 ${isGeneratingInvoice || isUploadingPDF ? 'blur-sm opacity-50 pointer-events-none' : ''}`}>
            <div className="fixed top-4 right-4 z-50 flex gap-3">
              {isUploadingPDF ? (
                <Button
                  disabled={true}
                  className="bg-blue-600 text-white"
                >
                  <span className="animate-spin mr-2">⏳</span>
                  Uploading Invoice...
                </Button>
              ) : collectedPDF ? (
                <div className="bg-green-50 border border-green-200 rounded-lg shadow-md p-3 flex items-center gap-2">
                  <span className="text-sm font-medium text-green-700">✓ Invoice collected</span>
                  <span className="text-xs text-green-600">Uploading...</span>
                </div>
              ) : (
                <Button
                  disabled={true}
                  className="bg-gray-400 text-white"
                >
                  ⏳ Generating Invoice...
                </Button>
              )}

              <Button
                onClick={handleCloseInvoice}
                disabled={isUploadingPDF || isGeneratingInvoice}
                variant="outline"
                className="bg-white"
              >
                Back
              </Button>
            </div>

            <BookingReceipt
              key={`invoice-${invoiceData?.bill_id}`}
              data={invoiceData}
              returnBase64={true}
              onBase64Generated={handleBase64Generated}
              onClose={handleCloseInvoice}
              showButton={true}
              autoDownload={autoDownloadInvoice}
              isFromDetailsPage={true}
              isFromBookingPage={true}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2 cursor-pointer">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-[24px] font-semibold text-[#1a1a1a]">
              {bookings.facility_name}
            </h1>
          </div>


          {/* Payment & Cancel Button for Pending/Confirmed Status */}

          {(bookings?.current_status === 'Pending' || bookings?.current_status === 'Confirmed') && (
            <div className="flex justify-end mt-6 mb-4 gap-2">
              {bookings?.current_status === 'Pending' && (
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setOpenPaymentModal(true)}>
                  Payment
                </Button>
              )}
              {bookings?.current_status === 'Confirmed' && bookings?.can_cancel_bool && (
                <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => setShowCancelModal(true)}>
                  Cancel Booking
                </Button>
              )}
            </div>
          )}




          {console.log(",,,,", bookings)}
          <div className="bg-white rounded-lg border-2 border-gray-200">
            <CustomTabs tabs={tabs} defaultValue="details" onValueChange={setActiveTab} />
          </div>


          {/* Payment Modal */}
          <Dialog open={openPaymentModal} onOpenChange={(open) => {
            setOpenPaymentModal(open);
            if (!open) {
              setTransactionId('');
              setAttachments([]);
            }
          }}>
            <DialogContent className="sm:max-w-[600px] w-[95vw] bg-white max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Make Payment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 overflow-hidden px-1">
                <div className="w-full">
                  <Label htmlFor="payment_mode">Payment Mode</Label>
                  <Select
                    value={paymentMode}
                    onValueChange={setPaymentMode}
                    disabled={paymentLoading}
                  >
                    <SelectTrigger className="w-full mt-1" id="payment_mode">
                      <SelectValue placeholder="Select Payment Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full">
                  <Label htmlFor="payment_method">Payment Method</Label>
                  <Select
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    disabled={paymentLoading}
                  >
                    <SelectTrigger className="w-full mt-1" id="payment_method">
                      <SelectValue placeholder="Select Payment Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="netbanking">Net Banking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full">
                  <Label htmlFor="transaction_id">Transaction ID</Label>
                  <Input
                    id="transaction_id"
                    type="text"
                    placeholder="Enter transaction ID"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    disabled={paymentLoading}
                    className="w-full mt-1"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Attachments
                    {attachments.length > 0 && (
                      <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-blue-500 rounded-full">
                        {attachments.length}
                      </span>
                    )}
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleAttachmentChange}
                    disabled={paymentLoading}
                    className="hidden"
                    accept="*/*"
                  />
                  <div
                    ref={dragDropRef}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => !paymentLoading && fileInputRef.current?.click()}
                    className={`relative p-6 rounded-lg border-2 border-dashed transition-all cursor-pointer ${isDragActive
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
                      } ${paymentLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <CloudUpload
                        style={{
                          fontSize: 40,
                          color: isDragActive ? '#3B82F6' : '#9CA3AF',
                          marginBottom: 8,
                          transition: 'all 0.3s ease',
                        }}
                      />
                      <p className="text-sm font-medium text-gray-700">Drag files here or click to browse</p>
                      <p className="text-xs text-gray-500 mt-1">Maximum file size: 10MB per file</p>
                    </div>
                  </div>
                  {attachments.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-blue-500 rounded-full">
                          {attachments.length}
                        </span>
                        <button
                          onClick={() => setAttachments([])}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          Clear all
                        </button>
                      </div>
                      <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                        {attachments.map((file, index) => {
                          const fileInfo = getFileTypeInfo(file.name);
                          const IconComponent = fileInfo.icon;
                          return (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded transition-colors"
                            >
                              <div
                                style={{ backgroundColor: fileInfo.bgColor }}
                                className="p-2 rounded flex-shrink-0"
                              >
                                <IconComponent style={{ color: fileInfo.color, fontSize: 20 }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                                <div className="flex items-center gap-2">
                                  <span
                                    style={{ backgroundColor: fileInfo.bgColor, color: fileInfo.color }}
                                    className="text-xs font-medium px-2 py-0.5 rounded"
                                  >
                                    {fileInfo.type}
                                  </span>
                                  <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => removeAttachment(index)}
                                className="text-gray-400 hover:text-red-600 flex-shrink-0 transition-colors"
                              >
                                <CloseIcon style={{ fontSize: 18 }} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-700">
                          <strong>{attachments.length} file(s)</strong> • <strong>{formatFileSize(attachments.reduce((sum, f) => sum + f.size, 0))}</strong>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handlePayment} disabled={paymentLoading} className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                  {paymentLoading ? 'Processing...' : 'Submit Payment'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>


          {/* Cancel Booking Modal */}
          <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Cancel Booking</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-gray-700 text-base">
                  Are you sure you want to cancel this booking?
                </p>
                {bookings?.can_cancel && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                    <span className="text-gray-800 text-sm">
                      You will get a refund of <b>₹{bookings.can_cancel.amount}.</b>
                      {/* ({bookings.can_cancel.return_percentage}% of total amount). */}
                    </span>
                  </div>
                )}
              </div>
              <DialogFooter className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowCancelModal(false)}>
                  Go Back
                </Button>
                <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleCancelBooking}>
                  Cancel Booking
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>



          {/* <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
  <DialogContent className="sm:max-w-[420px]">
    <DialogHeader>
      <DialogTitle className="text-lg font-semibold text-red-600">
        Cancel This Booking?
      </DialogTitle>
    </DialogHeader>

    <div className="space-y-4">
      <p className="text-gray-700 text-sm leading-relaxed">
        If you proceed, this booking will be permanently cancelled and cannot be restored.
      </p>

      {bookings?.can_cancel && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
          <p className="text-xs text-gray-500 mb-1">
            Refund Details
          </p>

          <p className="text-base font-semibold text-gray-900">
            ₹{bookings.can_cancel.amount}
          </p>

          <p className="text-xs text-gray-600">
            {bookings.can_cancel.return_percentage}% of total booking amount
          </p>
        </div>
      )}
    </div>

    <DialogFooter className="flex gap-3 justify-end pt-2">
      <Button
        variant="outline"
        onClick={() => setShowCancelModal(false)}
        className="min-w-[100px]"
      >
        Keep Booking
      </Button>

      <Button
        className="bg-red-600 hover:bg-red-700 text-white min-w-[140px]"
        onClick={handleCancelBooking}
      >
        Confirm Cancellation
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog> */}

        </>
      )}
    </div>
  );
};
