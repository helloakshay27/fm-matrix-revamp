import React, { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  Package,
  XCircle,
  MessageSquare,
  Send,
} from "lucide-react";
import { restaurantApi, AdminOrder } from "../services/restaurantApi";

const MobileAdminOrderDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = useParams<{ orderId: string }>();
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [comment, setComment] = useState("");
  const [savingComment, setSavingComment] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState("");
  const [selectedStatusName, setSelectedStatusName] = useState("");
  const [showStatusComment, setShowStatusComment] = useState(false);
  const [statusComment, setStatusComment] = useState("");

  // Get order data from location state or props
  const {
    order,
    token: stateToken,
    restaurantId,
  } = (location.state as {
    order: AdminOrder;
    token: string;
    restaurantId: string;
  }) || {};

  // Fallback to sessionStorage for token if not in location state
  const token = stateToken || sessionStorage.getItem("token") || "";

  if (!order || !token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-4">Unable to load order details</p>
          <button
            onClick={() => navigate("/mobile/admin/orders")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const handleStatusChange = async (statusId: string, statusName: string) => {
    // Store the selected status and show comment input
    setSelectedStatusId(statusId);
    setSelectedStatusName(statusName);
    setShowStatusComment(true);
    setStatusComment("");
  };

  const handleStatusSubmit = async () => {
    setUpdatingStatus(true);
    try {
      // Get the current token from sessionStorage
      const currentToken = sessionStorage.getItem("token") || token;

      const result = await restaurantApi.updateOrderStatus(
        order.id.toString(),
        selectedStatusId,
        statusComment.trim(),
        currentToken
      );

      if (result.success) {
        // Update the order status locally
        order.status_name = selectedStatusName;
        setShowStatusComment(false);
        setStatusComment("");
        alert("Status updated successfully");
      } else {
        alert(result.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCancelStatusChange = () => {
    setShowStatusComment(false);
    setSelectedStatusId("");
    setSelectedStatusName("");
    setStatusComment("");
  };

  const handleCancelOrder = async () => {
    const cancelStatus = order.statuses?.find(
      (s) =>
        s.name.toLowerCase().includes("cancel") ||
        s.fixed_state === "cancelled" ||
        s.cancel === 1
    );

    if (!cancelStatus) {
      alert("Cancel status not available for this order");
      return;
    }

    if (!confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    setCancelling(true);
    try {
      const result = await restaurantApi.updateOrderStatus(
        order.id.toString(),
        cancelStatus.id.toString(),
        "Order cancelled by admin"
      );

      if (result.success) {
        order.status_name = cancelStatus.name;
        alert("Order cancelled successfully");
      } else {
        alert(result.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  const handleSaveComment = async () => {
    if (!comment.trim()) {
      alert("Please enter a comment");
      return;
    }

    setSavingComment(true);
    try {
      // Get the current token from sessionStorage
      const currentToken = sessionStorage.getItem("token") || token;

      const result = await restaurantApi.updateOrderStatus(
        order.id.toString(),
        order.statuses
          ?.find((s) => s.name === order.status_name)
          ?.id.toString() || "",
        comment.trim(),
        currentToken
      );

      if (result.success) {
        alert("Comment saved successfully");
        setComment(""); // Clear the comment field after successful save
      } else {
        alert(result.message || "Failed to save comment");
      }
    } catch (error) {
      console.error("Error saving comment:", error);
      alert("Failed to save comment");
    } finally {
      setSavingComment(false);
    }
  };

  const getStatusColor = (statusName: string, colorCode?: string) => {
    // Use backend color code if available, otherwise use a default gray
    return colorCode || "#6b7280";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "OMR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      // Handle different date formats
      let date: Date;

      // Check if it's in DD/MM/YYYY HH:MM AM/PM format
      if (dateString.includes("/") && dateString.includes(" ")) {
        const [datePart, timePart] = dateString.split(" ");
        const [day, month, year] = datePart.split("/");

        // Convert to standard format for parsing
        const standardFormat = `${month}/${day}/${year} ${timePart}`;
        date = new Date(standardFormat);
      } else {
        // Standard ISO format or other formats
        date = new Date(dateString);
      }

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString; // Return original if parsing fails
      }

      // Format as: "Sunday, August 3, 2025 at 12:15 AM"
      return (
        date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }) +
        " at " +
        date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateString; // Return original if any error occurs
    }
  };

  const currentStatus = order.statuses?.find(
    (s) => s.name === order.status_name
  );
  const isCancellable =
    order.statuses?.some(
      (s) =>
        s.name.toLowerCase().includes("cancel") ||
        s.fixed_state === "cancelled" ||
        s.cancel === 1
    ) && !order.status_name.toLowerCase().includes("cancel");

  const isOrderCancelled =
    order.status_name?.toLowerCase().includes("cancelled") ||
    order.status_name?.toLowerCase().includes("canceled");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">
                Order #{order.id}
              </h1>
              <p className="text-sm text-gray-600">{order.restaurant_name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isCancellable && (
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="flex items-center space-x-1 px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                {cancelling ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                <span className="text-sm">Cancel</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Order Summary Card */}
        <div
          className="rounded-lg border p-4 shadow-sm"
          style={{ backgroundColor: "#F6F4EE" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Order Summary
            </h2>
            <span
              className="px-3 py-1 text-xs rounded-full text-white font-medium"
              style={{
                backgroundColor: getStatusColor(
                  order.status_name,
                  currentStatus?.color_code
                ),
              }}
            >
              {currentStatus?.display || order.status_name}
            </span>
          </div>

          <div className="space-y-3 border-b border-gray-200 pb-4 mb-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Order ID</span>
              <span className="text-sm font-medium text-gray-800">
                #{order.id}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600">
                {order.restaurant_name}
              </span>
              <span className="text-sm font-medium text-gray-800">
                Total Items - {order.item_count}
              </span>
            </div>

            {order.items &&
              order.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    {item.menu_name}
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {item.quantity.toString().padStart(2, "0")}
                  </span>
                </div>
              ))}
          </div>
          <h3 className="text-md font-semibold text-gray-800 mb-3">Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Name</span>
              <span className="text-sm font-medium text-gray-800">
                {order.created_by}
              </span>
            </div>
            {(order.facility_name || order.location || order.meeting_room ) && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Location</span>
                <span className="text-sm font-medium text-gray-800">
                  {order.facility_name || order.location || order.meeting_room }
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Date</span>
              <span className="text-sm font-medium text-gray-800">
                {formatDate(order.created_at)}
              </span>
            </div>
            {order.total_amount >= 1 && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Amount</span>
                <span className="text-sm font-medium text-gray-800">
                  {formatCurrency(order.total_amount )}
                </span>
              </div>
            )}
          </div>
        </div>
        {/* Status Management Card */}
        <div
          className="rounded-lg border p-4 shadow-sm"
          style={{ backgroundColor: "#F6F4EE" }}
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Change Status
          </h2>
          <select
            value={currentStatus?.id || ""}
            onChange={(e) => {
              const selectedStatus = order.statuses?.find(
                (s) => s.id.toString() === e.target.value
              );
              if (selectedStatus) {
                handleStatusChange(
                  selectedStatus.id.toString(),
                  selectedStatus.name
                );
              }
            }}
            disabled={updatingStatus || isOrderCancelled || showStatusComment}
            className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              updatingStatus || isOrderCancelled || showStatusComment
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            style={{ backgroundColor: "#F6F4EE" }}
            aria-label="Change Order Status"
          >
            {order.statuses?.map((status) => (
              <option key={status.id} value={status.id}>
                {status.display || status.name}
              </option>
            ))}
          </select>

          {/* Status Comment Section */}
          {showStatusComment && (
            <div className="mt-4 p-3 border border-blue-200 rounded-lg bg-blue-50">
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-800 mb-1">
                  Changing status to:{" "}
                  <span className="text-blue-600">{selectedStatusName}</span>
                </p>
                <p className="text-xs text-gray-600">
                  Add a note for this status change (optional)
                </p>
              </div>

              <textarea
                value={statusComment}
                onChange={(e) => setStatusComment(e.target.value)}
                placeholder="Enter comment for status change..."
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yelow-500 focus:border-transparent resize-none text-sm"
                style={{ backgroundColor: "#FFFFFF" }}
                disabled={updatingStatus}
              />

              <div className="flex justify-end space-x-2 mt-3">
                <button
                  onClick={handleCancelStatusChange}
                  disabled={updatingStatus}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusSubmit}
                  disabled={updatingStatus}
                  className={`flex items-center space-x-1 px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                    updatingStatus
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-600 text-white hover:bg-gray-700"
                  }`}
                >
                  {updatingStatus ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {updatingStatus && !showStatusComment && (
            <div className="flex items-center space-x-2 mt-2">
              <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
              <span className="text-sm text-blue-600">Updating status...</span>
            </div>
          )}

          {/* Cancelled Status Notice */}
          {isOrderCancelled && (
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
              <span className="text-sm text-red-600">Order is cancelled</span>
            </div>
          )}
        </div>

        {/* Comments Section */}
        {/* <div className="rounded-lg border p-4 shadow-sm" style={{ backgroundColor: '#F6F4EE' }}> */}
        {/* <div className="flex items-center space-x-2 mb-3">
            <MessageSquare className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-800">Add Comment</h2>
          </div> */}

        {/* <div className="space-y-3">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter your comment about this order..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              style={{ backgroundColor: '#FFFFFF' }}
              disabled={savingComment}
            />
            
            <div className="flex justify-end">
              <button
                onClick={handleSaveComment}
                disabled={savingComment || !comment.trim()}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  savingComment || !comment.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {savingComment ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span className="text-sm">
                  {savingComment ? 'Saving...' : 'Save Comment'}
                </span>
              </button>
            </div>
          </div> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default MobileAdminOrderDetailsPage;
