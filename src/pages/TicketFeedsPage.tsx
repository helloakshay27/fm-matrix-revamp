import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText } from 'lucide-react';
export const TicketFeedsPage = () => {
  const navigate = useNavigate();
  const {
    id
  } = useParams();
  const feedsData = [{
    time: 'Jun 16, 2025\n05:29 PM',
    action: 'Resolution Escalation',
    details: 'E4 escalated to Abdul A'
  }, {
    time: 'Jun 16, 2025\n05:28 PM',
    action: 'Resolution Escalation',
    details: 'E3 escalated to Abdul A'
  }, {
    time: 'Jun 16, 2025\n05:27 PM',
    action: 'Resolution Escalation',
    details: 'E2 escalated to Abdul A'
  }, {
    time: 'Jun 16, 2025\n05:21 PM',
    action: 'Response Escalation',
    details: 'E2 escalated to Abdul A'
  }, {
    time: 'Jun 16, 2025\n05:19 PM',
    action: 'Response Escalation',
    details: 'E1 escalated to Jayesh P, Devesh Jain'
  }, {
    time: 'Jun 16, 2025\n05:19 PM',
    action: 'Resolution Escalation',
    details: 'E1 escalated to Abdul A, Jayesh P'
  }, {
    time: 'Jun 16, 2025\n05:17 PM',
    action: 'Ticket Created.',
    details: 'Status - Pending'
  }];
  return <div className="p-6 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(`/maintenance/ticket/${id}`)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Ticket Details
          </Button>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span>Ticket Details</span>
            <span>&gt;</span>
            <span>Feeds</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">FEEDS</h1>
        </div>

        {/* Feeds Section */}
        <Card>
          <CardHeader className="bg-white">
            <CardTitle className="flex items-center gap-2" style={{
            color: '#C72030'
          }}>
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm" style={{
              backgroundColor: '#C72030'
            }}>
                <FileText className="w-4 h-4" />
              </span>
              FEEDS DETAILS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {feedsData.map((feed, index) => <div key={index} className="flex gap-4 p-4 border-b border-gray-200 last:border-b-0">
                  <div className="min-w-[120px]">
                    <div className="text-sm text-gray-600 whitespace-pre-line">
                      {feed.time}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      {feed.action}
                    </div>
                    <div className="text-sm text-gray-600">
                      {feed.details}
                    </div>
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};