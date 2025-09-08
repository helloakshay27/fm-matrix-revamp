
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, Printer, ArrowLeft, Loader2, ChevronDown, ChevronUp, User, MapPin, Calendar, FileText, Image, QrCode } from 'lucide-react';
import { staffService, SocietyStaffDetails } from '@/services/staffService';
import { toast } from 'sonner';

export const StaffDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState<SocietyStaffDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Verify number modal state
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);

  // State for expandable sections
  const [expandedSections, setExpandedSections] = useState({
    basicInfo: true,
    workInfo: true,
    scheduleInfo: true,
    qrInfo: true
  });

  // Helper function to check if value has data
  const hasData = (value: unknown) => {
    return value && value !== null && value !== undefined && value !== '';
  };

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Fetch staff details
  useEffect(() => {
    const fetchStaffDetails = async () => {
      if (!id) {
        setError('Staff ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const staffData = await staffService.getStaffDetails(id);
        setStaff(staffData);
      } catch (err) {
        console.error('Error fetching staff details:', err);
        setError(err instanceof Error ? err.message : 'Failed to load staff details');
      } finally {
        setLoading(false);
      }
    };

    fetchStaffDetails();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center py-8">
          <div className="text-lg text-gray-600">Loading staff details...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !staff) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="text-red-800 font-medium">Error loading staff details</div>
          <div className="text-red-600 text-sm mt-1">{error || 'Staff not found'}</div>
          <div className="flex gap-2 mt-3">
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 hover:bg-red-700 text-white"
              size="sm"
            >
              Retry
            </Button>
            <Button 
              onClick={() => navigate('/security/staff')}
              variant="outline"
              size="sm"
            >
              Back to Staff List
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    navigate(`/security/staff/edit/${staff.id}`);
  };

  const handlePrint = () => {
    console.log('Print QR code for staff:', staff.id);
    window.print();
  };

  const handleVerifyNumber = async () => {
    if (staff?.number_verified) {
      toast.info('Number is already verified');
      return;
    }

    setSendingOTP(true);
    try {
      // First send OTP
      await staffService.sendStaffOTP(staff.id);
      
      // Then show the OTP input modal
      setShowVerifyModal(true);
    } catch (error) {
      console.error('Error sending OTP:', error);
      // Error is already handled in the service with toast
    } finally {
      setSendingOTP(false);
    }
  };

  const handleVerifySubmit = async () => {
    if (!staff || !otp.trim()) {
      toast.error('Please enter a valid OTP');
      return;
    }

    setVerifying(true);
    try {
      await staffService.verifyStaffNumber(staff.id, otp.trim());
      
      // Refresh staff data to get updated verification status
      const updatedStaff = await staffService.getStaffDetails(staff.id.toString());
      setStaff(updatedStaff);
      
      setShowVerifyModal(false);
      setOtp('');
      toast.success('Number verified successfully!');
    } catch (error) {
      console.error('Error verifying number:', error);
      // Error is already handled in the service with toast
    } finally {
      setVerifying(false);
    }
  };

  const handleCloseVerifyModal = () => {
    setShowVerifyModal(false);
    setOtp('');
  };

  const handleResendOTP = async () => {
    if (!staff) return;

    setSendingOTP(true);
    try {
      await staffService.sendStaffOTP(staff.id);
      toast.success('OTP resent successfully!');
    } catch (error) {
      console.error('Error resending OTP:', error);
      // Error is already handled in the service with toast
    } finally {
      setSendingOTP(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (hour: string | null, minute: string | null) => {
    if (!hour || !minute) return '00:00';
    return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
  };

  // Expandable Section Component (similar to ticket details)
  const ExpandableSection = ({ 
    title, 
    icon: Icon, 
    isExpanded, 
    onToggle, 
    children,
    hasData = true 
  }: {
    title: string;
    icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
    isExpanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    hasData?: boolean;
  }) => (
    <div className="border-2 rounded-lg mb-6">
      <div 
        onClick={onToggle} 
        className="flex items-center justify-between cursor-pointer p-6"
        style={{ backgroundColor: 'rgb(246 244 238)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
            <Icon className="w-4 h-4" style={{ color: "#C72030" }} />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
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
        <div 
          className="p-6"
          style={{ backgroundColor: 'rgb(246 247 247)' }}
        >
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
          <button onClick={() => navigate('/security/staff')} className="flex items-center gap-1 hover:text-[#C72030] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-bold text-[#1a1a1a]">Back to Staff List</span>
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Staff Summary</h1>
          <div className="flex gap-3">
            <Button
              onClick={handleVerifyNumber}
              className="bg-[#8B4B8C] hover:bg-[#7A4077] text-white px-4 py-2"
              disabled={staff.number_verified || sendingOTP}
            >
              {sendingOTP ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Sending OTP...
                </>
              ) : staff.number_verified ? (
                'Number Verified'
              ) : (
                'Verify Number'
              )}
            </Button>
            <Button
              onClick={handleEdit}
              style={{ backgroundColor: '#C72030' }} 
              className="text-white hover:bg-[#C72030]/90"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Section 1: Basic Information */}
      <ExpandableSection
        title="BASIC INFORMATION"
        icon={User}
        isExpanded={expandedSections.basicInfo}
        onToggle={() => toggleSection('basicInfo')}
        hasData={hasData(staff.full_name) || hasData(staff.email) || hasData(staff.mobile)}
      >
        {/* Centered Image and Name */}
        <div className="flex flex-col items-center mb-8">
          <img 
            src={staff.staff_image_url || '/placeholder.svg'} 
            alt="Staff profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{staff.full_name}</h3>
          <p className="text-gray-600 mb-4">{staff.work_type_name}</p>
        </div>

        {/* Two Column Grid for Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-4">
            {hasData(staff.full_name) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Name</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{staff.full_name}</span>
              </div>
            )}
            
            {hasData(staff.email) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Email</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-blue-600 font-semibold flex-1">{staff.email}</span>
              </div>
            )}
            
            {hasData(staff.mobile) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Mobile</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{staff.mobile}</span>
              </div>
            )}
            
            {hasData(staff.vendor_name) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Vendor Name</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{staff.vendor_name}</span>
              </div>
            )}
            
            {hasData(staff.soc_staff_id) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Staff ID</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{staff.soc_staff_id}</span>
              </div>
            )}
            
            {hasData(staff.valid_from) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Valid From</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{formatDate(staff.valid_from)}</span>
              </div>
            )}

             {hasData(staff.status_text) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Status</span>
                <span className="text-gray-500 mx-3">:</span>
                <div className="flex-1">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    staff.status_text === 'Approved' ? 'bg-green-100 text-green-600' :
                    staff.status_text === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {staff.status_text}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
           
            
            {hasData(staff.department_name) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Department</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{staff.department_name}</span>
              </div>
            )}
            
            {hasData(staff.unit_name) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Unit</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{staff.unit_name}</span>
              </div>
            )}
            
            {hasData(staff.work_type_name) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Work Type</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{staff.work_type_name}</span>
              </div>
            )}
            
            {hasData(staff.created_at) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Created On</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{formatDate(staff.created_at)}</span>
              </div>
            )}
            
            <div className="flex items-start">
              <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Number Verified</span>
              <span className="text-gray-500 mx-3">:</span>
              <div className="flex-1">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  staff.number_verified ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {staff.number_verified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </ExpandableSection>

      {/* Section 2: Work Information */}
      <ExpandableSection
        title="WORK INFORMATION"
        icon={FileText}
        isExpanded={expandedSections.workInfo}
        onToggle={() => toggleSection('workInfo')}
        hasData={hasData(staff.expiry_type) || hasData(staff.expiry_value)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-4">
            {hasData(staff.expiry_type) && (
              <div className="flex items-start">
                <span className="text-gray-500 w-40 flex-shrink-0 font-medium">Expiry Type</span>
                <span className="text-gray-500 mx-3">:</span>
                <span className="text-gray-900 font-semibold flex-1">{staff.expiry_type} ({staff.expiry_value})</span>
              </div>
            )}
          </div>
        </div>
      </ExpandableSection>

      {/* Section 3: Schedule Information */}
      <ExpandableSection
        title="SCHEDULE INFORMATION"
        icon={Calendar}
        isExpanded={expandedSections.scheduleInfo}
        onToggle={() => toggleSection('scheduleInfo')}
        hasData={staff.helpdesk_operations && staff.helpdesk_operations.length > 0}
      >
        {staff.helpdesk_operations && staff.helpdesk_operations.length > 0 ? (
          <div className="bg-white rounded-lg border">
            <div className="grid grid-cols-2 gap-4 p-4">
              <div className="text-center font-semibold border-b border-gray-300 pb-2">Day</div>
              <div className="text-center font-semibold border-b border-gray-300 pb-2">Time</div>
              {staff.helpdesk_operations.map((operation, index) => (
                <React.Fragment key={index}>
                  <div className="text-center py-2 border-b border-gray-200">
                    {operation.day}
                  </div>
                  <div className="text-center py-2 border-b border-gray-200 text-blue-600">
                    {operation.start_hour && operation.end_hour 
                      ? `${formatTime(operation.start_hour, operation.start_min)} to ${formatTime(operation.end_hour, operation.end_min)}`
                      : '--:-- to --:--'
                    }
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No schedule information found</p>
        )}
      </ExpandableSection>

      {/* Section 4: QR Code Information */}
      <ExpandableSection
        title="QR CODE"
        icon={QrCode}
        isExpanded={expandedSections.qrInfo}
        onToggle={() => toggleSection('qrInfo')}
        hasData={staff.qr_code_present}
      >
        <div className="text-center">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-8 mb-4 inline-block">
            {staff.qr_code_present && staff.qr_code_url ? (
              <img 
                src={staff.qr_code_url} 
                alt="QR Code"
                className="w-48 h-48 mx-auto"
              />
            ) : (
              <div className="w-48 h-48 mx-auto bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No QR Code Available</span>
              </div>
            )}
          </div>
          <div>
            <Button
              onClick={handlePrint}
              className="bg-[#8B4B8C] hover:bg-[#7A4077] text-white px-6 py-2 flex items-center gap-2 mx-auto"
              disabled={!staff.qr_code_present}
            >
              <Printer className="w-4 h-4" />
              Print QR Code
            </Button>
          </div>
        </div>
      </ExpandableSection>

      {/* Verify Number Modal */}
      <Dialog open={showVerifyModal} onOpenChange={setShowVerifyModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify Staff Number</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 5-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={5}
                className="text-center text-lg tracking-widest"
              />
            </div>
            <div className="text-sm text-gray-600">
              OTP has been sent to the staff member's mobile number. Please enter the received OTP to verify.
            </div>
            <div className="flex justify-center">
              <Button
                variant="link"
                onClick={handleResendOTP}
                disabled={sendingOTP}
                className="text-[#8B4B8C] hover:text-[#7A4077] p-0 h-auto text-sm"
              >
                {sendingOTP ? 'Resending...' : 'Resend OTP'}
              </Button>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleCloseVerifyModal}
              disabled={verifying}
            >
              Cancel
            </Button>
            <Button
              onClick={handleVerifySubmit}
              disabled={verifying || !otp.trim()}
              className="bg-[#8B4B8C] hover:bg-[#7A4077] text-white"
            >
              {verifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                'Verify'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
