
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Simple Header */}
        <h1 className="text-2xl font-bold text-black mb-6">Feeds</h1>

        {/* Feed Items */}
        <div className="space-y-4">
          {feeds.map((feed, index) => (
            <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
              {/* Date and Time */}
              <div className="text-sm text-black font-medium mb-1">
                {feed.date}
              </div>
              <div className="text-sm text-black mb-2">
                {feed.time}
              </div>

              {/* User and Description */}
              {feed.user && (
                <div className="text-sm text-black mb-1">
                  <span className="font-medium">{feed.user}</span> - {feed.description}
                </div>
              )}

              {/* Type and Status */}
              {feed.type && (
                <div className="text-sm text-black mb-1">
                  <span className="font-medium">{feed.type}</span>
                  {feed.status && (
                    <span> - {feed.status}</span>
                  )}
                </div>
              )}

              {/* Rejection Reason */}
              {feed.reason && (
                <div className="text-sm text-black font-medium">
                  {feed.reason}
                </div>
              )}

              {/* PO Created case */}
              {!feed.user && feed.description && (
                <div className="text-sm text-black">
                  {feed.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
