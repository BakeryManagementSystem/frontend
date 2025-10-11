import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import './ReviewModal.css';

const ReviewModal = ({ isOpen, onClose, onSubmit, product, loading }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    onSubmit({ rating, review: reviewText });
  };

  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    setReviewText('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="review-modal-overlay" onClick={handleClose}>
      <div className="review-modal" onClick={(e) => e.stopPropagation()}>
        <div className="review-modal-header">
          <h3>Write a Review</h3>
          <button className="close-btn" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>

        <div className="review-modal-body">
          <div className="product-info">
            {product?.image && (
              <img src={product.image} alt={product.name} className="product-thumbnail" />
            )}
            <div>
              <h4>{product?.name}</h4>
              <p className="product-category">{product?.category}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your Rating *</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${
                      star <= (hoveredRating || rating) ? 'active' : ''
                    }`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                  >
                    <Star
                      size={32}
                      fill={star <= (hoveredRating || rating) ? 'currentColor' : 'none'}
                    />
                  </button>
                ))}
              </div>
              <p className="rating-text">
                {rating === 0 ? 'Select a rating' :
                 rating === 1 ? 'Poor' :
                 rating === 2 ? 'Fair' :
                 rating === 3 ? 'Good' :
                 rating === 4 ? 'Very Good' :
                 'Excellent'}
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="review-text">Your Review (Optional)</label>
              <textarea
                id="review-text"
                rows="5"
                placeholder="Share your experience with this product..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                maxLength={1000}
              />
              <p className="char-count">{reviewText.length}/1000 characters</p>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || rating === 0}
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;

