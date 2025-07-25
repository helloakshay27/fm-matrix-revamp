import React, { useState } from 'react';
import { ArrowLeft, MapPin, Star, Users, Percent } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  userOrders?: any[];
}

export const MobileRestaurantDashboard: React.FC<MobileRestaurantDashboardProps> = ({
  restaurants,
  userOrders = []
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'restaurant' | 'orders'>('restaurant');

  const handleBack = () => {
    navigate(-1);
  };

  const handleRestaurantClick = (restaurantId: string) => {
    navigate(`/mobile/restaurant/${restaurantId}/details`);
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
            className={`flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'restaurant'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Restaurant
          </button>
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

        {activeTab === 'orders' && (
          <div className="space-y-4">
            {userOrders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No orders found</p>
              </div>
            ) : (
              userOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  {/* Order details will be implemented based on the order structure */}
                  <p className="text-gray-600">Order #{order.id}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};