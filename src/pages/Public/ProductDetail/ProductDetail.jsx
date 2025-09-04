import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext.jsx';
import { useAuth } from '../../../contexts/AuthContext.jsx';
import {
  Star,
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  Shield,
  ArrowLeft,
  Share,
  MessageCircle
} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  // Mock product data - replace with API call
  useEffect(() => {
    const fetchProduct = async () => {
      setTimeout(() => {
        setProduct({
          id: parseInt(id),
          name: 'Artisan Sourdough Bread',
          price: 8.99,
          originalPrice: 9.99,
          discount: 10,
          images: [
            '/api/placeholder/600/600',
            '/api/placeholder/600/600',
            '/api/placeholder/600/600'
          ],
          category: 'bread',
          rating: 4.8,
          reviewCount: 124,
          description: 'Our signature sourdough bread is handcrafted using traditional methods with a perfect balance of tangy flavor and soft texture. Made with organic flour and natural fermentation.',
          ingredients: ['Organic wheat flour', 'Sourdough starter', 'Sea salt', 'Filtered water'],
          baker: {
            name: 'Golden Grain Bakery',
            rating: 4.9,
            yearsInBusiness: 12,
            location: 'Downtown Dhaka'
          },
          inStock: true,
          stockCount: 15,
          nutritionFacts: {
            calories: 250,
            carbs: 45,
            protein: 8,
            fat: 2,
            fiber: 3
          },
          features: ['Organic', 'Handmade', 'No Preservatives', 'Same Day Fresh']
        });

        setReviews([
          {
            id: 1,
            user: 'Sarah J.',
            rating: 5,
            comment: 'Amazing bread! The crust is perfect and the texture is incredible.',
            date: '2024-01-10',
            verified: true
          },
          {
            id: 2,
            user: 'Mike C.',
            rating: 4,
            comment: 'Great quality bread, will definitely order again.',
            date: '2024-01-08',
            verified: true
          }
        ]);

        setRelatedProducts([
          { id: 2, name: 'Whole Wheat Bread', price: 7.99, image: '/api/placeholder/200/200', rating: 4.6 },
          { id: 3, name: 'Rye Bread', price: 9.49, image: '/api/placeholder/200/200', rating: 4.7 },
          { id: 4, name: 'Multigrain Bread', price: 8.49, image: '/api/placeholder/200/200', rating: 4.5 }
        ]);

        setLoading(false);
      }, 1000);
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      // Show success message
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stockCount) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="spinner"></div>
          <span className="ml-3">Loading product...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <Link to="/marketplace" className="btn btn-primary">
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <Link to="/marketplace" className="flex items-center text-primary-color hover:text-primary-dark">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Marketplace
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
            {product.discount && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-medium">
                -{product.discount}% OFF
              </div>
            )}
            <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
              <Heart className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="flex space-x-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index ? 'border-primary-color' : 'border-gray-200'
                }`}
              >
                <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-medium">{product.rating}</span>
                <span className="text-gray-500">({product.reviewCount} reviews)</span>
              </div>
              <span className="text-gray-300">•</span>
              <span className="text-sm text-gray-600">{product.baker.name}</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-3">
            <span className="text-3xl font-bold text-primary-color">${product.price}</span>
            {product.originalPrice && (
              <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-2">
            {product.features.map((feature, index) => (
              <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                {feature}
              </span>
            ))}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="font-medium text-gray-900">Quantity:</label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-sm text-gray-500">
                {product.stockCount} in stock
              </span>
            </div>

            {isAuthenticated ? (
              <div className="flex space-x-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 btn btn-primary btn-lg"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button className="btn btn-secondary">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="btn btn-secondary">
                  <Share className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 mb-2">Please log in to purchase this product</p>
                <Link to="/auth/login" className="btn btn-primary">
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Delivery Info */}
          <div className="border-t border-gray-200 pt-6 space-y-3">
            <div className="flex items-center space-x-3">
              <Truck className="w-5 h-5 text-green-600" />
              <span className="text-sm">Free delivery on orders over $25</span>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="text-sm">100% satisfaction guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mb-12">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button className="py-2 px-1 border-b-2 border-primary-color text-primary-color font-medium">
              Details
            </button>
            <button className="py-2 px-1 text-gray-500 hover:text-gray-700">
              Reviews ({product.reviewCount})
            </button>
            <button className="py-2 px-1 text-gray-500 hover:text-gray-700">
              Nutrition
            </button>
          </nav>
        </div>

        <div className="py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Ingredients</h3>
              <ul className="space-y-1">
                {product.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-gray-600">• {ingredient}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Baker Information</h3>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Bakery:</span> {product.baker.name}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Rating:</span> {product.baker.rating}/5
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Experience:</span> {product.baker.yearsInBusiness} years
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Location:</span> {product.baker.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="card">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  {review.user.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium">{review.user}</span>
                    {review.verified && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Related Products */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <Link
              key={relatedProduct.id}
              to={`/product/${relatedProduct.id}`}
              className="card group cursor-pointer"
            >
              <img
                src={relatedProduct.image}
                alt={relatedProduct.name}
                className="w-full h-48 object-cover rounded-lg mb-3 group-hover:scale-105 transition-transform"
              />
              <h3 className="font-medium text-gray-900 mb-1">{relatedProduct.name}</h3>
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary-color">${relatedProduct.price}</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm">{relatedProduct.rating}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
