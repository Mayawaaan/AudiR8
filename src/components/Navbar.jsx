import React, { useRef } from 'react';
import { featuresData } from '../data/featuresData';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Navbar = () => {
  const headerRef = useRef();

  useGSAP(() => {
    gsap.from(headerRef.current, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    });
  });

  return (
    <header ref={headerRef} className='bg-black/30 flex justify-between items-center px-10 py-2 z-10 absolute w-full transition-colors duration-500'>
        <img className='w-25' src="./audiLogo.png" alt="" />
        <ul className='flex gap-5 font-semibold font-serif text-lg tracking-wide'>
            <li><a className='text-white hover:text-white/50 tracking-tight transition duration- cursor-pointer' href="#home">Model</a></li>
            {featuresData.map((feature) => (
              <li key={feature.id}>
                <a className='text-white hover:text-white/50 tracking-tight transition duration- cursor-pointer' href={`#${feature.id}`}>{feature.navTitle}</a>
              </li>
            ))}
            <li><a className='text-white hover:text-white/50 tracking-tight transition duration- cursor-pointer'  href="#story">Story</a></li>
        </ul>
        <button className='text-white border px-2 py-1 rounded-lg hover:text-white/50 transition duration-300 cursor-pointer'>Book Now</button>
    </header>
  )
}

export default Navbar