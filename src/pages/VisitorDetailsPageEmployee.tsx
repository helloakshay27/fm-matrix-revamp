import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, User, QrCode, ClipboardList, Edit, ChevronUp, ChevronDown, LucideIcon, FileText, File, FileSpreadsheet, Eye, Download, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { API_CONFIG, getFullUrl, getAuthenticatedFetchOptions, ENDPOINTS } from '@/config/apiConfig';
import { AttachmentPreviewModal } from '@/components/AttachmentPreviewModal';

// Types
interface AdditionalVisitor {
  additional_visitor: {
    id: number;
    name: string;
    mobile: string;
    gatekeeper_id: number;
    pass_number?: string;
  };
}

interface ItemMovement {
  item_movement: {
    id: number;
    movement_type?: string;
    item_details: Array<{
      item_detail: {
        id: number;
        name?: string;
        number: string;
      };
    }>;
  };
}

interface VisitorData {
  id: number;
  guest_name: string;
  guest_number: string;
  guest_vehicle_number?: string;
  guest_from?: string;
  visit_purpose?: string;
  person_to_meet_id?: number;
  vstatus: string;
  checkin_time?: string;
  checkout_time?: string;
  expected_at?: string;
  guest_entry_time?: string;
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
  additional_visitors?: AdditionalVisitor[];
  item_movements?: ItemMovement[];
  visitor_documents?: Array<{
    id: number;
    document_url: string;
  }>;
  pass_days?: string[];
  pass_valid?: boolean;
  visitor_host_name?: string;
  visitor_host_mobile?: string;
  visitor_host_email?: string;
}

export const VisitorDetailsPageEmployee = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [visitorData, setVisitorData] = useState<VisitorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [disabledOTPButtons, setDisabledOTPButtons] = useState<Record<number, boolean>>({});

  // State for document modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  // Helper function to check if value has data
  const hasData = (value: string | undefined | null): boolean => {
    return value !== null && value !== undefined && value !== '';
  };

  // State for expandable sections
  const [expandedSections, setExpandedSections] = useState({
    basicInformation: true, // Typically expanded by default for details
    additionalVisitors: true,
    goodsInwardInfo: true,
    passInformation: true,
    governmentId: true,
    qrCode: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    const fetchVisitorDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const url = getFullUrl(`/pms/visitors/${id}.json`);
        const options = getAuthenticatedFetchOptions();

        console.log('Fetching visitor details from:', url);

        const response = await fetch(url, options);

        if (!response.ok) {
          throw new Error(`Failed to fetch visitor details: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Visitor details received:', data);

        // Handle the nested gatekeeper structure from the API
        const visitor = data.gatekeeper || data.visitor || data;
        setVisitorData(visitor);
      } catch (err) {
        setError('Failed to fetch visitor details');
        console.error('Error fetching visitor details:', err);
        toast.error('Failed to load visitor details');
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
      setDisabledOTPButtons(prev => ({ ...prev, [visitorData.id]: true }));

      // Construct the API URL using the resend OTP endpoint
      const url = getFullUrl(ENDPOINTS.RESEND_OTP);
      const options = getAuthenticatedFetchOptions();

      // Add query parameter for visitor ID
      const urlWithParams = new URL(url);
      urlWithParams.searchParams.append('id', id.toString());
      if (API_CONFIG.TOKEN) {
        urlWithParams.searchParams.append('access_token', API_CONFIG.TOKEN);
      }

      const response = await fetch(urlWithParams.toString(), options);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to resend OTP: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Show success toast
      toast.success('OTP sent successfully!');

      // Re-enable the button after 1 minute (60000ms)
      setTimeout(() => {
        setDisabledOTPButtons(prev => ({ ...prev, [visitorData.id]: false }));
      }, 60000);

    } catch (err) {
      console.error('❌ Error sending OTP:', err);
      toast.error('Failed to send OTP. Please try again.');

      // Re-enable the button on error
      setDisabledOTPButtons(prev => ({ ...prev, [visitorData.id]: false }));
    }
  };

  const handleSkipApproval = async () => {
    if (!visitorData || !id) return;

    try {
      console.log('Skipping approval for visitor:', id);

      // Show loading toast
      toast.info('Processing approval...');

      // Construct the API URL
      const url = getFullUrl(`/pms/visitors/${id}.json`);
      const options = getAuthenticatedFetchOptions();

      // Set the request method to PUT and add the request body
      const requestOptions = {
        ...options,
        method: 'PUT',
        headers: {
          ...options.headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approval: "true",
          gatekeeper: {
            approve: "1"
          }
        })
      };

      console.log('🚀 Calling skip approval API:', url);
      console.log('📋 Request body:', requestOptions.body);

      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error(`Failed to skip approval: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Approval skipped successfully:', data);

      // Show success toast
      toast.success('Host approval skipped successfully!');

      // Refresh visitor data
      window.location.reload();

    } catch (err) {
      console.error('❌ Error skipping approval:', err);
      toast.error('Failed to skip approval. Please try again.');
    }
  };

  function getLocalISOString() {
    const now = new Date();
    const offsetMs = now.getTimezoneOffset() * 60 * 1000; // offset in ms
    const localTime = new Date(now - offsetMs);
    const iso = localTime.toISOString().slice(0, 19);

    const offset = -now.getTimezoneOffset();
    const sign = offset >= 0 ? '+' : '-';
    const pad = n => String(Math.floor(Math.abs(n))).padStart(2, '0');
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
          status: "checked_in"
        }
      };

      const requestOptions = {
        ...options,
        method: 'PUT',
        headers: {
          ...options.headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      };

      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to check-in visitor: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Show success toast
      toast.success('Visitor checked in successfully!');

      // Refresh visitor data
      window.location.reload();

    } catch (err) {
      console.error('❌ Error checking in visitor:', err);
      toast.error('Failed to check-in visitor. Please try again.');
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
          guest_exit_time: new Date().toISOString().slice(0, 19) + "+05:30", // Format: 2025-08-22T19:07:37+05:30
          exit_gate_id: "",
          status: "checked_out",
          gatekeeper_ids: id
        }
      };

      // Set the request method to PUT and add the request body
      const requestOptions = {
        ...options,
        method: 'PUT',
        headers: {
          ...options.headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      };

      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to checkout visitor: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Show success toast
      toast.success('Visitor checked out successfully!');

      // Refresh visitor data
      window.location.reload();

    } catch (err) {
      console.error('❌ Error checking out visitor:', err);
      toast.error('Failed to checkout visitor. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading visitor details...</div>
        </div>
      </div>
    );
  }

  if (error || !visitorData) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">{error || 'Visitor not found'}</div>
        </div>
      </div>
    );
  }

  // Expandable Section Component (reused from TicketDetailsPage)
  const ExpandableSection = ({
    title,
    icon: Icon,
    isExpanded,
    onToggle,
    children,
    hasData = true
  }: {
    title: string;
    icon: LucideIcon;
    isExpanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    hasData?: boolean;
  }) => (
    <div className="bg-transparent border-none shadow-none rounded-lg mb-6">
      <div
        onClick={onToggle}
        className="figma-card-header flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="figma-card-icon-wrapper">
            <Icon className="figma-card-icon" />
          </div>
          <h3 className="figma-card-title uppercase">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {!hasData && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">No data</span>
          )}
          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
        </div>
      </div>
      {isExpanded && (
        <div className="figma-card-content">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <button onClick={handleBackToList} className="flex items-center gap-1 hover:text-[#C72030] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className=" font-bold text-[#1a1a1a]">Back to Visitor List</span>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Visitor Details</h1>
          <div className="flex gap-3">
            {/* Dynamic Action Buttons */}
            {visitorData && (
              <>
                {/* Resend OTP Button - Show for pending/unapproved visitors */}
                {(visitorData.vstatus === 'Pending' || visitorData.approve === 0) && (
                  <Button
                    className={`px-3 py-2 text-sm rounded ${disabledOTPButtons[visitorData.id]
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-orange-500 hover:bg-orange-600'
                      } text-white`}
                    onClick={handleResendOTP}
                    disabled={disabledOTPButtons[visitorData.id]}
                  >
                    {disabledOTPButtons[visitorData.id] ? 'Disabled for 1 min' : 'Resend OTP'}
                  </Button>
                )}

                {/* Skip Host Approval Button - Show for pending/unapproved visitors */}
                {(visitorData.vstatus === 'Pending' || visitorData.approve === 0) && (
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 text-sm rounded"
                    onClick={handleSkipApproval}
                  >
                    Skip Host Approval
                  </Button>
                )}

                {/* Check In Button - Show for approved visitors who haven't checked in */}
                {(visitorData.vstatus === 'Approved' && !visitorData.guest_entry_time) ? (
                  <Button
                    className="bg-green-500 hover:bg-green-600 !text-white px-3 py-2 text-sm rounded"
                    onClick={handleCheckIn}
                  >
                    Check In
                  </Button>
                ) : visitorData.vstatus === 'Approved' && visitorData.guest_entry_time && !visitorData.master_exit_time ? (
                  <Button
                    className="bg-green-500 hover:bg-green-600 !text-white px-3 py-2 text-sm rounded"
                    onClick={handleCheckOut}
                  >
                    Check Out
                  </Button>
                ) : <></>}

                {/* Check Out Button - Show for checked-in visitors who haven't checked out */}
                {(visitorData.vstatus === 'Approved' && visitorData.check_in && !visitorData.check_out) && (
                  <Button
                    className="bg-[#F97316] hover:bg-[#F97316]/90 !text-white px-3 py-2 text-sm rounded"
                    onClick={handleCheckOut}
                  >
                    Check Out
                  </Button>
                )}
              </>
            )}

            {/* Edit Button */}
            {/* <Button onClick={handleUpdate} style={{ backgroundColor: '#C72030' }} className="text-white hover:bg-[#C72030]/90">
              <Edit className="w-4 h-4 mr-2" /> Edit
            </Button> */}
          </div>
        </div>
      </div>

      {/* Section 1: Basic Information */}
      <ExpandableSection
        title="BASIC INFORMATION"
        icon={User}
        isExpanded={expandedSections.basicInformation}
        onToggle={() => toggleSection('basicInformation')}
        hasData={hasData(visitorData.guest_name) || hasData(visitorData.vstatus)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-4">
            {/* Visitor Image */}
            {hasData(visitorData.image) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Visitor Image</span>
                <span className="text-gray-500 mx-3">:</span>
                <div className="flex-1">
                  <img
                    src={visitorData.image?.startsWith('http') ? visitorData.image : '/placeholder.svg'}
                    alt={visitorData.guest_name || 'Visitor'}
                    className="w-24 h-24 object-cover rounded-md"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
              </div>
            )}

            {hasData(visitorData.guest_name) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Visitor Name</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{visitorData.guest_name}</span>
              </div>
            )}
            {hasData(visitorData.visitor_host_name) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Visitor Host Name</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{visitorData.visitor_host_name}</span>
              </div>
            )}
            {hasData(visitorData.visitor_host_mobile) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Visitor Host Mobile</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{visitorData.visitor_host_mobile}</span>
              </div>
            )}
            {hasData(visitorData.visitor_host_email) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Visitor Host Email</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{visitorData.visitor_host_email}</span>
              </div>
            )}

            {hasData(visitorData.vstatus) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Status</span>
                <span className="text-gray-500 mx-3">:</span>
                <div className="flex-1">
                  <Badge className={`px-2 py-1 rounded-full text-xs font-semibold ${visitorData.vstatus === 'Approved' ? 'bg-green-100 text-green-700' :
                    visitorData.vstatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                    {visitorData.vstatus}
                  </Badge>
                </div>
              </div>
            )}

            {hasData(visitorData.guest_number) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Mobile</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{visitorData.guest_number}</span>
              </div>
            )}

            {hasData(visitorData.visit_purpose) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Visit Purpose</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{visitorData.visit_purpose}</span>
              </div>
            )}

            {hasData(visitorData.notes) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Notes</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{visitorData.notes}</span>
              </div>
            )}

            {hasData(visitorData.guest_type) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Guest Type</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{visitorData.guest_type}</span>
              </div>
            )}

            {hasData(visitorData.visitor_type) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Visitor Type</span>
                <span className="text-gray-500 mx-3">:</span>
                <div className="flex-1">
                  <Badge className={`px-2 py-1 rounded-full text-xs font-semibold ${visitorData.visitor_type === 'unexpected' ? 'bg-red-100 text-red-700' :
                    visitorData.visitor_type === 'expected' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                    {visitorData.visitor_type ? visitorData.visitor_type.charAt(0).toUpperCase() + visitorData.visitor_type.slice(1) : '--'}
                  </Badge>
                </div>
              </div>
            )}

            {/* {hasData(visitorData.otp_string) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">OTP</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{visitorData.otp_string}</span>
              </div>
            )} */}
          </div>

          <div className="space-y-4">
            {hasData(visitorData.guest_from) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Visitor From</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{visitorData.guest_from}</span>
              </div>
            )}

            {hasData(visitorData.visit_to) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Visit To</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{visitorData.visit_to}</span>
              </div>
            )}

            {hasData(visitorData.visit_to_number) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Visit To Number</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{visitorData.visit_to_number}</span>
              </div>
            )}

            {hasData(visitorData.guest_vehicle_number) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Vehicle Number</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{visitorData.guest_vehicle_number}</span>
              </div>
            )}

            {hasData(visitorData.checkin_time) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Check-in Time</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{visitorData.checkin_time}</span>
              </div>
            )}

            {hasData(visitorData.checkout_time) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Check-out Time</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{visitorData.checkout_time}</span>
              </div>
            )}

            {hasData(visitorData.expected_at) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Expected At</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{visitorData.expected_at}</span>
              </div>
            )}

            {hasData(visitorData.location) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Location</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{visitorData.location}</span>
              </div>
            )}
          </div>
        </div>
      </ExpandableSection>

      {/* Section 2: Additional Visitor Details */}
      <ExpandableSection
        title="ADDITIONAL VISITOR DETAILS"
        icon={ClipboardList}
        isExpanded={expandedSections.additionalVisitors}
        onToggle={() => toggleSection('additionalVisitors')}
        hasData={visitorData.additional_visitors && visitorData.additional_visitors.length > 0}
      >
        {visitorData.additional_visitors && visitorData.additional_visitors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            {visitorData.additional_visitors.map((visitor: AdditionalVisitor, index: number) => (
              <div key={visitor.additional_visitor.id || index} className="space-y-2 border-b pb-4 mb-4 last:border-b-0 last:pb-0">
                <h4 className="font-semibold text-gray-700">Additional Visitor {index + 1}</h4>
                {hasData(visitor.additional_visitor.name) && (
                  <div className="flex items-start">
                    <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Name</span>
                    <span className="text-gray-500 mx-3">:</span>
                    <span className="text-gray-900 font-semibold flex-1">{visitor.additional_visitor.name}</span>
                  </div>
                )}
                {hasData(visitor.additional_visitor.mobile) && (
                  <div className="flex items-start">
                    <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Mobile Number</span>
                    <span className="text-gray-500 mx-3">:</span>
                    <span className="text-gray-900 font-semibold flex-1">{visitor.additional_visitor.mobile}</span>
                  </div>
                )}
                {hasData(visitor.additional_visitor.pass_number) && (
                  <div className="flex items-start">
                    <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Pass Number</span>
                    <span className="text-gray-500 mx-3">:</span>
                    <span className="text-gray-900 font-semibold flex-1">{visitor.additional_visitor.pass_number}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No additional visitor details found</p>
        )}
      </ExpandableSection>

      {/* Section 3: Goods Inward Info */}

      


      {/* Section 5: Government ID */}
      <ExpandableSection
        title="GOVERNMENT ID"
        icon={CreditCard}
        isExpanded={expandedSections.governmentId}
        onToggle={() => toggleSection('governmentId')}
        hasData={Array.isArray(visitorData.visitor_documents) && visitorData.visitor_documents.length > 0}
      >
        {Array.isArray(visitorData.visitor_documents) && visitorData.visitor_documents.length > 0 ? (
          <div className="flex items-center flex-wrap gap-4">
            {visitorData.visitor_documents.map((document: any) => {
              const url = document.document_url;
              const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url);
              const isPdf = /\.pdf$/i.test(url);
              const isExcel = /\.(xls|xlsx|csv)$/i.test(url);
              const isWord = /\.(doc|docx)$/i.test(url);
              const isDownloadable = isPdf || isExcel || isWord;

              return (
                <div
                  key={document.id}
                  className="flex relative flex-col items-center border rounded-lg pt-8 px-3 pb-4 w-full max-w-[150px] bg-[#F6F4EE] shadow-md"
                >
                  {isImage ? (
                    <>
                      <button
                        className="absolute top-2 right-2 z-10 p-1 text-gray-600 hover:text-black rounded-full"
                        title="View"
                        onClick={() => {
                          setSelectedDoc({
                            ...document,
                            url,
                            type: 'image'
                          });
                          setIsModalOpen(true);
                        }}
                        type="button"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <img
                        src={url}
                        alt={`Document_${document.id}`}
                        className="w-14 h-14 object-cover rounded-md border mb-2 cursor-pointer"
                        onClick={() => {
                          setSelectedDoc({
                            ...document,
                            url,
                            type: 'image'
                          });
                          setIsModalOpen(true);
                        }}
                      />
                    </>
                  ) : isPdf ? (
                    <div className="w-14 h-14 flex items-center justify-center border rounded-md text-red-600 bg-white mb-2">
                      <FileText className="w-6 h-6" />
                    </div>
                  ) : isExcel ? (
                    <div className="w-14 h-14 flex items-center justify-center border rounded-md text-green-600 bg-white mb-2">
                      <FileSpreadsheet className="w-6 h-6" />
                    </div>
                  ) : isWord ? (
                    <div className="w-14 h-14 flex items-center justify-center border rounded-md text-blue-600 bg-white mb-2">
                      <FileText className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 flex items-center justify-center border rounded-md text-gray-600 bg-white mb-2">
                      <File className="w-6 h-6" />
                    </div>
                  )}
                  <span className="text-xs text-center truncate max-w-[120px] mb-2 font-medium">
                    {url.split('/').pop() || `Document_${document.id}`}
                  </span>
                  {isDownloadable && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2 h-5 w-5 p-0 text-gray-600 hover:text-black"
                      onClick={() => {
                        setSelectedDoc({
                          ...document,
                          url,
                          type: isPdf ? 'pdf' : isExcel ? 'excel' : isWord ? 'word' : 'file'
                        });
                        setIsModalOpen(true);
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No government ID documents found</p>
        )}
      </ExpandableSection>

      {/* Section 6: QR Code */}
      <ExpandableSection
        title="QR CODE"
        icon={QrCode}
        isExpanded={expandedSections.qrCode}
        onToggle={() => toggleSection('qrCode')}
        hasData={hasData(visitorData.qr_code_url)}
      >
        {hasData(visitorData.qr_code_url) ? (
          <div className="flex justify-center items-center py-8">
            <img src={visitorData.qr_code_url} alt="QR Code" className="w-48 h-48 border p-2 rounded-md" />
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No QR code available</p>
        )}
      </ExpandableSection>

      {/* Attachment Preview Modal */}
      <AttachmentPreviewModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedDoc={selectedDoc}
        setSelectedDoc={setSelectedDoc}
      />
    </div>
  );
};

export default VisitorDetailsPageEmployee;
