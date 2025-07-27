import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin } from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  assetNumber: string;
  status: string;
  assetGroup?: string;
  assetSubGroup?: string;
  siteName?: string;
  building?: { name: string } | null;
  wing?: { name: string } | null;
  area?: { name: string } | null;
}

interface MobileAssetBreakdownProps {
  asset: Asset;
}

interface BreakdownHistory {
  id: number;
  date: string;
  aging: string;
  costSpent: string;
  attendeeName: string;
}

export const MobileAssetBreakdown: React.FC<MobileAssetBreakdownProps> = ({ asset }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleViewAsset = () => {
    navigate(`/mobile/assets/${asset.id}?action=details`);
  };

  // Mock breakdown history data
  const breakdownHistory: BreakdownHistory[] = [
    {
      id: 1,
      date: "2025-01-20",
      aging: "5 days",
      costSpent: `${localStorage.getItem('currency')}15,000`,
      attendeeName: "John Doe"
    },
    {
      id: 2,
      date: "2025-01-10",
      aging: "15 days",
      costSpent: `${localStorage.getItem('currency')}8,500`,
      attendeeName: "Jane Smith"
    },
    {
      id: 3,
      date: "2024-12-25",
      aging: "31 days",
      costSpent: `${localStorage.getItem('currency')}12,000`,
      attendeeName: "Mike Johnson"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Breakdown Details</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Current Breakdown Details */}
        <Card className="bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Criticality:</p>
              </div>
              <Badge className="bg-black text-white">
                Breakdown
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900">Asset Name</h3>
                  <p className="text-sm text-gray-600">{asset.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">DD:HH:MM</p>
                  <p className="text-sm font-medium">05:12:30</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">Group/Subgroup</p>
                <p className="text-sm text-gray-600">
                  {asset.assetGroup}
                  {asset.assetSubGroup && ` / ${asset.assetSubGroup}`}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">Technical/Non-Technical</p>
                <p className="text-sm text-gray-600">Technical</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">Warranty:</p>
                <p className="text-sm text-gray-600">Under Warranty</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">Model and Manufacturer:</p>
                <p className="text-sm text-gray-600">Model ABC-123, XYZ Corp</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Created On:</p>
                <p className="text-sm text-gray-600">2025-01-25 10:30 AM</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">Assignee Name</p>
                <p className="text-sm text-gray-600">Technical Team Lead</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">Vendor e-mail sent: Yes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="bg-gray-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {asset.siteName || "Sumer Kendra, Worli (W), 400018"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* View Asset Button */}
        <Button
          onClick={handleViewAsset}
          variant="outline"
          className="w-full border-red-300 text-red-600 hover:bg-red-50"
        >
          View Asset
        </Button>

        {/* Previous Breakdown History */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Previous breakdown</h2>

          {breakdownHistory.map((breakdown) => (
            <Card key={breakdown.id} className="bg-gray-50">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Breakdown Date</p>
                      <p className="text-sm text-gray-600">{breakdown.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">DD:HH:MM</p>
                      <p className="text-sm font-medium">{breakdown.aging}</p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Aging</p>
                      <p className="text-sm text-gray-600">{breakdown.aging}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">DD:HH:MM</p>
                      <p className="text-sm font-medium">02:15:45</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Cost Spend:</p>
                    <p className="text-sm text-gray-600">{breakdown.costSpent}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Attendee Name:</p>
                    <p className="text-sm text-gray-600">{breakdown.attendeeName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {breakdownHistory.length === 0 && (
            <Card className="bg-gray-50">
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No previous breakdown history</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};