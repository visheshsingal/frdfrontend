import React from 'react';
import Hero from '../components/Hero';
import LatestCollection from '../components/LatestCollection';
import BestSeller from '../components/BestSeller';
import OurPolicy from '../components/OurPolicy';
import NewsletterBox from '../components/NewsletterBox';
import MediaGallery from '../components/MediaGallery';

const Home = () => {
  return (
    <div className="bg-white text-slate-800 min-h-screen">
      <Hero />
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <LatestCollection />
        <BestSeller />
  <OurPolicy />
  <MediaGallery />
  <NewsletterBox />
      </div>
    </div>
  );
};

export default Home;
