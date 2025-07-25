import React, { useState } from 'react';
import { ArrowLeft, Plus, Minus, Edit3 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
}

interface Restaurant {
  id: string;
  name: string;
  location: string;
  rating: number;
  timeRange: string;
  discount: string;
  image: string;
}

export const MobileItemsDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedItems: initialItems, restaurant } = location.state as {
    selectedItems: MenuItem[];
    restaurant: Restaurant;
  };

  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [note, setNote] = useState<string>('');
  const [showNoteInput, setShowNoteInput] = useState<boolean>(false);

  const handleBack = () => {
    navigate(-1);
  };

  const updateQuantity = (itemId: string, change: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(0, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const addMoreItems = () => {
    navigate(`/mobile/restaurant/${restaurant.id}/details`);
  };

  const handlePlaceOrder = () => {
    // Check if user is logged in (scanned through app)
    const isLoggedIn = localStorage.getItem('user'); // Assuming user data is stored in localStorage
    
    if (isLoggedIn) {
      // User is logged in, proceed directly to order confirmation
      navigate(`/mobile/restaurant/${restaurant.id}/order-review`, {
        state: { 
          items, 
          restaurant, 
          note, 
          isAppUser: true 
        }
      });
    } else {
      // User scanned from external camera, show contact form
      navigate(`/mobile/restaurant/${restaurant.id}/contact-form`, {
        state: { 
          items, 
          restaurant, 
          note,
          isAppUser: false 
        }
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
          <h1 className="text-lg font-semibold text-gray-900">Items Details</h1>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">{restaurant.name}</h2>
          <span className="text-sm text-gray-600">Total Items - {getTotalItems()}</span>
        </div>
      </div>

      {/* Items List */}
      <div className="bg-white mx-4 mt-4 rounded-xl border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-4">
              <span className="text-gray-900 font-medium">{item.name}</span>
              <div className="flex items-center border border-red-600 rounded-lg">
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
            </div>
          ))}
        </div>

        {/* Add More Items */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={addMoreItems}
            className="text-red-600 font-medium text-sm flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add more items
          </button>
        </div>
      </div>

      {/* Note Section */}
      <div className="mx-4 mt-4">
        {!showNoteInput ? (
          <button
            onClick={() => setShowNoteInput(true)}
            className="w-full bg-white border border-gray-200 rounded-xl p-4 text-left text-gray-500 flex items-center"
          >
            Add a note for the restaurant
          </button>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="flex items-center p-4 border-b border-gray-100">
              <Edit3 className="w-5 h-5 text-gray-600 mr-2" />
              <span className="font-medium text-gray-900">Note for the restaurant</span>
            </div>
            <div className="p-4">
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Do not add egg in the noodles"
                className="w-full border-0 resize-none focus:ring-0 text-gray-600"
                rows={3}
              />
            </div>
          </div>
        )}
      </div>

      {/* Place Order Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <Button
          onClick={handlePlaceOrder}
          disabled={items.length === 0}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl text-lg font-semibold disabled:opacity-50"
        >
          Place Order
        </Button>
      </div>
    </div>
  );
};