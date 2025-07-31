import React, { useState, useEffect } from "react";
import { ArrowLeft, Plus, Minus, X } from "lucide-react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { restaurantApi } from "@/services/restaurantApi";

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
  const [showNoteDialog, setShowNoteDialog] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
      }
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

    console.log("🚀 HANDLING PLACE ORDER:");
    console.log("  - finalSourceParam:", finalSourceParam);
    console.log("  - finalIsExternalScan:", finalIsExternalScan);

    // 🔀 EXTERNAL USER FLOW: Redirect to contact form first
    if (finalIsExternalScan) {
      console.log("🔄 EXTERNAL USER: Redirecting to contact form");
      
      // Construct contact form URL with source parameter
      const contactFormUrl = finalSourceParam 
        ? `/mobile/restaurant/${restaurant.id}/contact-form?source=${finalSourceParam}`
        : `/mobile/restaurant/${restaurant.id}/contact-form`;
      
      navigate(contactFormUrl, {
        state: {
          selectedItems: items,
          restaurant,
          totalPrice: getTotalPrice(),
          totalItems: getTotalItems(),
          note,
          isExternalScan: finalIsExternalScan,
          sourceParam: finalSourceParam,
        },
      });
      return;
    }
    setIsSubmitting(true);

    const orderData = {
      food_order: {
        restaurant_id: parseInt(restaurant.id),
        user_id: userId,
        requests: note || "",
        items_attributes: items.map((item) => ({
          menu_id: parseInt(item.id),
          quantity: item.quantity,
        })),
      },
    };

    console.log("🚀 SUBMITTING ORDER:");
    console.log("  - finalSourceParam:", finalSourceParam);
    console.log("  - finalIsExternalScan:", finalIsExternalScan);
    console.log("  - Order data:", orderData);

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

        // Navigate to order review with success state
        // navigate(`/mobile/restaurant/${restaurant.id}/order-placed`, {
        navigate(`/mobile/restaurant/${restaurant.id}/order-review`, {
          state: {
            orderData: result.data,
            restaurant,
            totalPrice: getTotalPrice(),
            totalItems: getTotalItems(),
            items,
            note,
            isExternalScan: finalIsExternalScan, // Pass the external scan flag
            sourceParam: finalSourceParam, // Pass the source parameter
            showSuccessImmediately: true, // Flag to show success immediately
          },
        });
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
                {item.price != null && item.price !== undefined && item.price > 0 && (
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

      {/* Note Section */}
      <div className="mx-4 mt-4">
        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center mb-3">
            <div className="w-5 h-5 bg-gray-900 rounded-sm flex items-center justify-center mr-2">
              <span className="text-white text-xs">📝</span>
            </div>
            <span className="font-semibold text-gray-900">
              Note for the restaurant
            </span>
          </div>
          {note && (
            <div className="text-gray-600 border-b border-dashed border-gray-400 pb-1">
              {note}
            </div>
          )}
          {!note && (
            <button
              onClick={() => setShowNoteDialog(true)}
              className="text-gray-500 text-sm"
            >
              Add a note for the restaurant
            </button>
          )}
        </div>
      </div>

      {/* Place Order Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <Button
          onClick={handlePlaceOrder}
          disabled={items.length === 0 || isSubmitting}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl text-lg font-semibold disabled:opacity-50"
        >
          {isSubmitting ? "Placing Order..." : "Place Order"}
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
                placeholder="do not add egg in the noodles"
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
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium shadow-lg"
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
