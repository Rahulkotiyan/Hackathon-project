import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-6 py-8 text-center">
        <p className="text-lg font-semibold">Kala</p>
        <p className="mt-2 text-gray-400">
          Preserving Heritage,Empowering Artists
        </p>
        <div className="mt-4">
          <a href="#" className="text-gray-400 hover:text-white mx-2">
            About Us
          </a>
          <a href="#" className="text-gray-400 hover:text-white mx-2">
            Contact
          </a>
          <a href="#" className="text-gray-400 hover:text-white mx-2">
            FAQ
          </a>
        </div>
        <p className='text-sm text-gray-500 mt-6'>
          &copy; {new Date().getFullYear()} KalaConnect. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer