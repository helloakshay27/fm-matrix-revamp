import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Flag, ChevronRight, Building2, User, Globe, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddCommentModal } from './AddCommentModal';
import { useNavigate } from 'react-router-dom';


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

  const fetchRecentVisitors = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API call when available
      const mockVisitors: RecentVisitor[] = [
        {
          id: '2189-11132',
          visitorName: 'John Smith',
          purpose: 'Business Meeting',
          host: 'Sarah Johnson',
          status: 'Approved',
          checkinTime: '23/02/25, 10:30 AM',
          location: 'Mumbai Office',
          phoneNumber: '+91 9876543210',
          avatar: '/placeholder.svg',
          visitDuration: '2.5 hrs',
          approvedBy: 'Reception Team'
        },
        {
          id: '2189-11131',
          visitorName: 'Mike Chen',
          purpose: 'Personal Visit',
          host: 'David Wilson',
          status: 'Pending',
          checkinTime: '23/02/25, 09:45 AM',
          location: 'Delhi Office',
          phoneNumber: '+91 8765432109',
          avatar: '/placeholder.svg',
          visitDuration: '1.5 hrs',
          approvedBy: 'Security'
        },
        {
          id: '2189-11130',
          visitorName: 'Emma Davis',
          purpose: 'Delivery',
          host: 'IT Department',
          status: 'Approved',
          checkinTime: '22/02/25, 02:15 PM',
          location: 'Bangalore Office',
          phoneNumber: '+91 7654321098',
          avatar: '/placeholder.svg',
          visitDuration: '30 mins',
          approvedBy: 'Admin Team'
        }
      ];
      
      setRecentVisitors(mockVisitors);
    } catch (error) {
      console.error('Error fetching recent visitors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentVisitors();
  }, []);

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
        return 'bg-green-300 text-green-800';
      case 'pending':
        return 'bg-orange-300 text-orange-800';
      case 'rejected':
        return 'bg-red-300 text-red-800';
      default:
        return 'bg-gray-300 text-gray-800';
    }
  };

  return (
    <>
      <div className="w-full bg-[#C4B89D]/25 border-l border-gray-200 p-4 h-full xl:max-h-[1208px] overflow-hidden flex flex-col">        
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-red-600 mb-2">
            Recent Visitors
          </h2>
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
                  <span className="font-semibold text-gray-800 text-sm">{visitor.id}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleGoldenVisitor(visitor.id)}>
                      <Star className={`h-5 w-5 ${goldenVisitors.has(visitor.id) ? 'text-yellow-600 fill-yellow-600' : 'text-gray-400 fill-gray-200'} cursor-pointer hover:opacity-80`} />
                    </button>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(visitor.status)}`}>
                      {visitor.status}
                    </span>
                  </div>
                </div>
                
                {/* Title and Visit Duration */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 text-base">{visitor.visitorName}</h3>
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
                  
                  {visitor.approvedBy && (
                    <div className="text-sm text-gray-600 ml-7">
                      (Approved By {visitor.approvedBy})
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-6">
                    <button 
                      className="flex items-center gap-2 text-black text-sm font-medium hover:opacity-80" 
                      onClick={() => handleAddComment(visitor.id)}
                    >
                      <MessageSquare className="h-4 w-4 text-red-500" />
                      Add Comment
                    </button>
                    
                  </div>
                  
                </div>
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