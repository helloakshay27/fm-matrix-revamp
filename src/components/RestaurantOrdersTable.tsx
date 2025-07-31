import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Eye, Loader2 } from "lucide-react";
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { exportOrders, fetchRestaurantOrders, fetchRestaurants } from '@/store/slices/f&bSlice';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { EnhancedTable } from './enhanced-table/EnhancedTable';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RestaurantOrder {
  id: number;
  meeting_room: string;
  created_at: string;
  created_by: string;
  details_url: string;
  item_count: number;
  payment_status: string;
  payment_status_class: string;
  restaurant_name: string;
  restaurant_id: number;
  status_name: string;
  total_amount: number;
  items: { id: number; menu_name: string; quantity: number; price: number }[];
  statuses: string[]; // Added statuses array
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'Confirmed':
      return 'success';
    case 'Pending':
      return 'warning';
    case 'Cancelled':
      return 'destructive';
    case 'Completed':
      return 'default';
    default:
      return 'default';
  }
};

export const RestaurantOrdersTable = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  const [orders, setOrders] = useState<RestaurantOrder[]>([]);
  const [restoId, setRestoId] = useState<number | undefined>();
  const [statusUpdating, setStatusUpdating] = useState<number | null>(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await dispatch(fetchRestaurants({ baseUrl, token })).unwrap();
        setRestoId(response[0]?.id);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        toast.error('Failed to fetch restaurants');
      }
    };

    fetchRestaurant();
  }, [dispatch, baseUrl, token]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (restoId) {
        try {
          const response = await dispatch(fetchRestaurantOrders({ baseUrl, token, id: Number(restoId) })).unwrap();
          setOrders(response.food_orders);
        } catch (error) {
          console.error('Error fetching orders:', error);
          toast.error('Failed to fetch orders');
        }
      }
    };

    fetchOrders();
  }, [dispatch, restoId, baseUrl, token]);

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    setStatusUpdating(orderId);
    try {
      await axios.post(
        `https://${baseUrl}/crm/create_osr_log.json`,
        {
          osr_log: {
            about: 'FoodOrder',
            about_id: orderId,
            osr_status_id: newStatus.id,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status_name: newStatus.name } : order
        )
      );

      toast.success(`Order ${orderId} status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleExport = async () => {
    try {
      const response = await dispatch(exportOrders({ baseUrl, token, id: Number(restoId) })).unwrap();
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'orders.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Orders exported successfully!');
    } catch (error) {
      console.error('Error exporting orders:', error);
      toast.error('Failed to export orders');
    }
  };

  const handleViewOrder = (order: RestaurantOrder) => {
    const restoId = orders.find((o) => o.id === order.id)?.restaurant_id;
    navigate(`/vas/fnb/details/${restoId}/restaurant-order/${order.id}`);
  };

  const columns: ColumnConfig[] = [
    {
      key: 'id',
      label: 'Order ID',
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: 'restaurant_name',
      label: 'Restaurant',
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: 'meeting_room',
      label: 'Meeting Room',
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: 'created_at',
      label: 'Created on',
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: 'created_by',
      label: 'Created by',
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: 'status_name',
      label: 'Status',
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: 'total_amount',
      label: `Amount Paid (${localStorage.getItem('currency')})`,
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: 'items',
      label: 'Name of Items',
      sortable: false,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: 'payment_status',
      label: 'Payment Status',
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
  ];

  useEffect(() => {
    const storageKey = 'restaurant-orders-table-columns';
    const savedVisibility = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (!savedVisibility.items) {
      const updatedVisibility = columns.reduce((acc, column) => ({
        ...acc,
        [column.key]: column.defaultVisible !== false,
      }), {});
      localStorage.setItem(storageKey, JSON.stringify(updatedVisibility));
    }
  }, []);

  const renderCell = (item: RestaurantOrder, columnKey: string) => {
    switch (columnKey) {
      case 'items':
        if (!item.items || item.items.length === 0) return '-';
        const fullItemsText = item.items.map((i) => `${i.menu_name} (${i.quantity})`).join(', ');
        const maxItems = 2;
        const maxLength = 50;
        let truncatedItems = item.items
          .slice(0, maxItems)
          .map((i) => `${i.menu_name} (${i.quantity})`)
          .join(', ');
        if (fullItemsText.length > maxLength || item.items.length > maxItems) {
          truncatedItems = truncatedItems.slice(0, maxLength).trim() + '...';
        }
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="truncate max-w-[150px] inline-block">
                  {truncatedItems}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{fullItemsText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case 'status_name':
        if (statusUpdating === item.id) {
          return <Loader2 className="w-4 h-4 animate-spin" />;
        }
        return (
          <Select
            value={item.status_name}
            onValueChange={(newStatus) => handleStatusUpdate(item.id, newStatus)}
            disabled={statusUpdating === item.id}
          >
            <SelectTrigger className="w-[140px] border-none bg-transparent flex justify-center items-center [&>svg]:hidden">
              <SelectValue asChild>
                <Badge
                  variant={getStatusBadgeVariant(item.status_name)}
                  className={cn(
                    'cursor-pointer',
                    item.status_name === 'Completed' && 'bg-[#A4F4E7] hover:bg-[#A4F4E7] text-black',
                    item.status_name === 'Pending' && 'bg-[#F4C790] hover:bg-[#F4C790] text-black',
                    item.status_name === 'Confirmed' && 'bg-[#A3E4DB] hover:bg-[#8CDAD1] text-black',
                    item.status_name === 'Cancelled' && 'bg-[#E4626F] hover:bg-[#E4626F] text-white'
                  )}
                >
                  {item.status_name}
                </Badge>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {item.statuses.map((status) => (
                <SelectItem key={status.id} value={status}>
                  <Badge
                    variant={getStatusBadgeVariant(status.name)}
                    className={cn(
                      status === 'Completed' && 'bg-[#A4F4E7] hover:bg-[#A4F4E7] text-black',
                      status === 'Pending' && 'bg-[#F4C790] hover:bg-[#F4C790] text-black',
                      status === 'Confirmed' && 'bg-[#A3E4DB] hover:bg-[#8CDAD1] text-black',
                      status === 'Cancelled' && 'bg-[#E4626F] hover:bg-[#E4626F] text-white'
                    )}
                  >
                    {status.name}
                  </Badge>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'payment_status':
        return item.payment_status ? (
          <span
            className={`px-2 py-1 rounded-full text-xs ${item.payment_status === 'Paid'
              ? 'bg-green-100 text-green-800'
              : item.payment_status === 'Pending'
                ? 'bg-yellow-100 text-yellow-800'
                : item.payment_status === 'Unpaid'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-500'
              }`}
          >
            {item.payment_status}
          </span>
        ) : (
          <span className="text-xs text-gray-500">-</span>
        );
      case 'total_amount':
        return `${localStorage.getItem('currency')} ${item.total_amount}` || '';
      default:
        return item[columnKey as keyof RestaurantOrder]?.toString() || '';
    }
  };

  const renderActions = (order: RestaurantOrder) => (
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
  );

  const leftActions = (
    <Button
      onClick={handleExport}
      className="bg-[#8B4B8C] hover:bg-[#8B4B8C]/90 text-white flex items-center gap-2"
    >
      <Download className="w-4 h-4" />
      Export
    </Button>
  );

  return (
    <div className="p-[30px]">
      <EnhancedTable
        data={orders}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey="restaurant-orders-table"
        className="min-w-full"
        emptyMessage="No orders found."
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