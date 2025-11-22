import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'

const CartTotal = () => {
  const { currency, delivery_fee, products, cartItems, getCartAmount } = useContext(ShopContext)

  // Use the centralized cart amount calculation (which prefers variant prices)
  const subtotal = Number(getCartAmount() || 0)

  // Calculate the original (pre-discount) total to show "You Saved"
  let originalTotal = 0
  for (const productId in cartItems) {
    const product = products.find(p => p._id === productId)
    if (!product) continue

    for (const size in cartItems[productId]) {
      const qty = cartItems[productId][size]
      if (!qty || qty <= 0) continue

      // Determine original unit price (prefer variant.price if present)
      let origUnit = Number(product.price || 0)
      if (size !== '' && product.variants && product.variants.length > 0) {
        const isNumeric = /^\d+$/.test(size)
        const matchedVariant = isNumeric ? product.variants[Number(size)] : product.variants.find(v => v.uid === size)
        if (matchedVariant && matchedVariant.price !== undefined && matchedVariant.price !== null && matchedVariant.price !== '') {
          origUnit = Number(matchedVariant.price)
        }
      }

      originalTotal += origUnit * qty
    }
  }

  const totalDiscount = Math.max(0, originalTotal - subtotal)

  const formatted = (amount) => `${currency}${Number(amount).toLocaleString('en-IN')}.00`
  const total = subtotal + (subtotal === 0 ? 0 : delivery_fee)

  return (
    <div className="w-full bg-white text-slate-800 p-6 rounded-2xl shadow-lg border border-blue-500/20 transition duration-300 hover:shadow-blue-500/20">
      
      <div className="text-2xl font-bold text-blue-600 mb-4">
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>

      <div className="flex flex-col gap-3 text-sm">

        <div className="flex justify-between">
          <p className="text-slate-700">Subtotal</p>
          <p className="font-medium">{formatted(subtotal)}</p>
        </div>

        {totalDiscount > 0 && (
          <div className="flex justify-between text-blue-600">
            <p>You Saved</p>
            <p>-{formatted(totalDiscount)}</p>
          </div>
        )}

        <div className="border-t border-gray-200 my-2"></div>

        <div className="flex justify-between">
          <p className="text-slate-700">Shipping Fee</p>
          <p className="font-medium">{subtotal === 0 ? formatted(0) : formatted(delivery_fee)}</p>
        </div>

        <div className="border-t border-gray-200 my-2"></div>

        <div className="flex justify-between text-base font-semibold text-blue-600">
          <p>Total</p>
          <p>{formatted(total)}</p>
        </div>
      </div>
    </div>
  )
}

export default CartTotal
