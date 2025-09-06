import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  const logout = () => {
    navigate('/login');
    localStorage.removeItem('token');
    setToken('');
    setCartItems({});
  };

  const animations = `
    @keyframes slideDown {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    .slide-down-animation {
      animation: slideDown 0.5s ease-out forwards;
    }

    @keyframes marquee {
      0%   { transform: translateX(100%); }
      100% { transform: translateX(-100%); }
    }
    .animate-marquee {
      display: inline-block;
      padding-left: 100%;
      animation: marquee 15s linear infinite;
    }
  `;

  return (
    <>
      <style>{animations}</style>
      <nav className="w-full bg-black text-white border-b border-gray-800">
        {/* Moving Top Line */}
        <div className="bg-gray-900 text-green-400 text-xs py-2 overflow-hidden relative">
          <div className="whitespace-nowrap animate-marquee">
            Engineered for Champions — Fuel. Perform. Recover. • Engineered for Champions — Fuel. Perform. Recover. • Engineered for Champions — Fuel. Perform. Recover.
          </div>
        </div>

        <div className="flex items-center justify-between h-16 px-4 md:px-8">
          <NavLink to="/" className="flex items-center">
            <img
              src="https://i.ibb.co/XZWndMD8/Whats-App-Image-2025-08-27-at-22-27-28-1.jpg"
              alt="FRD Nutrition Logo"
              className="h-16 w-auto transition-transform duration-300 hover:scale-105"
            />
          </NavLink>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm uppercase font-medium transition-colors duration-300 hover:text-green-400 ${
                  isActive ? 'text-green-400 font-semibold' : ''
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/collection"
              className={({ isActive }) =>
                `text-sm uppercase font-medium transition-colors duration-300 hover:text-green-400 ${
                  isActive ? 'text-green-400 font-semibold' : ''
                }`
              }
            >
              Supplements
            </NavLink>
            {/* <NavLink
              to="/facilities"
              className={({ isActive }) =>
                `text-sm uppercase font-medium transition-colors duration-300 hover:text-green-400 ${
                  isActive ? 'text-green-400 font-semibold' : ''
                }`
              }
            >
              Facilities
            </NavLink> */}
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-sm uppercase font-medium transition-colors duration-300 hover:text-green-400 ${
                  isActive ? 'text-green-400 font-semibold' : ''
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-sm uppercase font-medium transition-colors duration-300 hover:text-green-400 ${
                  isActive ? 'text-green-400 font-semibold' : ''
                }`
              }
            >
              Contact
            </NavLink>
          </div>

          <div className="flex items-center space-x-6">
            <button
              onClick={() => {
                setShowSearch(true);
                navigate('/collection');
              }}
              className="text-white transition-colors duration-300 hover:text-green-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            <div className="relative group">
              <button
                onClick={() => (token ? null : navigate('/login'))}
                className="text-white transition-colors duration-300 hover:text-green-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>
              {token && (
                <div className="hidden group-hover:block absolute right-0 pt-2 z-20">
                  <div className="flex flex-col gap-2 w-48 py-3 px-4 bg-gray-900 text-white rounded shadow-lg border border-gray-800">
                    <p
                      onClick={() => navigate('/orders')}
                      className="cursor-pointer hover:text-green-400 text-sm py-1"
                    >
                      Orders
                    </p>
                    <p
                      onClick={logout}
                      className="cursor-pointer hover:text-green-400 text-sm py-1"
                    >
                      Logout
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('/cart')}
              className="relative text-white transition-colors duration-300 hover:text-green-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 text-white text-xs flex items-center justify-center rounded-full">
                {getCartCount()}
              </span>
            </button>

            <button
              onClick={() => setVisible(true)}
              className="md:hidden text-white transition-colors duration-300 hover:text-green-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {visible && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col slide-down-animation">
          <div className="flex justify-between items-center p-4 border-b border-gray-800">
            <h3 className="text-lg font-medium text-white">Menu</h3>
            <button
              onClick={() => setVisible(false)}
              className="text-white transition-colors duration-300 hover:text-green-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-grow flex flex-col justify-center items-center space-y-6 text-lg font-medium text-white">
            <NavLink
              onClick={() => setVisible(false)}
              to="/"
              className={({ isActive }) => (isActive ? 'text-green-400' : '')}
            >
              Home
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              to="/collection"
              className={({ isActive }) => (isActive ? 'text-green-400' : '')}
            >
              Supplements
            </NavLink>
            {/* <NavLink
              onClick={() => setVisible(false)}
              to="/facilities"
              className={({ isActive }) => (isActive ? 'text-green-400' : '')}
            >
              Facilities
            </NavLink> */}
            <NavLink
              onClick={() => setVisible(false)}
              to="/about"
              className={({ isActive }) => (isActive ? 'text-green-400' : '')}
            >
              About
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              to="/contact"
              className={({ isActive }) => (isActive ? 'text-green-400' : '')}
            >
              Contact
            </NavLink>

            {token ? (
              <>
                <button
                  onClick={() => {
                    navigate('/orders');
                    setVisible(false);
                  }}
                  className="text-white hover:text-green-400"
                >
                  Orders
                </button>
                <button onClick={logout} className="text-white hover:text-green-400">
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  navigate('/login');
                  setVisible(false);
                }}
                className="bg-green-500 text-black py-2 px-4 rounded hover:bg-opacity-90"
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
