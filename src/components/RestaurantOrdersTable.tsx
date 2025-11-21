import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Eye, Loader2, Package, Info } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FBAnalyticsComponents } from '@/components/FBAnalyticsComponents';

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
  
  // Analytics date range state (default: last 7 days)
  const [analyticsDateRange, setAnalyticsDateRange] = useState(() => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    today.setHours(23, 59, 59, 999);
    return { fromDate: sevenDaysAgo, toDate: today };
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

  const handleTotalOrdersExport = async () => {
    try {
      const siteId = localStorage.getItem('selectedSiteId') || '0';
      const accessToken = token || '';
      
      const exportUrl = `https://${baseUrl}/pms/admin/food_orders/food_and_booking.json?site_id=${siteId}&access_token=${encodeURIComponent(accessToken)}&export=total_orders`;
      
      const response = await fetch(exportUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to export total orders');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "total_orders.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Total orders exported successfully!');
    } catch (error) {
      console.error('Error exporting total orders:', error);
      toast.error('Failed to export total orders');
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
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
          <TabsTrigger
            value="list"
            className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            <svg
              width="18"
              height="19"
              viewBox="0 0 18 19"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.875 4.25L3 5.375L5.25 3.125M1.875 9.5L3 10.625L5.25 8.375M1.875 14.75L3 15.875L5.25 13.625M7.875 9.5H16.125M7.875 14.75H16.125M7.875 4.25H16.125"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            F&B List
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            <svg
              width="16"
              height="15"
              viewBox="0 0 16 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
            >
              <path
                d="M7.66681 11.6106C6.59669 11.5192 5.69719 11.0831 4.96831 10.3024C4.23944 9.52162 3.875 8.5875 3.875 7.5C3.875 6.35413 4.27606 5.38019 5.07819 4.57819C5.88019 3.77606 6.85413 3.375 8 3.375C9.0875 3.375 10.0216 3.73825 10.8024 4.46475C11.5831 5.19112 12.0192 6.08944 12.1106 7.15969L10.9179 6.80625C10.7557 6.13125 10.4066 5.57812 9.87031 5.14688C9.33419 4.71563 8.71075 4.5 8 4.5C7.175 4.5 6.46875 4.79375 5.88125 5.38125C5.29375 5.96875 5 6.675 5 7.5C5 8.2125 5.21681 8.8375 5.65044 9.375C6.08406 9.9125 6.636 10.2625 7.30625 10.425L7.66681 11.6106ZM8.56681 14.5946C8.47231 14.6149 8.37788 14.625 8.2835 14.625H8C7.01438 14.625 6.08812 14.438 5.22125 14.064C4.35437 13.69 3.60031 13.1824 2.95906 12.5413C2.31781 11.9002 1.81019 11.1463 1.43619 10.2795C1.06206 9.41275 0.875 8.48669 0.875 7.50131C0.875 6.51581 1.062 5.5895 1.436 4.72237C1.81 3.85525 2.31756 3.101 2.95869 2.45962C3.59981 1.81825 4.35375 1.31044 5.2205 0.936187C6.08725 0.562062 7.01331 0.375 7.99869 0.375C8.98419 0.375 9.9105 0.562062 10.7776 0.936187C11.6448 1.31019 12.399 1.81781 13.0404 2.45906C13.6818 3.10031 14.1896 3.85437 14.5638 4.72125C14.9379 5.58812 15.125 6.51438 15.125 7.5V7.77975C15.125 7.873 15.1149 7.96631 15.0946 8.05969L14 7.725V7.5C14 5.825 13.4187 4.40625 12.2563 3.24375C11.0938 2.08125 9.675 1.5 8 1.5C6.325 1.5 4.90625 2.08125 3.74375 3.24375C2.58125 4.40625 2 5.825 2 7.5C2 9.175 2.58125 10.5938 3.74375 11.7563C4.90625 12.9187 6.325 13.5 8 13.5H8.225L8.56681 14.5946ZM14.1052 14.7332L10.7043 11.325L9.88944 13.7884L8 7.5L14.2884 9.38944L11.825 10.2043L15.2332 13.6052L14.1052 14.7332Z"
                fill="currentColor"
              />
            </svg>
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6 mt-6">
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
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6 mt-5">
          <FBAnalyticsComponents
            defaultDateRange={analyticsDateRange}
            selectedAnalyticsTypes={['totalOrders', 'popularRestaurants', 'ordersOverTime', 'peakOrdering']}
            onAnalyticsChange={(data) => {
              if (data?.dateRange) {
                setAnalyticsDateRange(data.dateRange);
              }
            }}
            showFilter={true}
            showSelector={true}
            showRecentOrders={true}
            layout="grid"
            totalOrdersCount={pagination.total_count}
            onTotalOrdersExport={handleTotalOrdersExport}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};