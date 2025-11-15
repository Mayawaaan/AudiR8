import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 px-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div>
          <p>&copy; {new Date().getFullYear()} Audi Automotive. All rights reserved.</p>
          <p className="text-sm text-white/50">A recreation for demonstration purposes.</p>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white/70">Privacy Policy</a>
          <a href="#" className="hover:text-white/70">Terms of Service</a>
          <a href="#" className="hover:text-white/70">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;