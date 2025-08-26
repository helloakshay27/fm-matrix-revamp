
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Activity } from 'lucide-react';
import { FeedItem } from '../components/FeedItem';
import { Heading } from '../components/ui/heading';

export const MaterialPRFeedsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const feeds = [
    {
      date: 'Aug 26, 2025',
      time: '01:33 PM',
      user: 'Abhishek Sharma',
      description: 'made below changes.',
      type: 'Admin Approval',
      status: 'Approved'
    },
    {
      date: 'Aug 26, 2025',
      time: '01:33 PM',
      user: 'Abhishek Sharma',
      description: 'made below changes.',
      type: 'Site Incharge',
      status: 'Approved'
    },
    {
      date: 'Aug 26, 2025',
      time: '01:33 PM',
      user: 'Abhishek Sharma',
      description: 'made below changes.',
      type: 'Admin Approval',
      status: 'Rejected',
      reason: 'Rejection Reason'
    },
    {
      date: 'Aug 26, 2025',
      time: '12:58 PM',
      user: 'Abhishek Sharma',
      description: 'made below changes.',
      type: 'Site Incharge',
      status: 'Rejected',
      reason: 'Rejection Reason'
    },
    {
      date: 'Aug 26, 2025',
      time: '12:58 PM',
      description: 'PO Created.',
      type: '',
      status: ''
    }
  ];

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <button 
              onClick={handleBack}
              className="flex items-center space-x-1 hover:text-[#C72030] transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <span>•</span>
            <span>Material PR #{id}</span>
            <span>•</span>
            <span>Activity Feeds</span>
          </div>

          {/* Page Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#C72030] rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <Heading level="h1" className="text-2xl font-bold text-gray-900 mb-1">
                Activity Feeds
              </Heading>
              <p className="text-gray-600 text-sm">
                Track all changes and approvals for this Material PR
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Activities</p>
                <p className="text-2xl font-bold text-gray-900">{feeds.length}</p>
              </div>
              <Activity className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {feeds.filter(f => f.status === 'Approved').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">✓</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {feeds.filter(f => f.status === 'Rejected').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-sm font-bold">✕</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feed Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <span className="text-sm text-gray-500">
              {feeds.length} {feeds.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>
          
          {feeds.map((feed, index) => (
            <FeedItem key={index} feed={feed} index={index} />
          ))}
        </div>

        {/* Empty State */}
        {feeds.length === 0 && (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No activity yet</h3>
            <p className="text-gray-600">
              Activity feeds will appear here as actions are taken on this Material PR.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
