import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Eye, EyeOff, ArrowRight, ChevronLeft, ChevronRight, Check, ArrowUpRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const supabaseUrl = "https://tyqxkphkcdmoznkhyuxm.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5cXhrcGhrY2Rtb3pua2h5dXhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4NjMwNTQsImV4cCI6MjA1NTQzOTA1NH0.kwA3f8Qs2pVSj2CSN9pq0Ih1fI4cUDyah_18BPSmIa0";
const supabase = createClient(supabaseUrl, supabaseKey);

const AuthComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine initial state based on route
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Background gradient animation
  const [gradientPosition, setGradientPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Update login/signup state based on current route
    setIsLogin(location.pathname === '/login');
    
    // Reset form when route changes
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
    setSuccess(false);
    setCurrentStep(1);
    setAgreeToTerms(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setGradientPosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const gradientStyle = {
    background: `radial-gradient(circle at ${gradientPosition.x * 100}% ${gradientPosition.y * 100}%, rgba(66, 63, 255, 0.15) 0%, rgba(0, 0, 0, 0) 70%)`
  };

  const handleSignUp = async () => {
    // Validation
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    if (!agreeToTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      setLoading(false);
      setSuccess(true);
      
      // Redirect to dashboard after successful signup
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      setLoading(false);
      setSuccess(true);
      
      // Redirect to dashboard after successful login
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  const nextStep = () => {
    if (email.trim() === '') {
      setError('Please enter your email');
      return;
    }
    setError(null);
    setCurrentStep(2);
  };

  const prevStep = () => {
    setCurrentStep(1);
    setError(null);
  };

  const toggleView = () => {
    // Toggle between login and signup
    if (isLogin) {
      navigate('/signup');
    } else {
      navigate('/login');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      setError(error.message);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 relative overflow-hidden" style={gradientStyle}>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-20 w-72 h-72 bg-yellow-400/20 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-md relative z-10 shadow-xl border border-gray-700">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-6">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isLogin ? 'Welcome back!' : 'Account created!'}
            </h2>
            <p className="text-gray-300 mb-6">
              {isLogin 
                ? 'You have successfully logged in to your RINXO account.' 
                : 'Your RINXO account has been successfully created.'}
            </p>
            <button 
              onClick={() => navigate('/')}
              id='button2'
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
            > 
              Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 relative overflow-hidden" style={gradientStyle}>
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-20 w-72 h-72 bg-yellow-400/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-md relative z-10 shadow-xl border border-gray-700">
        <div className="mb-6 flex justify-center">
          <img src="./rinxo_logo.svg" alt="Rinxo" className="h-10" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2 text-center">
          {isLogin ? 'Welcome back' : 'Create your account'}
        </h2>
        <p className="text-gray-400 text-center mb-6">
          {isLogin 
            ? 'Enter your credentials to access your account' 
            : 'Start your crypto journey with RINXO'}
        </p>
        
        <div className="space-y-4">
          {/* Multi-step form for signup */}
          {!isLogin && (
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-gray-400'}`}>
                  1
                </div>
                <div className={`h-1 w-10 ${currentStep > 1 ? 'bg-yellow-500' : 'bg-gray-700'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-gray-400'}`}>
                  2
                </div>
              </div>
              <div className="text-sm text-gray-400">
                Step {currentStep} of 2
              </div>
            </div>
          )}
          
          {/* Step 1: Email */}
          {(!isLogin && currentStep === 1) || isLogin ? (
            <>
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                  placeholder="you@example.com"
                />
              </div>
              
              {!isLogin ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
                >
                  Continue <ChevronRight className="ml-2 h-5 w-5" />
                </button>
              ) : (
                <div className="space-y-1 mt-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white pr-10"
                      placeholder="••••••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  <div className="flex justify-between mt-2">
                    <a href="#" className="text-sm text-yellow-400 hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  
                  <button
                    type="button"
                    id='button1'
                    onClick={handleLogin}
                    className="w-full mt-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <>Sign In <ArrowRight className="ml-2 h-5 w-5" /></>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : null}
          
          {/* Step 2: Password and Agreement */}
          {!isLogin && currentStep === 2 && (
            <>
              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white pr-10"
                    placeholder="••••••••••••"
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                  placeholder="••••••••••••"
                />
              </div>
              
              <div className="flex items-start mt-4">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={() => setAgreeToTerms(!agreeToTerms)}
                    className="w-4 h-4 bg-gray-700 border border-gray-600 rounded focus:ring-yellow-500 focus:ring-offset-gray-800"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-300">
                    I agree to the <a href="#" className="text-yellow-400 hover:underline">Terms of Service</a> and <a href="#" className="text-yellow-400 hover:underline">Privacy Policy</a>
                  </label>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-1/3 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
                >
                  <ChevronLeft className="mr-2 h-5 w-5" /> Back
                </button>
                
                <button
                  type="button"
                  onClick={handleSignUp}
                  className="w-2/3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>Create Account <ArrowRight className="ml-2 h-5 w-5" /></>
                  )}
                </button>
              </div>
            </>
          )}
          
          {/* Error message */}
          {error && (
            <div className="bg-red-900/40 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
        </div>
        
        {/* Toggle between login and signup */}
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={toggleView}
              className="ml-2 text-yellow-400 hover:underline font-medium"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
        
        {/* Alternative login methods */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-300"
            >
              <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.0003 2C6.47731 2 2.00031 6.477 2.00031 12C2.00031 16.991 5.65731 21.128 10.4373 21.879V14.89H7.89831V12H10.4373V9.797C10.4373 7.291 11.9323 5.907 14.2153 5.907C15.3103 5.907 16.4543 6.102 16.4543 6.102V8.562H15.1913C13.9503 8.562 13.5633 9.333 13.5633 10.124V12H16.3363L15.8933 14.89H13.5633V21.879C18.3433 21.129 22.0003 16.99 22.0003 12C22.0003 6.477 17.5233 2 12.0003 2Z"></path>
              </svg>
            </button>
            
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-300"
            >
              <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 20.167 8.839 21.65C9.339 21.751 9.536 21.452 9.536 21.193C9.536 20.959 9.527 20.137 9.527 19.289C7 19.748 6.35 18.648 6.15 18.063C6.037 17.785 5.55 16.866 5.125 16.631C4.775 16.447 4.275 15.988 5.112 15.977C5.9 15.965 6.462 16.734 6.65 17.024C7.55 18.61 8.988 18.101 9.575 17.842C9.675 17.158 9.975 16.701 10.3 16.44C8.05 16.179 5.7 15.312 5.7 11.432C5.7 10.312 6.15 9.391 6.675 8.683C6.562 8.436 6.162 7.365 6.775 5.929C6.775 5.929 7.614 5.67 9.538 6.893C10.328 6.67 11.168 6.559 12 6.559C12.832 6.559 13.672 6.67 14.462 6.893C16.386 5.659 17.224 5.929 17.224 5.929C17.837 7.366 17.437 8.437 17.325 8.683C17.85 9.391 18.3 10.301 18.3 11.432C18.3 15.323 15.938 16.179 13.688 16.44C14.088 16.765 14.438 17.39 14.438 18.366C14.438 19.773 14.428 20.85 14.428 21.193C14.428 21.452 14.625 21.761 15.125 21.65C19.137 20.165 22 16.418 22 12C22 6.477 17.522 2 12 2Z"></path>
              </svg>
            </button>
            
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-300"
            >
              <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;