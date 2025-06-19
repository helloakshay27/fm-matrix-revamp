
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const GRNFeedsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const feedsData = [
    {
      date: "Mar 27, 2025",
      time: "03:37 PM",
      user: "PSIR_1",
      action: "made below changes:",
      status: "Quality Officer - Approved"
    },
    {
      date: "Mar 27, 2025",
      time: "11:03 AM",
      user: "PSIR_1",
      action: "made below changes:",
      status: "Quality Officer - Rejected"
    },
    {
      date: "Mar 27, 2025",
      time: "11:03 AM",
      user: "",
      action: "GRN Created",
      status: ""
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Feeds</h1>
      </div>

      {/* Feeds List */}
      <div className="space-y-4">
        {feedsData.map((feed, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{feed.date}</span>
                <span className="text-sm text-gray-600">{feed.time}</span>
              </div>
              
              {feed.user && (
                <div className="flex items-center gap-1">
                  <span className="font-medium text-blue-600">{feed.user}</span>
                  <span className="text-sm">{feed.action}</span>
                </div>
              )}
              
              {feed.status && (
                <div className="text-sm">
                  <span className="font-medium">{feed.status.split(' - ')[0]} - </span>
                  <span className={`font-medium ${
                    feed.status.includes('Approved') ? 'text-green-600' : 
                    feed.status.includes('Rejected') ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {feed.status.split(' - ')[1]}
                  </span>
                </div>
              )}
              
              {feed.action === "GRN Created" && (
                <div className="text-sm font-medium text-blue-600">
                  GRN Created
                </div>
              )}
              
              {feed.status.includes('Rejected') && (
                <div className="text-sm text-red-600 font-medium">
                  Rejection Reason
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
