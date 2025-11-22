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
              size: size, // preserve variant identifier (could be '' or uid or numeric index)
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
    <div className="border-t pt-14 text-slate-800 bg-white min-h-[80vh]">
      <div className="text-2xl mb-6 px-4">
        <Title text1="YOUR" text2="CART" />
      </div>

      <div className="px-4">
        {cartData.map((item, index) => {
          const productData = products.find((product) => product._id === item._id)
          if (!productData) return null

          // Prefer variant-level price/image/discount when size refers to a variant
          let displayPrice = Number(productData.price || 0)
          let displayDiscount = Number(productData.discount || 0)
          let imageSrc = Array.isArray(productData.image) ? productData.image[0] : productData.image

          if (item.size !== '' && productData.variants && productData.variants.length > 0) {
            const isNumeric = /^\d+$/.test(item.size)
            const matchedVariant = isNumeric ? productData.variants[Number(item.size)] : productData.variants.find(v => v.uid === item.size)
            if (matchedVariant) {
              if (matchedVariant.price !== undefined && matchedVariant.price !== null && matchedVariant.price !== '') displayPrice = Number(matchedVariant.price)
              if (matchedVariant.discount !== undefined && matchedVariant.discount !== null && matchedVariant.discount !== '') displayDiscount = Number(matchedVariant.discount)
              if (matchedVariant.images && matchedVariant.images.length > 0) imageSrc = matchedVariant.images[0]
            }
          }

          const originalPrice = displayPrice
          const discount = displayDiscount || 0
          const discountedPrice = Math.round(originalPrice - (originalPrice * discount) / 100)
          // Try to show variant name / group label if available
          let variantLabel = null
          // composite group key
          if (typeof item.size === 'string' && item.size.startsWith('g:')) {
            const pairs = item.size.slice(2).split('|').map(p => {
              const [gi, vi] = p.split('-')
              return { groupIndex: Number(gi), variantIndex: Number(vi) }
            })
            const opts = pairs.map(s => {
              const g = productData.variantGroups?.[s.groupIndex]
              const opt = g?.variants?.[s.variantIndex]
              return { name: opt?.name || (typeof opt === 'string' ? opt : ''), group: g?.label || '' }
            }).filter(Boolean)
            if (opts.length > 0) variantLabel = opts
          } else if (item.size !== '' && productData.variants && productData.variants.length > 0) {
            const isNumeric = /^\d+$/.test(item.size)
            const mv = isNumeric ? productData.variants[Number(item.size)] : productData.variants.find(v => v.uid === item.size)
            variantLabel = mv ? [{ name: mv.name || '', group: mv.meta?.groupLabel || '' }] : null
          }

          return (
            <div
              key={index}
              className="py-4 border-t border-b border-gray-200 text-slate-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              {/* Product Info */}
              <div className="flex items-start gap-6">
                <img className="w-16 sm:w-20 rounded-lg shadow-md border border-gray-200" src={imageSrc || 'https://via.placeholder.com/120x120?text=No+Image'} alt={productData.name} />
                <div>
                  <p className="text-sm sm:text-lg font-semibold text-blue-600">
                    {productData.name}{variantLabel && variantLabel.length && variantLabel[0].name ? ` - ${variantLabel[0].name}` : ''}
                  </p>
                  {variantLabel && variantLabel.length > 0 && (
                    <div className="text-xs text-slate-600 mt-1 space-y-0">
                      {variantLabel.map((v, i) => (
                        <p key={i}>{v.group ? `${v.group}: ` : ''}{v.name}</p>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-5 mt-2 text-slate-600">
                    {discount > 0 ? (
                      <div className="space-x-2 text-sm sm:text-base">
                        <span className="line-through text-gray-400">{formatted(originalPrice)}</span>
                        <span className="text-blue-600 font-bold">{formatted(discountedPrice)}</span>
                        <span className="bg-blue-100 text-blue-700 text-xs px-1 py-0.5 rounded">
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
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : Number(e.target.value)
                  // allow setting 0 to remove
                  updateQuantity(item._id, item.size, isNaN(val) ? 0 : val)
                }}
                className="border border-gray-300 bg-white text-slate-800 max-w-10 sm:max-w-20 px-1 sm:px-2 py-1 rounded text-center outline-none"
                type="number"
                min={0}
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
              className="bg-blue-600 text-white font-semibold text-sm my-8 px-8 py-3 rounded-xl hover:bg-blue-700 transition"
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
