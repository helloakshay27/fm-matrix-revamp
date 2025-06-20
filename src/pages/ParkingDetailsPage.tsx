
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const ParkingDetailsPage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();

  // Sample data - in a real app, this would come from an API or state management
  const parkingData = {
    "HSBC": { clientName: "HSBC", twoWheeler: 0, fourWheeler: 0, freeParking: 10, paidParking: 20, availableSlots: 30, leasePeriod: "01/07/2024 - 29/09/2024" },
    "localized": { clientName: "localized", twoWheeler: 0, fourWheeler: 0, freeParking: 20, paidParking: 40, availableSlots: 40, leasePeriod: "01/06/2024 - 30/08/2024" },
    "demo": { clientName: "demo", twoWheeler: 0, fourWheeler: 0, freeParking: 2, paidParking: 5, availableSlots: 7, leasePeriod: "15/05/2024 - 15/07/2024" },
    "Sohail Ansari": { clientName: "Sohail Ansari", twoWheeler: 0, fourWheeler: 0, freeParking: 5, paidParking: 5, availableSlots: 10, leasePeriod: "01/04/2024 - 30/06/2024" },
    "Deepak Jain": { clientName: "Deepak Jain", twoWheeler: 0, fourWheeler: 0, freeParking: 5, paidParking: 2, availableSlots: 7, leasePeriod: "10/03/2024 - 10/05/2024" },
    "Mahendra Lungare": { clientName: "Mahendra Lungare", twoWheeler: 0, fourWheeler: 0, freeParking: 2, paidParking: 1, availableSlots: 3, leasePeriod: "01/02/2024 - 31/03/2024" },
    "Rajnish Patil": { clientName: "Rajnish Patil", twoWheeler: 0, fourWheeler: 0, freeParking: 5, paidParking: 2, availableSlots: 7, leasePeriod: "15/01/2024 - 15/03/2024" }
  };

  const clientData = parkingData[clientId as keyof typeof parkingData];

  if (!clientData) {
    return (
      <div className="p-6 bg-[#f6f4ee] min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Client Not Found</h1>
          <Button onClick={() => navigate('/vas/parking')} className="bg-[#8B4A9C] hover:bg-[#7A4089] text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Parking Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="flex items-center mb-6">
        <Button 
          onClick={() => navigate('/vas/parking')} 
          variant="ghost" 
          className="mr-4 p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-900">Parking</h1>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Client Parking details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-700">Client Name</span>
                <span className="font-medium">: {clientData.clientName}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-700">No. of 2 Wheeler</span>
                <span className="font-medium">: {clientData.twoWheeler}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-700">No. of 4 Wheeler</span>
                <span className="font-medium">: {clientData.fourWheeler}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="bg-red-500 text-white px-4 py-2 rounded inline-block">
              <span className="font-medium">Lease Period: {clientData.leasePeriod}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParkingDetailsPage;
