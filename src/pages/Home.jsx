import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'

const Home = () => {
  return (
    <>
      <Hero />
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <LatestCollection />
        <BestSeller />
        <OurPolicy />
        <NewsletterBox />
      </div>
    </>
  )
}

export default Home
