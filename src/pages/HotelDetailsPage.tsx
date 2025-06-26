
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, Wifi, Car, UtensilsCrossed, Shield, Bed } from 'lucide-react';

export const HotelDetailsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate('/vas/hotels/booking');
  };

  const hotelImages = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1559599238-12b7b4b01c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => navigate('/vas/hotels/rewards')}
        className="mb-4 p-0 hover:bg-transparent"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back to Hotels
      </Button>

      {/* Main Hotel Image */}
      <div className="mb-6">
        <div className="aspect-video overflow-hidden rounded-lg mb-4">
          <img 
            src={hotelImages[0]}
            alt="Coastal Gateway Resort"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Thumbnail Images */}
        <div className="grid grid-cols-4 gap-2">
          {hotelImages.slice(1, 5).map((image, index) => (
            <div key={index} className="aspect-video overflow-hidden rounded">
              <img 
                src={image}
                alt={`Hotel view ${index + 2}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex mb-6 border-b">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'about', label: 'About' },
          { id: 'rooms', label: 'Rooms' },
          { id: 'accessibility', label: 'Accessibility' }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-4 rounded-none border-b-2 ${
              activeTab === tab.id 
                ? 'border-orange-500 text-orange-500' 
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Content */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Coastal Gateway Resort, 3 min walk to Nagaon Beach</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-orange-100 text-orange-800 px-2 py-1 text-sm font-semibold rounded">3.8</div>
              <span className="text-gray-600">Reviews</span>
            </div>
          </div>

          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">About this property</h2>
              <p className="text-gray-700 mb-6">Hotel in Alibag with 24-hour front desk and restaurant</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">24/7 front desk</span>
                </div>
                <div className="flex items-center gap-3">
                  <Car className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">Parking Included</span>
                </div>
                <div className="flex items-center gap-3">
                  <UtensilsCrossed className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">Restaurant</span>
                </div>
                <div className="flex items-center gap-3">
                  <Wifi className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">Free Wifi</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">Housekeeping</span>
                </div>
              </div>

              <Button variant="link" className="text-orange-500 p-0 h-auto">
                See all about this property
              </Button>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Accessibility</h3>
                <p className="text-gray-700">
                  If you have requests for specific accessibility needs, please contact the property using the information on the reservation confirmation received after booking.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Room Selection */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="text-2xl font-bold">₹10,000</div>
                  <div className="text-gray-600">for 4 nights</div>
                </div>
                <Button 
                  onClick={handleBookNow}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2"
                >
                  Book Now
                </Button>
              </div>

              <div className="border rounded-lg p-4 mb-4">
                <h4 className="font-semibold mb-3">Standard Room</h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    <span>Free Self Parking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">📐</span>
                    <span>250 sq ft</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">👥</span>
                    <span>Sleeps 3</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bed className="h-4 w-4" />
                    <span>1 King Bed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">⏰</span>
                    <span>Reserve now, pay later</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4" />
                    <span>Free Wifi</span>
                  </div>
                </div>

                <Button variant="link" className="text-orange-500 p-0 h-auto mt-2">
                  More Details
                </Button>
              </div>

              <div className="bg-gray-50 p-3 rounded text-sm">
                <div className="font-medium">Fully refundable</div>
                <div className="text-gray-600">Before Thu, 12 Jun</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
