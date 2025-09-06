import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'

const CartTotal = () => {
  const { currency, delivery_fee, products, cartItems } = useContext(ShopContext)

  let subtotal = 0
  let totalDiscount = 0

  for (const productId in cartItems) {
    const product = products.find(p => p._id === productId)
    if (!product) continue

    const discount = product.discount || 0
    const originalPrice = product.price
    const discountedPrice = Math.round(originalPrice - (originalPrice * discount) / 100)

    for (const size in cartItems[productId]) {
      const qty = cartItems[productId][size]
      subtotal += discountedPrice * qty
      totalDiscount += (originalPrice - discountedPrice) * qty
    }
  }

  const formatted = (amount) => `${currency}${amount.toLocaleString('en-IN')}.00`
  const total = subtotal + (subtotal === 0 ? 0 : delivery_fee)

  return (
    <div className="w-full bg-black text-white p-6 rounded-2xl shadow-lg border border-green-500/20 transition duration-300 hover:shadow-green-500/20">
      
      <div className="text-2xl font-bold text-green-400 mb-4">
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>

      <div className="flex flex-col gap-3 text-sm">

        <div className="flex justify-between">
          <p className="text-gray-300">Subtotal</p>
          <p className="font-medium">{formatted(subtotal)}</p>
        </div>

        {totalDiscount > 0 && (
          <div className="flex justify-between text-green-400">
            <p>You Saved</p>
            <p>-{formatted(totalDiscount)}</p>
          </div>
        )}

        <div className="border-t border-gray-700 my-2"></div>

        <div className="flex justify-between">
          <p className="text-gray-300">Shipping Fee</p>
          <p className="font-medium">{subtotal === 0 ? formatted(0) : formatted(delivery_fee)}</p>
        </div>

        <div className="border-t border-gray-700 my-2"></div>

        <div className="flex justify-between text-base font-semibold text-green-400">
          <p>Total</p>
          <p>{formatted(total)}</p>
        </div>
      </div>
    </div>
  )
}

export default CartTotal
