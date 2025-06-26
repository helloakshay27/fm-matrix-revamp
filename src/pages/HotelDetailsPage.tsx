
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wifi, Car, UtensilsCrossed, Shield, CheckCircle, Users, Bed, Home } from 'lucide-react';

export const HotelDetailsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleBookNow = () => {
    navigate('/vas/hotels/booking');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">About this property</h3>
              <p className="text-gray-600 mb-4">Hotel in Alibag with 24-hour front desk and restaurant</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-gray-600" />
                  <span>24/7 front desk</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-gray-600" />
                  <span>Parking Included</span>
                </div>
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="h-5 w-5 text-gray-600" />
                  <span>Restaurant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-gray-600" />
                  <span>Free Wifi</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-gray-600" />
                  <span>Housekeeping</span>
                </div>
              </div>
              
              <Button variant="outline" className="text-[#C72030] border-[#C72030]">
                See all about this property
              </Button>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Accessibility</h3>
              <p className="text-gray-600">
                If you have requests for specific accessibility needs, please contact the property using the information on the reservation confirmation received after booking.
              </p>
            </div>
          </div>
        );
      case 'about':
        return <div className="p-4">About content goes here...</div>;
      case 'rooms':
        return <div className="p-4">Rooms content goes here...</div>;
      case 'accessibility':
        return <div className="p-4">Accessibility content goes here...</div>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Gallery */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-12 gap-4 h-96">
            <div className="col-span-8">
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Hotel Main"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="col-span-4 grid grid-rows-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Hotel Room"
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                  alt="Hotel Exterior"
                  className="w-full h-full object-cover rounded-lg"
                />
                <img 
                  src="https://images.unsplash.com/photo-1559599238-12b7b4b01c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                  alt="Hotel Pool"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'about', label: 'About' },
              { id: 'rooms', label: 'Rooms' },
              { id: 'accessibility', label: 'Accessibility' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-[#C72030] text-[#C72030]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="col-span-2">
            {/* Hotel Title */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Coastal Gateway Resort, 3 min walk to Nagaon Beach</h1>
              <div className="flex items-center gap-2">
                <Badge className="bg-orange-100 text-orange-800">3.8</Badge>
                <span className="text-gray-600">Reviews</span>
              </div>
            </div>

            {/* Tab Content */}
            {renderTabContent()}
          </div>

          {/* Right Sidebar - Room Selection */}
          <div className="col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="text-2xl font-bold">₹10,000</div>
                    <div className="text-gray-600">for 4 nights</div>
                  </div>
                  <Button 
                    onClick={handleBookNow}
                    className="bg-gray-800 hover:bg-gray-700 text-white"
                  >
                    Book Now
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-3">Standard Room</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        <span>Free Self Parking</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        <span>250 sq ft</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Sleeps 3</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bed className="h-4 w-4" />
                        <span>1 King Bed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Reserve now, pay later</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wifi className="h-4 w-4" />
                        <span>Free Wifi</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-green-50 rounded">
                      <div className="text-sm font-medium text-green-800">Fully refundable</div>
                      <div className="text-xs text-green-600">Before Thu, 12 Jun</div>
                    </div>
                    
                    <Button variant="outline" className="w-full mt-3 text-[#C72030] border-[#C72030]">
                      More Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
