import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddCommentModal } from './AddCommentModal';

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
}

export const RecentVisitorsSidebar: React.FC = () => {
  const [commentModal, setCommentModal] = useState({ isOpen: false, visitorId: '' });
  const [flaggedVisitors, setFlaggedVisitors] = useState<Set<string>>(new Set());
  const [goldenVisitors, setGoldenVisitors] = useState<Set<string>>(new Set());
  const [recentVisitors, setRecentVisitors] = useState<RecentVisitor[]>([]);
  const navigate = useNavigate();

  const fetchRecentVisitors = async () => {
    // Mock recent visitors data - in real app this would come from API
    const mockData: RecentVisitor[] = [
      {
        id: 'V001',
        visitorName: 'John Smith',
        purpose: 'Meeting',
        host: 'Sarah Johnson',
        status: 'Approved',
        checkinTime: '10:30 AM',
        location: 'Reception',
        phoneNumber: '+1 234-567-8900',
        avatar: '/placeholder.svg'
      },
      {
        id: 'V002',
        visitorName: 'Emily Davis',
        purpose: 'Interview',
        host: 'Michael Brown',
        status: 'Pending',
        checkinTime: '11:15 AM',
        location: 'Main Gate',
        phoneNumber: '+1 234-567-8901',
        avatar: '/placeholder.svg'
      },
      {
        id: 'V003',
        visitorName: 'Robert Wilson',
        purpose: 'Delivery',
        host: 'Lisa Anderson',
        status: 'Checked In',
        checkinTime: '09:45 AM',
        location: 'Side Entrance',
        phoneNumber: '+1 234-567-8902',
        avatar: '/placeholder.svg'
      },
      {
        id: 'V004',
        visitorName: 'Maria Garcia',
        purpose: 'Maintenance',
        host: 'David Miller',
        status: 'Approved',
        checkinTime: '12:00 PM',
        location: 'Reception',
        phoneNumber: '+1 234-567-8903',
        avatar: '/placeholder.svg'
      },
      {
        id: 'V005',
        visitorName: 'James Taylor',
        purpose: 'Personal',
        host: 'Jennifer Wilson',
        status: 'Rejected',
        checkinTime: '02:30 PM',
        location: 'Main Gate',
        phoneNumber: '+1 234-567-8904',
        avatar: '/placeholder.svg'
      }
    ];
    
    setRecentVisitors(mockData);
  };

  useEffect(() => {
    fetchRecentVisitors();
  }, []);

  const handleAddComment = (visitorId: string) => {
    setCommentModal({ isOpen: true, visitorId });
  };

  const handleFlag = async (visitorId: string) => {
    try {
      const newFlaggedVisitors = new Set(flaggedVisitors);
      if (flaggedVisitors.has(visitorId)) {
        newFlaggedVisitors.delete(visitorId);
      } else {
        newFlaggedVisitors.add(visitorId);
      }
      setFlaggedVisitors(newFlaggedVisitors);
      // In real app, make API call here
      console.log(`Visitor ${visitorId} flag toggled`);
    } catch (error) {
      console.error('Error toggling visitor flag:', error);
    }
  };

  const handleGoldenVisitor = async (visitorId: string) => {
    try {
      const newGoldenVisitors = new Set(goldenVisitors);
      if (goldenVisitors.has(visitorId)) {
        newGoldenVisitors.delete(visitorId);
      } else {
        newGoldenVisitors.add(visitorId);
      }
      setGoldenVisitors(newGoldenVisitors);
      // In real app, make API call here
      console.log(`Visitor ${visitorId} golden status toggled`);
    } catch (error) {
      console.error('Error toggling visitor golden status:', error);
    }
  };

  const handleViewDetails = (visitorId: string) => {
    navigate(`/visitors/${visitorId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'checked in':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-[#C72030]">Recent Visitors</h2>
      </div>

      {/* Visitors List */}
      <div className="flex-1 overflow-y-auto">
        {recentVisitors.map((visitor) => (
          <div key={visitor.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
            {/* Visitor Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <img 
                    src={visitor.avatar} 
                    alt={visitor.visitorName}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
                <div>
                  <div className="font-medium text-sm text-gray-900">
                    {visitor.id}
                  </div>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(visitor.status)}`}>
                    {visitor.status}
                  </div>
                </div>
              </div>
            </div>

            {/* Visitor Details */}
            <div className="space-y-1 mb-3">
              <div className="text-sm font-medium text-gray-900">
                {visitor.visitorName}
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Purpose:</span>
                <span className="font-medium">{visitor.purpose}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Host:</span>
                <span className="font-medium">{visitor.host}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Location:</span>
                <span className="font-medium">{visitor.location}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Check-in:</span>
                <span className="font-medium">{visitor.checkinTime}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => handleAddComment(visitor.id)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs py-1.5 px-2 rounded font-medium transition-colors"
                >
                  Add Comment
                </button>
                <button
                  onClick={() => handleFlag(visitor.id)}
                  className={`flex-1 text-xs py-1.5 px-2 rounded font-medium transition-colors ${
                    flaggedVisitors.has(visitor.id)
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-red-100 hover:bg-red-200 text-red-700'
                  }`}
                >
                  {flaggedVisitors.has(visitor.id) ? 'Unflag' : 'Flag Issue'}
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleGoldenVisitor(visitor.id)}
                  className={`flex-1 text-xs py-1.5 px-2 rounded font-medium transition-colors ${
                    goldenVisitors.has(visitor.id)
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                      : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
                  }`}
                >
                  {goldenVisitors.has(visitor.id) ? 'Remove Golden' : 'Mark Golden'}
                </button>
                <button
                  onClick={() => handleViewDetails(visitor.id)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white text-xs py-1.5 px-2 rounded font-medium transition-colors"
                >
                  View Detail
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comment Modal */}
      <AddCommentModal
        isOpen={commentModal.isOpen}
        onClose={() => setCommentModal({ isOpen: false, visitorId: '' })}
        itemId={commentModal.visitorId}
        title="Add Comment to Visitor"
        itemType="ticket"
      />
    </div>
  );
};