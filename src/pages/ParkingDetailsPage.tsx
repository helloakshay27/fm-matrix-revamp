import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Edit } from "lucide-react";
import { toast } from 'sonner';
import { fetchParkingDetails, ParkingDetailsResponse } from '@/services/parkingConfigurationsAPI';

const ParkingDetailsPage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();

  // API state
  const [parkingDetails, setParkingDetails] = useState<ParkingDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch parking details on component mount
  useEffect(() => {
    const loadParkingDetails = async () => {
      if (!clientId) {
        setError('Client ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetchParkingDetails(clientId);
        setParkingDetails(response);
      } catch (error) {
        console.error('Error loading parking details:', error);
        setError('Failed to load parking details');
        toast.error('Failed to load parking details');
      } finally {
        setLoading(false);
      }
    };

    loadParkingDetails();
  }, [clientId]);

  const handleBack = () => {
    navigate('/vas/parking');
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 min-h-screen bg-gray-50">
        <div className="flex items-center mb-6">
          <Button 
            onClick={handleBack}
            variant="ghost" 
            className="mr-4 p-2 hover:bg-[#C72030]/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#C72030]">Loading...</h1>
          </div>
        </div>
        
        <Card className="max-w-6xl mx-auto bg-white shadow-sm">
          <CardContent className="p-8 text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-300 rounded w-1/3 mx-auto"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !parkingDetails) {
    return (
      <div className="p-6 space-y-6 min-h-screen bg-gray-50">
        <div className="flex items-center mb-6">
          <Button 
            onClick={handleBack}
            variant="ghost" 
            className="mr-4 p-2 hover:bg-[#C72030]/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#C72030]">Error Loading Data</h1>
          </div>
        </div>
        
        <Card className="max-w-6xl mx-auto bg-white shadow-sm">
          <CardContent className="p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {error || 'Client data could not be loaded'}
            </h2>
            <p className="text-gray-600 mb-6">Please try again or contact support if the problem persists.</p>
            <Button 
              onClick={handleBack}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 py-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Parking Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button 
          onClick={handleBack}
          variant="ghost" 
          className="mr-4 p-2 hover:bg-[#C72030]/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[#C72030]">Client Parking Details</h1>
        </div>
      </div>

      {/* Main Content Card */}
      <Card className="max-w-6xl mx-auto bg-white shadow-sm">
        <CardContent className="p-8">
          <div className="space-y-8">
            {/* Client Information Header */}
            <div className="border-b border-gray-200 pb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {parkingDetails.entity.name} - Parking Information
              </h2>
              <button
                onClick={() => {
                  navigate(`/vas/parking/edit/${clientId}`);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Edit Parking Details"
              >
                <Edit className="w-5 h-5 text-gray-600 hover:text-[#C72030]" />
              </button>
            </div>

            {/* Client Color Code */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Client</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: parkingDetails.entity.color_code }}
                ></div>
                <span className="text-gray-900 font-medium">{parkingDetails.entity.name}</span>
              </div>
            </div>

            {/* Parking Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Label className="text-sm font-medium text-gray-700">Number of 2 Wheeler Slots</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900 font-medium">{parkingDetails.parking_summary.two_wheeler_count}</span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Number of 4 Wheeler Slots</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900 font-medium">{parkingDetails.parking_summary.four_wheeler_count}</span>
                </div>
              </div>
            </div>

            {/* Lease Information */}
            {parkingDetails.leases && parkingDetails.leases.length > 0 && (
              <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-700">Lease Information</Label>
                {parkingDetails.leases.map((lease) => (
                  <div key={lease.id} className={`border rounded-lg p-6 ${lease.lease_period.expired ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-700">Lease Period</span>
                      {lease.lease_period.expired ? (
                        <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                          Expired
                        </span>
                      ) : (
                        <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                          Active
                        </span>
                      )}
                    </div>
                    <div>
                      <span className={`inline-block text-white px-4 py-2 rounded font-medium ${lease.lease_period.expired ? 'bg-[#C72030]' : 'bg-green-600'}`}>
                        {lease.lease_period.start_date} - {lease.lease_period.end_date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-6">
              <Button 
                onClick={handleBack}
                variant="outline"
                className="px-8 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Back to Dashboard
              </Button>
              <Button 
                onClick={() => navigate('/vas/parking/create')}
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 py-2"
              >
                Create New Booking
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParkingDetailsPage;