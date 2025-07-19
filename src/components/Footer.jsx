import React from 'react'

const Footer = () => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg mt-20 border border-gray-200">

      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-12 mb-8">

        <div>
          <h2 className="text-2xl font-bold text-[#052659] mb-3">FRD Nutrient</h2>
          <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
            Elevate your performance with FRD Nutrient — premium gym supplements crafted for strength, recovery, and endurance. Trusted by athletes, made for champions.
          </p>
        </div>

        <div>
          <p className="text-lg font-semibold text-[#052659] mb-4">Company</p>
          <ul className="flex flex-col gap-2 text-gray-700 text-sm cursor-pointer">
            <li className="hover:text-[#052659] transition">Home</li>
            <li className="hover:text-[#052659] transition">About Us</li>
            <li className="hover:text-[#052659] transition">Shop</li>
            <li className="hover:text-[#052659] transition">Privacy Policy</li>
          </ul>
        </div>

        <div>
          <p className="text-lg font-semibold text-[#052659] mb-4">Get in Touch</p>
          <ul className="flex flex-col gap-2 text-gray-700 text-sm">
            <li>+91-98765-43210</li>
            <li>support@frdnutrient.com</li>
          </ul>
        </div>

      </div>

      <hr className="border-gray-300" />

      <p className="py-4 text-xs text-center text-gray-500">
        &copy; 2024 FRD Nutrient — All Rights Reserved.
      </p>

    </div>
  )
}

export default Footer
