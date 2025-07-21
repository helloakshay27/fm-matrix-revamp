
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Eye, Trash2 } from "lucide-react";
import { toast } from 'sonner';

interface RestaurantOrder {
  id: number;
  orderId: string;
  restaurant: string;
  createdOn: string;
  createdBy: string;
  status: 'Pending' | 'Received' | 'Not Available' | 'Order Received';
  amountPaid: number;
  noOfItems: number;
  paymentStatus: string;
}

const mockOrders: RestaurantOrder[] = [
  { id: 1, orderId: "1247", restaurant: "Havan Havanna Cafe", createdOn: "21/07/2025 12:39 PM", createdBy: "Ankit Gupta", status: "Received", amountPaid: 250.0, noOfItems: 1, paymentStatus: "" },
  { id: 2, orderId: "1246", restaurant: "Havan Havanna Cafe", createdOn: "21/07/2025 12:38 PM", createdBy: "Ankit Gupta", status: "Pending", amountPaid: 250.0, noOfItems: 1, paymentStatus: "" },
  { id: 3, orderId: "1223", restaurant: "Havan Havanna Cafe", createdOn: "24/07/2024 1:07 PM", createdBy: "Kshitij Rasal", status: "Not Available", amountPaid: 40.0, noOfItems: 1, paymentStatus: "" },
  { id: 4, orderId: "1217", restaurant: "Havan Havanna Cafe", createdOn: "20/07/2024 12:18 PM", createdBy: "Chetan Bafna", status: "Pending", amountPaid: 720.0, noOfItems: 3, paymentStatus: "" },
  { id: 5, orderId: "1211", restaurant: "Havan Havanna Cafe", createdOn: "24/06/2024 2:54 PM", createdBy: "Kshitij Rasal", status: "Pending", amountPaid: 470.0, noOfItems: 2, paymentStatus: "" },
  { id: 6, orderId: "1204", restaurant: "Havan Havanna Cafe", createdOn: "17/05/2024 4:27 PM", createdBy: "Chetan Bafna", status: "Pending", amountPaid: 200.0, noOfItems: 1, paymentStatus: "" },
  { id: 7, orderId: "1203", restaurant: "Havan Havanna Cafe", createdOn: "17/05/2024 4:25 PM", createdBy: "Chetan Bafna", status: "Pending", amountPaid: 250.0, noOfItems: 1, paymentStatus: "" },
  { id: 8, orderId: "1168", restaurant: "Havan Havanna Cafe", createdOn: "18/01/2024 12:55 PM", createdBy: "Deepak Gupta", status: "Pending", amountPaid: 250.0, noOfItems: 1, paymentStatus: "" },
  { id: 9, orderId: "1141", restaurant: "Havan Havanna Cafe", createdOn: "30/08/2023 5:27 PM", createdBy: "Shubh Jhanavi", status: "Pending", amountPaid: 250.0, noOfItems: 1, paymentStatus: "" },
  { id: 10, orderId: "1140", restaurant: "Havan Havanna Cafe", createdOn: "22/08/2023 11:45 AM", createdBy: "Shubh Jhanavi", status: "Pending", amountPaid: 250.0, noOfItems: 1, paymentStatus: "" },
  { id: 11, orderId: "1139", restaurant: "Havan Havanna Cafe", createdOn: "16/08/2023 5:03 PM", createdBy: "Kshitij Rasal", status: "Not Available", amountPaid: 250.0, noOfItems: 1, paymentStatus: "" },
  { id: 12, orderId: "1127", restaurant: "Havan Havanna Cafe", createdOn: "11/07/2023 11:47 AM", createdBy: "Chetan Bafna", status: "Pending", amountPaid: 730.0, noOfItems: 3, paymentStatus: "" },
  { id: 13, orderId: "1126", restaurant: "Havan Havanna Cafe", createdOn: "11/07/2023 8:45 AM", createdBy: "Chetan Bafna", status: "Pending", amountPaid: 470.0, noOfItems: 2, paymentStatus: "" },
  { id: 14, orderId: "1125", restaurant: "Havan Havanna Cafe", createdOn: "10/07/2023 5:21 PM", createdBy: "sanket Patil", status: "Pending", amountPaid: 200.0, noOfItems: 1, paymentStatus: "" },
  { id: 15, orderId: "1124", restaurant: "Havan Havanna Cafe", createdOn: "10/07/2023 5:19 PM", createdBy: "sanket Patil", status: "Pending", amountPaid: 600.0, noOfItems: 2, paymentStatus: "" },
  { id: 16, orderId: "1123", restaurant: "Havan Havanna Cafe", createdOn: "10/07/2023 5:11 PM", createdBy: "sanket Patil", status: "Pending", amountPaid: 300.0, noOfItems: 1, paymentStatus: "" },
  { id: 17, orderId: "1122", restaurant: "Havan Havanna Cafe", createdOn: "10/07/2023 4:58 PM", createdBy: "sanket Patil", status: "Pending", amountPaid: 500.0, noOfItems: 2, paymentStatus: "" },
  { id: 18, orderId: "1121", restaurant: "Havan Havanna Cafe", createdOn: "10/07/2023 4:55 PM", createdBy: "sanket Patil", status: "Pending", amountPaid: 500.0, noOfItems: 2, paymentStatus: "" },
  { id: 19, orderId: "1119", restaurant: "Havan Havanna Cafe", createdOn: "10/07/2023 4:51 PM", createdBy: "sanket Patil", status: "Pending", amountPaid: 500.0, noOfItems: 2, paymentStatus: "" },
  { id: 20, orderId: "1118", restaurant: "Havan Havanna Cafe", createdOn: "10/07/2023 4:51 PM", createdBy: "sanket Patil", status: "Pending", amountPaid: 500.0, noOfItems: 2, paymentStatus: "" },
  { id: 21, orderId: "1117", restaurant: "Havan Havanna Cafe", createdOn: "10/07/2023 4:15 PM", createdBy: "sanket Patil", status: "Pending", amountPaid: 670.0, noOfItems: 3, paymentStatus: "" },
  { id: 22, orderId: "1116", restaurant: "Havan Havanna Cafe", createdOn: "10/07/2023 3:34 PM", createdBy: "", status: "Pending", amountPaid: 200.0, noOfItems: 1, paymentStatus: "" },
  { id: 23, orderId: "1115", restaurant: "Havan Havanna Cafe", createdOn: "10/07/2023 2:51 PM", createdBy: "sanket Patil", status: "Pending", amountPaid: 420.0, noOfItems: 2, paymentStatus: "" },
  { id: 24, orderId: "1111", restaurant: "Havan Havanna Cafe", createdOn: "10/07/2023 1:20 PM", createdBy: "sanket Patil", status: "Pending", amountPaid: 250.0, noOfItems: 1, paymentStatus: "" },
  { id: 25, orderId: "1110", restaurant: "Havan Havanna Cafe", createdOn: "10/07/2023 12:44 PM", createdBy: "sanket Patil", status: "Pending", amountPaid: 500.0, noOfItems: 2, paymentStatus: "" }
];

export const RestaurantOrdersTable = () => {
  const navigate = useNavigate();
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

  const handleViewOrder = (order: RestaurantOrder) => {
    navigate(`/vas/fnb/restaurant-orders/details/${order.id}`);
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
                      order.status === 'Received' 
                        ? 'bg-green-100 text-green-800' 
                        : order.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.status === 'Not Available'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">₹{order.amountPaid}</TableCell>
                  <TableCell className="text-center">{order.noOfItems}</TableCell>
                  <TableCell className="text-center">
                    {order.paymentStatus ? (
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.paymentStatus === 'Paid' 
                          ? 'bg-green-100 text-green-800' 
                          : order.paymentStatus === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    ) : (
                      <span>-</span>
                    )}
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
