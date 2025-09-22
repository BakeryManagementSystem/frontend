import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '../../services/api';
import {
  Store,
  MapPin,
  Star,
  Clock,
  Phone,
  Globe,
  Search,
  Filter,
  Grid,
  List,
  ChefHat
} from 'lucide-react';
import './BakeryShops.css';

const BakeryShops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('grid');
  const [filteredShops, setFilteredShops] = useState([]);

  useEffect(() => {
    fetchBakeryShops();
  }, []);

  useEffect(() => {
    filterShops();
  }, [shops, searchQuery, sortBy]);

  const fetchBakeryShops = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch shops/bakeries from the API
      const response = await ApiService.getBakeryShops();

      if (response.success && response.shops) {
        setShops(response.shops);
      } else {
        // Mock data for demonstration while backend is being set up
        setShops([
          {
            id: 1,
            name: "Sweet Dreams Bakery",
            description: "Artisan breads and pastries made fresh daily",
            owner: { name: "Maria Rodriguez" },
            address: "123 Main St, Downtown",
            city: "New York",
            state: "NY",
            phone: "(555) 123-4567",
            website: "www.sweetdreamsbakery.com",
            rating: 4.8,
            total_reviews: 156,
            image: "/placeholder-bakery1.jpg",
            status: "open",
            hours: "6:00 AM - 8:00 PM",
            specialties: ["Artisan Breads", "Wedding Cakes", "French Pastries"],
            total_products: 45
          },
          {
            id: 2,
            name: "Golden Crust Bakehouse",
            description: "Traditional family recipes passed down for generations",
            owner: { name: "John Smith" },
            address: "456 Oak Ave, Midtown",
            city: "New York",
            state: "NY",
            phone: "(555) 987-6543",
            website: "www.goldencrustbakehouse.com",
            rating: 4.6,
            total_reviews: 89,
            image: "/placeholder-bakery2.jpg",
            status: "open",
            hours: "7:00 AM - 7:00 PM",
            specialties: ["Sourdough", "Croissants", "Custom Cakes"],
            total_products: 32
          },
          {
            id: 3,
            name: "Heavenly Delights",
            description: "Gluten-free and organic bakery specializing in healthy treats",
            owner: { name: "Sarah Johnson" },
            address: "789 Pine St, Uptown",
            city: "New York",
            state: "NY",
            phone: "(555) 456-7890",
            website: "www.heavenlydelights.com",
            rating: 4.9,
            total_reviews: 203,
            image: "/placeholder-bakery3.jpg",
            status: "open",
            hours: "8:00 AM - 6:00 PM",
            specialties: ["Gluten-Free", "Vegan Options", "Organic Ingredients"],
            total_products: 28
          },
          {
            id: 4,
            name: "The Flour Garden",
            description: "Fresh donuts, muffins, and breakfast pastries",
            owner: { name: "Mike Wilson" },
            address: "321 Elm Dr, Westside",
            city: "New York",
            state: "NY",
            phone: "(555) 234-5678",
            website: "www.theflowergarden.com",
            rating: 4.4,
            total_reviews: 67,
            image: "/placeholder-bakery4.jpg",
            status: "closed",
            hours: "5:00 AM - 2:00 PM",
            specialties: ["Fresh Donuts", "Breakfast Pastries", "Coffee Cakes"],
            total_products: 38
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch bakery shops:', error);
      setError('Failed to load bakery shops. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterShops = () => {
    let filtered = [...shops];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(shop =>
        shop.name.toLowerCase().includes(query) ||
        shop.description.toLowerCase().includes(query) ||
        shop.owner.name.toLowerCase().includes(query) ||
        shop.city.toLowerCase().includes(query) ||
        shop.specialties.some(specialty => specialty.toLowerCase().includes(query))
      );
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        filtered.sort((a, b) => b.total_reviews - a.total_reviews);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'products':
        filtered.sort((a, b) => b.total_products - a.total_products);
        break;
      default:
        break;
    }

    setFilteredShops(filtered);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={16} className="star filled" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" size={16} className="star half" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} className="star empty" />);
    }

    return stars;
  };

  return (
    <div className="bakery-shops">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>
              <Store size={32} />
              Bakery Shops
            </h1>
            <p>Discover amazing local bakeries in your area</p>
          </div>
          <div className="header-stats">
            <div className="stat">
              <span className="stat-number">{shops.length}</span>
              <span className="stat-label">Bakeries</span>
            </div>
            <div className="stat">
              <span className="stat-number">{shops.filter(s => s.status === 'open').length}</span>
              <span className="stat-label">Open Now</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Controls */}
        <div className="shops-controls">
          <div className="search-section">
            <div className="search-bar">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search bakeries, specialties, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="filter-section">
            <div className="sort-controls">
              <label htmlFor="sortBy">
                <Filter size={16} />
                Sort by:
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="rating">Rating</option>
                <option value="reviews">Most Reviews</option>
                <option value="name">Name</option>
                <option value="products">Most Products</option>
              </select>
            </div>

            <div className="view-controls">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <Grid size={16} />
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="results-info">
          <p>Showing {filteredShops.length} of {shops.length} bakeries</p>
        </div>

        {/* Shops List */}
        <div className={`shops-list ${viewMode}`}>
          {filteredShops.length > 0 ? (
            filteredShops.map(shop => (
              <div key={shop.id} className="shop-card">
                <div className="shop-image">
                  <img src={shop.image} alt={shop.name} />
                  <div className={`shop-status ${shop.status}`}>
                    {shop.status === 'open' ? 'Open' : 'Closed'}
                  </div>
                </div>

                <div className="shop-content">
                  <div className="shop-header">
                    <h3 className="shop-name">{shop.name}</h3>
                    <div className="shop-rating">
                      <div className="stars">{renderStars(shop.rating)}</div>
                      <span className="rating-text">
                        {shop.rating} ({shop.total_reviews} reviews)
                      </span>
                    </div>
                  </div>

                  <p className="shop-description">{shop.description}</p>

                  <div className="shop-details">
                    <div className="detail-item">
                      <MapPin size={14} />
                      <span>{shop.address}, {shop.city}, {shop.state}</span>
                    </div>
                    <div className="detail-item">
                      <Clock size={14} />
                      <span>{shop.hours}</span>
                    </div>
                    <div className="detail-item">
                      <Phone size={14} />
                      <span>{shop.phone}</span>
                    </div>
                    {shop.website && (
                      <div className="detail-item">
                        <Globe size={14} />
                        <a href={`https://${shop.website}`} target="_blank" rel="noopener noreferrer">
                          {shop.website}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="shop-specialties">
                    <h4>Specialties:</h4>
                    <div className="specialty-tags">
                      {shop.specialties.map((specialty, index) => (
                        <span key={index} className="specialty-tag">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="shop-stats">
                    <div className="stat">
                      <span className="stat-number">{shop.total_products}</span>
                      <span className="stat-label">Products</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">By {shop.owner.name}</span>
                    </div>
                  </div>
                </div>

                <div className="shop-actions">
                  <Link
                    to={`/bakery/${shop.id}`}
                    className="btn btn-primary"
                  >
                    <Store size={16} />
                    Visit Shop
                  </Link>
                  <button className="btn btn-outline">
                    <Phone size={16} />
                    Call
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <Store size={64} />
              <h3>No bakeries found</h3>
              <p>
                {searchQuery
                  ? 'No bakeries match your search criteria. Try adjusting your search terms.'
                  : 'No bakeries are currently available in this area.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BakeryShops;
