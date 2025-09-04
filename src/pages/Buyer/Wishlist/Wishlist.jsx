import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext.jsx';
import { useCart } from '../../../contexts/CartContext.jsx';
import {
  Heart,
  X,
  ShoppingCart,
  Star,
  Plus,
  Trash2
} from 'lucide-react';

const Wishlist = () => {
  const { user } = useAuth();
  const { addItem } = useCart();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API call
  useEffect(() => {
    const fetchWishlist = async () => {
      setTimeout(() => {
        setWishlistItems([
          {
            id: 1,
            name: 'Chocolate Chip Cookies',
            price: 12.99,
            originalPrice: 14.99,
            image: '/api/placeholder/300/300',
            rating: 4.8,
            reviews: 156,
            baker: 'Cookie Monster Bakery',
            inStock: true,
            discount: 15,
            addedDate: '2024-01-10'
          },
          {
            id: 2,
            name: 'Red Velvet Cake',
            price: 24.99,
            image: '/api/placeholder/300/300',
            rating: 4.9,
            reviews: 89,
            baker: 'Sweet Dreams Bakery',
            inStock: false,
            addedDate: '2024-01-08'
          },
          {
            id: 3,
            name: 'Fresh Croissants (6 pack)',
            price: 18.50,
            image: '/api/placeholder/300/300',
            rating: 4.7,
            reviews: 234,
            baker: 'French Corner Bakery',
            inStock: true,
            addedDate: '2024-01-05'
          }
        ]);
        setLoading(false);
      }, 1000);
    };

    fetchWishlist();
  }, []);

  const removeFromWishlist = (productId) => {
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const handleAddToCart = (product) => {
    addItem(product);
    // Show success message
  };

  const moveAllToCart = () => {
    wishlistItems.forEach(item => {
      if (item.inStock) {
        addItem(item);
      }
    });
    // Show success message
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="spinner"></div>
        <span className="ml-3">Loading wishlist...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        {wishlistItems.length > 0 && (
          <div className="flex space-x-3">
            <button
              onClick={moveAllToCart}
              className="btn btn-primary"
              disabled={!wishlistItems.some(item => item.inStock)}
            >
              <ShoppingCart className="w-4 h-4" />
              Add All to Cart
            </button>
            <button
              onClick={clearWishlist}
              className="btn btn-outline text-red-600 border-red-300 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Wishlist Items */}
      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="card group relative">
              {/* Remove Button */}
              <button
                onClick={() => removeFromWishlist(item.id)}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors z-10"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>

              {/* Product Image */}
              <div className="relative overflow-hidden rounded-lg mb-4">
                <Link to={`/product/${item.id}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                {/* Discount Badge */}
                {item.discount && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                    -{item.discount}%
                  </div>
                )}

                {/* Out of Stock Overlay */}
                {!item.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <Link
                  to={`/product/${item.id}`}
                  className="block hover:text-primary-color transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 line-clamp-2">
                    {item.name}
                  </h3>
                </Link>

                <p className="text-sm text-gray-500">{item.baker}</p>

                {/* Rating */}
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{item.rating}</span>
                  <span className="text-sm text-gray-500">({item.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-primary-color">
                    ${item.price}
                  </span>
                  {item.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ${item.originalPrice}
                    </span>
                  )}
                </div>

                {/* Added Date */}
                <p className="text-xs text-gray-400">
                  Added on {new Date(item.addedDate).toLocaleDateString()}
                </p>

                {/* Actions */}
                <div className="pt-2 space-y-2">
                  {item.inStock ? (
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="w-full btn btn-primary"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full btn btn-secondary opacity-50 cursor-not-allowed"
                    >
                      Out of Stock
                    </button>
                  )}

                  <Link
                    to={`/product/${item.id}`}
                    className="w-full btn btn-outline text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-600 mb-6">
            Save items you love to your wishlist for easy access later.
          </p>
          <Link to="/marketplace" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      )}

      {/* Recommendations */}
      {wishlistItems.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">You might also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="card group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg mb-3">
                  <img
                    src="/api/placeholder/200/200"
                    alt="Recommended Product"
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                  />
                  <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Vanilla Cupcakes</h3>
                <p className="text-sm text-gray-500 mb-2">Sweet Treats Bakery</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm">4.6</span>
                  </div>
                  <span className="font-bold text-primary-color">$15.99</span>
                </div>
                <button className="w-full mt-3 btn btn-sm btn-primary">
                  <Plus className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
