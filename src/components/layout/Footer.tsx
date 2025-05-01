// components/layout/Footer.tsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-400 py-8 mt-auto">
      <div className="container mx-auto px-4 text-center text-sm">
        © {new Date().getFullYear()} PrimeDrive. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;