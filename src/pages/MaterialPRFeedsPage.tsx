
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Feeds</h1>
      </div>

      {/* Feeds Content */}
      <div className="bg-white rounded-lg">
        <div className="space-y-6">
          {feeds.map((feed, index) => (
            <div key={index} className="border-b pb-4 last:border-b-0">
              <div className="flex flex-col space-y-1">
                <div className="text-sm text-gray-600">
                  {feed.date}
                </div>
                <div className="text-sm text-gray-600">
                  {feed.time}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{feed.title}</span>
                  {feed.description && (
                    <span className="text-gray-700"> - {feed.description}</span>
                  )}
                </div>
                {feed.status && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{feed.status}</span>
                    <span className="text-gray-700"> - {feed.action}</span>
                  </div>
                )}
                {feed.reason && (
                  <div className="text-sm text-gray-600">
                    {feed.reason}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
