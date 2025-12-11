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

interface MembershipDetail {
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
  membership_plan_id?: number;
  membership_plan_name?: string;
  active?: boolean;
  face_added?: boolean;
  created_by_id?: number;
  access_card_check?: boolean;
  club_member_check?: boolean;
  current_age?: number | null;
  doc_type?: string | null;
  relation_with_owner?: string | null;
  resident_type?: string | null;
  plan_amenities?: Array<{
    id: number;
    facility_setup_id: number;
    facility_setup_name?: string;
    access: string;
  }>;
  custom_amenities?: Array<{
    id: number;
    facility_setup_id: number;
    facility_setup_name?: string;
    access: string;
  }>;
  member_payment_detail?: {
    id: number;
    base_amount: string;
    discount: string;
    cgst: string;
    sgst: string;
    total_tax: string;
    total_amount: string;
  } | null;
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

// Add question mapping constant
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

// Add section categorization after QUESTION_MAP
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

// Add MembershipPlan interface after other interfaces
interface MembershipPlan {
  id: number;
  name: string;
  advance_booking_in_days: number | null;
  usage_limits: string;
  price?: string;
  renewal_terms?: string;
  user_limit?: number;
}

export const ClubMembershipDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [membershipData, setMembershipData] = useState<MembershipDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [membershipPlanName, setMembershipPlanName] = useState<string>('');
  const [membershipPlanUserLimit, setMembershipPlanUserLimit] = useState<number | null>(null);
  const [loadingPlanName, setLoadingPlanName] = useState(false);

  console.log(membershipData)

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
      const url = new URL(`${baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`}/club_members/${id}.json`);
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

  const avatarUrl = getAvatarUrl(membershipData.avatar);

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
                {membershipData.user_name}
              </h1>
              {renderStatusBadge()}
            </div>
            <div className="text-sm text-gray-600">
              Membership #{membershipData.membership_number} • Created on {formatDateTime(membershipData.created_at)}
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
        <Tabs defaultValue="personal" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="w-full flex flex-wrap bg-gray-50 rounded-t-lg h-auto p-0 text-sm justify-stretch">
            <TabsTrigger
              value="personal"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Personal Information
            </TabsTrigger>
            <TabsTrigger
              value="membership"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Membership Details
            </TabsTrigger>
            <TabsTrigger
              value="address"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Address Information
            </TabsTrigger>
            {(membershipData.plan_amenities?.length || membershipData.custom_amenities?.length) && (
              <TabsTrigger
                value="plan"
                className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
              >
                Plan & Amenities
              </TabsTrigger>
            )}
            {membershipData.member_payment_detail && (
              <TabsTrigger
                value="payment"
                className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
              >
                Payment Information
              </TabsTrigger>
            )}
            {((membershipData.attachments && membershipData.attachments.length > 0) || 
              membershipData.identification_image || 
              (avatarUrl && !avatarUrl.includes('profile.png'))) && (
              <TabsTrigger
                value="documents"
                className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
              >
                Documents & Images
              </TabsTrigger>
            )}
            <TabsTrigger
              value="system"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              System Information
            </TabsTrigger>
            {membershipData?.snag_answers && membershipData.snag_answers.length > 0 && (
              <TabsTrigger
                value="questionnaires"
                className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
              >
                Questionnaires
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="personal" className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4 flex items-center gap-3">
              <User className="w-5 h-5 text-[#C72030]" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Full Name</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">{membershipData.user_name || membershipData.user?.full_name || '-'}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">First Name</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">{membershipData.user?.firstname || '-'}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Last Name</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">{membershipData.user?.lastname || '-'}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Email</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">{membershipData.user_email || membershipData.user?.email || '-'}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Mobile</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {membershipData.user?.country_code && `+${membershipData.user.country_code} `}
                  {membershipData.user_mobile || membershipData.user?.mobile || '-'}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Site</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">{membershipData.site_name || '-'}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Date of Birth</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">{formatDate(membershipData.user?.birth_date)}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Gender</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">{membershipData.user?.gender || '-'}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Current Age</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">{membershipData.current_age || '-'}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">User Type</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">{membershipData.user?.user_type || '-'}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Face Added</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  <Badge variant={membershipData.face_added ? "default" : "secondary"}>
                    {membershipData.face_added ? 'Yes' : 'No'}
                  </Badge>
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="membership" className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4 flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-[#C72030]" />
              Membership Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Membership Number</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">{membershipData.membership_number || '-'}</span>
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
                    membershipPlanName || membershipData.membership_plan_name || (membershipData.membership_plan_id ? `Plan #${membershipData.membership_plan_id}` : '-')
                  )}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Club Member</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  <Badge variant={membershipData.club_member_enabled ? "default" : "secondary"}>
                    {membershipData.club_member_enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
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
                <span className="text-gray-500 min-w-[140px]">Access Card</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  <Badge variant={membershipData.access_card_enabled ? "default" : "secondary"}>
                    {membershipData.access_card_enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Access Card ID</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">{membershipData.access_card_id || '-'}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Active Status</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  <Badge variant={membershipData.active ? "default" : "secondary"}>
                    {membershipData.active ? 'Active' : 'Inactive'}
                  </Badge>
                </span>
              </div>
              {membershipData.referred_by && (
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">Referred By</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">{membershipData.referred_by}</span>
                </div>
              )}
              {membershipData.emergency_contact_name && (
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">Emergency Contact</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">{membershipData.emergency_contact_name}</span>
                </div>
              )}
              {membershipData.resident_type && (
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">Resident Type</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">{membershipData.resident_type}</span>
                </div>
              )}
              {membershipData.relation_with_owner && (
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">Relation with Owner</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">{membershipData.relation_with_owner}</span>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="address" className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4 flex items-center gap-3">
              <Building2 className="w-5 h-5 text-[#C72030]" />
              Address Information
            </h2>
            {membershipData.user?.addresses && membershipData.user.addresses.length > 0 ? (
              membershipData.user.addresses.map((addr, index) => (
                <div key={addr.id} className={`${index > 0 ? 'mt-6 pt-6 border-t border-gray-200' : ''}`}>
                  {membershipData.user.addresses.length > 1 && (
                    <h3 className="text-md font-medium text-gray-700 mb-4">Address {index + 1}</h3>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Address</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{addr.address || '-'}</span>
                    </div>
                    {addr.address_line_two && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Address Line 2</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{addr.address_line_two}</span>
                      </div>
                    )}
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
                    {addr.address_type && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Address Type</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium capitalize">{addr.address_type}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No address information available</p>
            )}
          </TabsContent>

          {(membershipData.plan_amenities?.length || membershipData.custom_amenities?.length) && (
            <TabsContent value="plan" className="p-4 sm:p-6">
              {/* Plan & Amenities */}
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4 flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#C72030]" />
                Plan & Amenities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
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
                      membershipPlanName || membershipData.membership_plan_name || (membershipData.membership_plan_id ? `Plan #${membershipData.membership_plan_id}` : '-')
                    )}
                  </span>
                </div>
                {membershipPlanUserLimit && (
                  <div className="flex items-start">
                    <span className="text-gray-500 min-w-[140px]">Member Limit</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">
                      {membershipPlanUserLimit} {membershipPlanUserLimit === 1 ? 'Member' : 'Members'}
                    </span>
                  </div>
                )}
                {membershipData.plan_amenities && membershipData.plan_amenities.length > 0 && (
                  <div className="flex items-start col-span-2">
                    <span className="text-gray-500 min-w-[140px]">Included Amenities</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">
                      <ul className="list-disc list-inside space-y-1">
                        {membershipData.plan_amenities.map((amenity) => (
                          <li key={amenity.id}>{amenity.facility_setup_name || `Amenity ${amenity.facility_setup_id}`}</li>
                        ))}
                      </ul>
                    </span>
                  </div>
                )}
                {membershipData.custom_amenities && membershipData.custom_amenities.length > 0 && (
                  <div className="flex items-start col-span-2">
                    <span className="text-gray-500 min-w-[140px]">Custom Amenities</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">
                      <ul className="list-disc list-inside space-y-1">
                        {membershipData.custom_amenities.map((amenity) => (
                          <li key={amenity.id}>{amenity.facility_setup_name || `Amenity ${amenity.facility_setup_id}`}</li>
                        ))}
                      </ul>
                    </span>
                  </div>
                )}
              </div>
            </TabsContent>
          )}

          {membershipData.member_payment_detail && (
            <TabsContent value="payment" className="p-4 sm:p-6">
              {/* Payment Information */}
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4 flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-[#C72030]" />
                Payment Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">Base Amount</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">₹ {membershipData?.member_payment_detail?.base_amount || '0'}</span>
                </div>
                {membershipData?.member_payment_detail?.discount && membershipData.member_payment_detail.discount !== '0' && (
                  <div className="flex items-start">
                    <span className="text-gray-500 min-w-[140px]">Discount</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">-₹ {membershipData?.member_payment_detail?.discount}</span>
                  </div>
                )}
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">CGST</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">₹ {membershipData?.member_payment_detail?.cgst || '0'}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">SGST</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">₹ {membershipData?.member_payment_detail?.sgst || '0'}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">Total Tax</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">₹ {membershipData?.member_payment_detail?.total_tax || '0'}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">Total Amount</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">₹ {membershipData?.member_payment_detail?.total_amount || '0'}</span>
                </div>
              </div>
            </TabsContent>
          )}

          {((membershipData.attachments && membershipData.attachments.length > 0) || 
            membershipData.identification_image || 
            (avatarUrl && !avatarUrl.includes('profile.png'))) && (
            <TabsContent value="documents" className="p-4 sm:p-6">
              {/* Documents & Images */}
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4 flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-[#C72030]" />
                Documents & Images
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* ID Card */}
                {membershipData.identification_image && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 font-medium">ID Card</p>
                    <a
                      href={membershipData.identification_image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-[#C72030] transition-colors"
                    >
                      <img
                        src={membershipData.identification_image}
                        alt="ID Card"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                        <Download className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </a>
                  </div>
                )}

                {/* User Photo */}
                {avatarUrl && !avatarUrl.includes('profile.png') && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 font-medium">User Photo</p>
                    <a
                      href={avatarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-[#C72030] transition-colors"
                    >
                      <img
                        src={avatarUrl}
                        alt="User Photo"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                        <Download className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </a>
                  </div>
                )}

                {/* Other Attachments */}
                {membershipData.attachments && membershipData.attachments.map((attachment, index) => (
                  <div key={attachment.id} className="space-y-2">
                    <p className="text-sm text-gray-500 font-medium">Attachment {index + 1}</p>
                    <a
                      href={attachment.document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-[#C72030] transition-colors"
                    >
                      <img
                        src={attachment.document}
                        alt={`Attachment ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                        <Download className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </TabsContent>
          )}

          <TabsContent value="system" className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4 flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#C72030]" />
              System Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">User ID</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">{membershipData.user_id}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Membership ID</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">{membershipData.id}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Created By ID</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">{membershipData.created_by_id || '-'}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Status</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">{renderStatusBadge()}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Active</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  <Badge variant={membershipData.active ? "default" : "secondary"}>
                    {membershipData.active ? 'Yes' : 'No'}
                  </Badge>
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Doc Type</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">{membershipData.doc_type || '-'}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Site ID</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">{membershipData.pms_site_id}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Company ID</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">{membershipData.user?.company_id || '-'}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Created At</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">{formatDateTime(membershipData.created_at)}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Updated At</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">{formatDateTime(membershipData.updated_at)}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Access Card Check</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  <Badge variant={membershipData.access_card_check ? "default" : "secondary"}>
                    {membershipData.access_card_check ? 'Yes' : 'No'}
                  </Badge>
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Club Member Check</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  <Badge variant={membershipData.club_member_check ? "default" : "secondary"}>
                    {membershipData.club_member_check ? 'Yes' : 'No'}
                  </Badge>
                </span>
              </div>
            </div>
          </TabsContent>

          {/* Questionnaires Tab */}
          {membershipData?.snag_answers && membershipData.snag_answers.length > 0 && (
            <TabsContent value="questionnaires" className="p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-6 flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#C72030]" />
                Member Questionnaires
              </h2>
              <div className="space-y-8">
                {(() => {
                  const parsedAnswers = parseAnswers(membershipData.snag_answers);
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

export default ClubMembershipDetailPage;
