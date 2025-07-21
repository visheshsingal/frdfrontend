import React from 'react'
import Title from '../components/Title'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div className="text-[#052659] bg-white">

      <div className="text-2xl text-center pt-8 border-t border-gray-200">
        <Title text1="ABOUT" text2="US" />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16 px-4">
        <img
          className="w-full md:max-w-[450px] rounded shadow"
          src="https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg"
          alt="Gym Supplements"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            FRD Nutrition was founded with a vision to empower fitness enthusiasts and athletes by providing premium quality gym supplements. 
            Our goal is simple — to support your performance, strength, and recovery with products you can trust.
          </p>
          <p>
            We partner with trusted manufacturers to ensure every product meets the highest standards. Whether you're training for strength, endurance, or overall health, our curated range of supplements helps you push beyond limits.
          </p>
          <b className="text-[#052659]">Our Mission</b>
          <p>
            At FRD Nutrition, we are dedicated to delivering quality, transparency, and excellence. Our mission is to fuel your journey with the best products and seamless service, every step of the way.
          </p>
        </div>
      </div>

      <div className="text-xl py-4">
        <Title text1="WHY" text2="CHOOSE US" />
      </div>

      <div className="flex flex-col md:flex-row text-sm mb-20 px-4">
        <div className="border px-8 md:px-16 py-10 flex flex-col gap-4 rounded hover:shadow-md transition">
          <b>Premium Quality</b>
          <p className="text-gray-600">
            Our supplements are tested and certified for purity, potency, and safety — so you get nothing but the best.
          </p>
        </div>
        <div className="border px-8 md:px-16 py-10 flex flex-col gap-4 rounded hover:shadow-md transition">
          <b>Convenient Shopping</b>
          <p className="text-gray-600">
            Easy-to-use website, fast checkout, and quick delivery — making your supplement shopping hassle-free.
          </p>
        </div>
        <div className="border px-8 md:px-16 py-10 flex flex-col gap-4 rounded hover:shadow-md transition">
          <b>Expert Support</b>
          <p className="text-gray-600">
            Our dedicated team is ready to guide you with product queries, orders, and expert advice whenever you need.
          </p>
        </div>
      </div>

      <NewsletterBox />

    </div>
  )
}

export default About
