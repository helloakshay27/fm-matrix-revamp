import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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

export const MobileOrderReview: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Check if user is from external scan (Google Lens, etc.)
  const isExternalScan = searchParams.get('source') === 'external';
  
  const { items, restaurant, note } = location.state as {
    items: MenuItem[];
    restaurant: Restaurant;
    note?: string;
  };

  const [showSuccess, setShowSuccess] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleViewOrderDetails = () => {
    if (isExternalScan) {
      // External users stay on order review page
      navigate('/mobile/restaurant/order-history');
    } else {
      // App users go to my orders list page
      navigate('/mobile/orders');
    }
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const handleConfirmOrder = () => {
    setShowSuccess(true);
    
    // Show success for 5 seconds
    setTimeout(() => {
      if (!isExternalScan) {
        // App user goes to My Orders
        navigate('/mobile/orders');
      }
      // External scan users stay on success page
    }, 5000);
  };

  // Auto-redirect app users after 5 seconds
  useEffect(() => {
    if (showSuccess && !isExternalScan) {
      const timer = setTimeout(() => {
        navigate('/mobile/orders');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [showSuccess, isExternalScan, navigate]);

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center">
            <button onClick={handleBack} className="mr-4">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Order Review</h1>
          </div>
        </div>

        {/* Success Message */}
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="bg-[#E8E2D3] rounded-lg p-8 mx-4 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-gray-400">
              <Check className="w-8 h-8 text-gray-900" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Order Placed Successfully</h2>
          </div>
        </div>

        {/* View Order Details Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4">
          <Button
            onClick={handleViewOrderDetails}
            variant="outline"
            className="w-full border-2 border-red-600 text-red-600 bg-white hover:bg-red-50 py-4 rounded-xl text-lg font-medium"
          >
            View Order Details
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center">
          <button onClick={handleBack} className="mr-4">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Order Review</h1>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-[#E8E2D3] mx-4 mt-4 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
          <span className="bg-gray-400 text-white px-3 py-1 rounded text-sm">Pending</span>
        </div>
        
        <div className="border-t border-gray-400 border-dashed pt-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-gray-900">Order ID</span>
            <span className="font-semibold text-gray-900">#32416</span>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-gray-900">{restaurant.name}</span>
            <span className="text-gray-600">Total Items - {getTotalItems()}</span>
          </div>

          {/* Items List */}
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center mb-2">
              <span className="text-gray-900">{item.name}</span>
              <span className="text-gray-900 font-medium">0{item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-400 border-dashed pt-4">
          <h3 className="font-semibold text-gray-900 mb-3">Details</h3>
          <div className="border-t border-gray-400 border-dashed pt-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-900">Customer Name</span>
              <span className="text-gray-900">Abdul Ghaffar</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-900">Contact Number</span>
              <span className="text-gray-900">9876567891</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-900">Delivery Location</span>
              <div className="text-right">
                <div className="text-gray-900">Room no-402, Floor 2</div>
                <div className="text-gray-900">Worli (W), 400028</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Order Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <Button
          onClick={handleConfirmOrder}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl text-lg font-semibold"
        >
          Confirm Order
        </Button>
      </div>
    </div>
  );
};