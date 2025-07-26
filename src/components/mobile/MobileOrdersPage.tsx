import React, { useState } from 'react';
import { ArrowLeft, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Order {
  id: string;
  itemName: string;
  restaurantName: string;
  status: 'Approved' | 'Pending' | 'Delivered' | 'Cancelled';
  statusMessage: string;
  timeAgo: string;
}

const mockOrders: Order[] = [
  {
    id: '1',
    itemName: 'Chicken Noodles',
    restaurantName: 'The Bawa Kitchen',
    status: 'Approved',
    statusMessage: 'Your Order is on the way',
    timeAgo: '2 min. Ago'
  },
  {
    id: '2',
    itemName: 'Beef Tacos',
    restaurantName: 'Taco Time',
    status: 'Pending',
    statusMessage: 'Your Order is being prepared',
    timeAgo: '5 min. Ago'
  },
  {
    id: '3',
    itemName: 'Vegetable Stir Fry',
    restaurantName: 'Green Eats',
    status: 'Delivered',
    statusMessage: 'Your Order is ready for pickup',
    timeAgo: '10 min. Ago'
  },
  {
    id: '4',
    itemName: 'Margherita Pizza',
    restaurantName: 'Pizza Palace',
    status: 'Delivered',
    statusMessage: 'Your Order has been delivered',
    timeAgo: '15 min. Ago'
  },
  {
    id: '5',
    itemName: 'Sushi Platter',
    restaurantName: 'Sushi Chef',
    status: 'Cancelled',
    statusMessage: 'Your Order is being delivered',
    timeAgo: '20 min. Ago'
  }
];

export const MobileOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'restaurant' | 'orders'>('orders');

  const handleBack = () => {
    navigate(-1);
  };

  const getStatusBadgeColor = (status: Order['status']) => {
    switch (status) {
      case 'Approved':
        return 'bg-orange-200 text-orange-800';
      case 'Pending':
        return 'bg-blue-200 text-blue-800';
      case 'Delivered':
        return 'bg-orange-200 text-orange-800';
      case 'Cancelled':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const handleOrderClick = (orderId: string) => {
    // Find the order to get its details
    const order = mockOrders.find(o => o.id === orderId);
    if (order) {
      // Create mock data to match order review format
      const mockItems = [
        { id: '1', name: order.itemName, description: 'Delicious food item', price: 250, image: '', quantity: 1 }
      ];
      const mockRestaurant = {
        id: '1',
        name: order.restaurantName,
        location: 'Andheri West',
        rating: 4.1,
        timeRange: '60-65 mins',
        discount: '20% OFF',
        image: ''
      };
      
      // Navigate to order review page with order data and flag indicating it's already placed
      navigate('/mobile/restaurant/1/order-review', {
        state: {
          items: mockItems,
          restaurant: mockRestaurant,
          note: 'Previous order details',
          isExistingOrder: true
        }
      });
    }
  };

  const handleRestaurantTab = () => {
    setActiveTab('restaurant');
    navigate('/mobile/restaurant?source=app');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-center relative">
          <button onClick={handleBack} className="absolute left-0">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">F&B</h1>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          <button
            onClick={handleRestaurantTab}
            className={`flex-1 py-4 px-4 text-center font-medium ${
              activeTab === 'restaurant'
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-500'
            }`}
          >
            Restaurant
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-4 px-4 text-center font-medium ${
              activeTab === 'orders'
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-500'
            }`}
          >
            My Orders
          </button>
        </div>
      </div>

      {/* Orders List */}
      {activeTab === 'orders' && (
        <div className="p-4 space-y-3">
          {mockOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => handleOrderClick(order.id)}
              className="bg-[#E8E2D3] rounded-lg p-4 cursor-pointer hover:shadow-sm transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="text-gray-900 font-semibold text-lg">
                    {order.itemName}
                  </h3>
                  <p className="text-gray-600 text-base">
                    {order.restaurantName}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded text-sm font-medium ${getStatusBadgeColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span className="text-sm">{order.statusMessage}</span>
                </div>
                <span className="text-gray-500 text-sm">{order.timeAgo}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};