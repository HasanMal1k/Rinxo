import React from 'react';

const FeatureBlock = ({ title, description }) => (
  <div className="mb-8 last:mb-0">
    <h3 className="text-xl font-semibold mb-3 text-gray-800">
      {title}
    </h3>
    <p className="text-gray-600 leading-relaxed">
      {description}
    </p>
  </div>
);

function WhatIsRinxo() {
  const features = [
    {
      title: "View real-time cryptocurrency prices",
      description: "Experience a variety of trading on Bitcost. You can use various types of coin transactions such as Spot Trade, Futures Trade, P2P, Staking, Mining, and margin."
    },
    {
      title: "Buy and sell BTC, ETH, XRP, OKB, Etc...",
      description: "Experience a variety of trading on Bitcost. You can use various types of coin transactions such as Spot Trade, Futures Trade, P2P, Staking, Mining, and margin."
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Image Section */}
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/10 rounded-3xl transform -rotate-6"></div>
              <img 
                src="./laptop.png" 
                alt="Rinxo Trading Platform" 
                className="relative z-10 w-full h-auto rounded-2xl shadow-lg"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full lg:w-1/2">
            <div className="space-y-6">
              {/* Main Heading */}
              <div>
                <h2 className="text-4xl font-bold mb-4 text-gray-900">
                  What is Rinxo
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Experience a variety of trading on Bitcost. You can use various types of coin transactions such as Spot Trade, Futures Trade, P2P, Staking, Mining, and margin.
                </p>
              </div>

              {/* Features */}
              <div className="mt-8 space-y-8">
                {features.map((feature, index) => (
                  <FeatureBlock
                    key={index}
                    title={feature.title}
                    description={feature.description}
                  />
                ))}
              </div>

              {/* CTA Button */}
              <button className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                Start Trading Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhatIsRinxo;