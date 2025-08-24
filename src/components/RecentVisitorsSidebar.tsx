import React, { useState, useEffect, useCallback } from 'react';
import { Star, MessageSquare, Flag, ChevronRight, Building2, User, Globe, Clock, MapPin, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddCommentModal } from './AddCommentModal';
import { useNavigate } from 'react-router-dom';
import { fetchRecentVisitors, RecentVisitor as APIRecentVisitor } from '../services/recentVisitorsAPI';
import { toast } from 'sonner';

// Transform API data to match component interface
interface RecentVisitor {
  id: string;
  visitorName: string;
  purpose: string;
  host: string;
  status: string;
  checkinTime: string;
  location: string;
  phoneNumber: string;
  avatar: string;
  visitDuration?: string;
  approvedBy?: string;
  guestFrom?: string;
  vehicleNumber?: string;
}

export function RecentVisitorsSidebar() {
  const [commentModal, setCommentModal] = useState<{
    isOpen: boolean;
    visitorId: string;
  }>({
    isOpen: false,
    visitorId: ''
  });
  
  // Initialize state from localStorage
  const [flaggedVisitors, setFlaggedVisitors] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('flaggedVisitors');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });
  
  const [goldenVisitors, setGoldenVisitors] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('goldenVisitors');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });
  
  const [recentVisitors, setRecentVisitors] = useState<RecentVisitor[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('flaggedVisitors', JSON.stringify(Array.from(flaggedVisitors)));
  }, [flaggedVisitors]);

  useEffect(() => {
    localStorage.setItem('goldenVisitors', JSON.stringify(Array.from(goldenVisitors)));
  }, [goldenVisitors]);

  const transformAPIDataToComponent = (apiVisitors: APIRecentVisitor[]): RecentVisitor[] => {
    return apiVisitors.map(visitor => ({
      id: visitor.id.toString(),
      visitorName: visitor.guest_name,
      purpose: visitor.visit_purpose,
      host: visitor.primary_host,
      status: visitor.approve_status,
      checkinTime: visitor.created_at_formatted,
      location: visitor.guest_from || 'N/A', // Using guest_from as location
      phoneNumber: visitor.guest_number,
      avatar: visitor.visitor_image,
      guestFrom: visitor.guest_from,
      vehicleNumber: visitor.guest_vehicle_number,
      approvedBy: visitor.approve_status === 'Approved' ? 'System' : undefined
    }));
  };

  const fetchRecentVisitorsData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('=== Fetching recent visitors from API ===');
      
      // Add debug logging for API configuration
      console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
      console.log('Token available:', !!localStorage.getItem('token'));
      
      const response = await fetchRecentVisitors();
      console.log('Raw API response:', response);
      
      if (response && response.recent_visitors && Array.isArray(response.recent_visitors)) {
        const transformedVisitors = transformAPIDataToComponent(response.recent_visitors);
        console.log('Transformed visitors:', transformedVisitors);
        setRecentVisitors(transformedVisitors);
        console.log('Recent visitors loaded successfully, count:', transformedVisitors.length);
        
        if (transformedVisitors.length > 0) {
          toast.success(`Loaded ${transformedVisitors.length} recent visitors`);
        } else {
          toast.info('No recent visitors found');
        }
      } else {
        console.error('Invalid API response structure:', response);
        throw new Error('Invalid API response structure');
      }
      
    } catch (error) {
      console.error('Error fetching recent visitors:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      toast.error('Failed to fetch recent visitors - using fallback data');
      
      // Fallback to mock data if API fails
      const mockVisitors: RecentVisitor[] = [
        {
          id: 'MOCK-001',
          visitorName: 'John Smith (Mock Data)',
          purpose: 'Business Meeting',
          host: 'Sarah Johnson',
          status: 'Approved',
          checkinTime: '24/08/25, 10:30 AM',
          location: 'Mumbai Office',
          phoneNumber: '+91 9876543210',
          avatar: '/placeholder.svg',
          visitDuration: '2.5 hrs',
          approvedBy: 'Reception Team',
          guestFrom: 'Mumbai',
          vehicleNumber: 'MH01AB1234'
        },
        {
          id: 'MOCK-002',
          visitorName: 'Mike Chen (Mock Data)',
          purpose: 'Personal Visit',
          host: 'David Wilson',
          status: 'Pending',
          checkinTime: '24/08/25, 09:45 AM',
          location: 'Delhi Office',
          phoneNumber: '+91 8765432109',
          avatar: '/placeholder.svg',
          visitDuration: '1.5 hrs',
          approvedBy: 'Security',
          guestFrom: 'Delhi',
          vehicleNumber: 'DL02XY5678'
        }
      ];
      
      setRecentVisitors(mockVisitors);
      console.log('Set mock data, count:', mockVisitors.length);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecentVisitorsData();
  }, [fetchRecentVisitorsData]);

  const handleAddComment = (visitorId: string) => {
    setCommentModal({
      isOpen: true,
      visitorId
    });
  };

  const handleFlag = async (visitorId: string) => {
    try {
      // Update local state first for immediate UI feedback
      setFlaggedVisitors(prev => {
        const newSet = new Set(prev);
        if (newSet.has(visitorId)) {
          newSet.delete(visitorId);
        } else {
          newSet.add(visitorId);
        }
        return newSet;
      });

      // TODO: Make API call when visitor flagging endpoint is available
      // await apiClient.post(`/visitors/mark_as_flagged?ids=[${visitorId}]`);
      
      console.log(`Visitor ${visitorId} flagged/unflagged successfully`);
      
    } catch (error) {
      console.error('Error flagging visitor:', error);
      
      // Revert state on error
      setFlaggedVisitors(prev => {
        const newSet = new Set(prev);
        if (newSet.has(visitorId)) {
          newSet.delete(visitorId);
        } else {
          newSet.add(visitorId);
        }
        return newSet;
      });
    }
  };

  const handleGoldenVisitor = async (visitorId: string) => {
    try {
      // Update local state first for immediate UI feedback
      setGoldenVisitors(prev => {
        const newSet = new Set(prev);
        if (newSet.has(visitorId)) {
          newSet.delete(visitorId);
        } else {
          newSet.add(visitorId);
        }
        return newSet;
      });

      // TODO: Make API call when visitor golden marking endpoint is available
      // await apiClient.post(`/visitors/mark_as_golden?ids=[${visitorId}]`);
      
      console.log(`Visitor ${visitorId} marked/unmarked as golden visitor successfully`);
      
    } catch (error) {
      console.error('Error marking as golden visitor:', error);
      
      // Revert state on error
      setGoldenVisitors(prev => {
        const newSet = new Set(prev);
        if (newSet.has(visitorId)) {
          newSet.delete(visitorId);
        } else {
          newSet.add(visitorId);
        }
        return newSet;
      });
    }
  };

  const handleViewDetails = (visitorId: string) => {
    navigate(`/security/visitor/details/${visitorId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'expired':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
      <div className="w-full bg-[#C4B89D]/25 border-l border-gray-200 p-4 h-full xl:max-h-[1208px] overflow-hidden flex flex-col">        
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-red-600 mb-2">
              Recent Visitors
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchRecentVisitorsData}
              disabled={loading}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        
        {/* Visitors List */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {loading ? (
            <div className="text-center py-4 text-gray-500">Loading...</div>
          ) : (
            recentVisitors.map((visitor, index) => (
              <div 
                key={`${visitor.id}-${index}`} 
                className="bg-[#C4B89D]/20 rounded-lg p-4 shadow-sm border border-[#C4B89D] border-opacity-60" 
                style={{ borderWidth: '0.6px' }}
              >
                {/* Header with ID, Star, and Status */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-900 text-base">{visitor.visitorName}</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(visitor.status)}`}>
                      {visitor.status}
                    </span>
                  </div>
                </div>
                
                {/* Title and Visit Duration */}
                <div className="flex items-center justify-between mb-4">
                  {/* <h3 className="font-semibold text-gray-900 text-base">{visitor.visitorName}</h3> */}
                  {visitor.visitDuration && (
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-gray-700">Duration :</span>
                      <span className="text-sm font-bold text-blue-600">"{visitor.visitDuration}"</span>
                    </div>
                  )}
                </div>
                
                {/* Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-gray-700 min-w-[100px]">Purpose</span>
                    <span className="text-sm text-gray-700">:</span>
                    <span className="text-sm text-gray-900">{visitor.purpose}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-gray-700 min-w-[100px]">Host</span>
                    <span className="text-sm text-gray-700">:</span>
                    <span className="text-sm text-gray-900">{visitor.host}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-gray-700 min-w-[100px]">Location</span>
                    <span className="text-sm text-gray-700">:</span>
                    <span className="text-sm text-gray-900">{visitor.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-gray-700 min-w-[100px]">Check-in Time</span>
                    <span className="text-sm text-gray-700">:</span>
                    <span className="text-sm text-gray-900">{visitor.checkinTime}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-gray-700 min-w-[100px]">Phone</span>
                    <span className="text-sm text-gray-700">:</span>
                    <span className="text-sm text-gray-900">{visitor.phoneNumber}</span>
                  </div>
                  
                  {visitor.vehicleNumber && visitor.vehicleNumber !== 'FILTERED' && (
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-gray-700 min-w-[100px]">Vehicle</span>
                      <span className="text-sm text-gray-700">:</span>
                      <span className="text-sm text-gray-900">{visitor.vehicleNumber}</span>
                    </div>
                  )}
                  
                  {visitor.guestFrom && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-gray-700 min-w-[100px]">From</span>
                      <span className="text-sm text-gray-700">:</span>
                      <span className="text-sm text-gray-900">{visitor.guestFrom}</span>
                    </div>
                  )}
                  
                  {visitor.approvedBy && (
                    <div className="text-sm text-gray-600 ml-7">
                      (Approved By {visitor.approvedBy})
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                {/* <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-6">
                    <button 
                      className="flex items-center gap-2 text-black text-sm font-medium hover:opacity-80" 
                      onClick={() => handleAddComment(visitor.id)}
                    >
                      <MessageSquare className="h-4 w-4 text-red-500" />
                      Add Comment
                    </button>
                    
                  </div>
                  
                </div> */}
              </div>
            ))
          )}
        </div>
      </div>

      <AddCommentModal 
        isOpen={commentModal.isOpen} 
        onClose={() => setCommentModal({
          isOpen: false,
          visitorId: ''
        })} 
        itemId={commentModal.visitorId} 
        itemType="ticket" 
      />
    </>
  );
}