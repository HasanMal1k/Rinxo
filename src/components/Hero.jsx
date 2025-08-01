import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <div className="bg-gradient-to-b from-black to-gray-900 w-screen flex items-center justify-center overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-yellow-400/20 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 lg:py-32 flex flex-col lg:flex-row gap-12 lg:gap-0 relative z-10">
        {/* Text Content */}
        <div className="flex flex-col gap-6 lg:gap-8 w-full lg:w-1/2">
          <div className="inline-flex items-center px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-700 w-fit">
            <span className="text-yellow-300 font-medium text-sm">The future of crypto trading</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            Buy & Sell <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">Digital Assets</span> Securely
          </h1>
          
          <div className="text-xl md:text-2xl text-gray-300 max-w-lg">
            Trade cryptocurrencies with confidence on our secure, user-friendly platform with competitive fees.
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link 
              to="/login" 
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 py-4 px-8 text-lg font-semibold rounded-lg transition-all text-gray-800 shadow-lg shadow-yellow-500/20 flex items-center justify-center min-w-[200px]"
            >
              Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              to="/markets" 
              className="bg-transparent border border-gray-600 hover:border-gray-400 py-4 px-8 text-lg font-semibold rounded-lg transition-all text-white hover:bg-gray-800/50 flex items-center justify-center min-w-[160px]"
            >
              View Markets
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 md:mt-8">
            <div className="p-4 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700/50">
              <div className="text-3xl font-bold text-white">2M+</div>
              <div className="text-gray-400 text-sm">Users Worldwide</div>
            </div>
            <div className="p-4 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700/50">
              <div className="text-3xl font-bold text-white">100+</div>
              <div className="text-gray-400 text-sm">Cryptocurrencies</div>
            </div>
            <div className="p-4 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700/50 sm:col-span-1 col-span-2">
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-gray-400 text-sm">Support</div>
            </div>
          </div>
        </div>

        {/* Image with effect */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end items-center relative">
          <div className="absolute inset-0 bg-blue-500/10 rounded-full filter blur-3xl transform translate-x-10 translate-y-10"></div>
          <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
            <img 
              src="/hero-banner.png" 
              alt="Digital Assets Banner"
              className="w-full max-w-lg lg:max-w-none h-auto object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
