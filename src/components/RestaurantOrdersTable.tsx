import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { useParams } from 'react-router-dom';
import { exportOrders, fetchRestaurantOrders, fetchRestaurants } from '@/store/slices/f&bSlice';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { EnhancedTable } from './enhanced-table/EnhancedTable';

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
}

export const RestaurantOrdersTable = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');
  // const { id } = useParams();

  const [orders, setOrders] = useState<RestaurantOrder[]>([]);
  const [restoId, setRestoId] = useState()

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await dispatch(fetchRestaurants({ baseUrl, token })).unwrap();
        setRestoId(response[0].id)
      } catch (error) {
        console.log(error)
      }
    }

    fetchRestaurant()
  }, [])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await dispatch(fetchRestaurantOrders({ baseUrl, token, id: Number(restoId) })).unwrap();
        setOrders(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrders();
  }, [dispatch, restoId, baseUrl, token]);

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
      console.log(error);
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
    },
    {
      key: 'restaurant_name',
      label: 'Restaurant',
      sortable: true,
      draggable: true,
    },
    {
      key: 'meeting_room',
      label: 'Meeting Room',
      sortable: true,
      draggable: true,
    },
    {
      key: 'created_at',
      label: 'Created on',
      sortable: true,
      draggable: true,
    },
    {
      key: 'created_by',
      label: 'Created by',
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
      key: 'total_amount',
      label: 'Amount Paid (₹)',
      sortable: true,
      draggable: true,
    },
    {
      key: 'item_count',
      label: 'No. of Items',
      sortable: true,
      draggable: true,
    },
    {
      key: 'payment_status',
      label: 'Payment Status',
      sortable: true,
      draggable: true,
    },
  ];

  const renderCell = (item: RestaurantOrder, columnKey: string) => {
    switch (columnKey) {
      case 'id':
        return item.id || '';
      case 'restaurant_name':
        return item.restaurant_name || '';
      case 'meeting_room':
        return item.meeting_room || '';
      case 'created_at':
        return item.created_at || '';
      case 'created_by':
        return item.created_by || '';
      case 'status_name':
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs ${item.status_name === 'Completed'
              ? 'bg-green-100 text-green-800'
              : item.status_name === 'Confirmed'
                ? 'bg-blue-100 text-blue-800'
                : item.status_name === 'Pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
          >
            {item.status_name}
          </span>
        );
      case 'total_amount':
        return `₹${item.total_amount}` || '';
      case 'item_count':
        return item.item_count || '';
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
      />
    </div>
  );
};