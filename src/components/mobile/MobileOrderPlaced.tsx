import React, { useEffect } from "react";
import { ArrowLeft, CheckCircle, Clock, MapPin, Phone } from "lucide-react";
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

export const MobileOrderPlaced: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const {
    orderData,
    restaurant,
    totalPrice,
    totalItems,
    items,
    note,
    isExternalScan: passedExternalScan,
  } = location.state as {
    orderData: { id?: string; [key: string]: unknown };
    restaurant: Restaurant;
    totalPrice: number;
    totalItems: number;
    items: MenuItem[];
    note?: string;
    isExternalScan?: boolean;
  };

  // Check if user is from external scan (Google Lens, etc.)
  const isExternalScan =
    passedExternalScan || searchParams.get("source") === "external";

  // Auto-redirect after 5 seconds based on user type
  //   useEffect(() => {
  //     const timer = setTimeout(() => {
  //       if (isExternalScan) {
  //         // External scan users: show order review details
  //         navigate(`/mobile/restaurant/${restaurant.id}/order-review`, {
  //           state: {
  //             items,
  //             restaurant,
  //             note,
  //             isExistingOrder: true,
  //             orderData,
  //             totalPrice,
  //             totalItems,
  //           },
  //         });
  //       } else {
  //         // App users: go to My Orders
  //         navigate("/mobile/orders");
  //       }
  //     }, 5000);

  //     return () => clearTimeout(timer);
  //   }, [
  //     navigate,
  //     isExternalScan,
  //     restaurant.id,
  //     items,
  //     restaurant,
  //     note,
  //     orderData,
  //     totalPrice,
  //     totalItems,
  //   ]);

  const handleBackToHome = () => {
    navigate("/mobile/restaurant");
  };

  const handleTrackOrder = () => {
    // Navigate to order tracking page if you have one
    navigate(`/mobile/order/${orderData?.id || "track"}`);
  };

  const estimatedTime = "25-30 mins"; // You can get this from orderData if available

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center">
          <button onClick={handleBackToHome} className="mr-4">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Order Placed</h1>
        </div>
      </div>

      {/* Success Message */}
      <div className="bg-white mx-4 mt-4 rounded-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Order Placed Successfully!
        </h2>
        <p className="text-gray-600 mb-4">
          Your order has been confirmed and is being prepared
        </p>

        {/* Order ID */}
        {orderData?.id && (
          <div className="bg-gray-100 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-semibold text-gray-900">#{orderData.id}</p>
          </div>
        )}

        {/* Estimated Time */}
        <div className="flex items-center justify-center text-orange-600 mb-4">
          <Clock className="w-5 h-5 mr-2" />
          <span className="font-medium">
            Estimated delivery: {estimatedTime}
          </span>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="bg-white mx-4 mt-4 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Restaurant Details</h3>
        <div className="flex items-start">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-16 h-16 rounded-lg object-cover mr-4"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{restaurant.name}</h4>
            <div className="flex items-center text-gray-600 text-sm mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{restaurant.location}</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm mt-1">
              <Phone className="w-4 h-4 mr-1" />
              <span>Call restaurant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white mx-4 mt-4 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>

        {/* Items */}
        <div className="space-y-3 mb-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex-1">
                <span className="text-gray-900 font-medium">{item.name}</span>
                <div className="text-sm text-gray-600">
                  ₹{item.price} × {item.quantity}
                </div>
              </div>
              <span className="font-semibold text-gray-900">
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">
              Total Amount
            </span>
            <span className="text-xl font-bold text-red-600">
              ₹{totalPrice}
            </span>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {totalItems} item{totalItems > 1 ? "s" : ""}
          </div>
        </div>

        {/* Note if exists */}
        {note && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-600">Special Instructions:</p>
            <p className="text-gray-900 italic">"{note}"</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {/* <div className="mx-4 mt-6 space-y-3 pb-6">
        <Button
          onClick={handleTrackOrder}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl text-lg font-semibold"
        >
          Track Your Order
        </Button>
  <Button
          onClick={handleBackToHome}
          variant="outline"
          className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-4 rounded-xl text-lg font-semibold"
        >
          Order More Food
        </Button>
      
      </div> */}

      {/* View Order Details Button */}
      <div className="mx-4 mt-6 space-y-3 pb-6">
        <Button
          onClick={handleBackToHome}
          variant="outline"
          className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-4 rounded-xl text-lg font-semibold"
        >
          Order More Food
        </Button>
        <Button
          onClick={() => {
            if (isExternalScan) {
              navigate(`/mobile/restaurant/${restaurant.id}/order-review`, {
                state: {
                  items,
                  restaurant,
                  note,
                  isExistingOrder: true,
                  orderData,
                  totalPrice,
                  totalItems,
                },
              });
            } else {
              navigate(`/mobile/orders`);
            }
          }}
          variant="outline"
          className="w-full border-2 border-red-600 text-red-600 bg-white hover:bg-red-50 py-4 rounded-xl text-lg font-medium"
        >
          View Order Details
        </Button>
      </div>
    </div>
  );
};
