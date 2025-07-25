import React, { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
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

interface ContactDetails {
  contactNumber: string;
  name: string;
  email: string;
}

export const MobileOrderReview: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, restaurant, note, contactDetails, isAppUser } = location.state as {
    items: MenuItem[];
    restaurant: Restaurant;
    note: string;
    contactDetails?: ContactDetails;
    isAppUser: boolean;
  };

  const [showSuccess, setShowSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    orderId: '#32416',
    status: 'Pending',
    customerName: isAppUser ? 'Abdul Ghaffar' : contactDetails?.name || '',
    contactNumber: isAppUser ? '9876567891' : contactDetails?.contactNumber || '',
    deliveryLocation: 'Room no-402, Floor 2\nWorli (W), 400028'
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleViewOrderDetails = () => {
    // Navigate to order tracking or details page
    navigate(`/mobile/orders/${orderDetails.orderId}`);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

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
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-auto">
            <div className="w-20 h-20 bg-white border-2 border-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-gray-900" strokeWidth={3} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Placed Successfully
            </h2>
          </div>
        </div>

        {/* View Order Details Button */}
        <div className="p-4">
          <Button
            onClick={handleViewOrderDetails}
            variant="outline"
            className="w-full border-red-600 text-red-600 hover:bg-red-50 py-4 rounded-xl text-lg font-semibold"
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
      <div className="p-4">
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm font-medium">
                {orderDetails.status}
              </span>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Order ID */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <span className="text-gray-600">Order ID</span>
              <span className="font-semibold text-gray-900">{orderDetails.orderId}</span>
            </div>

            {/* Restaurant Info */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <span className="text-gray-600">{restaurant.name}</span>
              <span className="text-gray-600">Total Items - {getTotalItems()}</span>
            </div>

            {/* Items List */}
            <div className="space-y-2 border-b border-gray-100 pb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <span className="text-gray-900">{item.name}</span>
                  <span className="text-gray-600 text-sm">
                    {item.quantity.toString().padStart(2, '0')}
                  </span>
                </div>
              ))}
            </div>

            {/* Details Section */}
            <div>
              <h3 className="text-gray-900 font-semibold mb-3">Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-gray-600">Customer Name</span>
                  <span className="text-gray-900 text-right">{orderDetails.customerName}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-600">Contact Number</span>
                  <span className="text-gray-900 text-right">{orderDetails.contactNumber}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-600">Delivery Location</span>
                  <span className="text-gray-900 text-right whitespace-pre-line">
                    {orderDetails.deliveryLocation}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* This would normally be a confirmation step, but based on your flow, 
          it automatically shows success after the order summary */}
      <div className="p-4">
        <Button
          onClick={() => setShowSuccess(true)}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl text-lg font-semibold"
        >
          Confirm Order
        </Button>
      </div>
    </div>
  );
};