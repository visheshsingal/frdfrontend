import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext)

  return (
    <div className='w-full bg-white p-4 rounded shadow'>
      <div className='text-2xl text-[#052659] font-bold'>
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>

      <div className='flex flex-col gap-3 mt-4 text-sm text-gray-700'>

        <div className='flex justify-between'>
          <p>Subtotal</p>
          <p>{currency} {getCartAmount()}.00</p>
        </div>

        <hr />

        <div className='flex justify-between'>
          <p>Shipping Fee</p>
          <p>{currency} {delivery_fee}.00</p>
        </div>

        <hr />

        <div className='flex justify-between text-base font-semibold text-[#052659]'>
          <p>Total</p>
          <p>{currency} {getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}.00</p>
        </div>

      </div>
    </div>
  )
}

export default CartTotal
