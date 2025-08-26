
import React from 'react';
import { Clock, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface FeedData {
  date: string;
  time: string;
  user?: string;
  description: string;
  type: string;
  status: string;
  reason?: string;
}

interface FeedItemProps {
  feed: FeedData;
  index: number;
}

export const FeedItem: React.FC<FeedItemProps> = ({ feed, index }) => {
  const getStatusIcon = () => {
    if (feed.status === 'Approved') {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    } else if (feed.status === 'Rejected') {
      return <XCircle className="w-4 h-4 text-red-600" />;
    }
    return <AlertCircle className="w-4 h-4 text-blue-600" />;
  };

  const getStatusBadge = () => {
    if (!feed.status) return null;
    
    const statusColors = {
      'Approved': 'bg-green-100 text-green-800 border-green-200',
      'Rejected': 'bg-red-100 text-red-800 border-red-200',
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[feed.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {getStatusIcon()}
        <span className="ml-1">{feed.status}</span>
      </span>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
      {/* Header with date and time */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="font-medium">{feed.date}</span>
            <span>•</span>
            <span>{feed.time}</span>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* User information */}
      {feed.user && (
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <span className="text-sm font-medium text-gray-900">{feed.user}</span>
        </div>
      )}

      {/* Description */}
      <div className="mb-3">
        <p className="text-gray-700 text-sm">{feed.description}</p>
      </div>

      {/* Type information */}
      {feed.type && (
        <div className="mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            {feed.type}
          </span>
        </div>
      )}

      {/* Rejection reason */}
      {feed.reason && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center space-x-2">
            <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span className="text-sm font-medium text-red-800">Rejection Reason:</span>
          </div>
          <p className="text-sm text-red-700 mt-1">{feed.reason}</p>
        </div>
      )}
    </div>
  );
};
