import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { editRestaurant, fetchRestaurants } from "@/store/slices/f&bSlice";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { SelectionPanel } from "@/components/water-asset-details/PannelTab";

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

  const { loading } = useAppSelector(state => state.fetchRestaurants)

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [showActionPanel, setShowActionPanel] = useState(false);

  const handleViewRestaurant = (id: number) => {
    navigate(`/settings/vas/fnb/details/${id}`);
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
            className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${item.booking_allowed ? "bg-green-500" : "bg-gray-300"}`}
            onClick={() => toggleBookingAllowed(item.id)}
          >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${item.booking_allowed ? "translate-x-6" : "translate-x-1"}`} />
          </div>
        </div>
      );
    }

    if (columnKey === 'can_order') {
      return (
        <div className="flex items-center justify-center">
          <div
            className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${item.can_order ? "bg-green-500" : "bg-gray-300"}`}
            onClick={() => toggleOrderAllowed(item.id)}
          >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${item.can_order ? "translate-x-6" : "translate-x-1"}`} />
          </div>
        </div>
      );
    }

    if (columnKey === 'status') {
      return (
        <div className="flex items-center justify-center">
          <div
            className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${item.status ? "bg-green-500" : "bg-gray-300"}`}
            onClick={() => toggleActive(item.id)}
          >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${item.status ? "translate-x-6" : "translate-x-1"}`} />
          </div>
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
      onClick={() => setShowActionPanel(true)}
      className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-md flex items-center gap-2 border-0"
    >
      <Plus className="w-4 h-4" />
      Action
    </Button>
  );

  return (
    <div className="p-[30px]">
      {showActionPanel && (
        <SelectionPanel
          // actions={selectionActions}
          onAdd={() => navigate("/settings/vas/fnb/add")}
          onClearSelection={() => setShowActionPanel(false)}
        />
      )}

      <EnhancedTable
        loading={loading}
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
        pagination={true}
        pageSize={10}
      />
    </div>
  );
};