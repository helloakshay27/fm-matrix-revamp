import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BarChart3, File, FileChartLine } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';

// Interface for the API response
interface ApiUtilizationData {
  id: number;
  entity_id: number;
  from_date: string;
  to_date: string;
  total_consumption: number;
  rate: number;
  amount: number;
  plant_detail_id: number | null;
  status: string;
  reading_type: string;
  created_at: string;
  updated_at: string;
  url: string;
}

// Interface for detailed data
interface DetailedData {
  id: string;
  customer: string;
  totalConsumption: string;
  rate: string;
  readingType: string;
  toDate: string;
  status: string;
  amount: string;
  plantDetail: string;
  fromDate: string;
  consumptionDetails: {
    clientName: string;
    meterNo: string;
    readingType: string;
    adjustmentFactor: string;
    consumption: string;
    amount: string;
    meterLocation: string;
  }[];
}

export const UtilityRequestDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<DetailedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch entities to map entity IDs to names
  const fetchEntities = async (baseUrl: string, token: string) => {
    try {
      console.log('Fetching entities from:', `${baseUrl}/entities.json`);
      const response = await axios.get(`${baseUrl}/entities.json`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Entities API response:', response.data);

      // Create a map of entity IDs to entity names
      const entityMap = new Map();
      const entities = response.data.entities || response.data;

      if (Array.isArray(entities)) {
        console.log(`Mapping ${entities.length} entities`);
        entities.forEach((entity: any) => {
          entityMap.set(entity.id.toString(), entity.name);
        });
      } else {
        console.warn('Entities response is not an array:', entities);
      }

      console.log('Entity map size:', entityMap.size);
      return entityMap;
    } catch (err: any) {
      console.error('Error fetching entities:', err);
      console.error('Error details:', err.response?.data || err.message);
      return new Map();
    }
  };

  // Fetch detailed data from API
  useEffect(() => {
    const fetchDetailedData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const baseUrl = localStorage.getItem('baseUrl') || 'https://fm-uat-api.lockated.com';
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Authentication token not found');
          setLoading(false);
          return;
        }

        // First fetch entities to get their names
        const entityMap = await fetchEntities(baseUrl, token);

        // Fetch specific utilization data by ID
        console.log('Fetching utilization details from:', `${baseUrl}/compile_utilizations/${id}.json`);
        const response = await axios.get(`${baseUrl}/compile_utilizations/${id}.json`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('Utilization details API response:', response.data);

        const apiData: ApiUtilizationData = response.data;
        const entityName = entityMap.get(apiData.entity_id.toString());

        // Map API response to component data structure
        const mappedData: DetailedData = {
          id: apiData.id.toString(),
          customer: entityName || `Entity ID: ${apiData.entity_id}`,
          totalConsumption: apiData.total_consumption.toString(),
          rate: apiData.rate.toString(),
          readingType: apiData.reading_type,
          toDate: apiData.to_date,
          status: apiData.status,
          amount: apiData.amount.toString(),
          plantDetail: apiData.plant_detail_id?.toString() || '',
          fromDate: apiData.from_date,
          consumptionDetails: [
            {
              clientName: entityName || `Entity ID: ${apiData.entity_id}`,
              meterNo: 'ENERGY METER 80', // This might need to come from another API or be configurable
              readingType: apiData.reading_type,
              adjustmentFactor: '1.10286', // This might need to come from another API or be configurable
              consumption: apiData.total_consumption.toString(),
              amount: apiData.amount.toString(),
              meterLocation: 'Site - EON Kharadi - II / Building - COMMON / Wing - COMMON / Floor - BASEMENT 2 / Area - NA / Room - NA' // This might need to come from another API
            }
          ]
        };

        console.log('Mapped detailed data:', mappedData);
        setData(mappedData);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching utilization details:', err);
        console.error('Error details:', err.response?.data || err.message);
        setError(`Failed to fetch utilization details: ${err.response?.data?.message || err.message}`);
        setLoading(false);
      }
    };

    fetchDetailedData();
  }, [id]);

  if (!id) {
    return <div>Invalid ID</div>;
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C72030]"></div>
          <span className="ml-2">Loading utilization details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="p-4 bg-red-100 text-red-800 rounded">
          {error}
        </div>
        <Button onClick={() => navigate('/utility/utility-request')} className="bg-[#C72030] text-white">
          Back to Utility Request
        </Button>
      </div>
    );
  }

  if (!data) {
    return <div>No data found</div>;
  }

  const handleBack = () => {
    navigate('/utility/utility-request');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
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

      <div className=" mx-auto space-y-6">
        {/* Basic Details Card */}
        <Card className="w-full">
          <CardHeader className="border-b" style={{ backgroundColor: "#f6f4ee" }}>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="inline-flex items-center">
                <File className="w-5 h-5" color='#C72030' />
              </span>
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
          <CardHeader className="border-b" style={{ backgroundColor: "#f6f4ee" }}>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="inline-flex items-center">
                <FileChartLine className="w-5 h-5" color='#C72030' />
              </span>
              <span className="text-[#C72030]">Consumption Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
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