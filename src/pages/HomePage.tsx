import React from 'react';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import Features from '../components/Features';
import Newsletter from '../components/Newsletter';

const HomePage = () => {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <Features />
      <Newsletter />
    </>
  );
};

export default HomePage;