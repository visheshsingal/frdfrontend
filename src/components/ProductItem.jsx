import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const Star = ({ filled = false, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" className="inline-block">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.174c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.538 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.783.57-1.838-.197-1.538-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.393c-.783-.57-.38-1.81.588-1.81h4.174a1 1 0 00.95-.69l1.286-3.966z" />
  </svg>
);

const StarsInline = ({ rating = 0, size = 12 }) => {
  const rounded = Math.round(rating);
  const stars = [0,1,2,3,4].map(i => <Star key={i} filled={i < rounded} size={size} />);
  return <span className="inline-flex items-center gap-0.5 text-yellow-500">{stars}</span>;
};

// View Icon Component
const ViewIcon = ({ className = "w-5 h-5" }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const ProductItem = ({ id, image, name, price, originalPrice, discount, reviews = [], showStars = true }) => {
  const { currency } = useContext(ShopContext);

  const avg = reviews && reviews.length ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length) : 0;

  return (
    <Link
      onClick={() => scrollTo(0, 0)}
      to={`/product/${id}`}
      className="block bg-white border border-gray-200 rounded-2xl hover:shadow-2xl hover:border-blue-500/30 transition-all duration-300 ease-out p-4 text-slate-800 relative overflow-hidden group"
    >
      {/* Dark Blue Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-blue-500/0 to-blue-700/0 group-hover:from-blue-600/5 group-hover:via-blue-500/3 group-hover:to-blue-700/8 transition-all duration-300 rounded-2xl -z-10" />
      
      {/* View Icon - Card Bottom Right (Fixed Position) */}
      <div className="absolute bottom-4 right-4 z-10 transform group-hover:scale-110 transition-all duration-300">
        <div className="bg-white p-2 rounded-full shadow-lg border border-gray-200 group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-blue-50 group-hover:border-blue-200">
          <ViewIcon className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
        </div>
      </div>

      {/* Image Container - Full image without fixed aspect ratio */}
      <div className="overflow-hidden rounded-xl mb-3 w-full">
        <img
          className="group-hover:scale-105 transition-transform duration-500 ease-out w-full h-auto object-contain rounded-xl"
          src={image && image[0]}
          alt={name}
        />
      </div>
      
      {/* Product Name */}
      <p className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-blue-700 transition-colors pr-12">
        {name}
      </p>

      {/* Rating and Reviews */}
      {showStars && (
        <div className="flex items-center gap-2 mb-3">
          <StarsInline rating={avg} size={12} />
          <span className="text-xs text-gray-500 font-medium">{reviews ? reviews.length : 0} reviews</span>
        </div>
      )}

      {/* Price Section - All Left Aligned */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">{currency}{price}</span>
          {discount > 0 && (
            <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
              -{discount}%
            </span>
          )}
        </div>
        
        {discount > 0 && (
          <span className="text-sm text-gray-500 line-through font-medium">
            {currency}{originalPrice}
          </span>
        )}
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-2xl transition-all duration-300 pointer-events-none" />
    </Link>
  );
};

export default ProductItem;