import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Plus,
  Minus,
  X,
  NotebookPen,
  PenBoxIcon,
} from "lucide-react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { restaurantApi } from "@/services/restaurantApi";
import {
  DeliveryDining,
  Note,
  NoteAdd,
  NoteAddOutlined,
} from "@mui/icons-material";
import { toast } from "sonner";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
}

interface Restaurant {
  id: string;
  name: string;
  location: string;
  rating: number;
  timeRange: string;
  discount: string;
  image: string;
}

export const MobileItemsDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  // const source = sessionStorage.get("app_source")
  // console.log("source", source);

  // Check if user is from external scan (Google Lens, etc.)
  const sourceParam = searchParams.get("source");
  const isExternalScan = sourceParam === "external";

  const {
    selectedItems: initialItems,
    restaurant,
    isExternalScan: passedExternalScan,
    sourceParam: passedSourceParam,
  } = location.state as {
    selectedItems: MenuItem[];
    restaurant: Restaurant;
    isExternalScan?: boolean;
    sourceParam?: string;
  };

  // Use passed external scan flag as fallback if URL parameter is not present
  const finalIsExternalScan = isExternalScan || passedExternalScan || false;
  const finalSourceParam = sourceParam || passedSourceParam;

  // 🔍 Debug logging for external detection in Items Details
  useEffect(() => {
    console.log("🛒 ITEMS DETAILS - EXTERNAL DETECTION:");
    console.log("  - URL source param:", sourceParam);
    console.log("  - Passed sourceParam:", passedSourceParam);
    console.log("  - Final sourceParam:", finalSourceParam);
    console.log("  - Passed isExternalScan:", passedExternalScan);
    console.log("  - Final isExternalScan:", finalIsExternalScan);
    console.log("  - Current URL:", window.location.href);
  }, [
    searchParams,
    sourceParam,
    passedSourceParam,
    finalSourceParam,
    passedExternalScan,
    finalIsExternalScan,
  ]);

  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [note, setNote] = useState<string>("");
  const [inputLocation, setInputLocation] = useState<string>("");
  // console.log("value", inputLocation);
  const [showNoteDialog, setShowNoteDialog] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showLocationError, setShowLocationError] = useState<boolean>(false);

  const handleBack = () => {
    navigate(-1);
  };

  const updateQuantity = (itemId: string, change: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQuantity = Math.max(0, item.quantity + change);
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      // Only add to total if item has a valid price
      if (item.price != null && item.price !== undefined && item.price > 0) {
        return total + item.price * item.quantity;
      }
      return total;
    }, 0);
  };

  const addMoreItems = () => {
    // Preserve any source parameter when going back to restaurant details
    const backUrl = finalSourceParam
      ? `/mobile/restaurant/${restaurant.id}/details?source=${finalSourceParam}`
      : `/mobile/restaurant/${restaurant.id}/details`;

    console.log("🔄 NAVIGATING BACK TO RESTAURANT:");
    console.log("  - finalSourceParam:", finalSourceParam);
    console.log("  - finalIsExternalScan:", finalIsExternalScan);
    console.log("  - Back URL:", backUrl);
    console.log("  - Current items to preserve:", items);

    // Navigate back with current cart state preserved
    navigate(backUrl, {
      state: {
        preservedCart: items, // Pass current items to preserve selection
        restaurant,
        isExternalScan: finalIsExternalScan,
        sourceParam: finalSourceParam,
      },
    });
  };

  // Retrieve user from local storage
  // ✅ Safely get user from sessionStorage
  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.id;

  // ✅ Optional guard: user must be logged in
  // if (!userId) {
  //   console.error("User not found in sessionStorage. Please log in.");
  //   return null; // or navigate to login
  // }

  // ✅ Place order handler
  const handlePlaceOrder = async () => {
    if (isSubmitting) return; // Prevent double submission

    // Validate delivery location for app users
    if (
      finalSourceParam === "app" &&
      !sessionStorage.getItem("facility_id") &&
      (!inputLocation || inputLocation.trim() === "")
    ) {
      setShowLocationError(true);
      return;
    }

    // Clear location error if validation passes
    setShowLocationError(false);

    console.log("🚀 HANDLING PLACE ORDER:");
    console.log("  - finalSourceParam:", finalSourceParam);
    console.log("  - finalIsExternalScan:", finalIsExternalScan);

    // 🔀 EXTERNAL USER FLOW: Redirect to contact form first
    if (finalIsExternalScan) {
      console.log("🔄 EXTERNAL USER: Redirecting to contact form");

      // Get facility_id from session storage to pass along
      const facilityId = sessionStorage.getItem("facility_id");
      const siteId = sessionStorage.getItem("site_id");

      // Construct contact form URL with source parameter
      const contactFormUrl = finalSourceParam
        ? `/mobile/restaurant/${restaurant.id}/contact-form?source=${finalSourceParam}`
        : `/mobile/restaurant/${restaurant.id}/contact-form`;

      console.log("🔄 PASSING TO CONTACT FORM:");
      console.log("  - facilityId:", facilityId);
      console.log("  - siteId:", siteId);

      navigate(contactFormUrl, {
        state: {
          selectedItems: items,
          restaurant,
          totalPrice: getTotalPrice(),
          totalItems: getTotalItems(),
          note,
          isExternalScan: finalIsExternalScan,
          sourceParam: finalSourceParam,
          facilityId: facilityId,
          siteId: siteId ? parseInt(siteId) : undefined,
        },
      });
      return;
    }
    setIsSubmitting(true);

    // 🔍 DEBUG: Check all session storage values
    console.log("🔍 SESSION STORAGE DEBUG:");
    console.log("  - facility_id:", sessionStorage.getItem("facility_id"));
    console.log("  - org_id:", sessionStorage.getItem("org_id"));
    console.log("  - site_id:", sessionStorage.getItem("site_id"));
    console.log(
      "  - facility_setup:",
      sessionStorage.getItem("facility_setup")
    );
    console.log("  - app_token:", sessionStorage.getItem("app_token"));
    console.log("  - app_user_info:", sessionStorage.getItem("app_user_info"));

    // Get facility_id from session storage for order association
    const facilityId = sessionStorage.getItem("facility_id");
    const orgId = sessionStorage.getItem("org_id");
    const siteId = sessionStorage.getItem("site_id");
    const facilitySetup = sessionStorage.getItem("facility_setup");

    // Get user info from session storage
    const userInfo = sessionStorage.getItem("app_user_info");
    const parsedUserInfo = userInfo ? JSON.parse(userInfo) : null;

    // Parse facility setup to get delivery location
    let deliveryLocation = "";
    if (facilitySetup) {
      try {
        const parsedFacilitySetup = JSON.parse(facilitySetup);
        deliveryLocation =
          parsedFacilitySetup.fac_name ||
          parsedFacilitySetup.name ||
          "App Location";
      } catch (error) {
        console.error("Error parsing facility setup:", error);
      }
    } else if (facilityId) {
      // If we have facility_id but no facility_setup, try to fetch it
      try {
        console.log("🏢 Fetching facility setup for facility_id:", facilityId);
        const facilityResponse = await restaurantApi.getFacilitySetup(
          facilityId
        );
        deliveryLocation =
          facilityResponse.facility_setup.fac_name ||
          facilityResponse.facility_setup.name ||
          "App Location";

        // Store facility setup for future use
        sessionStorage.setItem(
          "facility_setup",
          JSON.stringify(facilityResponse.facility_setup)
        );
        console.log("🏢 Facility setup fetched and stored:", deliveryLocation);
      } catch (error) {
        console.error("❌ Error fetching facility setup:", error);
        deliveryLocation = `Facility ${facilityId}`;
      }
    }

    // Build the order data with optional facility fields
    // Get facility info from session storage
    const facilityInfo = sessionStorage.getItem("facility");
    const parsedFacilityInfo = facilityInfo ? JSON.parse(facilityInfo) : null;

    const foodOrderData = {
      name: parsedUserInfo?.name || user?.full_name || user?.name || "App User",
      mobile: parsedUserInfo?.mobile || user?.mobile || "",
      email: parsedUserInfo?.email || user?.email || "",
      location: deliveryLocation || inputLocation,
      restaurant_id: parseInt(restaurant.id),
      user_id: userId,
      requests: note || "",
      items_attributes: items.map((item) => ({
        menu_id: parseInt(item.id),
        quantity: item.quantity,
      })),
      ...(facilityId && { facility_id: parseInt(facilityId) }),
      ...(orgId && { org_id: parseInt(orgId) }),
      ...(siteId && { site_id: parseInt(siteId) }),
      ...(parsedFacilityInfo && { facility: parsedFacilityInfo }),
    };

    const orderData = {
      food_order: foodOrderData,
    };

    console.log("🚀 SUBMITTING ORDER:");
    console.log("  - finalSourceParam:", finalSourceParam);
    console.log("  - finalIsExternalScan:", finalIsExternalScan);
    console.log("  - facilityId (raw):", facilityId);
    console.log(
      "  - facilityId (will be included):",
      facilityId && parseInt(facilityId)
    );
    console.log("  - orgId (raw):", orgId);
    console.log("  - orgId (will be included):", orgId && parseInt(orgId));
    console.log("  - siteId (raw):", siteId);
    console.log("  - siteId (will be included):", siteId && parseInt(siteId));
    console.log("  - facilitySetup:", facilitySetup);
    console.log("  - deliveryLocation:", deliveryLocation);
    console.log("  - Final Order Data:", orderData);
    console.log("  - Order data food_order:", orderData.food_order);
    console.log(
      "  - Order data stringified:",
      JSON.stringify(orderData, null, 2)
    );

    try {
      const result = await restaurantApi.placeOrder(orderData);
      // const result = await restaurantApi.createQROrder(orderData);
      console.log("📡 API Response:", result);

      if (result.success) {
        console.log("✅ Order placed successfully:", result.data);
        console.log("🧭 NAVIGATION: Going to order-review with:");
        console.log("  - showSuccessImmediately: true");
        console.log("  - finalSourceParam:", finalSourceParam);
        console.log("  - finalIsExternalScan:", finalIsExternalScan);

        // Prepare order review data for sessionStorage
        const orderReviewData = {
          orderData: result.data,
          restaurant,
          totalPrice: getTotalPrice(),
          totalItems: getTotalItems(),
          items,
          note,
          isExternalScan: finalIsExternalScan,
          sourceParam: finalSourceParam,
          showSuccessImmediately: true,
        };

        // Store order data in sessionStorage for direct navigation support
        sessionStorage.setItem(
          "latest_order_data",
          JSON.stringify(orderReviewData)
        );
        console.log(
          "💾 STORED ORDER DATA in sessionStorage for direct navigation"
        );

        // Navigate to order review with success state
        // navigate(`/mobile/restaurant/${restaurant.id}/order-placed`, {
        navigate(
          `/mobile/restaurant/${restaurant.id}/order-review?source=${finalSourceParam}`,
          {
            state: orderReviewData,
          }
        );
      } else {
        console.error("❌ Order placement failed:", result.message);
        alert(result.message || "Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Network error during order placement:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleSaveNote = () => {
    setShowNoteDialog(false);
  };

  const handleClearNote = () => {
    setNote("");
    setShowNoteDialog(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center">
          <button onClick={handleBack} className="mr-4">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Items Details</h1>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {restaurant.name}
          </h2>
          <span className="text-sm text-gray-600">
            Total Items - {getTotalItems()}
          </span>
        </div>
      </div>

      {/* Items List */}
      <div className="bg-[#E8E2D3] mx-4 mt-4 rounded-lg overflow-hidden">
        <div className="p-4 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex-1">
                <span className="text-gray-900 font-medium">{item.name}</span>
                {item.price != null &&
                  item.price !== undefined &&
                  item.price > 0 && (
                    <div className="text-sm text-gray-600 mt-1">
                      ORM{item.price} × {item.quantity} = ORM
                      {item.price * item.quantity}
                    </div>
                  )}
              </div>
              <div className="flex items-center border-2 border-red-600 rounded-lg bg-white ml-3">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="px-3 py-1 text-red-600 hover:bg-red-50 text-lg font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1 text-gray-900 font-medium min-w-[40px] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="px-3 py-1 text-red-600 hover:bg-red-50 text-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>
          ))}

          {/* Total Price Section */}
          {items.length > 0 && getTotalPrice() > 0 && (
            <div className="pt-4 border-t border-gray-400">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  Total Amount
                </span>
                <span className="text-xl font-bold text-red-600">
                  ORM{getTotalPrice()}
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {getTotalItems()} item{getTotalItems() > 1 ? "s" : ""}
              </div>
            </div>
          )}

          {/* Add More Items */}
          <div className="pt-2">
            <button
              onClick={addMoreItems}
              className="text-red-600 font-medium text-sm flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add more items
            </button>
          </div>
        </div>
      </div>

      {sourceParam === "app" && !sessionStorage.getItem("facility_id") && (
        <div className="mx-4 mt-4">
          <div className="flex items-center mb-3">
            <div className="bg-white rounded-xl w-full p-4 gap-2">
              <div className="text-gray-900 gap-2 mr-2 bg-white  font-medium">
                <label className="text-bold gap-2 flex items-center">
                  <div className="bg-gray-300 rounded-sm">
                    <DeliveryDining className="" />
                  </div>
                  Delivery Location <span className="text-red-500">*</span>
                </label>
              </div>
              <div>
                <input
                  onChange={(e) => {
                    setInputLocation(e.target.value);
                    // Clear error when user starts typing
                    if (showLocationError) {
                      setShowLocationError(false);
                    }
                  }}
                  value={inputLocation || ""}
                  type="text"
                  className={`w-full bg-white resize-none text-gray-600 mt-2 p-1 rounded-md border ${
                    showLocationError ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-red-500 outline-none`}
                  placeholder="Enter delivery location"
                />
                {showLocationError && (
                  <div className="text-red-500 text-sm mt-1">
                    Please add delivery location
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Note Section */}
      <div className="mx-4 mt-4 mb-24">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center mb-3">
            <div className="w-6 h-6 bg-gray-300 rounded-md flex items-center justify-center mr-3">
              <PenBoxIcon className="w-4 h-4" />
            </div>
            <span className="font-semibold text-gray-900 text-base">
              Additional Request
            </span>
          </div>
          {note && (
            <div className="text-gray-700 bg-gray-50 p-3 rounded-lg border-l-4 border-red-500 mt-2">
              {note}
            </div>
          )}
          {!note && (
            <button
              onClick={() => setShowNoteDialog(true)}
              className="text-gray-500 text-sm hover:text-gray-700 transition-colors duration-150 w-full text-left py-2 px-3 rounded-lg hover:bg-gray-50"
            >
              Add a note for the restaurant
            </button>
          )}
        </div>
      </div>

      {/* Place Order Button */}
      <div className="fixed bottom-0 left-0 right-0 py-2 border-gray-200 p-4 shadow-2xl">
        <Button
          onClick={handlePlaceOrder}
          disabled={items.length === 0 || isSubmitting}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-2xl text-lg font-bold shadow-xl transition-all duration-200 hover:shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Placing Order...</span>
            </div>
          ) : (
             <span className="text-white">Place Order</span>
          )}
        </Button>
      </div>

      {/* Note Dialog */}
      {showNoteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#E8E2D3] rounded-lg w-full max-w-md">
            {/* Dialog Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-300">
              <h3 className="text-lg font-semibold text-gray-900">
                Add a note for the restaurant
              </h3>
              <button onClick={() => setShowNoteDialog(false)}>
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Dialog Content */}
            <div className="p-4">
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder=""
                className="w-full border-0 bg-white rounded-lg p-3 resize-none focus:ring-0 text-gray-600"
                rows={4}
              />
            </div>

            {/* Dialog Actions */}
            <div className="p-4 flex gap-3">
              <Button
                onClick={handleClearNote}
                variant="outline"
                className="flex-1 border-2 border-red-600 text-red-600 bg-white hover:bg-red-50 py-3 rounded-lg font-medium"
              >
                Clear
              </Button>
              <Button
                onClick={handleSaveNote}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold shadow-lg border-0 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
