import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { restaurantApi } from "@/services/restaurantApi";

interface ContactFormData {
  customer_mobile: string;
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
  const siteID = localStorage.getItem("site_id");
  const orgID = localStorage.getItem("org_id");
  const facilitySetupData = localStorage.getItem("facility_setup");
  const facilityData = facilitySetupData ? JSON.parse(facilitySetupData) : null;
  
  // Check for token-based authentication
  const appToken = localStorage.getItem("app_token");
  const appUserInfo = localStorage.getItem("app_user_info");
  const userInfo = appUserInfo ? JSON.parse(appUserInfo) : null;
  
  console.log("📋 STORED DATA:");
  console.log("  - siteID:", siteID);
  console.log("  - orgID:", orgID);
  console.log("  - facilityData:", facilityData);
  console.log("  - appToken:", appToken);
  console.log("  - userInfo:", userInfo);

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

  // Get facility ID from URL params or passed state or localStorage
  const storedFacilityId = localStorage.getItem("facility_id");
  const finalFacilityId = searchParams.get("facilityId") || facilityId || storedFacilityId;
  // Get source parameter from URL or passed state
  const finalSourceParam = searchParams.get("source") || sourceParam;
  const finalIsExternalScan = isExternalScan || finalSourceParam === "external";
  const finalIsAppUser = finalSourceParam === "app" || appToken;

  // 🔍 Debug logging
  console.log("📋 CONTACT FORM - SOURCE DETECTION:");
  console.log("  - URL source param:", searchParams.get("source"));
  console.log("  - Passed sourceParam:", sourceParam);
  console.log("  - Final sourceParam:", finalSourceParam);
  console.log("  - Final isExternalScan:", finalIsExternalScan);
  console.log("  - Final isAppUser:", finalIsAppUser);
  console.log("  - appToken present:", !!appToken);
  console.log("  - URL facilityId:", searchParams.get("facilityId"));
  console.log("  - Passed facilityId:", facilityId);
  console.log("  - Stored facilityId:", storedFacilityId);
  console.log("  - Final facilityId:", finalFacilityId);
  console.log("  - Passed siteId:", siteId);
  console.log("  - Stored siteID:", siteID);

  const [formData, setFormData] = useState<ContactFormData>({
    customer_mobile: userInfo?.mobile || "",
    customer_name: userInfo?.name || "",
    customer_email: userInfo?.email || "",
    delivery_address: "",
  });  console.log("formData", formData);

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

  // Validation functions
  const validateMobile = (mobile: string) => {
    const mobileRegex = /^[6-9]\d{9}$/; // Indian mobile number format
    return mobileRegex.test(mobile);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormValid = () => {
    const errors = [];
    
    // Check required fields
    if (!formData.customer_name.trim()) {
      errors.push("Name is required");
    }
    
    if (!formData.customer_mobile.trim()) {
      errors.push("Mobile number is required");
    } else if (!validateMobile(formData.customer_mobile)) {
      errors.push("Please enter a valid 10-digit mobile number");
    }
    
    if (!formData.customer_email.trim()) {
      errors.push("Email is required");
    } else if (!validateEmail(formData.customer_email)) {
      errors.push("Please enter a valid email address");
    }
    
    if (!formData.delivery_address.trim()) {
      errors.push("Delivery address is required");
    }
    
    return { isValid: errors.length === 0, errors };
  };

  const handleSubmit = async () => {
    const validation = isFormValid();
    
    if (!validation.isValid) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: validation.errors.join(", "),
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Priority 1: Token-based order for authenticated app users
      if (appToken) {
        console.log("🔑 TOKEN USER: Placing order with token authentication");
        
        const tokenOrderData = {
          token: appToken,
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

        console.log("📡 SUBMITTING TOKEN ORDER:", tokenOrderData);

        const result = await restaurantApi.createTokenOrder(tokenOrderData);
        console.log("📡 TOKEN ORDER API Response:", result);

        if (result.success && result.data) {
          console.log("✅ Token order placed successfully:", result.data);

          // Navigate to order review with success state
          navigate(`/mobile/restaurant/${restaurant.id}/order-review`, {
            state: {
              orderData: {
                id: result.data.order_id,
                restaurant_name: result.data.restaurant_name || restaurant.name,
                customer_name: result.data.customer_name || formData.customer_name,
                total_amount: result.data.total_amount,
                message: result.data.message,
              },
              restaurant,
              totalPrice: result.data.total_amount,
              totalItems: totalItems,
              items,
              note,
              contactDetails: formData,
              isTokenUser: true,
              showSuccessImmediately: true,
            },
          });
          return; // Exit early on success
        } else {
          console.error("❌ Token order placement failed:", result.message);
          toast({
            variant: "destructive",
            title: "Order Failed",
            description: result.message || "Failed to place order. Please try again.",
          });
          return; // Exit on failure
        }
      }

      // Priority 2: External QR scan users
      console.log("🚀 EXTERNAL USER: Placing order with contact details");

      if (finalIsExternalScan && finalFacilityId && (siteId || siteID)) {
        // Use new QR order API for external users
        const deliveryLocation = facilityData?.fac_name || formData.delivery_address;
        const finalSiteId = siteId || parseInt(siteID || "0");
        
        const qrOrderData = {
          customer_name: formData.customer_name,
          customer_number: formData.customer_mobile, // API expects customer_number field
          customer_email: formData.customer_email,
          delivery_address: deliveryLocation,
          facility_id: parseInt(finalFacilityId),
          site_id: finalSiteId,
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
                id: result.data.order_id, // Use actual order ID from API response
                restaurant_name: result.data.restaurant_name || restaurant.name,
                customer_name: result.data.customer_name || formData.customer_name,
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
        // Priority 3: Fallback to regular order API for internal users or missing data
        console.log("📱 FALLBACK: Using regular order API");

        // Get user from localStorage
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        const userId = user?.id || null; // Use a default user ID for fallback

        const deliveryLocation = facilityData?.fac_name || formData.delivery_address;

        const orderData = {
          customer_name: formData.customer_name,
          customer_number: formData.customer_mobile, // API expects customer_number field
          customer_email: formData.customer_email,
          delivery_address: deliveryLocation,
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
              orderData: {
                id: result.data.order_id, // Use actual order ID from API response
                restaurant_name: result.data.restaurant_name || restaurant.name,
                customer_name: result.data.customer_name || formData.customer_name,
                total_amount: result.data.total_amount || totalPrice,
                message: result.data.message,
              },
              restaurant,
              totalPrice: result.data.total_amount || totalPrice,
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
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={handleBack} className="mr-4">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Order Review</h1>
          </div>
          {finalIsAppUser && (
            <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              App User
            </div>
          )}
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
                Contact Number <span className="text-red-500">*</span>
                {appToken && userInfo?.mobile && (
                  <span className="text-xs text-gray-500 ml-2">(From App)</span>
                )}
              </Label>
              <Input
                id="customer_mobile"
                type="tel"
                placeholder="Enter Your 10-digit Mobile Number"
                value={formData.customer_mobile}
                onChange={(e) => {
                  // Only allow digits and limit to 10 characters
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  handleInputChange("customer_mobile", value);
                }}
                maxLength={10}
                readOnly={appToken && userInfo?.mobile}
                className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  appToken && userInfo?.mobile ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
              />
            </div>

            {/* Name */}
            <div>
              <Label
                htmlFor="customer_name"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Name <span className="text-red-500">*</span>
                {appToken && userInfo?.name && (
                  <span className="text-xs text-gray-500 ml-2">(From App)</span>
                )}
              </Label>
              <Input
                id="customer_name"
                type="text"
                placeholder="Enter Your Full Name"
                value={formData.customer_name}
                onChange={(e) =>
                  handleInputChange("customer_name", e.target.value)
                }
                readOnly={appToken && userInfo?.name}
                className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  appToken && userInfo?.name ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
              />
            </div>

            {/* Email */}
            <div>
              <Label
                htmlFor="customer_email"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Email <span className="text-red-500">*</span>
                {appToken && userInfo?.email && (
                  <span className="text-xs text-gray-500 ml-2">(From App)</span>
                )}
              </Label>
              <Input
                id="customer_email"
                type="email"
                placeholder="Enter Your Email Address"
                value={formData.customer_email}
                onChange={(e) =>
                  handleInputChange("customer_email", e.target.value.toLowerCase())
                }
                readOnly={appToken && userInfo?.email}
                className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  appToken && userInfo?.email ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
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
                placeholder=""
                value={formData.delivery_address}
                onChange={(e) =>
                  handleInputChange("delivery_address", e.target.value)
                }
                readOnly={true}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50 cursor-not-allowed"
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
