import React from 'react';

const StepCard = ({ number, title, description, img }) => (
  <div className="flex flex-col items-center p-8 rounded-xl hover:shadow-lg transition-all duration-300 w-full max-w-xs mx-auto group">
    <div className="w-48 h-48 mb-8 relative">
      <div className="absolute inset-0 bg-blue-50 rounded-full group-hover:scale-105 transition-transform duration-300" />
      <img
        src={img}
        alt={`Step ${number} illustration`}
        className="w-full h-full object-contain p-4 relative z-10 transform group-hover:scale-110 transition-transform duration-300"
      />
    </div>
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm mb-4">
      {number}
    </div>
    <h3 className="font-bold text-xl mb-3 text-gray-800">
      {title}
    </h3>
    <p className="text-gray-500 text-center text-sm leading-relaxed">
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
      description: "Get started with our secure and user-friendly platform in just a few clicks."
    },
    {
      number: 2,
      title: "Connect Wallet",
      img: './instruction-2.png',
      description: "Link your preferred crypto wallet securely to access all trading features."
    },
    {
      number: 3,
      title: "Start Trading",
      img: './instruction-3.png',
      description: "Access global markets and start trading with our powerful yet simple interface."
    },
    {
      number: 4,
      title: "Earn Money",
      img: './instruction-4.png',
      description: "Generate profits through smart trading and instant withdrawals to your wallet."
    }
  ];

  return (
    <section className="bg-gray-50 py-20 px-4 w-full">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">
          How It Works
        </h2>
        <p className="text-gray-500 text-center mb-16 max-w-2xl mx-auto">
          Get started with crypto trading in four simple steps
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <StepCard
              key={step.number}
              number={step.number}
              title={step.title}
              img={step.img}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;