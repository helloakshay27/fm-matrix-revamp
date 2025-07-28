
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wifi, Car, Users, Bed, MapPin, Star, CheckCircle, Calendar } from 'lucide-react';

export const HotelDetailsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleBookNow = () => {
    navigate('/vas/hotels/booking');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Hotel Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
            alt="Hotel main view"
            className="w-full h-80 object-cover rounded-lg"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
            alt="Hotel room"
            className="w-full h-36 object-cover rounded-lg"
          />
          <img
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
            alt="Hotel exterior"
            className="w-full h-36 object-cover rounded-lg"
          />
          <img
            src="https://images.unsplash.com/photo-1559599238-12b7b4b01c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
            alt="Hotel amenities"
            className="w-full h-36 object-cover rounded-lg"
          />
          <img
            src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
            alt="Hotel pool"
            className="w-full h-36 object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex mb-6 border-b">
        {['Overview', 'About', 'Rooms', 'Accessibility'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-4 py-2 border-b-2 transition-colors ${activeTab === tab.toLowerCase()
                ? 'border-orange-500 text-orange-500 font-medium'
                : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Content */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Coastal Gateway Resort, 3 min walk to Nagaon Beach</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                <span className="bg-orange-500 text-white px-2 py-1 rounded text-sm font-medium">3.8</span>
                <span className="text-gray-600">Reviews</span>
              </div>
            </div>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">About this property</h2>
                <p className="text-gray-600 mb-4">Hotel in Alibag with 24-hour front desk and restaurant</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span>24/7 front desk</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Car className="w-4 h-4" />
                    </div>
                    <span>Parking Included</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <span>Restaurant</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Wifi className="w-4 h-4" />
                    </div>
                    <span>Free Wifi</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <span>Housekeeping</span>
                  </div>
                </div>

                <Button variant="link" className="text-orange-500 p-0 mt-4">
                  See all about this property
                </Button>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Accessibility</h2>
                <p className="text-gray-600">
                  If you have requests for specific accessibility needs, please
                  contact the property using the information on the reservation
                  confirmation received after booking.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Room Details */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-3xl font-bold text-gray-900">{localStorage.getItem('currency')}10,000</div>
                  <div className="text-gray-600">for 4 nights</div>
                </div>
                <Button
                  onClick={handleBookNow}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2"
                >
                  Book Now
                </Button>
              </div>

              <div className="border rounded-lg p-4 mb-4">
                <h3 className="font-semibold mb-3">Standard Room</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    <span>Free Self Parking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>250 sq ft</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Sleeps 3</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bed className="w-4 h-4" />
                    <span>1 King Bed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Reserve now, pay later</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4" />
                    <span>Free Wifi</span>
                  </div>
                </div>

                <Button variant="link" className="text-orange-500 p-0 mt-3">
                  More Details
                </Button>
              </div>

              <div className="bg-green-50 p-3 rounded-lg">
                <div className="font-medium text-green-800">Fully refundable</div>
                <div className="text-sm text-green-600">Before Thu, 12 Jun</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom URL indicator */}
      <div className="mt-8 text-xs text-gray-500 text-center">
        https://keeclub.lockated.com/dashboard/hotel-details
      </div>
    </div>
  );
};
