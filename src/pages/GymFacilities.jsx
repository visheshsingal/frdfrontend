// src/pages/GymFacilities.jsx
import React, { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';

const GymFacilities = () => {
	const { token, backendUrl } = useContext(ShopContext);
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

	const gyms = useMemo(() => Array.from({ length: 100 }, (_, i) => `Forever Fitness Branch #${i + 1}`), []);

	const [step, setStep] = useState(1);
	const [selectedGym, setSelectedGym] = useState('');
	const [selectedFacility, setSelectedFacility] = useState('');
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async () => {
		if (!token) {
			navigate('/login');
			return;
		}

		if (!selectedGym || !selectedFacility || !name || !email || !phone) {
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
				body: JSON.stringify({ gym: selectedGym, facility: selectedFacility, name, email, phone }),
			});

			const data = await res.json();

			if (res.ok && data.success) {
				setStep(4);
			} else {
				toast.error(data.message || 'Booking failed');
			}
		} catch (error) {
			toast.error('Network error. Please check your connection.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="px-6 md:px-12 py-16 bg-white min-h-screen">
			<div className="text-center mb-12">
				<Title text1="GYM" text2="FACILITIES" />
				<p className="w-full md:w-2/3 lg:w-1/2 mx-auto text-sm text-[#052659]/80 mt-3">
					Select a gym branch, choose a facility, and book your session with your details.
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

			{/* Step 3: Enter Details */}
			{step === 3 && (
				<div className="max-w-2xl mx-auto">
					<h3 className="text-[#052659] font-semibold text-lg mb-2">Your Details</h3>
					<p className="text-sm text-gray-600 mb-4">Gym: {selectedGym} • Facility: {selectedFacility}</p>
					<div className="grid grid-cols-1 gap-4">
						<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="p-3 border rounded bg-blue-50 border-blue-100" />
						<input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="p-3 border rounded bg-blue-50 border-blue-100" />
						<input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="p-3 border rounded bg-blue-50 border-blue-100" />
					</div>
					<div className="mt-6 flex justify-between">
						<button onClick={() => setStep(2)} className="px-4 py-2 border rounded">Back</button>
						<button onClick={handleSubmit} disabled={isSubmitting} className={`px-4 py-2 rounded text-white ${isSubmitting ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}>{isSubmitting ? 'Booking...' : 'Book'}</button>
					</div>
				</div>
			)}

			{/* Step 4: Success */}
			{step === 4 && (
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto text-center p-8 border rounded bg-blue-50 border-blue-100">
					<h3 className="text-[#052659] font-bold text-xl">Successfully Booked!</h3>
					<p className="mt-2 text-sm text-gray-700">Your booking for <span className="font-semibold">{selectedFacility}</span> at <span className="font-semibold">{selectedGym}</span> is confirmed.</p>
					<div className="mt-6 flex gap-3 justify-center">
						<button onClick={() => navigate('/')} className="px-4 py-2 bg-blue-600 text-white rounded">Go Home</button>
						<button onClick={() => { setStep(1); setSelectedGym(''); setSelectedFacility(''); setName(''); setEmail(''); setPhone(''); }} className="px-4 py-2 border rounded">Book Another</button>
					</div>
				</motion.div>
			)}
		</div>
	);
};

export default GymFacilities;