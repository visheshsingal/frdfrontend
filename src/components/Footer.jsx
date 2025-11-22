import React from 'react';
import { FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-white to-blue-50 text-slate-700 pt-16 pb-8 px-8 relative overflow-hidden">
      {/* Soft Glow Accent */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-10 -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-5 -z-10" />

      {/* Newsletter CTA */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h2 className="text-2xl font-bold text-blue-600 mb-3 uppercase tracking-widest">
          Join Our Squad
        </h2>
        <p className="text-slate-600 mb-6">
          Get exclusive deals, expert tips, and the latest launches straight to your inbox.
        </p>
        <form className="flex justify-center gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-md bg-white border border-gray-300 text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md uppercase tracking-wide transition-all duration-300"
          >
            Subscribe
          </button>
        </form>
      </div>

      {/* Links Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-12 mb-12">
        {/* Shop */}
        <div>
          <h3 className="text-blue-600 font-semibold mb-4 uppercase tracking-wide">Shop</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-blue-600 cursor-pointer transition">Protein</li>
            <li className="hover:text-blue-600 cursor-pointer transition">BCAA</li>
            <li className="hover:text-blue-600 cursor-pointer transition">Creatine</li>
            <li className="hover:text-blue-600 cursor-pointer transition">Pre-Workout</li>
            <li className="hover:text-blue-600 cursor-pointer transition">Vitamins</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-blue-600 font-semibold mb-4 uppercase tracking-wide">Support</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-blue-600 cursor-pointer transition">Contact Us</li>
            <li className="hover:text-blue-600 cursor-pointer transition">Shipping Info</li>
            <li className="hover:text-blue-600 cursor-pointer transition">Returns & Refunds</li>
            <li className="hover:text-blue-600 cursor-pointer transition">FAQs</li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-blue-600 font-semibold mb-4 uppercase tracking-wide">Company</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-blue-600 cursor-pointer transition">About Us</li>
            <li className="hover:text-blue-600 cursor-pointer transition">Careers</li>
            <li className="hover:text-blue-600 cursor-pointer transition">Privacy Policy</li>
            <li className="hover:text-blue-600 cursor-pointer transition">Terms of Service</li>
          </ul>
        </div>

        {/* Account */}
        <div>
          <h3 className="text-blue-600 font-semibold mb-4 uppercase tracking-wide">Account</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-blue-600 cursor-pointer transition">Sign In</li>
            <li className="hover:text-blue-600 cursor-pointer transition">Register</li>
            <li className="hover:text-blue-600 cursor-pointer transition">Track Order</li>
            <li className="hover:text-blue-600 cursor-pointer transition">Wishlist</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-blue-600 font-semibold mb-4 uppercase tracking-wide">Follow Us</h3>
          <div className="flex gap-4 text-xl">
            <FaInstagram className="hover:text-blue-600 cursor-pointer transition-transform transform hover:scale-110" />
            <FaFacebookF className="hover:text-blue-600 cursor-pointer transition-transform transform hover:scale-110" />
            <FaTwitter className="hover:text-blue-600 cursor-pointer transition-transform transform hover:scale-110" />
            <FaLinkedinIn className="hover:text-blue-600 cursor-pointer transition-transform transform hover:scale-110" />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 border-t border-gray-200 pt-6 text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} FRD Nutrition — All Rights Reserved.</p>
        <div className="flex gap-4">
          <span>India</span>
          <span>|</span>
          <span>English (EN)</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
