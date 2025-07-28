import React, { useState, useEffect } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

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

interface ApiOrderData {
  id?: string | number;
  restaurant_id?: number;
  user_society_id?: number | null;
  user_id?: number;
  payment_mode?: string | null;
  sub_total?: number;
  gst?: number;
  service_charge?: number;
  total_amount?: number;
  requests?: string;
  paid_amount?: number | null;
  discount?: number | null;
  payment_status?: string;
  status_id?: number;
  pg_state?: string | null;
  pg_response_code?: string | null;
  pg_response_msg?: string | null;
  pg_order_id?: string | null;
  delivery_boy?: string | null;
  rating?: number | null;
  rating_text?: string | null;
  refund_amount?: number | null;
  refund_text?: string | null;
  created_at?: string;
  updated_at?: string;
  pg_transaction_id?: string | null;
  delivery_charge?: number;
  conv_charge?: number;
  preferred_time?: string | null;
  items?: Array<{
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
  }>;
  restaurant_name?: string;
  order_status?: string;
  order_status_color?: string;
  user_name?: string;
  flat?: string | null;
  user_unit_name?: string | null;
  user_department_name?: string;
  discounted_amount?: number;
  order_qr_code?: string;
  restaurant_cover_images?: Array<{
    id: number;
    relation: string;
    relation_id: number;
    document: string;
  }>;
  comments?: unknown[];
  // Legacy fields for backward compatibility
  user_phone?: string;
  contact_number?: string;
  user_email?: string;
  email?: string;
  delivery_location?: string;
  user_address?: string;
  [key: string]: unknown;
}

export const MobileOrderReview: React.FC = () => {
  // const navigate = useNavigate();
  // const location = useLocation();
  // const [searchParams] = useSearchParams();

  // const {
  //   items,
  //   restaurant,
  //   note,
  //   isExistingOrder,
  //   isExternalScan: passedExternalScan,
  //   orderData,
  //   totalPrice,
  //   totalItems
  // } = location.state as {
  //   items: MenuItem[];
  //   restaurant: Restaurant;
  //   note?: string;
  //   isExistingOrder?: boolean;
  //   isExternalScan?: boolean;
  //   orderData?: { id?: string; [key: string]: unknown };
  //   totalPrice?: number;
  //   totalItems?: number;
  // };

  // // Use passed external scan flag or check URL params
  // const isExternalScan = passedExternalScan || searchParams.get('source') === 'external';

  // const [showSuccess, setShowSuccess] = useState(isExistingOrder || false);

  // const handleBack = () => {
  //   navigate(-1);
  // };

  // const handleViewOrderDetails = () => {
  //   if (isExternalScan) {
  //     // External users stay on order review page
  //     navigate('/mobile/restaurant/order-history');
  //   } else {
  //     // App users go to my orders list page
  //     navigate('/mobile/orders');
  //   }
  // };

  // const getTotalItems = () => {
  //   return totalItems || items.reduce((total, item) => total + item.quantity, 0);
  // };

  // const getTotalPrice = () => {
  //   return totalPrice || items.reduce((total, item) => total + (item.price * item.quantity), 0);
  // };

  // const handleConfirmOrder = () => {
  //   setShowSuccess(true);

  //   // Show success for 5 seconds
  //   setTimeout(() => {
  //     if (!isExternalScan) {
  //       // App user goes to My Orders
  //       navigate('/mobile/orders');
  //     }
  //     // External scan users stay on success page
  //   }, 5000);
  // };

  // // Auto-redirect based on user type after 5 seconds when order is placed
  // useEffect(() => {
  //   if (showSuccess) {
  //     const timer = setTimeout(() => {
  //       if (isExternalScan) {
  //         // External scan users: show order review details
  //         setShowSuccess(false); // Show order review details
  //       } else {
  //         // App users: go to My Orders
  //         navigate('/mobile/orders');
  //       }
  //     }, 5000);

  //     return () => clearTimeout(timer);
  //   }
  // }, [showSuccess, isExternalScan, navigate]);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const {
    items,
    restaurant,
    note,
    isExistingOrder,
    showSuccessImmediately,
    orderData,
    totalPrice,
    totalItems,
    isExternalScan: passedExternalScan,
    sourceParam: passedSourceParam,
    contactDetails,
  } = location.state as {
    items: MenuItem[];
    restaurant: Restaurant;
    note?: string;
    isExistingOrder?: boolean;
    showSuccessImmediately?: boolean;
    orderData?: ApiOrderData;
    totalPrice?: number;
    totalItems?: number;
    isExternalScan?: boolean;
    sourceParam?: string;
    contactDetails?: {
      customer_mobile: string;
      customer_name: string;
      customer_email: string;
      delivery_address: string;
    };
  };

  // Check if user is from external scan (Google Lens, etc.)
  const sourceParam = searchParams.get("source") || passedSourceParam;
  const isExternalScan = passedExternalScan || sourceParam === "external";

  // 🔍 Debug logging for external detection
  useEffect(() => {
    console.log("🔍 EXTERNAL DETECTION DEBUG:");
    console.log("  - passedExternalScan:", passedExternalScan);
    console.log("  - passedSourceParam:", passedSourceParam);
    console.log("  - URL source param:", searchParams.get("source"));
    console.log("  - Final sourceParam:", sourceParam);
    console.log("  - Final isExternalScan:", isExternalScan);
    console.log("  - showSuccessImmediately:", showSuccessImmediately);
    console.log("  - contactDetails:", contactDetails);
    console.log("  - orderData:", orderData);
    console.log("  - Current URL:", window.location.href);
  }, [
    passedExternalScan,
    passedSourceParam,
    isExternalScan,
    sourceParam,
    showSuccessImmediately,
    contactDetails,
    orderData,
    searchParams,
  ]);

  const [showSuccess, setShowSuccess] = useState(
    showSuccessImmediately || false
  );

  // 📊 Debug logging for state changes
  useEffect(() => {
    console.log("📊 STATE CHANGE: showSuccess =", showSuccess);
  }, [showSuccess]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleViewOrderDetails = () => {
    if (isExternalScan) {
      // External users stay on order review page
      navigate("/mobile/restaurant/order-history");
    } else {
      // App users go to my orders list page
      navigate("/mobile/orders");
    }
  };

  const getTotalItems = () => {
    return (
      totalItems || items.reduce((total, item) => total + item.quantity, 0)
    );
  };

  const getTotalPrice = () => {
    return (
      totalPrice ||
      items.reduce((total, item) => total + item.price * item.quantity, 0)
    );
  };

  // Get user details from API response, contact details, or localStorage
  const getUserDetails = () => {
    // Priority 1: For external users, use contact details from the form
    if (contactDetails) {
      return {
        customer_name: contactDetails.customer_name,
        customer_number: contactDetails.customer_mobile,
        customer_email: contactDetails.customer_email,
        delivery_location: contactDetails.delivery_address,
      };
    }

    // Priority 2: Use API response data if available (for existing orders)
    if (orderData && typeof orderData === 'object') {
      const apiOrder = orderData as ApiOrderData;
      if (apiOrder.user_name) {
        // Build delivery location from available fields
        let deliveryLocation = "Default delivery location";
        if (apiOrder.flat) {
          deliveryLocation = apiOrder.flat;
          if (apiOrder.user_department_name) {
            deliveryLocation += `, ${apiOrder.user_department_name}`;
          }
        } else if (apiOrder.user_department_name) {
          deliveryLocation = apiOrder.user_department_name;
        }

        return {
          customer_name: apiOrder.user_name,
          customer_number: apiOrder.user_phone || apiOrder.contact_number || "Not provided",
          customer_email: apiOrder.user_email || apiOrder.email || "Not provided",
          delivery_location: deliveryLocation,
        };
      }
    }

    // Priority 3: For internal users, get from localStorage as fallback
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    
    return {
      customer_name: user?.name || user?.user_name || "User",
      customer_number: user?.mobile || user?.phone || "Not provided",
      customer_email: user?.email || "Not provided", 
      delivery_location: user?.address || user?.flat || "Default delivery location",
    };
  };

  const userDetails = getUserDetails();

  const handleConfirmOrder = () => {
    setShowSuccess(true);
  };

  // Auto-redirect after 5 seconds when success is shown
  useEffect(() => {
    if (showSuccess) {
      console.log("⏰ AUTO-REDIRECT TIMER STARTED:");
      console.log("  - isExternalScan:", isExternalScan);
      console.log("  - Will redirect in 5 seconds...");

      const timer = setTimeout(() => {
        if (isExternalScan) {
          console.log(
            "🎯 EXTERNAL USER: Hiding success, showing order details"
          );
          // External scan users: show order review details (hide success)
          setShowSuccess(false);
        } else {
          console.log("🏠 INTERNAL USER: Redirecting to My Orders");
          // App users: go to My Orders
          navigate("/mobile/orders");
        }
      }, 5000);

      return () => {
        console.log("🛑 Timer cleared");
        clearTimeout(timer);
      };
    }
  }, [showSuccess, isExternalScan, navigate]);

  // if (showSuccess) {
  //   return (
  //     <div className="min-h-screen bg-gray-50">
  //       {/* Header */}
  //       <div className="bg-white border-b border-gray-200 px-4 py-4">
  //         <div className="flex items-center">
  //           <button onClick={handleBack} className="mr-4">
  //             <ArrowLeft className="w-6 h-6 text-gray-600" />
  //           </button>
  //           <h1 className="text-lg font-semibold text-gray-900">Order Review</h1>
  //         </div>
  //       </div>

  //       {/* Success Message */}
  //       <div className="p-4">
  //         <div className="bg-white rounded-lg p-6 text-center mb-4">
  //           <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
  //             <Check className="w-8 h-8 text-white" />
  //           </div>
  //           <h2 className="text-xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
  //           <p className="text-gray-600 mb-4">Your order has been confirmed and is being prepared</p>

  //           {/* Order ID if available */}
  //           {orderData?.id && (
  //             <div className="bg-gray-100 rounded-lg p-3 mb-4">
  //               <p className="text-sm text-gray-600">Order ID</p>
  //               <p className="font-semibold text-gray-900">#{orderData.id}</p>
  //             </div>
  //           )}

  //           {/* Auto redirect message */}
  //           <p className="text-sm text-gray-500">
  //             {isExternalScan
  //               ? "Redirecting to order details in 5 seconds..."
  //               : "Redirecting to My Orders in 5 seconds..."
  //             }
  //           </p>
  //         </div>

  //         {/* Quick Order Summary */}
  //         <div className="bg-white rounded-lg p-4">
  //           <h3 className="font-semibold text-gray-900 mb-3">{restaurant.name}</h3>
  //           <div className="flex justify-between items-center">
  //             <span className="text-gray-600">{getTotalItems()} items</span>
  //             <span className="font-semibold text-red-600">₹{getTotalPrice()}</span>
  //           </div>
  //         </div>
  //       </div>

  //       {/* View Order Details Button */}
  //       <div className="fixed bottom-0 left-0 right-0 p-4">
  //         <Button
  //           onClick={handleViewOrderDetails}
  //           variant="outline"
  //           className="w-full border-2 border-red-600 text-red-600 bg-white hover:bg-red-50 py-4 rounded-xl text-lg font-medium"
  //         >
  //           View Order Details
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center">
            <button onClick={handleBack} className="mr-4">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              Order Review
            </h1>
          </div>
        </div>

        {/* Success Message */}
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="bg-[#E8E2D3] rounded-lg p-8 mx-4 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-gray-400">
              <Check className="w-8 h-8 text-gray-900" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Order Placed Successfully
            </h2>

            {/* Order ID if available */}
            {/* {orderData?.id && (
              <div className="bg-white rounded-lg p-3 mt-4 mb-4">
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-semibold text-gray-900">#{orderData.id}</p>
              </div>
            )} */}

            {/* Auto redirect message */}
            {/* <p className="text-sm text-gray-500 mt-4">
              {isExternalScan 
                ? "Redirecting to order details in 5 seconds..." 
                : "Redirecting to My Orders in 5 seconds..."
              }
            </p> */}
          </div>
        </div>

        {/* View Order Details Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4">
          <Button
            onClick={handleViewOrderDetails}
            variant="outline"
            className="w-full border-2 border-red-600 text-red-600 bg-white hover:bg-red-50 py-4 rounded-xl text-lg font-medium"
          >
            View Order Details
          </Button>
        </div>
      </div>
    );
  }

  // return (
  //   <div className="min-h-screen bg-gray-50">
  //     {/* Header */}
  //     <div className="bg-white border-b border-gray-200 px-4 py-4">
  //       <div className="flex items-center">
  //         <button onClick={handleBack} className="mr-4">
  //           <ArrowLeft className="w-6 h-6 text-gray-600" />
  //         </button>
  //         <h1 className="text-lg font-semibold text-gray-900">Order Review</h1>
  //       </div>
  //     </div>

  //     {/* Order Summary */}
  //     <div className="bg-[#E8E2D3] mx-4 mt-4 rounded-lg p-4">
  //       <div className="flex justify-between items-center mb-4">
  //         <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
  //         <span className="bg-gray-400 text-white px-3 py-1 rounded text-sm">Pending</span>
  //       </div>

  //       <div className="border-t border-gray-400 border-dashed pt-4 mb-4">
  //         <div className="flex justify-between items-center mb-3">
  //           <span className="font-semibold text-gray-900">Order ID</span>
  //           <span className="font-semibold text-gray-900">#32416</span>
  //         </div>

  //         <div className="flex justify-between items-center mb-4">
  //           <span className="font-semibold text-gray-900">{restaurant.name}</span>
  //           <span className="text-gray-600">Total Items - {getTotalItems()}</span>
  //         </div>

  //         {/* Items List */}
  //         {items.map((item) => (
  //           <div key={item.id} className="flex justify-between items-center mb-2">
  //             <span className="text-gray-900">{item.name}</span>
  //             <span className="text-gray-900 font-medium">0{item.quantity}</span>
  //           </div>
  //         ))}
  //       </div>

  //       <div className="border-t border-gray-400 border-dashed pt-4">
  //         <h3 className="font-semibold text-gray-900 mb-3">Details</h3>
  //         <div className="border-t border-gray-400 border-dashed pt-3 space-y-2">
  //           <div className="flex justify-between">
  //             <span className="text-gray-900">Customer Name</span>
  //             <span className="text-gray-900">Abdul Ghaffar</span>
  //           </div>
  //           <div className="flex justify-between">
  //             <span className="text-gray-900">Contact Number</span>
  //             <span className="text-gray-900">9876567891</span>
  //           </div>
  //           <div className="flex justify-between">
  //             <span className="text-gray-900">Delivery Location</span>
  //             <div className="text-right">
  //               <div className="text-gray-900">Room no-402, Floor 2</div>
  //               <div className="text-gray-900">Worli (W), 400028</div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>

  //     {/* Confirm Order Button - Only show for new orders */}
  //     {!isExistingOrder && (
  //       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
  //         <Button
  //           onClick={handleConfirmOrder}
  //           className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl text-lg font-semibold"
  //         >
  //           Confirm Order
  //         </Button>
  //       </div>
  //     )}
  //   </div>
  // );
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center">
          <button onClick={handleBack} className="mr-4">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Order Review</h1>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-[#E8E2D3] mx-4 mt-4 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
          <span className="bg-gray-400 text-white px-3 py-1 rounded text-sm">
            Pending
          </span>
        </div>

        <div className="border-t border-gray-400 border-dashed pt-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-gray-900">Order ID</span>
            <span className="font-semibold text-gray-900">
              #{orderData?.id || "Pending"}
            </span>
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-gray-900">
              {restaurant.name}
            </span>
            <span className="text-gray-600">
              Total Items - {getTotalItems()}
            </span>
          </div>

          {/* Items List */}
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center mb-2"
            >
              <span className="text-gray-900">{item.name}</span>
              <span className="text-gray-900 font-medium">
                {item.quantity < 10 ? `0${item.quantity}` : item.quantity}
              </span>
            </div>
          ))}

          {/* Total Price */}
          <div className="border-t border-gray-400 border-dashed pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total Amount</span>
              <span className="font-semibold text-red-600 text-lg">
                ₹{getTotalPrice()}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-400 border-dashed pt-4">
          <h3 className="font-semibold text-gray-900 mb-3">Details</h3>
          <div className="border-t border-gray-400 border-dashed pt-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-900">Name</span>
              <span className="text-gray-900">{userDetails.customer_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-900">Contact Number</span>
              <span className="text-gray-900">{userDetails.customer_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-900">Email</span>
              <span className="text-gray-900 text-sm break-all">{userDetails.customer_email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-900">Delivery Location</span>
              <div className="text-right max-w-[60%]">
                <div className="text-gray-900 text-sm break-words">
                  {userDetails.delivery_location}
                </div>
              </div>
            </div>
            {note && (
              <div className="flex justify-between">
                <span className="text-gray-900">Note</span>
                <div className="text-right max-w-[60%]">
                  <div className="text-gray-900 text-sm break-words">
                    {note}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Order Button - Only show for new orders */}
      {/* {!isExistingOrder && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <Button
            onClick={handleConfirmOrder}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl text-lg font-semibold"
          >
            Confirm Order
          </Button>
        </div>
      )} */}
    </div>
  );
};
