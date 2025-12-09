import React, { useState, useEffect } from 'react';
import { Phone, Mail, Globe, MapPin, User as UserIcon, ArrowLeft, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';
import viBusinessCardBg from '../../assets/VI-businesscard.png';
import { API_CONFIG } from '@/config/apiConfig';

interface UserCardData {
  id: number;
  name: string;
  email: string;
  phone: string;
  designation?: string;
  department?: string;
  company?: string;
  profileImage?: string;
  website?: string;
  address?: string;
}

interface ApiResponse {
  id: number;
  fullname: string;
  email: string;
  mobile: string;
  country_code: string;
  site_name: string;
  user_company_name: string;
  avatar_url: string;
  user_other_detail?: {
    website_link?: string;
  };
  lock_user_permission?: {
    designation?: string;
    department_name?: string;
  };
}

export const ViBusinessCard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [userData, setUserData] = useState<UserCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const card = searchParams.get('card');
        if (!card) {
          setError('No card token provided');
          setLoading(false);
          return;
        }

        const baseUrl = API_CONFIG.BASE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');
        const response = await fetch(
          `https://${baseUrl}/pms/users/user_info.json?token=${card}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data: ApiResponse = await response.json();

        // Map API response to UserCardData
        const mappedData: UserCardData = {
          id: data.id,
          name: data.fullname,
          email: data.email,
          phone: `+${data.country_code} ${data.mobile}`,
          designation: data.lock_user_permission?.department_name || '',
          department: data.lock_user_permission?.department_name || '',
          company: data.user_company_name,
          profileImage: data.avatar_url,
          website: data.user_other_detail?.website_link || '',
          address: data.site_name,
        };

        setUserData(mappedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
        setLoading(false);
        toast.error('Failed to load user information');
      }
    };

    fetchUserData();
  }, [searchParams]);

  const handleDownloadVCard = () => {
    if (!userData) return;

    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${userData.name}
EMAIL:${userData.email}
TEL:${userData.phone}
ORG:${userData.company || ''}
TITLE:${userData.designation || ''}
ADR:;;${userData.address || ''};;;;
URL:${userData.website || ''}
END:VCARD`;

    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${userData.name.replace(/\s+/g, '_')}_contact.vcf`;
    link.click();
    window.URL.revokeObjectURL(url);
    toast.success('Contact saved to device!');
  };

  const handleShare = async () => {
    if (!userData) return;
    
    const shareData = {
      title: userData.name,
      text: `${userData.name}\n${userData.designation}\n${userData.phone}\n${userData.email}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success('Shared successfully!');
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareData.text);
        toast.success('Contact info copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      {loading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E31E24] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      ) : error ? (
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      ) : !userData ? (
        <div className="text-center">
          <p className="text-gray-600">No user data available</p>
        </div>
      ) : (
      <div className="w-full max-w-[420px]">
        {/* Business Card */}
        <div className="relative bg-white overflow-hidden" style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)', borderRadius: '0' }}>
          {/* Decorative background image */}
          <div className="absolute top-0 left-0 w-full h-[240px] overflow-hidden pointer-events-none">
            <img 
              src={viBusinessCardBg} 
              alt="VI Business Card Background" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content Section */}
          <div className="relative z-10">
            {/* Profile Image - Positioned inside VI background area */}
            <div className="absolute top-[130px] left-12">
              <div className="w-[100px] h-[100px] overflow-hidden" style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)', border: '5px solid white' }}>
                {userData.profileImage ? (
                  <img 
                    src={userData.profileImage} 
                    alt={userData.name}
                    className="w-full h-full object-cover"
                    style={{ imageRendering: '-webkit-optimize-contrast' }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <UserIcon className="w-12 h-12 text-gray-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="pt-[240px] pb-8">
              {/* Name and Designation */}
              <div className="flex items-start gap-3 mb-4 py-3 px-6" style={{ backgroundColor: '#F5F5F5' }}>
                <div className="mt-1 flex-shrink-0">
                  <UserIcon className="w-5 h-5" style={{ color: '#666' }} />
                </div>
                <div className="flex-1">
                  <h2 className="text-[15px] font-semibold leading-tight" style={{ color: '#000' }}>
                    {userData.name}
                  </h2>
                  {userData.designation && (
                    <p className="text-[13px] leading-tight mt-1" style={{ color: '#666' }}>
                      {userData.designation}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3 mb-4 px-6">
                <div className="flex-shrink-0">
                  <Phone className="w-5 h-5" style={{ color: '#666' }} />
                </div>
                <div className="flex-1">
                  <a 
                    href={`tel:${userData.phone}`}
                    className="text-[14px]"
                    style={{ color: '#000' }}
                  >
                    {userData.phone}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3 mb-4 py-3 px-6" style={{ backgroundColor: '#F5F5F5' }}>
                <div className="flex-shrink-0">
                  <Mail className="w-5 h-5" style={{ color: '#666' }} />
                </div>
                <div className="flex-1">
                  <a 
                    href={`mailto:${userData.email}`}
                    className="text-[14px] break-all"
                    style={{ color: '#000' }}
                  >
                    {userData.email}
                  </a>
                </div>
              </div>

              {/* Website */}
              {userData.website && (
                <div className="flex items-center gap-3 mb-4 px-6">
                  <div className="flex-shrink-0">
                    <Globe className="w-5 h-5" style={{ color: '#666' }} />
                  </div>
                  <div className="flex-1">
                    <a 
                      href={userData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[14px] break-all"
                      style={{ color: '#000' }}
                    >
                      {userData.website}
                    </a>
                  </div>
                </div>
              )}

              {/* Address */}
              {userData.address && (
                <div className="flex items-start gap-3 py-3 px-6" style={{ backgroundColor: '#F5F5F5' }}>
                  <div className="mt-1 flex-shrink-0">
                    <MapPin className="w-5 h-5" style={{ color: '#666' }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] leading-relaxed whitespace-pre-line" style={{ color: '#000' }}>
                      {userData.address}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Save Contact Button */}
        {/* <button
          onClick={handleDownloadVCard}
          className="w-full mt-7 text-white font-semibold text-[15px] py-[15px] px-6 rounded-full transition-all active:scale-[0.98]"
          style={{ 
            backgroundColor: '#E31E24',
            boxShadow: '0 4px 14px rgba(227, 30, 36, 0.4)',
            letterSpacing: '0.3px'
          }}
        >
          Save Contact
        </button> */}
      </div>
      )}
    </div>
  );
};

export default ViBusinessCard;
