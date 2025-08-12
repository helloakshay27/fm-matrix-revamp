import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock detailed data - in real app this would come from API
const getDetailedData = (id: string) => ({
  id,
  customer: 'SIFY TECHNOLOGIES LTD',
  totalConsumption: '35.93',
  rate: '28.78',
  readingType: 'DGKVAH',
  toDate: '2024-05-31',
  status: 'pending',
  amount: '1033.95',
  plantDetail: '',
  fromDate: '2024-05-01',
  consumptionDetails: [
    {
      clientName: 'SIFY TECHNOLOGIES LTD',
      meterNo: 'ENERGY METER 80',
      readingType: 'DGKVAH',
      adjustmentFactor: '1.10286',
      consumption: '35.9258',
      amount: '1033.95',
      meterLocation: 'Site - EON Kharadi - II / Building - COMMON / Wing - COMMON / Floor - BASEMENT 2 / Area - NA / Room - NA'
    }
  ]
});

export const UtilityRequestDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  if (!id) {
    return <div>Invalid ID</div>;
  }

  const data = getDetailedData(id);

  const handleBack = () => {
    navigate('/utility/utility-request');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        Utility &gt; Utility Request &gt; Details
      </div>

      {/* Back Button */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Utility Request
        </Button>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Basic Details Card */}
        <Card className="w-full">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">B</span>
              <span className="text-[#C72030]">BASIC DETAILS</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Customer</span>
                  <span className="text-gray-900 font-semibold">: {data.customer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Total consumption</span>
                  <span className="text-gray-900 font-semibold">: {data.totalConsumption}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Rate</span>
                  <span className="text-gray-900 font-semibold">: {data.rate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Reading type</span>
                  <span className="text-gray-900 font-semibold">: {data.readingType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">To date</span>
                  <span className="text-gray-900 font-semibold">: {data.toDate}</span>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Status</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900">:</span>
                    <Badge className={getStatusColor(data.status)}>
                      {data.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Amount</span>
                  <span className="text-gray-900 font-semibold">: {data.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Plant detail</span>
                  <span className="text-gray-900 font-semibold">: {data.plantDetail || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">From Date</span>
                  <span className="text-gray-900 font-semibold">: {data.fromDate}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consumption Details Card */}
        <Card className="w-full">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">C</span>
              <span className="text-[#C72030]">Consumption Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-700">Client Name</th>
                    <th className="text-left p-4 font-medium text-gray-700">Meter No.</th>
                    <th className="text-left p-4 font-medium text-gray-700">Reading Type</th>
                    <th className="text-left p-4 font-medium text-gray-700">Adjustment Factor</th>
                    <th className="text-left p-4 font-medium text-gray-700">Consumption</th>
                    <th className="text-left p-4 font-medium text-gray-700">Amount</th>
                    <th className="text-left p-4 font-medium text-gray-700">Meter Location</th>
                  </tr>
                </thead>
                <tbody>
                  {data.consumptionDetails.map((detail, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">{detail.clientName}</td>
                      <td className="p-4 text-gray-700">{detail.meterNo}</td>
                      <td className="p-4 text-gray-700">{detail.readingType}</td>
                      <td className="p-4 text-gray-700">{detail.adjustmentFactor}</td>
                      <td className="p-4 font-medium text-gray-900">{detail.consumption}</td>
                      <td className="p-4 font-medium text-gray-900">{detail.amount}</td>
                      <td className="p-4 text-gray-700 max-w-md">{detail.meterLocation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};