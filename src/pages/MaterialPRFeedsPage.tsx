
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const MaterialPRFeedsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const feedsData = [
    {
      date: 'Mar 27, 2025',
      time: '03:33 PM',
      title: 'PSPL 1 - made below changes.',
      user: 'admin',
      status: 'Approved'
    },
    {
      date: 'Mar 27, 2025', 
      time: '03:29 PM',
      title: 'PSPL 1 - made below changes.',
      user: 'admin',
      status: 'Rejected',
      reason: 'Rejection Reason'
    },
    {
      date: 'Mar 27, 2025',
      time: '03:29 PM', 
      title: 'PO Created.',
      user: '',
      status: ''
    }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Feeds</h1>
      </div>

      {/* Feeds List */}
      <div className="space-y-4">
        {feedsData.map((feed, index) => (
          <div key={index} className="bg-white rounded-lg border p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-sm text-gray-600 mb-1">
                  {feed.date}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {feed.time}
                </div>
                <div className="font-medium mb-2">
                  <span className="font-bold">PSPL 1</span> - {feed.title}
                </div>
                {feed.user && (
                  <div className="text-sm">
                    <span className="font-bold">{feed.user}</span> - {feed.status}
                  </div>
                )}
                {feed.reason && (
                  <div className="text-sm text-gray-600 mt-1">
                    {feed.reason}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
