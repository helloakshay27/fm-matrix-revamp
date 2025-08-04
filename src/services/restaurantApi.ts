import baseClient from "@/utils/withoutTokenBase";

export interface Restaurant {
  id: string;
  name: string;
  location: string;
  rating: number;
  timeRange: string;
  discount: string;
  image: string;
  images?: string[]; // Array of images for carousel
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

// New interfaces for facility and site-based APIs
export interface FacilitySetup {
  site_id: number;
  id: number;
  name: string;
  fac_name?: string; // Facility name from API
  // Add other facility fields as needed
}

export interface FacilityResponse {
  facility_setup: FacilitySetup;
}

export interface RestaurantBysite {
  id: number;
  name: string;
  location?: string;
  rating?: number;
  delivery_time?: string;
  discount?: string;
  cover_image?: string;
  cover_images?: Array<{
    id: number;
    relation: string;
    relation_id: number;
    document: string;
  }>;
}

export interface RestaurantsBySiteResponse {
  restaurants: RestaurantBysite[];
}

export interface UserInfo {
  id: number;
  name: string;
  email?: string;
  mobile?: string;
  [key: string]: unknown;
}

export interface CoverImage {
  id: number;
  relation: string;
  relation_id: number;
  document: string;
}

export interface RestaurantTokenResponse {
  id: number;
  name: string;
  location?: string;
  address?: string;
  rating?: number;
  delivery_time?: string;
  discount?: string;
  cover_image?: string;
  cover_images?: CoverImage[];
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
  facilityId?: string; // Add facility ID to order request
}

export interface OrderItem {
  id: number;
  food_order_id: number;
  menu_id: number;
  quantity: number;
  rate: number;
  gst: number | null;
  total: number;
  created_at: string;
  updated_at: string;
  menu_name: string;
  menu_sub_category: string;
  veg_menu: boolean;
}

export interface RestaurantCoverImage {
  id: number;
  relation: string;
  relation_id: number;
  document: string;
}

export interface FoodOrder {
  id: number;
  restaurant_id: number;
  user_society_id: number | null;
  user_id: number;
  payment_mode: string | null;
  sub_total: number;
  gst: number;
  service_charge: number;
  total_amount: number;
  requests: string;
  paid_amount: number | null;
  discount: number | null;
  payment_status: string;
  status_id: number;
  pg_state: string | null;
  pg_response_code: string | null;
  pg_response_msg: string | null;
  pg_order_id: string | null;
  delivery_boy: string | null;
  rating: number | null;
  rating_text: string | null;
  refund_amount: number | null;
  refund_text: string | null;
  created_at: string;
  updated_at: string;
  pg_transaction_id: string | null;
  delivery_charge: number;
  conv_charge: number;
  preferred_time: string | null;
  items: OrderItem[];
  restaurant_name: string;
  order_status: string;
  order_status_color: string;
  user_name: string;
  flat: string | null;
  user_unit_name: string | null;
  user_department_name: string;
  discounted_amount: number;
  order_qr_code: string;
  restaurant_cover_images: RestaurantCoverImage[];
  comments: unknown[];
  facility_id?: number;
  facility_name?: string;
  meeting_room?: string;
}

export interface FoodOrdersResponse {
  food_orders: FoodOrder[];
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
  async getRestaurantsBySite(siteId: string | number): Promise<RestaurantsBySiteResponse> {
    try {
      const response = await baseClient.get(
        `/pms/admin/restaurants/get_restaurants_by_site.json?skp_dr=true`,
        {
          params: { site_id: siteId }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching restaurants by site:", error);
      throw new Error("Failed to fetch restaurants");
    }
  },

  // Get restaurant details by ID
  async getRestaurantById(restaurantId: string): Promise<Restaurant> {
    try {
      const response = await baseClient.get(
        `/pms/admin/restaurants/${restaurantId}.json?skp_dr=true`
      );
      const restaurant = response.data;
      console.log("restaurant respo:", restaurant)

      let menuItems: MenuItem[] = [];

      // ✅ Extract directly from restaurant_menus
      if (
        restaurant?.restaurant_menus &&
        Array.isArray(restaurant.restaurant_menus)
      ) {
        menuItems = restaurant.restaurant_menus.map((item: any) => ({
          id: item.id?.toString() || Math.random().toString(),
          name: item.name || "Unknown Item",
          description: item.description || "",
          price: parseFloat(item.display_price || item.master_price) || 0,
          image:
            item.images && item.images.length > 0
              ? item.images[0].document || item.images[0]
              : "/placeholder.svg",
          quantity: 0,
          categoryName: "General", // If you want, extract category_name if available
        }));
      }

      // console.log("menu items from restaurant_menus:", menuItems);

      // Extract all cover images from main_images array
      let coverImages: string[] = [];
      let coverImage = "/placeholder.svg";

      if (
        restaurant?.main_images &&
        Array.isArray(restaurant.main_images) &&
        restaurant.main_images.length > 0
      ) {
        coverImages = restaurant.main_images
          .map((img: any) => img.document)
          .filter(Boolean);
        coverImage = coverImages[0] || "/placeholder.svg";
      } else {
        // Fallback to other image fields
        coverImage =
          restaurant.image_url || restaurant.image || "/placeholder.svg";
        coverImages = [coverImage];
      }

      return {
        id: restaurant.id?.toString() || restaurantId,
        name: restaurant.name || "Unknown Restaurant",
        location:
          restaurant.address || restaurant.location || "Unknown Location",
        rating: restaurant.rating || 4.0,
        timeRange: restaurant.delivery_time || "30-40 mins",
        discount: restaurant.discount || "10% OFF",
        image: coverImage,
        images: coverImages, // Add array of images for carousel
        menuItems,
      };
    } catch (error) {
      console.error("Error fetching restaurant details:", error);
      throw new Error("Failed to fetch restaurant details");
    }
  },
  // Get menu items for a restaurant
  async getMenuItems(restaurantId: string): Promise<MenuItem[]> {
    try {
      const response = await baseClient.get(
        `/pms/admin/restaurants/${restaurantId}/menu_items.json?skp_dr=true`
      );
      const menuItems = response.data;

      // Transform menu items to match our interface
      return menuItems.map((item: any) => ({
        id: item.id?.toString() || Math.random().toString(),
        name: item.name || "Unknown Item",
        description: item.description || "",
        price: parseFloat(item.price) || 0,
        image: item.image_url || item.image || "/placeholder.svg",
        quantity: 0,
      }));
    } catch (error) {
      console.error("Error fetching menu items:", error);
      throw new Error("Failed to fetch menu items");
    }
  },

  // Place an order
  async placeOrder(orderData: {
    food_order: {
      name: string;
      mobile: string;
      email: string;
      location: string;
      restaurant_id: number;
      user_id: number;
      requests: string;
      facility_id?: number; // Optional facility ID for QR scan orders
      org_id?: number; // Optional organization ID for QR scan orders
      site_id?: number; // Optional site ID for QR scan orders
      items_attributes: Array<{
        menu_id: number;
        quantity: number;
      }>;
    };
  }): Promise<{ success: boolean; data?: unknown; message?: string }> {
    try {
      console.log("Sending order data to API:", orderData);
      
      // Get token from localStorage/sessionStorage
      const token = sessionStorage.getItem("app_token") || sessionStorage.getItem("token") || localStorage.getItem("app_token") || localStorage.getItem("token");
      
      const response = await baseClient.post("/pms/food_orders.json", orderData, {
        headers: token ? {
          'Authorization': `Bearer ${token}`,
        } : {},
        params: token ? { token } : {},
      });
      
      console.log("API Response:", response);

      // Check if response indicates success
      if (response.status === 200 || response.status === 201) {
        return { success: true, data: response.data };
      } else {
        console.error("Unexpected response status:", response.status);
        return {
          success: false,
          message: `Server responded with status ${response.status}`,
        };
      }
    } catch (error: unknown) {
      console.error("Error placing order:", error);

      // Provide more detailed error messages
      if (error && typeof error === "object" && "response" in error) {
        const apiError = error as {
          response: { status: number; data?: { message?: string } };
        };
        console.error("Error response data:", apiError.response.data);
        console.error("Error response status:", apiError.response.status);
        return {
          success: false,
          message: `Server error: ${apiError.response.status} - ${
            apiError.response.data?.message || "Unknown error"
          }`,
        };
      } else if (error && typeof error === "object" && "request" in error) {
        console.error(
          "No response received:",
          (error as { request: unknown }).request
        );
        return {
          success: false,
          message: "No response from server. Please check your connection.",
        };
      } else {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        console.error("Request setup error:", errorMessage);
        return { success: false, message: `Request error: ${errorMessage}` };
      }
    }
  },

  // Get user food orders
  async getUserOrders(userId?: string, token?: string): Promise<FoodOrder[]> {
    try {
      const token = sessionStorage.getItem("app_token") || sessionStorage.getItem("token");
      const response = await baseClient.get("/pms/food_orders.json", {
        params: userId ? { user_id: userId, ...(token ? { token } : {}) } : (token ? { token } : {}),
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      
      const data: FoodOrdersResponse = response.data;
      return data.food_orders || [];
    } catch (error) {
      console.error("Error fetching user orders:", error);
      throw new Error("Failed to fetch orders");
    }
  },

  // Get order details by ID
  async getOrderById(orderId: string): Promise<Order> {
    try {
      const response = await baseClient.get(
        `/pms/admin/restaurant_orders/${orderId}.json`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching order details:", error);
      throw new Error("Failed to fetch order details");
    }
  },

  // Get facility setup by facility ID
  async getFacilitySetup(facilityId: string): Promise<FacilityResponse> {
    try {
      const response = await baseClient.get(
        `/pms/admin/facility_setups/${facilityId}.json?skp_dr=true`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching facility setup:", error);
      throw new Error("Failed to fetch facility setup");
    }
  },

  // Get restaurants by token for application users
  async getRestaurantsByToken(token: string): Promise<{
    success: boolean;
    restaurants?: Restaurant[];
    user_info?: UserInfo;
    message?: string;
  }> {
    try {
      console.log("🔑 FETCHING RESTAURANTS BY TOKEN:", token);
      
      const response = await baseClient.get(
        `/pms/admin/restaurants/get_restaurants_by_site_mobile.json`,
        {
          params: { token },
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      
      console.log("🔑 TOKEN RESPONSE:", response.data);
      
      if (response.data && response.data.restaurants) {
        // Convert API restaurants to local Restaurant format
        const restaurants: Restaurant[] = response.data.restaurants.map((r: RestaurantTokenResponse) => ({
          id: r.id.toString(),
          name: r.name,
          location: r.location || r.address || "Location not specified",
          rating: r.rating || 4.0,
          timeRange: r.delivery_time || "30-45 mins",
          discount: r.discount || "10% OFF",
          image: r.cover_image || r.cover_images?.[0]?.document || "/placeholder.svg",
          images: r.cover_images?.map((img: CoverImage) => img.document) || [],
          menuItems: [], // Will be loaded when restaurant is selected
        }));
        
        return {
          success: true,
          restaurants,
          user_info: response.data.user_info || null,
        };
      }
      
      return {
        success: false,
        message: "No restaurants found for this token",
      };
    } catch (error) {
      console.error("Error fetching restaurants by token:", error);
      
      if (error && typeof error === "object" && "response" in error) {
        const apiError = error as { response: { status: number; data?: { message?: string } } };
        return {
          success: false,
          message: apiError.response.data?.message || `Authentication failed: ${apiError.response.status}`,
        };
      }
      
      return {
        success: false,
        message: "Failed to authenticate token. Please try again.",
      };
    }
  },

  // Create QR order for external users
  async createQROrder(orderData: {
    customer_name: string;
    customer_number: string;
    customer_email: string;
    delivery_address: string;
    facility_id: number;
    site_id: number;
    food_order: {
      restaurant_id: number;
      preferred_time?: string;
      requests?: string;
      items_attributes: Array<{
        menu_id: number;
        quantity: number;
      }>;
    };
  }): Promise<{
    success: boolean;
    data?: {
      order_id: number;
      restaurant_name: string;
      customer_name: string;
      total_amount: number;
      message: string;
    };
    message?: string;
  }> {
    try {
      console.log("📡 CREATING QR ORDER:", orderData);
      
      const response = await baseClient.post(
        `/pms/admin/restaurants/api_create_qr_order.json?skp_dr=true`,
        orderData
      );
      
      console.log("📡 QR ORDER RESPONSE:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating QR order:", error);
      
      if (error && typeof error === "object" && "response" in error) {
        const apiError = error as { response: { status: number; data?: { message?: string } } };
        return {
          success: false,
          message: apiError.response.data?.message || `Server error: ${apiError.response.status}`,
        };
      }
      
      return {
        success: false,
        message: "Failed to create order. Please try again.",
      };
    }
  },

  // Create order for authenticated app users with token
  async createTokenOrder(orderData: {
    token: string;
    facility_id?: number;
    food_order: {
      restaurant_id: number;
      preferred_time?: string;
      requests?: string;
      items_attributes: Array<{
        menu_id: number;
        quantity: number;
      }>;
    };
  }): Promise<{
    success: boolean;
    data?: {
      order_id: number;
      restaurant_name: string;
      customer_name: string;
      total_amount: number;
      message: string;
    };
    message?: string;
  }> {
    try {
      console.log("📡 CREATING TOKEN ORDER:", orderData);

      // Get facility_id from sessionStorage if available
      const facilityId = sessionStorage.getItem("facility_id");
      const postData = {
        ...orderData,
        ...(facilityId ? { facility_id: Number(facilityId) } : {}),
      };

      const response = await baseClient.post(
        `/pms/admin/restaurants/api_create_token_order.json`,
        postData,
        {
          headers: {
            'Authorization': `Bearer ${orderData.token}`,
          }
        }
      );

      console.log("📡 TOKEN ORDER RESPONSE:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating token order:", error);

      if (error && typeof error === "object" && "response" in error) {
        const apiError = error as { response: { status: number; data?: { message?: string } } };
        return {
          success: false,
          message: apiError.response.data?.message || `Server error: ${apiError.response.status}`,
        };
      }

      return {
        success: false,
        message: "Failed to create order. Please try again.",
      };
    }
  },

  // Admin Order Management APIs
  async getAdminOrders(token: string, restaurantId: string, page: number = 1): Promise<AdminOrdersResponse> {
    try {
      const response = await baseClient.get(
        `/pms/admin/restaurants/${restaurantId}/food_orders.json?all=true&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching admin orders:", error);
      throw new Error("Failed to fetch admin orders");
    }
  },

  async updateOrderStatus(orderId: string, statusId: string, comment: string = "", token?: string): Promise<{ success: boolean; message?: string }> {
    try {
      // Use provided token or get from sessionStorage
      const authToken = token || sessionStorage.getItem('token') || sessionStorage.getItem('app_token');
      
      const response = await baseClient.post(
        `/crm/create_osr_log.json`,
        {
          osr_log: {
            about: "FoodOrder",
            about_id: orderId,
            osr_status_id: statusId,
            comment: comment
          }
        },
        {
          headers: authToken ? {
            'Authorization': `Bearer ${authToken}`
          } : {}
        }
      );
      
      return {
        success: true,
        message: "Status updated successfully"
      };
    } catch (error) {
      console.error("Error updating order status:", error);
      return {
        success: false,
        message: "Failed to update order status"
      };
    }
  },
};

// Admin Order Management Interfaces
export interface OrderStatus {
  id: number;
  position: number | null;
  name: string;
  display: string | null;
  fixed_state: string;
  color_code: string | null;
  mail: number;
  sms: number;
  cancel: number;
  active: number;
}

export interface AdminOrderItem {
  id: number;
  menu_name: string;
  quantity: number;
  price: number;
}

export interface AdminOrder {
  id: number;
  restaurant_name: string;
  restaurant_id: number;
  created_at: string;
  created_by: string;
  status_name: string;
  total_amount: number;
  item_count: number;
  items: AdminOrderItem[];
  statuses: OrderStatus[];
  payment_status?: string;
  payment_status_class?: string;
  meeting_room?: string;
  details_url?: string;
}

export interface AdminOrdersResponse {
  total_pages: number;
  current_page: number;
  per_page: number;
  total_records: number;
  food_orders: AdminOrder[];
}

export interface AdminRestaurant {
  id: number;
  name: string;
  location?: string;
  image?: string;
}
