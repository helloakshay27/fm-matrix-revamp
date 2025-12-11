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
}

export const ClubGroupMembershipDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [membershipData, setMembershipData] = useState<GroupMembershipDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedMemberIndex, setSelectedMemberIndex] = useState(0);

  console.log(membershipData)

  // Fetch membership details
  useEffect(() => {
    fetchMembershipDetails();
  }, [id]);

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
                <span className="text-gray-500 min-w-[140px]">Membership Plan ID</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">{membershipData.membership_plan_id}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Site ID</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">{membershipData.pms_site_id}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Total Members</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">{membershipData.club_members?.length || 0}</span>
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
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedMemberIndex(index);
                          setActiveTab("member-details");
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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

                {/* Personal Information */}
                <div className="mb-6">
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
                </div>

                {/* Membership Details */}
                <div className="mb-6">
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
                </div>

                {/* Address Information */}
                {selectedMember.user?.addresses && selectedMember.user.addresses.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4 flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-[#C72030]" />
                      Address Information
                    </h3>
                    {selectedMember.user.addresses.map((addr, index) => (
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
                    ))}
                  </div>
                )}

                {/* System Information */}
                <div>
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
                </div>
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
