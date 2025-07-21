import React from 'react'
import { FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa'

const Footer = () => {
  return (
    <div className="bg-gradient-to-r from-[#031e47] to-[#052659] text-white py-12 px-8 shadow-lg mt-20 border-t-2 border-[#031e47]">

      <div className="flex flex-col sm:flex-row sm:justify-between gap-12 mb-10">
        {/* Brand Info */}
        <div className="sm:w-1/3">
          <h2 className="text-2xl font-bold mb-4">FRD Nutrition</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Elevate your performance with FRD Nutrition — premium gym supplements crafted for strength, recovery, and endurance. Trusted by athletes, made for champions.
          </p>
          <div className="flex gap-4 mt-4">
            <FaInstagram className="hover:text-gray-400 cursor-pointer transition" />
            <FaFacebookF className="hover:text-gray-400 cursor-pointer transition" />
            <FaTwitter className="hover:text-gray-400 cursor-pointer transition" />
            <FaLinkedinIn className="hover:text-gray-400 cursor-pointer transition" />
          </div>
        </div>

        {/* Company Links */}
        <div>
          <p className="text-lg font-semibold mb-4">Company</p>
          <ul className="flex flex-col gap-2 text-gray-300 text-sm">
            <li className="hover:underline hover:translate-x-1 transition cursor-pointer">Home</li>
            <li className="hover:underline hover:translate-x-1 transition cursor-pointer">About Us</li>
            <li className="hover:underline hover:translate-x-1 transition cursor-pointer">Shop</li>
            <li className="hover:underline hover:translate-x-1 transition cursor-pointer">Privacy Policy</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <p className="text-lg font-semibold mb-4">Get in Touch</p>
          <ul className="flex flex-col gap-2 text-gray-300 text-sm">
            <li>+91 092781 60000</li>
            <li>frdgym.in</li>
            <li>support@frdgym.in</li>
          </ul>
        </div>
      </div>

      <hr className="border-gray-500 opacity-50 mb-4" />

      <p className="text-center text-xs text-gray-400">
        &copy; 2024 FRD Nutrition — All Rights Reserved.
      </p>

    </div>
  )
}

export default Footer
