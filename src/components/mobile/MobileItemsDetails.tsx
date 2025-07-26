import React, { useState } from 'react';
import { ArrowLeft, Plus, Minus, X } from 'lucide-react';
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
  const [showNoteDialog, setShowNoteDialog] = useState<boolean>(false);

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
    navigate(`/mobile/restaurant/${restaurant.id}/order-review`, {
      state: { 
        items, 
        restaurant, 
        note
      }
    });
  };

  const handleSaveNote = () => {
    setShowNoteDialog(false);
  };

  const handleClearNote = () => {
    setNote('');
    setShowNoteDialog(false);
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
      <div className="bg-[#E8E2D3] mx-4 mt-4 rounded-lg overflow-hidden">
        <div className="p-4 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <span className="text-gray-900 font-medium">{item.name}</span>
              <div className="flex items-center border-2 border-red-600 rounded-lg bg-white">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="px-3 py-1 text-red-600 hover:bg-red-50 text-lg font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1 text-gray-900 font-medium min-w-[40px] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="px-3 py-1 text-red-600 hover:bg-red-50 text-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>
          ))}
          
          {/* Add More Items */}
          <div className="pt-2">
            <button
              onClick={addMoreItems}
              className="text-red-600 font-medium text-sm flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add more items
            </button>
          </div>
        </div>
      </div>

      {/* Note Section */}
      <div className="mx-4 mt-4">
        <button
          onClick={() => setShowNoteDialog(true)}
          className="w-full bg-white border border-gray-200 rounded-xl p-4 text-left text-gray-500"
        >
          Add a note for the restaurant
        </button>
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

      {/* Note Dialog */}
      {showNoteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#E8E2D3] rounded-lg w-full max-w-md">
            {/* Dialog Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-300">
              <h3 className="text-lg font-semibold text-gray-900">Add a note for the restaurant</h3>
              <button onClick={() => setShowNoteDialog(false)}>
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Dialog Content */}
            <div className="p-4">
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="do not add egg in the noodles"
                className="w-full border-0 bg-white rounded-lg p-3 resize-none focus:ring-0 text-gray-600"
                rows={4}
              />
            </div>

            {/* Dialog Actions */}
            <div className="p-4 flex gap-3">
              <Button
                onClick={handleClearNote}
                variant="outline"
                className="flex-1 border-2 border-red-600 text-red-600 bg-transparent hover:bg-red-50 py-3 rounded-lg font-medium"
              >
                Clear
              </Button>
              <Button
                onClick={handleSaveNote}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};