import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, User, Star, Tag } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { restaurantApi, FoodOrder, RestaurantsBySiteResponse, RestaurantBysite, Restaurant } from '@/services/restaurantApi';

interface Order {
  id: string;
  itemName: string;
  restaurantName: string;
  status: string; // Changed to string to accept any status from API
  statusColor: string; // Added for dynamic status color
  statusMessage: string;
  timeAgo: string;
  totalAmount: number;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  restaurantId: string;
  orderQrCode?: string;
}

// Helper function to convert FoodOrder to Order format
const convertFoodOrderToOrder = (foodOrder: FoodOrder): Order => {
  // Get the first item's name as the main item (or combine multiple items)
  const itemNames = foodOrder.items.map(item => item.menu_name);
  const itemName = itemNames.length > 1 
    ? `${itemNames[0]} +${itemNames.length - 1} more`
    : itemNames[0] || 'Unknown Item';

  // Calculate time ago
  const createdAt = new Date(foodOrder.created_at);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60));
  const timeAgo = diffInMinutes < 60 
    ? `${diffInMinutes} min. Ago`
    : `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`;

  // Use actual API status instead of mapping
  const status = foodOrder.order_status || 'Pending';
  const statusColor = foodOrder.order_status_color || '#6b7280'; // Default gray color

  // Create status message based on actual status
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

  const statusMessage = getStatusMessage(status);

  return {
    id: foodOrder.id.toString(),
    itemName,
    restaurantName: foodOrder.restaurant_name,
    status,
    statusColor,
    statusMessage,
    timeAgo,
    totalAmount: foodOrder.total_amount || 0,
    items: foodOrder.items.map(item => ({
      id: item.id.toString(),
      name: item.menu_name,
      quantity: item.quantity,
      price: item.rate || 0,
    })),
    restaurantId: foodOrder.restaurant_id.toString(),
    orderQrCode: foodOrder.order_qr_code,
  };
};

export const MobileOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'restaurant' | 'orders'>('restaurant'); // Default to restaurant for external users
  const [orders, setOrders] = useState<Order[]>([]);
  const [restaurants, setRestaurants] = useState<RestaurantBysite[]>([]);
  const [loading, setLoading] = useState(true);
  const [restaurantLoading, setRestaurantLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get facility ID from URL params or localStorage (for app users)
  const facilityId = searchParams.get('facilityId') || localStorage.getItem('currentFacilityId');
  
  // Check if user is from external scan
  const sourceParam = searchParams.get('source');
  const isExternalScan = sourceParam === 'external';

  // Set default tab based on user type
  useEffect(() => {
    console.log("🔍 MOBILE ORDERS PAGE - EXTERNAL DETECTION:");
    console.log("  - sourceParam:", sourceParam);
    console.log("  - isExternalScan:", isExternalScan);
    console.log("  - facilityId:", facilityId);
    
    if (isExternalScan) {
      console.log("👤 EXTERNAL USER: Setting restaurant tab as default");
      setActiveTab('restaurant'); // External users see restaurant tab by default
    } else {
      console.log("📱 INTERNAL USER: Setting orders tab as default");
      setActiveTab('orders'); // App users see orders tab by default
    }
  }, [isExternalScan, sourceParam, facilityId]);

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get current user from localStorage
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        const userId = user?.id?.toString();
        
        console.log("🔍 FETCHING ORDERS for user:", userId);
        
        const foodOrders = await restaurantApi.getUserOrders(userId);
        console.log("📦 RECEIVED ORDERS:", foodOrders);
        
        // Convert to Order format and sort by created_at (newest first)
        const convertedOrders = foodOrders
          .map(convertFoodOrderToOrder)
          .sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());
        
        setOrders(convertedOrders);
      } catch (err) {
        console.error("❌ ERROR FETCHING ORDERS:", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchRestaurants = async () => {
      try {
        setRestaurantLoading(true);
        setError(null);
        
        if (facilityId) {
          console.log("🔍 FETCHING RESTAURANTS for facility:", facilityId);
          
          // Get facility setup to get site_id
          const facilityResponse = await restaurantApi.getFacilitySetup(facilityId);
          const siteId = facilityResponse.facility_setup.site_id;
          
          console.log("📍 SITE ID:", siteId);
          
          // Get restaurants by site_id
          const restaurantsResponse = await restaurantApi.getRestaurantsBySite(siteId);
          const restaurantsList = restaurantsResponse.restaurants || [];
          
          console.log("🍽️ RESTAURANTS FOUND:", restaurantsList.length);
          setRestaurants(restaurantsList);
        } else {
          // For app users without facilityId, use token-based approach
          console.log("📱 APP USER: fetching restaurants by token");
          const token = sessionStorage.getItem('authToken');
          
          if (token) {
            const tokenResponse = await restaurantApi.getRestaurantsByToken(token);
            if (tokenResponse.success && tokenResponse.restaurants) {
              // Convert Restaurant[] to RestaurantBysite[] format
              const convertedRestaurants: RestaurantBysite[] = tokenResponse.restaurants.map(restaurant => ({
                id: parseInt(restaurant.id),
                name: restaurant.name,
                location: restaurant.location,
                rating: restaurant.rating,
                delivery_time: restaurant.timeRange,
                discount: restaurant.discount,
                cover_image: restaurant.image,
                cover_images: restaurant.images?.map((img, index) => ({
                  id: index,
                  relation: 'restaurant',
                  relation_id: parseInt(restaurant.id),
                  document: img
                }))
              }));
              
              console.log("🍽️ TOKEN RESTAURANTS FOUND:", convertedRestaurants.length);
              setRestaurants(convertedRestaurants);
            } else {
              setError("No restaurants available for your location");
            }
          } else {
            setError("Please log in to view restaurants");
          }
        }
      } catch (err) {
        console.error("❌ ERROR FETCHING RESTAURANTS:", err);
        setError("Failed to load restaurants. Please try again.");
      } finally {
        setRestaurantLoading(false);
      }
    };

    if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'restaurant') {
      fetchRestaurants();
    }
  }, [activeTab, facilityId]);

  // Standalone fetchRestaurants for retry button
  const fetchRestaurants = async () => {
    try {
      setRestaurantLoading(true);
      setError(null);
      
      if (facilityId) {
        console.log("🔍 FETCHING RESTAURANTS for facility:", facilityId);
        
        // Get facility setup to get site_id
        const facilityResponse = await restaurantApi.getFacilitySetup(facilityId);
        const siteId = facilityResponse.facility_setup.site_id;
        
        console.log("📍 SITE ID:", siteId);
        
        // Get restaurants by site_id
        const restaurantsResponse = await restaurantApi.getRestaurantsBySite(siteId);
        const restaurantsList = restaurantsResponse.restaurants || [];
        
        console.log("🍽️ RESTAURANTS FOUND:", restaurantsList.length);
        setRestaurants(restaurantsList);
      } else {
        // For app users without facilityId, use token-based approach
        console.log("📱 APP USER: fetching restaurants by token");
        const token = localStorage.getItem('authToken');
        
        if (token) {
          const tokenResponse = await restaurantApi.getRestaurantsByToken(token);
          if (tokenResponse.success && tokenResponse.restaurants) {
            // Convert Restaurant[] to RestaurantBysite[] format
            const convertedRestaurants: RestaurantBysite[] = tokenResponse.restaurants.map(restaurant => ({
              id: parseInt(restaurant.id),
              name: restaurant.name,
              location: restaurant.location,
              rating: restaurant.rating,
              delivery_time: restaurant.timeRange,
              discount: restaurant.discount,
              cover_image: restaurant.image,
              cover_images: restaurant.images?.map((img, index) => ({
                id: index,
                relation: 'restaurant',
                relation_id: parseInt(restaurant.id),
                document: img
              }))
            }));
            
            console.log("🍽️ TOKEN RESTAURANTS FOUND:", convertedRestaurants.length);
            setRestaurants(convertedRestaurants);
          } else {
            setError("No restaurants available for your location");
          }
        } else {
          setError("Please log in to view restaurants");
        }
      }
    } catch (err) {
      console.error("❌ ERROR FETCHING RESTAURANTS:", err);
      setError("Failed to load restaurants. Please try again.");
    } finally {
      setRestaurantLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleOrderClick = (orderId: string) => {
    // Find the order to get its details
    const order = orders.find(o => o.id === orderId);
    if (order) {
      // Create mock data to match order review format using real order data
      const mockItems = order.items.map(item => ({
        id: item.id,
        name: item.name,
        description: 'Food item',
        price: item.price > 0 ? item.price : 0,
        image: '',
        quantity: item.quantity
      }));
      
      const mockRestaurant = {
        id: order.restaurantId,
        name: order.restaurantName,
        location: 'Restaurant Location',
        rating: 4.1,
        timeRange: '60-65 mins',
        discount: '20% OFF',
        image: ''
      };
      
      // Navigate to order review page with order data and flag indicating it's already placed
      navigate(`/mobile/restaurant/${order.restaurantId}/order-review`, {
        state: {
          items: mockItems,
          restaurant: mockRestaurant,
          note: 'Previous order details',
          isExistingOrder: true,
          totalPrice: order.totalAmount,
          totalItems: order.items.reduce((sum, item) => sum + item.quantity, 0),
          orderData: { id: order.id }
        }
      });
    }
  };

  const handleRestaurantTab = () => {
    setActiveTab('restaurant');
    // Don't navigate away, just switch tabs
  };

  const handleRestaurantClick = (restaurant: RestaurantBysite) => {
    // Navigate to restaurant details with facility ID
    const sourceParam = facilityId ? 'external' : 'app';
    navigate(`/mobile/restaurant/${restaurant.id}/details?source=${sourceParam}&facilityId=${facilityId}`);
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
            className={`${isExternalScan ? 'w-full' : 'flex-1'} py-4 px-4 text-center font-medium ${
              activeTab === 'restaurant'
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-500'
            }`}
          >
            Restaurant
          </button>
          {!isExternalScan && (
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
          )}
        </div>
      </div>

      {/* Orders List - Only show for internal users */}
      {activeTab === 'orders' && !isExternalScan && (
        <div className="p-4">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <span className="ml-2 text-gray-600">Loading orders...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-600 text-center">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 w-full bg-red-600 text-white py-2 rounded-lg text-sm"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No orders found</p>
              <p className="text-gray-400 text-sm mt-2">Your food orders will appear here</p>
              <button
                onClick={() => setActiveTab('restaurant')}
                className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg"
              >
                Order Now
              </button>
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <div className="space-y-3">
              {orders.map((order) => (
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
                      {order.totalAmount > 0 && (
                        <p className="text-gray-800 font-medium text-sm mt-1">
                          ₹{order.totalAmount}
                        </p>
                      )}
                    </div>
                    <span
                      className="px-3 py-1 rounded text-sm font-medium text-white"
                      style={{ backgroundColor: order.statusColor }}
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
      )}

      {/* Restaurant List */}
      {activeTab === 'restaurant' && (
        <div className="p-4">
          {restaurantLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <span className="ml-2 text-gray-600">Loading restaurants...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-600 text-center">{error}</p>
              <button
                onClick={() => fetchRestaurants()}
                className="mt-2 w-full bg-red-600 text-white py-2 rounded-lg text-sm"
              >
                Retry
              </button>
            </div>
          )}

          {!restaurantLoading && !error && restaurants.length === 0 && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🍽️</div>
              <p className="text-gray-500 text-lg">No restaurants available</p>
              <p className="text-gray-400 text-sm mt-2">There are no restaurants at this location</p>
            </div>
          )}

          {!restaurantLoading && !error && restaurants.length > 0 && (
            <div className="space-y-4">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  onClick={() => handleRestaurantClick(restaurant)}
                  className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                >
                  {/* Restaurant Image */}
                  <div className="aspect-video bg-gray-200 relative">
                    <img
                      src={restaurant.cover_image || restaurant.cover_images?.[0]?.document || '/placeholder.svg'}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    {/* Rating Badge */}
                    <div className="absolute top-2 right-2 bg-orange-200 px-2 py-1 rounded flex items-center">
                      <span className="text-sm font-medium text-gray-900">{restaurant.rating || 4.1}</span>
                      <Star className="w-3 h-3 ml-1 text-gray-900" />
                    </div>
                  </div>

                  {/* Restaurant Details */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {restaurant.name}
                    </h3>
                    
                    <div className="flex items-center text-gray-600 mb-2">
                      <span className="text-sm">{restaurant.location || 'Location not specified'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-sm">{restaurant.delivery_time || '30-45 mins'}</span>
                      </div>
                      
                      {restaurant.discount && (
                        <div className="flex items-center text-red-600">
                          <Tag className="w-4 h-4 mr-1" />
                          <span className="text-sm font-medium">{restaurant.discount}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};