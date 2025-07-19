import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Plus } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { fetchRestaurants } from "@/store/slices/f&bSlice";

interface DaySchedule {
  dayofweek: string;
}

interface Restaurant {
  id: number;
  name: string;
  mon: number;
  tue: number;
  wed: number;
  thu: number;
  fri: number;
  sat: number;
  sun: number;
  status: number;
  can_order: number;
  booking_allowed: number;
  bookingAllowed: boolean;
  orderAllowed: boolean;
  active: boolean;
  restaurant_operations: DaySchedule[]
}

export const FnBRestaurantDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const handleViewRestaurant = (id: number) => {
    navigate(`/vas/fnb/details/${id}`);
  };

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await dispatch(fetchRestaurants({ baseUrl, token })).unwrap();
        setRestaurants(response);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };
    fetchRestaurant();
  }, [])

  const toggleBookingAllowed = (id: number) => {
    setRestaurants((prev) =>
      prev.map((restaurant) =>
        restaurant.id === id
          ? {
            ...restaurant,
            bookingAllowed: !restaurant.bookingAllowed,
          }
          : restaurant
      )
    );
  };
  const toggleOrderAllowed = (id: number) => {
    setRestaurants((prev) =>
      prev.map((restaurant) =>
        restaurant.id === id
          ? {
            ...restaurant,
            orderAllowed: !restaurant.orderAllowed,
          }
          : restaurant
      )
    );
  };
  const toggleActive = (id: number) => {
    setRestaurants((prev) =>
      prev.map((restaurant) =>
        restaurant.id === id
          ? {
            ...restaurant,
            active: !restaurant.active,
          }
          : restaurant
      )
    );
  };
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center text-sm text-[#1a1a1a] opacity-70 mb-2">
          <span>Restaurant</span>
          <span className="mx-2">&gt;</span>
          <span>Restaurant List</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">RESTAURANT</h1>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <Button
          onClick={() => navigate("/vas/fnb/add")}
          className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-md flex items-center gap-2 border-0"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  View
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Open Days
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking Allowed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Allowed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {restaurants.map((restaurant) => {
                const dayMap = {
                  monday: 'M',
                  tuesday: 'T',
                  wednesday: 'W',
                  thursday: 'T',
                  friday: 'F',
                  saturday: 'S',
                  sunday: 'S',
                };

                let openDays = restaurant.restaurant_operations
                  .map(op => dayMap[op.dayofweek.toLowerCase()])
                  .filter(Boolean)
                  .join(', ');

                return (
                  <tr key={restaurant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewRestaurant(restaurant.id)}
                        className="text-stone-800"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {restaurant.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {openDays}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${restaurant.booking_allowed
                            ? "bg-green-500"
                            : "bg-gray-300"
                            }`}
                          onClick={() => toggleBookingAllowed(restaurant.id)}
                        >
                          <span
                            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${restaurant.booking_allowed
                              ? "translate-x-6"
                              : "translate-x-1"
                              }`}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${restaurant.can_order
                            ? "bg-green-500"
                            : "bg-gray-300"
                            }`}
                          onClick={() => toggleOrderAllowed(restaurant.id)}
                        >
                          <span
                            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${restaurant.can_order
                              ? "translate-x-6"
                              : "translate-x-1"
                              }`}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${restaurant.status ? "bg-green-500" : "bg-gray-300"
                            }`}
                          onClick={() => toggleActive(restaurant.id)}
                        >
                          <span
                            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${restaurant.status
                              ? "translate-x-6"
                              : "translate-x-1"
                              }`}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
