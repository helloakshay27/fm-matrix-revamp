import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Star, Users, Percent } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface Restaurant {
  id: string;
  name: string;
  location: string;
  rating: number;
  timeRange: string;
  discount: string;
  image: string;
}

interface MobileRestaurantDashboardProps {
  restaurants: Restaurant[];
  userOrders?: unknown[];
}

export const MobileRestaurantDashboard: React.FC<MobileRestaurantDashboardProps> = ({
  restaurants,
  userOrders = []
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'restaurant' | 'orders'>('restaurant');

  // Check if user is from external scan
  const sourceParam = searchParams.get('source');
  const isExternalScan = sourceParam === 'external';

  // Set default tab based on user type
  useEffect(() => {
    console.log("🔍 RESTAURANT DASHBOARD - EXTERNAL DETECTION:");
    console.log("  - sourceParam:", sourceParam);
    console.log("  - isExternalScan:", isExternalScan);
    
    if (isExternalScan) {
      console.log("👤 EXTERNAL USER: Setting restaurant tab as default");
      setActiveTab('restaurant'); // External users see restaurant tab by default
    } else {
      console.log("📱 INTERNAL USER: Setting restaurant tab as default");
      setActiveTab('restaurant'); // Keep restaurant as default for dashboard
    }
  }, [isExternalScan, sourceParam]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleRestaurantClick = (restaurantId: string) => {
    // Preserve source parameter when navigating
    const currentParams = new URLSearchParams(window.location.search);
    const queryString = currentParams.toString();
    const url = queryString 
      ? `/mobile/restaurant/${restaurantId}/details?${queryString}`
      : `/mobile/restaurant/${restaurantId}/details`;
    
    console.log("🍽️ NAVIGATING TO RESTAURANT:", url);
    navigate(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center">
          <button onClick={handleBack} className="mr-4">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">F&B</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('restaurant')}
            className={`${isExternalScan ? 'w-full' : 'flex-1'} py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'restaurant'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Restaurant
          </button>
          {!isExternalScan && (
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'orders'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              My Orders
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'restaurant' && (
          <div className="space-y-4">
            {restaurants.map((restaurant) => (
              <div 
                key={restaurant.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
                onClick={() => handleRestaurantClick(restaurant.id)}
              >
                <div className="flex">
                  {/* Restaurant Image */}
                  <div className="w-20 h-20 bg-gray-200 rounded-lg m-4 overflow-hidden">
                    <img 
                      src={restaurant.image} 
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Restaurant Details */}
                  <div className="flex-1 p-4 pl-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{restaurant.name}</h3>
                      <div className="flex items-center bg-orange-100 px-2 py-1 rounded-lg">
                        <span className="text-sm font-semibold text-gray-900 mr-1">{restaurant.rating}</span>
                        <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                      </div>
                    </div>

                    <div className="flex items-center text-gray-500 text-sm mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{restaurant.location}</span>
                    </div>

                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{restaurant.timeRange}</span>
                    </div>

                    <div className="flex items-center">
                      <div className="bg-red-100 rounded-full p-1 mr-2">
                        <Percent className="w-3 h-3 text-red-600" />
                      </div>
                      <span className="text-sm font-semibold text-red-600">{restaurant.discount}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'orders' && !isExternalScan && (
          <div className="space-y-4">
            {userOrders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No orders found</p>
              </div>
            ) : (
              userOrders.map((order, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  {/* Order details will be implemented based on the order structure */}
                  <p className="text-gray-600">Order #{index + 1}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};