import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext)

  return (
    <Link
      onClick={() => scrollTo(0, 0)}
      to={`/product/${id}`}
      className="block border border-gray-200 rounded hover:shadow-lg transition p-3 text-[#052659]"
    >
      <div className="overflow-hidden rounded">
        <img
          className="hover:scale-105 transition-transform duration-300 ease-in-out w-full"
          src={image[0]}
          alt={name}
        />
      </div>
      <p className="pt-3 pb-1 text-sm font-semibold truncate">{name}</p>
      <p className="text-sm font-bold">{currency}{price}</p>
    </Link>
  )
}

export default ProductItem
