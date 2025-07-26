import { apiClient } from '@/utils/apiClient';

export interface Restaurant {
  id: string;
  name: string;
  location: string;
  rating: number;
  timeRange: string;
  discount: string;
  image: string;
  menuItems?: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity?: number;
}

export interface OrderRequest {
  restaurantId: string;
  items: {
    id: string;
    quantity: number;
  }[];
  note?: string;
  contactDetails?: {
    contactNumber: string;
    name: string;
    email: string;
  };
}

export interface Order {
  id: string;
  orderId: string;
  restaurantId: string;
  status: string;
  items: MenuItem[];
  totalAmount: number;
  customerName: string;
  contactNumber: string;
  deliveryLocation: string;
  note?: string;
  createdAt: string;
}

export const restaurantApi = {
  // Get restaurants by site ID
  async getRestaurantsBySite(siteId: string): Promise<Restaurant[]> {
    try {
      const response = await apiClient.get(`/pms/admin/restaurants/get_restaurants_by_site.json?site_id=${siteId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      throw new Error('Failed to fetch restaurants');
    }
  },

  // Get restaurant details by ID
  async getRestaurantById(restaurantId: string): Promise<Restaurant> {
    try {
      const response = await apiClient.get(`/pms/admin/restaurants/${restaurantId}.json`);
      const restaurant = response.data;
      
      // Transform API response to match our interface
      const menuItems = restaurant.restaurant_menu ? restaurant.restaurant_menu.map((item: any) => ({
        id: item.id?.toString() || Math.random().toString(),
        name: item.name || 'Unknown Item',
        description: item.description || '',
        price: parseFloat(item.display_price || item.master_price) || 0,
        image: item.images && item.images.length > 0 ? item.images[0] : '/placeholder.svg',
        quantity: 0
      })) : [];

      return {
        id: restaurant.id?.toString() || restaurantId,
        name: restaurant.name || 'Unknown Restaurant',
        location: restaurant.address || restaurant.location || 'Unknown Location',
        rating: restaurant.rating || 4.0,
        timeRange: restaurant.delivery_time || '30-40 mins',
        discount: restaurant.discount || '10% OFF',
        image: restaurant.image_url || restaurant.image || '/placeholder.svg',
        menuItems
      };
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
      throw new Error('Failed to fetch restaurant details');
    }
  },

  // Get menu items for a restaurant
  async getMenuItems(restaurantId: string): Promise<MenuItem[]> {
    try {
      const response = await apiClient.get(`/pms/admin/restaurants/${restaurantId}/menu_items.json`);
      const menuItems = response.data;
      
      // Transform menu items to match our interface
      return menuItems.map((item: any) => ({
        id: item.id?.toString() || Math.random().toString(),
        name: item.name || 'Unknown Item',
        description: item.description || '',
        price: parseFloat(item.price) || 0,
        image: item.image_url || item.image || '/placeholder.svg',
        quantity: 0
      }));
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw new Error('Failed to fetch menu items');
    }
  },

  // Place an order
  async placeOrder(orderData: OrderRequest): Promise<Order> {
    try {
      const response = await apiClient.post('/pms/admin/restaurant_orders.json', orderData);
      return response.data;
    } catch (error) {
      console.error('Error placing order:', error);
      throw new Error('Failed to place order');
    }
  },

  // Get user orders
  async getUserOrders(userId?: string): Promise<Order[]> {
    try {
      const response = await apiClient.get('/pms/admin/restaurant_orders.json', {
        params: userId ? { user_id: userId } : {}
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw new Error('Failed to fetch orders');
    }
  },

  // Get order details by ID
  async getOrderById(orderId: string): Promise<Order> {
    try {
      const response = await apiClient.get(`/pms/admin/restaurant_orders/${orderId}.json`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw new Error('Failed to fetch order details');
    }
  }
};