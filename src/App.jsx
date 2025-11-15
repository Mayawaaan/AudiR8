import React, { useState, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';
import AudiModel from './components/AudiModel';
import HeroText from './components/HeroText';
import FeatureSection from './components/FeatureSection';
import Footer from './components/Footer';
import StorySection from './components/StorySection';
import { featuresData } from './data/featuresData';
import ScrollToTopButton from './components/ScrollToTopButton';

const App = () => {
  const [carColor, setCarColor] = useState('#1a1a2e'); 

  useEffect(() => {
    // This effect runs once after the initial render.
    const preloader = document.getElementById('preloader');
    if (preloader) {
      // Add a delay before hiding to ensure content is ready
      setTimeout(() => {
        preloader.classList.add('hidden');
      }, 500); // 500ms delay
    }
  }, []);

  return (
    <main className='bg-black/90 text-white'>
      <section id="home" className="relative h-screen w-screen">
        <Navbar />
        <HeroText />
        <AudiModel carColor={carColor} setCarColor={setCarColor} />
      </section>

      {featuresData.map((feature) => (
        <FeatureSection
          key={feature.id}
          id={feature.id}
          title={feature.title}
          description={feature.description}
          imageUrl={feature.imageUrl}
          imageAlt={feature.imageAlt}
          reverse={feature.reverse}
        />
      ))}
      
      <div ref={useRef(null)}>
        <StorySection />
      </div>
      <div ref={useRef(null)}>
        <Footer />
      </div>

      <ScrollToTopButton />
    </main>
  );
};

export default App;
