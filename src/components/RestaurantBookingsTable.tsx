import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Pencil, Trash2 } from "lucide-react";
import { useAppDispatch } from '@/store/hooks';
import { useParams } from 'react-router-dom';
import { fetchRestaurantBookings } from '@/store/slices/f&bSlice';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { EnhancedTable } from './enhanced-table/EnhancedTable';

interface Schedule {
  date: string;
  time: string;
}

interface Booking {
  id: number;
  user_name: string;
  guest_count: number;
  additional_requests: string;
  booked_on: string;
  schedule_on: Schedule;
  date: string;
  time: string;
  status_id: number;
  status_name: string;
}

export const RestaurantBookingsTable = () => {
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');
  const { id } = useParams();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await dispatch(fetchRestaurantBookings({ baseUrl, token, id: Number(id) })).unwrap();
        setBookings(response);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };
    fetchBookings();
  }, [dispatch, id, baseUrl, token]);

  const handleDeleteBooking = () => {
    if (selectedBooking) {
      setBookings(bookings.filter(booking => booking.id !== selectedBooking.id));
      setSelectedBooking(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openDeleteDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDeleteDialogOpen(true);
  };

  const columns: ColumnConfig[] = [
    {
      key: 'id',
      label: 'Booking ID',
      sortable: true,
      draggable: true,
    },
    {
      key: 'user_name',
      label: 'Name',
      sortable: true,
      draggable: true,
    },
    {
      key: 'booked_on',
      label: 'Booked on',
      sortable: true,
      draggable: true,
    },
    {
      key: 'schedule_on',
      label: 'Schedule on',
      sortable: true,
      draggable: true,
    },
    {
      key: 'guest_count',
      label: 'Guest',
      sortable: true,
      draggable: true,
    },
    {
      key: 'status_name',
      label: 'Status',
      sortable: true,
      draggable: true,
    },
    {
      key: 'additional_requests',
      label: 'Additional Request',
      sortable: true,
      draggable: true,
    },
  ];

  const renderCell = (item: Booking, columnKey: string) => {
    switch (columnKey) {
      case 'id':
        return item.id || '';
      case 'user_name':
        return item.user_name || '';
      case 'booked_on':
        return item.booked_on || '';
      case 'schedule_on':
        return `${item.schedule_on.date} ${item.schedule_on.time}` || '';
      case 'guest_count':
        return item.guest_count || '';
      case 'status_name':
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs ${item.status_name === 'Confirmed'
              ? 'bg-green-100 text-green-800'
              : item.status_name === 'Pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
              }`}
          >
            {item.status_name}
          </span>
        );
      case 'additional_requests':
        return item.additional_requests || '';
      default:
        return item[columnKey as keyof Booking]?.toString() || '';
    }
  };

  const renderActions = (booking: Booking) => (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="p-1 h-8 w-8"
      >
        <Pencil className="w-4 h-4" />
      </Button>
      {/* <Button
        variant="ghost"
        size="sm"
        onClick={() => openDeleteDialog(booking)}
        className="p-1 h-8 w-8 text-red-600 hover:text-red-700"
      >
        <Trash2 className="w-4 h-4" />
      </Button> */}
    </div>
  );

  return (
    <div className="space-y-4">
      <EnhancedTable
        data={bookings}
        columns={columns}
        renderCell={renderCell}
        // renderActions={renderActions}
        storageKey="restaurant-bookings-table"
        className="min-w-full"
        emptyMessage="No bookings found."
        enableSearch={true}
        enableSelection={false}
        hideTableExport={true}
        pagination={true}
        pageSize={10}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>app.lockated.com says</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this booking?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setIsDeleteDialogOpen(false)}
              className="bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBooking}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};