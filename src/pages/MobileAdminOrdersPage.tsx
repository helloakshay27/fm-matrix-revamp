import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, RefreshCw, Eye, Filter, User } from 'lucide-react';
import { restaurantApi } from '../services/restaurantApi';
import type { AdminOrder, AdminOrdersResponse, Restaurant } from '../services/restaurantApi';

export const MobileAdminOrdersPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [hasMore, setHasMore] = useState(true);
  
  // Use ref to avoid stale closure issues with currentPage
  const currentPageRef = useRef(1);

  // Get auth token and restaurant from sessionStorage or URL params
  const token = searchParams.get('token') || sessionStorage.getItem('token') || '';
  const defaultRestaurantId = sessionStorage.getItem('facility_id') || 
                              sessionStorage.getItem('restaurant_id') || 
                              searchParams.get('restaurant_id') || '';

  // Store token in sessionStorage if passed via URL
  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken && urlToken !== sessionStorage.getItem('token')) {
      sessionStorage.setItem('token', urlToken);
    }
  }, [searchParams]);


  const loadRestaurants = useCallback(async () => {
    try {
      const response = await restaurantApi.getRestaurantsByToken(token);
      if (response.success && response.restaurants) {
        setRestaurants(response.restaurants);
        if (!selectedRestaurant && defaultRestaurantId) {
          setSelectedRestaurant(defaultRestaurantId);
        } else if (!selectedRestaurant && response.restaurants.length > 0) {
          setSelectedRestaurant(response.restaurants[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading restaurants:', error);
    }
  }, [token, selectedRestaurant, defaultRestaurantId]);

  const loadOrders = useCallback(async (isRefresh = false, isLoadMore = false) => {
    if (!token || !selectedRestaurant) {
      console.log('⚠️ loadOrders: Missing token or restaurant', { token: !!token, selectedRestaurant });
      return;
    }
    
    console.log('📋 loadOrders called:', { isRefresh, isLoadMore, currentPage: currentPageRef.current, selectedRestaurant });
    
    if (isRefresh) {
      setRefreshing(true);
      currentPageRef.current = 1;
      setCurrentPage(1);
    } else if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const pageToLoad = isRefresh ? 1 : (isLoadMore ? currentPageRef.current + 1 : currentPageRef.current);
      console.log('🔄 Loading page:', pageToLoad);
      
      const response: AdminOrdersResponse = await restaurantApi.getAdminOrders(
        token,
        selectedRestaurant,
        pageToLoad
      );
      
      console.log('📋 Orders response:', {
        page: pageToLoad,
        ordersCount: response.food_orders?.length || 0,
        totalPages: response.total_pages,
        isRefresh,
        isLoadMore
      });
      
      if (isRefresh) {
        // Reset to first page data
        setOrders(response.food_orders || []);
        currentPageRef.current = 1;
        setCurrentPage(1);
        console.log('🔄 Orders reset to page 1');
      } else if (isLoadMore) {
        // Append new data to existing orders
        setOrders(prev => {
          const newOrders = [...prev, ...(response.food_orders || [])];
          console.log('➕ Orders appended:', { 
            previousCount: prev.length, 
            newCount: response.food_orders?.length || 0,
            totalCount: newOrders.length 
          });
          return newOrders;
        });
        currentPageRef.current = pageToLoad;
        setCurrentPage(pageToLoad);
      } else {
        // Initial load
        setOrders(response.food_orders || []);
        currentPageRef.current = pageToLoad;
        setCurrentPage(pageToLoad);
        console.log('🆕 Initial orders loaded');
      }
      
      setTotalPages(response.total_pages || 1);
      setHasMore(pageToLoad < (response.total_pages || 1));
      console.log('📊 Pagination state:', { 
        currentPage: pageToLoad, 
        totalPages: response.total_pages, 
        hasMore: pageToLoad < (response.total_pages || 1) 
      });
    } catch (error) {
      console.error('❌ Error loading orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [token, selectedRestaurant]);

  // Handle infinite scroll - similar to asset list implementation
  const handleScroll = useCallback(() => {
    if (!hasMore || loadingMore || loading) {
      console.log('🚫 Scroll ignored:', { hasMore, loadingMore, loading });
      return;
    }

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    const distanceFromBottom = documentHeight - (scrollTop + windowHeight);
    console.log('📏 Scroll position:', { 
      scrollTop: Math.round(scrollTop), 
      windowHeight, 
      documentHeight, 
      distanceFromBottom: Math.round(distanceFromBottom) 
    });
    
    // Load more when user is 100px from bottom
    if (scrollTop + windowHeight >= documentHeight - 100) {
      console.log('🔄 Triggering load more!');
      loadOrders(false, true);
    }
  }, [hasMore, loadingMore, loading, loadOrders]);

  useEffect(() => {
    if (token) {
      loadRestaurants();
    }
  }, [token, loadRestaurants]);

  useEffect(() => {
    if (selectedRestaurant || defaultRestaurantId) {
      loadOrders();
    }
  }, [selectedRestaurant, defaultRestaurantId, loadOrders]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleStatusChange = async (orderId: number, statusId: string, statusName: string) => {
    setUpdatingStatus(orderId);
    try {
      // Get the current token from sessionStorage
      const currentToken = sessionStorage.getItem('token') || token;
      console.log('🔄 Updating order status:', { orderId, statusId, statusName, token: !!currentToken });
      
      const result = await restaurantApi.updateOrderStatus(orderId.toString(), statusId, "", currentToken);
      if (result.success) {
        // Update the order status locally
        setOrders(prev => prev.map(order => 
          order.id === orderId 
            ? { ...order, status_name: statusName }
            : order
        ));
        console.log('✅ Status updated successfully');
      } else {
        console.error('❌ Status update failed:', result.message);
        alert(result.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('❌ Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (statusName: string, colorCode?: string) => {
    return colorCode || '#6b7280';
  };

  const formatDate = (dateString: string) => {
    try {
      // Handle different date formats
      let date: Date;
      
      // Check if it's in DD/MM/YYYY HH:MM AM/PM format
      if (dateString.includes('/') && dateString.includes(' ')) {
        const [datePart, timePart] = dateString.split(' ');
        const [day, month, year] = datePart.split('/');
        
        // Convert to standard format for parsing
        const standardFormat = `${month}/${day}/${year} ${timePart}`;
        date = new Date(standardFormat);
      } else {
        // Standard ISO format or other formats
        date = new Date(dateString);
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString; // Return original if parsing fails
      }
      
      // Format as: "Aug 3, 2025 at 12:15 AM"
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) + ' at ' + date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString; // Return original if any error occurs
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F6F4EE' }}>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to access admin orders</p>
          <button
            onClick={() => navigate('/mobile')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F6F4EE' }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {/* <ArrowLeft className="w-5 h-5 text-gray-600" /> */}
            </button>
            <h1 className="text-lg font-semibold text-gray-800">Orders</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                // Reset all pagination state and refresh
                currentPageRef.current = 1;
                setCurrentPage(1);
                setHasMore(true);
                loadOrders(true);
              }}
              disabled={refreshing}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'text-[#4B003F] animate-spin' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Restaurant Filter */}
      {restaurants.length > 1 && (
        <div className="bg-white border-b p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Restaurant
          </label>
          <select
            value={selectedRestaurant}
            onChange={(e) => {
              setSelectedRestaurant(e.target.value);
              setCurrentPage(1);
              currentPageRef.current = 1;
              setHasMore(true);
              setOrders([]); // Clear existing orders when switching restaurants
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Select Restaurant"
          >
            {restaurants.map((restaurant) => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Orders List */}
      <div className="p-4 space-y-4">
        {/* Debug Info - Remove this after testing */}
        {/* <div className="bg-blue-50 p-2 rounded text-xs text-blue-800">
          Orders: {orders.length} | Page: {currentPage}/{totalPages} | HasMore: {hasMore ? 'Yes' : 'No'} | Loading: {loadingMore ? 'Yes' : 'No'}
        </div> */}
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4B003F] mx-auto"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No Orders Found</h3>
            <p className="text-gray-600">No orders available for the selected restaurant.</p>
          </div>
        ) : (
          <>
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="rounded-lg border p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow" 
                style={{ backgroundColor: '#E8E2D3' }}
                onClick={() => navigate(`/mobile/admin/orders/${order.id}`, {
                  state: { order, token, restaurantId: selectedRestaurant }
                })}
              >
                {/* Order Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{order.restaurant_name}</h3>
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={order.statuses?.find(s => s.name === order.status_name)?.id || ''}
                          onChange={(e) => {
                            const selectedStatus = order.statuses?.find(s => s.id.toString() === e.target.value);
                            if (selectedStatus) {
                              handleStatusChange(order.id, selectedStatus.id.toString(), selectedStatus.name);
                            }
                          }}
                          disabled={
                            updatingStatus === order.id || 
                            order.status_name?.toLowerCase().includes('cancelled') ||
                            order.status_name?.toLowerCase().includes('canceled')
                          }
                          className={`appearance-none text-xs rounded-full text-white font-medium border-none outline-none px-3 py-1 pr-6 ${
                            updatingStatus === order.id || 
                            order.status_name?.toLowerCase().includes('cancelled') ||
                            order.status_name?.toLowerCase().includes('canceled')
                              ? 'opacity-50 cursor-not-allowed' 
                              : 'cursor-pointer'
                          }`}
                          style={{ 
                            backgroundColor: getStatusColor(order.status_name, 
                              order.statuses?.find(s => s.name === order.status_name)?.color_code) 
                          }}
                          aria-label={`Change status for order ${order.id}`}
                        >
                          {order.statuses?.map((status) => (
                            <option key={status.id} value={status.id} className="text-gray-800 bg-white">
                              {status.display || status.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className={`absolute right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 text-white pointer-events-none ${
                          order.status_name?.toLowerCase().includes('cancelled') ||
                          order.status_name?.toLowerCase().includes('canceled')
                            ? 'opacity-50' 
                            : ''
                        }`} />
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Order #{order.id}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <User className="w-4 h-4 mr-1" />
                      {order.created_by}
                    </div>
                    {order.meeting_room && (
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <div className="w-4 h-4 mr-1 flex items-center justify-center">
                          <span className="text-xs">🏢</span>
                        </div>
                        {order.meeting_room}
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      {formatDate(order.created_at)}
                    </div>
                  </div>
                </div>

                {updatingStatus === order.id && (
                  <div className="flex items-center space-x-2 mt-2">
                    <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                    <span className="text-sm text-blue-600">Updating status...</span>
                  </div>
                )}
                
                {/* Cancelled Status Notice */}
                {(order.status_name?.toLowerCase().includes('cancelled') || 
                  order.status_name?.toLowerCase().includes('canceled')) && (
                  <div className="flex items-center space-x-2 mt-2">
                    {/* <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">!</span>
                    </div> */}
                    {/* <span className="text-sm text-red-600">Status cannot be changed - Order is cancelled</span> */}
                  </div>
                )}
              </div>
            ))}
            
            {/* Loading More Indicator */}
            {loadingMore && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4B003F] mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading more orders...</p>
              </div>
            )}
            
            {/* End of Results */}
            {!hasMore && orders.length > 0 && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No more orders to load</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
