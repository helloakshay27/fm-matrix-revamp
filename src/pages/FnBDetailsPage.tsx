
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wifi, Car, UtensilsCrossed, Shield, CheckCircle, Users, Clock, Star } from 'lucide-react';

export const FnBDetailsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleBookNow = () => {
    navigate('/vas/fnb/booking');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">About this restaurant</h3>
              <p className="text-gray-600 mb-4">Fine dining restaurant with coastal cuisine and ocean views</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <span>Open 11 AM - 11 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-gray-600" />
                  <span>Valet Parking</span>
                </div>
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="h-5 w-5 text-gray-600" />
                  <span>Multi-cuisine</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-gray-600" />
                  <span>Free Wifi</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-gray-600" />
                  <span>Table Service</span>
                </div>
              </div>
              
              <Button variant="outline" className="text-[#C72030] border-[#C72030]">
                See full menu
              </Button>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Special Offers</h3>
              <p className="text-gray-600">
                Enjoy 20% off on all meals during your visit. Valid for dine-in only.
              </p>
            </div>
          </div>
        );
      case 'menu':
        return <div className="p-4">Menu content goes here...</div>;
      case 'reviews':
        return <div className="p-4">Reviews content goes here...</div>;
      case 'location':
        return <div className="p-4">Location content goes here...</div>;
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
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Restaurant Main"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="col-span-4 grid grid-rows-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Restaurant Interior"
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                  alt="Restaurant Food"
                  className="w-full h-full object-cover rounded-lg"
                />
                <img 
                  src="https://images.unsplash.com/photo-1559329007-40df8a9345d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                  alt="Restaurant Ambiance"
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
              { id: 'menu', label: 'Menu' },
              { id: 'reviews', label: 'Reviews' },
              { id: 'location', label: 'Location' }
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
            {/* Restaurant Title */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Coastal Dining Restaurant</h1>
              <div className="flex items-center gap-2">
                <Badge className="bg-orange-100 text-orange-800">4.2</Badge>
                <span className="text-gray-600">Reviews</span>
                <div className="flex items-center gap-1 ml-2">
                  {[1, 2, 3, 4].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <Star className="h-4 w-4 text-gray-300" />
                </div>
              </div>
            </div>

            {/* Tab Content */}
            {renderTabContent()}
          </div>

          {/* Right Sidebar - Booking */}
          <div className="col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="text-2xl font-bold text-[#C72030]">20% OFF</div>
                    <div className="text-gray-600">on all meals</div>
                  </div>
                  <Button 
                    onClick={handleBookNow}
                    className="bg-gray-800 hover:bg-gray-700 text-white"
                  >
                    Book Table
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-3">Table Reservation</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Available all day</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Up to 8 guests</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UtensilsCrossed className="h-4 w-4" />
                        <span>Multi-cuisine menu</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Instant confirmation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wifi className="h-4 w-4" />
                        <span>Free Wifi</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-green-50 rounded">
                      <div className="text-sm font-medium text-green-800">Special Offer</div>
                      <div className="text-xs text-green-600">Valid till end of month</div>
                    </div>
                    
                    <Button variant="outline" className="w-full mt-3 text-[#C72030] border-[#C72030]">
                      View Menu
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
