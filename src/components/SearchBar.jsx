import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import { useLocation } from 'react-router-dom'

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext)
  const [visible, setVisible] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setVisible(location.pathname.includes('collection'))
  }, [location])

  return showSearch && visible ? (
    <div className="border-t border-b border-gray-200 bg-white text-center py-4 shadow-md">
      <div className="inline-flex items-center justify-center border border-blue-600/40 px-4 py-2 mx-3 rounded-full w-3/4 sm:w-1/2 bg-white">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none bg-transparent text-sm text-slate-800 placeholder-gray-500"
          type="text"
          placeholder="Search for supplements…"
        />
        <img
          className="w-4 ml-2 opacity-80 hover:opacity-100 transition"
          src={assets.search_icon}
          alt="Search"
        />
      </div>
      <img
        onClick={() => setShowSearch(false)}
        className="inline w-3 ml-4 cursor-pointer opacity-70 hover:scale-110 hover:opacity-100 transition"
        src={assets.cross_icon}
        alt="Close"
      />
    </div>
  ) : null
}

export default SearchBar
