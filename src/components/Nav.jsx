import React from 'react'

function Nav() {
  return (
    
   <nav className="w-screen flex items-center justify-center bg-black">
   <div className="max-w-7xl w-full mx-auto py-8 px-4 flex items-center justify-between">
     <div>
       <img src="./rinxo_logo.svg" alt="" />
     </div>
     <div className="flex items-center gap-2">
       <a href="" className="text-white hidden lg:flex hover:-translate-y-[3px] hover:text-yellow-300 transition-all delay-100 hover:font-medium py-4 px-2">
         Homepage
       </a>
       <a href="" className="text-white hidden lg:flex hover:-translate-y-[3px] hover:text-yellow-300 transition-all delay-100 hover:font-medium py-4 px-2">
         Buy Crypto
       </a>
       <a href="" className="text-white hidden lg:flex hover:-translate-y-[3px] hover:text-yellow-300 transition-all delay-100 hover:font-medium py-4 px-2">
         Sell Crypto
       </a>
       <a href="" className="text-white hidden lg:flex hover:-translate-y-[3px] hover:text-yellow-300 transition-all delay-100 hover:font-medium py-4 px-2">
         Markets
       </a>
       <a href="" className="text-white hidden lg:flex hover:-translate-y-[3px] hover:text-yellow-300 transition-all delay-100 hover:font-medium py-4 px-2">
         Blog
       </a>
       <button >
         <svg className='lg:hidden h-8' fill='white'  xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
         <path d="M 5 8 A 2.0002 2.0002 0 1 0 5 12 L 45 12 A 2.0002 2.0002 0 1 0 45 8 L 5 8 z M 5 23 A 2.0002 2.0002 0 1 0 5 27 L 45 27 A 2.0002 2.0002 0 1 0 45 23 L 5 23 z M 5 38 A 2.0002 2.0002 0 1 0 5 42 L 45 42 A 2.0002 2.0002 0 1 0 45 38 L 5 38 z"></path>
         </svg>
       </button>
     </div>
   </div>
 </nav>

  )
}

export default Nav