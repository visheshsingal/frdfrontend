import React from 'react'
import Title from '../components/Title'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div className="text-[#052659] bg-white">

      <div className="text-center text-2xl pt-10 border-t border-gray-200">
        <Title text1="CONTACT" text2="US" />
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 px-4">
        <img
          className="w-full md:max-w-[480px] rounded shadow object-cover"
          src="https://images.pexels.com/photos/1552249/pexels-photo-1552249.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt="Gym Contact"
        />
        <div className="flex flex-col justify-center items-start gap-6 text-gray-700">
          <p className="font-semibold text-xl text-[#052659]">Our Store</p>
          <p>
            FRD Nutrient HQ <br />
            54709 Willms Station, <br />
            Suite 350, Washington, USA
          </p>
          <p>
            Tel: (415) 555-0132 <br />
            Email: support@frdnutrient.com
          </p>
          <p className="font-semibold text-xl text-[#052659]">Careers at FRD Nutrient</p>
          <p>Join our team and grow with the leaders in sports nutrition.</p>
          <button className="border border-[#052659] px-8 py-3 text-sm hover:bg-[#052659] hover:text-white transition">
            Explore Jobs
          </button>
        </div>
      </div>

      <NewsletterBox />

    </div>
  )
}

export default Contact
