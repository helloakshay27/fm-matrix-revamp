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
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import axios from 'axios';

interface OrderLog {
  date: string;
  status: string;
  comment: string;
  updated_by: string;
}

interface OrderLogsTableProps {
  order: {
    logs: OrderLog[];
  };
}

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

  useEffect(() => {
    fetchOrder();
  }, [dispatch, baseUrl, token, id, oid]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmitStatus = async () => {
    try {
      await axios.post(`https://${baseUrl}/crm/create_osr_log.json`, {
        osr_log: {
          about: "FoodOrder",
          about_id: oid,
          osr_status_id: selectedStatus,
          comment: comments
        }
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setIsEditStatusOpen(false);
      setComments("");
      fetchOrder();
    } catch (error) {
      console.log(error)
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (error || !order) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">{error || 'Order not found'}</div>;
  }

  const columns: ColumnConfig[] = [
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      draggable: true,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      draggable: true,
    },
    {
      key: 'comment',
      label: 'Comments',
      sortable: true,
      draggable: true,
    },
    {
      key: 'updated_by',
      label: 'Updated by',
      sortable: true,
      draggable: true,
    },
  ];

  const renderCell = (item: OrderLog, columnKey: string) => {
    switch (columnKey) {
      case 'date':
        return item.date || '';
      case 'status':
        return (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
            {item.status}
          </span>
        );
      case 'comment':
        return item.comment || '';
      case 'updated_by':
        return item.updated_by || '';
      default:
        return item[columnKey as keyof OrderLog]?.toString() || '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/vas/fnb')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Order List
        </Button>
        {/* Restaurant Header */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex items-center justify-between bg-[#F6F4EE] p-6" style={{ border: "1px solid #D9D9D9" }}>
            <h2 className="flex items-center gap-4 text-[20px] fw-bold text-[#000]">{order.restaurant.name}</h2>
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

          <div className="grid grid-cols-2 gap-8 px-6 py-[31px] bg-[#F6F7F7]" style={{ border: "1px solid #D9D9D9" }}>
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

            {/* Left Column - Delivery Address */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Delivery Address:</h3>
              <div className="space-y-2">
                <div className="font-medium">{order.delivery_address.name}</div>
                <div className="text-gray-600">{order.delivery_address.facility_name}</div>
                <div className="text-gray-600">{order.delivery_address.site_name}</div>
                <div className="text-gray-600">{order.delivery_address.phone}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items and Pricing */}
        <div className="px-6 py-[31px] bg-[#F6F7F7] rounded-lg shadow p-6 mb-6" style={{ border: "1px solid #D9D9D9" }}>
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column - Item List */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Item List</h3>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="text-[#C72030]">
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
                <div className="flex justify-between font-semibold text-lg border-t pt-2 border-gray-400">
                  <span>TOTAL:</span>
                  <span>{order.totals.total_amount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logs Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="flex items-center justify-between bg-[#F6F4EE] p-[30px]" style={{ border: "1px solid #D9D9D9" }}>
            <h2 className="flex items-center gap-4 text-[20px] fw-bold text-[#000]">Logs</h2>
          </div>
          {/* <div className="overflow-x-auto">
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
          </div> */}

          <div className="overflow-x-auto px-[30px] py-[10px]">
            <EnhancedTable
              data={order.logs}
              columns={columns}
              renderCell={renderCell}
              storageKey="order-logs-table"
              className="w-full"
              emptyMessage="No logs found."
              enableSearch={true}
              enableSelection={false}
              hideTableExport={true}
              hideTableSearch={true}
              hideColumnsButton={true}
            />
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
                    <SelectItem key={status.id} value={status.id.toString()}>
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