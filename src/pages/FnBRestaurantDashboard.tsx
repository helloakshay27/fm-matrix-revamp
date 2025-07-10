import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, Plus, Search, Filter } from 'lucide-react';
interface Restaurant {
  id: number;
  name: string;
  openDays: string;
  bookingAllowed: boolean;
  orderAllowed: boolean;
  active: boolean;
}
const mockRestaurants: Restaurant[] = [{
  id: 1,
  name: 'Test restaurant',
  openDays: 'M T W T F S S',
  bookingAllowed: false,
  orderAllowed: false,
  active: false
}, {
  id: 2,
  name: 'Haven',
  openDays: 'M T W T F S S',
  bookingAllowed: true,
  orderAllowed: false,
  active: false
}, {
  id: 3,
  name: 'twjas',
  openDays: 'M T W T F S S',
  bookingAllowed: true,
  orderAllowed: false,
  active: false
}, {
  id: 4,
  name: 'Love & Latte',
  openDays: 'M T W T F S S',
  bookingAllowed: true,
  orderAllowed: true,
  active: true
}, {
  id: 5,
  name: 'Haven Cafe',
  openDays: 'M T W T F S S',
  bookingAllowed: true,
  orderAllowed: true,
  active: true
}, {
  id: 6,
  name: 'Haven Havanna Cafe',
  openDays: 'M T W T F S S',
  bookingAllowed: true,
  orderAllowed: true,
  active: true
}];
export const FnBRestaurantDashboard = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>(mockRestaurants);
  const handleViewRestaurant = (id: number) => {
    navigate(`/vas/fnb/details/${id}`);
  };
  const toggleBookingAllowed = (id: number) => {
    setRestaurants(prev => prev.map(restaurant => restaurant.id === id ? {
      ...restaurant,
      bookingAllowed: !restaurant.bookingAllowed
    } : restaurant));
  };
  const toggleOrderAllowed = (id: number) => {
    setRestaurants(prev => prev.map(restaurant => restaurant.id === id ? {
      ...restaurant,
      orderAllowed: !restaurant.orderAllowed
    } : restaurant));
  };
  const toggleActive = (id: number) => {
    setRestaurants(prev => prev.map(restaurant => restaurant.id === id ? {
      ...restaurant,
      active: !restaurant.active
    } : restaurant));
  };
  return <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center text-sm text-[#1a1a1a] opacity-70 mb-2">
          <span>Restaurant</span>
          <span className="mx-2">&gt;</span>
          <span>Restaurant List</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">RESTAURANT</h1>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <Button onClick={() => navigate('/vas/fnb/add')} className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-md flex items-center gap-2 border-0">
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Open Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Allowed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Allowed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {restaurants.map(restaurant => <tr key={restaurant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => handleViewRestaurant(restaurant.id)} className="text-stone-800">
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{restaurant.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{restaurant.openDays}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${restaurant.bookingAllowed ? 'bg-green-500' : 'bg-gray-300'}`} onClick={() => toggleBookingAllowed(restaurant.id)}>
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${restaurant.bookingAllowed ? 'translate-x-6' : 'translate-x-1'}`} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${restaurant.orderAllowed ? 'bg-green-500' : 'bg-gray-300'}`} onClick={() => toggleOrderAllowed(restaurant.id)}>
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${restaurant.orderAllowed ? 'translate-x-6' : 'translate-x-1'}`} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${restaurant.active ? 'bg-green-500' : 'bg-gray-300'}`} onClick={() => toggleActive(restaurant.id)}>
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${restaurant.active ? 'translate-x-6' : 'translate-x-1'}`} />
                      </div>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>

    </div>;
};