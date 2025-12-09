import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import SubHeader from "../components/SubHeader";
import axios from "axios";
import LoginModal from "../components/LoginModal";
import {baseURL} from "../pages/baseurl/apiDomain";

const OrderDetails = () => {
  const [showModal, setShowModal] = useState(false);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const statusOptions = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const getOrderDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      
      if (!token) {
        setShowModal(true);
        return;
      }

      const response = await axios.get(`${baseURL}orders/${id}.json`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        setOrder(response.data.order || response.data);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      if (error.response?.status === 401) {
        setShowModal(true);
      } else if (error.response?.status === 404) {
        setError("Order not found");
      } else {
        setError("Failed to fetch order details");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus, notes = "") => {
    try {
      setUpdatingStatus(true);
      const token = localStorage.getItem("access_token");
      
      if (!token) {
        setShowModal(true);
        return;
      }

      const url = `${baseURL}orders/${id}/status_update.json?status=${newStatus}&notes=${encodeURIComponent(notes)}`;
      
      await axios.put(url, {}, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh order details after successful update
      await getOrderDetails();
      
    } catch (error) {
      console.error("Error updating order status:", error);
      if (error.response?.status === 401) {
        setShowModal(true);
      } else {
        setError("Failed to update order status");
      }
    } finally {
      setUpdatingStatus(false);
    }
  };

  useEffect(() => {
    if (id) {
      getOrderDetails();
    }
  }, [id]);

  const handleStatusChange = (newStatus) => {
    const notes = prompt("Enter notes for status update (optional):");
    if (notes !== null) { // User didn't cancel
      updateOrderStatus(newStatus, notes);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'badge bg-warning text-dark';
      case 'confirmed': return 'badge bg-info';
      case 'processing': return 'badge bg-primary';
      case 'shipped': return 'badge bg-secondary';
      case 'delivered': return 'badge bg-success';
      case 'cancelled': return 'badge bg-danger';
      case 'refunded': return 'badge bg-dark';
      default: return 'badge bg-light text-dark';
    }
  };

  const getPaymentStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'badge bg-warning text-dark';
      case 'paid': return 'badge bg-success';
      case 'partially_paid': return 'badge bg-info';
      case 'failed': return 'badge bg-danger';
      case 'refunded': return 'badge bg-secondary';
      default: return 'badge bg-light text-dark';
    }
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <SubHeader />
        <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid">
        <SubHeader />
        <div className="container-fluid px-0 my-4">
          <div className="row mx-0">
            <div className="col-lg-12 px-0">
              <div className="main_content_iner overly_inner">
                <div className="container-fluid p-0">
                  <div className="row">
                    <div className="col-12">
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                      <Link to="/orders" className="btn btn-primary">
                        Back to Orders
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-fluid">
        <SubHeader />
        <div className="container-fluid px-0 my-4">
          <div className="text-center">
            <p>Order not found</p>
            <Link to="/orders" className="btn btn-primary">
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <SubHeader />
      <div className="container-fluid px-0 my-4">
        <div className="row mx-0">
          <div className="col-lg-12 px-0">
            <div className="main_content_iner overly_inner">
              <div className="container-fluid p-0">
                <div className="row">
                  <div className="col-12">
                    <div className="page_title_box d-flex align-items-center justify-content-between">
                      <div className="page_title_left">
                        <h3 className="f_s_30 f_w_700 text_white">Order Details</h3>
                        <ol className="breadcrumb page_bradcam mb-0">
                          <li className="breadcrumb-item">
                            <Link to="/">Dashboard</Link>
                          </li>
                          <li className="breadcrumb-item">
                            <Link to="/orders">Orders</Link>
                          </li>
                          <li className="breadcrumb-item active">Order #{order.order_number}</li>
                        </ol>
                      </div>
                      <div>
                        <Link to="/orders" className="btn btn-outline-light">
                          Back to Orders
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="row mt-4">
                  <div className="col-md-8">
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title mb-0">Order Information</h5>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <table className="table table-borderless">
                              <tbody>
                                <tr>
                                  <td><strong>Order ID:</strong></td>
                                  <td>{order.id}</td>
                                </tr>
                                <tr>
                                  <td><strong>Order Number:</strong></td>
                                  <td><code>{order.order_number}</code></td>
                                </tr>
                                <tr>
                                  <td><strong>Status:</strong></td>
                                  <td>
                                    <select
                                      className={`form-select form-select-sm ${getStatusBadgeClass(order.status)}`}
                                      value={order.status}
                                      onChange={(e) => handleStatusChange(e.target.value)}
                                      disabled={updatingStatus}
                                      style={{ maxWidth: '150px' }}
                                    >
                                      {statusOptions.map(status => (
                                        <option key={status} value={status}>
                                          {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </option>
                                      ))}
                                    </select>
                                    {updatingStatus && (
                                      <div className="spinner-border spinner-border-sm ms-2" role="status">
                                        <span className="visually-hidden">Updating...</span>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <td><strong>Payment Status:</strong></td>
                                  <td>
                                    <span className={getPaymentStatusBadgeClass(order.payment_status)}>
                                      {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1).replace('_', ' ')}
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="col-md-6">
                            <table className="table table-borderless">
                              <tbody>
                                <tr>
                                  <td><strong>Total Amount:</strong></td>
                                  <td className="text-success">₹{parseFloat(order.total_amount).toFixed(2)}</td>
                                </tr>
                                <tr>
                                  <td><strong>Points Redeemed:</strong></td>
                                  <td>
                                    <span className="badge bg-primary">
                                      {order.loyalty_points_redeemed.toLocaleString()} pts
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td><strong>Total Items:</strong></td>
                                  <td>{order.total_items}</td>
                                </tr>
                                <tr>
                                  <td><strong>Created At:</strong></td>
                                  <td>{formatDate(order.created_at)}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="card mt-4">
                      <div className="card-header">
                        <h5 className="card-title mb-0">Order Items</h5>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Product Name</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Total Price</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.order_items.map((item, index) => (
                                <tr key={index}>
                                  <td>{item.product_name}</td>
                                  <td>{item.quantity}</td>
                                  <td>₹{parseFloat(item.unit_price).toFixed(2)}</td>
                                  <td>₹{parseFloat(item.total_price).toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    {/* Customer Information */}
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title mb-0">Customer Information</h5>
                      </div>
                      <div className="card-body">
                        <table className="table table-borderless">
                          <tbody>
                            <tr>
                              <td><strong>Name:</strong></td>
                              <td>{order.user.name || 'N/A'}</td>
                            </tr>
                            <tr>
                              <td><strong>Email:</strong></td>
                              <td>{order.user.email}</td>
                            </tr>
                            <tr>
                              <td><strong>User ID:</strong></td>
                              <td>{order.user.id}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="card mt-4">
                      <div className="card-header">
                        <h5 className="card-title mb-0">Shipping Address</h5>
                      </div>
                      <div className="card-body">
                        <address>
                          <strong>{order.shipping_address.contact_person}</strong><br />
                          {order.shipping_address.address}<br />
                          {order.shipping_address.city}, {order.shipping_address.state}<br />
                          PIN: {order.shipping_address.pin_code}<br />
                          <strong>Mobile:</strong> {order.shipping_address.mobile}
                        </address>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="card mt-4">
                      <div className="card-header">
                        <h5 className="card-title mb-0">Actions</h5>
                      </div>
                      <div className="card-body">
                        {order.can_be_cancelled && (
                          <button 
                            className="btn btn-danger w-100 mb-2"
                            onClick={() => handleStatusChange('cancelled')}
                            disabled={updatingStatus}
                          >
                            Cancel Order
                          </button>
                        )}
                        <button 
                          className="btn btn-info w-100 mb-2"
                          onClick={() => window.print()}
                        >
                          Print Order
                        </button>
                        <Link 
                          to={`/members/${order.user.id}`}
                          className="btn btn-outline-primary w-100"
                        >
                          View Customer Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <LoginModal showModal={showModal} setShowModal={setShowModal} />
      )}
    </div>
  );
};

export default OrderDetails;
