import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Download, User, Mail, Phone, Calendar, CreditCard, Building2, FileText, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { API_CONFIG } from '@/config/apiConfig';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    questionIds: ['11', '12', '13']
  }
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
  const [billDetail, setBillDetail] = useState<BillDetail | null>(null);
  const [loadingBill, setLoadingBill] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

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
      // The API returns an array, so take the first item
      setBillDetail(Array.isArray(data) && data.length > 0 ? data[0] : data);
    } catch (error) {
      console.error('Error fetching bill details:', error);
      toast.error('Failed to fetch bill details');
    } finally {
      setLoadingBill(false);
    }
  };

  const handleBackToList = () => {
    navigate('/club-management/membership');
  };

  const handleEdit = () => {
    navigate(`/club-management/membership/${id}/edit`);
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
        <Badge className="bg-red-100 text-red-800 border-0">
          Pending Dates
        </Badge>
      );
    }

    if (!end_date && start_date) {
      return (
        <Badge className="bg-red-100 text-red-800 border-0">
          Pending EndDate
        </Badge>
      );
    }

    return (
      <Badge className="bg-green-100 text-green-800 border-0">
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
    if (!billDetail?.id) {
      toast.error('Bill ID not found');
      return;
    }

    setDownloadingPDF(true);
    try {
      const baseUrl = API_CONFIG.BASE_URL;
      const token = API_CONFIG.TOKEN;

      const url = new URL(`${baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`}/club_member_allocations/show_pdf`);
      url.searchParams.append('lock_account_bill_id', billDetail.id.toString());

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
      link.download = `Bill_${billDetail.bill_number || billDetail.id}.pdf`;
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
                Payment Details
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
                <span className="text-gray-900 font-medium">{membershipData.id}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Membership Plan</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
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
                  <span className="text-gray-900 font-medium">
                    {membershipPlanUserLimit} {membershipPlanUserLimit === 1 ? 'Member' : 'Members'}
                  </span>
                </div>
              )}
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Site ID</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">{membershipData.pms_site_id}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Total Members</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {membershipData.club_members?.length || 0}
                  {membershipPlanUserLimit && ` / ${membershipPlanUserLimit}`}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Start Date</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">{formatDate(membershipData.start_date)}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">End Date</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">{formatDate(membershipData.end_date)}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Preferred Start Date</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">{formatDate(membershipData.preferred_start_date)}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Referred By</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">{membershipData.referred_by || '-'}</span>
              </div>
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
                      <Badge variant={member.club_member_enabled ? "default" : "secondary"}>
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
                    <span className="text-gray-900 font-medium">-₹ {membershipData.allocation_payment_detail.discount}</span>
                  </div>
                )}
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">CGST</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">₹ {membershipData.allocation_payment_detail.cgst}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">SGST</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">₹ {membershipData.allocation_payment_detail.sgst}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">Total Tax</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">₹ {membershipData.allocation_payment_detail.total_tax}</span>
                </div>
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
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">Payment Mode</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium capitalize">{membershipData.allocation_payment_detail.payment_mode}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">Payment Status</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <Badge variant={membershipData.allocation_payment_detail.payment_status === 'success' ? "default" : "secondary"} className="capitalize">
                    {membershipData.allocation_payment_detail.payment_status}
                  </Badge>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">Payment Created</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">{formatDateTime(membershipData.allocation_payment_detail.created_at)}</span>
                </div>
              </div>
            </TabsContent>
          )}

          <TabsContent value="bill" className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#1a1a1a] flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#C72030]" />
                Bill Details
              </h2>
              {billDetail && (
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
              )}
            </div>
            {loadingBill ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030]"></div>
              </div>
            ) : billDetail ? (
              <div className="space-y-6">
                {/* Bill Header Information */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Bill Number</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{billDetail.bill_number || '-'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Bill ID</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{billDetail.id}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Status</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <Badge variant={billDetail.status === 'generated' ? "default" : "secondary"} className="capitalize">
                        {billDetail.status}
                      </Badge>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Due Date</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{formatDate(billDetail.due_date)}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Billed To Type</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{billDetail.billed_to_type || '-'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Billed To ID</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{billDetail.billed_to || '-'}</span>
                    </div>
                    {billDetail.billing_date && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Billing Date</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{formatDate(billDetail.billing_date)}</span>
                      </div>
                    )}
                    {billDetail.mail_sent !== null && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Mail Sent</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <Badge variant={billDetail.mail_sent ? "default" : "secondary"}>
                          {billDetail.mail_sent ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                    )}
                    {billDetail.irn_no && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">IRN Number</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{billDetail.irn_no}</span>
                      </div>
                    )}
                    {billDetail.ack_no && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">ACK Number</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{billDetail.ack_no}</span>
                      </div>
                    )}
                    {billDetail.ack_date && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">ACK Date</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{formatDate(billDetail.ack_date)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bill Charges */}
                {billDetail.lock_account_bill_charges && billDetail.lock_account_bill_charges.length > 0 && (
                  <div>
                    <h3 className="text-md font-semibold text-gray-900 mb-3">Bill Charges</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border border-gray-200 rounded-lg">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Item Name
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Quantity
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Rate
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Amount
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              GST Rate
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              GST Amount
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {billDetail.lock_account_bill_charges.map((charge) => (
                            <tr key={charge.id}>
                              <td className="px-4 py-3 text-sm text-gray-900">{charge.name}</td>
                              <td className="px-4 py-3 text-sm text-gray-900 text-right">{charge.quantity || '-'}</td>
                              <td className="px-4 py-3 text-sm text-gray-900 text-right">{charge.rate ? `₹ ${charge.rate.toFixed(2)}` : '-'}</td>
                              <td className="px-4 py-3 text-sm text-gray-900 text-right">₹ {charge.amount.toFixed(2)}</td>
                              <td className="px-4 py-3 text-sm text-gray-900 text-right">{charge.gst_rate.toFixed(2)}%</td>
                              <td className="px-4 py-3 text-sm text-gray-900 text-right">₹ {charge.gst_amount.toFixed(2)}</td>
                              <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">₹ {charge.total_amount.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Tax Breakdown (if GST components exist) */}
                {billDetail.lock_account_bill_charges.some(c => c.cgst_amount || c.sgst_amount || c.igst_amount) && (
                  <div>
                    <h3 className="text-md font-semibold text-gray-900 mb-3">Tax Breakdown</h3>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        {billDetail.lock_account_bill_charges.some(c => c.cgst_amount) && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">CGST</span>
                            <span className="text-gray-900 font-medium">
                              ₹ {billDetail.lock_account_bill_charges.reduce((sum, c) => sum + (c.cgst_amount || 0), 0).toFixed(2)}
                            </span>
                          </div>
                        )}
                        {billDetail.lock_account_bill_charges.some(c => c.sgst_amount) && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">SGST</span>
                            <span className="text-gray-900 font-medium">
                              ₹ {billDetail.lock_account_bill_charges.reduce((sum, c) => sum + (c.sgst_amount || 0), 0).toFixed(2)}
                            </span>
                          </div>
                        )}
                        {billDetail.lock_account_bill_charges.some(c => c.igst_amount) && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">IGST</span>
                            <span className="text-gray-900 font-medium">
                              ₹ {billDetail.lock_account_bill_charges.reduce((sum, c) => sum + (c.igst_amount || 0), 0).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Bill Summary */}
                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-3">Bill Summary</h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Subtotal (Before Tax)</span>
                        <span className="text-gray-900 font-medium">
                          ₹ {billDetail.lock_account_bill_charges.reduce((sum, c) => sum + c.amount, 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Total GST</span>
                        <span className="text-gray-900 font-medium">
                          ₹ {billDetail.lock_account_bill_charges.reduce((sum, c) => sum + c.gst_amount, 0).toFixed(2)}
                        </span>
                      </div>
                      {billDetail.roundoff_diff !== null && billDetail.roundoff_diff !== 0 && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Round Off</span>
                          <span className="text-gray-900 font-medium">
                            ₹ {billDetail.roundoff_diff.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {billDetail.charged_amount !== null && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Charged Amount</span>
                          <span className="text-gray-900 font-medium">₹ {billDetail.charged_amount.toFixed(2)}</span>
                        </div>
                      )}
                      {billDetail.balance_amount !== null && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Balance Amount</span>
                          <span className="text-gray-900 font-medium">₹ {billDetail.balance_amount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="pt-3 border-t border-gray-300">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-900 font-semibold">Total Amount</span>
                          <span className="text-gray-900 font-bold text-lg">
                            ₹ {(billDetail.after_roundoff_amount || billDetail.total_amount).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                {(billDetail.note || billDetail.bill_cycle_id || billDetail.bill_frequency_id) && (
                  <div>
                    <h3 className="text-md font-semibold text-gray-900 mb-3">Additional Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        {billDetail.bill_cycle_id && (
                          <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Bill Cycle ID</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{billDetail.bill_cycle_id}</span>
                          </div>
                        )}
                        {billDetail.bill_frequency_id && (
                          <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Bill Frequency ID</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{billDetail.bill_frequency_id}</span>
                          </div>
                        )}
                        {billDetail.society_id && (
                          <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Society ID</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{billDetail.society_id}</span>
                          </div>
                        )}
                        {billDetail.note && (
                          <div className="flex items-start col-span-2">
                            <span className="text-gray-500 min-w-[140px]">Note</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{billDetail.note}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
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
                        <Badge variant={selectedMember.face_added ? "default" : "secondary"}>
                          {selectedMember.face_added ? 'Yes' : 'No'}
                        </Badge>
                      </div>
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
                        <Badge variant={selectedMember.club_member_enabled ? "default" : "secondary"}>
                          {selectedMember.club_member_enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Access Card</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <Badge variant={selectedMember.access_card_enabled ? "default" : "secondary"}>
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
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Referred By</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{selectedMember.referred_by || '-'}</span>
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
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Member ID</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{selectedMember.id}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">User ID</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{selectedMember.user_id}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Created By</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{selectedMember.created_by_id || '-'}</span>
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
                        <Badge variant={selectedMember.active ? "default" : "secondary"}>
                          {selectedMember.active ? 'Yes' : 'No'}
                        </Badge>
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
    </div>
  );
};

export default ClubGroupMembershipDetails;
