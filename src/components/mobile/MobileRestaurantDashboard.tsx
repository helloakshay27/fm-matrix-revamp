import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Star, Users, Percent, Clock, Package } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { restaurantApi, FoodOrder } from '@/services/restaurantApi';

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
  const [orders, setOrders] = useState<FoodOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string>('');

  // Check if user is from external scan
  const sourceParam = searchParams.get('source');
  const isExternalScan = sourceParam === 'external';

  // Fetch user orders
  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      setOrdersError('');
      
      const userInfo = JSON.parse(sessionStorage.getItem("app_user_info") || '{}');
      const userId = userInfo.id?.toString();
      
      console.log("📦 FETCHING ORDERS for user:", userId);
      const foodOrders = await restaurantApi.getUserOrders(userId);
      console.log("📦 RECEIVED ORDERS:", foodOrders);
      
      // Sort orders by created_at (newest first)
      const sortedOrders = foodOrders.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      setOrders(sortedOrders);
    } catch (error) {
      console.error("❌ ERROR FETCHING ORDERS:", error);
      setOrdersError("Failed to load orders. Please try again.");
    } finally {
      setOrdersLoading(false);
    }
  };

  // Set default tab based on user type
  useEffect(() => {
    console.log("🔍 RESTAURANT DASHBOARD - EXTERNAL DETECTION:");
    console.log("  - sourceParam:", sourceParam);
    console.log("  - isExternalScan:", isExternalScan);
    console.log("  - restaurants count:", restaurants.length);
    console.log("  - restaurants data:", restaurants);
    
    if (isExternalScan) {
      console.log("👤 EXTERNAL USER: Setting restaurant tab as default");
      setActiveTab('restaurant'); // External users see restaurant tab by default
    } else {
      console.log("📱 INTERNAL USER: Setting restaurant tab as default");
      setActiveTab('restaurant'); // Keep restaurant as default for dashboard
    }
  }, [isExternalScan, sourceParam, restaurants]);

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

  const handleOrderClick = (order: FoodOrder) => {
    // Navigate to order review with complete order data
    navigate('/mobile/order-review', { 
      state: { 
        order: order,
        isExistingOrder: true,
        items: order.items?.map(item => ({
          id: item.id?.toString() || item.menu_id?.toString(),
          name: item.menu_name || 'Menu Item',
          description: item.menu_sub_category || 'Food item',
          price: item.rate || 0,
          image: '',
          quantity: item.quantity || 1
        })) || [],
        restaurant: {
          id: order.restaurant_id?.toString(),
          name: order.restaurant_name || 'Restaurant',
          location: 'Restaurant Location',
          rating: 4.1,
          timeRange: '60-65 mins',
          discount: '20% OFF',
          image: order.restaurant_cover_images?.[0]?.document || ''
        },
        orderData: order
      } 
    });
  };

  const handleOrdersTabClick = () => {
    setActiveTab('orders');
    if (!isExternalScan && orders.length === 0 && !ordersLoading) {
      fetchOrders();
    }
  };

  const formatOrderDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
      });
    }
  };

  const getTotalItemsCount = (items: FoodOrder['items']) => {
    return items?.reduce((total, item) => total + (item.quantity || 0), 0) || 0;
  };

  const getStatusMessage = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('pending') || lowerStatus.includes('waiting')) {
      return 'Your Order is being prepared';
    } else if (lowerStatus.includes('accepted') || lowerStatus.includes('approved') || lowerStatus.includes('confirmed')) {
      return 'Your Order has been accepted';
    } else if (lowerStatus.includes('preparing') || lowerStatus.includes('cooking')) {
      return 'Your Order is being prepared';
    } else if (lowerStatus.includes('ready') || lowerStatus.includes('prepared')) {
      return 'Your Order is ready';
    } else if (lowerStatus.includes('delivery') || lowerStatus.includes('transit')) {
      return 'Your Order is on the way';
    } else if (lowerStatus.includes('delivered') || lowerStatus.includes('completed')) {
      return 'Your Order has been delivered';
    } else if (lowerStatus.includes('cancelled') || lowerStatus.includes('rejected')) {
      return 'Your Order was cancelled';
    } else {
      return `Order status: ${status}`;
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
              onClick={handleOrdersTabClick}
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
            {restaurants.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Restaurants Available</h3>
                <p className="text-gray-500">There are no restaurants available at this location.</p>
              </div>
            ) : (
              <>
                {/* Restaurant count header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Available Restaurants ({restaurants.length})
                  </h2>
                </div>
                
                {/* Restaurants List */}
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
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
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
              </>
            )}
          </div>
        )}

        {activeTab === 'orders' && !isExternalScan && (
          <div className="space-y-4">
            {ordersLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading orders...</p>
              </div>
            ) : ordersError ? (
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">⚠️</div>
                <p className="text-red-500 mb-4">{ordersError}</p>
                <button 
                  onClick={fetchOrders}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                <p className="text-gray-500">You haven't placed any orders yet.</p>
              </div>
            ) : (
              orders.map((order) => (
                <div 
                  key={order.id} 
                  className="bg-[#E8E2D3] rounded-xl p-4 cursor-pointer transition-transform hover:scale-[1.02]"
                  onClick={() => handleOrderClick(order)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {order.restaurant_name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Order #{order.id}
                      </p>
                    </div>
                    <div 
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: order.order_status_color || '#D946EF',
                        color: 'white'
                      }}
                    >
                      {order.order_status}
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 text-sm">
                    <Package className="w-4 h-4 mr-2" />
                    <span>{getStatusMessage(order.order_status)}</span>
                    <span className="ml-auto text-gray-500">
                      {formatOrderDate(order.created_at)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};