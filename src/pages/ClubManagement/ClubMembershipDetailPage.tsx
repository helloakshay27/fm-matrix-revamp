import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Download, User, Mail, Phone, Calendar, CreditCard, Building2, FileText, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { API_CONFIG } from '@/config/apiConfig';

interface Attachment {
  id: number;
  relation: string;
  relation_id: number;
  document: string;
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
  created_at: string;
  updated_at: string;
  user_name: string;
  site_name: string;
  user_email: string;
  user_mobile: string;
  attachments: Attachment[];
  identification_image: string | null;
  avatar: string;
}

export const ClubMembershipDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [membershipData, setMembershipData] = useState<MembershipDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="p-4 sm:p-6 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C72030]"></div>
          <p className="text-gray-600">Loading membership details...</p>
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
    <div className="p-4 sm:p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleBackToList}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Membership List
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {avatarUrl && !avatarUrl.includes('profile.png') ? (
                <img
                  src={avatarUrl}
                  alt={membershipData.user_name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                  <User className="w-10 h-10 text-gray-400" />
                </div>
              )}
            </div>

            {/* Member Info */}
            <div className="flex flex-col gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">
                {membershipData.user_name}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-gray-600">
                  Membership #{membershipData.membership_number}
                </span>
                {renderStatusBadge()}
              </div>
              <div className="text-sm text-gray-500">
                Created on {formatDateTime(membershipData.created_at)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleEdit}
              className="bg-[#C72030] hover:bg-[#A01020] text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <User className="w-5 h-5 text-[#C72030]" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-900">{membershipData.user_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{membershipData.user_email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Mobile</p>
                    <p className="font-medium text-gray-900">{membershipData.user_mobile}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Site</p>
                    <p className="font-medium text-gray-900">{membershipData.site_name}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Membership Details */}
          <Card>
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#C72030]" />
                Membership Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Membership Number</p>
                    <p className="font-medium text-gray-900">{membershipData.membership_number}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Club Member</p>
                    <Badge variant={membershipData.club_member_enabled ? "default" : "secondary"}>
                      {membershipData.club_member_enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-medium text-gray-900">{formatDate(membershipData.start_date)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">End Date</p>
                    <p className="font-medium text-gray-900">{formatDate(membershipData.end_date)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Access Card</p>
                    <Badge variant={membershipData.access_card_enabled ? "default" : "secondary"}>
                      {membershipData.access_card_enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Access Card ID</p>
                    <p className="font-medium text-gray-900">
                      {membershipData.access_card_id || '-'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          {membershipData.attachments && membershipData.attachments.length > 0 && (
            <Card>
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#C72030]" />
                  Attachments ({membershipData.attachments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {membershipData.attachments.map((attachment, index) => (
                    <a
                      key={attachment.id}
                      href={attachment.document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-[#C72030] transition-colors"
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
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Images */}
        <div className="space-y-6">
          {/* Identification Image */}
          {membershipData.identification_image && (
            <Card>
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#C72030]" />
                  ID Card
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <a
                  href={membershipData.identification_image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-[3/2] rounded-lg overflow-hidden border border-gray-200 hover:border-[#C72030] transition-colors"
                >
                  <img
                    src={membershipData.identification_image}
                    alt="ID Card"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                    <Download className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </a>
              </CardContent>
            </Card>
          )}

          {/* User Photo */}
          {avatarUrl && !avatarUrl.includes('profile.png') && (
            <Card>
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-5 h-5 text-[#C72030]" />
                  User Photo
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
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
                    <Download className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </a>
              </CardContent>
            </Card>
          )}

          {/* System Information */}
          <Card>
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#C72030]" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-medium text-gray-900">{membershipData.user_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Site ID</p>
                  <p className="font-medium text-gray-900">{membershipData.pms_site_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="font-medium text-gray-900">{formatDateTime(membershipData.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium text-gray-900">{formatDateTime(membershipData.updated_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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
