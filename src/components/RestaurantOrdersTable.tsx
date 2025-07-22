import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye } from "lucide-react";
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { useParams } from 'react-router-dom';
import { exportOrders, fetchRestaurantOrders } from '@/store/slices/f&bSlice';
import { AlertDialog, AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { AlertDialogAction } from '@radix-ui/react-alert-dialog';

interface RestaurantOrder {
  id: number;
  created_at: string; // e.g., "21/07/2025 01:20 PM"
  created_by: string;
  details_url: string;
  item_count: number;
  payment_status: string;
  payment_status_class: string;
  restaurant_name: string;
  status_name: string;
  total_amount: number;
}

export const RestaurantOrdersTable = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');
  const { id } = useParams()

  const [orders, setOrders] = useState<RestaurantOrder[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<RestaurantOrder | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await dispatch(fetchRestaurantOrders({ baseUrl, token, id: Number(id) })).unwrap();
        setOrders(response);
      } catch (error) {
        console.log(error)
      }
    }

    fetchOrders()
  }, [])

  const handleExport = async () => {
    // Create CSV content
    try {
      const response = await dispatch(exportOrders({ baseUrl, token, id: Number(id) })).unwrap();
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'orders.xlsx'; // Desired file name
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Orders exported successfully!');
    } catch (error) {
      console.log(error)
    }
  };

  const handleViewOrder = (order: RestaurantOrder) => {
    navigate(`/vas/fnb/details/${id}/restaurant-order/${order.id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-start">
        <Button
          onClick={handleExport}
          className="bg-[#8B4B8C] hover:bg-[#8B4B8C]/90 text-white flex items-center gap-2"
        >
          Export
        </Button>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="font-medium">Actions</TableHead>
              <TableHead className="font-medium text-center">Order ID</TableHead>
              <TableHead className="font-medium text-center">Restaurant</TableHead>
              <TableHead className="font-medium text-center">Created on</TableHead>
              <TableHead className="font-medium text-center">Created by</TableHead>
              <TableHead className="font-medium text-center">Status</TableHead>
              <TableHead className="font-medium text-center">Amount Paid (₹)</TableHead>
              <TableHead className="font-medium text-center">No.of Items</TableHead>
              <TableHead className="font-medium text-center">Payment Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewOrder(order)}
                        className="p-1 h-8 w-8"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{order.id}</TableCell>
                  <TableCell className="text-center">{order.restaurant_name}</TableCell>
                  <TableCell className="text-center">{order.created_at}</TableCell>
                  <TableCell className="text-center">{order.created_by}</TableCell>
                  <TableCell className="text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${order.status_name === 'Completed'
                      ? 'bg-green-100 text-green-800'
                      : order.status_name === 'Confirmed'
                        ? 'bg-blue-100 text-blue-800'
                        : order.status_name === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                      {order.status_name}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">₹{order.total_amount}</TableCell>
                  <TableCell className="text-center">{order.item_count}</TableCell>
                  <TableCell className="text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${order.payment_status === 'Paid'
                      ? 'bg-green-100 text-green-800'
                      : order.payment_status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {order.payment_status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};