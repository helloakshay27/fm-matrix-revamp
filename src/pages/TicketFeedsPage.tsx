
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, Loader2 } from 'lucide-react';
import { ticketManagementAPI } from '@/services/ticketManagementAPI';

interface FeedEntry {
  type: string;
  time: string;
  user: string;
  status: string;
  reason: string;
  expected_date: string | null;
  changes: any[];
  comments: any[];
}

interface FeedData {
  date: string;
  entries: FeedEntry[];
}

interface TicketFeedsResponse {
  ticket_number: string;
  heading: string;
  created_on: string;
  created_by: string;
  category: string;
  sub_category: string;
  site_name: string;
  site_address: string;
  description: string | null;
  feeds: FeedData[];
}

export const TicketFeedsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [feedsData, setFeedsData] = useState<TicketFeedsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchTicketFeeds();
    }
  }, [id]);

  const fetchTicketFeeds = async () => {
    try {
      setLoading(true);
      const data = await ticketManagementAPI.getTicketFeeds(id!);
      setFeedsData(data);
    } catch (err) {
      setError('Failed to fetch ticket feeds');
      console.error('Error fetching feeds:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => navigate(`/maintenance/ticket/details/${id}`)}>
            Back to Ticket Details
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Ticket Details
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">FEEDS</h1>
        </div>

        {/* Feeds Section */}
        <Card>
          <CardHeader className="bg-white">
            <CardTitle className="flex items-center gap-2" style={{ color: '#C72030' }}>
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm" style={{ backgroundColor: '#C72030' }}>
                <FileText className="w-4 h-4" />
              </span>
              FEEDS DETAILS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {feedsData?.feeds?.map((feedGroup, groupIndex) => (
                <div key={groupIndex}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{feedGroup.date}</h3>
                  <div className="space-y-4">
                    {feedGroup.entries.map((entry, entryIndex) => (
                      <div key={entryIndex} className="flex gap-4 p-4 border-b border-gray-200 last:border-b-0">
                        <div className="min-w-[120px]">
                          <div className="text-sm text-gray-600">
                            {entry.time}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            {entry.status} - {entry.type}
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            By: {entry.user}
                          </div>
                          <div className="text-sm text-gray-600">
                            {entry.reason}
                          </div>
                          {entry.expected_date && (
                            <div className="text-sm text-gray-500 mt-1">
                              Expected: {entry.expected_date}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
