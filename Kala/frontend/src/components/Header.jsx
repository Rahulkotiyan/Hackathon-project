import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Header = () => {

    const navigate = useNavigate();

    const userInfo = JSON.parse(localStorage.getItem('userInfo'))

    const logoutHandler=()=>{
        localStorage.removeItem('userInfo');
        navigate('/login');
    }

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          Kala🎨
        </Link>
        <div className="hidden md:flex space-x-6">
          <Link
            to="/"
            className="text-gray-600 hover:text-amber-600 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/marketplace"
            className="text-gray-600 hover:text-amber-600 transition-colors"
          >
            Marketplace
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {userInfo ? (
            <>
              <Link
                to="/dashboard"
                className="bg-amber-600 text-white px-4 py-2 rounded-full hover:bg-amber-700 transition-transform transform hover:scale-105"
              >
                Dashboard
              </Link>
              <button
                onClick={logoutHandler}
                className="text-gray-600 hover:text-amber-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-amber-600 text-white px-4 py-2 rounded-full hover:bg-amber-700 transition-transform transform hover:scale-105"
            >
              Artist Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header