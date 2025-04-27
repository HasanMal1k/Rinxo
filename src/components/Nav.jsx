import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Check if the current path matches the link to apply active styling
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="w-screen flex items-center justify-center bg-black">
      <div className="max-w-7xl w-full mx-auto py-8 px-4 flex items-center justify-between">
        <div>
          <Link to="/">
            <img src="./rinxo_logo.svg" alt="Rinxo" />
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link 
            to="/" 
            className={`text-white hidden lg:flex hover:-translate-y-[3px] transition-all delay-100 hover:font-medium py-4 px-2 ${isActive('/') ? 'text-yellow-300 font-medium' : 'hover:text-yellow-300'}`}
          >
            Homepage
          </Link>
          <Link 
            to="/dashboard" 
            className={`text-white hidden lg:flex hover:-translate-y-[3px] transition-all delay-100 hover:font-medium py-4 px-2 ${isActive('/dashboard') ? 'text-yellow-300 font-medium' : 'hover:text-yellow-300'}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/portfolio" 
            className={`text-white hidden lg:flex hover:-translate-y-[3px] transition-all delay-100 hover:font-medium py-4 px-2 ${isActive('/portfolio') ? 'text-yellow-300 font-medium' : 'hover:text-yellow-300'}`}
          >
            Portfolio
          </Link>
          <Link 
            to="/trading" 
            className={`text-white hidden lg:flex hover:-translate-y-[3px] transition-all delay-100 hover:font-medium py-4 px-2 ${isActive('/trading') ? 'text-yellow-300 font-medium' : 'hover:text-yellow-300'}`}
          >
            Trading
          </Link>
          <a href="#" className="text-white hidden lg:flex hover:-translate-y-[3px] hover:text-yellow-300 transition-all delay-100 hover:font-medium py-4 px-2">
            Buy Crypto
          </a>
          <a href="#" className="text-white hidden lg:flex hover:-translate-y-[3px] hover:text-yellow-300 transition-all delay-100 hover:font-medium py-4 px-2">
            Sell Crypto
          </a>
          <a href="#" className="text-white hidden lg:flex hover:-translate-y-[3px] hover:text-yellow-300 transition-all delay-100 hover:font-medium py-4 px-2">
            Markets
          </a>
          <a href="#" className="text-white hidden lg:flex hover:-translate-y-[3px] hover:text-yellow-300 transition-all delay-100 hover:font-medium py-4 px-2">
            Blog
          </a>
          <button onClick={toggleMobileMenu}>
            {mobileMenuOpen ? (
              <X className="lg:hidden h-8" fill="white" />
            ) : (
              <svg className='lg:hidden h-8' fill='white' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
                <path d="M 5 8 A 2.0002 2.0002 0 1 0 5 12 L 45 12 A 2.0002 2.0002 0 1 0 45 8 L 5 8 z M 5 23 A 2.0002 2.0002 0 1 0 5 27 L 45 27 A 2.0002 2.0002 0 1 0 45 23 L 5 23 z M 5 38 A 2.0002 2.0002 0 1 0 5 42 L 45 42 A 2.0002 2.0002 0 1 0 45 38 L 5 38 z"></path>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[88px] z-50 bg-black lg:hidden">
          <div className="px-4 py-2 space-y-2">
            <Link 
              to="/" 
              className={`block w-full py-3 px-4 text-white ${isActive('/') ? 'bg-gray-800 text-yellow-300' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Homepage
            </Link>
            <Link 
              to="/dashboard" 
              className={`block w-full py-3 px-4 text-white ${isActive('/dashboard') ? 'bg-gray-800 text-yellow-300' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/portfolio" 
              className={`block w-full py-3 px-4 text-white ${isActive('/portfolio') ? 'bg-gray-800 text-yellow-300' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Portfolio
            </Link>
            <Link 
              to="/trading" 
              className={`block w-full py-3 px-4 text-white ${isActive('/trading') ? 'bg-gray-800 text-yellow-300' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Trading
            </Link>
            <a href="#" className="block w-full py-3 px-4 text-white">
              Buy Crypto
            </a>
            <a href="#" className="block w-full py-3 px-4 text-white">
              Sell Crypto
            </a>
            <a href="#" className="block w-full py-3 px-4 text-white">
              Markets
            </a>
            <a href="#" className="block w-full py-3 px-4 text-white">
              Blog
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Nav;