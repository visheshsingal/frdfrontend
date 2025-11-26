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

const ProductItem = ({ id, image, name, price, originalPrice, discount, reviews = [], showStars = true }) => {
  const { currency } = useContext(ShopContext);

  const avg = reviews && reviews.length ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length) : 0;

  return (
    <Link
      onClick={() => scrollTo(0, 0)}
      to={`/product/${id}`}
      className="block bg-white border border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-blue-500/20 transition p-3 text-slate-800"
    >
      <div className="overflow-hidden rounded-md">
        <img
          className="hover:scale-105 transition-transform duration-300 ease-in-out w-full rounded-md"
          src={image && image[0]}
          alt={name}
        />
      </div>
      
      <p className="pt-3 pb-1 text-sm font-semibold truncate">
        {name}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showStars && (
            <>
              <StarsInline rating={avg} size={12} />
              <span className="text-xs text-gray-500">{reviews ? reviews.length : 0}</span>
            </>
          )}
        </div>
        <div className="text-sm font-bold space-x-2">
          {discount > 0 ? (
            <>
              <span className="text-slate-500 line-through">{currency}{originalPrice}</span>
              <span className="text-slate-800">{currency}{price}</span>
              <span className="bg-blue-100 text-slate-800 text-xs px-1 py-0.5 rounded">
                -{discount}%
              </span>
            </>
          ) : (
            <span className="text-slate-800">{currency}{price}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
