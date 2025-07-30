import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { MobileRestaurantWelcome } from "@/components/mobile/MobileRestaurantWelcome";
import { MobileRestaurantDashboard } from "@/components/mobile/MobileRestaurantDashboard";
import { MobileRestaurantDetails } from "@/components/mobile/MobileRestaurantDetails";
import { MobileItemsDetails } from "@/components/mobile/MobileItemsDetails";
import { MobileContactForm } from "@/components/mobile/MobileContactForm";
import { MobileOrderReview } from "@/components/mobile/MobileOrderReview";
import { MobileOrderPlaced } from "@/components/mobile/MobileOrderPlaced";
import { useToast } from "@/hooks/use-toast";
import { restaurantApi, Restaurant, UserInfo } from "@/services/restaurantApi";

// Mock data - replace with actual API calls
const mockRestaurants = [
  {
    id: "1",
    name: "The Bawa Kitchen",
    location: "Andheri West",
    rating: 4.1,
    timeRange: "60-65 mins",
    discount: "20% OFF",
    image: "/placeholder.svg",
    menuItems: [
      {
        id: "1",
        name: "Chicken Noodles",
        description: "Noodles + Manchurian + Sauces",
        price: 250,
        image: "/placeholder.svg",
      },
      {
        id: "2",
        name: "Veggie Burger",
        description: "Plant-based patty + Lettuce + Tomato",
        price: 180,
        image: "/placeholder.svg",
      },
      {
        id: "3",
        name: "Grilled Salmon",
        description: "Salmon fillet + Garlic butter + Lemon",
        price: 450,
        image: "/placeholder.svg",
      },
      {
        id: "4",
        name: "Spicy Tacos",
        description: "Chicken + Spices + Fresh salsa",
        price: 220,
        image: "/placeholder.svg",
      },
    ],
  },
];

export const MobileRestaurantPage: React.FC = () => {
  const {
    restaurant: facilityId,
    orgId,
    restaurantId,
    action,
  } = useParams<{
    restaurant: string;
    orgId: string;
    restaurantId: string;
    action: string;
  }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { toast } = useToast();

  // Get token from URL params
  const token = searchParams.get("token");

  // Auto-add source based on URL type
  useEffect(() => {
    if (!searchParams.get("source")) {
      const newParams = new URLSearchParams(searchParams);
      
      if (token) {
        // Token present - set source as "app"
        console.log("🔗 AUTO-ADDING SOURCE=APP for token-based URL");
        newParams.set("source", "app");
        setSearchParams(newParams, { replace: true });
      } else if (facilityId && orgId && !action) {
        // QR scan URLs (mr/facilityId/orgId format) - set source as "external"
        console.log("🔗 AUTO-ADDING SOURCE=EXTERNAL for QR scan URL");
        newParams.set("source", "external");
        setSearchParams(newParams, { replace: true });
      }
    }
  }, [facilityId, orgId, action, token, searchParams, setSearchParams]);

  useEffect(() => {
    console.log("🚀 MOBILE RESTAURANT PAGE PARAMS:");
    console.log("  - facilityId (restaurant param):", facilityId);
    console.log("  - orgId:", orgId);
    console.log("  - restaurantId:", restaurantId);
    console.log("  - action:", action);
    console.log("  - token:", token);
    console.log(
      "  - searchParams:",
      Object.fromEntries(searchParams.entries())
    );

    fetchRestaurants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facilityId, orgId, restaurantId, action, token]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);

      // Priority 1: Token-based authentication for application users
      if (token) {
        console.log("🔑 TOKEN-BASED FLOW: authenticating with token:", token);
        
        // Check if this is a direct restaurant access with token
        if (restaurantId && action === "details") {
          console.log("🔑🍽️ TOKEN + DIRECT RESTAURANT ACCESS:", restaurantId);
          
          // First authenticate with token, then get specific restaurant
          const tokenResponse = await restaurantApi.getRestaurantsByToken(token);
          
          if (tokenResponse.success) {
            console.log("🔑 TOKEN SUCCESS: Now fetching specific restaurant:", restaurantId);
            
            // Store token, user info, and source for order placement
            sessionStorage.setItem("app_token", token);
            sessionStorage.setItem("app_source", "app");
            if (tokenResponse.user_info) {
              sessionStorage.setItem("app_user_info", JSON.stringify(tokenResponse.user_info));
              setUserInfo(tokenResponse.user_info);
            }
            
            // Now get the specific restaurant
            const apiRestaurant = await restaurantApi.getRestaurantById(restaurantId);
            const restaurant = {
              ...apiRestaurant,
              menuItems: apiRestaurant.menuItems || [],
            };
            setRestaurants([restaurant]);
            return; // Exit early on success
          } else {
            console.error("🔑 TOKEN FAILED:", tokenResponse.message);
            toast({
              variant: "destructive",
              title: "Authentication Failed",
              description: tokenResponse.message || "Invalid token. Please try again.",
            });
            return; // Exit on token failure
          }
        }
        
        // Regular token-based flow (no specific restaurant)
        const tokenResponse = await restaurantApi.getRestaurantsByToken(token);
        
        if (tokenResponse.success && tokenResponse.restaurants) {
          console.log("🔑 TOKEN SUCCESS: restaurants found:", tokenResponse.restaurants.length);
          setUserInfo(tokenResponse.user_info || null);
          
          // Store token, user info, and source for order placement
          sessionStorage.setItem("app_token", token);
          sessionStorage.setItem("app_source", "app");
          if (tokenResponse.user_info) {
            sessionStorage.setItem("app_user_info", JSON.stringify(tokenResponse.user_info));
          }
          
          // If there's only one restaurant, load its menu items immediately
          if (tokenResponse.restaurants.length === 1) {
            console.log("🔑🍽️ SINGLE RESTAURANT: Loading menu items for", tokenResponse.restaurants[0].id);
            try {
              const apiRestaurant = await restaurantApi.getRestaurantById(tokenResponse.restaurants[0].id);
              const restaurantWithMenus = {
                ...tokenResponse.restaurants[0],
                menuItems: apiRestaurant.menuItems || [],
              };
              setRestaurants([restaurantWithMenus]);
            } catch (error) {
              console.error("❌ ERROR LOADING MENU ITEMS:", error);
              setRestaurants(tokenResponse.restaurants);
            }
          } else {
            setRestaurants(tokenResponse.restaurants);
          }
          
          return; // Exit early on success
        } else {
          console.error("🔑 TOKEN FAILED:", tokenResponse.message);
          toast({
            variant: "destructive",
            title: "Authentication Failed",
            description: tokenResponse.message || "Invalid token. Please try again.",
          });
          return; // Exit on token failure
        }
      }

      // Priority 2: Facility-based flow (QR scan like mr/1340/13)
      if (facilityId && orgId && !action) {
        console.log(
          "🔍 FACILITY-BASED FLOW: fetching restaurants for facility:",
          facilityId
        );

        // Step 1: Get facility setup to get site_id
        const facilityResponse = await restaurantApi.getFacilitySetup(
          facilityId
        );
        const siteId = facilityResponse.facility_setup.site_id;

        console.log("📍 SITE ID:", siteId);
        console.log("🏢 ORG ID:", orgId);
        console.log("🏢 FACILITY DATA:", facilityResponse.facility_setup);

        // Store site_id, org_id, facility_id, and facility_setup in sessionStorage for external order API
        sessionStorage.setItem("site_id", siteId.toString());
        sessionStorage.setItem("org_id", orgId);
        sessionStorage.setItem("facility_id", facilityId);
        sessionStorage.setItem("facility_setup", JSON.stringify(facilityResponse.facility_setup));

        // Step 2: Get restaurants by site_id
        const restaurantsResponse = await restaurantApi.getRestaurantsBySite(
          siteId
        );
        const restaurantsList = restaurantsResponse.restaurants || [];

        console.log("🍽️ RESTAURANTS FOUND:", restaurantsList.length);

        // Convert to Restaurant format and load menu items if there's only one restaurant
        const convertedRestaurants: Restaurant[] = restaurantsList.map((r) => ({
          id: r.id.toString(),
          name: r.name,
          location: r.location || "Location not specified",
          rating: r.rating || 4.0,
          timeRange: r.delivery_time || "30-45 mins",
          discount: r.discount || "10% OFF",
          image:
            r.cover_image ||
            r.cover_images?.[0]?.document ||
            "/placeholder.svg",
          images: r.cover_images?.map((img) => img.document) || [],
          menuItems: [], // Will be loaded if there's only one restaurant
        }));

        setRestaurants(convertedRestaurants);

        // If there's only one restaurant, load its menu items immediately
        if (convertedRestaurants.length === 1) {
          console.log("🍽️ SINGLE RESTAURANT: Loading menu items for", convertedRestaurants[0].id);
          try {
            const apiRestaurant = await restaurantApi.getRestaurantById(convertedRestaurants[0].id);
            console.log("APIRESP", apiRestaurant);
            const restaurantWithMenus = {
              ...convertedRestaurants[0],
              menuItems: apiRestaurant.menuItems || [],
            };
            setRestaurants([restaurantWithMenus]);
          } catch (error) {
            console.error("❌ ERROR LOADING MENU ITEMS:", error);
          }
        }
      } else if (restaurantId && action === "details") {
        // Priority 3: Direct restaurant access (existing flow)
        console.log("🍽️ DIRECT RESTAURANT ACCESS:", restaurantId);
        const apiRestaurant = await restaurantApi.getRestaurantById(
          restaurantId
        );
        // Convert API restaurant to local Restaurant format
        const restaurant = {
          ...apiRestaurant,
          menuItems: apiRestaurant.menuItems || [],
        };
        setRestaurants([restaurant]);
      } else if (!facilityId && !restaurantId && !token) {
        // Priority 4: App user accessing restaurant list (fallback)
        console.log("📱 APP USER: using fallback restaurant");
        // Use restaurant ID 49 from the API URL provided
        const apiRestaurant = await restaurantApi.getRestaurantById("49");
        const restaurant = {
          ...apiRestaurant,
          menuItems: apiRestaurant.menuItems || [],
        };
        setRestaurants([restaurant]);
      }
    } catch (error) {
      console.error("❌ ERROR FETCHING RESTAURANTS:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load restaurants. Please try again.",
      });
      // Fallback to mock data only if no token was provided
      if (!token) {
        setRestaurants(mockRestaurants);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // Route to different components based on the action
  switch (action) {
    case "dashboard": {
      return <MobileRestaurantDashboard restaurants={restaurants} />;
    }

    case "details": {
      const restaurant = restaurants.find((r) => r.id === restaurantId);
      if (!restaurant) {
        return <div>Restaurant not found</div>;
      }
      return <MobileRestaurantDetails restaurant={restaurant} />;
    }

    case "items": {
      return <MobileItemsDetails />;
    }

    case "contact-form": {
      return <MobileContactForm />;
    }

    case "order-review": {
      return <MobileOrderReview />;
    }

    case "order-placed": {
      return <MobileOrderPlaced />;
    }

    default: {
      // Direct menu flow - check restaurant count
      if (restaurants.length > 1) {
        // Multiple restaurants - show dashboard list
        return <MobileRestaurantDashboard restaurants={restaurants} />;
      } else if (restaurants.length === 1) {
        // Single restaurant - show menu directly
        return <MobileRestaurantDetails restaurant={restaurants[0]} />;
      } else {
        // No restaurants available - show empty state with meal icon
        return (
          <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="text-6xl mb-4">🍽️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Restaurant Available
            </h2>
            <p className="text-gray-600 text-center">
              There are no restaurants available at this location.
            </p>
          </div>
        );
      }
    }
  }
};
