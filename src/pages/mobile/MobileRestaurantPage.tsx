import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { MobileRestaurantWelcome } from '@/components/mobile/MobileRestaurantWelcome';
import { MobileRestaurantDashboard } from '@/components/mobile/MobileRestaurantDashboard';
import { MobileRestaurantDetails } from '@/components/mobile/MobileRestaurantDetails';
import { MobileItemsDetails } from '@/components/mobile/MobileItemsDetails';
import { MobileContactForm } from '@/components/mobile/MobileContactForm';
import { MobileOrderReview } from '@/components/mobile/MobileOrderReview';
import { useToast } from '@/hooks/use-toast';
import { restaurantApi } from '@/services/restaurantApi';

// Mock data - replace with actual API calls
const mockRestaurants = [
  {
    id: '1',
    name: 'The Bawa Kitchen',
    location: 'Andheri West',
    rating: 4.1,
    timeRange: '60-65 mins',
    discount: '20% OFF',
    image: '/placeholder.svg',
    menuItems: [
      {
        id: '1',
        name: 'Chicken Noodles',
        description: 'Noodles + Manchurian + Sauces',
        price: 250,
        image: '/placeholder.svg'
      },
      {
        id: '2',
        name: 'Veggie Burger',
        description: 'Plant-based patty + Lettuce + Tomato',
        price: 180,
        image: '/placeholder.svg'
      },
      {
        id: '3',
        name: 'Grilled Salmon',
        description: 'Salmon fillet + Garlic butter + Lemon',
        price: 450,
        image: '/placeholder.svg'
      },
      {
        id: '4',
        name: 'Spicy Tacos',
        description: 'Chicken + Spices + Fresh salsa',
        price: 220,
        image: '/placeholder.svg'
      }
    ]
  }
];

export const MobileRestaurantPage: React.FC = () => {
  const { action, restaurantId } = useParams();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Determine the view type based on QR scan source
  const scanSource = searchParams.get('source'); // 'app' or 'external'
  
  useEffect(() => {
    // Fetch restaurants from API
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      // For this specific restaurant ID, fetch directly
      if (restaurantId) {
        const restaurant = await restaurantApi.getRestaurantById(restaurantId);
        setRestaurants([restaurant]);
      } else {
        // Use restaurant ID 49 from the API URL provided
        const restaurant = await restaurantApi.getRestaurantById('49');
        setRestaurants([restaurant]);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load restaurant. Please try again."
      });
      // Fallback to mock data
      setRestaurants(mockRestaurants);
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
    case 'dashboard':
      return <MobileRestaurantDashboard restaurants={restaurants} />;
    
    case 'details':
      const restaurant = restaurants.find(r => r.id === restaurantId);
      if (!restaurant) {
        return <div>Restaurant not found</div>;
      }
      return <MobileRestaurantDetails restaurant={restaurant} />;
    
    case 'items':
      return <MobileItemsDetails />;
    
    case 'contact-form':
      return <MobileContactForm />;
    
    case 'order-review':
      return <MobileOrderReview />;
    
    default:
      // Direct menu flow - check restaurant count
      if (restaurants.length > 1) {
        // Multiple restaurants - show dashboard list
        return <MobileRestaurantDashboard restaurants={restaurants} />;
      } else if (restaurants.length === 1) {
        // Single restaurant - show menu directly
        return <MobileRestaurantDetails restaurant={restaurants[0]} />;
      } else {
        return <div>No restaurants available</div>;
      }
  }
};