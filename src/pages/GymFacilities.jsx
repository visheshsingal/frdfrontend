// src/pages/GymFacilities.jsx
import React, { useContext, useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';

const GymFacilities = () => {
	const { token, backendUrl, user } = useContext(ShopContext);
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

	const gyms = useMemo(() => Array.from({ length: 100 }, (_, i) => `Forever Fitness Branch #${i + 1}`), []);

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

	// Pre-fill user details if available
	useEffect(() => {
		if (user) {
			setName(user.name || '');
			setEmail(user.email || '');
			setPhone(user.phone || '');
		}
	}, [user]);

	// Fetch booked slots when gym and date are selected
	useEffect(() => {
		if (selectedGym && selectedDate) {
			fetchBookedSlots();
		}
	}, [selectedGym, selectedDate]);

	const fetchBookedSlots = async () => {
		try {
			const res = await fetch(`${backendUrl}/api/bookings/booked-slots?gym=${encodeURIComponent(selectedGym)}&date=${selectedDate}`, {
				headers: {
					token: token,
				},
			});

			if (res.ok) {
				const data = await res.json();
				if (data.success) {
					setBookedSlots(data.bookedSlots || {});
				}
			}
		} catch (error) {
			console.error('Error fetching booked slots:', error);
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
			const res = await fetch(`${backendUrl}/api/bookings`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					token: token,
				},
				body: JSON.stringify({ 
					gym: selectedGym, 
					facility: selectedFacility, 
					date: selectedDate,
					timeSlot: selectedTimeSlot,
					name, 
					email, 
					phone 
				}),
			});

			const data = await res.json();

			if (res.ok && data.success) {
				// Fixed: Set step to 5 (success) instead of 4 (details)
				setStep(5);
				toast.success('Booking confirmed successfully!');
			} else {
				toast.error(data.message || 'Booking failed');
			}
		} catch (error) {
			toast.error('Network error. Please check your connection.');
		} finally {
			setIsSubmitting(false);
		}
	};

	// Get tomorrow's date for minimum date selection
	const getTomorrowDate = () => {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		return tomorrow.toISOString().split('T')[0];
	};

	// Check if a time slot is available
	const isTimeSlotAvailable = (timeSlot) => {
		if (!bookedSlots[selectedFacility]) return true;
		return !bookedSlots[selectedFacility].includes(timeSlot);
	};

	// Reset form function
	const resetForm = () => {
		setStep(1);
		setSelectedGym('');
		setSelectedFacility('');
		setSelectedDate('');
		setSelectedTimeSlot('');
		setBookedSlots({});
		// Keep user details pre-filled
		if (user) {
			setName(user.name || '');
			setEmail(user.email || '');
			setPhone(user.phone || '');
		}
	};

	return (
		<div className="px-6 md:px-12 py-16 bg-white min-h-screen">
			<div className="text-center mb-12">
				<Title text1="GYM" text2="FACILITIES" />
				<p className="w-full md:w-2/3 lg:w-1/2 mx-auto text-sm text-[#052659]/80 mt-3">
					Select a gym branch, choose a facility, pick a date and time slot, and book your session.
				</p>
			</div>

			{/* Step 1: Select Gym */}
			{step === 1 && (
				<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto">
					<h3 className="text-[#052659] font-semibold text-lg mb-3">Select Gym Branch</h3>
					<select
						value={selectedGym}
						onChange={(e) => setSelectedGym(e.target.value)}
						className="w-full p-3 border border-blue-100 rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
					>
						<option value="">Choose a branch...</option>
						{gyms.map((g, idx) => (
							<option key={idx} value={g}>{g}</option>
						))}
					</select>
					<div className="mt-4 flex justify-end">
						<button
							disabled={!selectedGym}
							onClick={() => setStep(2)}
							className={`px-4 py-2 rounded text-white ${selectedGym ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'}`}
						>
							Next
						</button>
					</div>
				</motion.div>
			)}

			{/* Step 2: Select Facility */}
			{step === 2 && (
				<div>
					<h3 className="text-[#052659] font-semibold text-lg mb-4">Choose a Facility at {selectedGym}</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{facilities.map((facility, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.03 }}
								className="p-6 bg-blue-50 border border-blue-100 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col"
							>
								<h4 className="text-[#052659] font-semibold text-base mb-4">{facility}</h4>
								<button
									onClick={() => { setSelectedFacility(facility); setStep(3); }}
									className="mt-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
								>
									Select
								</button>
							</motion.div>
						))}
					</div>
					<div className="mt-6 flex justify-between">
						<button onClick={() => setStep(1)} className="px-4 py-2 border rounded">Back</button>
					</div>
				</div>
			)}

			{/* Step 3: Select Date and Time Slot */}
			{step === 3 && (
				<div className="max-w-2xl mx-auto">
					<h3 className="text-[#052659] font-semibold text-lg mb-2">Select Date and Time</h3>
					<p className="text-sm text-gray-600 mb-4">Gym: {selectedGym} • Facility: {selectedFacility}</p>
					
					<div className="mb-6">
						<label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
						<input 
							type="date" 
							min={getTomorrowDate()}
							value={selectedDate}
							onChange={(e) => setSelectedDate(e.target.value)}
							className="w-full p-3 border border-blue-100 rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
						/>
					</div>

					{selectedDate && (
						<div className="mb-6">
							<label className="block text-sm font-medium text-gray-700 mb-1">Available Time Slots</label>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
								{timeSlots.map((slot, index) => (
									<button
										key={index}
										onClick={() => setSelectedTimeSlot(slot)}
										disabled={!isTimeSlotAvailable(slot)}
										className={`p-3 border rounded text-sm ${
											selectedTimeSlot === slot 
												? 'bg-blue-600 text-white border-blue-600' 
												: isTimeSlotAvailable(slot)
													? 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'
													: 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
										}`}
									>
										{slot}
										{!isTimeSlotAvailable(slot) && <span className="block text-xs mt-1">Booked</span>}
									</button>
								))}
							</div>
						</div>
					)}

					<div className="mt-6 flex justify-between">
						<button onClick={() => setStep(2)} className="px-4 py-2 border rounded">Back</button>
						<button 
							onClick={() => setStep(4)} 
							disabled={!selectedDate || !selectedTimeSlot}
							className={`px-4 py-2 rounded text-white ${selectedDate && selectedTimeSlot ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'}`}
						>
							Next
						</button>
					</div>
				</div>
			)}

			{/* Step 4: Enter Details */}
			{step === 4 && (
				<div className="max-w-2xl mx-auto">
					<h3 className="text-[#052659] font-semibold text-lg mb-2">Your Details</h3>
					<p className="text-sm text-gray-600 mb-4">
						Gym: {selectedGym} • Facility: {selectedFacility} <br />
						Date: {selectedDate} • Time: {selectedTimeSlot}
					</p>
					<div className="grid grid-cols-1 gap-4">
						<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="p-3 border rounded bg-blue-50 border-blue-100" />
						<input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="p-3 border rounded bg-blue-50 border-blue-100" />
						<input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="p-3 border rounded bg-blue-50 border-blue-100" />
					</div>
					<div className="mt-6 flex justify-between">
						<button onClick={() => setStep(3)} className="px-4 py-2 border rounded">Back</button>
						<button onClick={handleSubmit} disabled={isSubmitting} className={`px-4 py-2 rounded text-white ${isSubmitting ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}>{isSubmitting ? 'Booking...' : 'Book'}</button>
					</div>
				</div>
			)}

			{/* Step 5: Success */}
			{step === 5 && (
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto text-center p-8 border rounded bg-blue-50 border-blue-100">
					<svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
					</svg>
					<h3 className="text-[#052659] font-bold text-xl">Successfully Booked!</h3>
					<p className="mt-2 text-sm text-gray-700">
						Your booking for <span className="font-semibold">{selectedFacility}</span> at <span className="font-semibold">{selectedGym}</span> is confirmed.<br />
						Date: <span className="font-semibold">{new Date(selectedDate).toLocaleDateString()}</span> • Time: <span className="font-semibold">{selectedTimeSlot}</span>
					</p>
					<p className="mt-4 text-sm text-gray-600">A confirmation email has been sent to {email}</p>
					<div className="mt-6 flex gap-3 justify-center">
						<button onClick={() => navigate('/')} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Go Home</button>
						<button onClick={resetForm} className="px-4 py-2 border rounded hover:bg-gray-50">Book Another</button>
					</div>
				</motion.div>
			)}
		</div>
	);
};

export default GymFacilities;