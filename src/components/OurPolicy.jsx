import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-[#052659] bg-[#f9f9f9]">
      <div className="flex flex-col items-center px-4">
        <img src={assets.exchange_icon} className="w-12 mb-5" alt="Exchange Policy" />
        <p className="font-semibold text-base">Easy Exchange Policy</p>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">Hassle-free exchange on all orders</p>
      </div>

      <div className="flex flex-col items-center px-4">
        <img src={assets.quality_icon} className="w-12 mb-5" alt="Return Policy" />
        <p className="font-semibold text-base">7 Days Return Policy</p>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">Free returns within 7 days</p>
      </div>

      <div className="flex flex-col items-center px-4">
        <img src={assets.support_img} className="w-12 mb-5" alt="Customer Support" />
        <p className="font-semibold text-base">24/7 Customer Support</p>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">We're here anytime you need us</p>
      </div>
    </div>
  )
}

export default OurPolicy
