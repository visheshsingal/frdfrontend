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
    <nav className="w-full bg-white text-[#052659] shadow-md">
      <div className="max-w-7xl mx-auto px-5 py-5 flex items-center justify-between font-medium">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          FRD Nutrient
        </Link>

        <ul className="hidden sm:flex gap-6 text-sm">
          <NavLink to="/" className="hover:text-black transition">HOME</NavLink>
          <NavLink to="/collection" className="hover:text-black transition">SUPPLEMENTS</NavLink>
          <NavLink to="/about" className="hover:text-black transition">ABOUT</NavLink>
          <NavLink to="/contact" className="hover:text-black transition">CONTACT</NavLink>
        </ul>

        <div className="flex items-center gap-6 text-sm">
          <button onClick={() => { setShowSearch(true); navigate('/collection') }} className="hover:text-black transition">
            Search
          </button>

          <div className="relative group">
            <button onClick={() => token ? null : navigate('/login')} className="hover:text-black transition">
              Profile
            </button>
            {token && (
              <div className="hidden group-hover:block absolute right-0 pt-4 z-10">
                <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-white text-gray-700 rounded shadow">
                  <p className="cursor-pointer hover:text-black">My Profile</p>
                  <p onClick={() => navigate('/orders')} className="cursor-pointer hover:text-black">Orders</p>
                  <p onClick={logout} className="cursor-pointer hover:text-black">Logout</p>
                </div>
              </div>
            )}
          </div>

          <button onClick={() => navigate('/cart')} className="relative hover:text-black transition">
            Cart
            <span className="absolute -right-2 -bottom-2 w-4 h-4 bg-[#052659] text-white text-[10px] flex items-center justify-center rounded-full">
              {getCartCount()}
            </span>
          </button>

          <button onClick={() => setVisible(true)} className="sm:hidden hover:text-black transition">
            Menu
          </button>
        </div>
      </div>

      {/* Sidebar for small screens */}
      <div className={`fixed top-0 right-0 h-full bg-white text-[#052659] shadow-md transition-all z-50 ${visible ? 'w-3/4' : 'w-0'} overflow-hidden`}>
        <div className="flex flex-col">
          <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-4 cursor-pointer border-b border-gray-300">
            <p>Back</p>
          </div>
          <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b border-gray-300" to="/">HOME</NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b border-gray-300" to="/collection">SUPPLEMENTS</NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b border-gray-300" to="/about">ABOUT</NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b border-gray-300" to="/contact">CONTACT</NavLink>
        </div>
      </div>

    </nav>
  )
}

export default Navbar
