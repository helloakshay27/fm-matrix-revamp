import React, { useState, useEffect } from 'react';
import { Eye, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { fetchRestaurantOrders, fetchRestaurants } from '@/store/slices/f&bSlice';
import { Loader2 } from 'lucide-react';

interface RecentOrder {
  id: number;
  restaurant_name: string;
  created_at: string;
  total_amount: number;
  status_name: string;
  restaurant_id: number;
}

export const RecentOrdersSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try { return localStorage.getItem("sidebarCollapsed") === "true"; } catch { return false; }
  });

  useEffect(() => {
    const fetchRecentOrders = async () => {
      if (!baseUrl || !token) return;
      
      setLoading(true);
      try {
        // First get the first restaurant ID
        const restaurantsResponse = await dispatch(fetchRestaurants({ baseUrl, token })).unwrap();
        const firstRestaurantId = restaurantsResponse[0]?.id;
        
        if (firstRestaurantId) {
          // Fetch recent orders (first page, 5 items)
          const ordersResponse = await dispatch(fetchRestaurantOrders({
            baseUrl,
            token,
            id: Number(firstRestaurantId),
            pageSize: 5,
            currentPage: 1,
            all: true,
          })).unwrap();
          
          setRecentOrders(ordersResponse.food_orders?.slice(0, 5) || []);
        }
      } catch (error) {
        console.error('Error fetching recent orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentOrders();
  }, [dispatch, baseUrl, token]);

  const handleViewOrder = (order: RecentOrder) => {
    navigate(`/vas/fnb/details/${order.restaurant_id}/restaurant-order/${order.id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const currency = localStorage.getItem('currency') || '₹';

  return (
    <div
      className="bg-white border flex flex-col transition-all duration-300"
      style={{
        boxShadow: "0px 4px 14.2px 0px #0000001A",
        width: isCollapsed ? 48 : 350,
        minWidth: isCollapsed ? 48 : 350,
        maxWidth: isCollapsed ? 48 : 350,
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-3 py-3 border-b border-gray-100 flex-shrink-0 ${isCollapsed ? "flex-col gap-2" : ""}`}>
        {!isCollapsed && (
          <h3 className="text-base font-semibold" style={{ color: "#c72030" }}>Recent Orders</h3>
        )}
        <button
          onClick={() => setIsCollapsed((v) => {
            const next = !v;
            try { localStorage.setItem("sidebarCollapsed", String(next)); } catch {}
            return next;
          })}
          title={isCollapsed ? "Expand" : "Collapse"}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Collapsed vertical label */}
      {isCollapsed && (
        <div className="flex-1 flex items-center justify-center">
          <span
            className="text-xs font-semibold tracking-widest"
            style={{ writingMode: "vertical-rl", color: "#c72030", transform: "rotate(180deg)" }}
          >
            Recent Orders
          </span>
        </div>
      )}

      {!isCollapsed && (
      <div className="flex-1 space-y-4 overflow-y-auto p-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        )}

        {!loading && recentOrders.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-gray-600">No recent orders found</div>
          </div>
        )}

        {!loading && recentOrders.map((order) => (
          <div key={order.id} className="bg-white border border-[#C4B89D]/40 rounded-lg p-4">
            {/* Order ID and Restaurant */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-[#C72030]" />
                <span className="font-semibold text-gray-500 text-sm">Order #{order.id}</span>
              </div>
            </div>
            
            <div className="mb-3">
              <h3 className="font-semibold text-gray-900 text-sm leading-[14px]">{order.restaurant_name}</h3>
            </div>

            {/* Date and Time */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-medium text-gray-700 min-w-[80px]">Date:</span>
              <span className="text-sm text-gray-700">:</span>
              <span className="text-sm text-gray-900">{formatDate(order.created_at)}</span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-medium text-gray-700 min-w-[80px]">Time:</span>
              <span className="text-sm text-gray-700">:</span>
              <span className="text-sm text-gray-900">{formatTime(order.created_at)}</span>
            </div>

            {/* Amount */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-medium text-gray-700 min-w-[80px]">Amount:</span>
              <span className="text-sm text-gray-700">:</span>
              <span className="text-sm font-semibold text-gray-900">{currency} {order.total_amount}</span>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-medium text-gray-700 min-w-[80px]">Status:</span>
              <span className="text-sm text-gray-700">:</span>
              <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                {order.status_name}
              </span>
            </div>

            {/* Action Button */}
            <div className="flex items-center justify-end gap-4">
              <button
                className="flex items-center gap-1 text-sm font-medium underline text-[#C72030] hover:opacity-80"
                onClick={() => handleViewOrder(order)}
              >
                <Eye className="h-[24px] w-[24px]" color="#C72030" />
              </button>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};


