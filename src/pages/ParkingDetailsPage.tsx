
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ParkingClient {
  id: string;
  clientName: string;
  twoWheeler: number;
  fourWheeler: number;
  freeParking: number;
  paidParking: number;
  availableSlots: number;
  leaseStartDate?: string;
  leaseEndDate?: string;
}

const mockParkingClients: ParkingClient[] = [
  { 
    id: "HSBC", 
    clientName: "HSBC", 
    twoWheeler: 0, 
    fourWheeler: 0, 
    freeParking: 10, 
    paidParking: 20, 
    availableSlots: 30,
    leaseStartDate: "01/07/2024",
    leaseEndDate: "29/09/2024"
  },
  { 
    id: "localized", 
    clientName: "localized", 
    twoWheeler: 0, 
    fourWheeler: 0, 
    freeParking: 20, 
    paidParking: 40, 
    availableSlots: 40,
    leaseStartDate: "01/07/2024",
    leaseEndDate: "29/09/2024"
  },
  { 
    id: "demo", 
    clientName: "demo", 
    twoWheeler: 0, 
    fourWheeler: 0, 
    freeParking: 2, 
    paidParking: 5, 
    availableSlots: 7,
    leaseStartDate: "01/07/2024",
    leaseEndDate: "29/09/2024"
  },
  { 
    id: "Sohail Ansari", 
    clientName: "Sohail Ansari", 
    twoWheeler: 0, 
    fourWheeler: 0, 
    freeParking: 5, 
    paidParking: 5, 
    availableSlots: 10,
    leaseStartDate: "01/07/2024",
    leaseEndDate: "29/09/2024"
  },
  { 
    id: "Deepak Jain", 
    clientName: "Deepak Jain", 
    twoWheeler: 0, 
    fourWheeler: 0, 
    freeParking: 5, 
    paidParking: 2, 
    availableSlots: 7,
    leaseStartDate: "01/07/2024",
    leaseEndDate: "29/09/2024"
  },
  { 
    id: "Mahendra Lungare", 
    clientName: "Mahendra Lungare", 
    twoWheeler: 0, 
    fourWheeler: 0, 
    freeParking: 2, 
    paidParking: 1, 
    availableSlots: 3,
    leaseStartDate: "01/07/2024",
    leaseEndDate: "29/09/2024"
  },
  { 
    id: "Rajnish Patil", 
    clientName: "Rajnish Patil", 
    twoWheeler: 0, 
    fourWheeler: 0, 
    freeParking: 5, 
    paidParking: 2, 
    availableSlots: 7,
    leaseStartDate: "01/07/2024",
    leaseEndDate: "29/09/2024"
  }
];

export const ParkingDetailsPage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  
  const client = mockParkingClients.find(c => c.id === clientId);
  
  if (!client) {
    return (
      <div className="p-6 bg-[#f6f4ee] min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Client Not Found</h1>
          <Button onClick={() => navigate('/property/parking')} className="bg-[#C72030] hover:bg-[#B01E2A] text-white">
            Back to Parking
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/property/parking')}
            className="p-2 mr-4"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="text-sm text-gray-600 mb-1">Parking</div>
            <h1 className="text-2xl font-bold text-gray-800">Client Parking details</h1>
          </div>
        </div>

        {/* Client Details */}
        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="flex">
              <span className="w-32 text-gray-700">Client Name</span>
              <span className="mr-4">:</span>
              <span className="text-gray-900 font-medium">{client.clientName}</span>
            </div>
            <div className="flex">
              <span className="w-32 text-gray-700">No. of 4 Wheeler</span>
              <span className="mr-4">:</span>
              <span className="text-gray-900">{client.fourWheeler}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="flex">
              <span className="w-32 text-gray-700">No. of 2 Wheeler</span>
              <span className="mr-4">:</span>
              <span className="text-gray-900">{client.twoWheeler}</span>
            </div>
            <div className="flex">
              <span className="w-32 text-gray-700">Free Parking</span>
              <span className="mr-4">:</span>
              <span className="text-gray-900">{client.freeParking}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="flex">
              <span className="w-32 text-gray-700">Paid Parking</span>
              <span className="mr-4">:</span>
              <span className="text-gray-900">{client.paidParking}</span>
            </div>
            <div className="flex">
              <span className="w-32 text-gray-700">Available Slots</span>
              <span className="mr-4">:</span>
              <span className="text-gray-900">{client.availableSlots}</span>
            </div>
          </div>
        </div>

        {/* Lease Period */}
        <div className="border-t pt-6">
          <div className="bg-[#C72030] text-white px-4 py-2 rounded inline-block">
            <h2 className="text-lg font-semibold">
              Lease Period: {client.leaseStartDate} - {client.leaseEndDate}
            </h2>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t text-center">
          <div className="text-sm text-gray-500">
            Powered by <span className="font-semibold text-orange-500">goPhygital</span><span className="text-gray-700">work</span>
          </div>
        </div>
      </div>
    </div>
  );
};
