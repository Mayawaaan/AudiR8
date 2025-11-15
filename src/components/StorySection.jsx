import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const StorySection = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.from(sectionRef.current.children, {
      opacity: 0,
      y: 50,
      duration: 1,
      stagger: 0.3,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });
  }, { scope: sectionRef });

  return (
    <section id="story" className="min-h-screen flex items-center justify-center py-24 px-10 bg-gray-900 text-white border-t border-gray-800">
      <div ref={sectionRef} className="max-w-3xl mx-auto text-center">
        <h2 className="text-5xl font-bold font-serif mb-8">The Legacy of the R8</h2>
        <div className="space-y-6 text-xl text-white/70 leading-relaxed">
          <p>
            Born on the racetrack, the Audi R8 brought motorsport technology to the streets. It began as a bold concept, a vision to create a supercar that was not only ferociously fast but also perfectly suited for everyday driving. The Le Mans quattro concept car of 2003 was the spark, a stunning preview of what was to come.
          </p>
          <p>
            When the first generation debuted, its mid-engine layout and revolutionary quattro all-wheel drive set a new benchmark in the supercar world. It was a machine that offered breathtaking performance with an unexpected level of civility and control, changing perceptions of what a high-performance vehicle could be.
          </p>
          <p>
            Over the years, the R8 has evolved, each iteration refining its iconic design and pushing the boundaries of engineering. The V10 engine became its beating heart, its roar a symphony of power. Today, the R8 isn't just a car; it's a statement of progress, a testament to Audi's relentless pursuit of 'Vorsprung durch Technik'—Advancement through Technology.
          </p>
        </div>
      </div>
    </section>
  );
};

export default StorySection;