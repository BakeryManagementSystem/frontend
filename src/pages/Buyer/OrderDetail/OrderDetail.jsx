import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import ApiService from "../../../services/api";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  X,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  AlertCircle,
  Download,
  RefreshCw,
  Store,
  User,
  Building2,
} from "lucide-react";
import "./OrderDetail.css";

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const fetchOrderDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await ApiService.getBuyerOrder(orderId);
      setOrder(response.data || response);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
      setError("Failed to load order details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrderDetail();
    setRefreshing(false);
  };

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      await ApiService.cancelBuyerOrder(orderId);
      await fetchOrderDetail(); // Refresh order details
      alert("Order cancelled successfully");
    } catch (error) {
      console.error("Failed to cancel order:", error);
      alert("Failed to cancel order. Please try again.");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="status-icon delivered" size={20} />;
      case "shipped":
        return <Truck className="status-icon shipped" size={20} />;
      case "processing":
        return <Clock className="status-icon processing" size={20} />;
      case "pending":
        return <Clock className="status-icon pending" size={20} />;
      case "cancelled":
        return <X className="status-icon cancelled" size={20} />;
      default:
        return <Package className="status-icon" size={20} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "delivered":
        return "Delivered";
      case "shipped":
        return "Shipped";
      case "processing":
        return "Processing";
      case "pending":
        return "Pending";
      case "cancelled":
        return "Cancelled";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "status-delivered";
      case "shipped":
        return "status-shipped";
      case "processing":
        return "status-processing";
      case "pending":
        return "status-pending";
      case "cancelled":
        return "status-cancelled";
      default:
        return "status-default";
    }
  };

  if (loading) {
    return (
      <div className="order-detail">
        <div className="container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-detail">
        <div className="container">
          <div className="error-state">
            <AlertCircle size={48} />
            <h2>Unable to load order details</h2>
            <p>{error}</p>
            <div className="error-actions">
              <button onClick={handleRefresh} className="btn btn-outline">
                <RefreshCw size={16} />
                Try Again
              </button>
              <button
                onClick={() => navigate("/buyer/orders")}
                className="btn btn-primary"
              >
                Back to Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-detail">
        <div className="container">
          <div className="error-state">
            <AlertCircle size={48} />
            <h2>Order not found</h2>
            <p>
              The order you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate("/buyer/orders")}
              className="btn btn-primary"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-detail">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <button
            onClick={() => navigate("/buyer/orders")}
            className="btn btn-outline back-btn"
          >
            <ArrowLeft size={16} />
            Back to Orders
          </button>
          <div className="header-content">
            <h1>Order Details</h1>
            <div className="order-meta">
              <span className="order-number">Order #{order.id}</span>
              <span className="order-date">{formatDate(order.created_at)}</span>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn btn-outline refresh-btn"
          >
            <RefreshCw size={16} className={refreshing ? "spinning" : ""} />
            Refresh
          </button>
        </div>

        <div className="order-content">
          {/* Order Status */}
          <div className="order-status-card">
            <div className="status-header">
              <div className="status-info">
                {getStatusIcon(order.status)}
                <div className="status-text">
                  <h3>Order Status</h3>
                  <span
                    className={`status-badge ${getStatusColor(order.status)}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
              {order.status === "pending" && (
                <button
                  onClick={handleCancelOrder}
                  className="btn btn-outline btn-sm cancel-btn"
                >
                  <X size={14} />
                  Cancel Order
                </button>
              )}
            </div>
            {order.status === "shipped" && order.tracking_number && (
              <div className="tracking-info">
                <p>
                  <strong>Tracking Number:</strong> {order.tracking_number}
                </p>
              </div>
            )}
          </div>

          {/* Shop Information */}
          {order.items &&
            order.items.length > 0 &&
            order.items[0].shop_name && (
              <div className="shop-info-card">
                <h3>Shop Information</h3>
                <div className="shop-details">
                  <div className="shop-header">
                    <Store size={20} />
                    <div className="shop-name">
                      <h4>{order.items[0].shop_name}</h4>
                      {order.items[0].shop_owner_name && (
                        <p className="shop-owner">
                          <User size={14} />
                          Owner: {order.items[0].shop_owner_name}
                        </p>
                      )}
                    </div>
                  </div>
                  {order.items[0].shop_address && (
                    <div className="shop-address">
                      <Building2 size={16} />
                      <div>
                        <p>{order.items[0].shop_address.street}</p>
                        <p>
                          {order.items[0].shop_address.city},{" "}
                          {order.items[0].shop_address.state}{" "}
                          {order.items[0].shop_address.zip_code}
                        </p>
                        <p>{order.items[0].shop_address.country}</p>
                      </div>
                    </div>
                  )}
                  {order.items[0].shop_phone && (
                    <div className="shop-contact">
                      <Phone size={16} />
                      <span>{order.items[0].shop_phone}</span>
                    </div>
                  )}
                  {order.items[0].shop_email && (
                    <div className="shop-contact">
                      <Mail size={16} />
                      <span>{order.items[0].shop_email}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* Order Items */}
          <div className="order-items-card">
            <h3>Order Items</h3>
            <div className="items-list">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-image-container">
                      <img
                        src={item.product_image || "/placeholder-product.jpg"}
                        alt={item.product_name}
                        className="item-image"
                      />
                    </div>
                    <div className="item-details">
                      <h4>{item.product_name}</h4>
                      {item.product_description && (
                        <p className="item-description">
                          {item.product_description}
                        </p>
                      )}
                      <div className="item-meta">
                        <span className="item-quantity">
                          Quantity: {item.quantity}
                        </span>
                        <span className="item-price">
                          {formatPrice(item.unit_price)}
                        </span>
                        <span className="item-total">
                          {formatPrice(item.unit_price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-items">
                  <Package size={24} />
                  <p>No items found in this order</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary-card">
            <h3>Order Summary</h3>
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>{formatPrice(order.subtotal || order.total_amount)}</span>
              </div>
              {order.tax_amount && (
                <div className="summary-row">
                  <span>Tax:</span>
                  <span>{formatPrice(order.tax_amount)}</span>
                </div>
              )}
              {order.shipping_amount && (
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>{formatPrice(order.shipping_amount)}</span>
                </div>
              )}
              {order.discount_amount && (
                <div className="summary-row discount">
                  <span>Discount:</span>
                  <span>-{formatPrice(order.discount_amount)}</span>
                </div>
              )}
              <div className="summary-row total">
                <span>Total:</span>
                <span>{formatPrice(order.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          {order.shipping_address && (
            <div className="shipping-info-card">
              <h3>Shipping Information</h3>
              <div className="shipping-details">
                <div className="shipping-address">
                  <MapPin size={16} />
                  <div>
                    <p>{order.shipping_address.street}</p>
                    <p>
                      {order.shipping_address.city},{" "}
                      {order.shipping_address.state}{" "}
                      {order.shipping_address.zip_code}
                    </p>
                    <p>{order.shipping_address.country}</p>
                  </div>
                </div>
                {order.shipping_address.phone && (
                  <div className="shipping-contact">
                    <Phone size={16} />
                    <span>{order.shipping_address.phone}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payment Information */}
          {order.payment_method && (
            <div className="payment-info-card">
              <h3>Payment Information</h3>
              <div className="payment-details">
                <div className="payment-method">
                  <CreditCard size={16} />
                  <span>{order.payment_method}</span>
                </div>
                {order.payment_status && (
                  <div className="payment-status">
                    <span>Status: {order.payment_status}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Timeline */}
          {order.status_history && order.status_history.length > 0 && (
            <div className="order-timeline-card">
              <h3>Order Timeline</h3>
              <div className="timeline">
                {order.status_history.map((status, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-marker">
                      {getStatusIcon(status.status)}
                    </div>
                    <div className="timeline-content">
                      <h4>{getStatusText(status.status)}</h4>
                      <p>{formatDate(status.created_at)}</p>
                      {status.note && (
                        <p className="status-note">{status.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
