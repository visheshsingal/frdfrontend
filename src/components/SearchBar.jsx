import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import { useLocation } from 'react-router-dom'

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext)
  const [visible, setVisible] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (location.pathname.includes('collection')) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }, [location])

  return showSearch && visible ? (
    <div className="border-t border-b bg-white text-center py-4 shadow-sm">
      <div className="inline-flex items-center justify-center border border-gray-300 px-4 py-2 mx-3 rounded-full w-3/4 sm:w-1/2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none bg-inherit text-sm text-[#052659]"
          type="text"
          placeholder="Search for supplements…"
        />
        <img className="w-4 ml-2" src={assets.search_icon} alt="Search" />
      </div>
      <img
        onClick={() => setShowSearch(false)}
        className="inline w-3 ml-4 cursor-pointer"
        src={assets.cross_icon}
        alt="Close"
      />
    </div>
  ) : null
}

export default SearchBar
