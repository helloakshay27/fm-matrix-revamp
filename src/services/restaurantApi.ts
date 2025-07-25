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
      // Return mock data for now
      return [
        {
          id: '1',
          name: 'The Bawa Kitchen',
          location: 'Andheri West',
          rating: 4.1,
          timeRange: '60-65 mins',
          discount: '20% OFF',
          image: '/placeholder.svg',
          menuItems: [
            {
              id: '1',
              name: 'Chicken Noodles',
              description: 'Noodles + Manchurian + Sauces',
              price: 250,
              image: '/placeholder.svg'
            },
            {
              id: '2',
              name: 'Veggie Burger',
              description: 'Plant-based patty + Lettuce + Tomato',
              price: 180,
              image: '/placeholder.svg'
            },
            {
              id: '3',
              name: 'Grilled Salmon',
              description: 'Salmon fillet + Garlic butter + Lemon',
              price: 450,
              image: '/placeholder.svg'
            },
            {
              id: '4',
              name: 'Spicy Tacos',
              description: 'Chicken + Spices + Fresh salsa',
              price: 220,
              image: '/placeholder.svg'
            }
          ]
        }
      ];
    }
  },

  // Get restaurant details by ID
  async getRestaurantById(restaurantId: string): Promise<Restaurant> {
    try {
      const response = await apiClient.get(`/pms/admin/restaurants/${restaurantId}.json`);
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
      throw new Error('Failed to fetch restaurant details');
    }
  },

  // Get menu items for a restaurant
  async getMenuItems(restaurantId: string): Promise<MenuItem[]> {
    try {
      const response = await apiClient.get(`/pms/admin/restaurants/${restaurantId}/menu_items.json`);
      return response.data;
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