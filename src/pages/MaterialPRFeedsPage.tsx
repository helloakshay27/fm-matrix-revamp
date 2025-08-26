
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, Package, User, Calendar } from 'lucide-react';

export const MaterialPRFeedsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const feeds = [
    {
      date: 'Mar 27, 2025',
      time: '03:33 PM',
      title: 'PSPL 1',
      description: 'made below changes.',
      status: 'admin',
      action: 'Approved'
    },
    {
      date: 'Mar 27, 2025',
      time: '03:29 PM',
      title: 'PSPL 1',
      description: 'made below changes.',
      status: 'admin',
      action: 'Rejected',
      reason: 'Rejection Reason'
    },
    {
      date: 'Mar 27, 2025',
      time: '03:29 PM',
      title: 'PO Created.',
      description: '',
      status: '',
      action: ''
    }
  ];

  const getStatusIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Package className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusBadge = (action: string) => {
    if (!action) return null;
    
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    switch (action.toLowerCase()) {
      case 'approved':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            {action}
          </span>
        );
      case 'rejected':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            {action}
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
            {action}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-4xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Activity Feeds</h1>
          </div>
          <p className="text-gray-600">Track all material PR activities and updates</p>
        </div>

        {/* Enhanced Feeds Content */}
        <div className="space-y-4">
          {feeds.map((feed, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                {/* Header with icon and timestamp */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(feed.action)}
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{feed.title}</h3>
                      {feed.description && (
                        <p className="text-gray-600 mt-1">{feed.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {feed.date}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {feed.time}
                    </div>
                  </div>
                </div>

                {/* Status and Action */}
                {(feed.status || feed.action) && (
                  <div className="flex items-center gap-4 mb-3">
                    {feed.status && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 font-medium capitalize">{feed.status}</span>
                      </div>
                    )}
                    {feed.action && getStatusBadge(feed.action)}
                  </div>
                )}

                {/* Rejection Reason */}
                {feed.reason && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-red-800">Rejection Reason</p>
                        <p className="text-sm text-red-700 mt-1">{feed.reason}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Timeline connector for non-last items */}
              {index < feeds.length - 1 && (
                <div className="relative">
                  <div className="absolute left-8 top-0 w-px h-4 bg-gray-200"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty state or load more could go here */}
        {feeds.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No activity feeds</h3>
            <p className="text-gray-600">Activity feeds will appear here when actions are performed.</p>
          </div>
        )}
      </div>
    </div>
  );
};
