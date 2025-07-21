import React, { useContext, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const Navbar = () => {
  const [visible, setVisible] = useState(false)
  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext)

  const logout = () => {
    navigate('/login')
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})
  }

  return (
    <>
      <nav className="w-full bg-white text-[#052659] border-b border-gray-100">
        <div className="bg-[#052659] text-white text-xs py-2 text-center">
        Engineered for Champions — Fuel. Perform. Recover.
        </div>

        <div className="flex items-center justify-between h-16 px-4 md:px-8">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold tracking-tight">FRD</span>
            <span className="text-2xl font-light ml-1">Nutrition</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className="text-sm uppercase font-medium hover:text-[#052659]" activeClassName="text-[#052659] font-semibold">Home</NavLink>
            <NavLink to="/collection" className="text-sm uppercase font-medium hover:text-[#052659]" activeClassName="text-[#052659] font-semibold">Supplements</NavLink>
            <NavLink to="/about" className="text-sm uppercase font-medium hover:text-[#052659]" activeClassName="text-[#052659] font-semibold">About</NavLink>
            <NavLink to="/contact" className="text-sm uppercase font-medium hover:text-[#052659]" activeClassName="text-[#052659] font-semibold">Contact</NavLink>
          </div>

          <div className="flex items-center space-x-6">
            <button onClick={() => { setShowSearch(true); navigate('/collection') }} className="text-gray-600 hover:text-[#052659]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <div className="relative group">
              <button onClick={() => token ? null : navigate('/login')} className="text-gray-600 hover:text-[#052659]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              {token && (
                <div className="hidden group-hover:block absolute right-0 pt-2 z-20">
                  <div className="flex flex-col gap-2 w-48 py-3 px-4 bg-white text-gray-700 rounded shadow-lg border border-gray-100">
                    <p className="cursor-pointer hover:text-[#052659] text-sm py-1">My Profile</p>
                    <p onClick={() => navigate('/orders')} className="cursor-pointer hover:text-[#052659] text-sm py-1">Orders</p>
                    <p onClick={logout} className="cursor-pointer hover:text-[#052659] text-sm py-1">Logout</p>
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => navigate('/cart')} className="relative text-gray-600 hover:text-[#052659]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#052659] text-white text-xs flex items-center justify-center rounded-full">{getCartCount()}</span>
            </button>

            <button onClick={() => setVisible(true)} className="md:hidden text-gray-600 hover:text-[#052659]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Full Screen Mobile Menu */}
      {visible && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium">Menu</h3>
            <button onClick={() => setVisible(false)} className="text-gray-500 hover:text-[#052659]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-grow flex flex-col justify-center items-center space-y-6 text-lg font-medium">
            <NavLink onClick={() => setVisible(false)} to="/">Home</NavLink>
            <NavLink onClick={() => setVisible(false)} to="/collection">Supplements</NavLink>
            <NavLink onClick={() => setVisible(false)} to="/about">About</NavLink>
            <NavLink onClick={() => setVisible(false)} to="/contact">Contact</NavLink>

            {token ? (
              <>
                <button onClick={() => { navigate('/profile'); setVisible(false) }}>My Profile</button>
                <button onClick={() => { navigate('/orders'); setVisible(false) }}>Orders</button>
                <button onClick={() => { logout(); setVisible(false) }}>Logout</button>
              </>
            ) : (
              <button onClick={() => { navigate('/login'); setVisible(false) }} className="bg-[#052659] text-white py-2 px-4 rounded hover:bg-opacity-90">
                Login / Register
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
