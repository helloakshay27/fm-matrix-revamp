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
        `/pms/admin/restaurants/get_restaurants_by_site.json`,
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
        `/pms/admin/restaurants/${restaurantId}.json`
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
              ? item.images[0]
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
        `/pms/admin/restaurants/${restaurantId}/menu_items.json`
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
      items_attributes: Array<{
        menu_id: number;
        quantity: number;
      }>;
    };
  }): Promise<{ success: boolean; data?: unknown; message?: string }> {
    try {
      console.log("Sending order data to API:", orderData);
      const response = await baseClient.post("/pms/food_orders.json", orderData);
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
  async getUserOrders(userId?: string): Promise<FoodOrder[]> {
    try {
      const response = await baseClient.get("/pms/food_orders.json", {
        params: userId ? { user_id: userId } : {},
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
        `/pms/admin/facility_setups/${facilityId}.json`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching facility setup:", error);
      throw new Error("Failed to fetch facility setup");
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
        `/pms/admin/restaurants/api_create_qr_order.json`,
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
};
