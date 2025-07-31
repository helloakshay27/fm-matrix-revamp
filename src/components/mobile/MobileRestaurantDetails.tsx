import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  MapPin,
  Star,
  Users,
  Percent,
  Plus,
  Minus,
} from "lucide-react";
import {
  useNavigate,
  useParams,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Restaurant as ApiRestaurant } from "@/services/restaurantApi";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity?: number;
}

interface MenuImage {
  id: number;
  relation: string;
  relation_id: number;
  document: string;
}

interface Restaurant {
  id: string;
  name: string;
  location: string;
  rating: number;
  timeRange: string;
  discount: string;
  image: string;
  images?: string[]; // Array of images for carousel
  menu_images?: MenuImage[]; // Array of menu image objects
  menuItems?: MenuItem[]; // Make optional to match API
}

interface MobileRestaurantDetailsProps {
  restaurant: Restaurant;
}

export const MobileRestaurantDetails: React.FC<
  MobileRestaurantDetailsProps
> = ({ restaurant }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // 🔍 Check if user is from external scan (Google Lens, etc.)
  const sourceParam = searchParams.get("source");
  const isExternalScan = sourceParam === "external";

  // 🔍 Debug logging for external detection in Restaurant Details
  useEffect(() => {
    console.log("🏪 RESTAURANT DETAILS - EXTERNAL DETECTION:");
    console.log("  - URL source param:", sourceParam);
    console.log("  - isExternalScan:", isExternalScan);
    console.log("  - Current URL:", window.location.href);
  }, [searchParams, sourceParam, isExternalScan]);

  const [menuItems, setMenuItems] = useState<MenuItem[]>(
    restaurant.menuItems || []
  );
  const [showItems, setShowItems] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [selectedMenuImage, setSelectedMenuImage] = useState<string | null>(
    null
  );

  // Restore preserved cart when coming back from items details
  useEffect(() => {
    // Get preserved cart from navigation state (when coming back from items details)
    const preservedCart =
      (location.state as { preservedCart?: MenuItem[] })?.preservedCart || [];

    if (preservedCart.length > 0) {
      console.log("🔄 RESTORING PRESERVED CART:", preservedCart);

      // Create a map of preserved items for quick lookup
      const preservedItemsMap = new Map(
        preservedCart.map((item) => [item.id, item.quantity || 0])
      );

      // Update menu items with preserved quantities
      setMenuItems((prevItems) =>
        prevItems.map((item) => ({
          ...item,
          quantity: preservedItemsMap.get(item.id) || 0,
        }))
      );
    }
  }, [location.state]);

  // Get all available images (cover images + fallback)
  const availableImages =
    restaurant.images && restaurant.images.length > 0
      ? restaurant.images
      : [restaurant.image];

  // Auto-slide effect with 5-second interval
  useEffect(() => {
    if (availableImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % availableImages.length);
      }, 5000); 

      return () => clearInterval(interval);
    }
  }, [availableImages.length]);

  const handleBack = () => {
    navigate(-1);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % availableImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + availableImages.length) % availableImages.length
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleMenuClick = () => {
    setShowMenuModal(true);
  };

  const handlePreviewImage = (imageUrl: string) => {
    setSelectedMenuImage(imageUrl);
  };

  const handleDownloadImage = async (imageUrl: string, fileName?: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || `menu-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const closeMenuModal = () => {
    setShowMenuModal(false);
    setSelectedMenuImage(null);
  };

  const updateQuantity = (itemId: string, change: number) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newQuantity = Math.max(0, (item.quantity || 0) + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const addItem = (itemId: string) => {
    updateQuantity(itemId, 1);
  };

  const getSelectedItems = () => {
    return menuItems.filter((item) => item.quantity && item.quantity > 0);
  };

  const getTotalItems = () => {
    return menuItems.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const handleShowItems = () => {
    const selectedItems = getSelectedItems();
    if (selectedItems.length > 0) {
      console.log("🛒 NAVIGATING TO ITEMS:");
      console.log("  - sourceParam:", sourceParam);
      console.log("  - isExternalScan:", isExternalScan);
      console.log(
        "  - Will navigate with source param:",
        sourceParam || "none"
      );

      // Construct URL with source parameter if any source exists
      const itemsUrl = sourceParam
        ? `/mobile/restaurant/${restaurant.id}/items?source=${sourceParam}`
        : `/mobile/restaurant/${restaurant.id}/items`;

      navigate(itemsUrl, {
        state: { selectedItems, restaurant, isExternalScan, sourceParam },
      });
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
          <h1 className="text-lg font-semibold text-gray-900">
            Restaurant Details
          </h1>
        </div>
      </div>

      {/* Restaurant Hero Image Carousel */}
      <div className="relative">
        <div className="h-64 bg-gray-300 overflow-hidden relative">
          {/* Image Container */}
          <div
            className={`flex transition-transform duration-300 ease-in-out h-full`}
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {availableImages.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`${restaurant.name} - Image ${index + 1}`}
                className="w-full h-full object-cover flex-shrink-0"
              />
            ))}
          </div>

          {/* Navigation Arrows - Only show if more than 1 image */}
          {availableImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </button>
            </>
          )}
        </div>

        {/* Discount Badge */}
        <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full flex items-center">
          <Percent className="w-4 h-4 mr-1" />
          <span className="text-sm font-semibold">{restaurant.discount}</span>
        </div>

        {/* Pagination dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {availableImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentImageIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="bg-white p-4">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-bold text-gray-900">{restaurant.name}</h2>
          <div className="flex items-center bg-orange-100 px-2 py-1 rounded-lg">
            <span className="text-sm font-semibold text-gray-900 mr-1">
              {restaurant.rating ? Number(restaurant.rating).toFixed(1) : "4.0"}
            </span>
            <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
          </div>
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{restaurant.location}</span>
        </div>

        <div className="flex items-center text-gray-500 text-sm">
          {/* <Users className="w-4 h-4 mr-1" /> */}
          {/* <span>{restaurant.timeRange}</span> */}
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-4">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="bg-[#E8E2D3] rounded-lg overflow-hidden relative"
          >
            <div className="flex p-4">
              {/* Item Details */}
              <div className="flex-1 pr-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {item.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {item.description || "Delicious & fresh"}
                </p>
                {/* Price */}
                {item.price != null &&
                  item.price !== undefined &&
                  item.price > 0 && (
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base font-semibold text-white bg-red-600 px-2 py-1 rounded">
                          ORM{item.price}
                        </span>
                        {/* Optional original price if discount */}
                        {/* <span className="text-sm text-gray-400 line-through">ORM{item.originalPrice}</span> */}
                      </div>
                      <div className="text-xs text-gray-500">
                        Price per item
                      </div>
                    </>
                  )}
              </div>

              {/* Item Image */}
              <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden relative">
                <img
                  src={
                    item.image ||
                    "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=300&h=200"
                  }
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=300&h=200";
                  }}
                />

                {/* Add Button - Fully visible below image */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  {!item.quantity || item.quantity === 0 ? (
                    <Button
                      onClick={() => addItem(item.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg border border-red-700"
                    >
                      Add
                    </Button>
                  ) : (
                    <div className="flex items-center border-2 border-red-600 rounded-lg bg-white shadow-lg">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-2 py-1 text-red-600 hover:bg-red-50 text-lg font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-gray-900 font-medium min-w-[30px] text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-2 py-1 text-red-600 hover:bg-red-50 text-lg font-bold"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show Items Button */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <Button
            onClick={handleShowItems}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl text-lg font-semibold"
          >
            Show Items
          </Button>
        </div>
      )}

      {/* Menu Button */}
      <div className="fixed bottom-4 right-4">
        <Button
          onClick={handleMenuClick}
          className="bg-white text-gray-900 border border-gray-300 px-6 py-3 rounded-xl shadow-lg flex items-center"
        >
          <span className="mr-2">🍽️</span>
          Menu
        </Button>
      </div>

      {/* Menu Images Modal */}
      {showMenuModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Menu Images</h3>
              <button
                onClick={closeMenuModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-4">
              {restaurant?.menu_images && restaurant.menu_images.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {restaurant.menu_images.map((menuImage, index) => (
                    <div key={menuImage.id} className="relative group">
                      <img
                        src={menuImage.document}
                        alt={`Menu ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => handlePreviewImage(menuImage.document)}
                        onError={(e) => {
                          console.error(
                            "Failed to load image:",
                            menuImage.document
                          );
                          e.currentTarget.src =
                            "https://via.placeholder.com/200x150/f0f0f0/999999?text=Image+Not+Found";
                        }}
                      />
                      <button
                        onClick={() =>
                          handleDownloadImage(
                            menuImage.document,
                            `menu-${index + 1}.jpg`
                          )
                        }
                        className="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Download"
                      >
                        📥
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center py-4 text-gray-500">
                    No menu images available
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedMenuImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-60 flex items-center justify-center p-4">
          <div className="relative max-w-full max-h-full">
            <button
              onClick={() => setSelectedMenuImage(null)}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10"
            >
              ✕
            </button>
            <img
              src={selectedMenuImage}
              alt="Menu Preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() =>
                handleDownloadImage(selectedMenuImage, "menu-preview.jpg")
              }
              className="absolute bottom-4 right-4 bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
