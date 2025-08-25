import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';

const UserFacilities = () => {

  const { backendUrl, token } = useContext(ShopContext);

  const [facilitiesData, setFacilitiesData] = useState([]);

  const loadFacilitiesData = async () => {
    try {
      // Check for the token here before making the API call
      if (!token) {
        console.log("Token not available, skipping API call.");
        return; // Return without making the API call
      }

      const response = await axios.get(backendUrl + '/api/bookings/user', { headers: { token } });
      if (response.data.success) {
        setFacilitiesData(response.data.bookings.reverse());
      } else {
        // Handle API error case
        console.error('API response error:', response.data.message);
      }
    } catch (error) {
      console.error('Error loading facilities:', error);
    }
  };

  useEffect(() => {
    loadFacilitiesData();
  }, [token]); // This dependency correctly triggers the effect when the token is updated

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'FACILITIES'} />
      </div>
      <div className='text-center text-sm text-gray-600 mb-4'>
        View all your booked gym facilities and sessions.
      </div>

      <div>
        {
          facilitiesData.length === 0 ? (
            <div className='text-center py-8 text-gray-500'>
              <p>No facilities booked yet.</p>
              <p className='text-sm mt-2'>Book your first facility from the <span className='text-blue-600'>Facilities</span> page!</p>
            </div>
          ) : (
            facilitiesData.map((booking, index) => (
              <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                <div className='flex items-start gap-6 text-sm'>
                  <div className='w-16 sm:w-20 h-16 sm:h-20 bg-blue-100 rounded-lg flex items-center justify-center'>
                    <svg className='w-8 h-8 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
                    </svg>
                  </div>
                  <div>
                    <p className='sm:text-base font-medium'>{booking.facility}</p>
                    <p className='text-gray-600 mt-1'>{booking.gym}</p>
                    <p className='mt-1'>Booked on: <span className='text-gray-400'>{new Date(booking.createdAt).toDateString()}</span></p>
                    <p className='mt-1'>Contact: <span className='text-gray-400'>{booking.phone}</span></p>
                  </div>
                </div>
                <div className='md:w-1/2 flex justify-between'>
                  <div className='flex items-center gap-2'>
                    <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                    <p className='text-sm md:text-base'>Booked</p>
                  </div>
                </div>
              </div>
            ))
          )
        }
      </div>
    </div>
  );
};

export default UserFacilities;