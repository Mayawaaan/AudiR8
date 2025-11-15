import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const HeroText = () => {
  const container = useRef();

  useGSAP(() => {
    gsap.from(container.current.children, {
      opacity: 0,
      y: 20,
      duration: 1,
      stagger: 0.2,
      delay: 0.5,
      ease: 'power3.out',
    });
  }, { scope: container });

  return (
    <div ref={container} className="absolute top-1/3 w-1/2 text-center left-1/6 z-10 text-white max-w-md">
      <h1 className="text-6xl font-bold font-serif tracking-wider">
        Audi R8
      </h1>
      <p className="mt-4 text-lg text-white/80">
        Experience the pinnacle of performance and design. The Audi R8 combines breathtaking speed with iconic aesthetics for an unparalleled driving sensation.
      </p>
      <button className="mt-8 bg-white text-black font-semibold px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-300">
        Book a Test Ride
      </button>
    </div>
  );
};

export default HeroText;