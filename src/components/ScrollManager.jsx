import { useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollManager = ({ section, onSectionChange }) => {
  const main = document.getElementById('main-container');

  useGSAP(() => {
    if (!main) return;

    const sections = document.querySelectorAll('.scroll-section');
    
    sections.forEach((sectionEl, index) => {
      ScrollTrigger.create({
        trigger: sectionEl,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => onSectionChange(index),
        onEnterBack: () => onSectionChange(index),
      });
    });
  }, { dependencies: [main, onSectionChange] });

  useEffect(() => {
    // Any additional setup or cleanup can go here
  }, [section]);

  return null;
};

export default ScrollManager;