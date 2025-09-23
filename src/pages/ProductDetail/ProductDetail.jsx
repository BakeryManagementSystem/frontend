import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import ApiService from "../../services/api";
import {
  Star,
  Heart,
  Share,
  Minus,
  Plus,
  ShoppingCart,
  Shield,
  Truck,
  RotateCcw,
  Store,
  MessageCircle,
} from "lucide-react";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isBuyer, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product && isAuthenticated && isBuyer) {
      checkWishlistStatus();
    }
  }, [product, isAuthenticated, isBuyer]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await ApiService.getProduct(id);
      setProduct(response);
    } catch (error) {
      console.error("Failed to fetch product:", error);
      setError("Failed to load product details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const checkWishlistStatus = async () => {
    try {
      const response = await ApiService.checkWishlist(id);
      setIsInWishlist(response.in_wishlist);
    } catch (error) {
      console.error("Failed to check wishlist status:", error);
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      alert("Please login to add items to your wishlist");
      return;
    }

    if (!isBuyer) {
      alert("Only buyers can add items to wishlist");
      return;
    }

    setWishlistLoading(true);

    try {
      let response;
      if (isInWishlist) {
        response = await ApiService.removeFromWishlist(id);
        setIsInWishlist(false);
        alert("Product removed from wishlist!");
      } else {
        response = await ApiService.addToWishlist(id);
        setIsInWishlist(true);
        alert("Product added to wishlist!");
      }
      console.log("Wishlist operation successful:", response);
    } catch (error) {
      console.error("Failed to update wishlist:", error);
      // More detailed error handling
      if (error.response) {
        // API returned an error response
        const errorMessage =
          error.response.data?.message ||
          error.response.statusText ||
          "Unknown server error";
        alert(`Failed to update wishlist: ${errorMessage}`);
      } else if (error.request) {
        // Network error
        alert("Network error. Please check your connection and try again.");
      } else {
        // Other error
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(
        {
          id: product.id,
          name: product.name,
          price: product.discount_price || product.price,
          image: product.image_url || product.image_path,
          category: product.category,
          seller: product.owner?.name || "Unknown Seller",
          inStock: product.stock_quantity > 0,
        },
        quantity
      );
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock_quantity || 10)) {
      setQuantity(newQuantity);
    }
  };

  const handleShare = async () => {
    const productUrl = `${window.location.origin}/products/${product.id}`;
    const shareData = {
      title: product.name,
      text: `Check out this amazing product: ${product.name}`,
      url: productUrl,
    };

    try {
      // Check if Web Share API is available (mobile devices, some browsers)
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(productUrl);
        alert("Product link copied to clipboard!");
      }
    } catch (error) {
      // Final fallback: Show URL in alert
      console.error("Error sharing:", error);
      alert(`Share this product: ${productUrl}`);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={16} fill="currentColor" />);
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" size={16} fill="currentColor" opacity={0.5} />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} />);
    }

    return stars;
  };

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="error-state">
            <h2>Product not found</h2>
            <p>{error || "The product you are looking for does not exist."}</p>
            <button
              onClick={() => navigate("/products")}
              className="btn btn-primary"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const discountPercentage = product.discount_price
    ? Math.round(
        ((product.price - product.discount_price) / product.price) * 100
      )
    : 0;

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <span onClick={() => navigate("/")} className="breadcrumb-link">
            Home
          </span>
          <span className="breadcrumb-separator">/</span>
          <span
            onClick={() => navigate("/products")}
            className="breadcrumb-link"
          >
            Products
          </span>
          <span className="breadcrumb-separator">/</span>
          <span
            onClick={() => navigate(`/products?category=${product.category}`)}
            className="breadcrumb-link"
          >
            {product.category}
          </span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        <div className="product-detail-grid">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img
                src={
                  product.image_url ||
                  product.image_path ||
                  "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=600&fit=crop&crop=center"
                }
                alt={product.name}
                className="main-product-image"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-header">
              <div className="product-category">{product.category}</div>
              <h1 className="product-title">{product.name}</h1>

              <div className="product-rating">
                <div className="stars">
                  {renderStars(4.5)}{" "}
                  {/* Default rating since no reviews in API */}
                </div>
                <span className="rating-text">(4.5) • 0 reviews</span>
              </div>

              <div className="product-seller">
                <Store size={16} />
                <span>by {product.owner?.name || "Unknown Seller"}</span>
              </div>
            </div>

            <div className="product-pricing">
              <div className="price-section">
                {product.discount_price && (
                  <span className="original-price">
                    {formatPrice(product.price)}
                  </span>
                )}
                <span className="current-price">
                  {formatPrice(product.discount_price || product.price)}
                </span>
                {discountPercentage > 0 && (
                  <span className="discount-badge">-{discountPercentage}%</span>
                )}
              </div>

              <div className="stock-info">
                {product.stock_quantity > 0 ? (
                  <span className="in-stock">
                    ✓ In Stock ({product.stock_quantity} available)
                  </span>
                ) : (
                  <span className="out-of-stock">✗ Out of Stock</span>
                )}
              </div>
            </div>

            <div className="product-description">
              <p>{product.description}</p>
            </div>

            {/* Quantity and Actions */}
            <div className="product-actions">
              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= (product.stock_quantity || 10)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="action-buttons">
                <button
                  className="btn btn-primary btn-lg add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity <= 0}
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>

                <button
                  className={`btn btn-outline btn-lg wishlist-btn ${
                    isInWishlist ? "active" : ""
                  }`}
                  onClick={handleWishlist}
                  disabled={wishlistLoading}
                >
                  <Heart
                    size={20}
                    fill={isInWishlist ? "currentColor" : "none"}
                  />
                  {wishlistLoading
                    ? "Processing..."
                    : isInWishlist
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"}
                </button>

                <button
                  className="btn btn-outline btn-lg share-btn"
                  onClick={handleShare}
                >
                  <Share size={20} />
                  Share
                </button>
              </div>
            </div>

            {/* Product Features */}
            <div className="product-features">
              <div className="feature">
                <Truck size={20} />
                <span>Free shipping on orders over $25</span>
              </div>
              <div className="feature">
                <Shield size={20} />
                <span>Satisfaction guaranteed</span>
              </div>
              <div className="feature">
                <RotateCcw size={20} />
                <span>Easy returns within 24 hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="product-tabs">
          <div className="tab-headers">
            <button
              className={`tab-header ${
                activeTab === "description" ? "active" : ""
              }`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={`tab-header ${
                activeTab === "specifications" ? "active" : ""
              }`}
              onClick={() => setActiveTab("specifications")}
            >
              Specifications
            </button>
            <button
              className={`tab-header ${
                activeTab === "reviews" ? "active" : ""
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews (0)
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "description" && (
              <div className="description-content">
                <p>{product.description}</p>
                {product.ingredients && product.ingredients.length > 0 && (
                  <div className="ingredients-section">
                    <h4>Ingredients:</h4>
                    <p>
                      {Array.isArray(product.ingredients)
                        ? product.ingredients.join(", ")
                        : product.ingredients}
                    </p>
                  </div>
                )}
                {product.allergens && product.allergens.length > 0 && (
                  <div className="allergens-section">
                    <h4>Allergens:</h4>
                    <p>
                      {Array.isArray(product.allergens)
                        ? product.allergens.join(", ")
                        : product.allergens}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="specifications-content">
                <table className="specifications-table">
                  <tbody>
                    <tr>
                      <td>SKU</td>
                      <td>{product.sku || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>Category</td>
                      <td>{product.category}</td>
                    </tr>
                    <tr>
                      <td>Weight</td>
                      <td>{product.weight ? `${product.weight} kg` : "N/A"}</td>
                    </tr>
                    <tr>
                      <td>Dimensions</td>
                      <td>{product.dimensions || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>Stock Quantity</td>
                      <td>{product.stock_quantity}</td>
                    </tr>
                    <tr>
                      <td>Status</td>
                      <td>{product.status}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="reviews-content">
                <div className="no-reviews">
                  <MessageCircle size={48} />
                  <h3>No reviews yet</h3>
                  <p>Be the first to review this product!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
