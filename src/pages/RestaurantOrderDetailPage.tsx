import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Pencil, X } from "lucide-react";
import { fetchOrderDetails } from '@/store/slices/f&bSlice';
import { useAppDispatch } from '@/store/hooks';

interface OrderData {
  id: number;
  restaurant: {
    id: number;
    name: string;
  };
  status: {
    id: number;
    name: string;
    class: string;
  };
  user: {
    id: number;
    full_name: string;
    unit_name: string | null;
    department_name: string;
    country_code: string;
    mobile: string;
  };
  delivery_address: {
    name: string;
    site_name: string;
    unit: string | null;
    department: string;
    phone: string;
  };
  order_details: {
    order_id: number;
    order_date: string;
    payment_mode: string | null;
    payment_status: string | null;
    transaction_id: string | null;
    preferred_time: string | null;
  };
  items: {
    id: number;
    menu_name: string;
    rate: number;
    quantity: number;
    total: string;
  }[];
  totals: {
    sub_total: string;
    gst: string;
    delivery_charge: string;
    total_amount: string;
  };
  logs: {
    id: number;
    date: string;
    status: string;
    comment: string;
    updated_by: string;
  }[];
  available_statuses: {
    id: number;
    name: string;
  }[];
  urls: {
    update_status_url: string;
  };
}

export const RestaurantOrderDetailPage = () => {
  const dispatch = useAppDispatch();
  const { id, oid } = useParams();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [isEditStatusOpen, setIsEditStatusOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [comments, setComments] = useState("");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const response = await dispatch(fetchOrderDetails({ baseUrl, token, id: Number(id), oid: Number(oid) })).unwrap();
        setOrder(response);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [dispatch, baseUrl, token, id, oid]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmitStatus = () => {
    console.log("Updating status:", selectedStatus, "Comments:", comments);
    setIsEditStatusOpen(false);
    setComments("");
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (error || !order) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">{error || 'Order not found'}</div>;
  }

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
            <h2 className="text-2xl font-bold text-gray-900">{order.restaurant.name}</h2>
            <Button
              onClick={() => {
                setSelectedStatus(order.status.name);
                setIsEditStatusOpen(true);
              }}
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
                <div className="font-medium">{order.delivery_address.name}</div>
                <div className="text-gray-600">{order.delivery_address.site_name}</div>
                <div className="text-gray-600">{order.delivery_address.phone}</div>
              </div>
            </div>

            {/* Right Column - Order Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Order ID: {order.order_details.order_id}</h3>
              <div className="space-y-2">
                <div><span className="font-medium">Order Date:</span> {order.order_details.order_date}</div>
                <div><span className="font-medium">Payment Mode:</span> {order.order_details.payment_mode}</div>
                <div><span className="font-medium">Payment Status:</span> {order.order_details.payment_status}</div>
                <div><span className="font-medium">Transaction ID:</span> {order.order_details.transaction_id}</div>
                <div><span className="font-medium">Preferred Time:</span> {order.order_details.preferred_time}</div>
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
                    {item.menu_name}
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
                  <span>{order.totals.sub_total}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST:</span>
                  <span>{order.totals.gst}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span>{order.totals.delivery_charge}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>TOTAL:</span>
                  <span>{order.totals.total_amount}</span>
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
                    <td className="py-2 px-4">{log.comment}</td>
                    <td className="py-2 px-4">{log.updated_by}</td>
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
          <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b">
            <DialogTitle>Edit Status</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditStatusOpen(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {order.available_statuses.map((status) => (
                    <SelectItem key={status.id} value={status.name}>
                      {status.name}
                    </SelectItem>
                  ))}
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