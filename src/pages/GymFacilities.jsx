import React, { useContext, useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const GymFacilities = () => {
  const { token, backendUrl, user, userRole } = useContext(ShopContext);
  const navigate = useNavigate();

  const facilities = [
    "Workout Sessions (Strength Training, Cardio, Group Classes)",
    "Steam Bath / Sauna",
    "Personal Training (1:1 Coaching)",
    "Weight Loss Program",
    "Weight Gain Program",
    "Height Improvement Program",
    "Nutrition & Diet Consultation"
  ];

  const timeSlots = [
    "6:00 AM - 7:00 AM", "7:00 AM - 8:00 AM", "8:00 AM - 9:00 AM", "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "12:00 PM - 1:00 PM", "1:00 PM - 2:00 PM",
    "2:00 PM - 3:00 PM", "3:00 PM - 4:00 PM", "4:00 PM - 5:00 PM", "5:00 PM - 6:00 PM",
    "6:00 PM - 7:00 PM", "7:00 PM - 8:00 PM", "8:00 PM - 9:00 PM"
  ];

  const gyms = useMemo(() => Array.from({ length: 10 }, (_, i) => `Forever Fitness Branch #${i + 1}`), []);

  const [step, setStep] = useState(1);
  const [selectedGym, setSelectedGym] = useState('');
  const [selectedFacility, setSelectedFacility] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedSlots, setBookedSlots] = useState({});
  const [showMyFacilities, setShowMyFacilities] = useState(false);
  const [facilitiesData, setFacilitiesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Pre-fill user details if available
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  // Fetch booked slots when gym, date, and facility are selected
  useEffect(() => {
    if (selectedGym && selectedDate && selectedFacility) {
      fetchBookedSlots();
    }
  }, [selectedGym, selectedDate, selectedFacility]);

  const fetchBookedSlots = async () => {
    try {
      if (!token) return;
      
      const response = await axios.get(
        `${backendUrl}/api/bookings/booked-slots?gym=${encodeURIComponent(selectedGym)}&date=${selectedDate}&facility=${encodeURIComponent(selectedFacility)}`,
        { headers: { token } }
      );
      
      if (response.data.success) {
        setBookedSlots(response.data.bookedSlots || {});
      } else {
        console.error('Failed to fetch booked slots:', response.data.message);
        setBookedSlots({});
      }
    } catch (error) {
      console.error('Error fetching booked slots:', error);
      setBookedSlots({});
    }
  };

  const loadFacilitiesData = async () => {
    try {
      setIsLoading(true);
      if (!token) {
        toast.error('Please login to view your bookings');
        navigate('/login');
        return;
      }

      const response = await axios.get(
        `${backendUrl}/api/bookings/user`,
        { headers: { token } }
      );
      
      if (response.data.success) {
        setFacilitiesData(response.data.bookings || []);
        toast.success('Bookings loaded successfully!');
      } else {
        toast.error(response.data.message || 'Failed to load bookings');
        setFacilitiesData([]);
      }
    } catch (error) {
      console.error('Error loading facilities:', error);
      toast.error('Failed to load your bookings');
      setFacilitiesData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleView = () => {
    if (showMyFacilities) {
      setShowMyFacilities(false);
    } else {
      loadFacilitiesData();
      setShowMyFacilities(true);
    }
  };

  const handleSubmit = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (!selectedGym || !selectedFacility || !selectedDate || !selectedTimeSlot || !name || !email || !phone) {
      toast.error('Please fill all details');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await axios.post(
        `${backendUrl}/api/bookings`,
        { 
          gym: selectedGym, 
          facility: selectedFacility, 
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          name, 
          email, 
          phone 
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success('Booking confirmed successfully!');
        loadFacilitiesData();
        setShowMyFacilities(true);
        resetForm();
      } else {
        toast.error(response.data.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const isTimeSlotAvailable = (timeSlot) => {
    if (!bookedSlots[selectedFacility]) return true;
    return !bookedSlots[selectedFacility].includes(timeSlot);
  };

  const resetForm = () => {
    setStep(1);
    setSelectedGym('');
    setSelectedFacility('');
    setSelectedDate('');
    setSelectedTimeSlot('');
    setBookedSlots({});
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  };

  return (
    <div className="px-4 md:px-8 py-12 bg-black min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="text-green-400">GYM</span> FACILITIES
          </h1>
          <p className="w-full md:w-2/3 lg:w-1/2 mx-auto text-gray-400 mt-3">
            {showMyFacilities 
              ? "View and manage all your booked gym facilities and sessions." 
              : "Select a gym branch, choose a facility, pick a date and time slot, and book your session."}
          </p>
          
          <div className="mt-6">
            <button 
              onClick={toggleView}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all ${showMyFacilities 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-800 text-green-400 border border-green-600 hover:bg-gray-700'}`}
            >
              {showMyFacilities ? 'Book New Facility' : 'View My Bookings'}
            </button>
          </div>
        </div>

        {showMyFacilities ? (
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="text-2xl font-bold text-white mb-6 pb-2 border-b border-gray-700">My Booked Facilities</h2>
            
            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : facilitiesData.length === 0 ? (
              <div className='text-center py-10'>
                <div className="mx-auto w-24 h-24 bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <svg className='w-10 h-10 text-green-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
                  </svg>
                </div>
                <p className="text-gray-300 text-lg font-medium">No facilities booked yet</p>
                <p className='text-gray-500 mt-2'>Book your first facility using the booking system</p>
                <button 
                  onClick={toggleView}
                  className="mt-5 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Book Now
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {facilitiesData.map((booking, index) => (
                  <motion.div 
                    key={booking._id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className='p-5 bg-gray-800 rounded-lg border border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-5'
                  >
                    <div className='flex items-start gap-5'>
                      <div className='w-14 h-14 bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0'>
                        <svg className='w-6 h-6 text-green-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
                        </svg>
                      </div>
                      <div>
                        <p className='font-semibold text-white'>{booking.facility}</p>
                        <p className='text-gray-400 text-sm mt-1'>{booking.gym}</p>
                        <div className="flex flex-wrap gap-3 mt-2">
                          <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded">
                            {new Date(booking.date).toLocaleDateString()}
                          </span>
                          <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded">
                            {booking.timeSlot}
                          </span>
                          <span className="text-xs bg-gray-700 text-gray-400 px-2 py-1 rounded">
                            Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                      booking.status === 'cancelled' 
                        ? 'bg-red-900/30 text-red-400' 
                        : 'bg-green-900/30 text-green-400'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        booking.status === 'cancelled' ? 'bg-red-400' : 'bg-green-400'
                      }`}></span>
                      {booking.status || 'Confirmed'}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= i ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-500'} transition-colors`}>
                      {i}
                    </div>
                    <span className="text-xs mt-1 text-gray-400">Step {i}</span>
                  </div>
                ))}
              </div>
              <div className="w-full bg-gray-800 h-2 rounded-full">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${(step - 1) * 33.33}%` }}
                ></div>
              </div>
            </div>

            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="max-w-2xl mx-auto"
              >
                <h3 className="text-xl font-semibold text-white mb-5">Select Gym Branch</h3>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Choose a branch</label>
                  <select
                    value={selectedGym}
                    onChange={(e) => setSelectedGym(e.target.value)}
                    className="w-full p-3.5 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="" className="bg-gray-800">Select a branch...</option>
                    {gyms.map((g, idx) => (
                      <option key={idx} value={g} className="bg-gray-800">{g}</option>
                    ))}
                  </select>
                </div>
                <div className="mt-8 flex justify-end">
                  <button
                    disabled={!selectedGym}
                    onClick={() => setStep(2)}
                    className={`px-6 py-2.5 rounded-lg font-medium ${selectedGym ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-700 text-gray-500 cursor-not-allowed'} transition-colors`}
                  >
                    Next
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h3 className="text-xl font-semibold text-white mb-2">Choose a Facility at {selectedGym}</h3>
                <p className="text-gray-400 mb-6">Select the service you want to book</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {facilities.map((facility, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-5 bg-gray-800 border rounded-lg hover:shadow-lg transition-all cursor-pointer ${selectedFacility === facility ? 'border-green-500 ring-2 ring-green-500/20' : 'border-gray-700'}`}
                      onClick={() => setSelectedFacility(facility)}
                    >
                      <h4 className="text-white font-medium mb-3">{facility}</h4>
                      <button
                        onClick={() => { setSelectedFacility(facility); setStep(3); }}
                        className="w-full mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Select
                      </button>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-8 flex justify-between">
                  <button 
                    onClick={() => setStep(1)} 
                    className="px-5 py-2.5 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                  >
                    Back
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="max-w-2xl mx-auto"
              >
                <h3 className="text-xl font-semibold text-white mb-2">Select Date and Time</h3>
                <p className="text-sm text-gray-400 mb-6">
                  Gym: <span className="font-medium text-green-400">{selectedGym}</span> • Facility: <span className="font-medium text-green-400">{selectedFacility}</span>
                </p>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Select Date</label>
                  <input 
                    type="date" 
                    min={getTomorrowDate()}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-3.5 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {selectedDate && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Available Time Slots</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {timeSlots.map((slot, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedTimeSlot(slot)}
                          disabled={!isTimeSlotAvailable(slot)}
                          className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                            selectedTimeSlot === slot 
                              ? 'bg-green-600 text-white border-green-600' 
                              : isTimeSlotAvailable(slot)
                                ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-green-900/30 hover:border-green-400'
                                : 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed'
                          }`}
                        >
                          {slot}
                          {!isTimeSlotAvailable(slot) && <span className="block text-xs mt-1 text-gray-500">Booked</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 flex justify-between">
                  <button 
                    onClick={() => setStep(2)} 
                    className="px-5 py-2.5 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setStep(4)} 
                    disabled={!selectedDate || !selectedTimeSlot}
                    className={`px-6 py-2.5 rounded-lg font-medium ${selectedDate && selectedTimeSlot ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-700 text-gray-500 cursor-not-allowed'} transition-colors`}
                  >
                    Next
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="max-w-2xl mx-auto"
              >
                <h3 className="text-xl font-semibold text-white mb-2">Your Details</h3>
                <p className="text-sm text-gray-400 mb-6">
                  Gym: <span className="font-medium text-green-400">{selectedGym}</span> • Facility: <span className="font-medium text-green-400">{selectedFacility}</span> <br />
                  Date: <span className="font-medium text-green-400">{new Date(selectedDate).toLocaleDateString()}</span> • Time: <span className="font-medium text-green-400">{selectedTimeSlot}</span>
                </p>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                    <input 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Your full name" 
                      className="w-full p-3.5 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                    <input 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="Your email address" 
                      className="w-full p-3.5 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                    <input 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      placeholder="Your phone number" 
                      className="w-full p-3.5 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button 
                    onClick={() => setStep(3)} 
                    className="px-5 py-2.5 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className={`px-6 py-2.5 rounded-lg font-medium ${isSubmitting ? 'bg-green-700 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white transition-colors`}
                  >
                    {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GymFacilities;