import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showInfo = true
}) => {
  // Calculate visible page range
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Calculate start and end of visible range
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    // Add pages to range
    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // Add first page and dots if needed
    if (start > 2) {
      rangeWithDots.push(1);
      if (start > 3) {
        rangeWithDots.push('...');
      }
    } else if (start === 2) {
      rangeWithDots.push(1);
    }

    // Add visible range
    rangeWithDots.push(...range);

    // Add last page and dots if needed
    if (end < totalPages - 1) {
      if (end < totalPages - 2) {
        rangeWithDots.push('...');
      }
      rangeWithDots.push(totalPages);
    } else if (end === totalPages - 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Don't render if there's only one page or no items
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages();
  const startItem = ((currentPage - 1) * itemsPerPage) + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="pagination-wrapper">
      {showInfo && (
        <div className="pagination-info">
          <span>
            Showing {startItem}-{endItem} of {totalItems} products
          </span>
        </div>
      )}

      <nav className="pagination" role="navigation" aria-label="Pagination Navigation">
        {/* Previous Button */}
        <button
          className={`pagination-btn pagination-prev ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={handlePrevious}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        {/* Page Numbers */}
        <div className="pagination-pages">
          {visiblePages.map((page, index) => {
            if (page === '...') {
              return (
                <span key={`dots-${index}`} className="pagination-dots">
                  ...
                </span>
              );
            }

            return (
              <button
                key={page}
                className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          className={`pagination-btn pagination-next ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </nav>

      {/* Mobile pagination info */}
      <div className="pagination-mobile-info">
        <span>Page {currentPage} of {totalPages}</span>
      </div>
    </div>
  );
};

export default Pagination;
