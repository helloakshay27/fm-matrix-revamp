import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { X, User, Edit, Download, QrCode, Loader2, HandCoins, UserCheck, UserX, UserPlus, Shield, RotateCcw, Ban, Flag } from 'lucide-react';
import { getFullUrl, getAuthHeader, ENDPOINTS, API_CONFIG } from '@/config/apiConfig';
import { toast } from 'sonner';

interface VisitorObject {
  id: number;
  name?: string;
  visitor_name?: string;
  guest_name?: string;
  guest_number?: string;
  status?: string;
  is_checked_in?: boolean;
  check_in_time?: string;
  is_flagged?: boolean;
  [key: string]: unknown;
}

interface VisitorSelectionPanelProps {
  selectedVisitors: number[];
  selectedVisitorObjects: VisitorObject[];
  onCheckIn?: () => Promise<void>;
  onCheckOut: () => Promise<void>;
  onApprove: () => Promise<void>;
  onVerifyOtp?: () => Promise<void>;
  onBlacklist?: () => Promise<void>;
  onFlag?: () => Promise<void>;
  onExport: () => void;
  onClearSelection: () => void;
}

export const VisitorSelectionPanel: React.FC<VisitorSelectionPanelProps> = ({
  selectedVisitors,
  selectedVisitorObjects,
  onCheckIn,
  onCheckOut,
  onApprove,
  onVerifyOtp,
  onBlacklist,
  onFlag,
  onExport,
  onClearSelection
}) => {
  const navigate = useNavigate();
  const [isCheckInLoading, setIsCheckInLoading] = useState(false);
  const [isCheckOutLoading, setIsCheckOutLoading] = useState(false);
  const [isApproveLoading, setIsApproveLoading] = useState(false);
  const [isVerifyOtpLoading, setIsVerifyOtpLoading] = useState(false);
  const [isResendOtpLoading, setIsResendOtpLoading] = useState(false);
  const [isBlacklistLoading, setIsBlacklistLoading] = useState(false);
  const [isExportLoading, setIsExportLoading] = useState(false);
  const [isFlagLoading, setIsFlagLoading] = useState(false);
  const [resendOtpDisabled, setResendOtpDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);

  const handleCheckIn = async () => {
    console.log('VisitorSelectionPanel - Bulk check in clicked for visitors:', selectedVisitors);
    setIsCheckInLoading(true);
    try {
      if (onCheckIn) {
        await onCheckIn();
        toast.success(`Successfully checked in ${selectedVisitors.length} visitor(s).`);
      }
    } catch (error) {
      console.error('Failed to check in visitors:', error);
      toast.error("Failed to check in visitors. Please try again.");
    } finally {
      setIsCheckInLoading(false);
    }
  };

  const handleCheckOut = async () => {
    console.log('VisitorSelectionPanel - Bulk check out clicked for visitors:', selectedVisitors);
    setIsCheckOutLoading(true);
    try {
      await onCheckOut();
      toast.success(`Successfully checked out ${selectedVisitors.length} visitor(s).`);
    } catch (error) {
      console.error('Failed to check out visitors:', error);
      toast.error("Failed to check out visitors. Please try again.");
    } finally {
      setIsCheckOutLoading(false);
    }
  };

  const handleApprove = async () => {
    console.log('VisitorSelectionPanel - Bulk approve clicked for visitors:', selectedVisitors);
    setIsApproveLoading(true);
    try {
      await onApprove();
      toast.success(`Successfully approved ${selectedVisitors.length} visitor(s).`);
    } catch (error) {
      console.error('Failed to approve visitors:', error);
      toast.error("Failed to approve visitors. Please try again.");
    } finally {
      setIsApproveLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    console.log('VisitorSelectionPanel - Verify OTP clicked for visitors:', selectedVisitors);
    // Open the OTP modal instead of directly calling the API
    setIsOtpModalOpen(true);
  };

  const handleOtpSubmit = async () => {
    if (!otpValue.trim()) {
      toast.error("Please enter the OTP code.");
      return;
    }

    console.log('VisitorSelectionPanel - OTP submitted:', otpValue, 'for visitors:', selectedVisitors);
    setIsOtpVerifying(true);
    
    try {
      let successCount = 0;
      let errorCount = 0;
      
      // Process each visitor individually for OTP verification
      for (const visitorId of selectedVisitors) {
        try {
          console.log('🔐 Verifying OTP for visitor ID:', visitorId);
          
          // Construct the API URL for OTP verification
          const url = getFullUrl('/pms/admin/visitors/verify_otp.json');
          const urlWithParams = new URL(url);
          
          // Add query parameters
          urlWithParams.searchParams.append('otp', otpValue.trim());
          urlWithParams.searchParams.append('gatekeeper_id', visitorId.toString());
          
          // Add access token if available
          if (API_CONFIG.TOKEN) {
            urlWithParams.searchParams.append('access_token', API_CONFIG.TOKEN);
          }
          
          console.log('🚀 Calling OTP verification API:', urlWithParams.toString());
          
          const response = await fetch(urlWithParams.toString(), {
            method: 'POST',
            headers: {
              'Authorization': getAuthHeader(),
              'Content-Type': 'application/json',
            }
          });
          
          // Parse the response data first
          const data = await response.json();
          console.log('📋 OTP Verification API Response for visitor', visitorId, ':', data);
          
          if (!response.ok) {
            const errorText = JSON.stringify(data);
            console.error('OTP Verification API Error Response for visitor', visitorId, ':', errorText);
            
            if (response.status === 401) {
              throw new Error('Authentication failed. Please check your access token and try again.');
            } else if (response.status === 404 && data.message === "OTP Verification failed") {
              throw new Error('Invalid OTP');
            } else if (response.status === 404) {
              throw new Error('Visitor not found or OTP expired.');
            } else if (response.status === 400) {
              throw new Error('Invalid OTP code. Please check and try again.');
            } else {
              throw new Error(`OTP verification failed: ${response.status} ${response.statusText}`);
            }
          }
          
          // Check for error messages in successful responses (200 OK but with error content)
          if (data.code === 404 && data.message === "OTP Verification failed") {
            console.error('OTP Verification failed in 200 response for visitor', visitorId, ':', data);
            throw new Error('Invalid OTP');
          }
          
          // Check if OTP verification was actually successful
          if (data.otp_verified === 0 || data.otp_verified === "0") {
            console.error('OTP not verified for visitor', visitorId, ':', data);
            throw new Error('Invalid OTP');
          }
          
          console.log('✅ OTP verified successfully for visitor', visitorId, ':', data);
          successCount++;
          
        } catch (visitorError) {
          console.error('❌ Error verifying OTP for visitor', visitorId, ':', visitorError);
          errorCount++;
          
          // Show specific error message for invalid OTP
          if (visitorError instanceof Error && visitorError.message === 'Invalid OTP') {
            toast.error(`Invalid OTP for visitor ${visitorId}`);
          }
        }
      }
      
      // Show success/error summary
      if (successCount > 0) {
        toast.success(`Successfully verified OTP for ${successCount} visitor(s).`);
        setIsOtpModalOpen(false);
        setOtpValue('');
        
        // Call the parent component's onVerifyOtp if provided for additional handling
        if (onVerifyOtp) {
          await onVerifyOtp();
        }
      }
      
      if (errorCount > 0 && successCount === 0) {
        // If all failed, show specific error message
        toast.error(`OTP verification failed for all ${errorCount} visitor(s). Please check the OTP and try again.`);
      } else if (errorCount > 0) {
        // If some failed, show partial failure message
        toast.error(`Failed to verify OTP for ${errorCount} visitor(s).`);
      }
      
      // If all failed, keep modal open for retry
      if (successCount === 0) {
        setOtpValue(''); // Clear the OTP field for retry
      }
      
    } catch (error) {
      console.error('❌ Failed to verify OTP:', error);
      toast.error("Failed to verify OTP. Please check the code and try again.");
      setOtpValue(''); // Clear the OTP field for retry
    } finally {
      setIsOtpVerifying(false);
    }
  };

  const handleOtpModalClose = () => {
    setIsOtpModalOpen(false);
    setOtpValue('');
  };

  const handleResendOtp = async () => {
    console.log('VisitorSelectionPanel - Resend OTP clicked for visitors:', selectedVisitors);
    setIsResendOtpLoading(true);
    
    try {
      // Show loading toast
      toast.info(`Sending OTP to ${selectedVisitors.length} visitor(s)...`);
      
      // Process each visitor individually
      let successCount = 0;
      let errorCount = 0;
      
      for (const visitorId of selectedVisitors) {
        try {
          console.log('🚀 Sending OTP for visitor ID:', visitorId);
          
          // Construct the API URL using the correct endpoint from ENDPOINTS
          const url = getFullUrl(ENDPOINTS.RESEND_OTP);
          const urlWithParams = new URL(url);
          
          // Add query parameters
          urlWithParams.searchParams.append('id', visitorId.toString());
          
          // Add access token if available
          if (API_CONFIG.TOKEN) {
            urlWithParams.searchParams.append('access_token', API_CONFIG.TOKEN);
          }
          
          console.log('🚀 Calling resend OTP API:', urlWithParams.toString());
          
          const response = await fetch(urlWithParams.toString(), {
            method: 'GET',
            headers: {
              'Authorization': getAuthHeader(),
              'Content-Type': 'application/json',
            }
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response for visitor', visitorId, ':', errorText);
            
            if (response.status === 401) {
              throw new Error('Authentication failed. Please check your access token and try again.');
            } else {
              throw new Error(`Failed to resend OTP for visitor ${visitorId}: ${response.status} ${response.statusText}`);
            }
          }
          
          const data = await response.json();
          console.log('✅ OTP sent successfully for visitor', visitorId, ':', data);
          successCount++;
          
        } catch (visitorError) {
          console.error('❌ Error sending OTP for visitor', visitorId, ':', visitorError);
          errorCount++;
        }
      }
      
      // Show success/error summary
      if (successCount > 0) {
        toast.success(`Successfully sent OTP to ${successCount} visitor(s).`);
      }
      if (errorCount > 0) {
        toast.error(`Failed to send OTP to ${errorCount} visitor(s).`);
      }
      
      // Only disable button if at least one was successful
      if (successCount > 0) {
        // Disable resend button for 1 minute
        setResendOtpDisabled(true);
        setResendCountdown(60);
        
        const countdownInterval = setInterval(() => {
          setResendCountdown((prev) => {
            if (prev <= 1) {
              setResendOtpDisabled(false);
              clearInterval(countdownInterval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
      
    } catch (error) {
      console.error('❌ Failed to resend OTP:', error);
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setIsResendOtpLoading(false);
    }
  };

  const handleBlacklist = async () => {
    console.log('VisitorSelectionPanel - Blacklist clicked for visitors:', selectedVisitors);
    setIsBlacklistLoading(true);
    try {
      if (onBlacklist) {
        await onBlacklist();
        toast.success(`Successfully blacklisted ${selectedVisitors.length} visitor(s).`);
      }
    } catch (error) {
      console.error('Failed to blacklist visitors:', error);
      toast.error("Failed to blacklist visitors. Please try again.");
    } finally {
      setIsBlacklistLoading(false);
    }
  };

  const handleFlag = async () => {
    console.log('VisitorSelectionPanel - Flag clicked for visitors:', selectedVisitors);
    setIsFlagLoading(true);
    try {
      if (onFlag) {
        await onFlag();
        toast.success(`Successfully flagged ${selectedVisitors.length} visitor(s).`);
      }
    } catch (error) {
      console.error('Failed to flag visitors:', error);
      toast.error("Failed to flag visitors. Please try again.");
    } finally {
      setIsFlagLoading(false);
    }
  };

  const handleEdit = () => {
    console.log('VisitorSelectionPanel - Edit clicked for visitors:', selectedVisitors);
    // Navigate to bulk edit page or show edit modal
    navigate('/visitors/bulk-edit', {
      state: { selectedVisitors: selectedVisitorObjects }
    });
  };

  const handleExport = async () => {
    console.log('VisitorSelectionPanel - Export clicked for visitors:', selectedVisitors);
    
    if (selectedVisitors.length === 0) {
      toast.error("Please select visitors to export.");
      return;
    }

    setIsExportLoading(true);
    
    try {
      // Create the visitor IDs query parameters
      const visitorParams = selectedVisitors.map(id => `q[id_in][]=${id}`).join('&');
      console.log('📥 Exporting visitors with IDs:', selectedVisitors);
      console.log('📥 Generated visitor parameters:', visitorParams);
      
      // Build the export URL with selected visitor IDs
      const exportEndpoint = `/pms/admin/visitors/visitors_history.xlsx?${visitorParams}`;
      const exportUrl = getFullUrl(exportEndpoint);
      
      console.log('📥 Export endpoint:', exportEndpoint);
      console.log('📥 Full export URL:', exportUrl);

      // Make the API call to get the Excel file
      const response = await fetch(exportUrl, {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Export API error response:', errorText);
        
        if (response.status === 401) {
          console.error('401 Authentication failed during export - invalid or expired token');
          throw new Error('Authentication failed. Please login again.');
        }
        
        throw new Error(`Export failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      // Get the file blob
      const blob = await response.blob();
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 10);
      link.download = `selected_visitors_${selectedVisitors.length}_${timestamp}.xlsx`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(downloadUrl);
      
      console.log('Export completed successfully');
      toast.success(`Successfully exported ${selectedVisitors.length} visitor(s).`);
      
    } catch (error) {
      console.error('❌ Export failed:', error);
      
      // Handle authentication errors specifically
      if (error instanceof Error && error.message.includes('Authentication failed')) {
        toast.error("Your session has expired. Please login again.");
        return;
      }
      
      toast.error(`Failed to export visitors: ${error.message || 'Unknown error'}`);
    } finally {
      setIsExportLoading(false);
    }
  };

  const handleClearSelection = () => {
    console.log('VisitorSelectionPanel - Clear selection clicked');
    onClearSelection();
  };

  if (selectedVisitors.length === 0) {
    console.log('VisitorSelectionPanel - No visitors selected, hiding panel');
    return null;
  }

  console.log('VisitorSelectionPanel - Rendering with selected visitors:', selectedVisitors);

  // Check if any selected visitor is already checked in
  const hasCheckedInVisitors = selectedVisitorObjects.some(visitor => 
    visitor.is_checked_in === true || 
    visitor.status === 'checked_in' || 
    visitor.check_in_time
  );

  // Check if any selected visitor is not checked in
  const hasNotCheckedInVisitors = selectedVisitorObjects.some(visitor => 
    visitor.is_checked_in === false || 
    visitor.status !== 'checked_in' || 
    !visitor.check_in_time
  );

  return (
    <>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.15)] rounded-lg z-50 flex h-[105px]">
      {/* Beige left strip - 44px wide */}
      <div className="w-[44px] bg-[#C4B59A] rounded-l-lg flex flex-col items-center justify-center">
        <div className="text-[#C72030] font-bold text-lg">
          {selectedVisitors.length}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex items-center justify-between gap-4 px-6 flex-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#1a1a1a]">Selection</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">
              {selectedVisitorObjects.slice(0, 2).map(visitor => {
                const displayName = visitor.guest_name || visitor.name || visitor.visitor_name || `Visitor ${visitor.id}`;
                const displayNumber = visitor.guest_number ? ` (${visitor.guest_number})` : '';
                return `${displayName}${displayNumber}`;
              }).join(', ')}
              {selectedVisitorObjects.length > 2 && ` +${selectedVisitorObjects.length - 2} more`}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Verify OTP Button */}
          <Button
            onClick={handleVerifyOtp}
            disabled={false}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-gray-50 transition-colors duration-200"
          >
            <Shield className="w-6 h-6 text-black" />
            <span className="text-xs text-gray-600">Verify OTP</span>
          </Button>

          {/* Resend OTP Button */}
          <Button
            onClick={handleResendOtp}
            disabled={isResendOtpLoading || resendOtpDisabled}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-gray-50 transition-colors duration-200"
          >
            {isResendOtpLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-black" />
            ) : (
              <RotateCcw className="w-6 h-6 text-black" />
            )}
            <span className="text-xs text-gray-600">
              {resendOtpDisabled ? `Resend (${resendCountdown}s)` : 'Resend OTP'}
            </span>
          </Button>

          {/* Check In Button - Only show if there are visitors not checked in */}
          {hasNotCheckedInVisitors && onCheckIn && (
            <Button
              onClick={handleCheckIn}
              disabled={isCheckInLoading}
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-gray-50 transition-colors duration-200"
            >
              {isCheckInLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-black" />
              ) : (
                <UserPlus className="w-6 h-6 text-black" />
              )}
              <span className="text-xs text-gray-600">Check In</span>
            </Button>
          )}
          
          {/* Check Out Button */}
          <Button
            onClick={handleCheckOut}
            disabled={isCheckOutLoading}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-gray-50 transition-colors duration-200"
          >
            {isCheckOutLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-black" />
            ) : (
              <UserX className="w-6 h-6 text-black" />
            )}
            <span className="text-xs text-gray-600">Check Out</span>
          </Button>
          
          {/* Blacklist Button */}
          <Button
            onClick={handleBlacklist}
            disabled={isBlacklistLoading}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-gray-50 transition-colors duration-200"
          >
            {isBlacklistLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-black" />
            ) : (
              <Ban className="w-6 h-6 text-black" />
            )}
            <span className="text-xs text-gray-600">Blacklist</span>
          </Button>

          {/* Flag Button */}
          {onFlag && (
            <Button
              onClick={handleFlag}
              disabled={isFlagLoading}
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-gray-50 transition-colors duration-200"
            >
              {isFlagLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-black" />
              ) : (
                <Flag className="w-6 h-6 text-black" />
              )}
              <span className="text-xs text-gray-600">Flag</span>
            </Button>
          )}
          
          {/* <Button
            onClick={handleApprove}
            disabled={isApproveLoading}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-gray-50 transition-colors duration-200"
          >
            {isApproveLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-black" />
            ) : (
              <UserCheck className="w-6 h-6 text-black" />
            )}
            <span className="text-xs text-gray-600">Approve</span>
          </Button> */}
          
          {/* <Button
            onClick={handleEdit}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-gray-50 transition-colors duration-200"
          >
            <Edit className="w-6 h-6 text-black" />
            <span className="text-xs text-gray-600">Edit</span>
          </Button> */}
          
          {/* <Button
            onClick={handleExport}
            disabled={isExportLoading}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-gray-50 transition-colors duration-200"
          >
            {isExportLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-black" />
            ) : (
              <Download className="w-6 h-6 text-black" />
            )}
            <span className="text-xs text-gray-600">Export</span>
          </Button> */}
        </div>
      </div>
      
      {/* Cross button - 44px wide */}
      <div className="w-[44px] flex items-center justify-center border-l border-gray-200">
        <button
          onClick={handleClearSelection}
          className="w-full h-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
        >
          <X className="w-4 h-4 text-black" />
        </button>
      </div>
    </div>

    {/* OTP Verification Modal */}
    <Dialog open={isOtpModalOpen} onOpenChange={setIsOtpModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify OTP</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Enter the OTP code to verify {selectedVisitors.length} selected visitor(s):
            </p>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {selectedVisitorObjects.slice(0, 5).map((visitor, index) => (
                <div key={visitor.id} className="text-xs text-gray-500 flex justify-between">
                  <span>
                    • {visitor.guest_name || visitor.name || visitor.visitor_name || `Visitor ${visitor.id}`}
                    {visitor.guest_number && ` (${visitor.guest_number})`}
                  </span>
                  <span className="text-gray-400">ID: {visitor.id}</span>
                </div>
              ))}
              {selectedVisitorObjects.length > 5 && (
                <div className="text-xs text-gray-500">
                  • +{selectedVisitorObjects.length - 5} more visitors
                </div>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
              OTP Code
            </label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otpValue}
              onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              className="text-center text-lg tracking-widest"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && otpValue.trim().length >= 4) {
                  handleOtpSubmit();
                }
              }}
            />
            <p className="text-xs text-gray-500 mt-1">
              Press Enter to verify or click the Verify button
            </p>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleOtpModalClose}
            disabled={isOtpVerifying}
          >
            Cancel
          </Button>
          <Button
            onClick={handleOtpSubmit}
            disabled={isOtpVerifying || otpValue.trim().length < 4}
            className="bg-[#C72030] hover:bg-[#B01E2F] text-white"
          >
            {isOtpVerifying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify OTP'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};