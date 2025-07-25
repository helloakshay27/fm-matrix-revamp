import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Star, Users, Percent, Plus, Minus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity?: number;
}

interface Restaurant {
  id: string;
  name: string;
  location: string;
  rating: number;
  timeRange: string;
  discount: string;
  image: string;
  menuItems: MenuItem[];
}

interface MobileRestaurantDetailsProps {
  restaurant: Restaurant;
}

export const MobileRestaurantDetails: React.FC<MobileRestaurantDetailsProps> = ({
  restaurant
}) => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>(restaurant.menuItems || []);
  const [showItems, setShowItems] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const updateQuantity = (itemId: string, change: number) => {
    setMenuItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(0, (item.quantity || 0) + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const addItem = (itemId: string) => {
    updateQuantity(itemId, 1);
  };

  const getSelectedItems = () => {
    return menuItems.filter(item => item.quantity && item.quantity > 0);
  };

  const getTotalItems = () => {
    return menuItems.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const handleShowItems = () => {
    const selectedItems = getSelectedItems();
    if (selectedItems.length > 0) {
      navigate(`/mobile/restaurant/${restaurant.id}/items`, { 
        state: { selectedItems, restaurant } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center">
          <button onClick={handleBack} className="mr-4">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Restaurant Details</h1>
        </div>
      </div>

      {/* Restaurant Hero Image */}
      <div className="relative">
        <div className="h-64 bg-gray-300 overflow-hidden">
          <img 
            src={restaurant.image} 
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Discount Badge */}
        <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full flex items-center">
          <Percent className="w-4 h-4 mr-1" />
          <span className="text-sm font-semibold">{restaurant.discount}</span>
        </div>

        {/* Pagination dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-white/50 rounded-full"></div>
          <div className="w-2 h-2 bg-white/50 rounded-full"></div>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="bg-white p-4">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-bold text-gray-900">{restaurant.name}</h2>
          <div className="flex items-center bg-orange-100 px-2 py-1 rounded-lg">
            <span className="text-sm font-semibold text-gray-900 mr-1">{restaurant.rating}</span>
            <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
          </div>
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{restaurant.location}</span>
        </div>

        <div className="flex items-center text-gray-500 text-sm">
          <Users className="w-4 h-4 mr-1" />
          <span>{restaurant.timeRange}</span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-4">
        {menuItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex">
              {/* Item Details */}
              <div className="flex-1 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
              </div>

              {/* Item Image */}
              <div className="w-24 h-24 bg-gray-200 rounded-lg m-4 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Add/Quantity Controls - Below the image */}
            <div className="px-4 pb-4">
              {!item.quantity || item.quantity === 0 ? (
                <Button
                  onClick={() => addItem(item.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-medium"
                >
                  Add
                </Button>
              ) : (
                <div className="flex items-center border border-red-600 rounded-lg w-fit">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-2 text-red-600 hover:bg-red-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 text-gray-900 font-medium min-w-[40px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-2 text-red-600 hover:bg-red-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Show Items Button */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <Button
            onClick={handleShowItems}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl text-lg font-semibold"
          >
            Show Items
          </Button>
        </div>
      )}

      {/* Menu Button */}
      <div className="fixed bottom-4 right-4">
        <Button className="bg-white text-gray-900 border border-gray-300 px-6 py-3 rounded-xl shadow-lg flex items-center">
          <span className="mr-2">🍽️</span>
          Menu
        </Button>
      </div>
    </div>
  );
};