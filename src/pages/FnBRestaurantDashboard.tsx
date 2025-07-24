import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Plus } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { editRestaurant, fetchRestaurants } from "@/store/slices/f&bSlice";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";

interface DaySchedule {
  is_open: number;
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
  status: boolean;
  can_order: boolean;
  booking_allowed: boolean;
  bookingAllowed: boolean;
  orderAllowed: boolean;
  active: boolean;
  restaurant_operations: DaySchedule[];
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
  }, [dispatch, baseUrl, token]);

  const toggleBookingAllowed = async (id: number) => {
    const restaurantToUpdate = restaurants.find((r) => r.id === id);
    if (!restaurantToUpdate) return;

    const updatedBookingAllowed = !restaurantToUpdate.booking_allowed;

    const dataToSubmit = {
      restaurant: {
        ...restaurantToUpdate,
        booking_allowed: updatedBookingAllowed,
      }
    };

    try {
      await dispatch(editRestaurant({ token, baseUrl, id: id.toString(), data: dataToSubmit })).unwrap();

      setRestaurants((prev) =>
        prev.map((restaurant) =>
          restaurant.id === id
            ? { ...restaurant, booking_allowed: updatedBookingAllowed }
            : restaurant
        )
      );
    } catch (error) {
      console.error("Failed to update bookingAllowed:", error);
    }
  };

  const toggleOrderAllowed = async (id: number) => {
    const restaurantToUpdate = restaurants.find((r) => r.id === id);
    if (!restaurantToUpdate) return;

    const updatedOrderAllowed = !restaurantToUpdate.can_order;

    const dataToSubmit = {
      restaurant: {
        ...restaurantToUpdate,
        can_order: updatedOrderAllowed,
      }
    };

    try {
      await dispatch(editRestaurant({ token, baseUrl, id: id.toString(), data: dataToSubmit })).unwrap();

      setRestaurants((prev) =>
        prev.map((restaurant) =>
          restaurant.id === id
            ? { ...restaurant, can_order: updatedOrderAllowed }
            : restaurant
        )
      );
    } catch (error) {
      console.error("Failed to update orderAllowed:", error);
    }
  };

  const toggleActive = async (id: number) => {
    const restaurantToUpdate = restaurants.find((r) => r.id === id);
    if (!restaurantToUpdate) return;

    const isActive = !restaurantToUpdate.status;

    const dataToSubmit = {
      restaurant: {
        ...restaurantToUpdate,
        status: isActive,
      }
    };

    try {
      await dispatch(editRestaurant({ token, baseUrl, id: id.toString(), data: dataToSubmit })).unwrap();

      setRestaurants((prev) =>
        prev.map((restaurant) =>
          restaurant.id === id
            ? { ...restaurant, status: isActive }
            : restaurant
        )
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const columns: ColumnConfig[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      draggable: true,
    },
    {
      key: 'openDays',
      label: 'Open Days',
      sortable: false,
      draggable: true,
    },
    {
      key: 'booking_allowed',
      label: 'Booking Allowed',
      sortable: true,
      draggable: true,
    },
    {
      key: 'can_order',
      label: 'Order Allowed',
      sortable: true,
      draggable: true,
    },
    {
      key: 'status',
      label: 'Active',
      sortable: true,
      draggable: true,
    },
  ];

  const renderCell = (item: Restaurant, columnKey: string) => {
    const dayMap: { [key: string]: string } = {
      monday: 'M',
      tuesday: 'T',
      wednesday: 'W',
      thursday: 'T',
      friday: 'F',
      saturday: 'S',
      sunday: 'S',
    };

    if (columnKey === 'openDays') {
      return item.restaurant_operations
        .filter(op => op.is_open)
        .map(op => dayMap[op.dayofweek.toLowerCase()])
        .filter(Boolean)
        .join(', ');
    }

    if (columnKey === 'booking_allowed') {
      return (
        <div className="flex items-center justify-center">
          <div
            className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${item.booking_allowed ? "bg-green-500" : "bg-gray-300"
              }`}
            onClick={() => toggleBookingAllowed(item.id)}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${item.booking_allowed ? "translate-x-6" : "translate-x-1"
                }`}
            />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">RESTAURANT</h1>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <Button onClick={() => navigate('/vas/fnb/add')} className="bg-[#C72030] hover:bg-[#C72030]/90 text-white h-9 px-4 text-sm font-medium rounded-md flex items-center gap-2 border-0">
          <Plus className="w-4 h-4" />
          Action
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Open Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Allowed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Allowed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {restaurants.map(restaurant => <tr key={restaurant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => handleViewRestaurant(restaurant.id)} className="text-stone-800">
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{restaurant.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{restaurant.openDays}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${restaurant.bookingAllowed ? 'bg-green-500' : 'bg-gray-300'}`} onClick={() => toggleBookingAllowed(restaurant.id)}>
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${restaurant.bookingAllowed ? 'translate-x-6' : 'translate-x-1'}`} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${restaurant.orderAllowed ? 'bg-green-500' : 'bg-gray-300'}`} onClick={() => toggleOrderAllowed(restaurant.id)}>
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${restaurant.orderAllowed ? 'translate-x-6' : 'translate-x-1'}`} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${restaurant.active ? 'bg-green-500' : 'bg-gray-300'}`} onClick={() => toggleActive(restaurant.id)}>
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${restaurant.active ? 'translate-x-6' : 'translate-x-1'}`} />
                      </div>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      );
    }

    return item[columnKey as keyof Restaurant]?.toString() || '';
  };

  const renderActions = (item: Restaurant) => (
    <button
      onClick={() => handleViewRestaurant(item.id)}
      className="text-stone-800"
    >
      <Eye className="w-5 h-5" />
    </button>
  );

  const leftActions = (
    <Button
      onClick={() => navigate("/vas/fnb/add")}
      className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-md flex items-center gap-2 border-0"
    >
      <Plus className="w-4 h-4" />
      Add
    </Button>
  );

  return (
    <div className="p-[30px]">
      <EnhancedTable
        data={restaurants}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey="fnb-restaurant-table"
        className="min-w-full"
        emptyMessage="No restaurants available"
        leftActions={leftActions}
        enableSearch={true}
        enableSelection={false}
        hideTableExport={true}
      />
    </div>
  );
};