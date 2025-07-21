import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Pencil } from "lucide-react";

interface OrderDetail {
  id: number;
  orderId: string;
  restaurant: string;
  orderDate: string;
  paymentMode: string;
  paymentStatus: string;
  transactionId: string;
  preferredTime: string;
  deliveryAddress: {
    customerName: string;
    location: string;
    phone: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  subTotal: number;
  gst: number;
  deliveryCharge: number;
  total: number;
  logs: {
    date: string;
    status: string;
    comments: string;
    updatedBy: string;
  }[];
  currentStatus: string;
}

const mockOrderDetails: OrderDetail[] = [
  {
    id: 1247,
    orderId: "1247",
    restaurant: "Havan Havanna Cafe",
    orderDate: "21/07/2025 12:39 PM",
    paymentMode: "UPI",
    paymentStatus: "Completed",
    transactionId: "UPI123456789",
    preferredTime: "1:00 PM",
    deliveryAddress: {
      customerName: "Ankit Gupta",
      location: "Locatedd",
      phone: "91 7388997281"
    },
    items: [
      { name: "Imperial Rolls", quantity: 1, price: 250.00 }
    ],
    subTotal: 250.00,
    gst: 0.00,
    deliveryCharge: 0.00,
    total: 250.00,
    logs: [
      { date: "21/07/2025 2:38 PM", status: "Received", comments: "", updatedBy: "Ankit Gupta" }
    ],
    currentStatus: "Received"
  },
  {
    id: 1246,
    orderId: "1246",
    restaurant: "Havan Havanna Cafe",
    orderDate: "21/07/2025 12:38 PM",
    paymentMode: "Card",
    paymentStatus: "Pending",
    transactionId: "CARD987654321",
    preferredTime: "1:30 PM",
    deliveryAddress: {
      customerName: "Ankit Gupta",
      location: "Business Park, Block A",
      phone: "91 9876543210"
    },
    items: [
      { name: "Corn Fritters", quantity: 1, price: 250.00 }
    ],
    subTotal: 250.00,
    gst: 12.50,
    deliveryCharge: 30.00,
    total: 292.50,
    logs: [
      { date: "21/07/2025 12:38 PM", status: "Pending", comments: "Order placed", updatedBy: "Ankit Gupta" }
    ],
    currentStatus: "Pending"
  },
  {
    id: 1223,
    orderId: "1223",
    restaurant: "Havan Havanna Cafe",
    orderDate: "24/07/2024 1:07 PM",
    paymentMode: "Cash",
    paymentStatus: "Not Available",
    transactionId: "",
    preferredTime: "2:00 PM",
    deliveryAddress: {
      customerName: "Kshitij Rasal",
      location: "IT Complex, Wing B",
      phone: "91 8765432109"
    },
    items: [
      { name: "Spring Rolls", quantity: 1, price: 40.00 }
    ],
    subTotal: 40.00,
    gst: 0.00,
    deliveryCharge: 0.00,
    total: 40.00,
    logs: [
      { date: "24/07/2024 1:07 PM", status: "Not Available", comments: "Item out of stock", updatedBy: "Kshitij Rasal" }
    ],
    currentStatus: "Not Available"
  },
  {
    id: 1217,
    orderId: "1217",
    restaurant: "Havan Havanna Cafe",
    orderDate: "20/07/2024 12:18 PM",
    paymentMode: "UPI",
    paymentStatus: "Paid",
    transactionId: "UPI789012345",
    preferredTime: "12:30 PM",
    deliveryAddress: {
      customerName: "Chetan Bafna",
      location: "Residential Area, Plot 45",
      phone: "91 7654321098"
    },
    items: [
      { name: "Chicken Satay", quantity: 2, price: 300.00 },
      { name: "Tom Yum Soup", quantity: 1, price: 120.00 }
    ],
    subTotal: 720.00,
    gst: 36.00,
    deliveryCharge: 50.00,
    total: 806.00,
    logs: [
      { date: "20/07/2024 12:18 PM", status: "Pending", comments: "Order confirmed", updatedBy: "Chetan Bafna" }
    ],
    currentStatus: "Pending"
  },
  {
    id: 1211,
    orderId: "1211",
    restaurant: "Havan Havanna Cafe",
    orderDate: "24/06/2024 2:54 PM",
    paymentMode: "Card",
    paymentStatus: "Processing",
    transactionId: "CARD345678901",
    preferredTime: "3:15 PM",
    deliveryAddress: {
      customerName: "Kshitij Rasal",
      location: "Tech Hub, Floor 3",
      phone: "91 6543210987"
    },
    items: [
      { name: "Tofu Satay", quantity: 1, price: 270.00 },
      { name: "Dumpling", quantity: 1, price: 200.00 }
    ],
    subTotal: 470.00,
    gst: 23.50,
    deliveryCharge: 40.00,
    total: 533.50,
    logs: [
      { date: "24/06/2024 2:54 PM", status: "Pending", comments: "Payment processing", updatedBy: "Kshitij Rasal" }
    ],
    currentStatus: "Pending"
  }
];

export const RestaurantOrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditStatusOpen, setIsEditStatusOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [comments, setComments] = useState("");

  // Find the specific order based on the orderId parameter from URL
  const order = mockOrderDetails.find(item => item.orderId === id) || mockOrderDetails[0];

  const handleBack = () => {
    navigate(-1);
  };

  const handleEditStatus = () => {
    setSelectedStatus(order.currentStatus);
    setIsEditStatusOpen(true);
  };

  const handleSubmitStatus = () => {
    // Handle status update logic here
    console.log("Updating status:", selectedStatus, "Comments:", comments);
    setIsEditStatusOpen(false);
    setComments("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Breadcrumb */}
      <div className="bg-white px-6 py-2 border-b">
        <div className="flex items-center text-sm text-gray-600">
          <span>Restaurant</span>
          <span className="mx-2">{'>'}</span>
          <span>Restaurant Booking</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={handleBack}
              variant="ghost"
              size="sm"
              className="p-1"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">RESTAURANT BOOKING</h1>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Restaurant Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{order.restaurant}</h2>
            <Button
              onClick={handleEditStatus}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Pencil className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Left Column - Delivery Address */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Delivery Address:</h3>
              <div className="space-y-2">
                <div className="font-medium">{order.deliveryAddress.customerName}</div>
                <div className="text-gray-600">{order.deliveryAddress.location}</div>
                <div className="text-gray-600">{order.deliveryAddress.phone}</div>
              </div>
            </div>

            {/* Right Column - Order Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Order ID: {order.orderId}</h3>
              <div className="space-y-2">
                <div><span className="font-medium">Order Date:</span> {order.orderDate}</div>
                <div><span className="font-medium">Payment Mode:</span> {order.paymentMode}</div>
                <div><span className="font-medium">Payment Status:</span> {order.paymentStatus}</div>
                <div><span className="font-medium">Transaction ID:</span> {order.transactionId}</div>
                <div><span className="font-medium">Preferred Time:</span> {order.preferredTime}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items and Pricing */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column - Item List */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Item List</h3>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="text-blue-600">
                    {item.name}
                    <div className="text-gray-600 text-sm">{item.quantity}Qty x 1</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Total Price */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Total Price</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Sub Total:</span>
                  <span>{order.subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST:</span>
                  <span>{order.gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span>{order.deliveryCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>TOTAL:</span>
                  <span>{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logs Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Logs</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Date</th>
                  <th className="text-left py-2 px-4">Status</th>
                  <th className="text-left py-2 px-4">Comments</th>
                  <th className="text-left py-2 px-4">Updated by</th>
                </tr>
              </thead>
              <tbody>
                {order.logs.map((log, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">{log.date}</td>
                    <td className="py-2 px-4">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        {log.status}
                      </span>
                    </td>
                    <td className="py-2 px-4">{log.comments}</td>
                    <td className="py-2 px-4">{log.updatedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Status Dialog */}
      <Dialog open={isEditStatusOpen} onOpenChange={setIsEditStatusOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Received">Received</SelectItem>
                  <SelectItem value="Not Available">Not Available</SelectItem>
                  <SelectItem value="Order Received">Order Received</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="comments">Comment (Optional)</Label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Enter comments..."
                rows={3}
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleSubmitStatus}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};