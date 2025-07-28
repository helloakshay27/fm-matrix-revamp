import { useAppDispatch } from '@/store/hooks';
import { AppDispatch } from '@/store/store';
import { 
  fetchRestaurants, 
  fetchRestaurantDetails, 
  fetchMenu, 
  fetchRestaurantOrders,
  createMenu,
  editRestaurant 
} from '@/store/slices/f&bSlice';

export interface MobileRestaurant {
  id: number;
  name: string;
  address: string;
  cuisines: string;
  cost_for_two: number;
  delivery_time: number;
  delivery_charge: number;
  min_amount: number;
  contact1: string;
  pure_veg: boolean;
  alcohol: boolean;
  wheelchair: boolean;
  cod: boolean;
  can_order_today: boolean;
  timings: string;
  timings_today: string;
  rating: number;
  status: boolean;
  active: boolean;
}

export interface MobileMenuItem {
  id: number;
  name: string;
  description: string;
  master_price: number;
  discounted_amount: number;
  veg_menu: boolean;
  stock: number | null;
  quantity?: number;
  category_id: number;
  restaurant_id: number;
}

export interface MobileFoodOrder {
  id: number;
  order_id: string;
  restaurant_id: number;
  customer_name: string;
  contact_number: string;
  email: string;
  delivery_address: string;
  total_amount: number;
  status: string;
  special_instructions?: string;
  created_at: string;
  order_items: MobileOrderItem[];
}

export interface MobileOrderItem {
  id: number;
  menu_item_id: number;
  quantity: number;
  price: number;
  menu_item: MobileMenuItem;
}

export interface CreateOrderRequest {
  restaurant_id: number;
  customer_name: string;
  contact_number: string;
  email: string;
  delivery_address: string;
  special_instructions?: string;
  order_items: {
    menu_item_id: number;
    quantity: number;
    price: number;
  }[];
}

export class MobileRestaurantService {
  private dispatch: AppDispatch;
  private baseUrl: string;
  private token: string;

  constructor(dispatch: AppDispatch) {
    this.dispatch = dispatch;
    this.baseUrl = 'https://fm-uat-api.lockated.com';
    this.token = localStorage.getItem('token') || '';
  }

  // Fetch all restaurants
  async getAllRestaurants(): Promise<MobileRestaurant[]> {
    try {
      const response = await this.dispatch(fetchRestaurants({ 
        baseUrl: this.baseUrl, 
        token: this.token 
      })).unwrap();
      return response;
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      throw new Error('Failed to fetch restaurants');
    }
  }

  // Fetch restaurant details by ID
  async getRestaurantById(id: string): Promise<MobileRestaurant> {
    try {
      const response = await this.dispatch(fetchRestaurantDetails({ 
        baseUrl: this.baseUrl, 
        token: this.token, 
        id 
      })).unwrap();
      return response;
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
      throw new Error('Failed to fetch restaurant details');
    }
  }

  // Fetch menu items for a restaurant
  async getMenuItems(restaurantId: string): Promise<MobileMenuItem[]> {
    try {
      const response = await this.dispatch(fetchMenu({ 
        baseUrl: this.baseUrl, 
        token: this.token, 
        id: parseInt(restaurantId)
      })).unwrap();
      return response;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw new Error('Failed to fetch menu items');
    }
  }

  // Fetch restaurant orders
  async getRestaurantOrders(restaurantId: string): Promise<MobileFoodOrder[]> {
    try {
      const response = await this.dispatch(fetchRestaurantOrders({ 
        baseUrl: this.baseUrl, 
        token: this.token, 
        id: parseInt(restaurantId)
      })).unwrap();
      return response;
    } catch (error) {
      console.error('Error fetching restaurant orders:', error);
      throw new Error('Failed to fetch restaurant orders');
    }
  }

  // Create a new menu item
  async createMenuItem(restaurantId: string, menuData: Partial<MobileMenuItem>): Promise<MobileMenuItem> {
    try {
      const response = await this.dispatch(createMenu({ 
        baseUrl: this.baseUrl, 
        token: this.token, 
        id: parseInt(restaurantId),
        data: menuData
      })).unwrap();
      return response;
    } catch (error) {
      console.error('Error creating menu item:', error);
      throw new Error('Failed to create menu item');
    }
  }

  // Update restaurant details
  async updateRestaurant(id: string, restaurantData: Partial<MobileRestaurant>): Promise<MobileRestaurant> {
    try {
      const response = await this.dispatch(editRestaurant({ 
        baseUrl: this.baseUrl, 
        token: this.token, 
        id,
        data: restaurantData
      })).unwrap();
      return response;
    } catch (error) {
      console.error('Error updating restaurant:', error);
      throw new Error('Failed to update restaurant');
    }
  }

  // Create a food order (POST to food_orders endpoint)
  async createOrder(orderData: CreateOrderRequest): Promise<MobileFoodOrder> {
    try {
      const response = await fetch(`https://${this.baseUrl}/pms/admin/restaurants/${orderData.restaurant_id}/food_orders.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          food_order: {
            customer_name: orderData.customer_name,
            contact_number: orderData.contact_number,
            email: orderData.email,
            delivery_address: orderData.delivery_address,
            special_instructions: orderData.special_instructions,
            order_items_attributes: orderData.order_items
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  }

  // Update menu item
  async updateMenuItem(restaurantId: string, menuItemId: string, menuData: Partial<MobileMenuItem>): Promise<MobileMenuItem> {
    try {
      const response = await fetch(`https://${this.baseUrl}/pms/admin/restaurants/${restaurantId}/restaurant_menus/${menuItemId}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          restaurant_menu: menuData
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw new Error('Failed to update menu item');
    }
  }

  // Delete menu item
  async deleteMenuItem(restaurantId: string, menuItemId: string): Promise<void> {
    try {
      const response = await fetch(`https://${this.baseUrl}/pms/admin/restaurants/${restaurantId}/restaurant_menus/${menuItemId}.json`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw new Error('Failed to delete menu item');
    }
  }

  // Utility methods
  static calculateTotal(items: (MobileMenuItem & { quantity: number })[]): number {
    return items.reduce((total, item) => total + (item.discounted_amount * item.quantity), 0);
  }

  static isRestaurantOpen(restaurant: MobileRestaurant): boolean {
    return restaurant.can_order_today && restaurant.active && restaurant.status;
  }

  static formatCurrency(amount: number): string {
    return `₹${amount.toFixed(2)}`;
  }

  static getVegIcon(isVeg: boolean): string {
    return isVeg ? '🟢' : '🔴';
  }
}
