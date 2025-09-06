import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext)
  const [cartData, setCartData] = useState([])

  useEffect(() => {
    if (products.length > 0) {
      const tempData = []
      for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
          if (cartItems[productId][size] > 0) {
            tempData.push({
              _id: productId,
              // size: size,
              quantity: cartItems[productId][size],
            })
          }
        }
      }
      setCartData(tempData)
    }
  }, [cartItems, products])

  const formatted = (amount) => `${currency}${amount}`

  return (
    <div className="border-t pt-14 text-white bg-black min-h-[80vh]">
      <div className="text-2xl mb-6 px-4">
        <Title text1="YOUR" text2="CART" />
      </div>

      <div className="px-4">
        {cartData.map((item, index) => {
          const productData = products.find((product) => product._id === item._id)
          if (!productData) return null

          const originalPrice = productData.price
          const discount = productData.discount || 0
          const discountedPrice = Math.round(originalPrice - (originalPrice * discount) / 100)

          return (
            <div
              key={index}
              className="py-4 border-t border-b border-gray-700 text-gray-300 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              {/* Product Info */}
              <div className="flex items-start gap-6">
                <img className="w-16 sm:w-20 rounded-lg shadow-md border border-gray-700" src={productData.image[0]} alt={productData.name} />
                <div>
                  <p className="text-sm sm:text-lg font-semibold text-green-400">{productData.name}</p>
                  <div className="flex items-center gap-5 mt-2 text-gray-400">
                    {discount > 0 ? (
                      <div className="space-x-2 text-sm sm:text-base">
                        <span className="line-through text-gray-500">{formatted(originalPrice)}</span>
                        <span className="text-green-400 font-bold">{formatted(discountedPrice)}</span>
                        <span className="bg-green-900/40 text-green-300 text-xs px-1 py-0.5 rounded">
                          -{discount}%
                        </span>
                      </div>
                    ) : (
                      <p>{formatted(originalPrice)}</p>
                    )}
                    {/* <p className="px-2 sm:px-3 sm:py-1 border border-gray-600 rounded">{item.size}</p> */}
                  </div>
                </div>
              </div>

              {/* Quantity Input */}
              <input
                onChange={(e) =>
                  e.target.value === '' || e.target.value === '0'
                    ? null
                    : updateQuantity(item._id, item.size, Number(e.target.value))
                }
                className="border border-gray-600 bg-black text-white max-w-10 sm:max-w-20 px-1 sm:px-2 py-1 rounded text-center outline-none"
                type="number"
                min={1}
                value={item.quantity}
              />

              {/* Remove Icon */}
              <img
                onClick={() => updateQuantity(item._id, item.size, 0)}
                className="w-4 mr-4 sm:w-5 cursor-pointer hover:scale-110 transition"
                src={assets.bin_icon}
                alt="Remove"
              />
            </div>
          )
        })}
      </div>

      {/* Cart Total & Checkout */}
      <div className="flex justify-end my-20 px-4">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              onClick={() => navigate('/place-order')}
              className="bg-green-500 text-black font-semibold text-sm my-8 px-8 py-3 rounded-xl hover:bg-green-400 transition"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
