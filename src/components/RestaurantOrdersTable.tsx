
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from 'sonner';

interface RestaurantOrder {
  id: number;
  orderId: string;
  restaurant: string;
  createdOn: string;
  createdBy: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  amountPaid: number;
  noOfItems: number;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
}

const mockOrders: RestaurantOrder[] = [
  // Empty initial state - no orders yet
];

export const RestaurantOrdersTable = () => {
  const [orders, setOrders] = useState<RestaurantOrder[]>(mockOrders);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<RestaurantOrder | null>(null);

  const handleExport = () => {
    // Create CSV content
    const headers = ['Order ID', 'Restaurant', 'Created on', 'Created by', 'Status', 'Amount Paid (₹)', 'No.of Items', 'Payment Status'];
    const csvContent = [
      headers.join(','),
      ...orders.map(order => [
        order.orderId,
        order.restaurant,
        order.createdOn,
        order.createdBy,
        order.status,
        order.amountPaid,
        order.noOfItems,
        order.paymentStatus
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'restaurant_orders.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Orders exported successfully!');
  };

  const handleDeleteOrder = () => {
    if (selectedOrder) {
      setOrders(orders.filter(order => order.id !== selectedOrder.id));
      setSelectedOrder(null);
      setIsDeleteDialogOpen(false);
      toast.success('Order deleted successfully!');
    }
  };

  const openDeleteDialog = (order: RestaurantOrder) => {
    setSelectedOrder(order);
    setIsDeleteDialogOpen(true);
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
                        className="p-1 h-8 w-8"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(order)}
                        className="p-1 h-8 w-8 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{order.orderId}</TableCell>
                  <TableCell className="text-center">{order.restaurant}</TableCell>
                  <TableCell className="text-center">{order.createdOn}</TableCell>
                  <TableCell className="text-center">{order.createdBy}</TableCell>
                  <TableCell className="text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : order.status === 'Confirmed'
                        ? 'bg-blue-100 text-blue-800'
                        : order.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">₹{order.amountPaid}</TableCell>
                  <TableCell className="text-center">{order.noOfItems}</TableCell>
                  <TableCell className="text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.paymentStatus === 'Paid' 
                        ? 'bg-green-100 text-green-800' 
                        : order.paymentStatus === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>app.lockated.com says</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this order?
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
              onClick={handleDeleteOrder}
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
