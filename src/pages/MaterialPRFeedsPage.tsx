
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

export const MaterialPRFeedsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const feedsData = [
    {
      date: "Mar 27, 2025",
      time: "03:33 PM",
      action: "PSPR L1 - made below changes.",
      user: "admin",
      status: "Approved"
    },
    {
      date: "Mar 27, 2025",
      time: "03:29 PM",
      action: "PSPR L1 - made below changes.",
      user: "admin",
      status: "Rejected",
      reason: "Rejection Reason"
    },
    {
      date: "Mar 27, 2025",
      time: "03:29 PM",
      action: "PO Created.",
      user: "",
      status: ""
    }
  ];

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        Material PR &gt; Feeds
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">Feeds</h1>

      {/* Back Button */}
      <div className="mb-6">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
        >
          Back
        </Button>
      </div>

      {/* Feeds List */}
      <div className="space-y-4">
        {feedsData.map((feed, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow border-l-4 border-gray-300">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm text-gray-600">{feed.date}</p>
                <p className="text-sm text-gray-600">{feed.time}</p>
              </div>
              {feed.status && (
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  feed.status === 'Approved' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {feed.status}
                </span>
              )}
            </div>
            <p className="font-medium mb-1">{feed.action}</p>
            {feed.user && <p className="text-sm text-gray-600"><strong>{feed.user}</strong> - {feed.status}</p>}
            {feed.reason && <p className="text-sm text-gray-600 mt-2">{feed.reason}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};
