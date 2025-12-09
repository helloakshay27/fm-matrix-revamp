import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_CONFIG } from "@/config/apiConfig";
import { toast } from "sonner";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import SelectBox from "../components/ui/select-box";

const OrdersList = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const getPageFromStorage = () => {
    return parseInt(localStorage.getItem("orders_currentPage")) || 1;
  };

  const [pagination, setPagination] = useState({
    current_page: getPageFromStorage(),
    total_count: 0,
    total_pages: 0,
  });

  const pageSize = 10;

  const statusOptions = [
    { label: "All Statuses", value: "" },
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Processing", value: "processing" },
    { label: "Shipped", value: "shipped" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Refunded", value: "refunded" },
  ];

  const paymentStatusOptions = [
    { label: "All Payment Statuses", value: "" },
    { label: "Pending", value: "pending" },
    { label: "Paid", value: "paid" },
    { label: "Partially Paid", value: "partially_paid" },
    { label: "Failed", value: "failed" },
    { label: "Refunded", value: "refunded" },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  useEffect(() => {
    fetchOrders();
  }, [pagination.current_page, searchQuery, statusFilter, paymentStatusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let url = `${baseURL}/admin/orders.json?page=${pagination.current_page}&per_page=${pageSize}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      if (statusFilter) url += `&status=${statusFilter}`;
      if (paymentStatusFilter) url += `&payment_status=${paymentStatusFilter}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      });

      const ordersData = response.data.orders || [];
      setOrders(ordersData);

      if (response.data.pagination) {
        setPagination({
          current_page: response.data.pagination.current_page,
          total_count: response.data.pagination.total_count,
          total_pages: Math.ceil(response.data.pagination.total_count / pageSize),
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setPagination((prev) => ({
      ...prev,
      current_page: pageNumber,
    }));
    localStorage.setItem("orders_currentPage", pageNumber);
  };

  const updateOrderStatus = async (orderId, newStatus, notes = "") => {
    setUpdatingStatus(orderId);
    try {
      const url = `${baseURL}/orders/${orderId}/status_update.json?status=${newStatus}&notes=${encodeURIComponent(notes)}`;
      await axios.put(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Order status updated successfully!");
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    const notes = prompt("Enter notes for status update (optional):");
    if (notes !== null) {
      updateOrderStatus(orderId, newStatus, notes);
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800",
    };
    return statusClasses[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentStatusBadgeClass = (status) => {
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      partially_paid: "bg-blue-100 text-blue-800",
      failed: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800",
    };
    return statusClasses[status] || "bg-gray-100 text-gray-800";
  };

  const totalFiltered = pagination.total_count;
  const totalPages = pagination.total_pages;
  const startIndex = (pagination.current_page - 1) * pageSize;

  return (
    <div className="h-full bg-gray-50">
      <div className="p-6 max-w-full h-[calc(100vh-50px)] overflow-y-auto">
        {/* Header with Back Button and Breadcrumbs */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-[#C72030] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-400">Setup Member</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-400">Loyalty</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#C72030] font-medium">Orders</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            ORDERS ({totalFiltered} total)
          </h1>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Search Orders</label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
              <input
                type="text"
                className="flex-1 px-4 py-2 outline-none"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPagination((prev) => ({ ...prev, current_page: 1 }));
                }}
              />
              <button type="button" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors">
                <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.66927 13.939C3.9026 13.939 0.835938 11.064 0.835938 7.53271C0.835938 4.00146 3.9026 1.12646 7.66927 1.12646C11.4359 1.12646 14.5026 4.00146 14.5026 7.53271C14.5026 11.064 11.4359 13.939 7.66927 13.939ZM7.66927 2.06396C4.44927 2.06396 1.83594 4.52021 1.83594 7.53271C1.83594 10.5452 4.44927 13.0015 7.66927 13.0015C10.8893 13.0015 13.5026 10.5452 13.5026 7.53271C13.5026 4.52021 10.8893 2.06396 7.66927 2.06396Z" fill="#8B0203"/>
                  <path d="M14.6676 14.5644C14.5409 14.5644 14.4143 14.5206 14.3143 14.4269L12.9809 13.1769C12.7876 12.9956 12.7876 12.6956 12.9809 12.5144C13.1743 12.3331 13.4943 12.3331 13.6876 12.5144L15.0209 13.7644C15.2143 13.9456 15.2143 14.2456 15.0209 14.4269C14.9209 14.5206 14.7943 14.5644 14.6676 14.5644Z" fill="#8B0203"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Status Filter</label>
            <SelectBox
              options={statusOptions}
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setPagination((prev) => ({ ...prev, current_page: 1 }));
              }}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Payment Status</label>
            <SelectBox
              options={paymentStatusOptions}
              value={paymentStatusFilter}
              onChange={(value) => {
                setPaymentStatusFilter(value);
                setPagination((prev) => ({ ...prev, current_page: 1 }));
              }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Orders List</h3>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-[#8B0203] rounded-full animate-spin" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="rounded-lg border border-gray-200 overflow-x-auto">
                  <Table className="border-separate" style={{ minWidth: "1400px" }}>
                    <TableHeader>
                      <TableRow className="hover:bg-gray-50" style={{ backgroundColor: "#e6e2d8" }}>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "80px" }}>Order ID</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "150px" }}>Order Number</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", minWidth: "180px" }}>Customer</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "150px" }}>Status</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "130px" }}>Payment Status</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "120px" }}>Total Amount</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "120px" }}>Points Used</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", minWidth: "180px" }}>Items</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4" style={{ borderColor: "#fff", width: "150px" }}>Created At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.length > 0 ? (
                        orders.map((order) => (
                          <TableRow key={order.id} className="hover:bg-gray-50 transition-colors">
                            <TableCell className="py-3 px-4 font-medium">{order.id}</TableCell>
                            <TableCell className="py-3 px-4 text-sm text-gray-600">{order.order_number || "-"}</TableCell>
                            <TableCell className="py-3 px-4">
                              <div>
                                <div className="font-medium text-gray-900">{order.user?.name || "N/A"}</div>
                                <div className="text-sm text-gray-500">{order.user?.email || "-"}</div>
                              </div>
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              <SelectBox
                                options={statusOptions.filter(opt => opt.value !== "")}
                                value={order.status}
                                onChange={(value) => handleStatusChange(order.id, value)}
                                disabled={updatingStatus === order.id}
                              />
                              {updatingStatus === order.id && (
                                <div className="mt-1 text-xs text-gray-500">Updating...</div>
                              )}
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusBadgeClass(order.payment_status)}`}>
                                {order.payment_status?.charAt(0).toUpperCase() + (order.payment_status?.slice(1) || "").replace("_", " ")}
                              </span>
                            </TableCell>
                            <TableCell className="py-3 px-4 font-semibold">₹{parseFloat(order.total_amount || 0).toFixed(2)}</TableCell>
                            <TableCell className="py-3 px-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {(order.loyalty_points_redeemed || 0).toLocaleString()} pts
                              </span>
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              <div>
                                <div className="font-medium">{order.total_items || 0} item(s)</div>
                                {order.order_items?.length > 0 && (
                                  <div className="text-sm text-gray-500 truncate max-w-[150px]">
                                    {order.order_items[0].product_name}
                                    {order.order_items.length > 1 && ` +${order.order_items.length - 1} more`}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="py-3 px-4 text-sm text-gray-600">{formatDate(order.created_at)}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-12 text-gray-500">
                            {searchQuery || statusFilter || paymentStatusFilter ? (
                              <div>
                                <p className="text-lg mb-2">No orders found</p>
                                <p className="text-sm text-gray-400">Try adjusting your filters</p>
                              </div>
                            ) : (
                              "No orders found"
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {orders.length > 0 && totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 px-3">
                    {/* ...existing pagination code similar to other list pages... */}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersList;
