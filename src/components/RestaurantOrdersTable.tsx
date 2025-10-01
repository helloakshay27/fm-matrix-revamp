import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';

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
  statuses: { id: number; status_name: string; color_code: string }[];
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

export const RestaurantOrdersTable = ({ needPadding }: { needPadding?: boolean }) => {
  const { id } = useParams()
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  const [orders, setOrders] = useState<RestaurantOrder[]>([]);
  const [restoId, setRestoId] = useState<number | undefined>();
  const [statusUpdating, setStatusUpdating] = useState<number | null>(null);
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_count: 0,
    total_pages: 0,
  });

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (needPadding) {
        try {
          const response = await dispatch(fetchRestaurants({ baseUrl, token })).unwrap();
          setRestoId(response[0]?.id);
        } catch (error) {
          console.error('Error fetching restaurants:', error);
          toast.error('Failed to fetch restaurants');
        }
      } else {
        setRestoId(id ? Number(id) : undefined);
      }
    };

    fetchRestaurant();
  }, [dispatch, baseUrl, token]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      if (restoId) {
        try {
          const params = needPadding
            ? {
              baseUrl,
              token,
              id: Number(restoId),
              pageSize: 10,
              currentPage: pagination.current_page,
              all: true,
            }
            : {
              baseUrl,
              token,
              id: Number(restoId),
              pageSize: 10,
              currentPage: pagination.current_page,
            };
          const response = await dispatch(fetchRestaurantOrders(params)).unwrap();
          setOrders(response.food_orders);
          setPagination({
            current_page: response.current_page,
            total_count: response.total_records,
            total_pages: response.total_pages
          })
        } catch (error) {
          console.error('Error fetching orders:', error);
          toast.error('Failed to fetch orders');
        } finally {
          setLoading(false);
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

      toast.success(`Order ${orderId} status updated to ${newStatus.name}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleExport = async () => {
    try {
      const response = await dispatch(exportOrders({ baseUrl, token, id: Number(restoId), all: needPadding ? true : false })).unwrap();

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "orders.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

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

  const handlePageChange = async (page: number) => {
    setPagination((prev) => ({
      ...prev,
      current_page: page,
    }));
    try {
      const params = needPadding
        ? {
          baseUrl,
          token,
          id: Number(restoId),
          pageSize: 10,
          currentPage: pagination.current_page,
          all: true,
        }
        : {
          baseUrl,
          token,
          id: Number(restoId),
          pageSize: 10,
          currentPage: pagination.current_page,
        };
      const response = await dispatch(fetchRestaurantOrders(params)).unwrap();
      setOrders(response.food_orders);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    }
  };

  const renderPaginationItems = () => {
    if (!pagination.total_pages || pagination.total_pages <= 0) {
      return null;
    }
    const items = [];
    const totalPages = pagination.total_pages;
    const currentPage = pagination.current_page;
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      items.push(
        <PaginationItem key={1} className='cursor-pointer'>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
            disabled={loading}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 4) {
        items.push(
          <PaginationItem key="ellipsis1" >
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
          items.push(
            <PaginationItem key={i} className='cursor-pointer'>
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
                disabled={loading}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      if (currentPage > 3 && currentPage < totalPages - 2) {
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(
            <PaginationItem key={i} className='cursor-pointer'>
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
                disabled={loading}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      if (currentPage < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = Math.max(totalPages - 2, 2); i < totalPages; i++) {
          if (!items.find((item) => item.key === i.toString())) {
            items.push(
              <PaginationItem key={i} className='cursor-pointer'>
                <PaginationLink
                  onClick={() => handlePageChange(i)}
                  isActive={currentPage === i}
                  disabled={loading}
                >
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          }
        }
      }

      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages} className='cursor-pointer'>
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              isActive={currentPage === totalPages}
              disabled={loading}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i} className='cursor-pointer'>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              disabled={loading}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

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
            <SelectTrigger className="w-max border-none bg-transparent flex items-center [&>svg]:hidden">
              <SelectValue asChild>
                <span className={`text-gray-900 pl-0 px-[5px] py-[3px] flex items-start gap-2 text-sm`} style={{ borderRadius: "4px", backgroundColor: item.statuses.find(status => status.name === item.status_name && status.color_code)?.color_code }}>
                  {item.status_name}
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {item.statuses
                .filter(status => status.active)
                .map((status) => (
                  <SelectItem key={status.id} value={status}>
                    <span className={`text-gray-900 px-[5px] py-[3px] flex items-start gap-2 text-sm`} style={{ borderRadius: "4px", backgroundColor: status.color_code }}>
                      {status.name}
                    </span>
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

  return (
    <div className={`${needPadding && 'p-6'}`}>
      <EnhancedTable
        data={orders}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey="restaurant-orders-table"
        className="min-w-full"
        emptyMessage="No orders found."
        enableSearch={true}
        enableExport={true}
        handleExport={handleExport}
        enableSelection={false}
        pagination={true}
        pageSize={10}
        loading={loading}
      />

      <div className="flex justify-center mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, pagination.current_page - 1))}
                className={pagination.current_page === 1 || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            {renderPaginationItems()}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(pagination.total_pages, pagination.current_page + 1))}
                className={pagination.current_page === pagination.total_pages || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};