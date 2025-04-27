import React from 'react';
import { LineChart, BarChart, Globe, Shield } from 'lucide-react';

const FeatureBlock = ({ icon, title, description }) => (
  <div className="mb-8 last:mb-0 flex">
    <div className="mr-4 bg-blue-50 p-3 rounded-xl h-fit">
      {icon}
    </div>
    <div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

function WhatIsRinxo() {
  const features = [
    {
      icon: <LineChart className="h-6 w-6 text-blue-600" />,
      title: "Real-time cryptocurrency tracking",
      description: "Monitor live price movements, market caps, and trading volumes of thousands of cryptocurrencies in real-time with our advanced tracking system."
    },
    {
      icon: <BarChart className="h-6 w-6 text-blue-600" />,
      title: "Trade with confidence",
      description: "Buy and sell popular cryptocurrencies including Bitcoin, Ethereum, Ripple, and many more with competitive fees and lightning-fast transaction speeds."
    },
    {
      icon: <Globe className="h-6 w-6 text-blue-600" />,
      title: "Global accessibility",
      description: "Access our platform from anywhere in the world with support for multiple languages, currencies, and payment methods."
    },
    {
      icon: <Shield className="h-6 w-6 text-blue-600" />,
      title: "Enhanced security",
      description: "Rest easy knowing your assets are protected with military-grade encryption, two-factor authentication, and cold storage solutions."
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Image Section */}
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/10 rounded-3xl transform -rotate-6"></div>
              <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-yellow-400/20 rounded-full filter blur-2xl"></div>
              <div className="absolute -top-8 -left-8 w-40 h-40 bg-blue-400/20 rounded-full filter blur-2xl"></div>
              <img 
                src="./laptop.png" 
                alt="Rinxo Trading Platform" 
                className="relative z-10 w-full h-auto rounded-2xl shadow-xl"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full lg:w-1/2">
            <div className="space-y-6">
              {/* Main Heading */}
              <div>
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-700 font-medium text-sm mb-4">
                  About Our Platform
                </div>
                <h2 className="text-4xl font-bold mb-6 text-gray-900">
                  What is <span className="text-blue-600">Rinxo</span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Rinxo is a next-generation cryptocurrency trading platform designed to make digital asset trading accessible to everyone. With an intuitive interface and powerful features, we provide a seamless trading experience for both beginners and experienced traders.
                </p>
              </div>

              {/* Features */}
              <div className="mt-8 space-y-6">
                {features.map((feature, index) => (
                  <FeatureBlock
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                  />
                ))}
              </div>

              {/* CTA Button */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg shadow-blue-300/20">
                  Start Trading Now
                </button>
                <button className="bg-transparent border border-blue-300 text-blue-700 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhatIsRinxo;