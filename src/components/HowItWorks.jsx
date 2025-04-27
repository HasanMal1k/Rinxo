import React from 'react';
import { Download, Wallet, TrendingUp, DollarSign } from 'lucide-react';

const StepCard = ({ number, title, description, img, icon }) => (
  <div className="flex flex-col items-center p-8 rounded-xl hover:shadow-xl transition-all duration-300 group border border-transparent hover:border-blue-100 bg-white">
    <div className="w-48 h-48 mb-8 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full group-hover:scale-105 transition-transform duration-300" />
      <img
        src={img}
        alt={`Step ${number} illustration`}
        className="w-full h-full object-contain p-4 relative z-10 transform group-hover:scale-110 transition-transform duration-300"
      />
    </div>
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-semibold text-lg mb-6 shadow-lg shadow-blue-300/30">
      {icon}
    </div>
    <h3 className="font-bold text-xl mb-3 text-gray-800">
      {title}
    </h3>
    <p className="text-gray-500 text-center leading-relaxed">
      {description}
    </p>
  </div>
);

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: "Download",
      img: './instruction-1.png',
      icon: <Download className="h-5 w-5" />,
      description: "Get started with our secure and user-friendly platform in just a few clicks. Available on web, iOS, and Android."
    },
    {
      number: 2,
      title: "Connect Wallet",
      img: './instruction-2.png',
      icon: <Wallet className="h-5 w-5" />,
      description: "Link your preferred crypto wallet securely to access all trading features with full control of your assets."
    },
    {
      number: 3,
      title: "Start Trading",
      img: './instruction-3.png',
      icon: <TrendingUp className="h-5 w-5" />,
      description: "Access global markets and start trading with our powerful yet simple interface designed for traders of all levels."
    },
    {
      number: 4,
      title: "Earn Money",
      img: './instruction-4.png',
      icon: <DollarSign className="h-5 w-5" />,
      description: "Generate profits through smart trading and enjoy instant withdrawals to your wallet with minimal fees."
    }
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 font-medium text-sm mb-4">
            Simple Process
          </div>
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            How It Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get started with crypto trading in four simple steps designed to make your journey into digital assets smooth and profitable
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <StepCard
              key={step.number}
              number={step.number}
              title={step.title}
              img={step.img}
              icon={step.icon}
              description={step.description}
            />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-medium py-4 px-8 rounded-lg shadow-lg shadow-blue-400/20 transition-all">
            Start Your Trading Journey Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;