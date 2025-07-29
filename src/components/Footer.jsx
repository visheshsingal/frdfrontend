import React from 'react'
import { FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa'

const Footer = () => {
  return (
    <div className="bg-gradient-to-br from-white to-blue-50 text-gray-700 py-12 px-8 shadow-inner mt-20 border-t">

      <div className="flex flex-col sm:flex-row sm:justify-between gap-12 mb-10 max-w-7xl mx-auto">
        {/* Brand Info */}
        <div className="sm:w-1/3">
          <h2 className="text-2xl font-bold text-[#052659] mb-4">FRD Nutrition</h2>
          <p className="text-sm leading-relaxed text-gray-600">
            Elevate your performance with FRD Nutrition — premium gym supplements crafted for strength, recovery, and endurance. Trusted by athletes, made for champions.
          </p>
          <div className="flex gap-4 mt-4 text-blue-600">
            <FaInstagram className="hover:text-blue-800 cursor-pointer transition" />
            <FaFacebookF className="hover:text-blue-800 cursor-pointer transition" />
            <FaTwitter className="hover:text-blue-800 cursor-pointer transition" />
            <FaLinkedinIn className="hover:text-blue-800 cursor-pointer transition" />
          </div>
        </div>

        {/* Company Links */}
        <div>
          <p className="text-lg font-semibold text-[#052659] mb-4">Company</p>
          <ul className="flex flex-col gap-2 text-sm text-gray-600">
            <li className="hover:text-blue-600 hover:translate-x-1 transition cursor-pointer">Home</li>
            <li className="hover:text-blue-600 hover:translate-x-1 transition cursor-pointer">About Us</li>
            <li className="hover:text-blue-600 hover:translate-x-1 transition cursor-pointer">Shop</li>
            <li className="hover:text-blue-600 hover:translate-x-1 transition cursor-pointer">Privacy Policy</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <p className="text-lg font-semibold text-[#052659] mb-4">Get in Touch</p>
          <ul className="flex flex-col gap-2 text-sm text-gray-600">
            <li>+91 092781 60000</li>
            <li>frdgym.in</li>
            <li>support@frdgym.in</li>
          </ul>
        </div>
      </div>

      <hr className="border-gray-300 mb-4" />

      <p className="text-center text-xs text-gray-500">
        &copy; 2024 FRD Nutrition — All Rights Reserved.
      </p>
    </div>
  )
}

export default Footer
