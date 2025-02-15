function Hero() {
  return (
    <div className="bg-black w-screen flex items-center justify-center">
    <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 lg:py-32 flex flex-col lg:flex-row gap-8 lg:gap-0 ">
    {/* Text Content */}
    <div className="flex flex-col gap-6 lg:gap-8 w-full lg:w-1/2">
      <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
        Buy & Sell Digital Assets
      </div>
      <div className="text-xl md:text-2xl text-gray-100 max-w-5xl">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolores dolore sit aut quam quas exercitationem autem! Quasi provident alias inventore.
      </div>
      <div className="mt-2">
        <button className="w-full sm:w-auto bg-yellow-300 py-3 md:py-4 px-6 md:px-8 text-lg font-semibold rounded-lg hover:bg-yellow-400 transition-colors text-gray-700">
          Get Started Now
        </button>
      </div>
    </div>

    {/* Image */}
    <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-8 lg:mt-0">
      <img 
        src="/hero-banner.png" 
        alt="Digital Assets Banner"
        className="w-full max-w-lg lg:max-w-none h-auto object-contain"
      />
    </div>
  </div>
  </div>
  )
}

export default Hero