import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Download, User, Mail, Phone, Calendar, CreditCard, Building2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { API_CONFIG } from '@/config/apiConfig';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import axios from 'axios';
import Invoice from '@/components/Invoice';
import { getToken } from '@/utils/auth';
import Receipt from '@/components/Reciept';

interface Attachment {
  id: number;
  relation: string;
  relation_id: number;
  document: string;
}

interface Address {
  id: number;
  address: string | null;
  address_line_two?: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  pin_code: string | null;
  address_type?: string | null;
  active: boolean | null;
  resource_id: number;
  resource_type: string;
}

interface ClubMember {
  id: number;
  user_id: number;
  pms_site_id: number;
  club_member_enabled: boolean;
  membership_number: string;
  access_card_enabled: boolean;
  access_card_id: string | null;
  start_date: string | null;
  end_date: string | null;
  preferred_start_date?: string | null;
  created_at: string;
  updated_at: string;
  user_name: string;
  site_name: string;
  user_email: string;
  user_mobile: string;
  attachments: Attachment[];
  identification_image: string | null;
  avatar: string;
  emergency_contact_name?: string;
  referred_by?: string;
  active?: boolean;
  face_added?: boolean;
  created_by_id?: number;
  current_age?: number | null;
  gender?: string | null;
  snag_answers?: any[];
  user: {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    mobile: string;
    birth_date: string | null;
    gender: string | null;
    user_type: string;
    addresses: Address[];
    full_name?: string;
    country_code?: string;
    company_id?: number;
    site_id?: number;
  };
}

interface GroupMembershipDetail {
  id: number;
  membership_plan_id: number;
  pms_site_id: number;
  start_date: string | null;
  end_date: string | null;
  preferred_start_date?: string | null;
  referred_by?: string;
  club_members: ClubMember[];
  allocation_payment_detail?: {
    id: number;
    club_member_allocation_id: number;
    base_amount: string;
    discount: string;
    cgst: string;
    sgst: string;
    total_tax: string;
    total_amount: string;
    landed_amount: string;
    payment_mode: string;
    payment_status: string;
    created_at: string;
    updated_at: string;
    payment_plan: {
      id: number;
      name: string;
      duration_in_months: number;
    }
  } | null;
}

// Update MembershipPlan interface
interface MembershipPlan {
  id: number;
  name: string;
  advance_booking_in_days: number | null;
  usage_limits: string;
  price?: string;
  renewal_terms?: string;
  user_limit?: number;
}

// Add BillDetail interface after other interfaces
interface BillDetail {
  id: number;
  lock_account_id: number | null;
  society_id: number;
  society_flat_id: number | null;
  ledger_id: number | null;
  bill_number: string;
  due_date: string;
  total_amount: number;
  note: string | null;
  bill_cycle_id: number;
  status: string;
  publish: boolean | null;
  mail_sent: boolean | null;
  published_by: number | null;
  published_on: string | null;
  billed_to_type: string;
  billed_to: number;
  bill_frequency_id: number;
  billing_date: string | null;
  charged_amount: number | null;
  balance_amount: number | null;
  irn_no: string | null;
  ack_no: string | null;
  ack_date: string | null;
  roundoff_diff: number | null;
  after_roundoff_amount: number | null;
  lock_account_bill_charges: Array<{
    id: number;
    name: string;
    amount: number;
    gst_rate: number;
    gst_amount: number;
    total_amount: number;
    igst_amount: number | null;
    cgst_amount: number | null;
    sgst_amount: number | null;
    quantity: number | null;
    rate: number | null;
  }>;
}

const QUESTION_MAP: { [key: string]: string } = {
  '1': 'Do you have any existing injuries or medical conditions?',
  '2': 'Do you have any physical restrictions or movement limitations?',
  '3': 'Are you currently under medication?',
  '4': 'Have you practiced Pilates before?',
  '5': 'Primary Fitness Goals',
  '6': 'Which sessions are you interested in?',
  '7': 'How did you first hear about The Recess Club?',
  '8': 'What motivates you to join a wellness club?',
  '9': 'What type of updates would you like to receive?',
  '10': 'Preferred Communication Channel',
  '11': 'Profession / Industry',
  '12': 'Company Name',
  '13': 'Are you interested in corporate/group plans for your workplace?'
};

// Add section categorization
const QUESTION_SECTIONS: { [key: string]: { title: string; questionIds: string[] } } = {
  'health': {
    title: 'Health & Wellness Information',
    questionIds: ['1', '2', '3']
  },
  'activity': {
    title: 'Activity Interests',
    questionIds: ['4', '5', '6']
  },
  'lifestyle': {
    title: 'Lifestyle & Communication Insights',
    questionIds: ['7', '8', '9', '10']
  },
  'occupation': {
    title: 'Occupation & Demographics',
    questionIds: ['11', '12']
  }
};

// Formatter helper: Converts payment API response invoice_data into Invoice-compatible format
const formatPaymentInvoice = (invoiceData: any): any => {
  if (!invoiceData) return null;

  const invoice = invoiceData?.invoice || {};
  const member = invoiceData?.member || {};
  const lineItems = invoiceData?.line_items || [];
  const totals = invoiceData?.totals || {};

  return {
    id: invoice.invoice_number || invoiceData?.lock_account_bill_id,
    created_at: invoice.invoice_date || new Date().toLocaleDateString('en-IN'),
    bill_id: invoiceData?.lock_account_bill_id,
    club_members: [{
      user_name: member.full_name || 'Member',
      user_email: member.email || '',
      user_mobile: member.mobile || '',
    }],
    membership_plan: { name: 'Club Membership' },
    site_name: 'Site',
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
      lock_account_bill_id: invoiceData?.lock_account_bill_id,
      invoice: invoice,
      member: member,
      line_items: lineItems,
      totals: totals,
    },
  };
};

export const ClubGroupMembershipDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [membershipData, setMembershipData] = useState<GroupMembershipDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedMemberIndex, setSelectedMemberIndex] = useState(0);
  const [membershipPlanName, setMembershipPlanName] = useState<string>('');
  const [membershipPlanUserLimit, setMembershipPlanUserLimit] = useState<number | null>(null);
  const [loadingPlanName, setLoadingPlanName] = useState(false);
  const [billDetails, setBillDetails] = useState<BillDetail[]>([]);
  const [selectedBill, setSelectedBill] = useState<BillDetail | null>(null);
  const [loadingBill, setLoadingBill] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  // Payment modal state
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [paymentMode, setPaymentMode] = useState('online');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [transactionId, setTransactionId] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragDropRef = useRef<HTMLDivElement>(null);

  // Invoice PDF state
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [autoDownloadInvoice, setAutoDownloadInvoice] = useState(false);
  const [collectedPDF, setCollectedPDF] = useState<{ bill_id: number | string; base64: string; filename: string } | null>(null);
  const [isUploadingPDF, setIsUploadingPDF] = useState(false);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);

  // Helper function to get file type icon and color
  const getFileTypeInfo = useCallback((fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';

    if (['pdf'].includes(ext)) {
      return { icon: PictureAsPdfIcon, color: '#DC2626', bgColor: '#FEE2E2', type: 'PDF' };
    }
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
      return { icon: ImageIcon, color: '#2563EB', bgColor: '#DBEAFE', type: 'Image' };
    }
    if (['mp3', 'wav', 'aac', 'flac', 'm4a'].includes(ext)) {
      return { icon: AudioFileIcon, color: '#9333EA', bgColor: '#F3E8FF', type: 'Audio' };
    }
    if (['mp4', 'avi', 'mov', 'mkv', 'webm'].includes(ext)) {
      return { icon: VideoLibraryIcon, color: '#EA580C', bgColor: '#FFEDD5', type: 'Video' };
    }
    if (['doc', 'docx', 'txt', 'rtf', 'xlsx', 'xls', 'csv', 'ppt', 'pptx'].includes(ext)) {
      return { icon: DescriptionIcon, color: '#16A34A', bgColor: '#DCFCE7', type: 'Document' };
    }
    return { icon: AttachFileIcon, color: '#6B7280', bgColor: '#F3F4F6', type: 'File' };
  }, []);

  // Helper function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Validate file sizes - max 10MB per file
  const validateAndAddFiles = (filesToAdd: File[]) => {
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    filesToAdd.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        invalidFiles.push(`${file.name} (${formatFileSize(file.size)})`);
      } else {
        validFiles.push(file);
      }
    });

    // Show error for oversized files
    if (invalidFiles.length > 0) {
      toast.dismiss();
      invalidFiles.forEach((fileName) => {
        toast.error(`${fileName} exceeds 10MB limit`);
      });
    }

    // Add valid files
    if (validFiles.length > 0) {
      setAttachments([...attachments, ...validFiles]);
      toast.dismiss();
      toast.success(`${validFiles.length} file(s) added successfully`);
    }
  };

  // Drag and drop handlers
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

  // Handle attachment file selection
  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length > 0) {
      validateAndAddFiles(files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove attachment
  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  // Payment API handler
  const handlePayment = async () => {
    if (!selectedBill?.id) return;
    setPaymentLoading(true);
    try {
      const baseUrl = API_CONFIG.BASE_URL;
      const token = API_CONFIG.TOKEN;

      // Create FormData payload
      const formData = new FormData();
      formData.append('bill_id', selectedBill.id.toString());
      formData.append('payment[payment_mode]', paymentMode);
      formData.append('payment[payment_method]', paymentMethod);
      formData.append('payment[pg_transaction_id]', transactionId);

      // Append attachments
      attachments.forEach((file) => {
        formData.append('attachments[]', file);
      });

      const response = await axios.post(
        `${baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`}/club_member_allocations/${id}/payment.json`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      toast.success('Payment request sent successfully!');

      // Format and display invoice
      const responseData = response.data;
      if (responseData.invoice_data) {
        const formattedInvoice = formatPaymentInvoice(responseData.invoice_data);
        if (formattedInvoice) {
          console.log('Displaying invoice:', formattedInvoice);
          setInvoiceData(formattedInvoice);
          setShowInvoice(true);
          setIsGeneratingInvoice(true);
          setAutoDownloadInvoice(true);
          setOpenPaymentModal(false);
          setAttachments([]);
        } else {
          setOpenPaymentModal(false);
          setAttachments([]);
          if (id) {
            fetchBillDetails(Number(id));
          }
        }
      } else {
        setOpenPaymentModal(false);
        setAttachments([]);
        if (id) {
          fetchBillDetails(Number(id));
        }
      }
    } catch (error) {
      toast.error('Failed to send payment request');
      console.error('Payment error:', error);
    } finally {
      setPaymentLoading(false);
    }
  };

  // Handle when PDF is generated
  const handleBase64Generated = (base64: string) => {
    console.log('PDF generated from Invoice');
    const billId = invoiceData?.bill_id || invoiceData?.id;

    if (billId) {
      setCollectedPDF({
        bill_id: billId,
        base64: base64,
        filename: `invoice_${invoiceData?.id}.pdf`
      });
      console.log('PDF collected with bill_id:', billId);
    }
  };

  // Send PDF to API using the same endpoint as AddGroupMembershipPage
  const handleUploadPDFToAPI = async () => {
    if (!collectedPDF) {
      toast.error('No PDF to upload');
      return;
    }

    setIsUploadingPDF(true);
    try {
      const savedToken = getToken();

      console.log('Uploading PDF with bill_id:', collectedPDF.bill_id);

      // Build the bills array for API - same format as AddGroupMembershipPage
      const billsPayload = [
        {
          bill_id: collectedPDF.bill_id,
          attachment_type: 'club_member_payment',
          filename: collectedPDF.filename,
          file: collectedPDF.base64 // Contains the data:image/png;base64,... format
        }
      ];

      console.log('Bills payload:', billsPayload);

      // Send to API using the exact same endpoint as AddGroupMembershipPage
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

        // Reset states and navigate/refresh
        setCollectedPDF(null);
        setShowInvoice(false);
        setInvoiceData(null);

        // Refresh bill details after a short delay
        setTimeout(() => {
          if (id) {
            fetchBillDetails(Number(id));
          }
        }, 1000);
      }
    } catch (error: any) {
      console.error('Error uploading PDF:', error);
      const errorMsg = axios.isAxiosError(error) ? error.response?.data?.message || error.message : 'Failed to upload invoice';
      toast.error(errorMsg);

      // Still refresh after delay
      setTimeout(() => {
        if (id) {
          fetchBillDetails(Number(id));
        }
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

  // Fetch membership details
  useEffect(() => {
    fetchMembershipDetails();
  }, [id]);

  // Fetch membership plan name when membership data is loaded
  useEffect(() => {
    if (membershipData?.membership_plan_id) {
      fetchMembershipPlanName(membershipData.membership_plan_id);
    }
  }, [membershipData?.membership_plan_id]);

  // Fetch bill details when membership data is loaded
  useEffect(() => {
    if (id) {
      fetchBillDetails(Number(id));
    }
  }, [id]);

  const fetchMembershipPlanName = async (planId: number) => {
    setLoadingPlanName(true);
    try {
      const baseUrl = API_CONFIG.BASE_URL;
      const token = API_CONFIG.TOKEN;

      const url = new URL(`${baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`}/membership_plans.json`);
      url.searchParams.append('access_token', token || '');

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch membership plans');
      }

      const data = await response.json();
      const plan = data.plans?.find((p: MembershipPlan) => p.id === planId);

      if (plan) {
        setMembershipPlanName(plan.name);
        setMembershipPlanUserLimit(plan.user_limit || null);
      } else {
        setMembershipPlanName(`Plan #${planId}`);
        setMembershipPlanUserLimit(null);
      }
    } catch (error) {
      console.error('Error fetching membership plan name:', error);
      setMembershipPlanName(`Plan #${planId}`);
      setMembershipPlanUserLimit(null);
    } finally {
      setLoadingPlanName(false);
    }
  };

  const fetchMembershipDetails = async () => {
    setLoading(true);
    try {
      const baseUrl = API_CONFIG.BASE_URL;
      const token = API_CONFIG.TOKEN;

      // baseUrl already includes protocol (https://)
      const url = new URL(`${baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`}/club_member_allocations/${id}.json`);
      url.searchParams.append('access_token', token || '');

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch membership details');
      }

      const data = await response.json();
      setMembershipData(data);

    } catch (error) {
      console.error('Error fetching membership details:', error);
      toast.error('Failed to fetch membership details');
    } finally {
      setLoading(false);
    }
  };

  const fetchBillDetails = async (allocationId: number) => {
    setLoadingBill(true);
    try {
      const baseUrl = API_CONFIG.BASE_URL;
      const token = API_CONFIG.TOKEN;

      const url = new URL(`${baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`}/club_member_allocations/${allocationId}/get_bill_by_allocation`);
      url.searchParams.append('access_token', token || '');

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bill details');
      }

      const data = await response.json();
      // Store all bills as an array
      const billsArray = Array.isArray(data) ? data : [data];
      setBillDetails(billsArray);
      setSelectedBill(null); // Reset selected bill
    } catch (error) {
      console.error('Error fetching bill details:', error);
      toast.error('Failed to fetch bill details');
    } finally {
      setLoadingBill(false);
    }
  };

  const handleBackToList = () => {
    navigate('/club-management/membership/groups');
  };

  const handleEdit = () => {
    navigate(`/club-management/group-membership/${id}/edit`);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${day}/${month}/${year}, ${hours}:${minutes} ${ampm}`;
  };

  const renderStatusBadge = () => {
    if (!membershipData) return null;

    const { start_date, end_date } = membershipData;

    if (!start_date && !end_date) {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          Pending Dates
        </Badge>
      );
    }

    if (!end_date && start_date) {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          Pending EndDate
        </Badge>
      );
    }

    return (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        Approved
      </Badge>
    );
  };

  const getAvatarUrl = (avatar: string) => {
    if (!avatar) return null;
    if (avatar.startsWith('%2F')) {
      return `https://fm-uat-api.lockated.com${decodeURIComponent(avatar)}`;
    }
    return avatar;
  };

  // Helper function to parse answers from snag_answers format
  const parseAnswers = (snagAnswers: any[]) => {
    if (!snagAnswers || snagAnswers.length === 0) return null;

    const groupedAnswers: { [key: string]: Array<{ answer: string; comments?: string }> } = {};

    snagAnswers.forEach((item) => {
      const questionId = String(item.question_id);
      if (!groupedAnswers[questionId]) {
        groupedAnswers[questionId] = [];
      }
      groupedAnswers[questionId].push({
        answer: item.ans_descr || '',
        comments: item.comments || ''
      });
    });

    return groupedAnswers;
  };

  // Helper function to render answer value
  const renderAnswerValue = (questionId: string, answers: Array<{ answer: string; comments?: string }>) => {
    if (!answers || answers.length === 0) return '-';

    // For questions with comments (like question 1)
    if (questionId === '1' && answers.length > 0) {
      const hasYes = answers.some(a => a.answer?.toLowerCase() === 'yes');
      const comments = answers.find(a => a.comments)?.comments;
      return (
        <div>
          <span className="text-gray-900 font-medium">{hasYes ? 'Yes' : 'No'}</span>
          {comments && (
            <p className="text-sm text-gray-600 mt-1 italic">Comments: {comments}</p>
          )}
        </div>
      );
    }

    // For multiple choice questions
    if (answers.length > 1) {
      return (
        <div className="flex flex-wrap gap-2">
          {answers.map((ans, idx) => (
            <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {ans.answer}
              {ans.comments && <span className="ml-1 text-gray-600">({ans.comments})</span>}
            </span>
          ))}
        </div>
      );
    }

    // For single answer questions
    return (
      <span className="text-gray-900 font-medium">
        {answers[0].answer}
        {answers[0].comments && <span className="text-sm text-gray-600 ml-2">({answers[0].comments})</span>}
      </span>
    );
  };

  const handleDownloadPDF = async () => {
    if (!selectedBill?.id) {
      toast.error('Bill ID not found');
      return;
    }

    setDownloadingPDF(true);
    try {
      const baseUrl = API_CONFIG.BASE_URL;
      const token = API_CONFIG.TOKEN;

      const url = new URL(`${baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`}/club_member_allocations/show_pdf`);
      url.searchParams.append('lock_account_bill_id', selectedBill.id.toString());

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      // Get the blob from response
      const blob = await response.blob();

      // Create a download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `Bill_${selectedBill.bill_number || selectedBill.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF');
    } finally {
      setDownloadingPDF(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C72030]"></div>
          <p className="text-gray-600">Loading membership data...</p>
        </div>
      </div>
    );
  }

  if (!membershipData) {
    return (
      <div className="p-4 sm:p-6 min-h-screen">
        <div className="text-center py-12">
          <p className="text-gray-600">Membership not found</p>
          <Button onClick={handleBackToList} className="mt-4">
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  const selectedMember = membershipData.club_members?.[selectedMemberIndex];
  const avatarUrl = selectedMember ? getAvatarUrl(selectedMember.avatar) : null;

  return (
    <>
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
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Membership Payment Successfull</h3>
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

            <Receipt
              key={`invoice-${invoiceData?.bill_id}`}
              data={invoiceData}
              returnBase64={true}
              onBase64Generated={handleBase64Generated}
              onClose={handleCloseInvoice}
              showButton={true}
              autoDownload={autoDownloadInvoice}
              isFromDetailsPage={true}
            />
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-6 min-h-screen">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={handleBackToList}
              className="flex items-center gap-1 hover:text-gray-800 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Membership List
            </button>

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">
                    Group Membership #{membershipData.id}
                  </h1>
                  {renderStatusBadge()}
                </div>
                <div className="text-sm text-gray-600">
                  {membershipData.club_members?.length || 0} Members • Start: {formatDate(membershipData.start_date)} - End: {formatDate(membershipData.end_date)}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleEdit}
                  variant="outline"
                  className="border-[#C72030] text-[#C72030]"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content - Tabs */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="w-full flex flex-wrap bg-gray-50 rounded-t-lg h-auto p-0 text-sm justify-stretch">
                <TabsTrigger
                  value="overview"
                  className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
                >
                  Group Overview
                </TabsTrigger>
                <TabsTrigger
                  value="members"
                  className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
                >
                  Members ({membershipData.club_members?.length || 0})
                </TabsTrigger>
                {membershipData.allocation_payment_detail && (
                  <TabsTrigger
                    value="payment"
                    className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
                  >
                    Payment Plan Details
                  </TabsTrigger>
                )}
                <TabsTrigger
                  value="bill"
                  className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
                >
                  Bill Details
                </TabsTrigger>
                <TabsTrigger
                  value="member-details"
                  className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
                >
                  Member Details
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4 flex items-center gap-3">
                  <User className="w-5 h-5 text-[#C72030]" />
                  Group Membership Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="flex items-start">
                    <span className="text-gray-500 min-w-[140px]">Group ID</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-500 font-medium">{membershipData.id}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-500 min-w-[140px]">Membership Plan</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-500 font-medium">
                      {loadingPlanName ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="animate-spin rounded-full h-3 w-3 border-b border-gray-600"></span>
                          Loading...
                        </span>
                      ) : (
                        membershipPlanName || `Plan #${membershipData.membership_plan_id}`
                      )}
                    </span>
                  </div>
                  {membershipPlanUserLimit && (
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Plan Member Limit</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-500 font-medium">
                        {membershipPlanUserLimit} {membershipPlanUserLimit === 1 ? 'Member' : 'Members'}
                      </span>
                    </div>
                  )}
                  <div className="flex items-start">
                    <span className="text-gray-500 min-w-[140px]">Site</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-500 font-medium">{membershipData.site_name}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-500 min-w-[140px]">Total Members</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-500 font-medium">
                      {membershipData.club_members?.length || 0}
                      {membershipPlanUserLimit && ` / ${membershipPlanUserLimit}`}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-500 min-w-[140px]">Start Date</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-500 font-medium">{formatDate(membershipData.start_date)}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-500 min-w-[140px]">End Date</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-500 font-medium">{formatDate(membershipData.end_date)}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-500 min-w-[140px]">Preferred Start Date</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-500 font-medium">{formatDate(membershipData.preferred_start_date)}</span>
                  </div>
                  {/* <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Referred By</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-500 font-medium">{membershipData.referred_by || '-'}</span>
              </div> */}
                </div>
              </TabsContent>

              <TabsContent value="members" className="p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4 flex items-center gap-3">
                  <User className="w-5 h-5 text-[#C72030]" />
                  Group Members List
                </h2>
                <div className="space-y-3">
                  {membershipData.club_members?.map((member, index) => (
                    <div key={member.id} className="border border-gray-200 rounded-lg p-4 hover:border-[#C72030] transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="bg-[#C72030] text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{member.user_name}</h3>
                            <p className="text-sm text-gray-500">{member.membership_number}</p>
                            <div className="mt-2 space-y-1">
                              <p className="text-sm text-gray-600">
                                <Mail className="w-3 h-3 inline mr-1" />
                                {member.user_email}
                              </p>
                              <p className="text-sm text-gray-600">
                                <Phone className="w-3 h-3 inline mr-1" />
                                {member.user_mobile}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <Badge
                            variant={member.club_member_enabled ? "default" : "secondary"}
                            className={member.club_member_enabled ? "bg-green-100 text-green-800 hover:bg-green-100/90" : "bg-gray-100 text-gray-600 hover:bg-gray-100/90"}
                          >
                            {member.club_member_enabled ? 'Active' : 'Inactive'}
                          </Badge>
                          {/* <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedMemberIndex(index);
                          setActiveTab("member-details");
                        }}
                      >
                        View Details
                      </Button> */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {membershipData.allocation_payment_detail && (
                <TabsContent value="payment" className="p-4 sm:p-6">
                  <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4 flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-[#C72030]" />
                    Payment Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Payment ID</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{membershipData.allocation_payment_detail.id}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Base Amount</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">₹ {membershipData.allocation_payment_detail.base_amount}</span>
                    </div>
                    {membershipData.allocation_payment_detail.discount && membershipData.allocation_payment_detail.discount !== '0' && membershipData.allocation_payment_detail.discount !== '0.0' && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Discount</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">₹ {membershipData.allocation_payment_detail.discount}</span>
                      </div>
                    )}
                    {/* <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">CGST</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">₹ {membershipData.allocation_payment_detail.cgst}</span>
                </div> */}
                    {/* <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">SGST</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">₹ {membershipData.allocation_payment_detail.sgst}</span>
                </div> */}
                    {/* <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">Total Tax</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">₹ {membershipData.allocation_payment_detail.total_tax}</span>
                </div> */}
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Total Amount</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">₹ {membershipData.allocation_payment_detail.total_amount}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Landed Amount</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">₹ {membershipData.allocation_payment_detail.landed_amount}</span>
                    </div>
                    {/* <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">Payment Mode</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium capitalize">{membershipData.allocation_payment_detail.payment_mode}</span>
                </div> */}
                    {/* <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">Payment Status</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <Badge variant={membershipData.allocation_payment_detail.payment_status === 'success' ? "default" : "secondary"} className="capitalize">
                    {membershipData.allocation_payment_detail.payment_status}
                  </Badge>
                </div> */}
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Invoice Created</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{formatDateTime(membershipData.allocation_payment_detail.created_at)}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Payment Plan</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{membershipData.allocation_payment_detail?.payment_plan?.name}</span>
                    </div>
                    {/* <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">Plan Duration</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">{membershipData.allocation_payment_detail?.payment_plan?.duration_in_months}</span>
                </div> */}
                  </div>
                </TabsContent>
              )}

              <TabsContent value="bill" className="p-4 sm:p-6">
                {loadingBill ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030]"></div>
                  </div>
                ) : selectedBill ? (
                  // Detailed view for a selected bill
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => setSelectedBill(null)} // Go back to the list
                        className="flex items-center gap-1 hover:text-gray-800 mb-4"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Bill List
                      </button>
                      <div className="flex gap-2 mb-4">
                        {selectedBill.status?.toLowerCase() !== 'paid' && (
                          <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => setOpenPaymentModal(true)}
                          >
                            <CreditCard className="w-4 h-4 mr-2" />
                            Payment
                          </Button>
                        )}
                        <Button
                          onClick={handleDownloadPDF}
                          disabled={downloadingPDF}
                          className="bg-[#C72030] hover:bg-[#A01828] text-white"
                        >
                          {downloadingPDF ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Downloading...
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4 mr-2" />
                              Download PDF
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Bill Header Information */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div className="flex items-start">
                          <span className="text-gray-500 min-w-[140px]">Bill Number</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{selectedBill.bill_number || '-'}</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-gray-500 min-w-[140px]">Bill ID</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{selectedBill.id}</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-gray-500 min-w-[140px]">Status</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <Badge
                            variant={
                              selectedBill.status?.toLowerCase() === 'paid'
                                ? 'default'
                                : selectedBill.status === 'generated'
                                  ? 'outline'
                                  : 'secondary'
                            }
                            className={`capitalize ${selectedBill.status?.toLowerCase() === 'paid' ? 'bg-green-100 text-green-800 border-green-200' : ''}`}
                          >
                            {selectedBill.status}
                          </Badge>
                        </div>
                        <div className="flex items-start">
                          <span className="text-gray-500 min-w-[140px]">Due Date</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{formatDate(selectedBill.due_date)}</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-gray-500 min-w-[140px]">Billed To Type</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{selectedBill.billed_to_type || '-'}</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-gray-500 min-w-[140px]">Billed To ID</span>
                          <span className="text-gray-500 mx-2">:</span>
                          <span className="text-gray-900 font-medium">{selectedBill.billed_to || '-'}</span>
                        </div>
                        {selectedBill.billing_date && (
                          <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Billing Date</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{formatDate(selectedBill.billing_date)}</span>
                          </div>
                        )}
                        {selectedBill.mail_sent !== null && (
                          <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Mail Sent</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <Badge variant={selectedBill.mail_sent ? "default" : "secondary"}>
                              {selectedBill.mail_sent ? 'Yes' : 'No'}
                            </Badge>
                          </div>
                        )}
                        {selectedBill.irn_no && (
                          <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">IRN Number</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{selectedBill.irn_no}</span>
                          </div>
                        )}
                        {selectedBill.ack_no && (
                          <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">ACK Number</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{selectedBill.ack_no}</span>
                          </div>
                        )}
                        {selectedBill.ack_date && (
                          <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">ACK Date</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{formatDate(selectedBill.ack_date)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bill Charges */}
                    {selectedBill.lock_account_bill_charges && selectedBill.lock_account_bill_charges.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-md font-semibold text-gray-900 mb-3">Bill Charges</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full border border-gray-200 rounded-lg">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                  Item Name
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                  Amount
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                  Discount
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                  Total
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {selectedBill.lock_account_bill_charges.map((charge) => (
                                <tr key={charge.id}>
                                  <td className="px-4 py-3 text-sm text-gray-900">{charge.name}</td>
                                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                                    ₹ {charge.amount?.toFixed(2)}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                                    {charge.discount ? `₹ ${Number(charge.discount).toFixed(2)}` : '-'}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                                    ₹ {charge.total_amount.toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Bill Summary */}
                    <div className="mt-6">
                      <h3 className="text-md font-semibold text-gray-900 mb-3">Bill Summary</h3>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Subtotal (Before Tax)</span>
                            <span className="text-gray-900 font-medium">
                              ₹ {selectedBill.lock_account_bill_charges.reduce((sum, c) => sum + c.amount, 0).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Total GST</span>
                            <span className="text-gray-900 font-medium">
                              ₹ {selectedBill.lock_account_bill_charges.reduce((sum, c) => sum + c.gst_amount, 0).toFixed(2)}
                            </span>
                          </div>
                          {selectedBill.roundoff_diff !== null && selectedBill.roundoff_diff !== 0 && (
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-600">Round Off</span>
                              <span className="text-gray-900 font-medium">
                                ₹ {selectedBill.roundoff_diff.toFixed(2)}
                              </span>
                            </div>
                          )}
                          {selectedBill.charged_amount !== null && (
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-600">Charged Amount</span>
                              <span className="text-gray-900 font-medium">₹ {selectedBill.charged_amount.toFixed(2)}</span>
                            </div>
                          )}
                          {selectedBill.balance_amount !== null && (
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-600">Balance Amount</span>
                              <span className="text-gray-900 font-medium">₹ {selectedBill.balance_amount.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="pt-3 border-t border-gray-300">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-900 font-semibold">Total Amount</span>
                              <span className="text-gray-900 font-bold text-lg">
                                ₹ {(selectedBill.after_roundoff_amount || selectedBill.total_amount).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : billDetails.length > 0 ? (
                  // List view of all bills
                  <div>
                    <h2 className="text-lg font-semibold text-[#1a1a1a] flex items-center gap-3 mb-4">
                      <FileText className="w-5 h-5 text-[#C72030]" />
                      Bill Details
                    </h2>
                    <div className="space-y-3">
                      {billDetails.map((bill) => (
                        <div
                          key={bill.id}
                          onClick={() => setSelectedBill(bill)} // Set the selected bill
                          className="border border-gray-200 rounded-lg p-4 hover:border-[#C72030] transition-colors cursor-pointer"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">Bill #{bill.bill_number || bill.id}</h3>
                              <p className="text-sm text-gray-500">Due: {formatDate(bill.due_date)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                ₹ {(bill.after_roundoff_amount || bill.total_amount).toFixed(2)}
                              </p>
                              <Badge
                                variant={
                                  bill.status?.toLowerCase() === 'paid'
                                    ? 'default'
                                    : bill.status === 'generated'
                                      ? 'outline'
                                      : 'secondary'
                                }
                                className={`capitalize mt-1 ${bill.status?.toLowerCase() === 'paid' ? 'bg-green-100 text-green-800 border-green-200' : ''}`}
                              >
                                {bill.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No bill details available</p>
                )}
              </TabsContent>

              <TabsContent value="member-details" className="p-4 sm:p-6">
                {selectedMember && (
                  <>
                    {/* Member Selector */}
                    <div className="mb-6">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Select Member</label>
                      <select
                        value={selectedMemberIndex}
                        onChange={(e) => setSelectedMemberIndex(Number(e.target.value))}
                        className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                      >
                        {membershipData.club_members?.map((member, index) => (
                          <option key={member.id} value={index}>
                            {index + 1}. {member.user_name} - {member.membership_number}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Nested Tabs for Member Details */}
                    <Tabs defaultValue="personal" className="w-full">
                      <TabsList className="w-full flex flex-wrap bg-gray-50 rounded-lg h-auto p-0 text-xs justify-stretch mb-6">
                        <TabsTrigger
                          value="personal"
                          className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-2 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
                        >
                          Personal Info
                        </TabsTrigger>
                        <TabsTrigger
                          value="membership"
                          className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-2 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
                        >
                          Membership
                        </TabsTrigger>
                        <TabsTrigger
                          value="address"
                          className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-2 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
                        >
                          Address
                        </TabsTrigger>
                        {selectedMember.snag_answers && selectedMember.snag_answers.length > 0 && (
                          <TabsTrigger
                            value="questionnaires"
                            className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-2 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
                          >
                            Questionnaires
                          </TabsTrigger>
                        )}
                        <TabsTrigger
                          value="system"
                          className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-2 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
                        >
                          System Info
                        </TabsTrigger>
                        <TabsTrigger
                          value="attachments"
                          className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-2 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
                        >
                          Attachments
                        </TabsTrigger>
                      </TabsList>

                      {/* Personal Information Tab */}
                      <TabsContent value="personal" className="mt-0">
                        <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4 flex items-center gap-3">
                          <User className="w-5 h-5 text-[#C72030]" />
                          Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                          <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Full Name</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{selectedMember.user_name}</span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Email</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{selectedMember.user_email}</span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Mobile</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{selectedMember.user_mobile}</span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Gender</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{selectedMember.user?.gender || '-'}</span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Date of Birth</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{formatDate(selectedMember.user?.birth_date)}</span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Face Added</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <Badge
                              variant={selectedMember.face_added ? "default" : "secondary"}
                              className={selectedMember.face_added ? "bg-green-100 text-green-800 " : "bg-red-100 text-red-800"}
                            >
                              {selectedMember.face_added ? 'Yes' : 'No'}
                            </Badge>
                          </div>
                          {/* <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">House</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{selectedMember.user?.flat_no || '-'}</span>
                      </div> */}
                        </div>
                      </TabsContent>

                      {/* Membership Details Tab */}
                      <TabsContent value="membership" className="mt-0">
                        <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4 flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-[#C72030]" />
                          Membership Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                          <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Membership Number</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{selectedMember.membership_number}</span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Club Member</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <Badge
                              variant={selectedMember.club_member_enabled ? "default" : "secondary"}
                              className={selectedMember.club_member_enabled ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}
                            >
                              {selectedMember.club_member_enabled ? 'Enabled' : 'Disabled'}
                            </Badge>
                          </div>
                          <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Access Card</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <Badge
                              variant={selectedMember.access_card_enabled ? "default" : "secondary"}
                              className={selectedMember.access_card_enabled ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}
                            >
                              {selectedMember.access_card_enabled ? 'Enabled' : 'Disabled'}
                            </Badge>
                          </div>
                          <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Access Card ID</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{selectedMember.access_card_id || '-'}</span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Emergency Contact</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{selectedMember.emergency_contact_name || '-'}</span>
                          </div>
                          {/* <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Referred By</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{selectedMember.referred_by || '-'}</span>
                      </div> */}
                          <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">House</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{selectedMember?.house?.name || '-'}</span>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Address Information Tab */}
                      <TabsContent value="address" className="mt-0">
                        <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4 flex items-center gap-3">
                          <Building2 className="w-5 h-5 text-[#C72030]" />
                          Address Information
                        </h3>
                        {selectedMember.user?.addresses && selectedMember.user.addresses.length > 0 ? (
                          selectedMember.user.addresses.map((addr, index) => (
                            <div key={addr.id} className={`${index > 0 ? 'mt-6 pt-6 border-t border-gray-200' : ''}`}>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                <div className="flex items-start">
                                  <span className="text-gray-500 min-w-[140px]">Address</span>
                                  <span className="text-gray-500 mx-2">:</span>
                                  <span className="text-gray-900 font-medium">{addr.address || '-'}</span>
                                </div>
                                <div className="flex items-start">
                                  <span className="text-gray-500 min-w-[140px]">Address Line 2</span>
                                  <span className="text-gray-500 mx-2">:</span>
                                  <span className="text-gray-900 font-medium">{addr.address_line_two || '-'}</span>
                                </div>
                                <div className="flex items-start">
                                  <span className="text-gray-500 min-w-[140px]">City</span>
                                  <span className="text-gray-500 mx-2">:</span>
                                  <span className="text-gray-900 font-medium">{addr.city || '-'}</span>
                                </div>
                                <div className="flex items-start">
                                  <span className="text-gray-500 min-w-[140px]">State</span>
                                  <span className="text-gray-500 mx-2">:</span>
                                  <span className="text-gray-900 font-medium">{addr.state || '-'}</span>
                                </div>
                                <div className="flex items-start">
                                  <span className="text-gray-500 min-w-[140px]">Country</span>
                                  <span className="text-gray-500 mx-2">:</span>
                                  <span className="text-gray-900 font-medium">{addr.country || '-'}</span>
                                </div>
                                <div className="flex items-start">
                                  <span className="text-gray-500 min-w-[140px]">PIN Code</span>
                                  <span className="text-gray-500 mx-2">:</span>
                                  <span className="text-gray-900 font-medium">{addr.pin_code || '-'}</span>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-center py-8">No address information available</p>
                        )}
                      </TabsContent>

                      {/* Questionnaires Tab */}
                      {selectedMember.snag_answers && selectedMember.snag_answers.length > 0 && (
                        <TabsContent value="questionnaires" className="mt-0">
                          <h3 className="text-lg font-semibold text-[#1a1a1a] mb-6 flex items-center gap-3">
                            <FileText className="w-5 h-5 text-[#C72030]" />
                            Member Questionnaires
                          </h3>
                          <div className="space-y-8">
                            {(() => {
                              const parsedAnswers = parseAnswers(selectedMember.snag_answers);
                              if (!parsedAnswers) return null;

                              return Object.entries(QUESTION_SECTIONS).map(([sectionKey, section]) => {
                                // Filter questions that exist in answers
                                const sectionQuestions = section.questionIds.filter(qId => parsedAnswers[qId]);

                                if (sectionQuestions.length === 0) return null;

                                return (
                                  <div key={sectionKey} className="border border-gray-200 rounded-lg p-6 bg-white">
                                    <h4 className="text-md font-semibold text-[#C72030] mb-4 pb-3 border-b border-gray-200 flex items-center gap-2">
                                      {section.title}
                                    </h4>
                                    <div className="space-y-4">
                                      {sectionQuestions.map((questionId) => (
                                        <div key={questionId} className="bg-gray-50 rounded-lg p-4">
                                          <div className="mb-2">
                                            <span className="text-sm font-medium text-gray-700">
                                              {QUESTION_MAP[questionId]}
                                            </span>
                                          </div>
                                          <div className="pl-4 border-l-2 border-[#C72030]">
                                            {renderAnswerValue(questionId, parsedAnswers[questionId])}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              });
                            })()}
                          </div>
                        </TabsContent>
                      )}

                      {/* System Information Tab */}
                      <TabsContent value="system" className="mt-0">
                        <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4 flex items-center gap-3">
                          <FileText className="w-5 h-5 text-[#C72030]" />
                          System Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                          {/* <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Member </span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{selectedMember.name}</span>
                      </div> */}
                          <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">User </span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{selectedMember.user_name}</span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Created By</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{selectedMember.created_by || '-'}</span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Created At</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{formatDateTime(selectedMember.created_at)}</span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Updated At</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{formatDateTime(selectedMember.updated_at)}</span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Active</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <Badge
                              variant={selectedMember.active ? "default" : "secondary"}
                              className={selectedMember.active ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}
                            >
                              {selectedMember.active ? 'Yes' : 'No'}
                            </Badge>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="attachments" className="mt-0">
                        <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4 flex items-center gap-3">
                          <ImageIcon className="w-5 h-5 text-[#C72030]" />
                          Attachments & Documents
                        </h3>
                        <div className="space-y-6">
                          {/* Identification Image */}
                          <div className="border border-gray-200 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <ImageIcon className="w-4 h-4 text-[#C72030]" />
                              Identification Image
                            </h4>
                            {selectedMember.identification_image ? (
                              <div className="flex items-center gap-4">
                                <img
                                  src={selectedMember.identification_image}
                                  alt="Identification"
                                  className="h-24 w-24 object-cover rounded-lg border border-gray-200 cursor-pointer hover:border-[#C72030] transition-colors"
                                  onClick={() => setSelectedImage(selectedMember.identification_image)}
                                />
                                <div className="flex-1">
                                  <p className="text-sm text-gray-600">Identification Document</p>
                                  <a
                                    href={selectedMember.identification_image}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#C72030] hover:text-[#A01828] text-sm font-medium mt-1 inline-block"
                                  >
                                    View Full Size →
                                  </a>
                                </div>
                              </div>
                            ) : (
                              <p className="text-gray-500 text-sm">No identification image available</p>
                            )}
                          </div>

                          {/* Avatar */}
                          <div className="border border-gray-200 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <ImageIcon className="w-4 h-4 text-[#C72030]" />
                              Avatar / Profile Image
                            </h4>
                            {selectedMember.avatar ? (
                              <div className="flex items-center gap-4">
                                <img
                                  src={getAvatarUrl(selectedMember.avatar) || selectedMember.avatar}
                                  alt="Avatar"
                                  className="h-24 w-24 object-cover rounded-lg border border-gray-200 cursor-pointer hover:border-[#C72030] transition-colors"
                                  onClick={() => setSelectedImage(getAvatarUrl(selectedMember.avatar) || selectedMember.avatar)}
                                />
                                <div className="flex-1">
                                  <p className="text-sm text-gray-600">Profile Avatar</p>
                                  <a
                                    href={getAvatarUrl(selectedMember.avatar) || selectedMember.avatar}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#C72030] hover:text-[#A01828] text-sm font-medium mt-1 inline-block"
                                  >
                                    View Full Size →
                                  </a>
                                </div>
                              </div>
                            ) : (
                              <p className="text-gray-500 text-sm">No avatar available</p>
                            )}
                          </div>

                          {/* General Attachments */}
                          <div className="border border-gray-200 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <FileText className="w-4 h-4 text-[#C72030]" />
                              General Attachments
                            </h4>
                            {selectedMember.attachments && selectedMember.attachments.length > 0 ? (
                              <div className="space-y-4">
                                {selectedMember.attachments.map((attachment, idx) => {
                                  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(attachment.document);
                                  return (
                                    <div key={attachment.id || idx} className="border border-gray-200 rounded-lg p-3 bg-white">
                                      <div className="flex items-start gap-3">
                                        {isImage ? (
                                          <img
                                            src={attachment.document}
                                            alt={attachment.relation || 'Attachment'}
                                            className="h-20 w-20 object-cover rounded border border-gray-200 cursor-pointer hover:border-[#C72030] transition-colors flex-shrink-0"
                                            onClick={() => setSelectedImage(attachment.document)}
                                          />
                                        ) : (
                                          <div className="h-20 w-20 bg-gray-100 rounded border border-gray-200 flex items-center justify-center flex-shrink-0">
                                            <FileText className="w-8 h-8 text-gray-400" />
                                          </div>
                                        )}
                                        <div className="flex-1">
                                          <p className="text-sm text-gray-900 font-medium">
                                            {attachment.relation || 'Document'}
                                          </p>
                                          <p className="text-xs text-gray-500 truncate">{attachment.document}</p>
                                          <a
                                            href={attachment.document}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#C72030] hover:text-[#A01828] text-xs font-medium mt-2 inline-block"
                                          >
                                            View Full Size →
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-gray-500 text-sm">No attachments available</p>
                            )}
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Image Modal */}
          {selectedImage && (
            <div
              className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative max-w-4xl max-h-full">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="max-w-full max-h-screen object-contain"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}

          {/* Payment Modal */}
          <Dialog open={openPaymentModal} onOpenChange={(open) => {
            setOpenPaymentModal(open);
            if (!open) {
              setPaymentMethod('upi');
              setTransactionId('');
              setAttachments([]);
            }
          }}>
            <DialogContent className="sm:max-w-[600px] w-[95vw] bg-white max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Make Payment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 w-full overflow-hidden px-1">
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
                    <SelectContent className="bg-white">
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
                    <SelectContent className="bg-white">
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
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter Transaction ID"
                    className="mt-1 w-full"
                    disabled={paymentLoading}
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

                  {/* Drag and Drop Area */}
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
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <CloudUploadIcon
                        sx={{
                          fontSize: 40,
                          color: isDragActive ? '#3B82F6' : '#9CA3AF',
                          transition: 'all 0.3s ease',
                        }}
                      />
                      <div className="text-center">
                        <p className="text-sm font-semibold text-gray-700">
                          {isDragActive ? 'Drop files here' : 'Drag files here or click to browse'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Support: PDF, Images, Videos, Audio, Documents (Max size per file: 10MB)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* File List */}
                  {attachments.length > 0 && (
                    <div className="mt-5">
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-700">
                          Files to upload ({attachments.length})
                        </h3>
                        {attachments.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setAttachments([])}
                            disabled={paymentLoading}
                            className="text-xs text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                          >
                            Clear all
                          </button>
                        )}
                      </div>

                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {attachments.map((file, idx) => {
                          const fileInfo = getFileTypeInfo(file.name);
                          const IconComponent = fileInfo.icon;

                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white hover:shadow-sm transition-shadow"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div
                                  className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0"
                                  style={{ backgroundColor: fileInfo.bgColor }}
                                >
                                  <IconComponent sx={{ fontSize: 20, color: fileInfo.color }} />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {file.name}
                                    </p>
                                    <span
                                      className="px-2 py-0.5 text-xs font-semibold rounded-full text-white flex-shrink-0"
                                      style={{ backgroundColor: fileInfo.color }}
                                    >
                                      {fileInfo.type}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    {formatFileSize(file.size)}
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setAttachments(attachments.filter((_, i) => i !== idx));
                                }}
                                disabled={paymentLoading}
                                className="ml-3 flex-shrink-0 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Remove file"
                              >
                                <CloseIcon sx={{ fontSize: 18 }} />
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      {/* Summary */}
                      <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <p className="text-sm text-blue-800">
                          <span className="font-semibold">{attachments.length}</span> file(s) ready to upload
                          {' '}
                          <span className="text-blue-600">
                            ({formatFileSize(attachments.reduce((sum, f) => sum + f.size, 0))})
                          </span>
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
        </div>
      )}
    </>
  );
};

export default ClubGroupMembershipDetails;
