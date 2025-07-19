import React from 'react'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col sm:flex-row bg-white border border-gray-200 rounded overflow-hidden">
      {/* Left Side */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 px-6 text-[#052659]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="w-8 h-[2px] bg-[#052659]"></p>
            <p className="font-semibold text-sm">FOR ATHLETES & GYM LOVERS</p>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold leading-snug mb-4">
            Power Your <span className="text-black">Performance</span>
          </h1>

          <button
            onClick={() => navigate('/collection')}
            className="mt-4 bg-[#052659] text-white px-6 py-2 text-sm rounded hover:bg-[#031e47] transition"
          >
            BUY NOW
          </button>
        </div>
      </div>

      {/* Right Side */}
      <img
        className="w-full sm:w-1/2 object-cover"
        src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800"
        alt="Gym Training Hero"
      />
    </div>
  )
}

export default Hero
