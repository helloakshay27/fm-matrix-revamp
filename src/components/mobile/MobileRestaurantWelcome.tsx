import React from 'react';
import { MapPin, Star, Clock, Users, Percent } from 'lucide-react';
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

interface MobileRestaurantWelcomeProps {
  conferenceRoom?: string;
  location?: string;
  restaurant: Restaurant;
}

export const MobileRestaurantWelcome: React.FC<MobileRestaurantWelcomeProps> = ({
  conferenceRoom = "Conference Room Name",
  location = "Sumer Kendra, Worli(W), Mumbai",
  restaurant
}) => {
  const navigate = useNavigate();

  const handleRestaurantClick = () => {
    navigate(`/mobile/restaurant/${restaurant.id}/details`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Welcome Card */}
      <div className="bg-gray-200 rounded-2xl p-6 mb-6 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Welcome !!</h1>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{conferenceRoom}</h2>
        <div className="flex items-center justify-center text-gray-600">
          <MapPin className="w-5 h-5 mr-2" />
          <span className="text-sm">{location}</span>
        </div>
      </div>

      {/* Restaurant Card */}
      <div 
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
        onClick={handleRestaurantClick}
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
    </div>
  );
};