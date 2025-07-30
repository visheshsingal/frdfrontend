import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'

const CartTotal = () => {
  const { currency, delivery_fee, products, cartItems } = useContext(ShopContext)

  // Calculate subtotal, discount, total
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

  const formatted = (amount) => `${currency} ${amount.toLocaleString('en-IN')}.00`
  const total = subtotal + (subtotal === 0 ? 0 : delivery_fee)

  return (
    <div className='w-full bg-white p-4 rounded shadow'>
      <div className='text-2xl text-[#052659] font-bold'>
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>

      <div className='flex flex-col gap-3 mt-4 text-sm text-gray-700'>

        <div className='flex justify-between'>
          <p>Subtotal</p>
          <p>{formatted(subtotal)}</p>
        </div>

        {totalDiscount > 0 && (
          <div className='flex justify-between text-green-600'>
            <p>You Saved</p>
            <p>-{formatted(totalDiscount)}</p>
          </div>
        )}

        <hr />

        <div className='flex justify-between'>
          <p>Shipping Fee</p>
          <p>{subtotal === 0 ? formatted(0) : formatted(delivery_fee)}</p>
        </div>

        <hr />

        <div className='flex justify-between text-base font-semibold text-[#052659]'>
          <p>Total</p>
          <p>{formatted(total)}</p>
        </div>

      </div>
    </div>
  )
}

export default CartTotal
