import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary-color mb-4">404</div>
          <div className="text-6xl mb-4">🍞</div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Looks like this page got eaten! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to="/"
            className="w-full btn btn-primary btn-lg"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>

          <Link
            to="/marketplace"
            className="w-full btn btn-secondary btn-lg"
          >
            <Search className="w-5 h-5" />
            Browse Products
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full btn btn-outline btn-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-12 p-6 bg-white rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-4">
            If you think this is an error, please contact our support team.
          </p>
          <Link
            to="/contact"
            className="text-primary-color hover:text-primary-dark text-sm font-medium"
          >
            Contact Support →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
