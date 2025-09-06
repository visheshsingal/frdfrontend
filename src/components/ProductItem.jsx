import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price, originalPrice, discount }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link
      onClick={() => scrollTo(0, 0)}
      to={`/product/${id}`}
      className="block bg-black border border-gray-800 rounded-lg hover:border-white hover:shadow-white/20 transition p-3 text-white"
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
            <span className="text-gray-400 line-through">{currency}{originalPrice}</span>
            <span className="text-white">{currency}{price}</span>
            <span className="bg-gray-700 text-white text-xs px-1 py-0.5 rounded">
              -{discount}%
            </span>
          </>
        ) : (
          <span className="text-white">{currency}{price}</span>
        )}
      </div>
    </Link>
  );
};

export default ProductItem;
