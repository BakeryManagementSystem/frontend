import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import ApiService from "../../../services/api";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Eye,
  Search,
  Filter,
  Download,
  AlertCircle,
  X,
} from "lucide-react";
import "./OrderHistory.css";

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [filter, searchQuery, currentPage]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: currentPage,
        per_page: 10,
      };

      if (filter !== "all") {
        params.status = filter;
      }

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const response = await ApiService.getBuyerOrders(params);

      setOrders(response.data || []);
      setTotalPages(response.meta?.last_page || 1);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      await ApiService.cancelBuyerOrder(orderId);
      fetchOrders(); // Refresh orders list
      alert("Order cancelled successfully");
    } catch (error) {
      console.error("Failed to cancel order:", error);
      alert("Failed to cancel order. Please try again.");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="status-icon delivered" size={16} />;
      case "shipped":
        return <Truck className="status-icon shipped" size={16} />;
      case "processing":
        return <Clock className="status-icon processing" size={16} />;
      case "pending":
        return <Clock className="status-icon pending" size={16} />;
      case "cancelled":
        return <X className="status-icon cancelled" size={16} />;
      default:
        return <Package className="status-icon" size={16} />;
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
      month: "short",
      day: "numeric",
    });
  };

  if (error) {
    return (
      <div className="order-history">
        <div className="container">
          <div className="error-state">
            <AlertCircle size={48} />
            <h2>Unable to load orders</h2>
            <p>{error}</p>
            <button onClick={fetchOrders} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history">
      <div className="container">
        <div className="page-header">
          <h1>Order History</h1>
          <p>Track and manage all your orders</p>
        </div>

        {/* Filters and Search */}
        <div className="filters-section">
          <div className="search-box">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All Orders
            </button>
            <button
              className={`filter-tab ${filter === "pending" ? "active" : ""}`}
              onClick={() => setFilter("pending")}
            >
              Pending
            </button>
            <button
              className={`filter-tab ${
                filter === "processing" ? "active" : ""
              }`}
              onClick={() => setFilter("processing")}
            >
              Processing
            </button>
            <button
              className={`filter-tab ${filter === "shipped" ? "active" : ""}`}
              onClick={() => setFilter("shipped")}
            >
              Shipped
            </button>
            <button
              className={`filter-tab ${filter === "delivered" ? "active" : ""}`}
              onClick={() => setFilter("delivered")}
            >
              Delivered
            </button>
            <button
              className={`filter-tab ${filter === "cancelled" ? "active" : ""}`}
              onClick={() => setFilter("cancelled")}
            >
              Cancelled
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="orders-list">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.id}</h3>
                    <p className="order-date">
                      Placed on {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="order-status">
                    {getStatusIcon(order.status)}
                    <span>{getStatusText(order.status)}</span>
                  </div>
                </div>

                <div className="order-items">
                  {order.items && order.items.length > 0 ? (
                    order.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="item-image-container">
                          <img
                            src={
                              item.product_image || "/placeholder-product.jpg"
                            }
                            alt={item.product_name}
                            className="item-image"
                          />
                        </div>
                        <div className="item-details">
                          <h4>{item.product_name}</h4>
                          <div className="item-meta">
                            <span className="item-quantity">
                              Qty: {item.quantity}
                            </span>
                            <span className="item-price">
                              {formatPrice(item.unit_price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-items">
                      <Package size={24} />
                      <p>No items found</p>
                    </div>
                  )}
                  {order.items && order.items.length > 3 && (
                    <div className="more-items">
                      <span>
                        +{order.items.length - 3} more item
                        {order.items.length - 3 !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <span className="total-label">Total:</span>
                    <span className="total-amount">
                      {formatPrice(order.total_amount)}
                    </span>
                  </div>
                  <div className="order-actions">
                    {order.status === "pending" && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="btn btn-outline btn-sm cancel-btn"
                      >
                        <X size={14} />
                        Cancel Order
                      </button>
                    )}
                    <button
                      onClick={() =>
                        (window.location.href = `/buyer/orders/${order.id}`)
                      }
                      className="btn btn-primary btn-sm"
                    >
                      <Eye size={14} />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <Package size={64} />
              </div>
              <h2>No orders found</h2>
              <p>
                {filter === "all"
                  ? "You haven't placed any orders yet"
                  : `No ${filter} orders found`}
              </p>
              <button
                onClick={() => (window.location.href = "/products")}
                className="btn btn-primary"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="btn btn-outline pagination-btn"
            >
              Previous
            </button>
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="btn btn-outline pagination-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
