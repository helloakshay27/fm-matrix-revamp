import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { restaurantApi } from "@/services/restaurantApi";

interface ContactFormData {
  customer_number: string;
  customer_name: string;
  customer_email: string;
  delivery_address: string;
}

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

export const MobileContactForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const siteID = localStorage.getItem('site_id');
  const orgID = localStorage.getItem('org_id')
  console.log("idssss", siteID, orgID);

  const {
    selectedItems: items,
    restaurant,
    note,
    totalPrice,
    totalItems,
    isExternalScan,
    sourceParam,
    facilityId,
    siteId,
  } = location.state as {
    selectedItems: MenuItem[];
    restaurant: Restaurant;
    note?: string;
    totalPrice?: number;
    totalItems?: number;
    isExternalScan?: boolean;
    sourceParam?: string;
    facilityId?: string;
    siteId?: number;
  };

  // Get facility ID from URL params or passed state
  const finalFacilityId = searchParams.get('facilityId') || facilityId;
  // Get source parameter from URL or passed state
  const finalSourceParam = searchParams.get("source") || sourceParam;
  const finalIsExternalScan = isExternalScan || finalSourceParam === "external";

  // 🔍 Debug logging
  console.log("📋 CONTACT FORM - EXTERNAL DETECTION:");
  console.log("  - URL source param:", searchParams.get("source"));
  console.log("  - Passed sourceParam:", sourceParam);
  console.log("  - Final sourceParam:", finalSourceParam);
  console.log("  - Final isExternalScan:", finalIsExternalScan);
  console.log("  - URL facilityId:", searchParams.get('facilityId'));
  console.log("  - Passed facilityId:", facilityId);
  console.log("  - Final facilityId:", finalFacilityId);
  console.log("  - Passed siteId:", siteId);

  const [formData, setFormData] = useState<ContactFormData>({
    customer_number: "",
    customer_name: "",
    customer_email: "",
    delivery_address: "",
  });

  console.log("formData", formData);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid = () => {
    return (
      formData.customer_number.trim() !== "" &&
      formData.customer_name.trim() !== "" &&
      formData.customer_email.trim() !== "" &&
      formData.delivery_address.trim() !== ""
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("🚀 EXTERNAL USER: Placing order with contact details");

      if (finalIsExternalScan && finalFacilityId && siteId) {
        // Use new QR order API for external users
        const qrOrderData = {
          customer_name: formData.customer_name,
          customer_mobile: formData.customer_number,
          customer_email: formData.customer_email,
          delivery_address: formData.delivery_address,
          facility_id: parseInt(finalFacilityId),
          site_id: siteId,
          food_order: {
            restaurant_id: parseInt(restaurant.id),
            preferred_time: undefined, // Can be added later if needed
            requests: note || "",
            items_attributes: items.map((item) => ({
              menu_id: parseInt(item.id),
              quantity: item.quantity,
            })),
          },
        };

        console.log("📡 SUBMITTING QR ORDER:", qrOrderData);

        const result = await restaurantApi.createQROrder(qrOrderData);
        console.log("📡 QR ORDER API Response:", result);

        if (result.success && result.data) {
          console.log("✅ QR order placed successfully:", result.data);

          // Navigate to order review with success state for external users
          navigate(`/mobile/restaurant/${restaurant.id}/order-review`, {
            state: {
              orderData: {
                id: result.data.order_id,
                restaurant_name: result.data.restaurant_name,
                customer_name: result.data.customer_name,
                total_amount: result.data.total_amount,
                message: result.data.message,
              },
              restaurant,
              totalPrice: result.data.total_amount,
              totalItems: totalItems,
              items,
              note,
              contactDetails: formData,
              isExternalScan: finalIsExternalScan,
              sourceParam: finalSourceParam,
              showSuccessImmediately: true, // Show success immediately for external users
            },
          });
        } else {
          console.error("❌ QR order placement failed:", result.message);
          toast({
            variant: "destructive",
            title: "Order Failed",
            description:
              result.message || "Failed to place order. Please try again.",
          });
        }
      } else {
        // Fallback to regular order API for internal users or missing data
        console.log("📱 FALLBACK: Using regular order API");
        
        // Get user from localStorage
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        const userId = user?.id || null; // Use a default user ID for fallback

        const orderData = {
          customer_name: formData.customer_name,
          customer_mobile: formData.customer_number,
          customer_email: formData.customer_email,
          delivery_address: formData.delivery_address,
          facility_id: parseInt(finalFacilityId || "0"),
          site_id: parseInt(siteID || "0"),
          food_order: {
            restaurant_id: parseInt(restaurant.id),
            preferred_time: undefined,
            requests: note || "",
            items_attributes: items.map((item) => ({
              menu_id: parseInt(item.id),
              quantity: item.quantity,
            })),
          },
        };

        console.log("📡 SUBMITTING FALLBACK ORDER:", orderData);

        // const result = await restaurantApi.placeOrder(orderData);
        const result = await restaurantApi.createQROrder(orderData);
        console.log("📡 FALLBACK API Response:", result);

        if (result.success) {
          console.log("✅ Fallback order placed successfully:", result.data);

          // Navigate to order review with success state
          navigate(`/mobile/restaurant/${restaurant.id}/order-review`, {
            state: {
              orderData: result.data,
              restaurant,
              totalPrice: totalPrice,
              totalItems: totalItems,
              items,
              note,
              contactDetails: formData,
              isExternalScan: finalIsExternalScan,
              sourceParam: finalSourceParam,
              showSuccessImmediately: true,
            },
          });
        } else {
          console.error("❌ Fallback order placement failed:", result.message);
          toast({
            variant: "destructive",
            title: "Order Failed",
            description:
              result.message || "Failed to place order. Please try again.",
          });
        }
      }
    } catch (error) {
      console.error("Network error during order placement:", error);
      toast({
        variant: "destructive",
        title: "Network Error",
        description: "Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

      {/* Contact Details Form */}
      <div className="p-4">
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Contact Details
            </h2>
          </div>

          <div className="p-4 space-y-6">
            {/* Contact Number */}
            <div>
              <Label
                htmlFor="customer_mobile"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Contact Number
              </Label>
              <Input
                id="customer_number"
                type="tel"
                placeholder="Enter Your Number"
                value={formData.customer_number}
                onChange={(e) =>
                  handleInputChange("customer_number", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Name */}
            <div>
              <Label
                htmlFor="customer_name"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Name
              </Label>
              <Input
                id="customer_name"
                type="text"
                placeholder="Enter Your Name"
                value={formData.customer_name}
                onChange={(e) => handleInputChange("customer_name", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Email */}
            <div>
              <Label
                htmlFor="customer_email"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Email
              </Label>
              <Input
                id="customer_email"
                type="email"
                placeholder="Enter Your Mail ID"
                value={formData.customer_email}
                onChange={(e) => handleInputChange("customer_email", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Delivery Location */}
            <div>
              <Label
                htmlFor="delivery_address"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Delivery Location
              </Label>
              <Input
                id="delivery_address"
                type="text"
                placeholder="Room no-402, Floor 2, Worli (W), 400028"
                value={formData.delivery_address}
                onChange={(e) =>
                  handleInputChange("delivery_address", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl text-lg font-semibold disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Submitting...
            </div>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </div>
  );
};
