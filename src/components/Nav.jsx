import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogIn, LogOut } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://tyqxkphkcdmoznkhyuxm.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5cXhrcGhrY2Rtb3pua2h5dXhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4NjMwNTQsImV4cCI6MjA1NTQzOTA1NH0.kwA3f8Qs2pVSj2CSN9pq0Ih1fI4cUDyah_18BPSmIa0";
const supabase = createClient(supabaseUrl, supabaseKey);

function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check login status when component mounts
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setIsLoggedIn(true);
        setUserEmail(user.email || '');
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        setIsLoggedIn(false);
        setUserEmail('');
        localStorage.removeItem('user');
      }
    };

    checkUser();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setIsLoggedIn(true);
        setUserEmail(session?.user?.email || '');
        localStorage.setItem('user', JSON.stringify(session?.user));
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setUserEmail('');
        localStorage.removeItem('user');
      }
    });

    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [location]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Check if the current path matches the link to apply active styling
  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Navigate to home page
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
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
          {isLoggedIn && (
            <>
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
            </>
          )}
          <Link 
            to="/trading" 
            className={`text-white hidden lg:flex hover:-translate-y-[3px] transition-all delay-100 hover:font-medium py-4 px-2 ${isActive('/trading') ? 'text-yellow-300 font-medium' : 'hover:text-yellow-300'}`}
          >
            Trading
          </Link>
          <Link 
            to="/markets" 
            className={`text-white hidden lg:flex hover:-translate-y-[3px] transition-all delay-100 hover:font-medium py-4 px-2 ${isActive('/markets') ? 'text-yellow-300 font-medium' : 'hover:text-yellow-300'}`}
          >
            Markets
          </Link>
          <Link 
            to="/blog" 
            className={`text-white hidden lg:flex hover:-translate-y-[3px] transition-all delay-100 hover:font-medium py-4 px-2 ${isActive('/blog') ? 'text-yellow-300 font-medium' : 'hover:text-yellow-300'}`}
          >
            Blog
          </Link>
          
          {/* Auth Links */}
          <div className="hidden lg:flex items-center ml-4 space-x-2">
            {!isLoggedIn ? (
              <>
                <Link 
                  to="/login" 
                  className={`flex items-center px-3 py-2 rounded-lg ${isActive('/login') ? 'bg-gray-800 text-yellow-300' : 'text-white hover:bg-gray-800 transition-colors'}`}
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium rounded-lg transition-colors"
                >
                  <User className="h-4 w-4 mr-1" />
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="text-white text-sm mr-2">
                  {userEmail}
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </div>
            )}
          </div>
          
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
            {isLoggedIn && (
              <div className="border-b border-gray-800 pb-4 mb-4 text-center">
                <p className="text-white text-sm">{userEmail}</p>
              </div>
            )}
            
            <Link 
              to="/" 
              className={`block w-full py-3 px-4 text-white ${isActive('/') ? 'bg-gray-800 text-yellow-300' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Homepage
            </Link>
            {isLoggedIn && (
              <>
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
              </>
            )}
            <Link 
              to="/trading" 
              className={`block w-full py-3 px-4 text-white ${isActive('/trading') ? 'bg-gray-800 text-yellow-300' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Trading
            </Link>
    
            <Link 
              to="/markets" 
              className={`block w-full py-3 px-4 text-white ${isActive('/markets') ? 'bg-gray-800 text-yellow-300' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Markets
            </Link>
    
            <Link 
              to="/blog" 
              className={`block w-full py-3 px-4 text-white ${isActive('/blog') ? 'bg-gray-800 text-yellow-300' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            
            {/* Mobile Auth Links */}
            <div className="border-t border-gray-800 my-2 pt-2">
              {!isLoggedIn ? (
                <>
                  <Link 
                    to="/login" 
                    className={`flex items-center w-full py-3 px-4 ${isActive('/login') ? 'bg-gray-800 text-yellow-300' : 'text-white'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogIn className="h-5 w-5 mr-2" />
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className={`flex items-center w-full py-3 px-4 bg-yellow-500 text-gray-900 mt-2 rounded`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5 mr-2" />
                    Sign Up
                  </Link>
                </>
              ) : (
                <button 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full py-3 px-4 bg-red-500 text-white rounded"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Nav;