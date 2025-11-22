import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price, originalPrice, discount }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link
      onClick={() => scrollTo(0, 0)}
      to={`/product/${id}`}
      className="block bg-white border border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-blue-500/20 transition p-3 text-slate-800"
    >
      <div className="overflow-hidden rounded-md">
        <img
          className="hover:scale-105 transition-transform duration-300 ease-in-out w-full rounded-md"
          src={image[0]}
          alt={name}
        />
      </div>
      
      <p className="pt-3 pb-1 text-sm font-semibold truncate">
        {name}
      </p>

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
    </Link>
  );
};

export default ProductItem;
