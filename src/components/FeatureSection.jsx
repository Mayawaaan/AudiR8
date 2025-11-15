import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FeatureSection = ({ id, title, description, imageUrl, imageAlt, reverse = false }) => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });

    tl.from(sectionRef.current, { opacity: 0, duration: 1 })
      .from(sectionRef.current.querySelectorAll('h2, p'), {
        opacity: 0,
        y: 20,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power3.out'
      }, "-=0.5")
      .from(sectionRef.current.querySelector('.image-container'), {
        scale: 1.1,
        duration: 1.2,
        ease: 'power3.out'
      }, "<");
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id={id} className="bg-black border-t border-gray-800">
      <div className={`flex flex-col md:flex-row items-center w-full min-h-screen ${reverse ? 'md:flex-row-reverse' : ''}`}>
        <div className="md:w-1/2 p-12 md:p-24 flex flex-col justify-center min-h-[50vh]">
          <h2 className="text-5xl font-bold font-serif mb-6">{title}</h2>
          <p className="text-xl text-white/70 leading-relaxed">{description}</p>
        </div>
        <div className="md:w-1/2 h-[50vh] md:h-auto flex items-center justify-center p-8">
          <div className="w-full h-full max-w-2xl max-h-[70vh] overflow-hidden rounded-lg shadow-2xl image-container">
            <img src={imageUrl} alt={imageAlt} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;